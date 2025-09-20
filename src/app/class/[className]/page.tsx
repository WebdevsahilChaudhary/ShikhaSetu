import { supabase } from "@/lib/supabaseClient";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { MaterialsDisplay } from "@/components/student/MaterialsDisplay";

// This line tells Next.js to not cache this page and regenerate it on every request.
// This ensures that any new data added to the database is reflected immediately.
export const revalidate = 0;

export async function generateStaticParams() {
  // This could also be fetched from the database if classes are dynamic
  const classNames = ['10', '12-science', '12-commerce', '12-arts'];
  return classNames.map((className) => ({
    className,
  }));
}

function getClassName(slug: string): string {
  if (slug === '10') return 'Class 10th';
  if (slug === '12-science') return 'Class 12th - Science';
  if (slug === '12-commerce') return 'Class 12th - Commerce';
  if (slug === '12-arts') return 'Class 12th - Arts';
  return 'Materials';
}

export default async function ClassPage({ params }: { params: { className: string } }) {
  const { className } = params;
  
  const { data: materials, error: materialsError } = await supabase
    .from('materials')
    .select('*, categories(name)')
    .eq('class', className);

  // Determine the class number ('10' or '12') for filtering categories
  const classNumberForFilter = className.startsWith('12') ? '12' : '10';

  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .in('class_association', [classNumberForFilter, 'both']);


  const pageTitle = getClassName(className);

  if (materialsError || categoriesError) {
    // You might want to show a proper error page here
    return <div>Error loading data. Please try again later.</div>;
  }
  
  const materialsWithFileType = materials?.map(material => {
    const extension = material.file_url.split('.').pop()?.toLowerCase();
    let file_type: 'pdf' | 'doc' | 'zip' = 'pdf'; // default
    if (extension === 'pdf') file_type = 'pdf';
    if (extension === 'doc' || extension === 'docx') file_type = 'doc';
    if (extension === 'zip') file_type = 'zip';
    return { ...material, file_type };
  }) || [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <MaterialsDisplay
          initialMaterials={materialsWithFileType}
          allCategories={categories || []}
          pageTitle={pageTitle}
        />
      </main>
      <Footer />
    </div>
  );
}
