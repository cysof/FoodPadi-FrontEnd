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
    <footer className="bg-gray-900 w-full text-white py-10 px-5 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">About Us</h3>
          <p className="text-sm leading-relaxed">
            We&apos;re building a trusted digital marketplace that connects
            Nigerian farmers with buyers and transporters—making agricultural
            trade easier, faster, and fair.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/marketplace" className="hover:text-primary">
                Marketplace
              </Link>
            </li>
            <li>
              <Link href="#how-it-works" className="hover:text-primary">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="#waitlist" className="hover:text-primary">
                Join Waitlist
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact</h3>
          <p className={`text-sm flex items-center gap-2`}>
            <MapPin width={16} /> House 17 Road 251 FHA Guzape
          </p>
          <div className={`text-sm flex gap-2`}>
            <PhoneCall className="shrink-0" width={16} />{" "}
            <div className={`flex items-center flex-wrap gap-2`}>
              <Link
                className={`hover:text-primary`}
                href={`tel:+2349074366942`}
              >
                09074366942,{" "}
              </Link>
              <Link
                className={`hover:text-primary`}
                href={`tel:+2349169029904`}
              >
                09169029904,{" "}
              </Link>
              <Link
                className={`hover:text-primary`}
                href={`tel:+2347080109521`}
              >
                07080109521
              </Link>
            </div>
          </div>
          <p className={`text-sm flex items-center gap-2`}>
            <Mail width={16} />{" "}
            <Link
              className={`hover:text-primary`}
              href={`mailto:microfoodbankltd@gmail.com`}
            >
              microfoodbankltd@gmail.com
            </Link>
          </p>
        </div>

        {/* Newsletter + Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Join Waitlist</h3>

          <Link
            target="_blank"
            href={`https://chat.whatsapp.com/CuueYeE9cQnJkgYgSLUDHC`}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md inline-block"
          >
            Join Now
          </Link>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            <Link
              target="_blank"
              href="https://www.facebook.com/profile.php?id=61575881856380"
              aria-label="Facebook"
              className="hover:text-primary"
            >
              <Facebook width={20} />
            </Link>
            <Link
              href="#"
              target="_blank"
              aria-label="Instagram"
              className="hover:text-primary"
            >
              <Instagram width={20} />
            </Link>
            <Link
              href="#"
              target="_blank"
              aria-label="Twitter"
              className="hover:text-primary"
            >
              <Twitter width={20} />
            </Link>
            <Link
              href="#"
              target="_blank"
              aria-label="LinkedIn"
              className="hover:text-primary"
            >
              <Linkedin width={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-10 border-t border-gray-700 flex flex-col items-center pt-5 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Micro FoodBank. All rights reserved.</p>
        <p>Built to support agriculture in Nigeria.</p>
      </div>
    </footer>
  );
};

export default Footer;
