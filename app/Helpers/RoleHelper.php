<?php

namespace App\Helpers;

class RoleHelper
{
    /**
     * Get role configuration
     */
    public static function getRoleConfig($role)
    {
        $roles = config('roles.roles');
        return $roles[$role] ?? null;
    }

    /**
     * Get all roles
     */
    public static function getAllRoles()
    {
        return config('roles.roles');
    }

    /**
     * Get role route
     */
    public static function getRoleRoute($role)
    {
        $config = self::getRoleConfig($role);
        return $config['route'] ?? 'under-development';
    }

    /**
     * Get role permissions
     */
    public static function getRolePermissions($role)
    {
        $config = self::getRoleConfig($role);
        return $config['permissions'] ?? [];
    }

    /**
     * Check if user has permission
     */
    public static function hasPermission($userRole, $permission)
    {
        $permissions = self::getRolePermissions($userRole);
        return in_array($permission, $permissions);
    }

    /**
     * Get role dashboard modules
     */
    public static function getDashboardModules($role)
    {
        $config = self::getRoleConfig($role);
        return $config['dashboard_modules'] ?? [];
    }

    /**
     * Get role name
     */
    public static function getRoleName($role)
    {
        $config = self::getRoleConfig($role);
        return $config['name'] ?? ucfirst(str_replace('_', ' ', $role));
    }

    /**
     * Get role description
     */
    public static function getRoleDescription($role)
    {
        $config = self::getRoleConfig($role);
        return $config['description'] ?? '';
    }

    /**
     * Check if role is staff level
     */
    public static function isStaffRole($role)
    {
        return in_array($role, ['staf_hrd', 'staf_keuangan', 'staf_ppic', 'staf_marketing', 'crew']);
    }

    /**
     * Check if role is manager level
     */
    public static function isManagerRole($role)
    {
        return str_starts_with($role, 'manajer_');
    }

    /**
     * Get department name
     */
    public static function getDepartmentName($departmentId)
    {
        $departments = config('roles.departments');
        return $departments[$departmentId] ?? 'Unknown Department';
    }

    /**
     * Get work section name
     */
    public static function getWorkSectionName($sectionId)
    {
        $sections = config('roles.work_sections');
        return $sections[$sectionId] ?? 'Unknown Section';
    }
}