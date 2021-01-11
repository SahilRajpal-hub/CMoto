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
var UID = ''
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        UID = user.uid
        console.log('id : ' + user + '   ' + user.uid)
    }
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
    console.log(societiesHtml)
    document.getElementById('dropdownSocieties').innerHTML = societiesHtml
})

var WorkingAddress = ''

$('#btn-add').click(function() {
    var email = $('#email').val()
    var password = $('#password').val()

    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code
            var errorMessage = error.message
                // ...
        })
    console.log(UID)

    var name = $('#name').val()
    var Address = $('#address').val()
    var Phone = $('#phone').val()
    var cluster = $('#cluster').val()
    var imageUrl = ''

    const AadharPhoto = document.querySelector('#aadhar').files[0]
    const AadharimageRef = firebase
        .storage()
        .ref('employee/' + WorkingAddress + '/' + name + getTodaysDate())
    const AadharImageName = 'AadharPhoto' + '-' + getTodaysDate()
    const AadharMetadata = {
        contentType: photo.type,
    }
    const task1 = AadharimageRef.child(AadharImageName).put(
        AadharPhoto,
        AadharMetadata
    )

    task1.then((snapshot) => {
        snapshot.ref.getDownloadURL().then(function(aadharDownloadUrl) {
            const photo = document.querySelector('#photo').files[0]
            const imageRef = firebase
                .storage()
                .ref('employee/' + WorkingAddress + '/' + name + getTodaysDate())
            const imageName = 'EmployeePhoto' + '-' + getTodaysDate()
            const metadata = {
                contentType: photo.type,
            }
            console.log(photo)
            const task = imageRef.child(imageName).put(photo, metadata)
            task.then((snap) => {
                alert('Image uploaded')
                snap.ref.getDownloadURL().then(function(downloadURL) {
                    console.log('File available at', downloadURL)
                    imageUrl = downloadURL['i']
                    aadharImageUrl = aadharDownloadUrl['i']
                    console.log(imageUrl)
                    var ref = firebase.database().ref('Employee/' + UID)
                    ref.update({ Working_Address: WorkingAddress })
                    ref.update({ Name: name })
                    ref.update({ ContactNumber: Phone })
                    ref.update({ Address: Address })
                    ref.update({ ClusterNumber: 'clusters ' + cluster })
                    ref.update({ status: 'free' })
                    ref.update({ 'working on': '' })
                    ref.update({ todaysCars: '' })
                    firebase
                        .database()
                        .ref('Employees/' + WorkingAddress + '/' + UID)
                        .update({ ClusterNumber: 'clusters ' + cluster })
                    firebase
                        .database()
                        .ref('Employees/' + WorkingAddress + '/' + UID)
                        .update({ Name: name })
                    firebase
                        .database()
                        .ref('Employees/' + WorkingAddress + '/' + UID)
                        .update({ Working_Address: WorkingAddress })
                    firebase
                        .database()
                        .ref('Employees/' + WorkingAddress + '/' + UID)
                        .update({ status: 'free' })
                    firebase
                        .database()
                        .ref('Employees/' + WorkingAddress + '/' + UID)
                        .update({ todaysCars: '' })
                    firebase
                        .database()
                        .ref('Employees/' + WorkingAddress + '/' + UID)
                        .update({ 'working on': '' })
                    firebase
                        .database()
                        .ref('Employees/' + WorkingAddress + '/' + UID)
                        .update({ email: email })
                    alert('Data uploaded Successfully')
                })
            })
        })
    })
})

$(document).on('click', '.dropdown-item', function() {
    $('#selected').text($(this).text())
    WorkingAddress = $(this).text()
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