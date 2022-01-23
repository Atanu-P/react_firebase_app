import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  setDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpruValZV_trlVvh6qmbZej6BP1Qgo0EM",

  authDomain: "vue-authentication-f649e.firebaseapp.com",

  projectId: "vue-authentication-f649e",

  storageBucket: "vue-authentication-f649e.appspot.com",

  messagingSenderId: "808538763097",

  appId: "1:808538763097:web:500e7b050028a12cbc2648",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password).then(
      (credential) => {
        // console.log(credential, "user");

        if (credential.user.emailVerified) {
          sessionStorage.setItem(
            "Auth Token",
            credential._tokenResponse.refreshToken
          );
        } else {
          alert("Pls verify your email !!");
          signOut(auth);
        }
      }
    );
  } catch (err) {
    console.log(err.message);
    if (err.message === "Firebase: Error (auth/user-not-found).") {
      alert("User not found");
    } else if (err.message === "Firebase: Error (auth/wrong-password).") {
      alert("Wrong password !!");
    }
    // alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    console.log(res.user, "res");
    // sessionStorage.setItem("Auth Token", res._tokenResponse.refreshToken);

    const user = res.user;
    await updateProfile(user, {
      displayName: name,
    });

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      signup_date: Timestamp.fromDate(new Date()),
    });
    // await addDoc(collection(db, "users"), {
    //   uid: user.uid,
    //   name,
    //   authProvider: "local",
    //   email,
    // });
    sendEmailVerification(res.user).then(() => {
      alert(
        "New user successfully registerd ! verification link sent to email id !!"
      );
    });
    signOut(auth);
  } catch (err) {
    console.error(err);
    // alert(err.message);
    if (err.message === "Firebase: Error (auth/email-already-in-use).") {
      alert(" User with email-id already exist !! Use different email-id !!");
    }
  }
};

const logout = () => {
  signOut(auth).then(() => {
    if (sessionStorage.getItem("Auth Token")) {
      sessionStorage.removeItem("Auth Token");
      console.log("auth token destroyed");
    }
    console.log("logout");
  });
};

export {
  app,
  db,
  auth,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
};
