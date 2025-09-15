import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilitário para combinar classes CSS de forma inteligente
 * 
 * Combina clsx para lógica condicional e tailwind-merge para resolver conflitos
 * de classes do Tailwind CSS
 * 
 * @param inputs - Classes CSS para combinar
 * @returns String com classes CSS combinadas e otimizadas
 * 
 * @example
 * ```tsx
 * cn('px-4 py-2', 'bg-blue-500', { 'text-white': isActive })
 * // Resultado: 'px-4 py-2 bg-blue-500 text-white'
 * 
 * cn('px-4', 'px-6') // tailwind-merge resolve o conflito
 * // Resultado: 'px-6'
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default cn;