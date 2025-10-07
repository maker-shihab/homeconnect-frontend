import { pacifico } from "@/app/layout";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Header() {

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-20 transition-all duration-300 bg-white`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4 rounded-3xl px-6">
          <Link
            href="/"
            className={`${pacifico.className} text-3xl font-bold text-primary`}
          >
            HomeConnect
          </Link>

          <nav>
            <ul className="flex items-center gap-6 text-gray-700">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center">
            <Button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition mr-2">
              Login
            </Button>
            <Button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/70 transition">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
