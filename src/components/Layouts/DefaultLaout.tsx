// src/components/Layouts/DefaultLayout.tsx
"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import axios from "axios";
import ActiveViewRenderer from "@/components/ActiveViewRenderer";

export default function DefaultLayout({
  children, // You can choose to use children or not.
}: {
  children?: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/isLogged")
      .then((res) => {
        console.log("res: ", res);
        setLoading(false);
      })
      .catch((err) => {
        console.log("err: ", err);
        window.location.href = "/auth/signin";
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {/* Render content based on active view from Redux */}
            <ActiveViewRenderer />
            {/* If you also want to render children, be aware that they are static */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
