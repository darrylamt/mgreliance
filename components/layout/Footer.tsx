import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";

const quickLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Properties" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const services = [
  "Residential Sales",
  "Commercial Leasing",
  "Land Acquisition",
  "Property Management",
];

const socials = [
  { icon: Instagram, label: "Instagram" },
  { icon: Facebook, label: "Facebook" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Twitter, label: "Twitter" },
];

export default function Footer() {
  return (
    <footer className="bg-background border-t border-line">
      <div className="container-page py-16">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-5 space-y-5">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.jpeg"
                alt="MG Reliance Property Developers"
                width={160}
                height={64}
                className="h-11 w-auto object-contain mix-blend-multiply"
              />
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              Your trusted partner in residential real estate. Serving Greater
              Accra with integrity and expertise since 2010.
            </p>
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/30 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-text-main mb-4">Company</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-text-secondary text-sm hover:text-text-main transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-text-main mb-4">Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link href="/services" className="text-text-secondary text-sm hover:text-text-main transition-colors">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-3">
            <h3 className="text-sm font-semibold text-text-main mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-text-secondary">East Legon, Accra, Ghana</li>
              <li>
                <a href="tel:+233244274630" className="text-text-secondary hover:text-text-main transition-colors">
                  +233 244 27 4630
                </a>
              </li>
              <li>
                <a href="mailto:info@mgrelianceproperties.com" className="text-text-secondary hover:text-text-main transition-colors break-all">
                  info@mgrelianceproperties.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-secondary text-xs">
            © {new Date().getFullYear()} MG Reliance Property Developers. All rights reserved.
          </p>
          <p className="text-text-secondary/70 text-xs">mgrelianceproperties.com</p>
        </div>
      </div>
    </footer>
  );
}
