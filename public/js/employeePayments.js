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

if (typeof Storage === 'undefined') {
    alert(
        'Your browser is outdated! and may not support some of the website features'
    )
}

var ArEa
var areaName = ''

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

document.getElementById('btn-pay').style.visibility = 'hidden'

var SocietiesRef = firebase.database().ref('address')
SocietiesRef.once('value', (snap) => {
    var areas = snap.val()
    console.log(areas)
    var societiesHtml = ``
    var i = 0
    var j = 0
    var areasName = Object.keys(areas)
    for (let area in areas) {
        var societiesName = Object.keys(areas[area])
        j = 0
        for (; j < societiesName.length; j++) {
            console.log(i + ':' + j)
            societiesHtml +=
                '<a class="dropdown-item" href="#">' +
                areasName[i] +
                '/' +
                societiesName[j] +
                '</a>'
        }
        i++
    }
    societiesHtml += `<div class="dropdown-divider"></div>
                          <a class="dropdown-item" href="#">New Society</a>
                      </div>`
    console.log(societiesHtml)
    document.getElementById('dropdownSocieties').innerHTML = societiesHtml
})

var employeeId = ''
var address = ''
var totalPayment = 0
$('#btn-fetch').click(function() {
    var email = $('#employeeEmail').val()
    var totalIncome = 0
    var paymentHtml = ''
    paymentHtml += `<thead>
      <tr>
        <th>Date </th>
        <th>Income</th>
      </tr>
    </thead>
    <tbody>`

    var employeeRef = firebase.database().ref(`Employees/${address}`)
    employeeRef.once('value', function(snapshot) {
        var employees = snapshot.val()
        var ids = Object.keys(employees)
        var i = 0
        if (!snapshot.exists()) {
            alert('No employee found at this address')
        } else {
            for (let employee in employees) {
                var employe = employees[employee]
                if (employe['email'] === email) {
                    console.log(employe)
                    console.log(ids[i])
                    employeeId = ids[i]
                    var ref = firebase.database().ref(`Employee/${ids[i]}/Work History`)
                    ref.once('value', (snap) => {
                        var dates = snap.val()
                        for (let date in dates) {
                            var Date = dates[date]
                            if (typeof Date['paid on'] === 'undefined') {
                                paymentHtml += `<tr> <td> ${date} </td><td> ${Date['income']} </td></tr>`
                                totalIncome += Date['income']
                                console.log('its a catch')
                            } else {
                                console.log(Date['paid on'])
                            }
                        }
                        paymentHtml += `</tbody> 
                    <tfoot>
                    <tr>
                      <th>Total Income</th>
                      <th> ${totalIncome} </th>
                    </tr>
                  </tfoot>`
                        totalPayment = totalIncome
                        document.getElementById('dataTable').innerHTML = paymentHtml
                        document.getElementById('btn-pay').style.visibility = 'visible'
                    })
                }
                i++
            }
        }
    })
})

$(document).on('click', '.dropdown-item', function() {
    $('#selected').text($(this).text())
    address = $(this).text()
})

$('#btn-pay').click(function() {
    console.log('starting payment')
    var paymentRef = firebase
        .database()
        .ref(`Employee/${employeeId}/Work History`)
    paymentRef.once('value', (snap) => {
        var dates = snap.val()
        for (let date in dates) {
            var Date = dates[date]
            if (typeof Date['paid on'] === 'undefined') {
                paymentRef.child(date).update({ 'paid on': getTodaysDate() })
                console.log('its a catch')
            } else {
                console.log(Date['paid on'])
            }
        }
    })
})

function getEventTarget(e) {
    e = e || window.event
    return e.target || e.srcElement
}

function getTodaysDate() {
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    var yyyy = today.getFullYear()

    today = yyyy + '-' + mm + '-' + dd
    return today
}