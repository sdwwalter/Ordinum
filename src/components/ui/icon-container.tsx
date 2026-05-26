import * as React from 'react';
import { cn } from '@/lib/utils/cn';

type IconColor = 'brand' | 'emerald' | 'blue' | 'purple' | 'amber' | 'rose' | 'pink' | 'neutral';
type IconSize = 'sm' | 'md' | 'lg';

const colorMap: Record<IconColor, string> = {
  brand:   'bg-brand-400/10  border-brand-400/18  text-brand-300',
  emerald: 'bg-success/10    border-success/18    text-success',
  blue:    'bg-info/10       border-info/18       text-info',
  purple:  'bg-purple/10     border-purple/18     text-purple',
  amber:   'bg-amber/10      border-amber/18      text-amber',
  rose:    'bg-rose/10       border-rose/18       text-rose',
  pink:    'bg-pink/10       border-pink/18       text-pink',
  neutral: 'bg-white/6       border-white/10      text-text-muted',
};

const sizeMap: Record<IconSize, { container: string; icon: string }> = {
  sm: { container: 'w-8 h-8 rounded-[8px]',  icon: 'w-4 h-4' },
  md: { container: 'w-11 h-11 rounded-[12px]', icon: 'w-5 h-5' },
  lg: { container: 'w-14 h-14 rounded-[14px]', icon: 'w-[26px] h-[26px]' },
};

interface IconContainerProps {
  icon: React.ElementType;
  color?: IconColor;
  size?: IconSize;
  className?: string;
  strokeWidth?: number;
}

export function IconContainer({
  icon: Icon,
  color = 'brand',
  size = 'md',
  className,
  strokeWidth = 1.8,
}: IconContainerProps) {
  const { container, icon } = sizeMap[size];
  return (
    <div
      className={cn(
        'flex items-center justify-center flex-shrink-0 border',
        colorMap[color],
        container,
        className
      )}
    >
      <Icon className={icon} strokeWidth={strokeWidth} />
    </div>
  );
}
