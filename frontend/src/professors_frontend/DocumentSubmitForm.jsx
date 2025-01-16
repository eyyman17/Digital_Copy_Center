const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { getCSRFToken } from '../utils/csrf';

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./ProfNavbar";
import axios from "axios";

const DEPARTMENT_CHOICES = [
  "Direction d'Étude",
  "Direction des Relations d'Entreprises",
  "Recherche & Développement",
  "Direction des Relations Internationales",
  "Laboratoire d'Expertise et de Contrôle",
  "Career Center",
  "Scolarité",
  "Administration",
  "IT",
  "Direction Générale",
];

const FILIERE_CHOICES = [
  "Informatique & Management des systèmes",
  "Génie Industriel Logistique Internationale",
  "Génie Industriel Textile - Habillement",
  "Génie Industriel Chef de Produit",
  "Génie Industriel - Tronc commun",
  "Ingénierie des Textiles techniques et Intelligents",
  "Chimie et traitements des matériaux",
  "Master Spécialisé Management Produit Textile-Habillement",
  "Master Spécialisé E-logistique",
  "Master Spécialisé Distribution et Merchandising",
  "Master Spécialisé Hygiène, Sécurité Et Environnement",
  "Licence Professionnelle Développement En Habillement",
  "Licence Professionnelle Gestion De Production En Habillement",
  "Licence Professionnelle Gestion De Production Textile",
  "Licence Professionnelle Gestion De La Chaine Logistique",
  "Licence Professionnelle Gestion Achat & Sourcing",
  "Cycle Technicien Spécialisé",
  "RSA (Rien à signaler)",
];

const FORMAT_CHOICES = ["A4", "A3"];
const COLOR_CHOICES = ["Blanc/Noir", "Couleurs"];
const RECTO_VERSO_CHOICES = ["Recto", "Recto-Verso"];

const DocumentSubmitForm = () => {
  const [formData, setFormData] = useState({
    impression_pour: "",
    departement: "Direction d'Étude",
    filiere: "",
    n_copies: 1,
    format: "A4",
    recto_verso: "recto",
    couleur: "Blanc/Noir",
    document_file: null,
  });
  
  const [professorName, setProfessorName] = useState("");
  const [filiereDisabled, setFiliereDisabled] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  useEffect(() => {
    const fetchProfessorName = async () => {
      try {
        console.log("API_BASE_URL:", API_BASE_URL);
        const response = await axios.get(`${API_BASE_URL}/professors/current-professor/`, {
          withCredentials: true,
        });
        setProfessorName(response.data.name || "Professeur Anonyme");
      } catch (error) {
        console.error("Error fetching professor name:", error);
        setProfessorName("Professeur Anonyme");
      }
    };


    fetchProfessorName();
  }, []);

  // Automatically update filiereDisabled and validate submit button
  useEffect(() => {
    const isDirectionDEtude = formData.departement === "Direction d'Étude";
    setFiliereDisabled(!isDirectionDEtude);

    // Automatically set Filière to "RSA (Rien à signaler)" if not Direction d'Étude
    if (!isDirectionDEtude) {
      setFormData((prevState) => ({
        ...prevState,
        filiere: "RSA (Rien à signaler)",
      }));
    }

    // Validate the submit button
    const { impression_pour, document_file, filiere, departement } = formData;
    const isFiliereValid =
      departement === "Direction d'Étude" ? !!filiere : true;
    setSubmitDisabled(!(impression_pour && document_file && isFiliereValid));
  }, [formData.departement, formData.impression_pour, formData.document_file, formData.filiere]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      document_file: e.target.files[0],
    }));
  };

  const handleImpressionPourClick = (value) => {
    setFormData((prevState) => ({ ...prevState, impression_pour: value }));
  };

  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    for (const key in formData) {
      submissionData.append(key, formData[key]);
    }

    try {
      const csrfToken = getCSRFToken(); // Fetch the CSRF token
      if (!csrfToken) {
        throw new Error("CSRF token not found");
      }

      const response = await axios.post(
        `${API_BASE_URL}/professors/document_submit/`,
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrfToken, // Pass the CSRF token in the header
          },
          withCredentials: true, // Ensure cookies are included for authentication
        }
      );

      // Navigate to document_history with the success message
      navigate("/professors/document_history/", {
        state: {
          successMessage: response.data.message, // Pass the success message
        },
      });
    } catch (error) {
      console.error("Error submitting document:", error);
      alert("Erreur lors de la soumission du document.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-center text-2xl font-bold text-blue-700 mb-6">
            Formulaire de Commande
          </h2>
          {/* Professor Name */}
          <div className="text-center mb-6">
            <p className="text-lg font-medium text-gray-700">
              Professeur: <span className="text-blue-600">{professorName}</span>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Impression Pour */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Impression Pour:
              </label>
              <div className="flex justify-center space-x-8">
                {["Examen", "Cours", "Document"].map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => handleImpressionPourClick(option)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                      formData.impression_pour === option
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    } hover:bg-blue-400 hover:text-white transition`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Département */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Département:
              </label>
              <select
                name="departement"
                value={formData.departement}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              >
                {DEPARTMENT_CHOICES.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Filière */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filière:
              </label>
              <select
                name="filiere"
                value={formData.filiere}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                disabled={filiereDisabled}
              >
                {filiereDisabled ? (
                  <option value="RSA (Rien à signaler)">RSA (Rien à signaler)</option>
                ) : (
                  <>
                    <option value="">Sélectionnez une filière</option>
                    {FILIERE_CHOICES.map((filiere) => (
                      <option key={filiere} value={filiere}>
                        {filiere}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* Remaining Form Fields */}
            {[{ name: "n_copies", label: "Nombre de Copies:", type: "number", min: 1 },
              { name: "format", label: "Format:", options: FORMAT_CHOICES },
              { name: "recto_verso", label: "Type d'impression:", options: RECTO_VERSO_CHOICES },
              { name: "couleur", label: "Couleur:", options: COLOR_CHOICES },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                {field.type ? (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    min={field.min}
                    className="w-full p-2 border rounded-lg"
                  />
                ) : (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Télécharger le Document:
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-lg cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={submitDisabled}
                className={`w-full py-2 rounded-lg text-white font-bold ${
                  submitDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500"
                } transition`}
              >
                Soumettre le Document
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentSubmitForm;