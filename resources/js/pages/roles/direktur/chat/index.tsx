import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, Users, Shield, HelpCircle, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type BreadcrumbItem } from '@/types';

interface ChatMessage {
  id: string;
  sender: string;
  role: string; // e.g., Direktur, Manager Produksi, Finance Lead
  content: string;
  at: string; // ISO
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Direktur', href: '/roles/direktur' },
  { title: 'Chat', href: '/roles/direktur/chat' },
];

const nowIso = () => new Date().toISOString();

export default function DirekturChatPage() {
  const [showHelp, setShowHelp] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'finance' | 'production' | 'hrd'>('general');
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  const initial: Record<string, ChatMessage[]> = useMemo(() => ({
    general: [
      { id: 'm1', sender: 'Direktur', role: 'Direktur', content: 'Tim, mohon update KPI minggu ini.', at: nowIso() },
      { id: 'm2', sender: 'Finance Lead', role: 'Finance', content: 'Laporan arus kas siap dibagikan besok.', at: nowIso() },
    ],
    finance: [
      { id: 'm3', sender: 'Finance Lead', role: 'Finance', content: 'Payroll diproses hari Jumat.', at: nowIso() },
    ],
    production: [
      { id: 'm4', sender: 'Manager Produksi', role: 'Produksi', content: 'Overtime Sabtu disetujui.', at: nowIso() },
    ],
    hrd: [
      { id: 'm5', sender: 'HRD Lead', role: 'HRD', content: 'Evaluasi kinerja Q3 dimulai pekan depan.', at: nowIso() },
    ],
  }), []);

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(initial);

  const onSend = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      sender: 'Anda',
      role: 'Direktur',
      content: input.trim(),
      at: nowIso(),
    };
    setMessages((prev) => ({ ...prev, [activeTab]: [...prev[activeTab], newMsg] }));
    setInput('');
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  return (
    <AuthenticatedLayout>
      <Head title="Direktur • Chat" />
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Chat Direktur</h1>
            <p className="text-sm text-muted-foreground">Komunikasi lintas atasan dan pimpinan</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Bantuan"
              onClick={() => setShowHelp(true)}
              className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-sm text-muted-foreground hover:bg-accent"
            >
              <HelpCircle className="h-4 w-4" /> Bantuan
            </button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Ruang Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList>
                <TabsTrigger value="general">Umum</TabsTrigger>
                <TabsTrigger value="finance">Finance</TabsTrigger>
                <TabsTrigger value="production">Produksi</TabsTrigger>
                <TabsTrigger value="hrd">HRD</TabsTrigger>
              </TabsList>

              {(['general','finance','production','hrd'] as const).map((ch) => (
                <TabsContent key={ch} value={ch}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3">
                      <div className="h-[420px] overflow-y-auto rounded-md border p-3 bg-background/50">
                        {(messages[ch] ?? []).map((m) => (
                          <div key={m.id} className="mb-3 flex items-start gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{m.sender.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-semibold">{m.sender} <span className="text-xs text-muted-foreground">• {m.role}</span></div>
                              <div className="text-sm">{m.content}</div>
                              <div className="text-[10px] text-muted-foreground mt-1">{new Date(m.at).toLocaleString('id-ID')}</div>
                            </div>
                          </div>
                        ))}
                        <div ref={endRef} />
                      </div>
                    </div>
                    <div className="md:col-span-1">
                      <div className="rounded-md border p-3">
                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Users className="h-4 w-4" /> Peserta</div>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2"><Shield className="h-3.5 w-3.5" /> Direktur</li>
                          <li className="flex items-center gap-2"><Shield className="h-3.5 w-3.5" /> Finance Lead</li>
                          <li className="flex items-center gap-2"><Shield className="h-3.5 w-3.5" /> Manager Produksi</li>
                          <li className="flex items-center gap-2"><Shield className="h-3.5 w-3.5" /> HRD Lead</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-center gap-2">
              <Input placeholder="Tulis pesan..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') onSend(); }} />
              <Button onClick={onSend}><Send className="h-4 w-4 mr-1" /> Kirim</Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-background p-4 shadow">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Bantuan • Chat Direktur</h2>
              <button aria-label="Tutup" onClick={() => setShowHelp(false)} className="rounded p-1 hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Pilih kanal (Umum/Finance/Produksi/HRD) untuk berdiskusi lintas atasan. Ketik pesan dan tekan Enter untuk mengirim. Navigasi menggunakan breadcrumb di atas.</p>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
