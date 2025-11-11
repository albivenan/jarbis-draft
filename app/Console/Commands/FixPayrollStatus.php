<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PayrollBatch;
use App\Models\PayrollEmployee;
use Illuminate\Support\Facades\Log;

class FixPayrollStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payroll:fix-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fixes inconsistent employee statuses within finalized payroll batches.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Starting payroll status consistency check...');
        Log::info('Running payroll:fix-status command.');

        $finalizedBatches = PayrollBatch::where('status', 'finalized')->get();

        if ($finalizedBatches->isEmpty()) {
            $this->info('No finalized batches found. Nothing to fix.');
            Log::info('payroll:fix-status: No finalized batches found.');
            return 0;
        }

        $this->info(sprintf('Found %d finalized batch(es) to check.', $finalizedBatches->count()));

        foreach ($finalizedBatches as $batch) {
            $this->line('Checking Batch #' . $batch->id . ' (' . $batch->batch_code . ')...');

            $employeesToFix = $batch->employees()->where('status', 'approved')->get();

            if ($employeesToFix->isEmpty()) {
                $this->line('  -> No employees with inconsistent status found in this batch.');
                continue;
            }

            $updatedCount = 0;
            foreach ($employeesToFix as $employee) {
                $employee->update(['status' => 'finalized']);
                $updatedCount++;
            }

            $this->info(sprintf('  -> Fixed %d employee(s) status from \'approved\' to \'finalized\'.', $updatedCount));
            Log::info('payroll:fix-status: In batch ' . $batch->id . ', fixed ' . $updatedCount . ' employee statuses.');
        }

        $this->info('Payroll status consistency check finished.');
        Log::info('payroll:fix-status command finished.');
        return 0;
    }
}
