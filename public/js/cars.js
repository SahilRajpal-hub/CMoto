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
        areaHtml += "<a class='collapse-item' href='tables.html?name=" + encodeURIComponent(Object.keys(areas)[i]) + "' >" + Object.keys(areas)[i] + "</a>";
        console.log(Object.keys(areas)[i]);
        i++;
    }
    document.getElementById('areas').innerHTML = areaHtml;

});

$("#search").click(function() {
    var car = $("#searchbar").val();
    var carRef = firebase.database().ref(`Car Status/${car}`);
    carRef.once('value', (snap) => {
        console.log(snap.val());
        document.getElementById('carNumber').innerHTML = car;
        document.getElementById('workHistory').textContent = JSON.stringify(snap.val()['Work History'], undefined, 2);
        document.getElementById('paymentHistory').innerHTML = JSON.stringify(snap.val()['Payment History'], undefined, 2);
        document.getElementById('Payment').innerHTML = snap.val().Payment;
    });

});