import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCW6Q8KG7BQp98CevMm2Uq9UM1TWOletBA",
  authDomain: "anemia-detection-415119.firebaseapp.com",
  projectId: "anemia-detection-415119",
  storageBucket: "anemia-detection-415119.appspot.com",
  messagingSenderId: "730525504291",
  appId: "1:730525504291:web:1015ee13bb7690b1f4b296"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { app, auth };
