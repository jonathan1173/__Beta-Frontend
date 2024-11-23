import React from "react";
import AddComment from "./AddComment";
import CommentsSection from "./CommentsSection";

const ChallengeComments = ({ challengeId }) => {
  let addNewCommentToSection = null;

  const handleNewComment = (callback) => {
    addNewCommentToSection = callback;
  };

  const addComment = (newComment) => {
    if (addNewCommentToSection) {
      addNewCommentToSection(newComment);
    }
  };

  return (
    <div>
      <AddComment challengeId={challengeId} onCommentAdded={addComment} />
      <CommentsSection challengeId={challengeId} onNewComment={handleNewComment} />
    </div>
  );
};

export default ChallengeComments;
