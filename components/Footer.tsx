import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  PhoneCall,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 w-full text-white py-12 px-5 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <p className="text-base font-bold text-white mb-2">FarmRide</p>
            <span className="inline-block bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-xs font-medium px-3 py-1 rounded-full mb-4">
              🌱 ...Feeding African Homes
            </span>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              A trusted digital marketplace connecting Nigerian farmers with
              buyers and transporters — making agricultural trade easier,
              faster, and fair.
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 bg-yellow-400 text-green-900 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-yellow-300 transition-colors mb-5"
            >
              Browse Marketplace →
            </Link>

            {/* Social Icons */}
            <div className="flex gap-3 mt-5">
              <Link
                target="_blank"
                href="https://www.facebook.com/profile.php?id=61575881856380"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:border-yellow-400/50 transition-colors"
              >
                <Facebook width={16} />
              </Link>
              <Link
                href="#"
                target="_blank"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:border-yellow-400/50 transition-colors"
              >
                <Instagram width={16} />
              </Link>
              <Link
                href="#"
                target="_blank"
                aria-label="Twitter"
                className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:border-yellow-400/50 transition-colors"
              >
                <Twitter width={16} />
              </Link>
              <Link
                href="#"
                target="_blank"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:border-yellow-400/50 transition-colors"
              >
                <Linkedin width={16} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-5 font-inter">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3">
              {[
                { name: "Home", href: "/" },
                { name: "Marketplace", href: "/marketplace" },
                { name: "About Us", href: "/about" },
                { name: "Contact Us", href: "/contact" },
                { name: "How It Works", href: "#how-it-works" },
                { name: "Dashboard", href: "/dashboard" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-yellow-400 transition-colors font-inter"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-5 font-inter">
              Contact Us
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
                  <MapPin width={14} className="text-yellow-400" />
                </div>
                <p className="text-sm text-gray-400 leading-relaxed font-inter">
                  House 17 Road 251 FHA Guzape, Abuja
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
                  <PhoneCall width={14} className="text-yellow-400" />
                </div>
                <div className="flex flex-col gap-1">
                  {["08163110123", "08155547663", "07080109521"].map((num) => (
                    <Link
                      key={num}
                      href={`tel:+234${num.slice(1)}`}
                      className="text-sm text-gray-400 hover:text-yellow-400 transition-colors font-inter"
                    >
                      {num}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
                  <Mail width={14} className="text-yellow-400" />
                </div>
                <Link
                 href="mailto:farmride@farmride.com.ng"
                  className="text-sm text-gray-400 hover:text-yellow-400 transition-colors font-inter"
                >
                  farmride@farmride.com.ng
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-center">
          <p className="text-xs text-gray-500 font-inter">
            © {new Date().getFullYear()} FarmRide. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 font-inter">
            Built to support agriculture in Nigeria 🇳🇬
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;