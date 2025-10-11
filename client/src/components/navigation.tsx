import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MapPin, Plus, Shield } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover-elevate rounded-md px-3 py-2 transition-all">
            <MapPin className="h-6 w-6 text-primary" />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none">
                Charlotte Events
              </span>
              <span className="text-xs text-muted-foreground">
                Neighborhood Micro-Events
              </span>
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/">
            <Button
              variant={location === "/" ? "default" : "ghost"}
              size="sm"
              data-testid="nav-discover"
            >
              Discover
            </Button>
          </Link>

          <Link href="/submit">
            <Button
              variant={location === "/submit" ? "default" : "ghost"}
              size="sm"
              data-testid="nav-submit"
            >
              <Plus className="h-4 w-4 mr-1" />
              Submit Event
            </Button>
          </Link>

          <Link href="/admin">
            <Button
              variant={location === "/admin" ? "default" : "ghost"}
              size="sm"
              data-testid="nav-admin"
            >
              <Shield className="h-4 w-4 mr-1" />
              Moderation
            </Button>
          </Link>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
