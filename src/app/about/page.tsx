import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { BookOpenCheck, Users, Target } from "lucide-react";
import Image from "next/image";

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <BookOpenCheck className="h-12 w-12 text-primary" />
              <h1 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                About ShikshaSetu
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Our mission is to provide free, high-quality educational resources to every student in Maharashtra, bridging the gap between ambition and opportunity.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-semibold text-primary">Our Story</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">From a Simple Idea to a Statewide Platform</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                    ShikshaSetu was born from a simple yet powerful idea: education should be accessible to all, regardless of their background or location. We started as a small initiative by a group of passionate educators and developers, and have grown into a comprehensive portal dedicated to serving students of the Maharashtra State Board.
                  </p>
                </div>
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold flex items-center gap-2"><Target className="h-5 w-5 text-primary" />Our Mission</h3>
                      <p className="text-muted-foreground">To empower students with the knowledge and tools they need to excel in their board examinations and beyond.</p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Our Community</h3>
                      <p className="text-muted-foreground">We are a community-driven platform, relying on the contributions of teachers, volunteers, and donors to keep our resources free and up-to-date.</p>
                    </div>
                  </li>
                </ul>
              </div>
               <Image
                  src="https://picsum.photos/seed/students/600/400"
                  width="600"
                  height="400"
                  alt="Happy Students"
                  data-ai-hint="happy students"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
