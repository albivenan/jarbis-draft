import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RequestType, PermissionType, CrewConfig } from '../../types/index';

interface RequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestType: RequestType;
  isEditing: boolean;
  selectedPermissionType: PermissionType;
  onPermissionTypeChange: (type: PermissionType) => void;
  requestTime: string;
  onRequestTimeChange: (time: string) => void;
  overtimeDuration: { start: string; end: string };
  onOvertimeDurationChange: (duration: { start: string; end: string }) => void;
  requestReason: string;
  onRequestReasonChange: (reason: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
  crewConfig: CrewConfig;
  errors: Partial<Record<string, string>>;
}

export const RequestDialog = ({
  open,
  onOpenChange,
  requestType,
  isEditing,
  selectedPermissionType,
  onPermissionTypeChange,
  requestTime,
  onRequestTimeChange,
  overtimeDuration,
  onOvertimeDurationChange,
  requestReason,
  onRequestReasonChange,
  isLoading,
  onSubmit,
  crewConfig,
  errors
}: RequestDialogProps) => {
  const title = isEditing ? 'Edit Pengajuan' : (requestType === 'permission' ? 'Ajukan Izin' : 'Ajukan Lembur');
  const description = isEditing ? 'Perbarui detail pengajuan Anda di bawah ini.' : 'Isi form di bawah ini untuk membuat pengajuan baru. Pastikan semua data terisi dengan benar.';
  const submitText = isEditing ? 'Simpan Perubahan' : 'Kirim Pengajuan';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {requestType === 'permission' ? (
            // Form for Permission Request
            <div className="space-y-4">
              <div>
                <Label htmlFor="jenis-izin">Jenis Izin</Label>
                <Select 
                  value={selectedPermissionType} 
                  onValueChange={(value: PermissionType) => onPermissionTypeChange(value)}
                >
                  <SelectTrigger id="jenis-izin">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="izin_terlambat">Izin Terlambat</SelectItem>
                    <SelectItem value="izin_pulang_awal">Izin Pulang Awal</SelectItem>
                    <SelectItem value="izin_tidak_masuk">Izin Tidak Masuk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedPermissionType !== 'izin_tidak_masuk' && (
                <div>
                  <Label htmlFor="waktu-izin">Waktu</Label>
                  <Input
                    id="waktu-izin"
                    type="time"
                    value={requestTime}
                    onChange={(e) => onRequestTimeChange(e.target.value)}
                  />
                  {errors.requestTime && <p className="text-sm text-red-500 mt-1">{errors.requestTime}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedPermissionType === 'izin_terlambat' 
                      ? 'Waktu perkiraan kedatangan' 
                      : 'Waktu perkiraan pulang'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Form for Overtime Request
            <div className="space-y-4">
              <div>
                <Label htmlFor="jam-mulai">Jam Mulai Lembur</Label>
                <Input
                  id="jam-mulai"
                  type="time"
                  value={overtimeDuration.start}
                  onChange={(e) => onOvertimeDurationChange({ ...overtimeDuration, start: e.target.value })}
                />
                {errors.overtimeStart && <p className="text-sm text-red-500 mt-1">{errors.overtimeStart}</p>}
              </div>
              <div>
                <Label htmlFor="jam-selesai">Jam Selesai Lembur</Label>
                <Input
                  id="jam-selesai"
                  type="time"
                  value={overtimeDuration.end}
                  onChange={(e) => onOvertimeDurationChange({ ...overtimeDuration, end: e.target.value })}
                />
                {errors.overtimeEnd && <p className="text-sm text-red-500 mt-1">{errors.overtimeEnd}</p>}
              </div>
            </div>
          )}

          {/* Common Reason Textarea */}
          <div>
            <Label htmlFor="alasan">Alasan</Label>
            <Textarea
              id="alasan"
              value={requestReason}
              onChange={(e) => onRequestReasonChange(e.target.value)}
              rows={4}
              placeholder={requestType === 'permission' 
                ? "Jelaskan alasan pengajuan izin..."
                : "Jelaskan alasan pengajuan lembur dan pekerjaan yang akan diselesaikan..."}
            />
            {errors.requestReason && <p className="text-sm text-red-500 mt-1">{errors.requestReason}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              Alasan wajib diisi (minimal 10 karakter).
            </p>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              onClick={onSubmit}
              className={`flex-1 ${crewConfig.buttonPrimary} text-white`}
              disabled={isLoading}
            >
              {isLoading ? 'Menyimpan...' : submitText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
