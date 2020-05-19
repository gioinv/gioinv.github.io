var config = {
  apiKey: "AIzaSyCjGrQH7O26pbzoZzkvU9YHMbTGnYkcMZQ",
  authDomain: "tamtriluc-a788c.firebaseapp.com",
  databaseURL: "https://tamtriluc-a788c.firebaseio.com",
  projectId: "tamtriluc-a788c",
  storageBucket: "tamtriluc-a788c.appspot.com",
  messagingSenderId: "816220875853",
  appId: "1:816220875853:web:8bb7b005e7719cbbb44004",
  measurementId: "G-BCF4PMBEL4"
};
firebase.initializeApp(config);
var db = firebase.firestore();

function addGuest() {
  debugger
  var control = document.getElementById('full_name')
  if (control.value.trim() === "") {
    return
  }
  var control = document.getElementById('email')
  if (control.value.trim() === "" || !/\S+@\S+\.\S+/.test(control.value.trim())) {
    return
  }
  var control = document.getElementById('phone')
  if (control.value.trim() === "" || !/[0-9]{9,12}/.test(control.value.trim())) {
    return
  }
  var control = document.getElementById('message')
  if (control.value.trim() === "") {
    return
  }

  var d = new Date()
  db.collection("customer").add({
      fullName: document.getElementById('full_name').value,
      email: document.getElementById('email').value,
      tel: document.getElementById('phone').value,
      message: document.getElementById('message').value,
      registedDate: d.getFullYear() +'/'+d.getMonth() +'/'+d.getDay(),
      version: 'V2'
    })
    .then(function(docRef) {
      document.getElementById('inform').style.display = 'block'
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
}