"use client";

import Image from "next/image";

const users = [
  {
    id: 1,
    name: "Hanniel TSASSE",
    email: "hanniel.tsasse@gmail.com",
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Josué FOUDJI",
    email: "josue.foudji@yahoo.fr",
    avatar: "https://via.placeholder.com/150",
  },
];

export default function Example() {
  const handleEdit = (userId: number) => {
    alert(userId);
  };

  const handleDelete = (userId: number) => {
    alert(userId);
  };

  return (
    <>
      <main className="min-h-screen w-screen flex justify-center items-center bg-gray-900 overflow-auto">
        <div className="max-w-7xl w-full my-16 mx-4 p-8 border border-gray-700 shadow-lg rounded-lg bg-gray-800">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Gestion des utilisateurs
            </h1>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">
              Liste des utilisateurs
            </h2>
            <button className="bg-[#02d778] text-white px-4 py-2 rounded-md hover:bg-[#02c567] focus:outline-none focus:ring-2 focus:ring-[#02d778] focus:ring-opacity-50 transition">
              Ajouter
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...users, ...users, , ...users, ...users].map((user) => (
              <div
                key={user.id}
                className="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center"
              >
                <Image
                  width={150}
                  height={150}
                  className="w-[150px] h-[150px] rounded-full mb-4"
                  src={user.avatar}
                  alt={`${user.name} profile`}
                />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white">
                    {user.name}
                  </h3>
                  <p className="text-gray-400">{user.email}</p>
                </div>
                <div className="flex mt-4 space-x-2">
                  <button
                    onClick={() => handleEdit(user.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 transition"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
