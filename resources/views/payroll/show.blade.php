<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Slip Gaji - {{ $payroll['period'] }}</title>
    <style>
        @page { margin: 20px; }
        body { 
            font-family: 'DejaVu Sans', sans-serif; 
            line-height: 1.6;
            color: #333;
            padding: 20px;
        }
        .container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0; color: #666; }
        .card { 
            border: 1px solid #e5e7eb; 
            border-radius: 8px; 
            margin-bottom: 20px;
            overflow: hidden;
        }
        .card-header { 
            background-color: #f9fafb; 
            padding: 15px 20px; 
            border-bottom: 1px solid #e5e7eb;
        }
        .card-title { margin: 0; font-size: 18px; }
        .card-content { padding: 20px; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .text-sm { font-size: 14px; }
        .text-muted { color: #6b7280; }
        .font-medium { font-weight: 500; }
        .text-right { text-align: right; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .border-t { border-top: 1px solid #e5e7eb; }
        .pt-4 { padding-top: 1rem; }
        .pb-4 { padding-bottom: 1rem; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px 0; text-align: left; }
        .text-lg { font-size: 1.125rem; }
        .font-bold { font-weight: 700; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header mb-6">
            <h1>SLIP GAJI KARYAWAN</h1>
            <p>Periode: {{ $payroll['period'] }}</p>
            <p>No. Slip: {{ $payroll['slipNumber'] }}</p>
            <p>Tanggal: {{ $payroll['date'] }}</p>
        </div>

        <!-- Employee Info -->
        <div class="card mb-6">
            <div class="card-header">
                <h2 class="card-title">Informasi Karyawan</h2>
            </div>
            <div class="card-content">
                <div class="grid">
                    <div>
                        <p class="font-medium">Nama</p>
                        <p class="text-muted">{{ $employee['name'] }}</p>
                    </div>
                    <div>
                        <p class="font-medium">Jabatan</p>
                        <p class="text-muted">{{ $employee['position'] }}</p>
                    </div>
                    <div class="mt-4">
                        <p class="font-medium">Departemen</p>
                        <p class="text-muted">{{ $employee['department'] }}</p>
                    </div>
                    <div class="mt-4">
                        <p class="font-medium">No. Karyawan</p>
                        <p class="text-muted">{{ $employee['employeeId'] }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Earnings -->
        <div class="card mb-6">
            <div class="card-header">
                <h2 class="card-title">Pendapatan</h2>
            </div>
            <div class="card-content">
                <table>
                    <tbody>
                        @foreach($payroll['earnings'] as $item)
                        <tr>
                            <td>{{ $item['description'] }}</td>
                            <td class="text-right">{{ number_format($item['amount'], 0, ',', '.') }}</td>
                        </tr>
                        @endforeach
                        <tr class="border-t">
                            <td class="pt-2 font-bold">Total Pendapatan</td>
                            <td class="pt-2 text-right font-bold">{{ number_format($payroll['totalEarnings'], 0, ',', '.') }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Deductions -->
        <div class="card mb-6">
            <div class="card-header">
                <h2 class="card-title">Potongan</h2>
            </div>
            <div class="card-content">
                <table>
                    <tbody>
                        @foreach($payroll['deductions'] as $item)
                        <tr>
                            <td>{{ $item['description'] }}</td>
                            <td class="text-right">{{ number_format($item['amount'], 0, ',', '.') }}</td>
                        </tr>
                        @endforeach
                        <tr class="border-t">
                            <td class="pt-2 font-bold">Total Potongan</td>
                            <td class="pt-2 text-right font-bold">{{ number_format($payroll['totalDeductions'], 0, ',', '.') }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Net Salary -->
        <div class="card mb-6">
            <div class="card-content">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold">Gaji Bersih</h3>
                    <p class="text-lg font-bold">Rp {{ number_format($payroll['netSalary'], 0, ',', '.') }}</p>
                </div>
            </div>
        </div>

        <!-- Notes -->
        @if(!empty($payroll['notes']))
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Keterangan</h2>
            </div>
            <div class="card-content">
                <p>{{ $payroll['notes'] }}</p>
            </div>
        </div>
        @endif

        <!-- Footer -->
        <div class="mt-12 text-center text-sm text-muted">
            <p>Dicetak pada: {{ date('d F Y H:i:s') }}</p>
            <p class="mt-4">PT JARBIS INDONESIA</p>
        </div>
    </div>
</body>
</html>
