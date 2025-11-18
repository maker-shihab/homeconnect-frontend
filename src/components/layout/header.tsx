/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { pacifico } from "@/lib/fonts";
import { useLogoutMutation } from "@/redux/features/auth/authApiSlice";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/redux/features/auth/authSlice";
import { AppDispatch } from "@/redux/store";
import {
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  PlusCircle,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { TbHomeSearch } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutMutation();

  function isActive(href?: string): boolean {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const initials = useMemo(() => {
    const n = user?.name?.trim();
    if (!n) return "U";
    const parts = n.split(" ").filter(Boolean);
    return (parts[0]?.[0] ?? "U").toUpperCase() + (parts[1]?.[0]?.toUpperCase() ?? "");
  }, [user?.name]);

  const handleSignOut = async () => {
    try {
      await logoutUser().unwrap();
      toast.success("Logged out successfully.");
      router.push('/login');
    } catch (err) {
      toast.error("Failed to log out. Please try again.");
      console.error('Failed to log out:', err);
    }
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-white shadow-md transition-all duration-300">
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

          <nav className="hidden md:block">
            <ul className="flex items-center gap-6 text-gray-700">
              <li>
                <Link
                  href="/properties"
                  className={`text-sm hover:text-primary flex items-center gap-1 ${isActive('/properties') ? 'font-medium text-primary' : ''
                    }`}
                >
                  <Home className="h-4 w-4" />
                  Browse
                </Link>
              </li>

              {isAuthenticated && (
                <>
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
                  <li>
                    <Link
                      href="/dashboard/favorites"
                      className={`text-sm hover:text-primary flex items-center gap-1 ${isActive('/dashboard/favorites') ? 'font-medium text-primary' : ''
                        }`}
                    >
                      <Heart className="h-4 w-4" />
                      Favorites
                    </Link>
                  </li>
                </>
              )}

              <li>
                <Link
                  href="/about"
                  className={`text-sm hover:text-primary ${isActive('/about') ? 'font-medium text-primary' : ''
                    }`}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`text-sm hover:text-primary ${isActive('/contact') ? 'font-medium text-primary' : ''
                    }`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none flex items-center gap-2 cursor-pointer">
                  <div className="hidden lg:flex flex-col items-end">
                    <span className="text-sm font-semibold text-gray-800">{user?.name}</span>
                    <span className="text-xs text-gray-500 capitalize text-right">{user?.role}</span>
                  </div>
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarImage src={user?.avatar} alt={user?.name ?? "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user?.name ?? "User"}</span>
                      <span className="text-xs text-muted-foreground font-normal truncate">
                        {user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  {user?.role === 'landlord' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/my-properties" className="cursor-pointer">
                          <Home className="mr-2 h-4 w-4" />
                          My Properties
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/add-property" className="cursor-pointer">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add New Property
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/favorites" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      My Favorites
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/messages" className="cursor-pointer">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Messages
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="mr-2 rounded-lg px-6 py-2 transition text-black">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-lg px-6 py-2">
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