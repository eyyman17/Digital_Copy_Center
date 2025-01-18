import React from "react";
import DirectionSidebar from "./DirectionSidebar";

import imsLogo from "../assets/ims_logo.png";

const DirectionLayout = ({ children, pageTitle }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <DirectionSidebar />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-100 p-3 ">
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