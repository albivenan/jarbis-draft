import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { BarChart3, Building2, CheckCircle, Factory, FileText, MessageSquare, ShieldCheck, Users } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="PT. Jarbis Indonesia • Sistem Internal">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-background text-foreground">
                {/* Top Nav */}
                <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-semibold">PT. Jarbis Indonesia</span>
                        </div>
                        <nav className="flex items-center gap-3 text-sm">
                            {auth.user ? (
                                <Link href={route('dashboard')} className="rounded-md border px-3 py-1.5 hover:bg-accent">
                                    Ke Dashboard
                                </Link>
                            ) : (
                                <a
                                    href="mailto:it@jarbis.co.id"
                                    className="rounded-md border px-3 py-1.5 hover:bg-accent"
                                    aria-label="Hubungi IT Perusahaan"
                                >
                                    Hubungi IT Perusahaan
                                </a>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero */}
                <section className="relative overflow-hidden">
                    <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent" />
                    <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 md:py-16 lg:grid-cols-2 lg:py-24">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                                <ShieldCheck className="h-3.5 w-3.5" /> Khusus Pengurus & Anggota Internal
                            </span>
                            <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
                                Sistem Manajemen Produksi & Operasional PT. Jarbis Indonesia
                            </h1>
                            <p className="mt-3 text-muted-foreground">
                                Platform terpadu untuk Direktur, Supervisor, dan Karyawan dalam mengelola KPI, laporan, persetujuan, chat, dan dokumen perusahaan.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="rounded-md bg-primary px-4 py-2 text-white hover:opacity-90">
                                        Buka Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="rounded-md bg-primary px-4 py-2 text-white hover:opacity-90">
                                            Masuk sebagai Bagian
                                        </Link>
                                        <Link href={route('register')} className="rounded-md border px-4 py-2 hover:bg-accent">
                                            Ajukan Akses
                                        </Link>
                                    </>
                                )}
                            </div>
                            <div className="mt-6 grid grid-cols-3 gap-3 text-sm text-muted-foreground md:max-w-md">
                                <div className="rounded-md border p-3">
                                    <div className="font-semibold text-foreground">Keamanan</div>
                                    <div>RBAC & audit log</div>
                                </div>
                                <div className="rounded-md border p-3">
                                    <div className="font-semibold text-foreground">Kolaborasi</div>
                                    <div>Chat & lampiran</div>
                                </div>
                                <div className="rounded-md border p-3">
                                    <div className="font-semibold text-foreground">Efisiensi</div>
                                    <div>Persetujuan cepat</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="mx-auto aspect-[4/3] w-full max-w-md rounded-xl border bg-card shadow-sm md:max-w-lg">
                                <div className="grid h-full grid-cols-2 gap-3 p-4">
                                    <div className="rounded-lg border p-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold"><BarChart3 className="h-4 w-4" /> KPI</div>
                                        <div className="mt-2 h-24 rounded-md bg-accent/40" />
                                        <div className="mt-2 h-2 w-1/2 rounded bg-accent/60" />
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4" /> Laporan</div>
                                        <div className="mt-2 h-24 rounded-md bg-accent/40" />
                                        <div className="mt-2 h-2 w-2/3 rounded bg-accent/60" />
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold"><CheckCircle className="h-4 w-4" /> Persetujuan</div>
                                        <div className="mt-2 h-24 rounded-md bg-accent/40" />
                                        <div className="mt-2 h-2 w-1/3 rounded bg-accent/60" />
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold"><MessageSquare className="h-4 w-4" /> Chat</div>
                                        <div className="mt-2 h-24 rounded-md bg-accent/40" />
                                        <div className="mt-2 h-2 w-1/2 rounded bg-accent/60" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Roles / Features */}
                <section className="border-t bg-muted/30">
                    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
                        <h2 className="text-xl font-semibold md:text-2xl">Dirancang untuk setiap peran</h2>
                        <p className="mt-2 text-muted-foreground">Akses berbasis peran memastikan setiap orang melihat hal yang paling relevan.</p>
                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-lg border p-5">
                                <div className="flex items-center gap-2 text-sm font-semibold"><Building2 className="h-4 w-4" /> Direktur</div>
                                <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground">
                                    <li>Ringkasan KPI lintas divisi</li>
                                    <li>Persetujuan anggaran & proyek</li>
                                    <li>Lampiran laporan bawahan</li>
                                </ul>
                            </div>
                            <div className="rounded-lg border p-5">
                                <div className="flex items-center gap-2 text-sm font-semibold"><BarChart3 className="h-4 w-4" /> Finance</div>
                                <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground">
                                    <li>Omset, arus kas, payroll</li>
                                    <li>Pengajuan & approval biaya</li>
                                    <li>Laporan keuangan periodik</li>
                                </ul>
                            </div>
                            <div className="rounded-lg border p-5">
                                <div className="flex items-center gap-2 text-sm font-semibold"><Factory className="h-4 w-4" /> Produksi</div>
                                <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground">
                                    <li>Monitoring output & OEE</li>
                                    <li>Isu prioritas & tindak lanjut</li>
                                    <li>Dokumentasi SOP</li>
                                </ul>
                            </div>
                            <div className="rounded-lg border p-5">
                                <div className="flex items-center gap-2 text-sm font-semibold"><Users className="h-4 w-4" /> HRD</div>
                                <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground">
                                    <li>Manajemen kinerja & cuti</li>
                                    <li>Evaluasi & pelatihan</li>
                                    <li>Kepatuhan & kebijakan</li>
                                </ul>
                            </div>
                            <div className="rounded-lg border p-5">
                                <div className="flex items-center gap-2 text-sm font-semibold"><Users className="h-4 w-4" /> Karyawan</div>
                                <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground">
                                    <li>Slip gaji & riwayat payroll</li>
                                    <li>Komunikasi atasan</li>
                                    <li>Pengajuan & lampiran</li>
                                </ul>
                            </div>
                            <div className="rounded-lg border p-5">
                                <div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="h-4 w-4" /> Keamanan</div>
                                <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground">
                                    <li>Autentikasi & otorisasi</li>
                                    <li>Audit trail aktivitas</li>
                                    <li>Kontrol akses granular</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section>
                    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
                        <div className="rounded-xl border bg-card p-6 text-center shadow-sm">
                            <h3 className="text-lg font-semibold md:text-xl">Siap meningkatkan kolaborasi dan kontrol?</h3>
                            <p className="mt-2 text-muted-foreground">Masuk untuk mulai bekerja, atau ajukan akses jika Anda bagian dari PT. Jarbis Indonesia.</p>
                            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="rounded-md bg-primary px-4 py-2 text-white hover:opacity-90">
                                        Ke Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="rounded-md bg-primary px-4 py-2 text-white hover:opacity-90">
                                            Masuk
                                        </Link>
                                        <Link href={route('register')} className="rounded-md border px-4 py-2 hover:bg-accent">
                                            Ajukan Akses
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-xs text-muted-foreground">
                        <div> 2023 PT. Jarbis Indonesia</div>
                        <div className="flex items-center gap-3">
                            <span>Kebijakan Privasi</span>
                            <span>·</span>
                            <span>Syarat Penggunaan</span>
                        </div>
                    </div>
                </footer>
            </div>
         </>
     );
 }
