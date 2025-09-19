import { CategoryManager } from "@/components/admin/CategoryManager";
import { supabase } from "@/lib/supabaseClient";

export default async function CategoriesPage() {
  const { data: categories } = await supabase.from('categories').select('*');
  
  // Ensure categories are sorted or handled if initialCategories can be null/undefined
  const sortedCategories = categories?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>
      <CategoryManager initialCategories={sortedCategories} />
    </div>
  );
}
