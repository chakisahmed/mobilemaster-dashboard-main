// src/components/Sidebar/SidebarDropdown.tsx
"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { setActiveView } from "@/store/slices/activeViewSlice";
import { usePathname } from "next/navigation";

interface SubMenuItem {
  label: string;
  route: string;
  pro?: boolean;
}

interface SidebarDropdownProps {
  items: SubMenuItem[];
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({ items }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: SubMenuItem) => {
    e.preventDefault(); // Prevent default navigation behavior
    console.log("Dropdown item clicked:", item.label);
    // Dispatch an action to update the active view in Redux
    dispatch(setActiveView(item.label.toLowerCase()));
    // Optionally, update the URL using shallow routing if needed
    // For example: router.push(item.route, undefined, { shallow: true });
  };

  return (
    <ul className="my-2 flex flex-col gap-1.5 pl-9">
      {items.map((item, index) => (
        <li key={index}>
          <a
            href={item.route}
            onClick={(e) => handleClick(e, item)}
            className={`relative flex rounded-[7px] px-3.5 py-2 font-medium duration-300 ease-in-out ${
              pathname === item.route
                ? "bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white"
                : "text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-gray-5 dark:hover:bg-white/10 dark:hover:text-white"
            }`}
          >
            {item.label}
            {item.pro && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md bg-primary px-1.5 py-px text-[10px] font-medium leading-[17px] text-white">
                Pro
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default SidebarDropdown;
