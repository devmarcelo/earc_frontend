import React from "react";
import Header from "./Header"; // Adjust path if needed
import Sidebar from "./Sidebar"; // Adjust path if needed

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {/* Main content area with padding and scroll */}
        <main className="ml-64 flex-1 overflow-y-auto p-6">
          {" "}
          {/* ml-64 matches sidebar width */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
