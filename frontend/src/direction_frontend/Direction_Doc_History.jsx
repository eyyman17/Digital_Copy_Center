import React from "react";
import DirectionLayout from "./DirectionLayout";

const Direction_Doc_History = () => {
  const mockData = [
    { id: 1, professor: "Dr. Dupont", title: "Examen Mathématiques", date: "2025-01-15" },
    { id: 2, professor: "Mme. Lemoine", title: "Cours Physique", date: "2025-01-14" },
  ];

  return (
    <DirectionLayout pageTitle="Historique des Documents">
      <div className="p-4 bg-white rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-4">Historique des documents soumis</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">#</th>
              <th className="border border-gray-300 p-2 text-left">Professeur</th>
              <th className="border border-gray-300 p-2 text-left">Titre</th>
              <th className="border border-gray-300 p-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((doc) => (
              <tr key={doc.id}>
                <td className="border border-gray-300 p-2">{doc.id}</td>
                <td className="border border-gray-300 p-2">{doc.professor}</td>
                <td className="border border-gray-300 p-2">{doc.title}</td>
                <td className="border border-gray-300 p-2">{doc.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DirectionLayout>
  );
};

export default Direction_Doc_History;