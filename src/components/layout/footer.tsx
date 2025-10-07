
import { pacifico } from '@/app/layout';
import Link from 'next/link';
import { FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';
import { LuLinkedin } from 'react-icons/lu';

export default function Footer() {
  const homeConnectSocail = [
    {
      name: <FiTwitter />,
      href: ""
    }, {
      name: <LuLinkedin />,
      href: ""
    }, {
      name: <FiYoutube />,
      href: ""
    },
    {
      name: <FiInstagram />,
      href: ""
    }
  ]
  const footerWidgets = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#" },
        { name: "Integrations", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "FAQ", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Contact", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "Security", href: "#" },
      ],
    },
  ];
  return (
    <footer className='pt-10'>
      <div className='container mx-auto'>
        <div className='bg-black text-white rounded-t-3xl pt-10 px-10'>
          {/* Footer Brand Content */}
          <div className='flex gap-10'>
            <div className='max-w-4/12 flex flex-col gap-3'>
              <Link href="/" className={`${pacifico.className} text-4xl font-bold`}>HomeConnect</Link>
              <p className='pt-2 text-gray-300'>A modern, responsive, and scalable frontend interface for the HomeConnect Smart Home System, built with Next.js App Router, TypeScript, and ShadCN UI</p>
              <ul className='flex items-center gap-4 pt-5'>
                {homeConnectSocail.map((item, index) => (
                  <li key={index}>
                    <Link href={item.href} target="_blank" rel="noopener noreferrer" className='text-2xl text-gray-300 hover:text-white transition'>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className='flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 lg:pl-10'>
              {footerWidgets.map((widget) => (
                <div key={widget.title}>
                  <h3 className='text-xl font-semibold mb-4'>{widget.title}</h3>
                  <ul className='flex flex-col gap-2'>
                    {widget.links.map((link) => (
                      <li key={link.name}>
                        <Link href={link.href} className='text-gray-300 hover:underline'>
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className='mt-8 border-t border-gray-700 py-4'>
            <div className='text-center text-sm text-gray-300'>
              &copy;{new Date().getFullYear()} <span className={`${pacifico.className}`}>HomeConnect</span>. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
