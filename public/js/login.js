var firebaseConfig = {
    apiKey: "AIzaSyA2BXvxqGhzbqa-9eCg1EXMA7u3u0G8UsM",
    authDomain: "cmoto-4267a.firebaseapp.com",
    databaseURL: "https://cmoto-4267a.firebaseio.com",
    projectId: "cmoto-4267a",
    storageBucket: "cmoto-4267a.appspot.com",
    messagingSenderId: "416346424448",
    appId: "1:416346424448:web:e7c40ab227e4e2c9341265",
    measurementId: "G-LLBGG2X7FH"
  };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    firebase.auth.Auth.Persistence.LOCAL;

var email = $("#email").val();
var password = $("#password").val();

$("#btn-login").click(function(){
    var email = $("#email").val();
    var password = $("#password").val();

    if(email != "" && password != ""){
        var result = firebase.auth().signInWithEmailAndPassword(email, password);
        if(firebase.auth().currentUser){
            window.location.href = "index.html";
        }
        result.catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert("message : " + errorMessage);
        });
    }else{
        window.alert("empty creditianiles");
    }

  });