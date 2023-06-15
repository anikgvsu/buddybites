import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";

//import { firebaseConfig } from "./fb-credentials";
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyBF42lvXkuzJKAx8V7sKIZp9s1vgQyLO7A",
  authDomain: "calculator-d35ba.firebaseapp.com",
  databaseURL: "https://calculator-d35ba-default-rtdb.firebaseio.com",
  projectId: "calculator-d35ba",
  storageBucket: "calculator-d35ba.appspot.com",
  messagingSenderId: "606009473062",
  appId: "1:606009473062:web:4fc3fe0875acf6755d8ee7",
  measurementId: "G-F876E37CEN"
};

export function initHistoryDB() {
  initializeApp(firebaseConfig);
}

export function storeHistoryItem(item) {
  console.log('Writing: ', item);
  const db = getDatabase();
  const reference = ref(db, "historyData/");
  push(reference, item);
}

export function setupHistoryListener(updateFunc) {
    const db = getDatabase();
    const reference = ref(db,"historyData/" )
    onValue(reference, (snapshot) => {
        if (snapshot?.val()) {
          const fbObject = snapshot.val();
          const newArr = [];
          Object.keys(fbObject).map((key, index) => {
            newArr.push({ ...fbObject[key], id: key });
          });
          updateFunc(newArr);
        } else {
          updateFunc([]);
        }
      });
}
