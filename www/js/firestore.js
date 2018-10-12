// Initialize Firebase
let config = {
  apiKey: "AIzaSyBdtNuGG9qVa3_-9Ms_40evAtwxe8AuNVQ",
  authDomain: "mbeat-ae6b6.firebaseapp.com",
  databaseURL: "https://mbeat-ae6b6.firebaseio.com",
  projectId: "mbeat-ae6b6",
  storageBucket: "mbeat-ae6b6.appspot.com",
  messagingSenderId: "256327489211"
};

firebase.initializeApp(config);
let firestore = firebase.firestore();
console.log("Cloud Firestores Loaded");

var db = firebase.firestore();

const timestamps = firebase.firestore();
const settings = {
  timestampsInSnapshots: true
};
firestore.settings(settings);


// Enable offline capabilities
firebase.firestore().enablePersistence()
  .then(function() {
    // Initialize Cloud Firestore through firebase
    var db = firebase.firestore();
  })
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a a time.

    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
    }
  });


var docRef = db.collection('Suppliers').doc('AoCvMIImcCQ4jRXpvR21');
// Update the timestamp field with the value from the server
var updateTimestamp = docRef.update({
  timestamp: firebase.firestore.FieldValue.serverTimestamp()
});
console.log(updateTimestamp)

// Read firestore data from database in the meetups collection
db.collection("Suppliers").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} =>`, doc.data());
    const meetups = doc.data();
    next_title.innerText = meetups.next_title;
    next_desc.innerText = meetups.next_desc;
    recent_title.innerText = meetups.recent_title;
    recent_desc.innerText = meetups.recent_desc;
  });
});