import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Import RadioGroup

// CKEditor 5 Imports
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface PengumumanFormData {
    judul: string;
    konten: string;
    waktu_publikasi: string | null;
    status: 'draft' | 'published';
}

export default function BuatPengumuman() {
    const { data, setData, post, processing, errors, reset } = useForm<PengumumanFormData>({
        judul: '',
        konten: '',
        waktu_publikasi: format(new Date(), 'yyyy-MM-dd HH:mm'),
        status: 'draft',
    });

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string>(format(new Date(), 'HH:mm'));
    const [publishOption, setPublishOption] = useState<'now' | 'custom'>('now'); // New state for publish option

    React.useEffect(() => {
        if (data.status === 'published') {
            if (publishOption === 'now') {
                const now = new Date();
                setData('waktu_publikasi', format(now, 'yyyy-MM-dd HH:mm'));
            } else if (selectedDate) {
                const datePart = format(selectedDate, 'yyyy-MM-dd');
                setData('waktu_publikasi', `${datePart} ${selectedTime}`);
            }
        } else {
            setData('waktu_publikasi', null);
        }
    }, [selectedDate, selectedTime, publishOption, data.status, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('hrd.pengumuman.store'), {
            onSuccess: () => {
                toast.success('Pengumuman berhasil dibuat!');
                reset();
                setSelectedDate(new Date());
                setSelectedTime(format(new Date(), 'HH:mm'));
                setPublishOption('now'); // Reset publish option
            },
            onError: (err) => {
                toast.error('Gagal membuat pengumuman.');
                console.error(err);
            },
        });
    };

    return (
        <AuthenticatedLayout
            title="Buat Pengumuman"
            breadcrumbs={[
                { title: 'Dashboard', href: '/roles/hrd' },
                { title: 'Pengumuman', href: '/roles/hrd/pengumuman/riwayat' },
                { title: 'Buat Pengumuman', href: '/roles/hrd/pengumuman/buat' }
            ]}
        >
            <Head title="Buat Pengumuman" />

            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Formulir Pembuatan Pengumuman</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="judul">Judul Pengumuman</Label>
                            <Input
                                id="judul"
                                type="text"
                                value={data.judul}
                                onChange={(e) => setData('judul', e.target.value)}
                                required
                            />
                            {errors.judul && <p className="text-red-500 text-sm mt-1">{errors.judul}</p>}
                        </div>

                        <div>
                            <Label htmlFor="konten">Konten Pengumuman</Label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={data.konten}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setData('konten', data);
                                }}
                            />
                            {errors.konten && <p className="text-red-500 text-sm mt-1">{errors.konten}</p>}
                        </div>

                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(value: 'draft' | 'published') => {
                                    setData('status', value);
                                    if (value === 'draft') {
                                        setData('waktu_publikasi', null);
                                    } else {
                                        // If changing to published, set to current time if 'now' option is selected
                                        if (publishOption === 'now') {
                                            const now = new Date();
                                            setSelectedDate(now);
                                            setSelectedTime(format(now, 'HH:mm'));
                                        } else {
                                            // Otherwise, keep custom selected date/time
                                            setSelectedDate(new Date());
                                            setSelectedTime(format(new Date(), 'HH:mm'));
                                        }
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                        </div>

                        {data.status === 'published' && (
                            <div>
                                <Label>Opsi Publikasi</Label>
                                <RadioGroup
                                    value={publishOption}
                                    onValueChange={(value: 'now' | 'custom') => setPublishOption(value)}
                                    className="flex space-x-4 mb-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="now" id="publish-now" />
                                        <Label htmlFor="publish-now">Publikasi Sekarang</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="custom" id="publish-custom" />
                                        <Label htmlFor="publish-custom">Custom</Label>
                                    </div>
                                </RadioGroup>

                                {publishOption === 'custom' && (
                                    <div>
                                        <Label htmlFor="waktu_publikasi">Waktu Publikasi</Label>
                                        <div className="flex space-x-2">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !selectedDate && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {selectedDate ? format(selectedDate, "PPP") : <span>Pilih tanggal</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={selectedDate}
                                                        onSelect={setSelectedDate}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <Input
                                                type="time"
                                                value={selectedTime}
                                                onChange={(e) => setSelectedTime(e.target.value)}
                                                className="w-fit"
                                            />
                                        </div>
                                        {errors.waktu_publikasi && <p className="text-red-500 text-sm mt-1">{errors.waktu_publikasi}</p>}
                                    </div>
                                )}
                            </div>
                        )}

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Buat Pengumuman'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
