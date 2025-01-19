const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 

import { getCSRFToken } from "../utils/csrf";
import axios from "axios";


import esithLogo from "../assets/esith_logo.png";
import imsLogo from "../assets/ims_logo.png";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Get CSRF token
      const csrfToken = getCSRFToken();
      if (!csrfToken) {
        throw new Error("CSRF token not found");
      }
  
      // Send logout request
      const response = await axios.post(
        `${API_BASE_URL}/accounts/logout/`, // Adjust the URL if necessary
        {}, // No body required for logout
        {
          headers: {
            "X-CSRFToken": csrfToken, // Include CSRF token in the headers
          },
          withCredentials: true, // Include cookies for session management
        }
      );
  
      if (response.data.success) {
        // Redirect to login page
        navigate("/accounts/login/");
      } else {
        console.error("Unexpected response during logout:", response.data);
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <nav
      className="relative overflow-hidden rounded-xl border"
      style={{ borderColor: "#b0cbd4" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to right, #04527a, #2c7494)",
          backdropFilter: "blur(10px)",
        }}
      ></div>

      {/* Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute h-4 w-4 rounded-full bg-[#c3d404]/20 animate-float top-4 left-[10%]"></div>
        <div className="absolute h-3 w-3 rounded-full bg-[#7dcf44]/20 animate-float top-8 left-[20%] [animation-delay:0.5s]"></div>
        <div className="absolute h-5 w-5 rounded-full bg-[#407c9c]/20 animate-float top-6 left-[50%] [animation-delay:1s]"></div>
        <div className="absolute h-6 w-6 rounded-full bg-[#78a8bc]/20 animate-float top-2 left-[60%] [animation-delay:1.5s]"></div>
        <div className="absolute h-5 w-5 rounded-full bg-[#04527a]/20 animate-float top-10 left-[15%] [animation-delay:0.8s]"></div>
        <div className="absolute h-6 w-6 rounded-full bg-[#2c7494]/20 animate-float top-16 left-[70%] [animation-delay:1.2s]"></div>
        <div className="absolute h-3 w-3 rounded-full bg-[#b0cbd4]/20 animate-float top-12 left-[30%] [animation-delay:0.4s]"></div>
        <div className="absolute h-4 w-4 rounded-full bg-[#346e8e]/20 animate-float top-6 left-[85%] [animation-delay:0.7s]"></div>
        <div className="absolute h-6 w-6 rounded-full bg-[#042454]/20 animate-float top-14 left-[80%] [animation-delay:1.4s]"></div>
        <div className="absolute h-5 w-5 rounded-full bg-[#043261]/20 animate-float top-4 left-[40%] [animation-delay:1s]"></div>
      </div>

      {/* Navbar Content */}
      <div className="relative px-4 sm:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with Glow */}
          <div className="flex items-center space-x-10 group">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-lg blur-md group-hover:blur-xl transition-all duration-300"
                style={{
                  background: "linear-gradient(to right, #c3d404, #7dcf44)",
                }}
              ></div>
              <img
                src={esithLogo}
                alt="Logo Esith"
                className="relative w-8 sm:w-16 h-8 sm:h-10 transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white">
              Portail des Professeurs
            </span>
          </div>

          {/* Desktop Navigation Links and Buttons */}
          <div className="hidden md:flex items-center space-x-10">
            <Link
              to="/professors/document_submit/"
              className="relative group"
              style={{ color: "#b0cbd4" }}
            >
              <span className="group-hover:text-[#c3d404] transition-colors duration-300">
                Formulaire de Commande
              </span>
              <div
                className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                style={{ background: "linear-gradient(to right, #7dcf44, #c3d404)" }}
              ></div>
            </Link>
            <Link
              to="/professors/document_history/"
              className="relative group"
              style={{ color: "#b0cbd4" }}
            >
              <span className="group-hover:text-[#c3d404] transition-colors duration-300">
                Mes Commandes
              </span>
              <div
                className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                style={{ background: "linear-gradient(to right, #7dcf44, #c3d404)" }}
              ></div>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-[#042454] hover:bg-[#2c7494] text-white font-bold transition-colors duration-300"
            >
              Déconnexion
            </button>

            {/* IMS Logo */}
            <img
              src={imsLogo}
              alt="IMS Logo"
              className="w-8 sm:w-16 h-8 sm:h-12"
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative group"
            aria-label="Toggle mobile menu"
          >
            <div className="relative p-2 bg-blue-950 rounded leading-none">
              <svg
                className="w-6 h-6 text-blue-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </div>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="relative mt-4 md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-900/50 backdrop-blur-sm rounded-lg border border-blue-500/10">
              <Link
                to="/professors/document_submit/"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-blue-800/50 transition-all duration-200"
              >
                Formulaire de Commande
              </Link>
              <Link
                to="/professors/document_history/"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-blue-800/50 transition-all duration-200"
              >
                Mes Commandes
              </Link>

              {/* Logout Button and IMS Logo in Mobile Menu */}
              <button
                onClick={() => {
                  console.log("Logging out...");
                }}
                className="w-full px-3 py-2 mt-2 rounded bg-[#042454] hover:bg-[#2c7494] text-white font-bold transition-colors duration-300"
              >
                Logout
              </button>
              <div className="flex justify-center mt-3">
                <img
                  src={imsLogo}
                  alt="IMS Logo"
                  className="w-20 sm:w-10 h-16 sm:h-10"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;