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


firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
        window.location.href = "login.html";
    }
});



if (typeof(Storage) === "undefined") {
    alert('Your browser is outdated!');
}

var AreaSocietyRef = firebase.database().ref('cars/clusters');
AreaSocietyRef.once('value', (snap) => {
    var areas = snap.val();
    console.log(areas);
    var areaHtml = `<h6 class="collapse-header">Areas :</h6>`;
    var i = 0;
    for (let area in areas) {
        areaHtml += "<a class='collapse-item' href='tables.html?name=" + encodeURIComponent(Object.keys(areas)[i]) + "' >" + Object.keys(areas)[i] + "</a>";
        console.log(Object.keys(areas)[i]);
        i++;
    }
    document.getElementById('areas').innerHTML = areaHtml;

});

document.getElementById('monthSelector').value = getMonthName();

let Earnings = [];
let NewCustomerEarnings = [];

var incomeTable = ``;

formTable(getMonth());


$("#getMonth").click(function() {
    console.log(document.getElementById('monthSelector').value);
    formTable(document.getElementById('monthSelector').value);
});

function formTable(month) {
    Earnings = [];
    NewCustomerEarnings = [];
    incomeTable = ``;
    incomeTable += `<thead>
      <tr>
        <th> Date </th>
        <th> New Customer</th>
        <th> Existing Customer</th>
      </tr>
    </thead>
    <tbody>`;
    var paymentsRef = firebase.database().ref('Car Status');
    var PaymentRecieved = 0;
    paymentsRef.once('value', (snap) => {
        var Cars = snap.val();
        // console.log(Cars);
        for (let car in Cars) {
            var Car = Cars[car];
            // console.log(Car);
            var payment = Car['Payment History'];
            if (typeof payment != 'undefined') {
                var dates = Object.keys(payment);
                for (let date in dates) {
                    console.log(dates[date]);
                    console.log(dates[date].substring(3, 5) + ':' + month);

                    if (parseInt(dates[date].substring(3, 5)) === parseInt(month)) {
                        console.log('month matched');
                        var Date = dates[date];
                        totalIncome += Date['income'];
                        if (dates.length != 1) {
                            if (typeof Earnings[Date] != 'undefined') {
                                Earnings[Date] = parseInt(Earnings[Date]) + parseInt(payment[Date]);
                            } else {
                                Earnings[Date] = payment[Date];
                            }
                        } else {
                            if (typeof NewCustomerEarnings[Date] != 'undefined') {
                                NewCustomerEarnings[Date] = parseInt(NewCustomerEarnings[Date]) + parseInt(payment[Date]);
                            } else {
                                NewCustomerEarnings[Date] = payment[Date];
                            }
                        }
                        // incomeTable += `<tr>
                        // <td> ${Date} </td>
                        // <td> ${payment[Date]} </td>
                        // </tr>`;
                        console.log(dates[date] + " : " + payment[Date]);
                        // console.log('its a catch');    
                    }
                }
            }
        }
        incomeTable += '</tbody>';
        console.log(incomeTable);
        console.log(Earnings);
        console.log(NewCustomerEarnings);
        var totalIncome = 0;
        var totalNewIncome = 0;
        for (let earning in Earnings) {

            totalIncome += parseInt(Earnings[earning]);

            if (typeof NewCustomerEarnings[earning] != 'undefined') {
                incomeTable += `<tr>
              <td> <a href="dateDetails.html?date=${earning}"> ${earning} <a/> </td>
              <td> ${NewCustomerEarnings[earning]} </td>
              <td> ${Earnings[earning]} </td>
              </tr>`;


                totalNewIncome += parseInt(NewCustomerEarnings[earning]);
                delete NewCustomerEarnings[earning];
            } else {
                incomeTable += `<tr>
              <td> <a href="dateDetails.html?date=${earning}"> ${earning} </a> </td>
              <td>  </td>
              <td> ${Earnings[earning]} </td>
              </tr>`;
            }
        }
        for (let earning in NewCustomerEarnings) {
            incomeTable += `<tr>
              <td> <a href="dateDetails.html?date=${earning}"> ${earning} </td>
              <td> ${NewCustomerEarnings[earning]} </td>
              <td>  </td>
              </tr>`;
            totalNewIncome += parseInt(NewCustomerEarnings[earning]);
        }
        incomeTable += `<tfoot>
                        <tr>
                        <th> Total </th>
                        <th> ${totalNewIncome} </th>
                        <th> ${totalIncome} </th>
                        </tr>
                      </tfoot>`;
        document.getElementById("earningsMonthly").innerHTML = incomeTable;
    });

}



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


function showExpiredCars(Socitiy) {
    var CarsRef = firebase.database().ref('Expired/' + ArEa + '/' + Socitiy);
    CarsRef.once('value', (snap => {
        console.log(snap.val());
        var CarsExpired = Object.keys(snap.val());
        console.log("car expired : " + CarsExpired);
        var CarsExpHtml = '<tc> <th scope="row"> Cars Expired </th> </tc>';
        CarsExpHtml += '<tr>';
        var htMl = '';
        var k = 0;
        for (let i in CarsExpired) {
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
    refer.once('value', (snap) => {
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
        var i = 0;
        for (let area in socities) {
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

function getMonthName() {
    var today = new Date();

    var month = new Array();
    month[0] = "1";
    month[1] = "2";
    month[2] = "3";
    month[3] = "4";
    month[4] = "5";
    month[5] = "6";
    month[6] = "7";
    month[7] = "8";
    month[8] = "9";
    month[9] = "10";
    month[10] = "11";
    month[11] = "12";

    return month[today.getMonth()];
}