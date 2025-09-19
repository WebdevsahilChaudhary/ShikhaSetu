"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CategoryFilter } from "./CategoryFilter";
import { MaterialCard } from "./MaterialCard";
import type { Material, Category } from "@/lib/types";

interface MaterialsDisplayProps {
  initialMaterials: Material[];
  allCategories: Category[];
  pageTitle: string;
}

export function MaterialsDisplay({
  initialMaterials,
  allCategories,
  pageTitle,
}: MaterialsDisplayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredMaterials = useMemo(() => {
    // If a category is selected, we need to find all of its descendants
    const getDescendantIds = (categoryId: string): string[] => {
      const children = allCategories.filter(c => c.parent_id === categoryId);
      let ids = [categoryId];
      children.forEach(child => {
        ids = [...ids, ...getDescendantIds(child.id)];
      });
      return ids;
    };

    const categoryIdsToFilter = selectedCategory ? getDescendantIds(selectedCategory) : null;

    return initialMaterials.filter((material) => {
      const matchesCategory =
        !categoryIdsToFilter || (material.category_id && categoryIdsToFilter.includes(material.category_id));
      
      const matchesSearch = material.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
        
      return matchesCategory && matchesSearch;
    });
  }, [initialMaterials, selectedCategory, searchQuery, allCategories]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8 text-primary">{pageTitle} Materials</h1>
      <div className="grid md:grid-cols-[240px_1fr] gap-8 items-start">
        <aside className="sticky top-20">
          <CategoryFilter
            categories={allCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </aside>
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search materials..."
              className="w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {filteredMaterials.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material, index) => (
                <MaterialCard key={material.id} material={material} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold">No Materials Found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
