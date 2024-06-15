import { addDoc, collection, onSnapshot, query, serverTimestamp, where, orderBy, getDocs, deleteDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase-config";
import '../styles/Chat.css';
import { useParams } from "react-router-dom";
import '../styles/Bubble.css';
import RoomBubble from "./RoomBubble";
import { useNavigate} from "react-router-dom";
import back from '../assets/back-button.png';
export default function Chat(props) {
    const params = useParams();
    const room = params.roomName;
    const navigate=useNavigate();
    const signUserOut = props.signUserOut;
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const messageRef = collection(db, "messages");
    const messageListRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage === "") return;
        await addDoc(messageRef, {
            text: newMessage,
            user: auth.currentUser.displayName,
            userID: auth.currentUser.uid,
            photoURL: auth.currentUser.photoURL, // Added line
            createdAt: serverTimestamp(),
            room,
        });
        
        setNewMessage("");
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        const queryMessage = query(messageRef, where("room", "==", room), orderBy("createdAt"));
        const unsubscribe = onSnapshot(queryMessage, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id, isOwn: doc.data().user === auth.currentUser.displayName });
            });
            setMessages(messages);
            if (messageListRef.current) {
                messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
            }
        });
        return () => unsubscribe();
    }, [room]);

        const clearMessages = async () => {
            const messagesRef = collection(db, "messages");
            const q= query(messagesRef, where("room", "==", room));
            const querySnapshot = await getDocs(q);
            
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
        }
    

    return (
        <>
            <div className="message-box">
                <div className="header">
                    <div className="back"><button onClick={()=>navigate('/chat-app/rooms')}><img src={back} alt="back" /></button></div>
                    <div className="roomname">{room.toUpperCase()}</div>
                    <div className="clear"><button onClick={clearMessages}>Clear Chat</button></div>
                </div>
                <div className="message-list" ref={messageListRef}>
                    {messages.map((doc) => (
                        <div key={doc.id} className={`message ${doc.isOwn ? 'own-message' : 'other-message'}`}>
                            {doc.photoURL && (
                                <span className="user-img">
                                    <img src={doc.photoURL} alt="user" />
                                </span>
                            )}
                            <div className="user-name">{doc.user}</div>
                            <div className="message-text">{doc.text}</div>
                            <div className="timestamp">
                                {doc.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="new-message-form">
                    <input
                        type="text"
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="new-message-input"
                        value={newMessage}
                        placeholder="Type a message"
                    />
                    <button type="submit" className="new-message-btn">Send</button>
                </form>
            </div>
            <div className="sign-out" onClick={signUserOut}>Sign Out</div>
            <RoomBubble />
        </>
    );
}
