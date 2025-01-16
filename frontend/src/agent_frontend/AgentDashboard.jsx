import { getCSRFToken } from '../utils/csrf';

import React, { useEffect, useState } from "react";
import Navbar from "./AgentNavbar";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AgentDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/agent/dashboard/`, {
          withCredentials: true,
        });
        console.log("Documents fetched:", response.data.documents);
  
        // Extract the relevant data from the response
        const { documents, current_page, total_pages } = response.data;
  
        setDocuments(documents || []); // Ensure documents is an array
        setFilteredDocuments(documents || []); // Set filteredDocuments initially to all documents
        setCurrentPage(current_page || 1); // Set the current page
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchDocuments();
  }, []);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/agent/search_professor/?q=${encodeURIComponent(query)}`, {
        withCredentials: true,
      });
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching professor suggestions:", error);
    }
  };

  const handleDateFilter = () => {
    const filtered = documents.filter((doc) => {
      const docDate = new Date(doc.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (
        (!start || docDate >= start) &&
        (!end || docDate <= end) &&
        (status ? doc.validation_impression === status : true) &&
        (searchQuery ? doc.professeur.email.includes(searchQuery) : true)
      );
    });

    setFilteredDocuments(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = async (page) => {
    if (page > 0 && page <= totalPages) {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/agent/dashboard/?page=${page}`, {
          withCredentials: true,
        });
        const { documents, current_page } = response.data;
  
        setDocuments(documents || []);
        setFilteredDocuments(documents || []);
        setCurrentPage(current_page || 1);
      } catch (error) {
        console.error("Error fetching page:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSendEmail = async (docId) => {
    try {
      const csrfToken = getCSRFToken(); // Fetch the CSRF token
      await axios.post(
        `${API_BASE_URL}/agent/mark_as_printed/${docId}/`,
        {}, // Empty body if no payload is required
        {
          withCredentials: true, // Ensure cookies are included in the request
          headers: {
            'X-CSRFToken': csrfToken, // Include CSRF token in the headers
          },
        }
      );
      alert("Email envoyé avec succès !");
      // Update the status dynamically in state
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.id === docId
            ? { ...doc, status: "Imprimé" } // Update the status to "Imprimé"
            : doc
        )
      );
      setFilteredDocuments((prevFiltered) =>
        prevFiltered.map((doc) =>
          doc.id === docId
            ? { ...doc, status: "Imprimé" } // Update the status in filteredDocuments
            : doc
        )
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
    }
  };

  const [codes, setCodes] = useState({});

  const handleCodeInputChange = (e, docId) => {
    setCodes((prevCodes) => ({
        ...prevCodes,
        [docId]: e.target.value,
    }));
    };

  
    const handleValidateCode = async (docId) => {
        try {
          const csrfToken = getCSRFToken(); // Fetch the CSRF token
          const enteredCode = codes[docId];
          const response = await axios.post(
            `${API_BASE_URL}/agent/validate_and_mark_recupere/${docId}/`,
            { code: enteredCode }, // Pass the code as JSON
            {
              withCredentials: true, // Ensure cookies are included in the request
              headers: {
                'X-CSRFToken': csrfToken, // Include CSRF token in the headers
              },
            }
          );
      
          if (response.data.success) {
            alert("Code validé avec succès !");
            // Update the status dynamically in state
            setDocuments((prevDocuments) =>
              prevDocuments.map((doc) =>
                doc.id === docId
                  ? { ...doc, status: "Recupéré" } // Update the status to "Recupéré"
                  : doc
              )
            );
            setFilteredDocuments((prevFiltered) =>
              prevFiltered.map((doc) =>
                doc.id === docId
                  ? { ...doc, status: "Recupéré" } // Update the status in filteredDocuments
                  : doc
              )
            );
          } else {
            alert("Code invalide, veuillez réessayer.");
          }
        } catch (error) {
          console.error("Erreur lors de la validation du code:", error);
        }
      };

    

  const totalPages = Math.ceil((filteredDocuments?.length || 0) / rowsPerPage);

  const currentDocuments = Array.isArray(filteredDocuments)
    ? filteredDocuments.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      )
    : [];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="w-screen">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="loader animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="mx-auto mt-6 max-w-screen-xl px-2">
            {/* Filter Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-100 p-4 rounded-lg">
              <div className="flex flex-col w-full md:w-auto">
                <label htmlFor="professorSearch" className="text-sm font-medium text-gray-900">
                  Rechercher les documents d'un professeur :
                </label>
                <input
                  type="text"
                  id="professorSearch"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Entrer le nom du professeur..."
                  className="p-2 border border-gray-300 rounded-lg text-sm w-80"
                />
                {suggestions.length > 0 && (
                  <ul className="list-group position-absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto w-80">
                    {suggestions.map((professor) => (
                      <li
                        key={professor.id}
                        onClick={() => setSearchQuery(professor.email)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                      >
                        {professor.first_name} {professor.last_name} ({professor.email})
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <div>
                  <label htmlFor="startDate" className="text-sm font-medium text-gray-900">
                    Date de Début:
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="text-sm font-medium text-gray-900">
                    Date de Fin:
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="text-sm font-medium text-gray-900">
                    Status:
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Tous</option>
                    <option value="en_attente">En attente</option>
                    <option value="imprimé">Imprimé</option>
                    <option value="recupéré">Récupéré</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleDateFilter}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition"
              >
                Rechercher
              </button>
            </div>

            {/* Table Section */}
            <div className="mt-2 overflow-x-auto rounded-xl border shadow">
                <table className="table-fixed border-separate border-spacing-y-2 min-w-[1200px]">
                    <thead className="border-b bg-gray-100">
                    <tr>
                        <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "50px" }}>
                        Nom du Document
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "200px" }}>
                        Professeur
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "70px" }}>
                        Impression Pour
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "70px" }}>
                        Département
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "120px" }}>
                        Filière
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "50px" }}>
                        N. de Copies
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "100px" }}>
                        Format
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "50px" }}>
                        Recto/Verso
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "120px" }}>
                        Couleur
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "120px" }}>
                        Date Soumise
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "150px" }}>
                        Status
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredDocuments.length > 0 ? (
                        filteredDocuments.map((doc) => (
                        <tr
                            key={doc.id}
                            className="bg-white hover:bg-gray-50 transition text-center"
                        >
                            <td className="py-4 text-sm text-gray-700 truncate" style={{ width: "50px" }}>
                            {doc.file_name}
                            </td>
                            <td className="py-4 text-sm text-gray-700" style={{ width: "200px" }}>
                            {doc.professeur}
                            </td>
                            <td className="py-4 text-sm text-gray-700" style={{ width: "70px" }}>
                            {doc.impression_pour}
                            </td>
                            <td className="py-4 text-sm text-gray-700" style={{ width: "50px" }}>
                            {doc.departement}
                            </td>
                            <td className="py-4 text-sm text-gray-700" style={{ width: "120px" }}>
                            {doc.filiere}
                            </td>
                            <td className="py-4 text-sm text-gray-700" style={{ width: "50px" }}>
                            {doc.n_copies}
                            </td>
                            <td className="py-4 text-sm text-gray-700" style={{ width: "100px" }}>
                            {doc.format}
                            </td>
                            <td className="py-4 text-sm text-gray-700" style={{ width: "50px" }}>
                            {doc.recto_verso}
                            </td>
                            <td className="py-4 text-sm text-gray-700" style={{ width: "70px" }}>
                            {doc.couleur}
                            </td>
                            <td className="py-4 text-sm text-gray-700" style={{ width: "70px" }}>
                            {new Date(doc.date).toLocaleString("fr-FR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                            </td>
                            <td className="py-4 text-sm text-gray-700" style={{ width: "150px" }}>
                                {doc.status === "En attente" && (
                                    <div className="flex flex-col items-center">
                                    <button
                                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition w-full mb-2"
                                        onClick={() => handleSendEmail(doc.id)}
                                    >
                                        Imprimé
                                    </button>
                                    </div>
                                )}
                                {doc.status === "Imprimé" && (
                                    <div className="flex flex-col items-center">
                                    <input
                                        type="text"
                                        placeholder="Entrer le code"
                                        className="p-1 border border-gray-300 rounded-md text-sm mb-2 w-full"
                                        onChange={(e) => handleCodeInputChange(e, doc.id)}
                                    />
                                    <button
                                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-500 transition w-full"
                                        onClick={() => handleValidateCode(doc.id)}
                                    >
                                        Récupéré
                                    </button>
                                    </div>
                                )}
                                {doc.status === "Recupéré" && (
                                    <div className="text-center">
                                    <span>Récupéré</span>
                                    </div>
                                )}
                                </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="11" className="py-4 text-center text-gray-500">
                            Aucun document trouvé.
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;