<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class CheckPayrollPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $action = 'view'): Response
    {
        $user = $request->user();
        
        if (!$user) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'User tidak terautentikasi'
                ], 401);
            }
            return redirect()->route('login');
        }

        // Define role permissions for payroll actions
        $permissions = [
            'view' => ['admin', 'manajer_hrd', 'staf_hrd'],
            'submit' => ['admin', 'manajer_hrd'],
            'approve' => ['admin', 'manajer_keuangan', 'staf_keuangan'],
        ];

        // Check if action is valid
        if (!isset($permissions[$action])) {
            Log::warning('Invalid payroll permission action', [
                'action' => $action,
                'user_id' => $user->id
            ]);
            abort(500, 'Invalid permission action');
        }

        // Check if user has required role
        $allowedRoles = $permissions[$action];
        $hasPermission = false;

        foreach ($allowedRoles as $role) {
            if ($user->hasRole($role)) {
                $hasPermission = true;
                break;
            }
        }

        if (!$hasPermission) {
            Log::warning('Unauthorized payroll access attempt', [
                'user_id' => $user->id,
                'user_role' => $user->role,
                'action' => $action,
                'allowed_roles' => $allowedRoles
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki akses untuk melakukan aksi ini'
                ], 403);
            }

            abort(403, 'Anda tidak memiliki akses untuk melakukan aksi ini.');
        }

        return $next($request);
    }
}
