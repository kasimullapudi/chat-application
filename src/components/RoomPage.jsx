import { addDoc, collection, getDocs, query, serverTimestamp, where, onSnapshot, deleteDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import '../styles/RoomPage.css';

export default function RoomPage(props) {
    const navigate = useNavigate();
    const inputRef = props.inputRef;
    const setRoom = props.setRoom;
    const signUserOut = props.signUserOut;
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            const roomsRef = collection(db, "rooms");
            const q = query(roomsRef);
            const unsubscribe = onSnapshot(q, (snapshot) => {
                let roomsArray = [];
                snapshot.forEach((doc) => {
                    roomsArray.push({ ...doc.data(), id: doc.id });
                });
                setRooms(roomsArray);
            });
            return () => unsubscribe();
        };
        fetchRooms();
    }, []);

    const deleteRoom = async (roomName) => {
        const messagesRef = collection(db, "messages");
        const q1= query(messagesRef, where("room", "==", roomName));
        const querySnapshot = await getDocs(q1);
        
        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });

        const roomRef = collection(db, "rooms");
        const q = query(roomRef, where("name", "==", roomName));
        const querySnapshotRoom = await getDocs(q);

        if (!querySnapshotRoom.empty) {
            querySnapshotRoom.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
            alert("Room deleted successfully!");
        } else {
            alert("Room does not exist");
        }

        
    };

    const addRoom = async (roomName) => {
        const roomsRef = collection(db, "rooms");
        const q = query(roomsRef, where("name", "==", roomName));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            await addDoc(roomsRef, { name: roomName, createdAt: serverTimestamp() });
            console.log("Room added successfully!");
        } else {
            console.log("Room already exists!");
        }
        navigate(`/chat-app/rooms/${roomName}`);
    };

    return (
        <>
            <div className="rooms">
                <h2>Join a Chat Room</h2>
                <p>Enter the name of the room you want to join or create a new one.</p>
                <div className="room-input">
                    <label>Enter Room name: </label>
                    <input ref={inputRef} placeholder="Room name" />
                    <div className="roomsbutton">
                        <button onClick={() => {
                        setRoom(inputRef.current.value);
                        addRoom(inputRef.current.value);
                    }}>Enter Room</button>
                    </div>
                    
                </div>
                <h3>Available Rooms</h3>
                <div className="available-rooms">
                    {rooms.length > 0 ? (
                        rooms.map((room) => (
                            <div key={room.id} className="room-btns">
                                <div className="room-item" onClick={() => navigate(`/chat-app/rooms/${room.name}`)}>
                                    {room.name}
                                </div>
                                <div className="delete-room">
                                    <button onClick={() => deleteRoom(room.name)}>Delete</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No rooms available. Create a new room to get started.</p>
                    )}
                </div>
            </div>
            <div className="sign-out" onClick={signUserOut}>Sign Out</div>
        </>
    );
}
