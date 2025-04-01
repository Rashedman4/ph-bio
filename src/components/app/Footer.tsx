"use client";

import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Rubik } from "next/font/google";

// Import Rubik with Arabic subset
const rubik = Rubik({
  weight: ["400"], // Define font weights
  subsets: ["arabic"], // Include Arabic subset
});
const Footer = () => {
  const pathName = usePathname();
  const langPrefix = pathName ? pathName.split("/")[1] : "en";
  const isArabic = langPrefix === "ar";

  const quickLinks = isArabic
    ? [
        { href: "/ar", label: "الصفحة الرئيسية" },
        { href: "/ar/ask-about-stock", label: "اسأل عن سهم" },
        { href: "/ar/news", label: "الأخبار" },
        { href: "/ar/daily-video", label: "الفيديو اليومي" },
        { href: "/ar/signals", label: "الأفكار" },
        { href: "/ar/history", label: "النتائج" },
        { href: "/ar/subscription", label: "الأشتراكات" },
      ]
    : [
        { href: "/en", label: "Home" },
        { href: "/en/ask-about-stock", label: "Ask About Stock" },
        { href: "/en/news", label: "News" },
        { href: "/en/daily-video", label: "Financial Calendar" },
        { href: "/en/signals", label: "Ideas" },
        { href: "/en/history", label: "History" },
        { href: "/en/subscription", label: "Subscriptions" },
      ];

  return (
    <footer
      className={`bg-royalBlue text-pureWhite ${
        isArabic ? `dir-rtl text-right ${rubik.className}` : ""
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Bio Pharma Stock</h3>
            <p className="text-sm">
              {isArabic
                ? "تمكين المستثمرين برؤى متطورة حول أسواق الأدوية."
                : "Empowering investors with cutting-edge insights into pharmaceutical markets."}
            </p>
            <p className="text-sm mt-2">
              {isArabic
                ? "النجم العالي لتصميم الانظمة ذ.م.م، الإمارات العربية المتحدة، أبو ظبي"
                : "ALNJAM ALAALI SOFTWARE DESIGN CO. L.L.C, UAE, Abu Dhabi"}
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">
              {" "}
              {isArabic ? "روابط سريعة" : "Quick Links"}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-brightTeal transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">
              {" "}
              {isArabic ? "اتصل بنا" : "Contact Us"}
            </h4>
            <p className="text-sm mb-2">
              {" "}
              {isArabic
                ? " البريد الإلكتروني: info@biopharmastock.com "
                : "Email: info@biopharmastock.com"}
            </p>
            {/*   <p className="text-sm">
              {isArabic
                ? " رقم الهاتف: info@biopharmastock.com"
                : "Phone: info@biopharmastock.com"}
            </p> */}
          </div>
          {/*  <div>
            <h4 className="text-md font-semibold mb-4">
              {" "}
              {isArabic ? "تابعنا" : "Follow US"}
            </h4>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-brightTeal transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-brightTeal transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-brightTeal transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-brightTeal transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
            </div>
          </div> */}
        </div>
        <div className="mt-8 pt-4 border-t border-pureWhite/20 text-center text-sm">
          <p>
            {isArabic
              ? `© ${new Date().getFullYear()} Bio Pharma Stock. جميع الحقوق محفوظة. `
              : `© ${new Date().getFullYear()} Bio Pharma Stock. All rights reserved. `}
            <Link
              href={`/${langPrefix}/policy`}
              className="text-brightTeal hover:underline"
            >
              {isArabic ? "السياسة" : "Policy"}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
