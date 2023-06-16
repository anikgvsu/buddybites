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

// export function setupEventListenerByHostUid(hostUid, updateFunc) {
//   const db = getDatabase();
//   const reference = ref(db, "eventData/");
//   onValue(reference, (snapshot) => {
//     if (snapshot?.val()) {
//       const fbObject = snapshot.val();
//       const newArr = [];
//       Object.keys(fbObject).forEach((key) => {
//         const event = { ...fbObject[key], id: key };
//         if (event.hostUid === hostUid) {
//           newArr.push(event);
//         }
//       });
//       updateFunc(newArr);
//     } else {
//       updateFunc([]);
//     }
//   });
// }

export function getEventsByHostId(hostId, callback) {
  const db = getDatabase();
  const reference = ref(db, "eventData/");
  onValue(reference, (snapshot) => {
    if (snapshot?.val()) {
      const fbObject = snapshot.val();
      const newArr = Object.keys(fbObject).reduce((result, key) => {
        const event = { ...fbObject[key], id: key };
        if (event.hostUid === hostId) {
          result.push(event);
        }
        return result;
      }, []);
      callback(newArr);
    } else {
      callback([]);
    }
  });
}



export function getEventById(eventId, callback) {
  const db = getDatabase();
  const reference = ref(db, `eventData/${eventId}`);
  onValue(reference, (snapshot) => {
    if (snapshot?.val()) {
      const eventData = snapshot.val();
      callback(eventData);
    } else {
      callback(null);
    }
  });
}