"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Check ins", href: "/check-ins" },
    { name: "Bio", href: "/bio" },
    { name: "Documents", href: "/documents" },
  ];

  return (
    <div className=" border-gray-300 w-full mt-4">
      <div className="flex justify-start space-x-8 px-4">
        {tabs.map((tab) => (
          <Link key={tab.name} href={tab.href} className="relative group pb-2 text-lg font-medium">
            <span
              className={`${
                pathname === tab.href
                  ? "text-black px-10 font-bold border-b-5 border-blue-500"
                  : "text-gray-500 px-10 hover:text-blue-400 relative"
              }`}
            >
              {tab.name}
              {/* hovering effect is here :0 */}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 hx-5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

