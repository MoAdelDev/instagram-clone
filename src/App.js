import { useEffect, useState } from "react";
import "./App.css";
import Post from "./Post.js";
import { auth, db } from "./firebase.js";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { Button, Modal } from "@mui/material";
import ImageUpload from "./ImageUpload.js";

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState({});
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          // dont update username
        } else {
          return updateProfile(authUser, {
            displayName: username,
          });
        }
      } else {
        // User has logged out
        setUser(null);
      }
    });
    return () => {
      // perform some cleanup
      unsubscribe();
    };
  }, [user, username]);
  useEffect(() => {
    const collectionRef = collection(db, "posts");
    onSnapshot(
      query(collectionRef, orderBy("timestamp", "desc")),
      (snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      }
    );
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        setEmail("");
        setPassword("");
        setOpen(false);
        return updateProfile(authUser, {
          displayName: username,
        });
      })
      .catch((error) => alert("Error: " + error.message));
  };

  const signIn = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        setEmail("");
        setPassword("");
        setOpenSignIn(false);
      })
      .catch((error) => alert("Error: " + error.message));
  };
  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className="paper">
          <form className="app__signUp">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>

            <input
              placeholder="username"
              type="username"
              className="input__submit"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              placeholder="email"
              type="text"
              className="input__submit"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="password"
              type="password"
              className="input__submit"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" onClick={signUp} className="button__submit">
              Sign Up
            </button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className="paper">
          <form className="app__signUp">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>

            <input
              placeholder="email"
              type="text"
              value={email}
              className="input__submit"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="password"
              type="password"
              value={password}
              className="input__submit"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" onClick={signIn} className="button__submit">
              Sign In
            </button>
          </form>
        </div>
      </Modal>
      <div className="app_header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user ? (
          <Button onClick={() => signOut(auth)}>Log Out</Button>
        ) : (
          <div>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="upload__image">
        {user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ) : (
          <h3>Sorry you need to login to upload posts</h3>
        )}
      </div>
      <div className="app__posts">
        {posts.map(({ id, post }) => (
          <Post
            key={id}
            postId={id}
            user={user}
            username={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
