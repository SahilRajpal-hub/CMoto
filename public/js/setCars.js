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
AreaSocietyRef.once('value', (snap) => {
    var areas = snap.val();
    console.log(areas);
    var areaHtml = `<h6 class="collapse-header">Areas :</h6>`;
    var i = 0;
    for (let area in areas) {
        areaHtml += "<a class='collapse-item' href='tables.html' >" + Object.keys(areas)[i] + "</a>";
        console.log(Object.keys(areas)[i]);
        i++;
    }
    document.getElementById('areas').innerHTML = areaHtml;

});

var AreaSocietyRef = firebase.database().ref('cars/clusters')
AreaSocietyRef.once('value', (snap) => {
    var areas = snap.val()
    console.log(areas)
    var areaHtml = `<h6 class="collapse-header">Areas :</h6>`
    var i = 0
    for (let area in areas) {
        areaHtml +=
            "<a class='collapse-item' href='setDuties.html?name=" +
            encodeURIComponent(Object.keys(areas)[i]) +
            "' >" +
            Object.keys(areas)[i] +
            '</a>'
        console.log(Object.keys(areas)[i])
        i++
    }
    document.getElementById('duties').innerHTML = areaHtml
})


async function setCars() {
    var url = document.location.href;
    var data = (url.split("=")[1]).split("%20").join(" ");
    console.log(data);
    var ArEa = data.replace("~", "/");
    console.log(ArEa);

    var employeeRef = firebase.database().ref('cars/' + ArEa);
    employeeRef.once('value', (snap) => {
        var cars = Object.keys(snap.val());
        console.log(cars)
        let carsHtml = ``;
        for (let car in cars) {
            carsHtml += `<h1 id="drag${car}" draggable="true" ondragstart="drag(event)" style="margin: 10px;">${cars[car]} </h1>`;
        }
        document.getElementById('cars').innerHTML = carsHtml
    });
}







function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}


setCars();

var society = '';
var toWait = false;

getEmployees();



var employeeIdArray = [];
async function getEmployees() {
    var url = document.location.href;
    var data = (url.split("=")[1]).split("%20").join(" ");
    console.log(data);
    var ArEa = data.replace("~", "/");
    console.log(ArEa);
    var refe = firebase.database().ref('Employees/' + ArEa);
    var employeeId = '';
    var employeeIdNum = 0;
    var employeeHtml = ``;

    await refe.once('value', (snap) => {
        console.log(snap.val());
        var Employees = snap.val();
        employeeIdArray = Object.keys(Employees);

        for (let employee in Employees) {
            employeeId = Object.keys(Employees)[employeeIdNum];
            var Employe = Employees[employee];
            console.log(Employe);
            employeeHtml += `<div id="${Employe.email}" ondrop="drop(event)" style=" width: 500px; margin: 10px; border: 1px solid black;" ondragover="allowDrop(event)">,${Employe.Name} ,</div>`
            employeeIdNum++;
        }
    });

    document.getElementById('employees').innerHTML = employeeHtml;
    return null;
}

$("#press").click(function() {
    var text = document.getElementById("employees").textContent;
    var cars = text.split(',');
    var url = document.location.href;
    var data = (url.split("=")[1]).split("%20").join(" ");
    console.log(data);
    var ArEa = data.replace("~", "/");
    console.log(text);
    console.log(cars);
    for (let i = 2, j = 0; i <= cars.length; i += 2, j++) {
        console.log(cars[i].split(' ').join(', '));
        console.log(employeeIdArray[j]);
        var ref = firebase.database().ref('Employee/' + employeeIdArray[j]);
        ref.update({ todaysCars: cars[i].split(' ').join(', ') });
        var ref2 = firebase.database().ref('Employees/' + ArEa + '/' + employeeIdArray[j]);
        ref2.update({ todaysCars: cars[i].split(' ').join(', ') });
    }

});



function getTodaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '-' + mm + '-' + yyyy;
    return today;
}