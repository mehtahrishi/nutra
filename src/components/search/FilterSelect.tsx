"use client"

import { useRefinementList, UseRefinementListProps } from 'react-instantsearch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { useMemo } from 'react';

// Define all possible values for each attribute
const KNOWN_VALUES: Record<string, string[]> = {
  difficulty: ['easy', 'medium', 'hard'],
  dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-carb', 'high-protein'],
};

export function FilterSelect({ attribute, title }: UseRefinementListProps & { title?: string }) {
  const { items, refine } = useRefinementList({ 
    attribute,
    operator: 'or',
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

  const selectedItems = allItems.filter(item => item.isRefined);
  const selectedCount = selectedItems.length;
  
  const displayText = selectedCount > 0 
    ? `${selectedCount} selected` 
    : 'All';

  return (
    <div className="flex-1 min-w-[200px]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl bg-background/80 backdrop-blur-sm border-2 hover:border-primary transition-all justify-between"
          >
            <div className="flex flex-col items-start">
              <span className="text-xs text-muted-foreground uppercase tracking-wide font-headline">{title}</span>
              <span className="font-medium capitalize">{displayText}</span>
            </div>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 rounded-xl max-h-[400px] overflow-y-auto" align="start">
          {allItems.map((item, index) => (
            <div key={item.value}>
              {index > 0 && <DropdownMenuSeparator />}
              <DropdownMenuCheckboxItem
                checked={item.isRefined}
                onCheckedChange={() => refine(item.value)}
                className="capitalize cursor-pointer"
              >
                <div className="flex items-center justify-between w-full pr-2">
                  <span>{item.label}</span>
                  <Badge 
                    variant={item.isRefined ? "default" : "secondary"}
                    className="ml-2 text-xs px-2 py-0"
                  >
                    {item.count}
                  </Badge>
                </div>
              </DropdownMenuCheckboxItem>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
