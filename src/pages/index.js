import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
// component
import Comments from '../components/Comments';
import AddUpdateComment from "@/components/AddUpdateComment";
import ModalDelete from "@/components/ModalDelete";
export default function Home() {
  const [comments,setComments] = useState([]);
  const [user,setUser] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [isReply,setIsReply] = useState(false);
  const [targetReply, setTargetReply] = useState(null);
  const [modal,SetModal] = useState(<div></div>);
  const [isUpdate, setIsUpdate] = useState(false);
  const [targetEdit, setTargetEdit] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [isReplySent, setIsReplySent] = useState(false);
  const [error, setError] = useState(false);
  
  function fetchData() {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => {
        setComments(data.comments);
        setUser(data.currentUser);
      })
      .catch(error => {
        console.error(error);
      });
  }
  useEffect(() => {
    fetchData();
  }, []);

  function incrementScore(id) {
    const newComments = updateScore(comments, id, 1);
    setComments(newComments);
  }
  function decrementScore(id) {
    const newComments = updateScore(comments, id, -1);
    setComments(newComments);
  }
  function updateScore(comments, id, increment) {
    let updatedComments = [...comments];
    let updated = false;
  
    const updateComment = (comment) => {
      if (comment.id === id && !comment.updated) {
        if (comment.score === 0 && increment === -1) return comment;
        comment.score += increment;
        comment.updated = true;
        updated = true;
      }
      if (comment.replies && comment.replies.length > 0) {
        comment.replies = updateScore(comment.replies, id, increment);
        if (comment.replies.some(reply => reply.updated)) {
          comment.updated = true;
          updated = true;
        }
      }
      return comment;
    };
  
    updatedComments = updatedComments.map(updateComment);
    return updatedComments;
  }
  
  function deleteComment(id) {
    SetModal(<ModalDelete SetModal={SetModal} id={id} confirmDeleteComment={confirmDeleteComment}/>)
  }
  function confirmDeleteComment(id) {
    const newComments = removeComment(comments, id);
    setComments(newComments);
    SetModal(<div></div>);
  }

  function removeComment(comments, id) {
    return comments.filter(comment => {
      if (comment.id === id) {
        return false; // Exclude the comment
      }
      if (comment.replies && comment.replies.length > 0) {
        comment.replies = removeComment(comment.replies, id);
      }
      return true; // Include the comment
    });
  }
  function getTimeDifference(timestamp) {
    const now = Date.now();
    const difference = now - timestamp;
  
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }
  }
  function addComment(e, isUpdate) {
    e.preventDefault();
    if(!isUpdate) {
      const dateNow = Date.now();
      const newComments = [...comments];
      const newComment = {
        id: Date.now(),
        createdAt: getTimeDifference(dateNow),
        content: commentText,
        user : {
          image : {
            png : user.image.png,
            webp : user.image.webp
          },
          username: user.username
        },
        score: 0,
        replies: [],
      };
      
      if (commentText === '') {
        setError(true);
        return;
      }
      newComments.push(newComment);
      setComments(newComments);
      setCommentText('');
    } else {
      // update the comment
      const newComments = [...comments];
      const newComment = {
        id: Date.now(),
        createdAt: getTimeDifference(Date.now()),
        content: commentText,
        user : {
          image : {
            png : user.image.png,
            webp : user.image.webp
          },
          username: user.username
        },
        score: 0,
        replies: [],
      };
      const updateComment = (comment) => {
        if (comment.id === targetEdit.id) {
          if (comment.content === newComment.content) return comment;
          if (commentText === '') {
            setError(true);
            return;
          }
          comment.content = newComment.content;
        } else if (comment.replies && comment.replies.length > 0) {
          comment.replies = comment.replies.map(reply => updateComment(reply));
        }
        return comment;
      };
      newComments.map(comment => updateComment(comment));
      setComments(newComments);
      setCommentText('');
      setIsUpdate(false);
      setIsReplySent(true);
      setIsReply(false);
    }
  }
  function replyComment(id,item) {
    setIsReply(true);
    setTargetReply(item);
    setShowReply(true);
    setIsReplySent(false);
  }
  function sendReplyComment(e) {
    e.preventDefault();
    const dateNow = Date.now();
    const newComments = [...comments];
    const newComment = {
      id: Date.now(),
      createdAt: getTimeDifference(dateNow),
      content: commentText,
      user: {
        image: {
          png: user.image.png,
          webp: user.image.webp
        },
        username: user.username
      },
      score: 0,
      replyingTo: targetReply.user.username,
    };

    const addReplyToComment = (comment, reply) => {
      if (comment.id === targetReply.id) {
        if (comment.replies) {
          comment.replies.push(reply);
        } else {
          comment.replies = [reply];
        }
      } else if (comment.replies && comment.replies.length > 0) {
        comment.replies = comment.replies.map(reply => addReplyToComment(reply, newComment));
      }
      return comment;
    };

    newComments.map(comment => addReplyToComment(comment, newComment));

    setComments(newComments);
    setCommentText('');
    setIsReply(false);
    setIsReplySent(true);
  }

  function editComment(item) {
    const editedComment = item.content;
    setTargetEdit(item);
    setCommentText(editedComment);
    setIsUpdate(true);
  }
  function cancelReply() {
    setIsReply(false);
    setTargetReply(null);
    setShowReply(false);
  }
  function renderReplies(item, incrementScore, decrementScore, deleteComment, user, replyComment) {
    const renderNestedReplies = (replies) => {
      if (replies && replies.length > 0) {
        return replies.map((reply, replyIndex) => (
          <div key={replyIndex}>
            <Comments
              incrementScore={incrementScore}
              decrementScore={decrementScore}
              deleteComment={deleteComment}
              item={reply}
              user={user}
              isReply={true}
              replyComment={replyComment}
              editComment={editComment}
            />
            {renderNestedReplies(reply.replies)}
          </div>
        ));
      } else {
        return null;
      }
    };

    if (item.replies && item.replies.length > 0) {
      return (
        <div className="flex gap-1">
          <div className="w-1 bg-Light-gray"></div>
          <div className="w-full">
            {item.replies.map((reply, replyIndex) => (
              <div key={replyIndex}>
                <Comments
                  incrementScore={incrementScore}
                  decrementScore={decrementScore}
                  deleteComment={deleteComment}
                  item={reply}
                  user={user}
                  isReply={true}
                  replyComment={replyComment}
                  editComment={editComment}
                />
                {renderNestedReplies(reply.replies)}
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  return (
    <>
      <Head>
        <title>Frontend Mentor | Comment section</title>
        <link rel="icon" href="/images/favicon-32x32.png" />
      </Head>
      <main className="p-3 md:w-[50%] md:py-10 mx-auto">
        {comments.length ? comments.map((item, index) => (
          <div key={index}>
            <Comments incrementScore={incrementScore} decrementScore={decrementScore} deleteComment={deleteComment} key={index} item={item} user={user} isReply={false} replyComment={replyComment} editComment={editComment} />
            {renderReplies(item, incrementScore, decrementScore, deleteComment, user, replyComment)}
            {item === targetReply && !isReplySent && (
              <AddUpdateComment
                isReply={isReply}
                targetReply={targetReply}
                user={user}
                commentText={commentText}
                addComment={addComment}
                setCommentText={setCommentText}
                sendReplyComment={sendReplyComment}
                isUpdate={isUpdate}
                cancelReply={cancelReply}
                error={error}
              />
            )}
          </div>
        )) : <p>loading...</p>}
        {!isReply && (
          <AddUpdateComment
            isReply={isReply}
            targetReply={targetReply}
            user={user}
            commentText={commentText}
            addComment={addComment}
            setCommentText={setCommentText}
            sendReplyComment={sendReplyComment}
            isUpdate={isUpdate}
            cancelReply={cancelReply}
            error={error}
          />
        )}
        {modal}
      </main>
    </>
  );
}
