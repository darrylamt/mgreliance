import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin, Twitter } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const services = [
  "Residential Sales",
  "Commercial Leasing",
  "Land Acquisition",
  "Property Management",
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 - Logo + Tagline */}
          <div className="space-y-4">
            <Link href="/">
              <span className="font-playfair text-2xl font-bold text-white">
                MG Reliance
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mt-3">
              Your Trusted Partner in Residential Real Estate. Serving Greater
              Accra with integrity and expertise since 2010.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 pt-2">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="font-playfair text-lg font-semibold text-accent mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 text-sm hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Services */}
          <div>
            <h3 className="font-playfair text-lg font-semibold text-accent mb-5">
              Our Services
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="text-white/70 text-sm hover:text-accent transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact Info */}
          <div>
            <h3 className="font-playfair text-lg font-semibold text-accent mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-accent mt-0.5 shrink-0" />
                <span className="text-white/70 text-sm">
                  East Legon, Accra, Ghana
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-accent shrink-0" />
                <a
                  href="tel:+233244274630"
                  className="text-white/70 text-sm hover:text-accent transition-colors"
                >
                  +233 244 27 4630
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-accent shrink-0" />
                <a
                  href="mailto:info@mgrelianceproperty.com"
                  className="text-white/70 text-sm hover:text-accent transition-colors"
                >
                  info@mgrelianceproperty.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-sm">
            © 2025 MG Reliance Property Developers. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            mgrelianceproperty.com
          </p>
        </div>
      </div>
    </footer>
  );
}
