<?php

namespace App\Console\Commands;

use App\Models\Presensi;
use Illuminate\Console\Command;

class ResetPresensiData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'presensi:reset {--confirm : Confirm the reset operation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset presensi data while keeping jadwal_kerja intact';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!$this->option('confirm')) {
            $this->error('This command will delete all presensi data!');
            $this->info('Use --confirm flag to proceed: php artisan presensi:reset --confirm');
            return 1;
        }

        $this->info('Resetting presensi data...');

        // Delete all presensi records
        $deletedCount = Presensi::count();
        Presensi::truncate();

        $this->info("Successfully deleted {$deletedCount} presensi records.");
        $this->info('Jadwal kerja data remains intact.');
        
        return 0;
    }
}
