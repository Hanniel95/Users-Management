"use client";

import { useState } from "react";
import Image from "next/image";

const initialUsers = [
  {
    id: 1,
    firstName: "Hanniel",
    lastName: "TSASSE",
    email: "hanniel.tsasse@gmail.com",
    gender: "M",
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    firstName: "Josué",
    lastName: "FOUDJI",
    email: "josue.foudji@yahoo.fr",
    gender: "F",
    avatar: "https://via.placeholder.com/150",
  },
];

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="loader"></div>
    </div>
  );
}

export default function Example() {
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const openModal = (user: any = null) => {
    setCurrentUser(user);
    setIsEditing(!!user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
    setIsEditing(false);
    setSelectedFile(null);
  };

  const openDeleteModal = (user: any) => {
    setCurrentUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentUser(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setCurrentUser({
        ...currentUser,
        avatar: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (isEditing) {
      setUsers(
        users.map((user: any) =>
          user.id === currentUser!.id
            ? { ...currentUser, avatar: currentUser.avatar }
            : user
        )
      );
    } else {
      setUsers([
        ...users,
        { ...currentUser, id: users.length + 1, avatar: currentUser.avatar },
      ]);
    }
    setLoading(false);
    closeModal();
  };

  const handleDelete = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setUsers(users.filter((user) => user.id !== currentUser.id));
    setLoading(false);
    closeDeleteModal();
  };

  return (
    <>
      <main className="h-screen w-screen flex justify-center items-center bg-gray-900 overflow-auto">
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
            <button
              onClick={() => openModal()}
              className="bg-[#02d778] text-white px-4 py-2 rounded-md hover:bg-[#02c567] focus:outline-none focus:ring-2 focus:ring-[#02d778] focus:ring-opacity-50 transition"
            >
              Ajouter
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center"
              >
                <Image
                  width={150}
                  height={150}
                  className="w-[150px] h-[150px] rounded-full mb-4"
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName} profile`}
                />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-gray-300">{user.email}</p>
                  <p className="text-gray-300">
                    {user.gender == "M" ? "Homme" : "Femme"}
                  </p>
                </div>
                <div className="flex mt-4 space-x-2">
                  <button
                    onClick={() => openModal(user)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => openDeleteModal(user)}
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Mise à jour d'un" : "Ajouter un"} utilisateur
            </h2>
            <input
              type="text"
              placeholder="Prénom"
              value={currentUser?.firstName || ""}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, firstName: e.target.value })
              }
              className="block w-full px-4 py-2 mb-4 border rounded-md"
            />
            <input
              type="text"
              placeholder="Nom"
              value={currentUser?.lastName || ""}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, lastName: e.target.value })
              }
              className="block w-full px-4 py-2 mb-4 border rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              value={currentUser?.email || ""}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, email: e.target.value })
              }
              className="block w-full px-4 py-2 mb-4 border rounded-md"
            />
            <select
              value={currentUser?.gender || ""}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, gender: e.target.value })
              }
              className="block w-full px-4 py-2 mb-4 border rounded-md"
            >
              <option value="">Sélectionner le sexe</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full px-4 py-2 mb-4 border rounded-md"
            />
            {currentUser?.avatar && (
              <div className="mb-4">
                <Image
                  width={150}
                  height={150}
                  className="w-[150px] h-[150px] rounded-full"
                  src={currentUser.avatar}
                  alt="Profile preview"
                />
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition"
                disabled={loading}
              >
                {loading ? "En cours..." : isEditing ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Confirmer la suppression
            </h2>
            <p>
              Voulez-vous vraiment supprimer {currentUser?.firstName}{" "}
              {currentUser?.lastName} ?
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 transition"
                disabled={loading}
              >
                {loading ? "En cours..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <LoadingOverlay />}
    </>
  );
}
