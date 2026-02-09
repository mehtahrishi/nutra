"use client"

import { useRange, UseRangeProps } from 'react-instantsearch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface RangeSliderProps extends UseRangeProps {
  title?: string;
  unit?: string;
}

export function RangeSlider({ attribute, title, unit = '' }: RangeSliderProps) {
  const { start, range, refine } = useRange({ attribute });

  if (!range.min || !range.max || range.min === Infinity || range.max === -Infinity) return null;

  // Ensure currentValue is valid and within range
  let currentValue = start?.[0] ?? range.max;
  if (!isFinite(currentValue) || currentValue < range.min) {
    currentValue = range.max;
  }
  const isMaxValue = currentValue >= range.max;

  return (
    <div className="h-12 px-4 py-2 rounded-xl bg-background/80 backdrop-blur-sm border-2 hover:border-primary transition-all">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between">
          {title && (
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-headline">
              {title}
            </span>
          )}
          <Badge 
            variant={isMaxValue ? "secondary" : "default"}
            className={`text-xs px-2 py-0 h-5 font-headline font-bold ${
              isMaxValue 
                ? 'bg-muted text-muted-foreground' 
                : 'bg-primary text-white'
            }`}
          >
            {isMaxValue ? 'Any' : `≤ ${currentValue}${unit}`}
          </Badge>
        </div>
        <div className="flex-1 flex items-center px-1">
          <Slider
            min={range.min}
            max={range.max}
            step={attribute === 'calories' ? 50 : 5}
            value={[currentValue]}
            onValueChange={([value]) => {
              refine([value, range.max]);
            }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
