export interface EmployeePayslipItem {
  id: number;
  period: string; // YYYY-MM
  paidAt: string; // YYYY-MM-DD
  gross: number;
  deductions: number;
  net: number;
  overtimeHours: number;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function getEmployeePayslips(months: number = 18): EmployeePayslipItem[] {
  const today = new Date();
  const list: EmployeePayslipItem[] = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const baseGross = 5_000_000; // gaji pokok dummy
    const overtime = (i % 4) * 2; // 0,2,4,6 jam
    const allowance = 500_000 + (i % 3) * 100_000; // variasi tunjangan
    const gross = baseGross + allowance + overtime * 25_000;
    const deductions = 350_000 + (i % 2) * 50_000; // BPJS/pajak dummy
    const net = gross - deductions;
    const period = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
    const paidAt = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-28`;
    list.push({
      id: i + 1,
      period,
      paidAt,
      gross,
      deductions,
      net,
      overtimeHours: overtime,
    });
  }
  return list;
}

