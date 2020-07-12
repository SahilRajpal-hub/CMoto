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
    alert('Your browser is outdated!'); 
  
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
  



    if(areaName === ""){
      var url = document.location.href;
      var data = (url.split("=")[1]).split("%20").join(" ");
      console.log(data);
      ArEa = data.trim();
      areaName = data;
    var refer = firebase.database().ref(`cars/clusters/${areaName}`);
    
    refer.once('value',(snap) => {
      console.log(`cars/clusters/${areaName}/j`);
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
     for(let cluster in socities){
      societyHtml += `<tr> <td> <a href='EmployeeTables.html?name=${encodeURIComponent(areaName + "~" + Object.keys(socities)[i])}' >` + Object.keys(socities)[i] + `</a> </td> <td> ${Object.keys(socities[cluster]).length} </td> </td> <td> N/A </td>  </tr>`;
         i++;
     }
     societyHtml += '</tbody>';
     document.getElementById('dataTable').innerHTML = societyHtml;
        
    });
  }


  var ul = document.getElementById('dataTable');
  ul.onclick = function(event) {
  var target = getEventTarget(event);
  getEmployees(target.innerHTML);
  // showExpiredCars(target.innerHTML);
  };

function getEventTarget(e) {
  e = e || window.event;
  return e.target || e.srcElement; 
}



var society = '';

async function getEmployees(Society) {
  console.log(ArEa+Society);
  society = Society;
  var refe = firebase.database().ref('Employees/' + ArEa + '/' + Society);
  var employeeId = '';
  var employeeIdNum = 0;
  var employeeHtml = ``;
  employeeHtml += `<thead>
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
  await refe.once('value',(snap) => {
      console.log(snap.val());
      var Employees = snap.val();
      for(let employee in Employees){
          employeeId = Object.keys(Employees)[employeeIdNum];
          var Employe = Employees[employee];
          console.log(Employe);
          
          var employeeRef = firebase.database().ref('Employee/'+employeeId);
          employeeRef.on('value',(snap) => {
          var Employeref = snap.val();
          console.log(Employeref);
          employeeHtml += `<tr>`;
          employeeHtml += `<th scope="col"> ${Employe.Name} <br />(<a href='EmployeeTables.html' >${employeeId}</a>)</th>`;
          var todaysCars = Employeref.todaysCars.toString();
          var array = todaysCars.split(',');
          var html = "";
          var totalCars;
          for(let i in array){ 
          console.log(array);
          console.log(array[i] + i);
          if(array[i] !== ''){
          html += `<li > <a href='#' >${array[i]}</a> </li>`;
          }
          }
          employeeHtml += `<td scope="col">${html}</td>`;
          var clusterRef = firebase.database().ref('cars/clusters/'+ArEa+'/'+Society+'/'+Employeref.ClusterNumber+'/CarLocations');
          clusterRef.on('value',(snap) => {
          totalCars = Object.keys(snap.val());
          console.log(snap.val());
          });
          
          employeeHtml += `<td scope="col"> <a href='#' >${Employeref["working on"]}</a> </td>`;
          var date = getTodaysDate();
          var WorkHistory = Employeref["Work History"];
          var CarsCleaned = Object.keys(WorkHistory[date]);
          var html3 ='';
          for(let j in CarsCleaned){ 
          console.log(CarsCleaned);
          console.log(CarsCleaned[j] + j);
          if(CarsCleaned[j] !== '' && CarsCleaned[j] !== 'income'){
          html3 += `<li > <a href='#' >${CarsCleaned[j]}</a> </li>`;
          }
          }
          employeeHtml += `<td scope="col">${html3}</td>`;
          employeeHtml += `</tr>`;
          });
          employeeIdNum++;
      }
      });
      document.getElementById('dataTableEmployee').innerHTML = employeeHtml;
      return null;
}



    function getTodaysDate() {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
  
      today = dd + '-' + mm + '-' + yyyy;
      return today;
    }