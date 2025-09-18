import { CategoryManager } from "@/components/admin/CategoryManager";
import { supabase } from "@/lib/supabaseClient";

export default async function CategoriesPage() {
  const { data: categories } = await supabase.from('categories').select('*');
  const { data: materials } = await supabase.from('materials').select('id, category_id');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>
      <CategoryManager initialCategories={categories || []} materials={materials || []} />
    </div>
  );
}
