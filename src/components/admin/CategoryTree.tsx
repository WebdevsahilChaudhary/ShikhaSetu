"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

interface CategoryTreeProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  parentId?: string | null;
  level?: number;
}

export function CategoryTree({
  categories,
  onEdit,
  onDelete,
  parentId = null,
  level = 0,
}: CategoryTreeProps) {
  const childCategories = categories.filter((c) => c.parent_id === parentId);

  if (childCategories.length === 0 && level === 0) {
      return <p className="text-muted-foreground text-center p-4">No categories created yet.</p>
  }

  return (
    <div className={cn("space-y-2", level > 0 && "pl-6 pt-2")}>
      {childCategories.map((category) => (
        <div key={category.id}>
          <div className="flex items-center justify-between p-2 rounded-md hover:bg-secondary">
            <span className="font-medium">{category.name}</span>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(category)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CategoryTree
            categories={categories}
            onEdit={onEdit}
            onDelete={onDelete}
            parentId={category.id}
            level={level + 1}
          />
        </div>
      ))}
    </div>
  );
}
