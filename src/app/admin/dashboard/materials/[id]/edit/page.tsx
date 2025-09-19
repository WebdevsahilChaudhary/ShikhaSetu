import { EditMaterialForm } from "@/components/admin/EditMaterialForm";
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";

export default async function EditMaterialPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const { data: material, error: materialError } = await supabase
    .from('materials')
    .select('*, categories(id, name)')
    .eq('id', id)
    .single();

  if (materialError || !material) {
    notFound();
  }

  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*');

  if (categoriesError) {
    // Or handle this error more gracefully
    return <div>Error loading categories.</div>;
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Edit Material</h2>
      <EditMaterialForm material={material} categories={categories || []} />
    </div>
  );
}
