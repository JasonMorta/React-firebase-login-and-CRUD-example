import React, { useEffect, useState } from "react";
import { db, auth } from "../config/firebase";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function Data() {
  const [trackList, setTrackList] = useState([]);

  const dbCollection = collection(db, "tracks");

  const getTracks = async () => {
    try {
      const trackData = await getDocs(dbCollection);
      const filteredData = trackData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setTrackList(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTracks();
  }, []);

  //! New track / state
  const [newTrack, setNewTrack] = useState("");
  const [newArtist, setNewArtist] = useState("");
  const [newAlbum, setNewAlbum] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newYear, setNewYear] = useState();

  const addTrack = async () => {
    try {
      const user = auth.currentUser;
      console.log("user: ", user);

      if (user) {
        const trackData = {
          title: newTrack,
          artist: newArtist,
          album: newAlbum,
          genre: newGenre,
          year: newYear,
          userId: user.uid,
          userName: user.displayName,
        };
        await addDoc(collection(db, "tracks"), trackData); // Specify the collection name as 'tracks'
        getTracks();
      } else {
        console.log(`%c User not signed in.`, "color: red");
      }
    } catch (error) {
      console.log(`%c User not signed in.`, error);
    }
  };

  //! Delete track
  const deleteTrack = async (id) => {
    try {
      const trackDoc = doc(db, "music", id);
      await deleteDoc(trackDoc);
      getTracks();
    } catch (error) {
      console.log(error);
    }
  };

  //! Update track state
  const [dialog, setDialog] = useState(false);
  const [tackId, setTrackId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editArtist, setEditArtist] = useState("");
  const [editAlbum, setEditAlbum] = useState("");
  const [editGenre, setEditGenre] = useState("");
  const [editYear, setEditYear] = useState();

  async function openDialog(id, item) {
    //set the dialog input values
    setEditTitle(item.title);
    setEditArtist(item.artist);
    setEditAlbum(item.album);
    setEditGenre(item.genre);
    setEditYear(item.year);

    setDialog(true); // open the dialog
    setTrackId(id); // set the track id to the state of the current track being edited
  }

  const updateTrack = async () => {
    try {
      const trackDoc = doc(db, "music", tackId);
      await updateDoc(trackDoc, {
        title: editTitle,
        artist: editArtist,
        album: editAlbum,
        genre: editGenre,
        year: editYear,
      });
      getTracks();
      setDialog(false); // close the dialog
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <dialog open={dialog}>
        <p onClick={() => setDialog(false)}>
          <b>close</b>
        </p>
        <br />
        <input
          type="text"
          placeholder="Title"
          defaultValue={editTitle ? editTitle : ""}
          onChange={(e) => setEditTitle(e.target.value)}
        />{" "}
        <br />
        <input
          type="text"
          placeholder="Artist"
          defaultValue={editArtist ? editArtist : ""}
          onChange={(e) => setEditArtist(e.target.value)}
        />{" "}
        <br />
        <input
          type="text"
          placeholder="Album"
          defaultValue={editAlbum ? editAlbum : ""}
          onChange={(e) => setEditAlbum(e.target.value)}
        />{" "}
        <br />
        <input
          type="text"
          placeholder="Genre"
          defaultValue={editGenre ? editGenre : ""}
          onChange={(e) => setEditGenre(e.target.value)}
        />{" "}
        <br />
        <input
          type="number"
          placeholder="Year"
          defaultValue={editYear ? editYear : ""}
          onChange={(e) => setEditYear(Number(e.target.value))}
        />{" "}
        <br />
        <button
          onClick={() => {
            updateTrack();
          }}
        >
          Edit
        </button>
      </dialog>

      <div>Tracks</div>
      <div
        style={{
          border: "1px solid silver",
          marginTop: "50px",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {trackList.length !== -1 ? (
          trackList?.map((item, index) => (
            <>
              <div
                key={index}
                style={{
                  border: "1px solid silver",
                  width: "200px",
                  overflow: "hidden",
                }}
              >
                <h2>{item.title}</h2>
                <h2>{item.artist}</h2>
                <h2>{item.album}</h2>
                <h2>{item.genre}</h2>
                <h2>{item.year}</h2>
                <button onClick={() => deleteTrack(item.id)}>Delete</button>
                <button onClick={() => openDialog(item.id, item)}>Edit</button>
              </div>
            </>
          ))
        ) : (
          <>No data</>
        )}
      </div>

      {/* Add new track to DB */}
      <div style={{ border: "1px solid silver", marginTop: "50px" }}>
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => setNewTrack(e.target.value)}
        />{" "}
        <br />
        <input
          type="text"
          placeholder="Artist"
          onChange={(e) => setNewArtist(e.target.value)}
        />{" "}
        <br />
        <input
          type="text"
          placeholder="Album"
          onChange={(e) => setNewAlbum(e.target.value)}
        />{" "}
        <br />
        <input
          type="text"
          placeholder="Genre"
          onChange={(e) => setNewGenre(e.target.value)}
        />{" "}
        <br />
        <input
          type="number"
          placeholder="Year"
          onChange={(e) => setNewYear(Number(e.target.value))}
        />{" "}
        <br />
        <button onClick={addTrack}>Add</button>
      </div>
    </>
  );
}
