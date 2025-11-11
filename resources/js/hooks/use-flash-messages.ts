import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from '@/hooks/use-toast';

interface FlashMessages {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export function useFlashMessages() {
    const { props } = usePage();
    const flash = props.flash as FlashMessages;

    useEffect(() => {
        if (flash?.success) {
            toast({
                title: "Berhasil",
                description: flash.success,
                variant: "success",
            });
        }

        if (flash?.error) {
            toast({
                title: "Error",
                description: flash.error,
                variant: "destructive",
            });
        }

        if (flash?.warning) {
            toast({
                title: "Peringatan",
                description: flash.warning,
                variant: "warning",
            });
        }

        if (flash?.info) {
            toast({
                title: "Informasi",
                description: flash.info,
                variant: "info",
            });
        }
    }, [flash]);
}