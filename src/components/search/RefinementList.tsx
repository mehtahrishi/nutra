"use client"

import { useRefinementList, UseRefinementListProps } from 'react-instantsearch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMemo } from 'react';

// Define all possible values for each attribute
const KNOWN_VALUES: Record<string, string[]> = {
  difficulty: ['easy', 'medium', 'hard'],
  dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-carb', 'high-protein'],
};

export function RefinementList({ attribute, title }: UseRefinementListProps & { title?: string }) {
  const { items, refine } = useRefinementList({ 
    attribute,
    showMore: true,
    showMoreLimit: 50,
    operator: 'or',
    sortBy: ['name:asc']
  });

  // Merge known values with current items to ensure all options are always visible
  const allItems = useMemo(() => {
    const knownValues = KNOWN_VALUES[attribute] || [];
    if (knownValues.length === 0) return items;

    const itemsMap = new Map(items.map(item => [item.value, item]));
    
    return knownValues.map(value => {
      const existingItem = itemsMap.get(value);
      if (existingItem) {
        return existingItem;
      }
      // Create a placeholder item for missing values
      return {
        value,
        label: value,
        count: 0,
        isRefined: false,
        highlighted: value
      };
    });
  }, [items, attribute]);

  if (allItems.length === 0) return null;

  return (
    <div className="space-y-3">
      {title && (
        <h3 className="font-headline font-semibold text-sm uppercase tracking-wider text-foreground/70">
          {title}
        </h3>
      )}
      <ScrollArea className="h-auto max-h-52">
        <div className="space-y-2.5 pr-2">
          {allItems.map((item) => (
            <div 
              key={item.value} 
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
            >
              <Checkbox
                id={`${attribute}-${item.value}`}
                checked={item.isRefined}
                onCheckedChange={() => refine(item.value)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`${attribute}-${item.value}`}
                className="flex-1 cursor-pointer text-sm flex items-center justify-between font-body group-hover:text-primary transition-colors"
              >
                <span className="capitalize font-medium">{item.label}</span>
                <Badge 
                  variant={item.isRefined ? "default" : "secondary"} 
                  className={`ml-2 text-xs px-2 py-0.5 ${
                    item.isRefined ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {item.count}
                </Badge>
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
