var configFirebase = {
  apiKey: "AIzaSyBdtNuGG9qVa3_-9Ms_40evAtwxe8AuNVQ",
  authDomain: "mbeat-ae6b6.firebaseapp.com",
  databaseURL: "https://mbeat-ae6b6.firebaseio.com",
  projectId: "mbeat-ae6b6",
  storageBucket: "mbeat-ae6b6.appspot.com",
  messagingSenderId: "256327489211"
};
firebase.initializeApp(configFirebase);

var db = firebase.firestore();

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});


// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

var arrColor = {"Available":"#1fe0ed", "AvailableSel":"#0cbfcb","Sold":"#ff485f","SoldSel":"#da253b","Unavailable":"#ffd76c","UnavailableSel":"#e2b12f"}; 
var arrAllProps = [];  
var arrLoggedUser = {};
var tableToken = "Ad4Fvb67xW2z";   


/**
* * save all pros into arrProps, and update then with firestore listner
* 
*/
function getAllPropsListener(){
  var firstLoad = true;
  //fordebug, get only floor=1 (quota)
  let propsRefL = db.collection("Props").where("floorNum",">=",2);
  propsRefL = propsRefL.where("floorNum","<=",4);
  propsRefL.onSnapshot(function(querySnapshot) {
    
    arrAllProps = [];
    querySnapshot.forEach(function(doc) {
      arrAllProps.push(doc.data());
    });
    //console.log(arrAllProps);
    console.log('fire');
    //if first load ,call getFilterProps 
    if(firstLoad){
      getFilterProps([], [], [], []);
      firstLoad = false;
    }
  });
  
  //check if defined user in UserLogged , from bmby or last connection
  let UserLoggedRef = db.collection("UserLogged").doc(tableToken);
  UserLoggedRef.get().then(function(doc) {
    if (doc.exists) {
      //get users by doc.bmbyClientId   logged
      let userAccountRef = db.collection("UserAccount");
      userAccountRef = userAccountRef.where("bmbyClientId", "==", doc.get("bmbyClientId"));
      userAccountRef.get().then(function(querySnapshot) {
        let userDoc = querySnapshot.docs;

        for (let user of userDoc) {
          //update arrLoggedUser
          arrLoggedUser = {"docId":user.id, "name":user.get('name')}  ;
        };
        callback_logIn({"status":"success", "msg":""});
      });
      
    }

  });

}


/**
* get filter settings
* 
* @param floorLevel
* @param roomNum
* @param {String} status
* @param salePrice
*/
function getFilterSettings(){
  let roomsRange = [1,1.5,2,2.5,3];
  let priceRange = [1000000,32400000];
  callback_getFilterSettings(roomsRange, priceRange );
}


/**
* get appartment from filter  from arrAllProps          
* 
* @param EngineId
* @param floor
*/
function getFilterProps(floorLevel, roomNum, pstatus, salePrice){

  let props = {};
  let i = 0;
  let propsColors = [];
  let propsStatus = [];
  let status = '';
  let countSold = 0;
  let countAvailable = 0;


  arrAllProps.forEach(prop => {

    if(typeof floorLevel != 'undefined' && floorLevel.length){
      if(floorLevel.indexOf(prop.floorLevel) == -1){
        return;
      }
    }

    if(typeof roomNum != 'undefined' && roomNum.length){
      if(roomNum.indexOf(prop.roomNum) == -1){
        return;
      }
    }

    if(typeof pstatus != 'undefined' && pstatus.length){
      if(pstatus.indexOf(prop.status) == -1){
        return;
      }
    }

    //check price range only for Available prop
    if(typeof salePrice != 'undefined' && salePrice.length == 2 && prop.status == 'Available'){
      if(prop.salePrice < salePrice[0] || prop.salePrice > salePrice[1]){
        return;
      }
    }


    status = prop.status;
    status = status.trim();

    //get color
    if(typeof propsColors[arrColor[status]] == 'undefined'){
      propsColors[arrColor[status]] = [];
    }

    propsColors[arrColor[status]].push(prop['3DEngineId']) ;


    //get text status count
    if(status == 'Sold') countSold++;
    if(status == 'Available') countAvailable++;

    props[i] = prop;

    props[i]["floorPost"] = setFloorPost(prop.floorNum);


    props[i]["status"] = status;

    //if not Available don't show price
    if(status != 'Available'){
      props[i]["propPricePerSqFt"]= "";
      props[i]["salePrice"]= "";
    }

    i++;

  });

  callback_getFilterProps(props, propsColors, 'Available ' + countAvailable + ' | ' + 'Sold ' + countSold );


}

/**
* logIn function, insert Logged User into  arrLoggedUser
* update DB UserLogged - by tableToken (UserLogged->documentId = tableToken) 
* api to bmby - insert user into UserLog and return true or false
* 
*/
function logIn(email, pwd){

  //Check if User exist, and Get User Details
  let userAccountRef = db.collection("UserAccount");
  userAccountRef = userAccountRef.where("email", "==", email);
  userAccountRef = userAccountRef.where("password", "==", pwd);
  userAccountRef.get().then(querySnapshot => {
    let userDoc = querySnapshot.docs;
    let logged = false;
    let bmbyClientId = 0;

    for (let user of userDoc) {
      //update arr
      arrLoggedUser = {"docId":user.id, "name":user.get('name')}  ;

      bmbyClientId   = user.get('bmbyClientId');
      logged = true;
    };

    //update ClientLogged
    if(logged){

      callback_logIn({"status":"success", "msg":""});

      db.collection("UserLogged").doc(tableToken).set({
        bmbyClientId: bmbyClientId
      })
      .catch(function(error) {
        console.error("Error update UserLogged: ", error);
      });
    }
    else{
      callback_logIn({"status":"error", "msg":"Invalid Email Or Password"});
    }


  });
}

/**
* create a new user in Firestor 
* (in the futur, send lead to bmby, to create a new Client - and get ClientID)
* 
* @param fname
* @param lname
* @param email
* @param phone
* @param pwd
* @param agreeNewsletter
*/
function register(fname, lname, email, phone, pwd, agreeNewsletter){
  //check if email exist
  let userAccountRef = db.collection("UserAccount");
  userAccountRef = userAccountRef.where("email", "==", email);
  userAccountRef.get().then(querySnapshot => {
    let userDoc = querySnapshot.docs;
    let logged = false;

    if(userDoc.length) {
      callback_register({"status":"error", "msg":"This email already exists"});
      return;
    }

    //to do - send lead to bmby

    //insert user
    db.collection("UserAccount").add({
      bmbyClientId: Math.floor((Math.random() * 10000) + 1), //need to get CLientId from bmby
      name: fname + ' ' + lname,
      phone : phone,
      email: email,
      password:pwd
    })
    .then(function(docRef) {
      callback_register({"status":"success", "msg":""});
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
      callback_register({"status":"error", "msg":"Error adding user", error});
    });
  });

}

/**
* logout - delete arrLoggedUser
*        - delete UserLogged byTable Token
*/
function logOut(){
  arrLoggedUser = {};

  //delete UserLogged - by tableToken
  db.collection("UserLogged").doc(tableToken).delete().then(function() {
    console.log("Document successfully deleted!");
    callback_logOut({"status":"success", "msg":""});
  }).catch(function(error) {
    console.error("Error removing document: ", error);
    callback_logOut({"status":"error", "msg":"Error removing document" + error});
  });
}



/**
* get wishList
* 
* @param doc - UserAccount
*/
function getWishList(){
  //get docId from arrLoggedUser
  docId = arrLoggedUser.docId;
  
  if(typeof arrLoggedUser.docId == 'undefined') {
    callback_addPropInWishList([]);
    return;
  }

  //get all docs (DocumentSnapshot) from subcolletions  WishList
  userAccountRef = db.collection("UserAccount").doc(docId).collection("WishList");
  userAccountRef.get().then(DocumentSnapshot => {
    docs = DocumentSnapshot.docs;
    //let props = [];
    //let wishListProps = [];
    let wishList = [];
    let wishListPropsId = [];
    let wishListProps = {};

    for (let doc of docs) {
      //wishListProps.push(doc.data());
      wishListPropsId.push(doc.get("bmbyPropId"));
      wishListProps[doc.get("bmbyPropId")] = doc.get("remark");
    }



    if(wishListPropsId.length) { //get allProps from firestore

      //get props from arrAllProps
      for(let prop of arrAllProps) {
        let oneWish = {}; 
        //get prop data
        if(wishListPropsId.indexOf(prop.bmbyPropID) !== -1){
          oneWish =  prop;
          oneWish["remark"] = wishListProps["prop.bmbyPropID"];
          wishList.push(oneWish);

        } 
      }


    }

    
    callback_getWishList(wishList);


  });

}



/**
* get appartment details and floor details
* 
* @param EngineId
* @param floor
*/
function getAppDetails(EngineId, floor){

  let propDetails = {};
  let status = '';
  let i = 0;
  let floorData = {};

  for(let prop of arrAllProps) {  

    status = prop.status;
    status = status.trim();

    //get prop data
    if(EngineId == prop["3DEngineId"]) {
      propDetails =  prop;
      propDetails["floorPost"] = setFloorPost(propDetails.floorNum);

      //if not Available don't show price

      propDetails["status"]= status;
      if(status != 'Available'){
        propDetails["propPricePerSqFt"]= "";
        propDetails["salePrice"]= "";
      }


    }

    //get floor data
    
    floorData[i] = {"engineID":prop["3DEngineId"],
      "text":prop.propType + ' ' + prop.propNum,
      "status":status,
      "isSelected":(EngineId==prop["3DEngineId"] ? true: false)}; 
      
      i++;
  };

  callback_getAppDetails(propDetails);
  //callback_getFloorDetails(floorData);

}

function setFloorPost(floor){
  let postFloor = "th";
  if(floor == 1){
    postFloor = "st"
  }else if(floor == 2){ 
    postFloor = "nd"
  }else if(floor == 3){ 
    postFloor = "rd"
  }
  return postFloor;
}

/**
* insert into WishList
* Need to update bmby
* @param docId
* @param propId
* @param remark
*/
function addPropInWishList( propId, remark){
  docId = arrLoggedUser.docId;

  if(typeof arrLoggedUser.docId == 'undefined') {
    callback_addPropInWishList(0);
    return;
  }
  // Add a new document with a generated id. 
  db.collection("UserAccount").doc(docId).collection("WishList").add({
    bmbyPropId: propId,
    remark: remark
  })
  .then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
    callback_addPropInWishList(1);
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
    callback_addPropInWishList(0);
  });

}

/**
* delete prop into WishList
* Need to update bmby
* 
* @param propId
*/
function deletePropInWishList(propId){

  docId = arrLoggedUser.docId;

  if(typeof arrLoggedUser.docId == 'undefined') {
    callback_deletePropInWishList(0);
    return;
  }

  //get propId docs (DocumentSnapshot) from subcolletions  WishList
  userAccountRef = db.collection("UserAccount").doc(docId).collection("WishList");
  userAccountRef = userAccountRef.where("bmbyPropId","==",propId);
  userAccountRef.get().then(DocumentSnapshot => {
    docs = DocumentSnapshot.docs;


    for (let doc of docs) {
      //delete the doc
      db.collection("UserAccount").doc(docId).collection("WishList").doc(doc.id).delete().then(function() {
        //console.log("Document successfully deleted!");
        callback_deletePropInWishList(1);
      }).catch(function(error) {
        //console.error("Error removing document: ", error);
        callback_deletePropInWishList(0);
      });
    }
  });
}




//gallery
// let query = db.collection('Gallery').where(type === 'general');
// console.log('test');
// query.get().then(querySnapshot => {
//   let docs = querySnapshot.docs;
//   let projGalery = {};
//   let i = 0;
//   for (let doc of docs) {
//     projGalery[i] = doc.data();
//     i++;
//   }
  // let createGallery(projGalery);

  var docRef = db.collection('Gallery').doc('AoCvMIImcCQ4jRXpvR21');
// Update the timestamp field with the value from the server
  var updateTimestamp = docRef.update({
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  console.log(updateTimestamp);

// Read firestoreGallery data from database in the Gallery collection
  db.collection("Gallery").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      let galeryItems = doc.data();
      console.log(galeryItems);
      console.log('Test');
      if (galeryItems.type === 'general') {
        let createLi = document.createElement('li');
        let link = document.createElement('a');
        link.setAttribute('href', galeryItems.url);

        link.setAttribute('rel', "gallery-3");
        link.setAttribute('class', 'swipebox');
        link.onclick = function () {
          clickedPic(galeryItems.url);
        };
        createLi.appendChild(link);
        let createImg = document.createElement('img');
        createImg.setAttribute('src', galeryItems.url);
        link.appendChild(createImg);
        document.getElementById("photoslist").appendChild(createLi);
      }
    });
    var clickedPic = function (url) {
      window.location.href = url;
    };

});


