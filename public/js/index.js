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

  firebase.auth.Auth.Persistence.LOCAL


//   firebase.auth().onAuthStateChanged(function(user){
//     if(!user){
//         window.location.href = "login.html";
//     }
// });



  if(typeof(Storage) === "undefined") {
    alert('Your browser is outdated!'); 
  }


  $("#btn-login").click(function(){
    var email = $("#email").val();
    var password = $("#password").val();

    if(email != "" && password != ""){
        var result = firebase.auth().signInWithEmailAndPassword(email, password);
        result.catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert("message : " + errorMessage);
        });
    }else{
        window.alert("empty creditianiles");
    }

  });


  $("#btn-logout").click(function(){
      firebase.database().ref('test/testNode').set({"try" : "done"});
    firebase.auth().signOut();
    window.alert('sign out done');
  });


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

  var paymentsRef = firebase.database().ref('Car Status');
  var PaymentRecieved = 0;
  paymentsRef.once('value', (snap) => {
    var Cars = snap.val();
    // console.log(Cars);
    for(let car in Cars){
      var Car = Cars[car];
      // console.log(Car);
      var payment = Car['Payment History'];
      if(typeof payment != 'undefined'){
      var dates = Object.keys(payment);
      for(let date in dates){
        console.log(dates[date]);
        console.log(dates[date].substring(3,5) +':' + getMonth());
        if(dates[date].substring(3,5)===getMonth()){
            var Date = dates[date];
            console.log('payment : ' + PaymentRecieved);
            PaymentRecieved += parseInt(payment[Date]);
          }
          document.getElementById("earnings").innerHTML = 'Rs. ' + PaymentRecieved;
      }
    }
  }
  });


  var employeeRef = firebase.database().ref(`Employee`);
  employeeRef.once('value', function(snapshot) {
      var employees = snapshot.val();
      var ids = Object.keys(employees);
      var totalIncome = 0;
      var i = 0;
    if (!snapshot.exists()) {
      alert('No employee found');
    }else{
      for(let employee in employees){
          var employe = employees[employee];
              console.log(employe);
              console.log(ids[i]);
             
              var dates = employe['Work History'];
              console.log(dates);
              for(let date in dates){
                  var Date = dates[date];
                  console.log(date + " : " + Date);
                  if(date.substring(3,5)==getMonth()){
                      totalIncome += Date['income'];
                      console.log('its a catch');    
                  }
              }
              
              document.getElementById('expenditure').innerHTML = "Rs. " + totalIncome;
              i++;  
          }
      
    }
  });


var taskRef = firebase.database().ref('Car Status');
taskRef.once('value',(snap) => {
  var cars = snap.val();
  var totalCars = Object.keys(cars).length;
  var carsCleaned = 0;
  for(let car in cars){
    var Car = cars[car];
    if(Car['status'] === 'cleaned'){
      carsCleaned++;
    }
  }
  document.getElementById('task').innerHTML = percentage(totalCars,carsCleaned).toString().substring(0,4)
    +"%  (" + carsCleaned + "/" + totalCars + ")";
  document.getElementById('pendingCars').innerHTML = (totalCars - carsCleaned) + " Cars";  
});  



  var ArEa = '';
  var society = '';
   
function getEventTarget(e) {
  e = e || window.event;
  return e.target || e.srcElement; 
}

var ul = document.getElementById('areas');
    ul.onclick = function(event) {
    var target = getEventTarget(event);
    ArEa = target;
    getSocities(target.innerHTML);

};

function percentage(total , cleaned) {
  return (cleaned/total)*100;
}


function showExpiredCars(Socitiy){
  var CarsRef = firebase.database().ref('Expired/'+ArEa+'/'+Socitiy);
  CarsRef.once('value',(snap => {
    console.log(snap.val());
    var CarsExpired = Object.keys(snap.val());
    console.log("car expired : " + CarsExpired);
    var CarsExpHtml = '<tc> <th scope="row"> Cars Expired </th> </tc>';
    CarsExpHtml += '<tr>';
    var htMl = '';
    var k=0;
    for(let i in CarsExpired){
      console.log(CarsExpired[k]);
      htMl += `<li> <a class="collapse-item" href="tables.html" >${CarsExpired[k]}</a> </li>`;
    k++;
    }
    CarsExpHtml += `<td scope="row"> ${htMl} </td>`;
    CarsExpHtml += '</tr>';
    document.getElementById('Expired').innerHTML = CarsExpHtml;
  }));
}




  

  function getSocities(areaName) {
      console.log(areaName);
      ArEa = areaName;
      var refer = firebase.database().ref('cars/clusters/' + areaName);
      refer.once('value',(snap) => {
        var socities = snap.val(); 
        console.log(socities);
        var societyHtml = `<thead>
        <tr>
          <th>Society Name</th>
          <th>Total Employees</th>
          <th>Total Cars</th>
        </tr>
      </thead>
      <tfoot>
        <tr>
          <th>Society Name</th>
          <th>Total Employees</th>
          <th>Total Cars</th>
        </tr>
      </tfoot>
      <tbody>`;
       var i=0;
       for(let area in socities){
        societyHtml += "<tr> <td> <a href='tables.html' >" + Object.keys(socities)[i] + "</a> </td> <td> N/A </td> </td> <td> N/A </td>  </tr>";
           i++;
       }
       societyHtml += '</tbody>';
       document.getElementById('dataTable').innerHTML = societyHtml;
          
      });
  }

  function getTodaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '-' + mm + '-' + yyyy;
    return today;
  }

  function getMonth() {
    var today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!

    return mm;
  }


