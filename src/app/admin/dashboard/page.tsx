import { UploadForm } from "@/components/admin/UploadForm";
import { categories } from "@/lib/data";

export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Upload New Material</h2>
      <UploadForm categories={categories} />
    </div>
  );
}
