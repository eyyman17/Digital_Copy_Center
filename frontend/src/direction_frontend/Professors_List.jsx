import React, { useState, useEffect } from "react";
import DirectionLayout from "./DirectionLayout";
import axios from "axios";

import { getCSRFToken } from "../utils/csrf";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Professors_List = () => {
  const [professors, setProfessors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProfessors, setFilteredProfessors] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProfessors = async (page = 1, query = "") => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page,
        ...(query && { search_query: query }),
      });

      const response = await axios.get(`${API_BASE_URL}/direction/professors_list/?${params.toString()}`, {
        withCredentials: true,
      });

      setProfessors(response.data.professors);
      setFilteredProfessors(response.data.professors);
      setCurrentPage(response.data.current_page);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching professors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessors();
  }, []);

  const handleSearchChange = async (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);

    if (!query) {
      setSuggestions([]);
      fetchProfessors(1); // Reset to all professors
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/direction/professors_list/?search_query=${encodeURIComponent(query)}`,
        { withCredentials: true }
      );

      setSuggestions(response.data.professors); // Display suggestions
    } catch (error) {
      console.error("Error fetching professor suggestions:", error);
    }
  };

  const handleSuggestionSelect = (professor) => {
    setSearchQuery(`${professor.first_name} ${professor.last_name}`); // Show name in search input
    setSuggestions([]);
    fetchProfessors(1, professor.email); // Fetch specific professor by email
  };

  const handlePageChange = (newPage) => {
    fetchProfessors(newPage, searchQuery);
  };

  const handleDelete = async (professorId) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce professeur ?");
    if (!confirmDelete) return;
  
    try {
      // Get CSRF token from cookies
      const csrfToken = getCSRFToken();
  
      // Send DELETE request with CSRF token in the headers
      await axios.delete(`${API_BASE_URL}/direction/delete_professor/${professorId}/`, {
        withCredentials: true, // Include cookies for session authentication
        headers: {
          "X-CSRFToken": csrfToken, // Pass the CSRF token to Django
        },
      });
  
      // Update the list after deletion
      fetchProfessors(currentPage, searchQuery);
      alert("Professeur supprimé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression du professeur :", error);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <DirectionLayout pageTitle="Liste des Professeurs">
      {/* Search Bar */}
      <div className="mx-auto max-w-screen-lg px-4 py-5 sm:px-8">
        <div className="flex items-center justify-between pb-0">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Entrer le nom ou l'email du professeur..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded-lg mt-1 max-h-40 overflow-y-auto w-full">
                {suggestions.map((professor) => (
                  <li
                    key={professor.id}
                    onClick={() => handleSuggestionSelect(professor)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  >
                    {professor.first_name} {professor.last_name} ({professor.email})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={() => fetchProfessors(1)} // Reset filters
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Professors Table */}
      <div className="overflow-y-hidden rounded-lg border">
        <table className="table-auto w-full border-collapse bg-white">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Nom Complet</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-center">Suppression</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Chargement...
                </td>
              </tr>
            ) : filteredProfessors.length > 0 ? (
              filteredProfessors.map((professor, index) => (
                <tr key={professor.id} className="border-b">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{professor.first_name} {professor.last_name}</td>
                  <td className="px-4 py-2">{professor.email}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(professor.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Aucun professeur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:bg-gray-100"
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <p>
          Page {currentPage} sur {totalPages}
        </p>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:bg-gray-100"
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>
    </DirectionLayout>
  );
};

export default Professors_List;