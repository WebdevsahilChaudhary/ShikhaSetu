import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import Image from "next/image";

export default function DonatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Heart className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                        Support Our Mission
                    </h1>
                </div>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Your generous contribution helps us keep ShikshaSetu free and accessible for all students. Every donation, big or small, makes a significant impact on a student's future.
                </p>
                <p className="max-w-[600px] text-muted-foreground md:text-lg/relaxed">
                  Funds are used to maintain the website, create new high-quality study materials, and expand our reach to more students across Maharashtra. Thank you for being a part of their success story.
                </p>
                 <Image
                  src="https://picsum.photos/seed/donation/600/400"
                  width="600"
                  height="400"
                  alt="Education for all"
                  data-ai-hint="child education"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                />
              </div>
              <div className="flex items-center justify-center">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Make a Donation</CardTitle>
                    <CardDescription>Your support is vital for our work.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm text-center text-muted-foreground">We are currently setting up our payment gateway. Please check back soon!</p>
                    </div>
                     <Button className="w-full font-bold" disabled>
                        Donate Now (Coming Soon)
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
