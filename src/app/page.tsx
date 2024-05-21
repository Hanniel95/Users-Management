"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import * as Yup from "yup";
import { useFormik } from "formik";
import UserAPI from "@/services/api/UserService";
import { UserModel } from "@/Types/Users";

const validators = {
  first_name: Yup.string().required("Le prénom est requis"),
  last_name: Yup.string().required("Le nom de famille est requis"),
  email: Yup.string()
    .email("Adresse email invalide")
    .required("L'email est requis"),
  gender: Yup.string().required("Le sexe est requis"),
};

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="loader"></div>
    </div>
  );
}

export default function HomePage() {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: Yup.object().shape(validators),
    initialValues: currentUser || {
      first_name: "",
      last_name: "",
      email: "",
      gender: "",
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (isEditing) {
          await UserAPI.update_user(currentUser.id, values)
            .then((data) => {
              console.log(data);
            })
            .catch((err) => {
              console.log(err);
            });
          formik.resetForm();
        } else {
          await UserAPI.create_user(values)
            .then((data) => {
              console.log(data);
            })
            .catch((err) => {
              console.log(err);
            });
        }
        getAllUsers();
        closeModal();
      } catch (error: any) {
        const newErrors: any = {};
        error.inner.forEach((err: any) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    setLoading(true);
    await UserAPI.get_users()
      .then((data) => {
        setUsers(data.users);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const openModal = (user: any = null) => {
    setCurrentUser(user);
    setIsEditing(!!user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
    setIsEditing(false);
    setError("");
  };

  const openDeleteModal = (user: any) => {
    setCurrentUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentUser(null);
  };


  const handleDelete = async () => {
    setLoading(true);
    await UserAPI.delete_user(currentUser.id);
    await getAllUsers();
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
                {/* <Image
                  width={150}
                  height={150}
                  className="w-[150px] h-[150px] rounded-full mb-4"
                  src={user.avatar}
                  alt={`${user.first_name} ${user.last_name} profile`}
                /> */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white">
                    {user.first_name} {user.last_name}
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
          <form
            onSubmit={formik.handleSubmit}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Mise à jour d'un" : "Ajouter un"} utilisateur
            </h2>
            {error && (
              <div className="w-full px-3 py-3 mt-4 text-red-700 rounded-md bg-red-50">
                {error}
              </div>
            )}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Prénom"
                name="first_name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`block w-full px-4 py-2 mb-1 border rounded-md ${
                  formik.touched.first_name && formik.errors.first_name
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.first_name && formik.errors.first_name && (
                <div className="text-red-500">{formik.errors.first_name}</div>
              )}
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Nom"
                name="last_name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`block w-full px-4 py-2 mb-1 border rounded-md ${
                  formik.touched.last_name && formik.errors.last_name
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.last_name && formik.errors.last_name && (
                <div className="text-red-500">{formik.errors.last_name}</div>
              )}
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`block w-full px-4 py-2 mb-1 border rounded-md ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500">{formik.errors.email}</div>
              )}
            </div>
            <div className="mb-4">
              <select
                className={`block w-full px-4 py-2 mb-1 border rounded-md ${
                  formik.touched.gender && formik.errors.gender
                    ? "border-red-500"
                    : ""
                }`}
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Sélectionner le sexe</option>
                <option value="M">Homme</option>
                <option value="F">Femme</option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <div className="text-red-500">{formik.errors.gender}</div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition"
                disabled={loading}
              >
                {loading ? "En cours..." : isEditing ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Confirmer la suppression
            </h2>
            <p>
              Voulez-vous vraiment supprimer {currentUser?.first_name}{" "}
              {currentUser?.last_name} ?
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
