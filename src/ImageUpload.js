import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { db, storage } from "./firebase";
import { FieldValue, addDoc, collection, serverTimestamp } from "firebase/firestore";
import "./ImageUpload.css";

function ImageUpload({username}) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const storageRef = ref(storage, `images/${image.name}`);

    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // Error function
        console.log(error);
        alert(error.message);
      },
      () => {
        // Complete function
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const postRef = collection(db, "posts");
          addDoc(postRef, {
            timestamp: serverTimestamp(),
            caption: caption,
            imageUrl: downloadURL,
            username: username,
            id: serverTimestamp(),
          }).then(() => {
            setProgress(0);
            setCaption("");
            setImage(null);
          })
        });
      }
    )
  };
  return (
    <div className="imageupload">
      <progress value={progress} max="100" className="imageupload__progress"/>
      <input
        type="text"
        value={caption}
        className="imageupload__caption"
        placeholder="Enter a caption ..."
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type="file" onChange={handleChange} className="imageupload__file"/>
      <button className="imageupload__button" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}
export default ImageUpload;
