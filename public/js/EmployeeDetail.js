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

    
    var Id = data;
    var carRef = firebase.database().ref('Employee/'+data);
    console.log(Id);
    carRef.once('value',(snap) => {
    console.log(snap.val());
    document.getElementById('employeeId').innerHTML = Id;
    document.getElementById('name').innerHTML = snap.val().Name;
    document.getElementById('address').innerHTML = snap.val().Working_Address;
    document.getElementById('status').innerHTML = snap.val().status;
    document.getElementById('mobile').innerHTML = snap.val().ContactNumber;
    document.getElementById('workingOn').innerHTML = snap.val()['working on'];
    document.getElementById('todaysCars').innerHTML = snap.val().todaysCars.split(",");
    document.getElementById('clusterNumber').innerHTML = snap.val().ClusterNumber;
    document.getElementById('workHistory').innerHTML = JSON.stringify(snap.val()['Work History'],undefined,2);
    
  });