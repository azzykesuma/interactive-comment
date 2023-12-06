import React, { useEffect, useState } from "react";
import Head from "next/head";
// component
import Comments from '../components/Comments';
import AddUpdateComment from "@/components/AddUpdateComment";
export default function Home() {
  const [comments,setComments] = useState([]);
  const [user,setUser] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [isReply,setIsReply] = useState(false);
  const [targetReply, setTargetReply] = useState(null);
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
    return comments.map(comment => {
      if (comment.id === id) {
        if(comment.score === 0 && increment === -1) return comment;
        comment.score += increment;
      }
      if (comment.replies && comment.replies.length > 0) {
        comment.replies = updateScore(comment.replies, id, increment);
      }
      return comment;
    });
  }
  function deleteComment(id) {
    const newComments = removeComment(comments, id);
    setComments(newComments);
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
  function addComment(e) {
    e.preventDefault();
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
    newComments.push(newComment);
    setComments(newComments);
    setCommentText('');
  }
  function replyComment(id,item) {
    setIsReply(true);
    setTargetReply(item);
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
  }

  function editComment(e, id) {
    e.preventDefault();
    const newComments = [...comments];
    const comment = newComments.find(comment => comment.id === id);
    comment.content = commentText;
    setComments(newComments);
    setCommentText('');
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
      <main className="bg-Very-light-gray p-3">
        {comments.length ? comments.map((item, index) => (
          <div key={index}>
            <Comments incrementScore={incrementScore} decrementScore={decrementScore} deleteComment={deleteComment} key={index} item={item} user={user} isReply={false} replyComment={replyComment} />
            {renderReplies(item, incrementScore, decrementScore, deleteComment, user, replyComment)}
          </div>
        )) : <p>loading...</p>}
        <AddUpdateComment isReply={isReply} targetReply={targetReply} user={user} commentText={commentText} addComment={addComment} setCommentText={setCommentText} sendReplyComment={sendReplyComment}/>
      </main>
    </>
  );
}
