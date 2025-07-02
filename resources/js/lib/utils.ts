import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatTimestamp(timestamp: string) {
    return new Date(timestamp).toLocaleDateString('pt-BR', {hour: '2-digit', minute: '2-digit'});
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(amount);
}