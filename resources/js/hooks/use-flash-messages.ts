import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashMessages } from '@/types';

/**
 * Hook para exibir mensagens flash do Laravel como toasts do Sonner
 * Este hook deve ser usado no layout principal ou em componentes que precisam
 * exibir mensagens após redirects do Laravel
 */
export function useFlashMessages() {
    const { flash } = usePage().props as { flash?: FlashMessages };

    useEffect(() => {
        if (!flash) return;

        if (flash.success) {
            toast.success(flash.success);
        }

        if (flash.error) {
            toast.error(flash.error);
        }

        if (flash.info) {
            toast.info(flash.info);
        }

        if (flash.warning) {
            toast.warning(flash.warning);
        }

        if (flash.message) {
            toast(flash.message);
        }
    }, [flash]);
}

