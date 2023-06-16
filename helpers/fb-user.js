import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";

import { firebaseConfig } from "./fb-credentials";
import { initializeApp } from "firebase/app";

export function initUserDB() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
}

export function storeUserItem(item) {
  console.log('Writing: ', item);
  const db = getDatabase();
  const reference = ref(db, "userData/");
  push(reference, item);
}

export function setupUserListener(updateFunc) {
    const db = getDatabase();
    const reference = ref(db,"userData/" )
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
