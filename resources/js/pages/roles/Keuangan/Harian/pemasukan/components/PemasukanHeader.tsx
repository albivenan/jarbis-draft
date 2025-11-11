import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { TrendingUp, PlusCircle } from 'lucide-react';

interface PemasukanHeaderProps {
    createRoute: string;
}

const PemasukanHeader: React.FC<PemasukanHeaderProps> = ({ createRoute }) => {
    return (
        <header className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    Pemasukan Harian
                </h1>
                <p className="text-gray-600 mt-1">Kelola dan catat pemasukan harian perusahaan.</p>
            </div>
            <div className="flex items-center gap-2">
                <Link href={createRoute}>
                    <Button variant="outline">
                        <PlusCircle className="mr-2 h-4 w-4" />Tambah Pemasukan
                    </Button>
                </Link>
            </div>
        </header>
    );
};

export default PemasukanHeader;
