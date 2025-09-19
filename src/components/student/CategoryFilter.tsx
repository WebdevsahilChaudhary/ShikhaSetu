"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryNode = ({
  category,
  allCategories,
  selectedCategory,
  onSelectCategory,
  level = 0,
}: {
  category: Category;
  allCategories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  level?: number;
}) => {
  const children = allCategories.filter((c) => c.parent_id === category.id);
  const isSelected = selectedCategory === category.id;

  if (children.length === 0) {
    return (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start text-left h-auto py-2",
          isSelected && "bg-accent text-accent-foreground"
        )}
        style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
        onClick={() => onSelectCategory(category.id)}
      >
        {category.name}
      </Button>
    );
  }

  // Determine if a child of this node is selected
  const isChildSelected = (catId: string): boolean => {
    if (selectedCategory === catId) return true;
    const childrenOfCat = allCategories.filter(c => c.parent_id === catId);
    return childrenOfCat.some(child => isChildSelected(child.id));
  };

  const defaultOpenValue = isChildSelected(category.id) ? [category.id] : [];

  return (
    <Accordion type="multiple" className="w-full" defaultValue={defaultOpenValue}>
      <AccordionItem value={category.id} className="border-none">
        <div 
            className={cn(
                "flex items-center rounded-md",
                isSelected && "bg-accent text-accent-foreground"
            )}
             style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
        >
          <AccordionTrigger
            className={cn(
              "hover:no-underline flex-1 justify-start font-normal py-2 text-left"
            )}
             onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </AccordionTrigger>
        </div>
        <AccordionContent className="pt-1">
          {children.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              allCategories={allCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
              level={level + 1}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};


export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const topLevelCategories = categories.filter((c) => !c.parent_id);

  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-lg font-semibold px-2 mb-2">Categories</h3>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start",
          selectedCategory === null && "bg-accent text-accent-foreground"
        )}
        onClick={() => onSelectCategory(null)}
      >
        All Materials
      </Button>
      {topLevelCategories.map((category) => (
        <CategoryNode
          key={category.id}
          category={category}
          allCategories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      ))}
    </div>
  );
}
