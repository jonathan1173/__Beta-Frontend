import React, { useState } from "react";
import axios from "axios";

const AddComment = ({ challengeId, onCommentAdded }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.post(
        `http://localhost:8000/beta/challenges/challenges/${challengeId}/comments/add`,
        { content },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Comentario agregado con éxito");
      setContent("");
      if (onCommentAdded) {
        onCommentAdded(response.data); // Llamar al callback con el nuevo comentario
      }
    } catch (err) {
      setError("Ocurrió un error al agregar el comentario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Agregar un Comentario</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe tu comentario aquí..."
          rows="4"
          cols="50"
          required
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Agregar Comentario"}
        </button>
      </form>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AddComment;
