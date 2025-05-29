// src/components/Sidebar/SidebarItem.tsx
"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveView, toggleMenuExpansion } from "@/store/slices/activeViewSlice";
import { RootState } from "@/store/store";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";

interface SubMenuItem {
  label: string;
  route: string;
  pro?: boolean;
}

interface SidebarItemProps {
  item: {
    label: string;
    route: string;
    icon?: React.ReactNode;
    message?: string;
    pro?: boolean;
    children?: SubMenuItem[];
  };
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item }) => {
  const dispatch = useDispatch();
  // Read the current active view from Redux
  const activeView = useSelector((state: RootState) => state.activeView.view);
  const expandedMenus = useSelector((state: RootState) => state.activeView.expandedMenus);

  // Check if the menu is currently expanded
  const isExpanded = expandedMenus.includes(item.label.toLowerCase());
  const isActive =
    activeView === item.label.toLowerCase() ||
    (item.children && item.children.some(child => child.label.toLowerCase() === activeView));

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (item.children) {
      // Toggle only the expansion state of the menu
      dispatch(toggleMenuExpansion(item.label.toLowerCase()));
    } else {
      console.log("Parent item clicked:", item.label.toLowerCase());
      dispatch(setActiveView(item.label.toLowerCase()));
      window.history.pushState(null, "", item.route);
    }
  };



  return (
    <li>
      <a
        href={item.route}
        onClick={handleClick}
        className={`group relative flex items-center gap-3 rounded-[7px] px-3.5 py-3 font-medium duration-300 ease-in-out ${
          isActive
            ? "bg-primary/[.07] text-primary"
            : "text-dark-4 hover:bg-gray-2 hover:text-dark"
        }`}
      >
        {item.icon}
        <span>{item.label}</span>
        {item.message && (
          <span className="absolute right-11.5 top-1/2 -translate-y-1/2 rounded-full bg-red-light-6 px-1.5 py-px text-[10px] font-medium leading-[17px] text-red">
            {item.message}
          </span>
        )}
        {item.pro && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md bg-primary px-1.5 py-px text-[10px] font-medium leading-[17px] text-white">
            Pro
          </span>
        )}
        {item.children && (
          <svg
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 fill-current transition-transform ${
              isExpanded ? "" : "rotate-180"
            }`}
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.5525 7.72801C10.81 7.50733 11.1899 7.50733 11.4474 7.72801L17.864 13.228C18.1523 13.4751 18.1857 13.9091 17.9386 14.1974C17.6915 14.4857 17.2575 14.5191 16.9692 14.272L10.9999 9.15549L5.03068 14.272C4.7424 14.5191 4.30838 14.4857 4.06128 14.1974C3.81417 13.9091 3.84756 13.4751 4.13585 13.228L10.5525 7.72801Z"
              fill=""
            />
          </svg>
        )}
      </a>

      {item.children && (
        <div
          className={`transition-all duration-300 overflow-hidden ${
            !isExpanded ? "max-h-0" : "max-h-screen"
          }`}
        >
          <SidebarDropdown items={item.children} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
