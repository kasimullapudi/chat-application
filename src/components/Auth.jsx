import { auth, provider } from '../firebase-config';
import { signInWithPopup } from 'firebase/auth';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import google from '../assets/google.png';
export default function Auth(props) {
  const { setIsAuth } = props;
  const cookies = new Cookies();
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Sign-in result:', result); // Debugging log
      cookies.set('auth-token', result.user.refreshToken, { path: '/' });
      console.log('Cookie set:', cookies.get('auth-token')); // Debugging log
      setIsAuth(true);
      navigate('/chat-app/rooms');
    } catch (err) {
      console.log('Error:', err);
    }
  };

  return (
    <div className='Auth-screen'>
      <p>Sign In With Google to Continue</p>
      <button onClick={signInWithGoogle} className='google-btn'>
        <div className='google'>
          <img src={google} alt="G" />
        </div>
        Sign In With Google
      </button>
    </div>
  );
}
