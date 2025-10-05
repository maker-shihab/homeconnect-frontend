import Link from 'next/link';

export default function Footer() {
  const homeConnectSocail = [
    {
      name: "GitHub",
      href: ""
    }, {
      name: "LinkedIn",
      href: ""
    }, {
      name: "Twitter",
      href: ""
    },
    {
      name: "Facebook",
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
    <footer>
      <div className='container mx-auto py-10'>
        <div className='bg-black text-white p-6 rounded-3xl'>
          {/* Footer Brand Content */}
          <div className='flex gap-10'>
            <div className='max-w-4/12 flex flex-col gap-3'>
              <Link href="/" className='text-4xl font-black'>HomeConnect</Link>
              <p>A modern, responsive, and scalable frontend interface for the HomeConnect Smart Home System, built with Next.js App Router, TypeScript, and ShadCN UI</p>
              <ul className='flex items-center gap-4'>
                {homeConnectSocail.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} target="_blank" rel="noopener noreferrer">
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
                        <Link href={link.href} className='hover:underline'>
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className='mt-6 border-t border-gray-700 pt-5'>
            <div className='text-center text-sm text-gray-400'>
              &copy; {new Date().getFullYear()} HomeConnect. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
