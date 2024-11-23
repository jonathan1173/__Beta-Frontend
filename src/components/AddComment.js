import React, { useState } from "react";
import axios from "axios";
import { Send, AlertCircle, CheckCircle } from "lucide-react";

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
      setSuccess("¡Comentario agregado con éxito!");
      setContent("");
      if (onCommentAdded) {
        onCommentAdded(response.data);
      }
    } catch (err) {
      setError("Ocurrió un error al agregar el comentario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe tu comentario aquí..."
            rows="4"
            required
            className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 
                     bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white 
                     placeholder-zinc-400 dark:placeholder-zinc-500
                     focus:ring-2 focus:ring-fuchsia-500 dark:focus:ring-emerald-400 
                     focus:border-transparent outline-none transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     resize-y min-h-[120px]"
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            {error && (
              <div className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 text-green-500 dark:text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>{success}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-fuchsia-500 dark:bg-emerald-500 
                     hover:bg-fuchsia-600 dark:hover:bg-emerald-600 
                     text-white font-medium text-sm
                     transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus:ring-2 focus:ring-fuchsia-500 dark:focus:ring-emerald-400 
                     focus:ring-offset-2 focus:ring-offset-white 
                     dark:focus:ring-offset-zinc-900"
          >
            <Send className="w-4 h-4" />
            {loading ? "Enviando..." : "Agregar Comentario"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddComment;