import {auth, provider} from '../../config/firebase-config';
import {signInWithPopup} from 'firebase/auth';
//import {useNavigate} from 'react-router-dom';
import './index.css';

export const Auth = () => {
    const signInWithGoogle = async () => {
      const results = await signInWithPopup(auth, provider);
      console.log(results);
      localStorage.setItem("auth");
    };
  
    return (
      <div className="login-page">
        <div className='sign-in-white'>
        <h1>Welcome to Spendology</h1>
        <h3>Please Sign in with Google to continue</h3>
        <button className="login-with-google-btn" onClick={signInWithGoogle}>
          Sign In With Google
        </button>
        </div>
      </div>
    );
  };