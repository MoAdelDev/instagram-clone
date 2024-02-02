import React, { useEffect, useState } from "react";
import "./Post.css";
import { Avatar } from "@mui/material";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

function Post({ postId, username, imageUrl, caption, user }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = onSnapshot(
        query(collection(db, "posts", postId, "comments")),
        (snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        }
      );
    }
    return () => {
      unsubscribe();
    };
  }, postId);

  const postComment = (event) => {
    event.preventDefault();
    addDoc(collection(db, "posts", postId, "comments"), {
      text: comment,
      username: username,
      timestamp: serverTimestamp(),
    });
    setComment("");
  };
  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt="Mohammed Adel"
          src="https://www.freecodecamp.org/news/content/images/size/w2000/2022/04/pexels-chait-goli-2088233.jpg"
        />

        <h3>{username}</h3>
      </div>

      <img className="post__image" src={imageUrl} />

      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>
      {user && (
        <form className="post__commentbox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            className="post__button"
            disabled={!comment}
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
