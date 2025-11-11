<!DOCTYPE html>
<html lang="id">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Slip Gaji - {{ $payroll['employee']['name'] }} - {{ $payroll['period'] }}</title>
    <style>
        @page { margin: 0; }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            color: #333;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #4a6cf7;
            padding-bottom: 10px;
        }
        .header h1 {
            margin: 5px 0;
            color: #1e293b;
            font-size: 20px;
        }
        .header p {
            margin: 3px 0;
            color: #64748b;
        }
        .section {
            margin-bottom: 15px;
        }
        .section-title {
            background-color: #f1f5f9;
            padding: 5px 10px;
            font-weight: bold;
            border-left: 3px solid #4a6cf7;
            margin-bottom: 8px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
        }
        .info-item {
            margin-bottom: 5px;
        }
        .info-label {
            font-weight: 600;
            color: #64748b;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        th {
            background-color: #f1f5f9;
            text-align: left;
            padding: 8px;
            border: 1px solid #e2e8f0;
        }
        td {
            padding: 8px;
            border: 1px solid #e2e8f0;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .total-row {
            font-weight: bold;
            background-color: #f8fafc;
        }
        .footer {
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 11px;
            color: #64748b;
        }
        .signature {
            margin-top: 40px;
            text-align: right;
        }
        .signature p {
            margin: 30px 0 5px;
        }
        .signature-line {
            display: inline-block;
            width: 200px;
            border-top: 1px solid #333;
            margin-top: 40px;
        }
        .earnings {
            color: #10b981;
        }
        .deductions {
            color: #ef4444;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $settings['company_name'] }}</h1>
        <p>{{ $settings['company_address'] }} | Telp: {{ $settings['company_phone'] }} | Email: {{ $settings['company_email'] }}</p>
        <h2>SLIP GAJI KARYAWAN</h2>
        <p>Periode: {{ $payroll['period'] }} | Tanggal Cetak: {{ $printDate }}</p>
    </div>

    <div class="info-grid">
        <div>
            <div class="section">
                <div class="section-title">Informasi Karyawan</div>
                <div class="info-item"><span class="info-label">Nama:</span> {{ $payroll['employee']['name'] }}</div>
                <div class="info-item"><span class="info-label">Jabatan:</span> {{ $payroll['employee']['position'] }}</div>
                <div class="info-item"><span class="info-label">Departemen:</span> {{ $payroll['employee']['department'] }}</div>
                <div class="info-item"><span class="info-label">NIK:</span> {{ $payroll['employee']['employeeId'] }}</div>
            </div>
        </div>
        <div>
            <div class="section">
                <div class="section-title">Informasi Pembayaran</div>
                <div class="info-item"><span class="info-label">No. Slip:</span> {{ $payroll['slipNumber'] }}</div>
                <div class="info-item"><span class="info-label">Status:</span> 
                    @if($payroll['status'] === 'paid')
                        <span style="color: #10b981; font-weight: 600;">Dibayar</span>
                    @else
                        <span style="color: #ef4444; font-weight: 600;">Belum Dibayar</span>
                    @endif
                </div>
                <div class="info-item"><span class="info-label">Rekening:</span> {{ $payroll['employee']['bankAccount'] }}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Rincian Gaji</div>
        <table>
            <thead>
                <tr>
                    <th>Keterangan</th>
                    <th style="width: 30%;" class="text-right">Jumlah (IDR)</th>
                </tr>
            </thead>
            <tbody>
                <!-- Pendapatan -->
                <tr>
                    <td colspan="2" style="font-weight: bold; background-color: #f1f5f9;">Pendapatan</td>
                </tr>
                @foreach($payroll['earnings'] as $earning)
                <tr>
                    <td>{{ $earning['description'] }}</td>
                    <td class="text-right">{{ number_format($earning['amount'], 0, ',', '.') }}</td>
                </tr>
                @endforeach
                <tr class="total-row">
                    <td class="text-right">Total Pendapatan</td>
                    <td class="text-right">{{ number_format($payroll['totalEarnings'], 0, ',', '.') }}</td>
                </tr>
                
                <!-- Potongan -->
                <tr>
                    <td colspan="2" style="font-weight: bold; background-color: #f1f5f9;">Potongan</td>
                </tr>
                @foreach($payroll['deductions'] as $deduction)
                <tr>
                    <td>{{ $deduction['description'] }}</td>
                    <td class="text-right">-{{ number_format($deduction['amount'], 0, ',', '.') }}</td>
                </tr>
                @endforeach
                <tr class="total-row">
                    <td class="text-right">Total Potongan</td>
                    <td class="text-right">-{{ number_format($payroll['totalDeductions'], 0, ',', '.') }}</td>
                </tr>
                
                <!-- Take Home Pay -->
                <tr style="background-color: #e0f2fe; font-weight: bold; font-size: 1.1em;">
                    <td class="text-right">TAKE HOME PAY</td>
                    <td class="text-right">{{ number_format($payroll['netSalary'], 0, ',', '.') }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    @if(!empty($payroll['notes']))
    <div class="section">
        <div class="section-title">Catatan</div>
        <p>{{ $payroll['notes'] }}</p>
    </div>
    @endif

    <div class="signature">
        <div class="signature-line"></div>
        <p>Hormat Kami,<br>HRD {{ $settings['company_name'] }}</p>
    </div>

    <div class="footer">
        <p>Dokumen ini dicetak secara otomatis pada {{ $printDate }}. Dokumen ini sah tanpa tanda tangan basah.</p>
    </div>
</body>
</html>
