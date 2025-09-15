'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { componentVariants, ComponentVariant, ComponentSize } from '@/styles/tokens';
import { cn } from '@/utils/cn';

// Interfaces para tipagem forte
interface BaseCardProps {
  children: React.ReactNode;
  variant?: ComponentVariant;
  size?: ComponentSize;
  className?: string;
  animate?: boolean;
  hover?: boolean;
  loading?: boolean;
}

type CardProps = BaseCardProps & Omit<HTMLMotionProps<'div'>, keyof BaseCardProps>;

// Mapeamento de tamanhos
const sizeClasses: Record<ComponentSize, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

// Animações padrão
const defaultAnimations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

const hoverAnimations = {
  whileHover: { 
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  whileTap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

/**
 * Componente Card reutilizável com design system integrado
 * 
 * @example
 * ```tsx
 * <Card variant="success" size="md" animate hover>
 *   <CardHeader>
 *     <CardTitle>Título do Card</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     Conteúdo do card aqui
 *   </CardContent>
 * </Card>
 * ```
 */
export function Card({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '', 
  animate = true,
  hover = true,
  loading = false,
  ...motionProps
}: CardProps) {
  // Obter estilos da variante
  const variantStyles = componentVariants.card[variant];
  
  // Classes base do componente
  const baseClasses = cn(
    // Layout e estrutura
    'relative overflow-hidden',
    'border backdrop-blur-xl rounded-2xl',
    'shadow-xl transition-all duration-300',
    
    // Estilos da variante
    variantStyles.background,
    variantStyles.border,
    variantStyles.text,
    
    // Tamanho
    sizeClasses[size],
    
    // Estados
    {
      'cursor-pointer': hover,
      'animate-pulse': loading,
    },
    
    // Classes customizadas
    className
  );

  // Props de animação
  const animationProps = {
    ...(animate && defaultAnimations),
    ...(hover && hoverAnimations),
    ...motionProps,
  };

  // Renderizar loading state
  if (loading) {
    return (
      <div className={baseClasses}>
        <CardSkeleton size={size} />
      </div>
    );
  }

  return (
    <motion.div
      className={baseClasses}
      {...animationProps}
    >
      {children}
    </motion.div>
  );
}

// Componentes auxiliares para estruturação do card
export function CardHeader({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ 
  children, 
  className = '',
  as: Component = 'h3'
}: { 
  children: React.ReactNode; 
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}) {
  return (
    <Component className={cn(
      'text-lg font-semibold text-white mb-2',
      className
    )}>
      {children}
    </Component>
  );
}

export function CardDescription({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <p className={cn(
      'text-sm text-gray-400',
      className
    )}>
      {children}
    </p>
  );
}

export function CardContent({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn(
      'mt-6 pt-4 border-t border-gray-700/30',
      className
    )}>
      {children}
    </div>
  );
}

// Componente de skeleton para loading states
function CardSkeleton({ size }: { size: ComponentSize }) {
  const skeletonHeight = {
    sm: 'h-20',
    md: 'h-32',
    lg: 'h-40',
    xl: 'h-48',
  };

  return (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-700/50 rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="w-3/4 h-4 bg-gray-700/50 rounded"></div>
          <div className="w-1/2 h-3 bg-gray-700/50 rounded"></div>
        </div>
      </div>
      <div className={cn('bg-gray-700/50 rounded', skeletonHeight[size])}></div>
    </div>
  );
}

// Hook personalizado para usar com cards
export function useCard() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const withLoading = React.useCallback(async (fn: () => Promise<void>) => {
    try {
      setLoading(true);
      setError(null);
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    withLoading,
    setError,
  };
}

// Variantes especializadas do Card
export function StatCard({ 
  title,
  value,
  description,
  trend,
  icon: Icon,
  variant = 'default',
  ...props 
}: {
  title: string;
  value: string;
  description?: string;
  trend?: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: ComponentVariant;
} & Omit<CardProps, 'children'>) {
  const variantStyles = componentVariants.card[variant];
  
  return (
    <Card variant={variant} {...props}>
      <CardHeader>
        <div className="flex items-center justify-between">
          {Icon && (
            <div className={cn(
              'p-3 rounded-xl',
              variantStyles.accent?.background || 'bg-gray-500/20'
            )}>
              <Icon className={cn(
                'w-6 h-6',
                variantStyles.accent?.text || 'text-gray-400'
              )} />
            </div>
          )}
          {trend && (
            <div className={cn(
              'text-xs px-2 py-1 rounded-full font-medium',
              variantStyles.accent?.background || 'bg-gray-500/20',
              variantStyles.accent?.text || 'text-gray-400'
            )}>
              {trend}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <CardDescription>{title}</CardDescription>
          <div className="text-2xl font-bold text-white">{value}</div>
          {description && (
            <p className="text-xs text-gray-400">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ChartCard({ 
  title,
  children,
  actions,
  ...props 
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
} & Omit<CardProps, 'children'>) {
  return (
    <Card {...props}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}