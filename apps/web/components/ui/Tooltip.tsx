'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Tooltip({
  children,
  content,
  className,
  disabled = false,
}: {
  children: ReactNode;
  content: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  if (disabled) {
    return <>{children}</>;
  }
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          side="top"
          align="center"
          className={cn(
            'z-50 flex rounded-md bg-gray-200 text-black  px-2 py-2 text-md shadow-md',
            className
          )}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-gray-900" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
