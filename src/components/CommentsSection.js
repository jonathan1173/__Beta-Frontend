import React, { useState, useEffect } from "react";
import axios from "axios";
import { MessageSquare, ThumbsUp, ThumbsDown, Loader, Clock } from "lucide-react";

const CommentsSection = ({ challengeId, onNewComment }) => {
  const [comments, setComments] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loadingComments, setLoadingComments] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialComments = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(
          `https://beta-api-cs50.vercel.app/beta/challenges/challenges/${challengeId}/comments/?page=1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComments(response.data.results);
        setNextPage(response.data.next);
      } catch (err) {
        setError("Error al cargar los comentarios");
      } finally {
        setLoadingComments(false);
      }
    };

    fetchInitialComments();
  }, [challengeId]);

  const loadComments = async () => {
    if (!nextPage || loadingMore) return;

    setLoadingMore(true);
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
      setError("Error al cargar más comentarios");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      loadComments();
    }
  };

  const addNewComment = (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  useEffect(() => {
    if (onNewComment) {
      onNewComment(addNewComment);
    }
  }, [onNewComment]);

  if (loadingComments) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 text-fuchsia-500 dark:text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!loadingComments && comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageSquare className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-4" />
        <p className="text-zinc-500 dark:text-zinc-400">
          No hay comentarios aún. ¡Sé el primero en comentar!
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div 
      className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-200 
                 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent my-10" 
      onScroll={handleScroll}
    >
      {comments.map((comment, index) => (
        <div
          key={index}
          className="bg-white dark:bg-zinc-800/50 rounded-lg p-4 shadow-sm
                     border border-zinc-100 dark:border-zinc-700/50
                     transition-all duration-200 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-zinc-900 dark:text-white truncate">
                {comment.user}
              </h3>
              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <Clock className="w-4 h-4" />
                <span>{formatDate(comment.timestamp)}</span>
              </div>
            </div>
            {/* like para los comentarios  */}
            <div className="hidden items-center gap-3 text-sm">
              <button 
                className=" flex items-center gap-1 px-2 py-1 rounded-md
                          text-zinc-600 dark:text-zinc-400 
                          hover:bg-zinc-100 dark:hover:bg-zinc-700/50
                          transition-colors duration-200"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{comment.likes || 0}</span>
              </button>
              <button 
                className="flex items-center gap-1 px-2 py-1 rounded-md
                          text-zinc-600 dark:text-zinc-400
                          hover:bg-zinc-100 dark:hover:bg-zinc-700/50
                          transition-colors duration-200"
              >
                <ThumbsDown className="w-4 h-4" />
                <span>{comment.dislikes || 0}</span>
              </button>
            </div>
          </div>
          
          <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        </div>
      ))}

      {loadingMore && (
        <div className="flex justify-center py-4">
          <Loader className="w-6 h-6 text-fuchsia-500 dark:text-emerald-400 animate-spin" />
        </div>
      )}

      {!nextPage && !loadingMore && comments.length > 0 && (
        <div className="text-center py-4 text-zinc-500 dark:text-zinc-400 text-sm">
          No hay más comentarios para cargar
        </div>
      )}
    </div>
  );
};

export default CommentsSection;