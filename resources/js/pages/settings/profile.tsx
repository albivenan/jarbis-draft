import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Transition } from '@headlessui/react';
import { FormEventHandler } from 'react';

// This is a standard, self-contained profile settings page.

export default function ProfileSettingsPage() {
    const { auth, mustVerifyEmail, status } = usePage().props as any;

    // Form for profile information
    const { data: profileData, setData: setProfileData, patch, errors: profileErrors, processing: profileProcessing, recentlySuccessful: profileRecentlySuccessful } = useForm({
        name: auth.user.name || '',
        email: auth.user.email || '',
    });

    const submitProfile: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout title="Pengaturan Akun">
            <Head title="Pengaturan Akun" />
            <SettingsLayout>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Akun</CardTitle>
                            <CardDescription>Perbarui nama dan alamat email Anda.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitProfile} className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama</Label>
                                    <Input id="name" value={profileData.name} onChange={(e) => setProfileData('name', e.target.value)} required />
                                    <InputError message={profileErrors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={profileData.email} onChange={(e) => setProfileData('email', e.target.value)} required />
                                    <InputError message={profileErrors.email} />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Button disabled={profileProcessing}>Simpan</Button>
                                    <Transition show={profileRecentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0"><p className="text-sm text-muted-foreground">Tersimpan.</p></Transition>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Hapus Akun</CardTitle>
                            <CardDescription>Setelah akun Anda dihapus, semua sumber daya dan data akan dihapus secara permanen.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive">Hapus Akun</Button>
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </AuthenticatedLayout>
    );
}
