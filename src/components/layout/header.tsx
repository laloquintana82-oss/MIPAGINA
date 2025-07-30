"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Button } from "../ui/button";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/blog", label: "Blog" },
  { href: "/papers", label: "Publicaciones" },
  { href: "/about", label: "Sobre Luis" },
];

export function Header() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-headline text-xl font-bold">
            El Blog de Luis Eduardo
          </span>
        </Link>
        <nav className="hidden items-center space-x-8 text-sm font-bold md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === href ? "text-primary" : "text-foreground/70"
              )}
            >
              {label}
            </Link>
          ))}
          {!loading && user && (
            <Link
              href="/admin/dashboard"
              className={cn(
                "transition-colors hover:text-primary",
                pathname.startsWith("/admin") ? "text-primary" : "text-foreground/70"
              )}
            >
              Panel
            </Link>
          )}
        </nav>
        <div className="flex items-center space-x-2">
           <ThemeToggle />
           {!loading && user && <Button onClick={signOut} variant="outline" size="sm">Cerrar Sesión</Button>}
        </div>
      </div>
    </header>
  );
}
