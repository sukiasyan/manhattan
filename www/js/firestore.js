function loadFirebase () {

// Initialize Firebase

  var config = {
    apiKey: "AIzaSyBdtNuGG9qVa3_-9Ms_40evAtwxe8AuNVQ",
    authDomain: "mbeat-ae6b6.firebaseapp.com",
    databaseURL: "https://mbeat-ae6b6.firebaseio.com",
    projectId: "mbeat-ae6b6",
    storageBucket: "mbeat-ae6b6.appspot.com",
    messagingSenderId: "256327489211"
  };

  firebase.initializeApp(config);


  var firestore = firebase.firestore();
  console.log("Cloud Firestores Loaded");


  var db = firebase.firestore();

  var timestamps = firebase.firestore();
  var settings = {
    timestampsInSnapshots: true
  };
  firestore.settings(settings);


// Enable offline capabilities
  firebase.firestore().enablePersistence()
    .then(function () {
      // Initialize Cloud Firestore through firebase
      var db = firebase.firestore();
    })
    .catch(function (err) {
      if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a a time.

      } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
      }
    });


// SUPLIERS Collection ************************************
// var docRef = db.collection('Suppliers').doc('AoCvMIImcCQ4jRXpvR21');
// // Update the timestamp field with the value from the server
// var updateTimestamp = docRef.update({
//   timestamp: firebase.firestore.FieldValue.serverTimestamp()
// });
// console.log(updateTimestamp)
//
// // Read firestore data from database in the meetups collection
// db.collection("Suppliers").get().then((querySnapshot) => {
//   querySnapshot.forEach((doc) => {
//     var meetups = doc.data();
//     console.log(meetups);
//
//
//     var element = document.createElement("LI");
//     var textnode = document.createTextNode(meetups.address);
//     element.appendChild(textnode);
//     document.getElementById("Suppliers").appendChild(element);
//   });
// });


// Gallery Collection ************************************
  var docRef = db.collection('Gallery').doc('AoCvMIImcCQ4jRXpvR21');
// Update the timestamp field with the value from the server
  var updateTimestamp = docRef.update({
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  console.log(updateTimestamp);

// Read firestoreGallery data from database in the Gallery collection
  db.collection("Gallery").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      var meetups = doc.data();
      console.log(meetups);
      if (meetups.floorNum === "All") {
        var createLi = document.createElement('li');
        var link = document.createElement('a');
        link.setAttribute('href', meetups.url);

        link.setAttribute('rel', "gallery-3");
        link.setAttribute('class', 'swipebox');
        link.onclick = function () {
          clickedPic(meetups.url);
        };
        createLi.appendChild(link);
        var createImg = document.createElement('img');
        createImg.setAttribute('src', meetups.url);
        link.appendChild(createImg);
        document.getElementById("photoslist").appendChild(createLi);
      }
    });
  });


  var clickedPic = function (url) {
    window.location.href = url;
  };


// Wishlist Collection ************************************
// var docRef = db.collection('Wishlist').doc('AoCvMIImcCQ4jRXpvR21');
// // Update the timestamp field with the value from the server
// var updateTimestamp = docRef.update({
//   timestamp: firebase.firestore.FieldValue.serverTimestamp()
// });
// console.log(updateTimestamp);

// Read firestoreGallery data from database in the Gallery collection
// db.collection("Wishlist").get().then((querySnapshot) => {
//   querySnapshot.forEach((doc) => {
//     var meetups = doc.data();
//     console.log(meetups);
  // var createLi = document.createElement('li');
  // var link = document.createElement('a');
  // link.setAttribute('href', meetups.url);
  //
  // link.setAttribute('rel', "gallery-3");
  // link.setAttribute('class', 'swipebox');
  // link.onclick = function () { clickedPic(meetups.url);};
  // createLi.appendChild(link);
  // var createImg = document.createElement('img');
  // createImg.setAttribute('src', meetups.url);
  // link.appendChild(createImg);
  // document.getElementById("photoslist").appendChild(createLi);
//
//   });
// });

}