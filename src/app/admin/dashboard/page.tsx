import { UploadForm } from "@/components/admin/UploadForm";
import { supabase } from "@/lib/supabaseClient";

export default async function DashboardPage() {
  const { data: categories } = await supabase.from('categories').select('*');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Upload New Material</h2>
      <UploadForm categories={categories || []} />
    </div>
  );
}
