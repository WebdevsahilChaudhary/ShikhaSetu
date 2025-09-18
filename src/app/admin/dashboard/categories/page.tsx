import { CategoryManager } from "@/components/admin/CategoryManager";
import { categories, materials } from "@/lib/data";

export default function CategoriesPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>
      <CategoryManager initialCategories={categories} materials={materials} />
    </div>
  );
}
