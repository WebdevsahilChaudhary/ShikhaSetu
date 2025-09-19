import { supabase } from "@/lib/supabaseClient";
import { MaterialList } from "@/components/admin/MaterialList";

export default async function MaterialsPage() {
    const { data, error } = await supabase
        .from('materials')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });

    if (error) {
        return <div>Error loading materials: {error.message}</div>
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Manage Materials</h2>
            <MaterialList materials={data || []} />
        </div>
    );
}
