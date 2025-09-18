import { materials, categories } from "@/lib/data";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { MaterialsDisplay } from "@/components/student/MaterialsDisplay";

export async function generateStaticParams() {
  const classNames = [...new Set(materials.map((m) => m.class))];
  return classNames.map((className) => ({
    className,
  }));
}

function getClassName(slug: string): string {
  if (slug === '10') return 'Class 10th';
  if (slug === '12-science') return 'Class 12th - Science';
  return 'Materials';
}

export default function ClassPage({ params }: { params: { className: string } }) {
  const { className } = params;
  const filteredMaterials = materials.filter((m) => m.class === className);
  const pageTitle = getClassName(className);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <MaterialsDisplay
          initialMaterials={filteredMaterials}
          allCategories={categories}
          pageTitle={pageTitle}
        />
      </main>
      <Footer />
    </div>
  );
}
