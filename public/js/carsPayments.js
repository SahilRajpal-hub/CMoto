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
        //  console.log(areas);
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
    document.getElementById('dropdownSocieties').innerHTML = societiesHtml
})

var amount = ''
var address = ''
$('#btn-pay').click(function() {
    var carNumber = $('#carNumber').val()
    var obj = {}
    obj[getTodaysDate()] = amount

    console.log(carNumber)
    console.log(amount)
    console.log(address)
    var carsRef = firebase.database().ref(`cars/${address}/${carNumber}`)

    carsRef.once('value', function(snapshot) {
        if (!snapshot.exists()) {
            alert('Car not found at this address')
        } else {
            carsRef.update({ Payment: 'Active' })
            firebase
                .database()
                .ref()
                .child('Car Status')
                .child(carNumber)
                .update({ Payment: 'Active' })
            firebase
                .database()
                .ref()
                .child('Car Status')
                .child(carNumber)
                .child('Payment History')
                .child(getTodaysDate())
                .set(amount + ' month(s) plan')
            firebase
                .database()
                .ref()
                .child('Car Status')
                .child(carNumber)
                .child('Days_Left')
                .set(29 * parseInt(amount))
            firebase
                .database()
                .ref()
                .child('Expired')
                .child(address)
                .child(carNumber)
                .remove()
            window.alert('Payment Complete')
        }
    })
})

$(document).on('click', '.dropdown-item', function() {
    $('#selected').text($(this).text())
    address = $(this).text()
})

$('.payment').click(function() {
    amount = $(this)[0].value
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