import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

export const SignIn = () => {
  const signIn = () => {
    signInWithPopup(auth, provider).catch((err) => alert(err));
  };
  return (
    <div>
      <button onClick={signIn}>Sign In</button>
    </div>
  );
};
