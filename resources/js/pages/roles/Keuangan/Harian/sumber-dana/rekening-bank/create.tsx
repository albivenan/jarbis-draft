import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface CreateRekeningBankProps {
    sumberDanaUrl: string;
}

const Create: React.FC<CreateRekeningBankProps> = ({ sumberDanaUrl }) => {
    const { data, setData, post, processing, errors } = useForm({
        nama_sumber: '', // Keep this here for data structure
        nomor_rekening: '',
        nama_bank: '',
        nama_pemilik_rekening: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Generate nama_sumber automatically
        const generatedNamaSumber = `${data.nama_bank} - ${data.nomor_rekening}`;
        setData('nama_sumber', generatedNamaSumber); // Update data before posting
        post(route('keuangan.harian.rekening-bank.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tambah Rekening Bank" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Form Tambah Rekening Bank</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="nama_bank">Nama Bank</Label>
                                    <Select
                                        value={data.nama_bank}
                                        onValueChange={(value) => setData('nama_bank', value)}
                                    >
                                        <SelectTrigger className="w-full mt-1">
                                            <SelectValue placeholder="Pilih Bank" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BCA">Bank Central Asia (BCA)</SelectItem>
                                            <SelectItem value="Mandiri">Bank Mandiri</SelectItem>
                                            <SelectItem value="BNI">Bank Negara Indonesia (BNI)</SelectItem>
                                            <SelectItem value="BRI">Bank Rakyat Indonesia (BRI)</SelectItem>
                                            <SelectItem value="CIMB Niaga">CIMB Niaga</SelectItem>
                                            <SelectItem value="Permata">Bank Permata</SelectItem>
                                            <SelectItem value="Danamon">Bank Danamon</SelectItem>
                                            <SelectItem value="BTN">Bank Tabungan Negara (BTN)</SelectItem>
                                            <SelectItem value="BSI">Bank Syariah Indonesia (BSI)</SelectItem>
                                            <SelectItem value="OCBC NISP">OCBC NISP</SelectItem>
                                            <SelectItem value="Panin">Panin Bank</SelectItem>
                                            <SelectItem value="Maybank">Maybank Indonesia</SelectItem>
                                            <SelectItem value="Mega">Bank Mega</SelectItem>
                                            <SelectItem value="Sinarmas">Bank Sinarmas</SelectItem>
                                            <SelectItem value="Commonwealth">Commonwealth Bank</SelectItem>
                                            <SelectItem value="UOB">UOB Indonesia</SelectItem>
                                            <SelectItem value="HSBC">HSBC Indonesia</SelectItem>
                                            <SelectItem value="Standard Chartered">Standard Chartered Bank</SelectItem>
                                            <SelectItem value="Citibank">Citibank</SelectItem>
                                            <SelectItem value="DBS">DBS Indonesia</SelectItem>
                                            {/* Add more banks as needed */}
                                        </SelectContent>
                                    </Select>
                                    {errors.nama_bank && <p className="text-red-500 text-xs mt-1">{errors.nama_bank}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="nomor_rekening">Nomor Rekening</Label>
                                    <Input
                                        id="nomor_rekening"
                                        type="text"
                                        value={data.nomor_rekening}
                                        onChange={(e) => setData('nomor_rekening', e.target.value)}
                                        className="mt-1"
                                    />
                                    {errors.nomor_rekening && <p className="text-red-500 text-xs mt-1">{errors.nomor_rekening}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="nama_pemilik_rekening">Nama Pemilik Rekening</Label>
                                    <Input
                                        id="nama_pemilik_rekening"
                                        type="text"
                                        value={data.nama_pemilik_rekening}
                                        onChange={(e) => setData('nama_pemilik_rekening', e.target.value)}
                                        className="mt-1"
                                    />
                                    {errors.nama_pemilik_rekening && <p className="text-red-500 text-xs mt-1">{errors.nama_pemilik_rekening}</p>}
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Link href={sumberDanaUrl}>
                                        <Button variant="outline" type="button">Batal</Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>Simpan Rekening</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
