"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold px-2">Categories</h3>
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
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="ghost"
          className={cn(
            "w-full justify-start",
            selectedCategory === category.id && "bg-accent text-accent-foreground"
          )}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
