var firebaseConfig = {
        apiKey: 'AIzaSyA2BXvxqGhzbqa-9eCg1EXMA7u3u0G8UsM',
        authDomain: 'cmoto-4267a.firebaseapp.com',
        databaseURL: 'https://cmoto-4267a.firebaseio.com',
        projectId: 'cmoto-4267a',
        storageBucket: 'cmoto-4267a.appspot.com',
        messagingSenderId: '416346424448',
        appId: '1:416346424448:web:e7c40ab227e4e2c9341265',
        measurementId: 'G-LLBGG2X7FH',
    }
    // Initialize Firebase
firebase.initializeApp(firebaseConfig)

firebase.auth.Auth.Persistence.LOCAL

firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
        window.location.href = 'login.html'
    }
})

if (typeof Storage === 'undefined') {
    alert('Your browser is outdated!')
}

var AreaSocietyRef = firebase.database().ref('cars/clusters')
AreaSocietyRef.once('value', (snap) => {
    var areas = snap.val()
    console.log(areas)
    var areaHtml = `<h6 class="collapse-header">Areas :</h6>`
    var i = 0
    for (let area in areas) {
        areaHtml +=
            "<a class='collapse-item' href='tables.html?name=" +
            encodeURIComponent(Object.keys(areas)[i]) +
            "' >" +
            Object.keys(areas)[i] +
            '</a>'
        console.log(Object.keys(areas)[i])
        i++
    }
    document.getElementById('areas').innerHTML = areaHtml
})

var carsRef = firebase.database().ref('Car Status')
var expiredTable = ``
expiredTable += `<thead>
      <tr>
        <th> Expired </th>
        <th> 1-Day Left </th>
        <th> 2-Day Left </th>
        <th> 3-Day Left </th>
        <th> 4-Day Left </th>
      </tr>
    </thead>
    <tbody>`
var carZeroDayLeft = []
var carOneDayLeft = []
var carTwoDayLeft = []
var carThreeDayLeft = []
var carFourDayLeft = []
carsRef.once('value', (snap) => {
    var cars = snap.val()
    for (let car in cars) {
        // console.log(cars[car]);
        var Car = cars[car]
        if (Car['Days_Left'] == 4) {
            carFourDayLeft[car] = car
        } else if (Car['Days_Left'] == 3) {
            carThreeDayLeft[car] = car
        } else if (Car['Days_Left'] == 2) {
            carTwoDayLeft[car] = car
        } else if (Car['Days_Left'] == 1) {
            carOneDayLeft[car] = car
        } else if (Car['Days_Left'] == 0) {
            carZeroDayLeft[car] = car
        }
    }

    // console.log(carZeroDayLeft);
    // console.log(carOneDayLeft);
    // console.log(carTwoDayLeft);

    var index = Math.max(
        Object.keys(carZeroDayLeft).length,
        Object.keys(carOneDayLeft).length,
        Object.keys(carTwoDayLeft).length,
        Object.keys(carThreeDayLeft).length,
        Object.keys(carFourDayLeft).length
    )
    for (let i = 0; i < index; i++) {
        expiredTable += `<tr>`
        if (typeof Object.keys(carZeroDayLeft)[i] != 'undefined') {
            expiredTable += `<td> ${Object.keys(carZeroDayLeft)[i]} </td>`
        } else {
            expiredTable += `<td>  </td>`
        }
        if (typeof Object.keys(carOneDayLeft)[i] != 'undefined') {
            expiredTable += `<td> ${Object.keys(carOneDayLeft)[i]} </td>`
        } else {
            expiredTable += `<td>  </td>`
        }
        if (typeof Object.keys(carTwoDayLeft)[i] != 'undefined') {
            expiredTable += `<td> ${Object.keys(carTwoDayLeft)[i]} </td>`
        } else {
            expiredTable += `<td>  </td>`
        }
        if (typeof Object.keys(carThreeDayLeft)[i] != 'undefined') {
            expiredTable += `<td> ${Object.keys(carThreeDayLeft)[i]} </td>`
        } else {
            expiredTable += `<td>  </td>`
        }
        if (typeof Object.keys(carFourDayLeft)[i] != 'undefined') {
            expiredTable += `<td> ${Object.keys(carFourDayLeft)[i]} </td>`
        } else {
            expiredTable += `<td>  </td>`
        }
        expiredTable += `</tr>`
            //   `<td> ${Object.keys(carOneDayLeft)[i]} </td>
            //   <td> ${Object.keys(carTwoDayLeft)[i]} </td>
            //   <td> ${Object.keys(carThreeDayLeft)[i]} </td>
            //   <td> ${Object.keys(carFourDayLeft)[i]} </td>
            // </tr>`
    }

    expiredTable += `</tbody>`
    document.getElementById('expiredTable').innerHTML = expiredTable
})

var ArEa = ''
var society = ''

function getEventTarget(e) {
    e = e || window.event
    return e.target || e.srcElement
}

var ul = document.getElementById('areas')
ul.onclick = function(event) {
    var target = getEventTarget(event)
    ArEa = target
    getSocities(target.innerHTML)
}

function showExpiredCars(Socitiy) {
    var CarsRef = firebase.database().ref('Expired/' + ArEa + '/' + Socitiy)
    CarsRef.once('value', (snap) => {
        console.log(snap.val())
        var CarsExpired = Object.keys(snap.val())
        console.log('car expired : ' + CarsExpired)
        var CarsExpHtml = '<tc> <th scope="row"> Cars Expired </th> </tc>'
        CarsExpHtml += '<tr>'
        var htMl = ''
        var k = 0
        for (let i in CarsExpired) {
            console.log(CarsExpired[k])
            htMl += `<li> <a class="collapse-item" href="tables.html" >${CarsExpired[k]}</a> </li>`
            k++
        }
        CarsExpHtml += `<td scope="row"> ${htMl} </td>`
        CarsExpHtml += '</tr>'
        document.getElementById('Expired').innerHTML = CarsExpHtml
    })
}

function getSocities(areaName) {
    console.log(areaName)
    ArEa = areaName
    var refer = firebase.database().ref('cars/clusters/' + areaName)
    refer.once('value', (snap) => {
        var socities = snap.val()
        console.log(socities)
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
          <tbody>`
        var i = 0
        for (let area in socities) {
            societyHtml +=
                "<tr> <td> <a href='tables.html' >" +
                Object.keys(socities)[i] +
                '</a> </td> <td> N/A </td> </td> <td> N/A </td>  </tr>'
            i++
        }
        societyHtml += '</tbody>'
        document.getElementById('dataTable').innerHTML = societyHtml
    })
}

function getTodaysDate() {
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    var yyyy = today.getFullYear()

    today = yyyy + '-' + mm + '-' + dd
    return today
}

function getMonth() {
    var today = new Date()
    var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!

    return mm
}

function getMonthName() {
    var today = new Date()

    var month = new Array()
    month[0] = '1'
    month[1] = '2'
    month[2] = '3'
    month[3] = '4'
    month[4] = '5'
    month[5] = '6'
    month[6] = '7'
    month[7] = '8'
    month[8] = '9'
    month[9] = '10'
    month[10] = '11'
    month[11] = '12'

    return month[today.getMonth()]
}