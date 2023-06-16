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

export function initEventDB() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
}

export function storeEventItem(item) {
  console.log('Writing: ', item);
  const db = getDatabase();
  const reference = ref(db, "eventData/");
  push(reference, item);
}

export function setupEventListener(updateFunc) {
    const db = getDatabase();
    const reference = ref(db,"eventData/" )
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
