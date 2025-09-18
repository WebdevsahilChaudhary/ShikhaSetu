import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="flex flex-col gap-4 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} ShikshaSetu. All rights reserved.</span>
        <Separator orientation="vertical" className="hidden sm:block h-4" />
        <span>Made by Sahil/Captain Levi</span>
      </div>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link
          href="#"
          className="text-xs hover:underline underline-offset-4"
          prefetch={false}
        >
          Terms of Service
        </Link>
        <Link
          href="#"
          className="text-xs hover:underline underline-offset-4"
          prefetch={false}
        >
          Privacy
        </Link>
      </nav>
    </footer>
  );
}
