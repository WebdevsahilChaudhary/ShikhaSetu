"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CategoryFilter } from "./CategoryFilter";
import { MaterialCard } from "./MaterialCard";
import { Skeleton } from "@/components/ui/skeleton";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate network delay
    return () => clearTimeout(timer);
  }, []);

  const filteredMaterials = useMemo(() => {
    return initialMaterials.filter((material) => {
      const matchesCategory =
        !selectedCategory || material.category_id === selectedCategory;
      const matchesSearch = material.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [initialMaterials, selectedCategory, searchQuery]);

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
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[125px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
