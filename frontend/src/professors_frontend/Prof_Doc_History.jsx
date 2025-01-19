const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import React, { useEffect, useState } from "react";
import Navbar from "./ProfNavbar";
import axios from "axios";



import { useLocation } from "react-router-dom";

const ProfDocHistory = () => {

  const location = useLocation(); // Access the location object
  const successMessage = location.state?.successMessage; // Retrieve the success message if it exists
  
  useEffect(() => {
    // Scroll to the top when the component loads
    window.scrollTo(0, 0);
  }, []);

  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // New state for loading
  const rowsPerPage = 10;
  
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true); // Start loading
        const response = await axios.get(`${API_BASE_URL}/professors/document_history/`, {
          withCredentials: true, // Ensure credentials like cookies are sent for authentication
        });
        const sortedDocs = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        ); // Default sort by recent
        setDocuments(sortedDocs);
        setFilteredDocuments(sortedDocs);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchDocuments();
  }, []);

  const handleDateFilter = () => {
    if (!startDate && !endDate) {
      setFilteredDocuments(documents);
      return;
    }

    const filtered = documents.filter((doc) => {
      const docDate = new Date(doc.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (!start || docDate >= start) && (!end || docDate <= end);
    });

    setFilteredDocuments(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  const totalPages = Math.ceil(filteredDocuments.length / rowsPerPage);

  const currentDocuments = filteredDocuments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
            {/* Display the success message if it exists */}
            {successMessage && (
              <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
                {successMessage}
              </div>
            )}
            {/* Header Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-100 p-4 rounded-lg">
              {/* Header Title */}
              <p className="text-lg font-semibold text-gray-900 flex-shrink-0">
                Documents Soumis
              </p>

              {/* Date Filters and Button */}
              <div className="flex items-center gap-6 flex-wrap">
                {/* Start Date */}
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="startDate"
                    className="text-sm font-medium text-gray-900"
                  >
                    Début:
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg text-sm w-40"
                  />
                </div>

                {/* End Date */}
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="endDate"
                    className="text-sm font-medium text-gray-900"
                  >
                    Fin:
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg text-sm w-40"
                  />
                </div>

                {/* Filter Button */}
                <button
                  onClick={handleDateFilter}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition"
                >
                  Filtrer
                </button>
              </div>
            </div>

            {/* Table Section */}
            <div className="mt-0 overflow-x-auto rounded-xl border shadow">
              <table className="table-fixed border-separate border-spacing-y-2 min-w-[1200px]">
                <thead className="border-b bg-gray-100">
                  <tr>
                    <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "300px" }}>
                      Nom du Document
                    </td>
                    <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "150px" }}>
                      Impression Pour
                    </td>
                    <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "150px" }}>
                      Département
                    </td>
                    <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "150px" }}>
                      Filière
                    </td>
                    <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "120px" }}>
                      N. de Copies
                    </td>
                    <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "80px" }}>
                      Format
                    </td>
                    <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "150px" }}>
                      Recto/Verso
                    </td>
                    <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "120px" }}>
                      Couleur
                    </td>
                    <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "180px" }}>
                      Date Soumise
                    </td>
                    <td className="py-4 text-sm font-medium text-gray-500 text-center" style={{ width: "150px" }}>
                      Status
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {currentDocuments.length > 0 ? (
                    currentDocuments.map((doc) => (
                      <tr
                        key={doc.id}
                        className="bg-white hover:bg-gray-50 transition text-center"
                      >
                        <td className="py-4 text-sm text-gray-700 truncate" style={{ width: "200px" }}>
                          {doc.file_name}
                        </td>
                        <td className="py-4 text-sm text-gray-700" style={{ width: "150px" }}>
                          {doc.impression_pour}
                        </td>
                        <td className="py-4 text-sm text-gray-700" style={{ width: "150px" }}>
                          {doc.get_department_abbreviation}
                        </td>
                        <td className="py-4 text-sm text-gray-700" style={{ width: "150px" }}>
                          {doc.get_filiere_abbreviation}
                        </td>
                        <td className="py-4 text-sm text-gray-700" style={{ width: "120px" }}>
                          {doc.n_copies}
                        </td>
                        <td className="py-4 text-sm text-gray-700" style={{ width: "100px" }}>
                          {doc.format}
                        </td>
                        <td className="py-4 text-sm text-gray-700" style={{ width: "150px" }}>
                          {doc.recto_verso}
                        </td>
                        <td className="py-4 text-sm text-gray-700" style={{ width: "120px" }}>
                          {doc.couleur}
                        </td>
                        <td className="py-4 text-sm text-gray-700" style={{ width: "180px" }}>
                          {new Date(doc.date).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                  
                        <td className="py-4 text-sm text-gray-700" style={{ width: "150px" }}>
                              {doc.validation_impression === "en_attente" && (
                                <span className="px-2 py-1 bg-yellow-200 text-yellow-700 rounded-full">
                                  En Attente
                                </span>
                              )}
                              {doc.validation_impression === "imprimé" && (
                                <span className="px-2 py-1 bg-blue-200 text-blue-700 rounded-full">
                                  Imprimé
                                </span>
                              )}
                              {doc.validation_impression === "recupéré" && (
                                <span className="px-2 py-1 bg-green-200 text-green-700 rounded-full">
                                  Récupéré
                                </span>
                              )}
                            </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="10"
                        className="py-4 text-center text-sm text-gray-500"
                      >
                        Aucun document soumis pour le moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Section */}
            <div className="flex justify-between items-center mt-4">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Précédent
              </button>
              <p className="text-sm text-gray-500">
                Page {currentPage} sur {totalPages}
              </p>
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100"
                onClick={() => handlePageChange(currentPage + 1)}
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

export default ProfDocHistory;