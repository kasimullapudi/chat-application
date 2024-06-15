import { useState,useRef,useEffect } from 'react'
import Auth from './components/Auth';
import Cookies from 'universal-cookie';
import Chat from './components/Chat';
import { auth } from './firebase-config';
import { signOut } from 'firebase/auth';
import RoomPage from './components/RoomPage';
import { Route,Routes } from 'react-router-dom';
import ProtectedRoutes from './components/ProtectedRoutes';
import PageNotFound from './components/PageNotFound';
const cookies=new Cookies();
function App() {
  
  const [isAuth,setIsAuth]=useState(!!cookies.get("auth-token"));
  const [room,setRoom]=useState(null);
  const inputRef=useRef(null);

  useEffect(() => {
    setIsAuth(cookies.get("auth-token"));
  }, []);


  const signUserOut = async () =>{
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setRoom(null);
  }
  
  
  return(
    <Routes>
        <Route path='/' element={<Auth setIsAuth={setIsAuth}/>}/>
        <Route path='/chat-app' element={<ProtectedRoutes isAuth={isAuth}/>}>
          <Route path='rooms' element={<RoomPage inputRef={inputRef} setRoom={setRoom} signUserOut={signUserOut}/>}/>
          <Route path='rooms/:roomName' element={<Chat signUserOut={signUserOut}/>}/>
        </Route>
        <Route path='*' element={<PageNotFound/>}/>
    </Routes>
  )
  
}
export default App;
