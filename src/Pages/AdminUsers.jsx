import { useEffect, useState, useContext } from "react";
import { getUsers, deleteUser, updateUser } from "../services/userService";
import ErrorPage from "../Components/ErrorPage";
import ModalConfirm from "../Components/ModalConfirm";
import { AuthContext } from "../Context/AuthContext"; // 🔥
import "../Styles/AdminUsers.css";

export default function AdminUsersFull() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const { setMessage } = useContext(AuthContext); // 🔥

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data);

        const me = JSON.parse(localStorage.getItem("user"));
        if (me?._id) setCurrentUserId(me._id);
      } catch (err) {
        // 🚨 ERROR GRAVE
        setError({
          code: "Error",
          msg: "No se pudieron cargar los usuarios.",
        });
      }
    };
    fetch();
  }, []);

  // =====================
  // DELETE
  // =====================
  const handleDeleteClick = (user) => {
    if (user._id === currentUserId) {
      setMessage({
        type: "warning",
        text: "No podés eliminarte a vos mismo ⚠️",
      });
      return;
    }

    setUserToDelete(user);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setMessage({
      type: "waiting",
      text: "Eliminando usuario...",
    });

    try {
      await deleteUser(userToDelete._id);

      setUsers((prev) =>
        prev.filter((u) => u._id !== userToDelete._id)
      );

      setMessage({
        type: "success",
        text: "Usuario eliminado 🗑️",
      });

      setShowModal(false);
      setUserToDelete(null);
    } catch (err) {
      setMessage({
        type: "error",
        text: "No se pudo eliminar el usuario ❌",
      });
    }
  };

  // =====================
  // ROLE
  // =====================
  const handleRoleChange = async (id, role) => {
    const prev = users;

    setUsers((u) =>
      u.map((x) => (x._id === id ? { ...x, role } : x))
    );

    setMessage({
      type: "info",
      text: "Actualizando rol...",
    });

    try {
      await updateUser(id, { role });

      setMessage({
        type: "success",
        text: "Rol actualizado 👑",
      });
    } catch (err) {
      setUsers(prev);

      setMessage({
        type: "error",
        text: "No se pudo actualizar el rol ❌",
      });
    }
  };

  // =====================
  // NAME
  // =====================
  const handleNameChange = async (id, name) => {
    const prev = users;

    setUsers((u) =>
      u.map((x) => (x._id === id ? { ...x, name } : x))
    );

    setMessage({
      type: "info",
      text: "Guardando nombre...",
    });

    try {
      await updateUser(id, { name });

      setMessage({
        type: "success",
        text: "Nombre actualizado ✏️",
      });
    } catch (err) {
      setUsers(prev);

      setMessage({
        type: "error",
        text: "No se pudo actualizar el nombre ❌",
      });
    }
  };

  // =====================
  // FILTER
  // =====================
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (error) return <ErrorPage code={error.code} msg={error.msg} />;

  return (
    <div className="admin-users-full-container">
      <h2 className="admin-users-full-title">Panel de Usuarios</h2>

      {/* BUSCADOR */}
      <input
        className="admin-users-search"
        type="text"
        placeholder="Buscar por nombre o email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLA */}
      <div className="admin-users-table-container">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id}>
                <td>
                  <input
                    className="admin-users-input-name"
                    defaultValue={u.name}
                    onBlur={(e) =>
                      handleNameChange(u._id, e.target.value)
                    }
                  />
                </td>

                <td>{u.email}</td>

                <td>
                  <select
                    value={u.role}
                    className="admin-users-select-role"
                    onChange={(e) =>
                      handleRoleChange(u._id, e.target.value)
                    }
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                <td>
                  <span
                    className={`admin-users-status ${
                      u.isVerified
                        ? "verified"
                        : "not-verified"
                    }`}
                  >
                    {u.isVerified
                      ? "Verificado ✅"
                      : "No verificado ❌"}
                  </span>
                </td>

                <td>
                  <button
                    className="admin-users-btn-delete"
                    onClick={() => handleDeleteClick(u)}
                    disabled={u._id === currentUserId}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <p className="admin-users-empty">
          No se encontraron usuarios
        </p>
      )}

      {/* MODAL */}
      <ModalConfirm
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        message={`¿Seguro querés eliminar "${userToDelete?.name}"?`}
      />
    </div>
  );
}