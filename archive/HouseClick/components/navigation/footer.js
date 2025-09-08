const footerNavigation = {
  shop: [
    { name: "Leasehold", href: "#" },
    { name: "Freehold", href: "#" },
    { name: "Detached", href: "#" },
    { name: "Semi-detached", href: "#" },
    { name: "Terraced", href: "#" },
    { name: "Flats", href: "#" },
  ],
  company: [],
  connect: [
    { name: "Contact Us", href: "#" },
    { name: "Twitter", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "Pinterest", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer aria-labelledby="footer-heading" className="bg-neutral-900">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid grid-cols-2 gap-8 xl:col-span-2">
            <div className="space-y-12 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
              <div>
                <h3 className="text-sm font-medium text-white">Houses</h3>
                <ul role="list" className="mt-6 space-y-6">
                  {footerNavigation.shop.map((item) => (
                    <li key={item.name} className="text-sm">
                      <a
                        href={item.href}
                        className="text-gray-300 hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-725 py-10">
          <p className="text-sm text-gray-400">
            Copyright &copy; 2023 HouseClick, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
