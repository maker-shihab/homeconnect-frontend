"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import navData from "@/data/navigation.json";
import { useAuth } from "@/lib/auth-context";
import { pacifico } from "@/lib/fonts";
import { ChevronDown, Heart, Home, LayoutDashboard, LogOut, MessageCircle, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { TbHomeSearch } from "react-icons/tb";
import { Button } from "../ui/button";

type NavItem = {
  name: string;
  href?: string;
  children?: NavItem[];
};

export default function Header() {
  const pathname = usePathname();
  const navigation = navData as NavItem[];

  // Use your auth context
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  function isActive(href?: string): boolean {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  function childActive(children?: NavItem[]) {
    if (!children) return false;
    return children.some((c) => isActive(c.href));
  }

  const initials = useMemo(() => {
    const n = user?.name?.trim();
    if (!n) return "U";
    const parts = n.split(" ").filter(Boolean);
    return (parts[0]?.[0] ?? "U").toUpperCase() + (parts[1]?.[0]?.toUpperCase() ?? "");
  }, [user?.name]);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <header className="fixed left-0 top-0 z-50 w-full bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between rounded-3xl py-4">
            <Link
              href="/"
              className={`${pacifico.className} text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg hover:drop-shadow-xl inline-flex items-center space-x-3 hover:scale-105 transition-transform duration-300`}
            >
              <div className="relative">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-200/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <span className="text-3xl text-blue-600 lg:text-4xl"><TbHomeSearch /></span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <span className="">HomeConnect</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-9 w-20 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="h-9 w-9 bg-gray-200 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-white shadow-md transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between rounded-3xl py-4">
          {/* Brand */}
          <Link
            href="/"
            className={`${pacifico.className} text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg hover:drop-shadow-xl inline-flex items-center space-x-3 hover:scale-105 transition-transform duration-300`}
          >
            <div className="relative">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-200/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <span className="text-3xl text-blue-600 lg:text-4xl"><TbHomeSearch /></span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <span className="">HomeConnect</span>
          </Link>
          {/* Nav - Show different navigation based on auth status */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-6 text-gray-700">
              {isAuthenticated ? (
                // Authenticated user navigation
                <>
                  <li>
                    <Link
                      href="/properties"
                      className={`text-sm hover:text-primary flex items-center gap-1 ${isActive('/properties') ? 'font-medium text-primary' : ''
                        }`}
                    >
                      <Home className="h-4 w-4" />
                      Browse Properties
                    </Link>
                  </li>

                  {user?.role === 'landlord' && (
                    <li>
                      <Link
                        href="/dashboard"
                        className={`text-sm hover:text-primary flex items-center gap-1 ${isActive('/dashboard') ? 'font-medium text-primary' : ''
                          }`}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </li>
                  )}

                  <li>
                    <Link
                      href="/favorites"
                      className={`text-sm hover:text-primary flex items-center gap-1 ${isActive('/favorites') ? 'font-medium text-primary' : ''
                        }`}
                    >
                      <Heart className="h-4 w-4" />
                      Favorites
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/messages"
                      className={`text-sm hover:text-primary flex items-center gap-1 ${isActive('/messages') ? 'font-medium text-primary' : ''
                        }`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Messages
                    </Link>
                  </li>
                </>
              ) : (
                // Guest navigation
                navigation.map((item) =>
                  item.children?.length ? (
                    <li key={item.name}>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center gap-1 text-sm font-medium hover:text-primary focus:outline-none">
                          <span className={childActive(item.children) ? "text-primary" : ""}>
                            {item.name}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuLabel className="text-xs text-muted-foreground">
                            {item.name}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {item.children.map((child) => (
                            <DropdownMenuItem key={child.name} asChild>
                              <Link
                                href={child.href ?? "#"}
                                className={isActive(child.href) ? "text-primary" : ""}
                              >
                                {child.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </li>
                  ) : (
                    <li key={item.name}>
                      <Link
                        href={item.href ?? "#"}
                        className={`text-sm hover:text-primary ${isActive(item.href) ? "font-medium text-primary" : ""
                          }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  )
                )
              )}
            </ul>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              // Authenticated user menu
              <>
                {user?.role === 'landlord' && (
                  <Link href="/dashboard">
                    <Button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Avatar className="h-9 w-9 border-2 border-primary/20">
                        <AvatarImage src={user?.avatar} alt={user?.name ?? "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user?.name ?? "User"}</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {user?.role} • {user?.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>

                    {user?.role === 'landlord' && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem asChild>
                      <Link href="/favorites" className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        Favorites
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Guest buttons
              <>
                <Link href="/signin">
                  <Button variant="outline" className="mr-2 rounded-lg px-4 py-2 transition text-black">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="rounded-lg px-4 py-2">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}