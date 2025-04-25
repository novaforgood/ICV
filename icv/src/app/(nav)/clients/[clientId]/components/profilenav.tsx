"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";



export default function ProfileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { clientId } = useParams();

  const tabs = [
    { name: "Profile", href: `/clients/${clientId}` },
    { name: "Background", href: `/clients/${clientId}/background` },
    { name: "Family", href: `/clients/${clientId}/family` },
    { name: "Services", href: `/clients/${clientId}/services` },
    { name: "Documents", href: `/clients/${clientId}/documents` },
    { name: "Check-Ins", href: `/clients/${clientId}/checkins` },
  ];

  return (
    <div className=" border-gray-300 w-full mt-4">
      <div className="flex justify-start space-x-8 px-4">
        {tabs.map((tab) => (
          <Link key={tab.name} onClick={() => router.push(tab.href)} href={tab.href} className="relative group pb-2 text-lg font-medium">
            <span
              className={`${
                pathname === tab.href
                  ? "text-black px-10 font-bold border-blue-500"
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

