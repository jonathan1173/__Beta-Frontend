import React, { useEffect, useState } from "react";
import axios from "axios";

const TopUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopUsers = async () => {
        const token = localStorage.getItem('access_token'); // Obtén el token del almacenamiento local
      if (!token) {
        setError("No se encontró el token de acceso");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/beta/access/top-users/", {
          headers: {
            Authorization: `Bearer ${token}`, // Envía el token en el encabezado
          },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los datos o no autorizado");
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Top Usuarios</h1>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            <strong>{user.username}</strong>: {user.points} puntos
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopUsers;
