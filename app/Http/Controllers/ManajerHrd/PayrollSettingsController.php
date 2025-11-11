<?php

namespace App\Http\Controllers\ManajerHrd;

use App\Models\PayrollSetting;
use App\Models\PayrollFixedComponent; // Added
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Http\Controllers\Controller;

class PayrollSettingsController extends Controller
{
    public function index()
    {
        // Authorization Check
        $user = Auth::user();
        if (!$user || ($user->role !== 'manajer_hrd' && $user->role !== 'admin')) {
            return response()->json(['success' => false, 'message' => 'Tidak diizinkan.'], 403);
        }

        // Fetch all active scalar settings (valid_to is null or in the future)
        $settings = PayrollSetting::whereNull('valid_to')
                                ->orWhere('valid_to', '>', Carbon::now())
                                ->pluck('setting_value', 'setting_key');

        // Fetch all active fixed components
        $fixedComponents = PayrollFixedComponent::whereNull('valid_to')
                                                ->orWhere('valid_to', '>', Carbon::now())
                                                ->get();

        return response()->json([
            'success' => true,
            'data' => $settings,
            'fixedComponents' => $fixedComponents, // Added fixed components
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        // Authorization Check
        $user = Auth::user();
        if (!$user || !in_array($user->role, ['manajer_hrd', 'staf_hrd'])) {
            return response()->json(['success' => false, 'message' => 'Tidak diizinkan.'], 403);
        }

        $rules = [
            'tarif_per_jam' => 'required|numeric|min:0',
            'upah_lembur_per_jam' => 'required|numeric|min:0',
            'standar_jam_kerja' => 'required|numeric|min:0',
            'tunjangan_makan_per_hari' => 'required|numeric|min:0',
            'tunjangan_transport_per_hari' => 'required|numeric|min:0',
            'potongan_per_10_menit' => 'required|numeric|min:0',
            'periode_pembayaran' => 'required|string|in:bulanan,mingguan',
            'effective_date' => 'required|date|after_or_equal:today', // New field
            'fixed_components' => 'nullable|array', // Added validation for fixed components
            'fixed_components.*.id' => 'nullable|integer',
            'fixed_components.*.nama' => 'required|string|max:100',
            'fixed_components.*.jenis' => 'required|string|in:tunjangan,potongan',
            'fixed_components.*.tipe' => 'required|string|in:nominal,persentase',
            'fixed_components.*.jumlah' => 'required|numeric|min:0',
            'fixed_components.*.keterangan' => 'nullable|string|max:255',
        ];

        // Conditional validation for tanggal_gajian and hari_gajian_mingguan
        if ($request->input('periode_pembayaran') === 'bulanan') {
            $rules['tanggal_gajian'] = 'required|integer|min:1|max:28';
            $rules['hari_gajian_mingguan'] = 'nullable|string'; // Not required for bulanan
        } else { // mingguan
            $rules['hari_gajian_mingguan'] = 'required|string|in:senin,selasa,rabu,kamis,jumat';
            $rules['tanggal_gajian'] = 'nullable|integer'; // Not required for mingguan
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            Log::error('Payroll settings validation failed', ['errors' => $validator->errors()->toArray()]);
            return response()->json(['success' => false, 'message' => 'Data yang dikirim tidak valid.', 'errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        $effectiveDate = Carbon::parse($validatedData['effective_date']);

        Log::debug('Payroll settings update - Validated Data', $validatedData);

        // Define critical settings that require versioning
        $criticalSettings = [
            'tanggal_gajian',
            'periode_pembayaran',
            'hari_gajian_mingguan',
        ];

        DB::beginTransaction();
        try {
            // --- Update Scalar Settings ---
            foreach ($validatedData as $key => $value) {
                // Skip fixed_components as they are handled separately
                if ($key === 'fixed_components') {
                    continue;
                }

                Log::debug('Processing setting key', ['key' => $key, 'value' => $value]);
                if (in_array($key, $criticalSettings)) {
                    // Handle critical settings with versioning
                    $currentSetting = PayrollSetting::where('setting_key', $key)
                                                    ->whereNull('valid_to')
                                                    ->first();

                    if ($currentSetting && $currentSetting->setting_value !== (string)$value) {
                        // Mark current setting as no longer valid
                        $currentSetting->valid_to = $effectiveDate->copy()->subSecond(); // End one second before new one starts
                        $currentSetting->save();
                        Log::debug('Critical setting marked invalid', ['key' => $key, 'valid_to' => $currentSetting->valid_to]);

                        // Create new setting record
                        $newSetting = PayrollSetting::create([
                            'setting_key' => $key,
                            'setting_value' => (string)$value,
                            'description' => $currentSetting->description ?? '', // Preserve description
                            'valid_from' => $effectiveDate,
                            'valid_to' => null,
                        ]);
                        Log::debug('New critical setting created', ['key' => $key, 'value' => $newSetting->setting_value, 'valid_from' => $newSetting->valid_from]);
                    } elseif (!$currentSetting) {
                        // If no current setting exists, create a new one (shouldn't happen for critical settings normally)
                        $newSetting = PayrollSetting::create([
                            'setting_key' => $key,
                            'setting_value' => (string)$value,
                            'description' => '',
                            'valid_from' => $effectiveDate,
                            'valid_to' => null,
                        ]);
                        Log::debug('New critical setting created (no previous active)', ['key' => $key, 'value' => $newSetting->setting_value, 'valid_from' => $newSetting->valid_from]);
                    } else {
                        Log::debug('Critical setting value unchanged', ['key' => $key, 'value' => $value]);
                    }
                } else {
                    // Determine the actual valid_from date for non-critical settings
                    $actualValidFrom = $effectiveDate;
                    if (isset($validatedData['periode_pembayaran']) && $validatedData['periode_pembayaran'] === 'bulanan') {
                        $actualValidFrom = $effectiveDate->copy()->startOfMonth();
                    }

                    $setting = PayrollSetting::where('setting_key', $key)
                                            ->whereNull('valid_to')
                                            ->first();

                    if ($setting) {
                        $setting->setting_value = (string)$value;
                        $setting->valid_from = $actualValidFrom; // CHANGE THIS LINE
                        $setting->save();
                        Log::debug('Non-critical setting updated', ['key' => $key, 'value' => $setting->setting_value, 'valid_from' => $setting->valid_from]);
                    } else {
                        // Create new setting if no active one exists
                        $newSetting = PayrollSetting::create([
                            'setting_key' => $key,
                            'setting_value' => (string)$value,
                            'description' => '',
                            'valid_from' => $actualValidFrom, // CHANGE THIS LINE
                            'valid_to' => null,
                        ]);
                        Log::debug('New non-critical setting created', ['key' => $key, 'value' => $newSetting->setting_value, 'valid_from' => $newSetting->valid_from]);
                    }
                }
            }

            // --- Update Fixed Components ---
            $incomingFixedComponents = $validatedData['fixed_components'] ?? [];
            $existingFixedComponents = PayrollFixedComponent::whereNull('valid_to')->get()->keyBy('id');

            foreach ($incomingFixedComponents as $componentData) {
                $componentId = $componentData['id'] ?? null;
                $currentFixedComponent = $componentId ? $existingFixedComponents->get($componentId) : null;

                if ($currentFixedComponent) {
                    // Update existing component if changed
                    $hasChanged = false;
                    foreach (['nama', 'jenis', 'tipe', 'jumlah', 'keterangan'] as $field) {
                        if ($currentFixedComponent->$field != $componentData[$field]) {
                            $hasChanged = true;
                            break;
                        }
                    }

                    if ($hasChanged) {
                        // Mark old component as no longer valid
                        $currentFixedComponent->valid_to = $effectiveDate->copy()->subSecond();
                        $currentFixedComponent->save();

                        // Create new version
                        PayrollFixedComponent::create(array_merge($componentData, [
                            'valid_from' => $effectiveDate,
                            'valid_to' => null,
                        ]));
                    }
                    $existingFixedComponents->forget($componentId); // Mark as processed
                } else {
                    // Create new component
                    PayrollFixedComponent::create(array_merge($componentData, [
                        'valid_from' => $effectiveDate,
                        'valid_to' => null,
                    ]));
                }
            }

            // Mark components not in the incoming list as no longer valid (deleted)
            foreach ($existingFixedComponents as $componentToDelete) {
                $componentToDelete->valid_to = $effectiveDate->copy()->subSecond();
                $componentToDelete->save();
            }

            DB::commit();
            Log::info('Payroll settings updated by: ' . Auth::id() . ' with effective date: ' . $effectiveDate->format('Y-m-d'));

            return response()->json(['success' => true, 'message' => 'Pengaturan berhasil disimpan.']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating payroll settings', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['success' => false, 'message' => 'Gagal menyimpan pengaturan: ' . $e->getMessage()], 500);
        }
    }
}