import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpenCheck } from "lucide-react";

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background border-b">
      <Link href="/" className="flex items-center justify-center">
        <BookOpenCheck className="h-6 w-6 text-primary" />
        <span className="ml-2 text-xl font-headline font-bold text-primary">ShikshaSetu</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Button variant="ghost" asChild>
          <Link href="/admin">
            Admin Panel
          </Link>
        </Button>
      </nav>
    </header>
  );
}
