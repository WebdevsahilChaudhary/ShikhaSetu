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

  if (children.length === 0) {
    return (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start text-left h-auto py-2",
          selectedCategory === category.id && "bg-accent text-accent-foreground"
        )}
        style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
        onClick={() => onSelectCategory(category.id)}
      >
        {category.name}
      </Button>
    );
  }

  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value={category.id} className="border-none">
        <AccordionTrigger
          className={cn(
            "hover:no-underline justify-start font-normal hover:bg-accent rounded-md text-left",
            selectedCategory === category.id && "bg-accent text-accent-foreground"
          )}
          style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
          onClick={(e) => {
             // Prevent accordion from toggling when clicking the category itself
             if ((e.target as HTMLElement).closest('.accordion-content')) return;
             onSelectCategory(category.id);
          }}
        >
          {category.name}
        </AccordionTrigger>
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
