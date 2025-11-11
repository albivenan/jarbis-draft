import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function FilterBar({
  search,
  onSearch,
  period,
  onPeriod,
  extra,
}: {
  search?: string;
  onSearch?: (v: string) => void;
  period?: string;
  onPeriod?: (v: string) => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {onSearch && (
        <div className="w-56">
          <Input placeholder="Cari..." value={search ?? ''} onChange={(e) => onSearch?.(e.target.value)} />
        </div>
      )}
      {onPeriod && (
        <Select value={period} onValueChange={(v) => onPeriod?.(v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 hari</SelectItem>
            <SelectItem value="30d">30 hari</SelectItem>
            <SelectItem value="90d">90 hari</SelectItem>
          </SelectContent>
        </Select>
      )}
      <div className="ml-auto" />
      {extra}
    </div>
  );
}

