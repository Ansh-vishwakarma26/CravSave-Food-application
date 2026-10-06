import React from 'react';
import { ReasonType } from '../types';
import { Clock, TrendingDown, Sparkles } from 'lucide-react';

interface ReasonBadgeProps {
  reason: ReasonType;
  customLabel?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ReasonBadge: React.FC<ReasonBadgeProps> = ({
  reason,
  customLabel,
  className = '',
  size = 'md',
}) => {
  if (reason === 'USE BY TODAY') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full border bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA] ${
          size === 'sm'
            ? 'px-2 py-0.5 text-[10px]'
            : size === 'lg'
            ? 'px-3 py-1 text-xs'
            : 'px-2.5 py-1 text-[11px]'
        } ${className}`}
      >
        <Clock className="w-3 h-3 text-[#C2410C]" />
        <span>{customLabel || 'USE BY TODAY'}</span>
      </span>
    );
  }

  if (reason === 'SELLING SLOWLY') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full border bg-[#ECFDF5] text-[#047857] border-[#A7F3D0] ${
          size === 'sm'
            ? 'px-2 py-0.5 text-[10px]'
            : size === 'lg'
            ? 'px-3 py-1 text-xs'
            : 'px-2.5 py-1 text-[11px]'
        } ${className}`}
      >
        <TrendingDown className="w-3 h-3 text-[#047857]" />
        <span>{customLabel || 'SELLING SLOWLY'}</span>
      </span>
    );
  }

  // LOOKS DIFFERENT
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full border bg-[#FAF5FF] text-[#7E22CE] border-[#E9D5FF] ${
        size === 'sm'
          ? 'px-2 py-0.5 text-[10px]'
          : size === 'lg'
          ? 'px-3 py-1 text-xs'
          : 'px-2.5 py-1 text-[11px]'
      } ${className}`}
    >
      <Sparkles className="w-3 h-3 text-[#7E22CE]" />
      <span>{customLabel || 'LOOKS DIFFERENT'}</span>
    </span>
  );
};
