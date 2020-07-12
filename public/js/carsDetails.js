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

    var AreaSocietyRef = firebase.database().ref('cars/clusters');
    AreaSocietyRef.once('value',(snap) => {
       var areas = snap.val(); 
       console.log(areas);
       var areaHtml = `<h6 class="collapse-header">Areas :</h6>`;
      var i=0;
      for(let area in areas){
          areaHtml += "<a class='collapse-item' href='tables.html' >" + Object.keys(areas)[i] + "</a>";
          console.log(Object.keys(areas)[i]);
          i++;
      }
      document.getElementById('areas').innerHTML = areaHtml;
      
    });


    var url = document.location.href;
    var data = (url.split("=")[1]).split("%20").join(" ");
    console.log(data);  


    var carRef = firebase.database().ref(data.replace("~",'/'));
    carRef.once('value',(snap) => {
    console.log(snap.val());
    document.getElementById('carNumber').innerHTML = snap.val().number;
    document.getElementById('Location').innerHTML = snap.val().Location;
    document.getElementById('Address').innerHTML = snap.val().address;
    document.getElementById('Category').innerHTML = snap.val().category;
    document.getElementById('mobile').innerHTML = snap.val().mobileNo;
    document.getElementById('Name').innerHTML = snap.val().name;
    document.getElementById('Model').innerHTML = snap.val().model;
    firebase.database().ref('Car Status/'+(data.replace('~','/')).split('/')[3])
    .once('value',(snapshot) => {
      console.log(snapshot.val());
      document.getElementById('Status').innerHTML = snapshot.val().status;
      document.getElementById('workHistory').textContent =  JSON.stringify(snapshot.val()['Work History'],undefined,2);
      document.getElementById('paymentHistory').textContent = JSON.stringify(snapshot.val()['Payment History'],undefined,2);
      document.getElementById('Payment').innerHTML = snapshot.val().Payment;
      document.getElementById('daysLeft').innerHTML = snapshot.val()['Days_Left'];
    });
  });
    