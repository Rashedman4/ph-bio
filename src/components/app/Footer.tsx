"use client";

import Link from "next/link";
import { Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Rubik } from "next/font/google";
import Image from "next/image";

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
        // { href: "/ar/daily-video", label: "الفيديو اليومي" },
        { href: "/ar/signals", label: "الأفكار" },
        { href: "/ar/history", label: "النتائج" },
        {
          href: "/ar/fda-designation",
          label: "تصنيفات هيئة الغذاء والدواء (FDA)",
        },
        //{ href: "/ar/subscription", label: "الأشتراكات" },
      ]
    : [
        { href: "/en", label: "Home" },
        { href: "/en/ask-about-stock", label: "Ask About Stock" },
        { href: "/en/news", label: "News" },
        //  { href: "/en/daily-video", label: "Financial Calendar" },
        { href: "/en/signals", label: "Ideas" },
        { href: "/en/history", label: "History" },
        { href: "/en/fda-designation", label: "FDA Designations" },
        //{ href: "/en/subscription", label: "Subscriptions" },
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
            <div className="mt-4 flex justify-start">
              <Image
                src="/logo-transparent-1200x800.png"
                alt="BioPharmaStock Logo"
                width={150}
                height={100}
                className="hidden md:block md:w-45 md:h-30 object-contain rounded-lg  p-1 shadow"
                priority
              />
              <Image
                src="/logo-transparent-1200x800.png"
                alt="BioPharmaStock Logo"
                width={150}
                height={100}
                className="md:hidden md:w-30 md:h-20 object-contain rounded-lg  p-1 shadow"
                priority
              />
            </div>
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
              {isArabic ? "اتصل بنا" : "Contact Us"}
            </h4>

            <p className="text-sm mb-2">
              <a
                href="mailto:info@biopharmastock.com"
                className="hover:underline"
              >
                {isArabic
                  ? " البريد الإلكتروني: info@biopharmastock.com "
                  : "Email: info@biopharmastock.com"}
              </a>
            </p>

            <p className="text-sm mb-2">
              {isArabic ? (
                <>
                  رقم الهاتف:{" "}
                  <a href="tel:+971509363328" className="hover:underline">
                    <span dir="ltr">+971 50 936 3328</span>
                  </a>
                </>
              ) : (
                <a href="tel:+971509363328" className="hover:underline">
                  Phone: +971 50 936 3328
                </a>
              )}
            </p>

            {/* 🌟 Added Community link */}
            <p className="text-sm mt-3">
              <Link
                href={`/${isArabic ? "ar" : "en"}/community`}
                className="inline-flex items-center text-brightTeal font-semibold transition-colors"
              >
                <span className="hover:underline">
                  {isArabic ? "انضم إلى مجتمعنا" : "Join Our Community"}
                </span>
                <span
                  className={`ml-2 transform transition-transform group-hover:translate-x-1 ${
                    isArabic ? "rotate-180 mr-2 ml-0" : ""
                  }`}
                >
                  →
                </span>
              </Link>
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">
              {" "}
              {isArabic ? "تابعنا" : "Follow US"}
            </h4>
            <div className="flex space-x-4">
              {/*    <Button
                variant="ghost"
                size="icon"
                className="hover:text-brightTeal transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button> */}
              <a
                href="https://x.com/m_almanasrah" // replace with your actual Twitter link
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-brightTeal transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </a>
              {/*      <Button
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
              </Button> */}
            </div>
          </div>
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
