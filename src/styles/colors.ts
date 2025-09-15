// Paleta de cores baseada no logotipo E3
export const colors = {
  // Cores primárias do logotipo E3
  primary: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Cor principal do E
    600: '#D97706', // Gradiente do E
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  
  // Cores secundárias (cinza do 3)
  secondary: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280', // Cor principal do 3
    600: '#4B5563', // Gradiente do 3
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Cores de status
  success: {
    500: '#10B981',
    600: '#059669',
  },
  
  warning: {
    500: '#F59E0B',
    600: '#D97706',
  },
  
  error: {
    500: '#EF4444',
    600: '#DC2626',
  },
  
  info: {
    500: '#4B5563', // Dark grey do logo
    600: '#374151', // Dark grey mais escuro
  },
  
  // Cores para dark mode
  dark: {
    bg: '#0F0F0F',
    surface: '#1A1A1A',
    card: '#262626',
    border: '#404040',
    text: {
      primary: '#FFFFFF',
      secondary: '#A3A3A3',
      muted: '#737373',
    }
  },
  
  // Cores para light mode
  light: {
    bg: '#FFFFFF',
    surface: '#F8FAFC',
    card: '#FFFFFF',
    border: '#E2E8F0',
    text: {
      primary: '#1E293B',
      secondary: '#475569',
      muted: '#64748B',
    }
  }
};

// Gradientes baseados no logotipo
export const gradients = {
  primary: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  secondary: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
  accent: 'linear-gradient(135deg, #F59E0B 0%, #6B7280 100%)',
};

// Sombras
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  glow: '0 0 20px rgba(245, 158, 11, 0.3)',
};