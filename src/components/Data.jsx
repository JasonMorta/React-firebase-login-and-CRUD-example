import React, { useEffect, useState } from "react";
import { db, auth } from "../config/firebase";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
  where,
} from "firebase/firestore";

//4QfCZqRVTkSzAn3QasKp7FjDXwP2
export default function Data({ userData }) {
  console.log('userData', userData)
  const [trackList, setTrackList] = useState([]);

    const getTracks = async () => {
    console.log(`%c Get user data`, "color: #2196f3");
    //const currentUser = JSON.parse(sessionStorage.getItem("user")) // get the current user from session storage
    const currentUser = auth.currentUser;

    try {
      const dbCollection = collection(db, "tracks");
      //console.log('dbCollection', dbCollection)
      const trackData = await getDocs(dbCollection);
      console.log("trackData", trackData.docs); // Access the docs property

      const filteredData = trackData.docs.map((doc) => ({
        //trackData.docs: trackData represents the data retrieved from Firestore, and 
        //docs is an array property containing the list of documents in the result.
        //.map((doc) => { ... }): The map function is used to iterate over each document in the docs array and perform an operation on it. 
        // It creates a new array where each element corresponds to the transformed version of the original document.
        ...doc.data(), // retrieves the data stored within the Firestore document. The spread operator ... is used to extract all the properties from the data object and include them in the new object being created.
        id: doc.id,//id is a new property being added to the new object. It is set to the id value of the Firestore document. The id represents the unique identifier of the document.
        // The resulting object with the spread data and the added id property is returned for each document in the docs array.
        // The map function collects all the returned objects and creates a new array called filteredData. 
        // This array contains the transformed documents where each object includes the extracted data from the Firestore document as well as the corresponding id.
      }));
      setTrackList(filteredData);
      console.log("filteredData", filteredData);
    } catch (error) {
      console.log(`%c error`, "color: red");
      console.log(error);
    }

    console.log("trackList: ", trackList);
  };

  useEffect(() => {
    getTracks();
  }, [userData]);

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
          email: user.email,
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
    console.log("item", item);
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
      //const user = auth.currentUser; // Get the currently signed-in user
      if (!userData) { // If user is not signed in
        console.log("User not signed in.");
        return;
      }
      //identified by the collection path ("music") > and the document ID (trackId)
      const trackDoc = doc(db, "tracks", tackId); // Create a reference to the specific track document

          await updateDoc(trackDoc, { // Update the document with the new values
            title: editTitle,
            artist: editArtist,
            album: editAlbum,
            genre: editGenre,
            year: editYear,
          });
          getTracks(); // Refresh the track list
          setDialog(false); // Close the dialog

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <dialog open={dialog}>
        <p
          onClick={() => {
            setDialog(false);
          }}
        >
          <b>close</b>
        </p>
        <br />
        <input
          type="text"
          placeholder="Title"
          value={editTitle ? editTitle : ""}
          onChange={(e) => setEditTitle(e.target.value)}
        />{" "}
        <br />
        <input
          type="text"
          placeholder="Artist"
          value={editArtist ? editArtist : ""}
          onChange={(e) => setEditArtist(e.target.value)}
        />{" "}
        <br />
        <input
          type="text"
          placeholder="Album"
          value={editAlbum ? editAlbum : ""}
          onChange={(e) => setEditAlbum(e.target.value)}
        />{" "}
        <br />
        <input
          type="text"
          placeholder="Genre"
          value={editGenre ? editGenre : ""}
          onChange={(e) => setEditGenre(e.target.value)}
        />{" "}
        <br />
        <input
          type="number"
          placeholder="Year"
          value={editYear ? editYear : ""}
          onChange={(e) => setEditYear(Number(e.target.value))}
        />{" "}
        <br />
        <button
          onClick={() => {
            updateTrack();
          }}
        >
          Update
        </button>
      </dialog>
      <br />
      <p>{userData !== null ? userData?.displayName : ""}</p>
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
                <span className="user-email">{item.email}</span>
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
