const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { getCSRFToken } from "../utils/csrf";

import esithLogo from "../assets/esith_logo.png";

import dashboard from "../assets/dashboard-icon.png";
import historique from "../assets/historique-icon.png";
import professors from "../assets/professors-icon.png";
import addProfessor from "../assets/add-professor-icon.png";

const Sidebar = () => {
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
    <div className="min-h-screen w-64 bg-gray-700 text-white flex flex-col">
      {/* Sidebar Header */}
      <div className="mt-10 flex flex-col items-center">
        <img src={esithLogo} alt="Logo Esith" className="w-22 h-20" />
      </div>

      {/* Navigation Buttons */}
      <ul className="mt-3 space-y-3">
        {/* Dashboard Button */}
        <li>
          <NavLink
            to="/direction/dashboard/"
            className={({ isActive }) =>
              `relative flex items-center space-x-2 rounded-md py-4 px-10 cursor-pointer ${
                isActive ? "bg-slate-600 text-white" : "text-gray-300 hover:bg-slate-600"
              }`
            }
          >
            <img src={dashboard} alt="Dashboard Icon" className="w-10 h-10" />
            <span>Dashboard</span>
          </NavLink>
        </li>

        {/* Historique des Commandes Button */}
        <li>
          <NavLink
            to="/direction/direction_history/"
            className={({ isActive }) =>
              `relative flex items-center space-x-2 rounded-md py-4 px-10 cursor-pointer ${
                isActive ? "bg-slate-600 text-white" : "text-gray-300 hover:bg-slate-600"
              }`
            }
          >
            <img src={historique} alt="Historique Icon" className="w-10 h-10" />
            <span>Historique des Commandes</span>
          </NavLink>
        </li>

        {/* Liste des Professeurs Button */}
        <li>
          <NavLink
            to="/direction/professors_list/"
            className={({ isActive }) =>
              `relative flex items-center space-x-2 rounded-md py-4 px-10 cursor-pointer ${
                isActive ? "bg-slate-600 text-white" : "text-gray-300 hover:bg-slate-600"
              }`
            }
          >
            <img src={professors} alt="Professors Icon" className="w-10 h-10" />
            <span>Liste des Professeurs</span>
          </NavLink>
        </li>

        {/* Ajouter un Professeur Button */}
        <li>
          <NavLink
            to="/direction/add_professor/"
            className={({ isActive }) =>
              `relative flex items-center space-x-2 rounded-md py-4 px-10 cursor-pointer ${
                isActive ? "bg-slate-600 text-white" : "text-gray-300 hover:bg-slate-600"
              }`
            }
          >
            <img src={addProfessor} alt="Add Professor Icon" className="w-8 h-8" />
            <span>Ajouter un Professeur</span>
          </NavLink>
        </li>
      </ul>

      {/* Logout Button */}
      <div className="my-6 mt-auto ml-10">
        <button
          className="flex items-center space-x-2 rounded-md py-4 px-10 bg-red-500 text-white hover:bg-red-600"
          onClick={handleLogout}
        >
          <span>Se Déconnecter</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
