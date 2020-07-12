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
    
  
    if(typeof(Storage) === "undefined") {
      alert('Your browser is outdated! and may not support some of the website features'); 
    
    }
  
    var ArEa;
    var areaName = '';
  
  
  
  var AreaSocietyRef = firebase.database().ref('cars/clusters');
  AreaSocietyRef.once('value',(snap) => {
     var areas = snap.val(); 
     console.log(areas);
     var areaHtml = `<h6 class="collapse-header">Areas :</h6>`;
    var i=0;
    for(let area in areas){
        areaHtml += "<a class='collapse-item' href='tables.html?name=" + encodeURIComponent(Object.keys(areas)[i]) + "' >" + Object.keys(areas)[i] + "</a>";
        console.log(Object.keys(areas)[i]);
        i++;
    }
    document.getElementById('areas').innerHTML = areaHtml;
    
  });
    
  

  $("#btn-pay").click(function(){
    var carNumber = $("#carNumber").val();
    var amount = $("#amount").val();
    var address = $("#address").val();
    var obj = {};
    obj[getTodaysDate()] = amount;
    var carsRef = firebase.database().ref(`cars/${address}/${carNumber}`);

    carsRef.once('value', function(snapshot) {
      if (!snapshot.exists()) {
        alert('Car not found at this address');
      }else{
        carsRef.update({'Payment' : 'Active'});
        firebase.database().ref().child('Car Status').child(carNumber).update({"Payment":"Active"});
        firebase.database().ref().child('Car Status').child(carNumber).child("Payment History").child(getTodaysDate()).set(amount);
        $("#amount").text = "";
        $("#carNumber").text = "";
        $("#address").text = "";
      }
    });

  });

  
  function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement; 
  }
  
  
function getTodaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '-' + mm + '-' + yyyy;
    return today;
}