import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Upload, X, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type LeaveType = 'cuti' | 'izin' | 'sakit';

interface LeaveFormProps {
    editData?: any;
    onSuccess?: () => void;
}

export const LeaveForm = ({ editData, onSuccess }: LeaveFormProps) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState<string>('');
    
    const { data, setData, post, processing, errors, reset } = useForm({
        jenis_pengajuan: (editData?.jenis_pengajuan || 'cuti') as LeaveType,
        tanggal_mulai: editData?.tanggal_mulai || new Date().toISOString().split('T')[0],
        tanggal_selesai: editData?.tanggal_selesai || new Date().toISOString().split('T')[0],
        alasan: editData?.alasan || '',
        dokumen: [] as File[],
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setFileError('');
        
        // Check total files (existing + new)
        if (uploadedFiles.length + files.length > 3) {
            setFileError('Maksimal 3 file yang dapat diunggah');
            return;
        }
        
        // Check file size (max 5MB per file)
        const maxSize = 5 * 1024 * 1024; // 5MB
        const invalidFiles = files.filter(file => file.size > maxSize);
        if (invalidFiles.length > 0) {
            setFileError('Ukuran file maksimal 5MB per file');
            return;
        }
        
        // Check file type (only images and PDF)
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        const invalidTypes = files.filter(file => !allowedTypes.includes(file.type));
        if (invalidTypes.length > 0) {
            setFileError('Hanya file JPG, PNG, dan PDF yang diperbolehkan');
            return;
        }
        
        const newFiles = [...uploadedFiles, ...files];
        setUploadedFiles(newFiles);
        setData('dokumen', newFiles);
    };

    const removeFile = (index: number) => {
        const newFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(newFiles);
        setData('dokumen', newFiles);
        setFileError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('jenis_pengajuan', data.jenis_pengajuan);
        formData.append('tanggal_mulai', data.tanggal_mulai);
        formData.append('tanggal_selesai', data.tanggal_selesai);
        formData.append('alasan', data.alasan);
        
        uploadedFiles.forEach((file, index) => {
            formData.append(`dokumen[${index}]`, file);
        });
        
        if (editData) {
            formData.append('_method', 'PUT');
            post(route('leave-requests.update', editData.id), {
                data: formData,
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    setUploadedFiles([]);
                    onSuccess?.();
                }
            });
        } else {
            post(route('leave-requests.submit'), {
                data: formData,
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    setUploadedFiles([]);
                    onSuccess?.();
                }
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Jenis Izin</label>
                    <Select value={data.jenis_pengajuan} onValueChange={(v) => setData('jenis_pengajuan', v as LeaveType)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis izin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cuti">Cuti Tahunan</SelectItem>
                            <SelectItem value="izin">Izin Tidak Masuk</SelectItem>
                            <SelectItem value="sakit">Sakit</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.jenis_pengajuan && (
                        <p className="text-xs text-red-600">{errors.jenis_pengajuan}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Untuk izin terlambat/pulang awal/lembur, gunakan form di halaman Jadwal
                    </p>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Tanggal Mulai</label>
                    <Input
                        type="date"
                        value={data.tanggal_mulai}
                        onChange={(e) => setData('tanggal_mulai', e.target.value)}
                        required
                    />
                    {errors.tanggal_mulai && (
                        <p className="text-xs text-red-600">{errors.tanggal_mulai}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Tanggal Selesai</label>
                    <Input
                        type="date"
                        value={data.tanggal_selesai}
                        min={data.tanggal_mulai}
                        onChange={(e) => setData('tanggal_selesai', e.target.value)}
                        required
                    />
                    {errors.tanggal_selesai && (
                        <p className="text-xs text-red-600">{errors.tanggal_selesai}</p>
                    )}
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium">Keterangan / Alasan</label>
                    <textarea
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={data.alasan}
                        onChange={(e) => setData('alasan', e.target.value)}
                        placeholder="Jelaskan alasan pengajuan izin Anda (minimal 10 karakter)"
                        required
                        minLength={10}
                    />
                    {errors.alasan && (
                        <p className="text-xs text-red-600">{errors.alasan}</p>
                    )}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium">
                        Dokumen Pendukung (Opsional)
                        <span className="text-xs text-muted-foreground ml-2">Maksimal 3 file</span>
                    </label>
                    
                    {uploadedFiles.length < 3 && (
                        <div className="flex items-center gap-2">
                            <Input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,application/pdf"
                                onChange={handleFileChange}
                                multiple
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex items-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent transition-colors"
                            >
                                <Upload className="w-4 h-4" />
                                <span className="text-sm">Pilih File</span>
                            </label>
                            <p className="text-xs text-muted-foreground">
                                JPG, PNG, PDF (Max 5MB per file)
                            </p>
                        </div>
                    )}
                    
                    {fileError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{fileError}</AlertDescription>
                        </Alert>
                    )}
                    
                    {uploadedFiles.length > 0 && (
                        <div className="space-y-2 mt-3">
                            <p className="text-sm font-medium">File yang diunggah:</p>
                            <div className="space-y-2">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-blue-600" />
                                            <div>
                                                <p className="text-sm font-medium">{file.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {(file.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeFile(index)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                                {uploadedFiles.length} / 3 file
                            </Badge>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex justify-end gap-2">
                {editData && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            reset();
                            setUploadedFiles([]);
                            onSuccess?.();
                        }}
                    >
                        Batal
                    </Button>
                )}
                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={processing}>
                    {processing ? 'Mengirim...' : editData ? 'Perbarui Pengajuan' : 'Kirim Pengajuan'}
                </Button>
            </div>
        </form>
    );
};
