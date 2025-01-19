import React from "react";
import DirectionSidebar from "./DirectionSidebar";
import imsLogo from "../assets/ims_logo.png";

const DirectionLayout = ({ children, pageTitle }) => {
  return (
    <div className="flex">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen">
        <DirectionSidebar />
      </div>

      {/* Main Content Area - with left margin to account for fixed sidebar */}
      <div className="flex-1 ml-64 min-h-screen"> {/* Adjust ml-64 based on your sidebar width */}
        {/* Header - sticky to keep it at top */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-gray-100 p-3">
          <h1 className="text-2xl font-bold text-gray-700 ml-20">{pageTitle}</h1>
          <img src={imsLogo} alt="IMS Logo" className="h-12" />
        </div>

        {/* Page Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DirectionLayout;