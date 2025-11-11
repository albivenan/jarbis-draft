<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SLIP GAJI - {{ $payroll['period'] ?? '' }}</title>
    <style>
        @page { 
            margin: 5mm;
            size: A4;
        }
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            font-size: 9pt;
            line-height: 1.3;
            color: #333;
        }
        .slip-container {
            max-width: 190mm;
            margin: 0 auto;
            padding: 5mm;
        }
        /* Header */
        .header { 
            text-align: center; 
            margin-bottom: 3mm;
            padding-bottom: 2mm;
            border-bottom: 1px solid #ddd;
        }
        .header h1 { 
            margin: 0 0 1mm 0; 
            font-size: 14pt;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .header p { 
            margin: 0; 
            font-size: 9pt;
            color: #555;
        }
        
        /* Layout */
        .row { 
            display: flex; 
            margin: 0 -2mm;
            flex-wrap: wrap;
        }
        .col { 
            flex: 1; 
            padding: 0 2mm;
            min-width: 45%;
            box-sizing: border-box;
        }
        .border-box { 
            border: 1px solid #e0e0e0; 
            border-radius: 3px;
            padding: 3mm; 
            margin: 2mm 0;
            background: #fff;
        }
        
        /* Typography */
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .text-bold { font-weight: bold; }
        .text-small { font-size: 8pt; }
        .text-muted { color: #666; }
        
        /* Components */
        .amount { 
            min-width: 80px; 
            display: inline-block; 
            text-align: right;
            font-family: 'Courier New', monospace;
        }
        .section-title {
            font-weight: bold;
            background: #f5f5f5;
            padding: 2mm 3mm;
            margin: 3mm -3mm 2mm -3mm;
            border-left: 3px solid #4a6cf7;
            font-size: 9pt;
            text-transform: uppercase;
            color: #333;
        }
        
        /* Status indicators */
        .status-paid {
            color: #10b981;
            font-weight: bold;
        }
        
        /* Grid layout for attendance */
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2mm;
        }
        .grid-4 {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2mm;
            text-align: center;
        }
        
        /* Responsive adjustments */
        @media print {
            .no-print { display: none; }
            body { padding: 0; }
            .slip-container { padding: 0; border: none; }
        }
    </style>
</head>
<body>
    <div class="slip-container">
        <!-- Header -->
        <div class="header">
            @if(isset($settings['company_logo']))
                <img src="{{ $settings['company_logo'] }}" alt="Logo Perusahaan" style="height: 30px; margin-bottom: 2mm;">
            @endif
            <h1>SLIP GAJI KARYAWAN</h1>
            <p>{{ $settings['company_name'] ?? 'PT. PERUSAHAAN' }} | NPWP: {{ $settings['company_tax_number'] ?? 'XX.XXX.XXX.X-XXX.XXX' }}</p>
            <p>Periode: {{ $payroll['period'] ?? 'Bulan Tahun' }} | Status: <span class="status-paid">LUNAS</span></p>
        </div>
        
        <!-- Employee Information -->
        <div class="border-box">
            <div class="section-title">Data Karyawan</div>
            <div class="row">
                <div class="col">
                    <div class="row"><strong>NIK</strong> {{ $employee['employeeId'] ?? 'NIK' }}</div>
                    <div class="row"><strong>Nama</strong> {{ $employee['name'] ?? 'Nama Karyawan' }}</div>
                    <div class="row"><strong>Jabatan</strong> {{ $employee['position'] ?? 'Jabatan' }}</div>
                </div>
                <div class="col">
                    <div class="row"><strong>Departemen</strong> {{ $employee['department'] ?? 'Departemen' }}</div>
                    <div class="row"><strong>Status</strong> {{ $employee['status'] ?? 'Karyawan' }}</div>
                    <div class="row"><strong>Tanggal Masuk</strong> {{ $employee['joinDate'] ?? '-' }}</div>
                </div>
            </div>
        </div>
        
        <!-- Attendance Summary -->
        <div class="border-box">
            <div class="section-title">Rekap Kehadiran</div>
            <div class="grid-4" style="text-align: center;">
                <div class="grid-item">
                    <div class="text-bold">Hari Kerja</div>
                    <div>{{ $payroll['workingDays'] ?? 22 }} Hari</div>
                </div>
                <div class="grid-item">
                    <div class="text-bold">Hadir</div>
                    <div>{{ $payroll['attendance'] ?? 20 }} Hari</div>
                </div>
                <div class="grid-item">
                    <div class="text-bold">Izin/Sakit</div>
                    <div>{{ ($payroll['leaveCount'] ?? 0) + ($payroll['sickLeaveCount'] ?? 0) }} Hari</div>
                </div>
                <div class="grid-item">
                    <div class="text-bold">Terlambat</div>
                    <div>{{ $payroll['lateCount'] ?? 0 }}x</div>
                </div>
            </div>
            @if(($payroll['overtimeHours'] ?? 0) > 0)
            <div style="text-align: center; margin-top: 2mm;">
                <span class="text-bold">Lembur:</span> {{ $payroll['overtimeHours'] ?? 0 }} Jam
            </div>
            @endif
        </div>

        <!-- Salary Details -->
        <div class="row" style="margin-top: 3mm;">
            <!-- Earnings -->
            <div class="col">
                <div class="border-box" style="height: 100%;">
                    <div class="section-title">Pendapatan</div>
                    <div class="row">
                        <div>Gaji Pokok</div>
                        <div class="amount">{{ number_format($payroll['basicSalary'] ?? 0, 0, ',', '.') }}</div>
                    </div>
                    
                    @foreach(($payroll['earnings'] ?? []) as $item)
                    <div class="row">
                        <div>{{ $item['description'] }}</div>
                        <div class="amount">{{ number_format($item['amount'], 0, ',', '.') }}</div>
                    </div>
                    @endforeach
                    
                    @if(($payroll['overtimePay'] ?? 0) > 0)
                    <div class="row">
                        <div>Uang Lembur ({{ $payroll['overtimeHours'] ?? 0 }} Jam)</div>
                        <div class="amount">{{ number_format($payroll['overtimePay'] ?? 0, 0, ',', '.') }}</div>
                    </div>
                    @endif
                    
                    <div class="row" style="margin-top: 3mm; padding-top: 2mm; border-top: 1px solid #eee;">
                        <div class="text-bold">Total Pendapatan</div>
                        <div class="amount text-bold">{{ number_format($payroll['totalEarnings'] ?? 0, 0, ',', '.') }}</div>
                    </div>
                </div>
            </div>
            
            <!-- Deductions -->
            <div class="col">
                <div class="border-box" style="height: 100%;">
                    <div class="section-title">Potongan</div>
                    
                    @if(($payroll['bpjsKetenagakerjaan'] ?? 0) > 0)
                    <div class="row">
                        <div>BPJS Ketenagakerjaan (JHT 2%)</div>
                        <div class="amount">-{{ number_format($payroll['bpjsKetenagakerjaan'] ?? 0, 0, ',', '.') }}</div>
                    </div>
                    @endif
                    
                    @if(($payroll['bpjsKesehatan'] ?? 0) > 0)
                    <div class="row">
                        <div>BPJS Kesehatan (1%)</div>
                        <div class="amount">-{{ number_format($payroll['bpjsKesehatan'] ?? 0, 0, ',', '.') }}</div>
                    </div>
                    @endif
                    
                    @if(($payroll['incomeTax'] ?? 0) > 0)
                    <div class="row">
                        <div>PPh 21</div>
                        <div class="amount">-{{ number_format($payroll['incomeTax'] ?? 0, 0, ',', '.') }}</div>
                    </div>
                    @endif
                    
                    @foreach(($payroll['deductions'] ?? []) as $item)
                    <div class="row">
                        <div>{{ $item['description'] }}</div>
                        <div class="amount">-{{ number_format($item['amount'], 0, ',', '.') }}</div>
                    </div>
                    @endforeach
                    
                    <div class="row" style="margin-top: 3mm; padding-top: 2mm; border-top: 1px solid #eee;">
                        <div class="text-bold">Total Potongan</div>
                        <div class="amount text-bold">-{{ number_format($payroll['totalDeductions'] ?? 0, 0, ',', '.') }}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Take Home Pay -->
        <div class="border-box" style="margin-top: 3mm; background: #f8f9fa; border: 2px solid #e9ecef;">
            <div class="row" style="align-items: center;">
                <div>
                    <div class="text-bold" style="font-size: 10pt;">TAKE HOME PAY</div>
                    <div class="text-small" style="margin-top: 1mm;">
                        {{ $employee['bankAccount']['bankName'] ?? 'Bank' }} - 
                        {{ $employee['bankAccount']['accountNumber'] ?? 'XXXX-XXXX-XXXX' }}
                        <br>a.n. {{ $employee['bankAccount']['accountName'] ?? 'Nama Pemilik Rekening' }}
                    </div>
                </div>
                <div style="margin-left: auto; text-align: right;">
                    <div style="font-size: 16pt; font-weight: bold; color: #2c3e50;">
                        Rp {{ number_format($payroll['netSalary'] ?? 0, 0, ',', '.') }}
                    </div>
                    <div class="text-small" style="margin-top: 1mm;">
                        {{ now()->format('d F Y') }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: 5mm; text-align: center;">
            <div style="display: inline-block; width: 60%; margin: 0 auto;">
                <div style="border-top: 1px solid #000; margin-bottom: 2mm; padding-top: 2mm;">
                    {{ $settings['company_name'] ?? 'PT. PERUSAHAAN' }}
                </div>
                <div style="font-size: 8pt; color: #666; margin-bottom: 5mm;">
                    {{ $settings['company_address'] ?? 'Alamat Perusahaan' }}<br>
                    Telp: {{ $settings['company_phone'] ?? '-' }} | Email: {{ $settings['company_email'] ?? '-' }}
                </div>
                <div style="font-size: 7pt; color: #999; border-top: 1px solid #eee; padding-top: 2mm;">
                    Slip gaji ini sah dan dicetak secara otomatis oleh sistem
                    <br>Dicetak pada: {{ now()->format('d/m/Y H:i:s') }}
                </div>
            </div>
        </div>
    </div>
</body>
</html>
        </div>
    </div>
</body>
</html>
