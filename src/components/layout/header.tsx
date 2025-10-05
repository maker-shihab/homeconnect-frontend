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
    <header>
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-6">
          <Link href="/" className="text-4xl font-black">HomeConnect</Link>
          <nav>
            <ul className="flex items-center gap-6">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center">
            <Button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition mr-4">Login</Button>
            <Button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Sign Up</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
