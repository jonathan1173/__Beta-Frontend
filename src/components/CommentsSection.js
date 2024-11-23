import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentsSection = ({ challengeId, onNewComment }) => {
  const [comments, setComments] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    const fetchInitialComments = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(
          `http://localhost:8000/beta/challenges/challenges/${challengeId}/comments/?page=1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComments(response.data.results);
        setNextPage(response.data.next);
      } catch (err) {
        console.error("Error al cargar los comentarios:", err);
      }
    };

    fetchInitialComments();
  }, [challengeId]);

  const loadComments = async () => {
    if (!nextPage || loadingComments) return;

    setLoadingComments(true);
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.get(nextPage, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setComments((prevComments) => [...prevComments, ...response.data.results]);
      setNextPage(response.data.next);
    } catch (err) {
      console.error("Error al cargar más comentarios:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadComments();
    }
  };

  // Función para agregar un nuevo comentario al estado local
  const addNewComment = (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  // Pasar el callback al componente padre
  useEffect(() => {
    if (onNewComment) {
      onNewComment(addNewComment);
    }
  }, [onNewComment]);

  return (
    <div className="overflow-y-auto h-64 border p-2" onScroll={handleScroll}>
      {comments.map((comment, index) => (
        <div key={index} className="border-b pb-2 mb-2">
          <p>
            <strong>{comment.user}</strong>
          </p>
          <p>{comment.content}</p>
          <small>{new Date(comment.timestamp).toLocaleString()}</small>
        </div>
      ))}
      {loadingComments && <p>Cargando más comentarios...</p>}
      {!nextPage && !loadingComments && comments.length === 0 && (
        <p>No hay comentarios disponibles.</p>
      )}
    </div>
  );
};

export default CommentsSection;
