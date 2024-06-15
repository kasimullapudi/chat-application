import { useState, useEffect } from "react";
import { db } from "../firebase-config"; 
import { getDocs, collection } from "firebase/firestore";
import '../styles/Bubble.css';
import { useNavigate } from "react-router-dom";

function RoomBubble() {
    const navigate = useNavigate();
    const [avRooms, setAvRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isBubbleOpen, setIsBubbleOpen] = useState(false);
    
    useEffect(() => {
        async function fetchRooms() {
            const roomsRef = collection(db, "rooms");
            const roomsSnapshot = await getDocs(roomsRef);
            const roomsData = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAvRooms(roomsData);
        }
        fetchRooms();
    }, []);

    useEffect(() => {
        if (selectedRoom) {
            navigate(`/chat-app/rooms/${selectedRoom}`);
        }
    }, [selectedRoom, navigate]);

    const toggleBubble = () => {
        setIsBubbleOpen(!isBubbleOpen);
    };

    const handleRoomSelection = (roomName) => {
        setSelectedRoom(roomName);
        setIsBubbleOpen(false);
    };

    return (
        <>
            <p className="bubble-label">Available Rooms<br/> &nbsp; 👇</p>
            <div className={`bubble ${isBubbleOpen ? "open" : ""}`} onClick={toggleBubble}>
                <div className="bubble-content">
                    {isBubbleOpen && avRooms && (
                        <div className="room-list">
                            {avRooms.map(room => (
                                <div key={room.id} className="room-elem" onClick={() => handleRoomSelection(room.name)}>
                                    {room.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default RoomBubble;
