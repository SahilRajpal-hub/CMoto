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
    




function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement; 
  }


  
  var society = '';
  var toWait = false;

getEmployees();


$("#press").click(function(){
  getEmployees();
});

async function getEmployees() {
  var url = document.location.href;
  var data = (url.split("=")[1]).split("%20").join(" ");
  console.log(data);
  var ArEa = data.replace("~","/");
    console.log(ArEa);
    var refe = firebase.database().ref('Employees/' + ArEa);
    var employeeId = '';
    var employeeIdNum = 0;
    var employeeHtml = ``;
     
  await refe.once('value',(snap) => {
        console.log(snap.val());
        var Employees = snap.val();
        employeeHtml += `<thead>
                          <tr>
                            <th>Employee </th>
                            <th>Cars In-Waiting</th>
                            <th>Cars In-Progress</th>
                            <th>Cars Cleaned</th>
                          </tr>
                        </thead>
                        <tfoot>
                          <tr>
                            <th>Employee </th>
                            <th>Cars In-Waiting</th>
                            <th>Cars In-Progress</th>
                            <th>Cars Cleaned</th>
                          </tr>
                        </tfoot>
                        <tbody>`; 
        for(let employee in Employees){
            employeeId = Object.keys(Employees)[employeeIdNum];
            var Employe = Employees[employee];
            console.log(Employe);
            
            var employeeRef = firebase.database().ref('Employee/'+employeeId);
            employeeRef.on('value',(snap) => {
            var Employeref = snap.val();
            console.log(Employeref);
            employeeHtml += `<tr>`;
            employeeHtml += `<td > ${Employe.Name} <br />(<a href='EmployeeDetail.html?name=${employeeId}' >${employeeId}</a>)</td>`;
            var todaysCars = Employeref.todaysCars.toString();
            var array = todaysCars.split(',');
            var html = "";
            var totalCars;
            for(let i in array){ 
            console.log(array);
            console.log(array[i] + i);
            if(array[i] !== ''){
            html += `<ul> <a href='carsDetails.html?name=cars/${ArEa}~${array[i]}'> ${array[i]}</a> </ul>`;
            }
            }
            employeeHtml += `<td scope="col">${html}</td>`;
            var clusterRef = firebase.database().ref('cars/clusters/'+ArEa+'/'+Employeref.ClusterNumber+'/CarLocations');
            clusterRef.on('value',(snap) => {
            totalCars = Object.keys(snap.val());
            console.log(snap.val());
            });
            
            employeeHtml += `<td scope="col"> <ul> <a href='carsDetails.html' >${Employeref["working on"]}</a> </ul></td>`;
            var date = getTodaysDate();
            var WorkHistory = Employeref["Work History"];
            var CarsCleaned = Object.keys(WorkHistory[date]);
            var html3 ='';
            for(let j in CarsCleaned){ 
            console.log(CarsCleaned);
            console.log(CarsCleaned[j] + j);
            if(CarsCleaned[j] !== '' && CarsCleaned[j] !== 'income'){
            html3 += `<ol> <a href='carsDetails.html' >${CarsCleaned[j]}</a> </ol>`;
            }
            }
            employeeHtml += `<td scope="col">${html3}</td>`;
            employeeHtml += `</tr></tbody>`;
            console.log(employeeHtml);
            toWait = true;
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