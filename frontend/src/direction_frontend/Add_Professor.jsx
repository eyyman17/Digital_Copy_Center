
import DirectionLayout from "./DirectionLayout";

import React, { useState } from "react";
import axios from "axios";
import { getCSRFToken } from "../utils/csrf";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Add_Professor = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages and errors
    setErrors({});
    setSuccessMessage("");

    try {
      // Get the CSRF token
      const csrfToken = getCSRFToken();

      // Make the POST request to add a professor
      const response = await axios.post(
        `${API_BASE_URL}/direction/add_professor/`,
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
        },
        {
          withCredentials: true, // Include credentials (cookies) for CSRF and authentication
          headers: {
            "X-CSRFToken": csrfToken, // Add the CSRF token to the headers
          },
        }
      );

      // Success: Display success message and reset the form
      setSuccessMessage("Professeur ajouté avec succès !");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
      });
    } catch (error) {
      console.error("Error adding professor:", error);

      if (error.response && error.response.data.errors) {
        // If the backend returns field-specific errors
        const apiErrors = error.response.data.errors;
        const formattedErrors = {};

        Object.keys(apiErrors).forEach((key) => {
          formattedErrors[key] = apiErrors[key].join(", ");
        });

        setErrors(formattedErrors);
      } else {
        // Fallback for unexpected errors
        setErrors({ global: "Une erreur s'est produite. Veuillez réessayer." });
      }
    }
  };

  return (
    <DirectionLayout pageTitle="Ajouter un Professeur">
      <div className="container mx-auto mt-10 max-w-3xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Ajouter un Professeur</h1>
          <p className="text-gray-600 mt-2">
            Veuillez remplir le formulaire ci-dessous pour ajouter un nouveau professeur.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 text-green-800 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {/* Global Error Message */}
        {errors.global && (
          <div className="bg-red-100 text-red-800 px-4 py-3 rounded mb-6">
            {errors.global}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-4 mb-6">
            Formulaire de Création
          </h2>
          <form onSubmit={handleSubmit}>
            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  autoComplete="off"
                  onChange={handleChange}
                  className={`mt-2 block w-full rounded-lg shadow-md border ${
                    errors.first_name ? "border-red-500" : "border-gray-300"
                  } focus:ring-blue-500 focus:border-blue-500 px-4 py-3 text-lg`}
                  placeholder="Entrez le prénom"
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  autoComplete="off"
                  onChange={handleChange}
                  className={`mt-2 block w-full rounded-lg shadow-md border ${
                    errors.last_name ? "border-red-500" : "border-gray-300"
                  } focus:ring-blue-500 focus:border-blue-500 px-4 py-3 text-lg`}
                  placeholder="Entrez le nom"
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                autoComplete="off"
                onChange={handleChange}
                className={`mt-2 block w-full rounded-lg shadow-md border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:ring-blue-500 focus:border-blue-500 px-4 py-3 text-lg`}
                placeholder="exemple@domain.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-lg"
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
    </DirectionLayout>
  );
};

export default Add_Professor;