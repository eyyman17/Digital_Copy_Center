import React from "react";
import DirectionLayout from "./DirectionLayout";

const Add_Professor = () => {
  return (
    <DirectionLayout pageTitle="Ajouter un Professeur">
      <div className="p-4 bg-white rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-4">Ajouter un nouveau professeur</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="name">
              Nom du Professeur
            </label>
            <input
              id="name"
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Entrez le nom"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Entrez l'email"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Ajouter
          </button>
        </form>
      </div>
    </DirectionLayout>
  );
};

export default Add_Professor;