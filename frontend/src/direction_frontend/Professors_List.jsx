import React from "react";
import DirectionLayout from "./DirectionLayout";

const Professors_List = () => {
  const mockProfessors = [
    { id: 1, name: "Dr. Dupont", email: "dupont@example.com" },
    { id: 2, name: "Mme. Lemoine", email: "lemoine@example.com" },
  ];

  return (
    <DirectionLayout pageTitle="Liste des Professeurs">
      <div className="p-4 bg-white rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-4">Liste des Professeurs</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">#</th>
              <th className="border border-gray-300 p-2 text-left">Nom</th>
              <th className="border border-gray-300 p-2 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {mockProfessors.map((prof) => (
              <tr key={prof.id}>
                <td className="border border-gray-300 p-2">{prof.id}</td>
                <td className="border border-gray-300 p-2">{prof.name}</td>
                <td className="border border-gray-300 p-2">{prof.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DirectionLayout>
  );
};

export default Professors_List;