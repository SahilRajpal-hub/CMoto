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
    
  

  $("#btn-add").click(function(){
    // var photo = $("#photo").val();
    var CarNumber = $("#carNumber").val();
    var OwnerName = $("#ownerName").val();
    var Address = $("#address").val();
    var WorkingAddress = $("#workingAddress").val();
    var Phone = $("#Phone").val();
    var Location = $("#location").val();
    var category = $("#Category").val();
    var color = $("#color").val();
    var model = $("#model").val();
    var imageUrl = '';

    const photo = document.querySelector("#photo").files[0];
    const imageRef = firebase.storage().ref('cars/'+WorkingAddress+'/'+CarNumber);
    const imageName = "CarPhoto" + "-" + getTodaysDate();
    const metadata = {
        contentType: photo.type
    }
    console.log(photo);
    const task = imageRef.child(imageName).put(photo,metadata);
    task.then(snap => {
        alert("Image uploaded");
        snap.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
            imageUrl = downloadURL['i'];
            console.log(imageUrl);
            var ref = firebase.database().ref('cars/'+WorkingAddress+"/"+CarNumber);
            ref.update({'Location' : Location});
            ref.update({'address' : Address});
            ref.update({'number' : CarNumber});
            ref.update({'name' : OwnerName});
            ref.update({'mobileNo' : Phone});
            ref.update({'photo' : downloadURL});
            ref.update({'category' : category});
            ref.update({'color' : color});
            ref.update({'model' : model});
            ref.update({'Payment' : 'pending'});
            firebase.database().ref('Car Status/'+CarNumber).update({'Payment': 'pending'});
            firebase.database().ref('Car Status/'+CarNumber).update({'category': category});
            alert("Data uploaded Successfully")
          });
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