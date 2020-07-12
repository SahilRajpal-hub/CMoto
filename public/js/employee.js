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

    
    firebase.initializeApp(firebaseConfig);
  

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

    $("#search").click(function(){
        var name = $("#searchbar").val();
        var employeeSearch = '';
        employeeSearch += `<thead>
        <tr>
          <th>Employee Name</th>
          <th>Employee Id</th>
          <th>Employee's Working Address</th>
        </tr>
      </thead>
      <tfoot>
        <tr>
        <th>Employee Name</th>
        <th>Employee Id</th>
        <th>Employee's Working Address</th>
        </tr>
      </tfoot>
      <tbody>`;
        var employeeRef = firebase.database().ref('Employee');
        var id = 0;
        employeeRef.once('value',(snap) => {
            var employees = snap.val();
            var ids = Object.keys(employees);
            for(let employee in employees){
                var employe = employees[employee];
                if(name.includes(employe['Name'])){
                    console.log("contains");
                    employeeSearch += `<td> ${name} </td> <td>  <a href='EmployeeDetail.html?name=${ids[id]}' >${ids[id]}</a> </td>
                     <td> ${employe['Working_Address']} </td>`;
                }
                id++;
            }
            employeeSearch += '</tbody>';
            document.getElementById('dataTableEmployee').innerHTML = employeeSearch;
        });
    
  });    