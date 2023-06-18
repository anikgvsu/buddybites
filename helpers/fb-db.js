import { getDatabase, onValue, push, ref } from "firebase/database";
import { firebaseConfig } from "./fb-credentials";
import { getApps, initializeApp } from "firebase/app";

export function initFirebase() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
}


export function getAllUsers(callback) {
  const db = getDatabase();

  const userReference = ref(db, "userData/");
  onValue(userReference, (userSnapshot) => {
    const users = [];
    if (userSnapshot?.val()) {
      const fbUserObject = userSnapshot.val();
      Object.keys(fbUserObject).forEach((key) => {
        const user = { ...fbUserObject[key], id: key };
        users.push(user);
      });
    }
    
    callback(users);
  });
}


export function getUsersAndEvents(hostId, callback) {
    const db = getDatabase();
  
    const userReference = ref(db, "userData/");
    onValue(userReference, (userSnapshot) => {
      const users = [];
      if (userSnapshot?.val()) {
        const fbUserObject = userSnapshot.val();
        Object.keys(fbUserObject).forEach((key) => {
          const user = { ...fbUserObject[key], id: key };
          if (user.uid !== hostId) {
            users.push(user);
          }
        });
      }
      
      const eventReference = ref(db, "eventData/");

      onValue(eventReference, (eventSnapshot) => {
        const eventsAsHost = [];
        const eventsAsGuest = [];
        if (eventSnapshot?.val()) {
          const fbEventObject = eventSnapshot.val();
          Object.keys(fbEventObject).forEach((key) => {
            const event = { ...fbEventObject[key], id: key };

            const guestUserUids = event.guestList;

            if (event.hostUid === hostId) {
              eventsAsHost.push(event);
            }

            else if ( guestUserUids.includes(hostId) ) {
              eventsAsGuest.push(event);
            }

          });
        }
        
        callback(users, eventsAsHost, eventsAsGuest);
      });
    });
  }
  
  export function getEventById(eventId, callback) {
    const db = getDatabase();
    const reference = ref(db, `eventData/${eventId}`);
    onValue(reference, (snapshot) => {
      if (snapshot?.val()) {
        const eventData = snapshot.val();
  
        const hostUid = eventData.hostUid;
        const guestList = eventData.guestList || [];
        const userReference = ref(db, "userData/");
  
        onValue(userReference, (userSnapshot) => {
          const users = {};
          if (userSnapshot?.val()) {
            const fbUserObject = userSnapshot.val();
            Object.keys(fbUserObject).forEach((key) => {
              const user = { ...fbUserObject[key], id: key };
              users[user.uid] = user;
            });
          }

          // console.log(users);
          // console.log(hostUid);

          const host = users[hostUid];
          // console.log(host);
          // const hostName = '';
          const hostName = host.name;

          // console.log(hostName);
  
          const guests = guestList.map((guestUid) => {
            const guest = users[guestUid];
            return {
              name: guest?.name || "",
              favoriteFoods: guest?.favoriteFoods || "",
              dietHabit: guest?.dietHabit || "",
            };
          });
  
          const allergies = guestList
            .map((guestUid) => {
              const guest = users[guestUid];
              return guest?.allergy || "";
            })
            .filter((allergy) => allergy !== "");

          const allergiesString = allergies.join(", ");

  
          eventData.hostName = hostName;
          eventData.guests = guests;
          eventData.allergies = allergiesString;
          callback(eventData);
        });
      } else {
        callback(null);
      }
    });
  }
  
  


export function storeUserItem(item) {
  console.log('Writing user item:', item);
  const db = getDatabase();
  const reference = ref(db, "userData/");
  push(reference, item);
}

export function storeEventItem(item) {
  console.log('Writing event item:', item);
  const db = getDatabase();
  const reference = ref(db, "eventData/");
  push(reference, item);
}


