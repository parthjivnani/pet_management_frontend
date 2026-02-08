import { Outlet, Link } from "react-router";
import { getToken } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function PublicLayout() {
  const isLoggedIn = !!getToken();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-4 py-3 flex justify-between items-center">
        <Link to="/pets" className="font-semibold text-lg">
          Pet Adoption
        </Link>
        <nav className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link to="/pets">Browse Pets</Link>
          </Button>
          {isLoggedIn ? (
            <Button asChild>
              <Link to="/my-applications">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth/sign-in">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/auth/sign-up">Register</Link>
              </Button>
            </>
          )}
        </nav>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
