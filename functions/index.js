const functions = require('firebase-functions')
const firebase = require('firebase-admin')
const { error } = require('firebase-functions/lib/logger')
var config = {
    apiKey: 'AIzaSyDKUTIUzqfbyW4jCzq96NRSM7BnnGJRpL4',
    authDomain: 'cmoto-4267a.web.app',
    databaseURL: 'https://cmoto-4267a.firebaseio.com',
    storageBucket: 'https://console.firebase.google.com/project/cmoto-4267a/storage/cmoto-4267a.appspot.com',
}
firebase.initializeApp(config)

// Get a reference to the database service
var database = firebase.database()

// this will update database for regular change i.e. cleaning cars , removing cleaned cars, updating to do cars
var Cars
exports.UpdatingDataBase = functions.database
    .ref('/Car Status/{CarNumber}')
    .onUpdate((change, context) => {
        // console.log("updation of cars work started");
        const before = change.before.val()
        const after = change.after.val()
        if (before === after) {
            return null
        }
        if (after.status !== 'cleaned') {
            return null
        }
        if (before.status === after.status) {
            return null
        }
        const employeeId = before.doneBy
            //  console.log(employeeId);
        var todaysCarsLeft = ''
        var CarNumberToBeRemoved = ''
        var imageURL1 = ''
        var imageURL2 = ''

        var ref = database.ref('/Employee/' + employeeId)
        ref.once('value', async function(snapshot) {
            Cars = snapshot.val()
                // console.log('Cars = ' + Cars);

            CarNumberToBeRemoved = context.params.CarNumber
            todaysCarsLeft = newTodaysCars(CarNumberToBeRemoved, Cars.todaysCars)
                // console.log('cars to be removed = ' + CarNumberToBeRemoved);
            await ref.update({ todaysCars: todaysCarsLeft })
            var CarCatgory = Cars.Working_Address
            await firebase
                .database()
                .ref('Employees/' + CarCatgory + '/' + employeeId)
                .update({ todaysCars: todaysCarsLeft })
            firebase
                .database()
                .ref(
                    'Employees/' + CarCatgory + '/' + employeeId + '/Missed Car History'
                )
                .child(getTodayDate())
                .update({ todaysCars: todaysCarsLeft })

            // check if payment is done than remove car from expired
            if (Cars.Days_Left === 29) {
                var obj = {}
                obj[CarNumberToBeRemoved] = null
                database.ref('Expired/' + CarCatgory).update(obj)
                database
                    .ref('cars/' + CarCatgory + '/' + CarNumberToBeRemoved)
                    .update({ Payment: 'Active' })
            }
            // updating employee earnings
            // first getting the category of car
            var category
            var price
            var income
            var carRef = database.ref(
                'cars/' + CarCatgory + '/' + CarNumberToBeRemoved
            )

            carRef.once('value', (snapshot) => {
                category = snapshot.val().category
                if (
                    category.toString().toLowerCase() === 'sedan' ||
                    category.toString().toLowerCase() === 'luv'
                ) {
                    price = 14
                } else if (
                    category.toString().toLowerCase() === 'hatchback' ||
                    category.toString().toLowerCase() === 'compactsedan'
                ) {
                    price = 12
                } else if (category.toString().toLowerCase() === 'suv') {
                    price = 18
                }
            })
            var EmployeeEarningRef = ref.child('Work History').child(getTodayDate())
            await EmployeeEarningRef.once('value', async(snapshot) => {
                //  console.log(snapshot.val());

                if (snapshot.val() === null || isNaN(snapshot.val().income)) {
                    //  console.log("Income is set to be zero :" + getTodayDate());
                    await EmployeeEarningRef.update({ income: 0 })
                } else {
                    price = price + snapshot.val().income
                }
                imageURL1 = snapshot
                    .child(CarNumberToBeRemoved)
                    .child('Image Url 0')
                    .val()
                    .toString()
                    //  console.log(price);
                income = price
                EmployeeEarningRef.update({ income: income })

                const accountSid = 'ACe4789c3d43bd020626b5dfca34a4fb08'
                const authToken = '4ef1bdad0eef1e73fbe6cc8aa8d8f183'
                const client = require('twilio')(accountSid, authToken)

                const message = {
                    mediaUrl: [imageURL1],
                    from: 'whatsapp:+14155238886',
                    body: 'Hello there! you car is cleaned : ' + CarNumberToBeRemoved,
                    to: 'whatsapp:+919310331578',
                }
                console.log(imageURL1)

                return client.messages
                    .create(message)
                    .then((message) => {
                        return console.log('message ' + message)
                    })
                    .catch((err) => {
                        console.log('err ' + err)
                    })
            })
        })
        var DaysAvailiableRef = database.ref(`Car Status/${CarNumberToBeRemoved}`)

        return firebase
            .database()
            .ref(`/Car Status/${CarNumberToBeRemoved}`)
            .once('value', async function(snap) {
                console.log(CarNumberToBeRemoved)
                console.log(after)
                var Payment = after.Payment
                var DaysLeft = after.Days_Left
                if (Payment === 'Active') {
                    if (DaysLeft === 1) {
                        DaysAvailiableRef.update({ Payment: 'Expired' })
                        await carRef.update({ Payment: 'Expired' })
                        var date = getTodayDate()
                        var obj = {}
                        obj[CarNumberToBeRemoved] = date
                        await firebase
                            .database()
                            .ref('Expired/' + CarCatgory)
                            .update(obj)
                            // console.log(CarNumberToBeRemoved);
                    }
                    await DaysAvailiableRef.update({ Days_Left: DaysLeft - 1 })
                }
            })
    })

// this will update database for interior cleaning of cars i.e. cleaning cars , removing cleaned cars, updating to do cars
exports.UpdatingDataBaseForInterior = functions.database
    .ref('/Car Status/{CarNumber}')
    .onUpdate((change, context) => {
        // console.log("updation of cars work started");
        const before = change.before.val()
        const after = change.after.val()
            //  console.log(after);
        if (
            before['Interior Cleaning status'] === after['Interior Cleaning status']
        ) {
            return null
        }
        if (after.status.toString() === before.status.toString()) {
            return null
        }
        if (after['Interior Cleaning status'] !== 'cleaned') {
            return null
        }
        const employeeId = before.doneBy
            //  console.log(employeeId);
        var todaysCarsLeft
        var CarNumberToBeRemoved

        var ref = database.ref('/InteriorEmployee/' + employeeId)
        ref.once('value', function(snapshot) {
            Cars = snapshot.val()
                // console.log('Cars = ' + Cars);

            CarNumberToBeRemoved = context.params.CarNumber
            todaysCarsLeft = newTodaysCars(CarNumberToBeRemoved, Cars.todaysCars)
                // console.log('cars to be removed = ' + CarNumberToBeRemoved);
            ref.update({ todaysCars: todaysCarsLeft })
            var CarCatgory = Cars.Working_Address
            firebase
                .database()
                .ref('InteriorEmployees/' + CarCatgory + '/' + employeeId)
                .update({ todaysCars: todaysCarsLeft })
            var employeeCluster = firebase
                .database()
                .ref('InteriorEmployee/' + employeeId + '/ClusterNumber')
            employeeCluster.once('value', (snapshot) => {
                var cluster = snapshot.val()
                console.log(cluster)
                firebase
                    .database()
                    .ref(
                        'InteriorClusters/' +
                        CarCatgory +
                        '/' +
                        cluster +
                        '/' +
                        'CarLocations' +
                        '/' +
                        CarNumberToBeRemoved
                    )
                    .remove()
            })

            // // check if payment is done than remove car from expired
            // if(Cars.Days_Left === 26){
            //   var obj = {};
            //   obj[CarNumberToBeRemoved] = null;
            //   database.ref('Expired/'+CarCatgory).update(obj);
            //   database.ref('cars/'+CarCatgory+'/'+CarNumberToBeRemoved).update({"Payment":"Active"});

            // }
            // updating employee earnings
            // first getting the category of car
            var category
            var price
            var income
            var carRef = database.ref(
                'cars/' + CarCatgory + '/' + CarNumberToBeRemoved
            )
            carRef.once('value', (snapshot) => {
                category = snapshot.val().category
                if (
                    category.toString().toLowerCase() === 'sedan' ||
                    category.toString().toLowerCase() === 'luv'
                ) {
                    price = 14
                } else if (category.toString().toLowerCase() === 'hatchback') {
                    price = 12
                } else if (category.toString().toLowerCase() === 'suv') {
                    price = 18
                }
            })
            var EmployeeEarningRef = ref.child('Work History').child(getTodayDate())
            EmployeeEarningRef.once('value', (snapshot) => {
                //  console.log(snapshot.val());

                if (isNaN(snapshot.val().income)) {
                    //  console.log("Income is set to be zero :" + getTodayDate());
                    EmployeeEarningRef.update({ income: 0 })
                } else {
                    price = price + snapshot.val().income
                }
                //  console.log(price);
                income = price
                EmployeeEarningRef.update({ income: income })
            })
            var DaysAvailiableRef = database.ref('Car Status/' + CarNumberToBeRemoved)
            DaysAvailiableRef.once('value', (snap) => {
                var Payment = snap.val().Payment
                var DaysLeft = snap.val().Interior_Days_Left
                if (Payment === 'Active') {
                    if (DaysLeft === 1) {
                        DaysAvailiableRef.update({ Payment: 'Expired' })
                        carRef.update({ Payment: 'Expired' })
                        var date = getTodayDate()
                        var obj = {}
                        obj[CarNumberToBeRemoved] = date
                        firebase
                            .database()
                            .ref('Expired/' + CarCatgory)
                            .update(obj)
                            // console.log(CarNumberToBeRemoved);
                    }
                    DaysAvailiableRef.update({ Days_Left: DaysLeft - 1 })
                }
            })
        })

        return null
    })

//  this function will make cluster each time a new car is added or removed or payment of car is expired or clusters are changed
exports.makeClusters = functions.database
    .ref('/cars')
    .onWrite((change, context) => {
        const before = change.before.val()
        const after = change.after.val()
            // console.log("cluster making has started");

        var ref = database.ref('/cars')
        var i = 0
        var CarLocations = new Object()
        var AreaNumber = 0
        ref.once(
            'value',
            function(snapshot) {
                // console.log("clustering function started at backend");
                // console.log(snapshot.val());
                var areas = snapshot.val()
                delete areas['clusters']
                i = 0

                for (let area in areas) {
                    socities = areas[area]
                    var areaName = Object.keys(areas)[AreaNumber]
                    if (typeof areaName === 'undefined') {
                        AreaNumber = 0
                        areaName = Object.keys(areas)[AreaNumber]
                            // console.log("areaname found undefined and reset to : " + areaName);
                    }
                    i = 0
                        // console.log("area = "+ areaName + socities);
                    var SocietyNumber = 0
                    var carnumber = 0
                    for (let society in socities) {
                        var Society = socities[society]
                        var SocietyName = Object.keys(socities)[SocietyNumber]
                        CarLocations = new Object()

                        console.log(Society)
                        Society = getCarNumbers(Society)

                        for (let CarNumBer in Society) {
                            let car = Society[CarNumBer]
                                // console.log("car = " + car);
                            if (car.Payment === 'Expired') {
                                // console.log(car.number);
                                carnumber++
                            } else {
                                CarLocations[Object.keys(Society)[carnumber]] = car.Location
                                    // console.log(CarLocations + " " + carnumber);
                                carnumber++
                            }

                            if (Object.keys(CarLocations).length === 30) {
                                // console.log(areaName + " and " + SocietyName);
                                database
                                    .ref(
                                        '/cars/clusters/' +
                                        areaName +
                                        '/' +
                                        SocietyName +
                                        `/clusters ${i}`
                                    )
                                    .set({ CarLocations })
                                i++
                                // console.log(CarLocations);
                                CarLocations = new Object()
                            }
                        }
                        if (
                            typeof CarLocations !== 'undefined' &&
                            Object.keys(CarLocations).length > 0
                        ) {
                            // console.log(areaName + " and " + SocietyName);

                            database
                                .ref(
                                    '/cars/clusters/' +
                                    areaName +
                                    '/' +
                                    SocietyName +
                                    `/clusters ${i}`
                                )
                                .set({ CarLocations })
                            i++
                            // console.log(CarLocations);
                            CarLocations = new Object()
                        }

                        carnumber = 0
                        SocietyNumber++
                    }

                    AreaNumber++
                }
            },
            function(errorObject) {
                // console.log("The read failed: " + errorObject.code);
            }
        )
    })

var areaname = []
var clusterName = []
var employeeIdArray
var Employes
    // regular Function to allocate cars to each employee and setting the status of each car to 'In Waiting'
exports.scheduledFunctionForSettingCars = functions.https.onRequest(
    (req, res) => {
        // this function will call the sequence of async functions and wait for thier data fetch
        getEmployeeRef()

        // this snippet will turn the status of car to "In waiting"
        var carStatusRef = database.ref('Car Status')
        carStatusRef.once('value', (snap) => {
            // console.log(snap.val());
            var carNums = Object.keys(snap.val())
            for (let i in carNums) {
                database
                    .ref('Car Status/' + carNums[i])
                    .update({ status: 'In waiting' })
                database.ref('Car Status/' + carNums[i]).update({ timeStamp: '0' })
            }
        })

        // sending the response of function completion and ends up the https request
        res.send('function complete')
        res.end()
    }
)

// regular Function to allocate cars to each interior employee
exports.scheduledFunctionForSettingInteriorCars = functions.https.onRequest(
    (req, res) => {
        // this function will call the sequence of async functions and wait for thier data fetch
        getInteriorEmployeeRef()

        // this snippet will turn the status of car to "In waiting"
        var carStatusRef = database.ref('Car Status')
        carStatusRef.once('value', (snap) => {
            // console.log(snap.val());
            var carNums = Object.keys(snap.val())
            for (let i in carNums) {
                database
                    .ref('Car Status/' + carNums[i])
                    .update({ 'Interior Cleaning status': 'In waiting' })
            }
        })

        // sending the response of function completion and ends up the https request
        res.send('function complete')
        res.end()
    }
)

// once in 15days Function to dividing cars to groups
exports.scheduledFunctionForClusteringInterior = functions.https.onRequest(
    (req, res) => {
        var ref = database.ref('/cars')
        var i = 0
        var CarLocations = new Object()
        var AreaNumber = 0
        ref.once(
            'value',
            function(snapshot) {
                console.log('clustering function started at backend')
                console.log(snapshot.val())
                var areas = snapshot.val()
                delete areas['clusters']
                i = 0

                for (let area in areas) {
                    socities = areas[area]
                    var areaName = Object.keys(areas)[AreaNumber]
                    if (typeof areaName === 'undefined') {
                        AreaNumber = 0
                        areaName = Object.keys(areas)[AreaNumber]
                        console.log('areaname found undefined and reset to : ' + areaName)
                    }
                    i = 0
                    console.log('area = ' + areaName + socities)
                    var SocietyNumber = 0
                    var carnumber = 0
                    for (let society in socities) {
                        Society = socities[society]
                        var SocietyName = Object.keys(socities)[SocietyNumber]
                        CarLocations = new Object()
                        console.log('society = ' + SocietyName + Society)
                        Society = getCarNumbers(Society)
                        for (let CarNumBer in Society) {
                            let car = Society[CarNumBer]
                            console.log('car = ' + car)
                            if (car.Payment === 'Expired') {
                                console.log(car.number)
                                carnumber++
                            } else {
                                CarLocations[Object.keys(Society)[carnumber]] = car.Location
                                    // CarLocation = {}
                                    // CarLocation[Object.keys(Society)[carnumber]] = car.Location
                                    // if (car.group === 'A') {
                                    //   database
                                    //     .ref(
                                    //       '/InteriorClusters/' +
                                    //         areaName +
                                    //         '/' +
                                    //         SocietyName +
                                    //         `/GroupA`
                                    //     )
                                    //     .update(CarLocation)
                                    // } else if (car.group === 'B') {
                                    //   database
                                    //     .ref(
                                    //       '/InteriorClusters/' +
                                    //         areaName +
                                    //         '/' +
                                    //         SocietyName +
                                    //          `/GroupB`
                                    //     )
                                    //     .update(CarLocation)
                                    // }
                                    // console.log(CarLocations + ' ' + carnumber)
                                carnumber++
                            }

                            if (Object.keys(CarLocations).length === 5) {
                                console.log(areaName + ' and ' + SocietyName)
                                database
                                    .ref(
                                        '/InteriorClusters/' +
                                        areaName +
                                        '/' +
                                        SocietyName +
                                        `/clusters ${i}`
                                    )
                                    .set({ CarLocations })
                                i++
                                console.log(CarLocations)
                                CarLocations = new Object()
                            }
                        }
                        if (Object.keys(CarLocations).length > 0) {
                            console.log(areaName + ' and ' + SocietyName)
                            database
                                .ref(
                                    '/cars/clusters/' +
                                    areaName +
                                    '/' +
                                    SocietyName +
                                    `/clusters ${i}`
                                )
                                .set({ CarLocations })
                            i++
                            console.log(CarLocations)
                            CarLocations = new Object()
                        }

                        carnumber = 0
                        SocietyNumber++
                    }

                    AreaNumber++
                }
            },
            function(errorObject) {
                console.log('The read failed: ' + errorObject.code)
            }
        )

        // sending the response of function completion and ends up the https request
        res.send('function complete')
        res.end()
    }
)

// calling function || will be called by app
exports.callCustomer = functions.https.onRequest((req, ress) => {
    var key = '17c3ca687b6859c6a3dcd31c801823b526fd7fc8d80d94d0'
    var sid = 'cmoto1'
    var token = '2ba841367855778a638e199398ea093783ca0b08f0e50c74'
    var from = req.query.from
    var to = req.query.to

    const formUrlEncoded = (x) =>
        Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '')

    const axios = require('axios')
    url =
        'https://' +
        key +
        ':' +
        token +
        '@api.exotel.in/v1/Accounts/' +
        sid +
        '/Calls/connect'
    axios
        .post(
            url,
            formUrlEncoded({
                From: from,
                To: to,
                CallerId: '01142213504',
                CallerType: 'promo',
            }), {
                withCredentials: true,
                headers: {
                    Accept: 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        )
        .then((res) => {
            console.log(`statusCode: ${res.statusCode}`)
            console.log(res)
            ress.send('Calling request send')
            ress.end()
            return res
        })
        .catch((error) => {
            console.error(error)
            return error
        })
})

var totalEmployee

// first function of chain of async function to add todaysCars in each employee
// this will will read the employee id and employee snapshot
async function getEmployeeRef() {
    var EmployeeRef = database.ref('Employee')

    await EmployeeRef.once('value', (snapshot) => {
        // console.log(snapshot.val());
        Employes = snapshot.val()
        employeeIdArray = Object.keys(Employes)
        totalEmployee = employeeIdArray.length
            // console.log(employeeIdArray);

        //this function will read out the values from employee snapshot which is needed like working address
        setEmployeeTodaysCars(Employes)
    })

    // this function will create the string of todaysCars and update it in employee section
    setTodaysCars()

    return null
}

// first function of chain of async function to add todaysCars in each interior employee
// this will will read the employee id and employee snapshot
async function getInteriorEmployeeRef() {
    var EmployeeRef = database.ref('InteriorEmployee')

    await EmployeeRef.once('value', (snapshot) => {
        // console.log(snapshot.val());
        Employes = snapshot.val()
        employeeIdArray = Object.keys(Employes)
        totalEmployee = employeeIdArray.length
            // console.log(employeeIdArray);

        //this function will read out the values from employee snapshot which is needed like working address
        setInteriorEmployeeTodaysCars(Employes)
    })

    // this function will create the string of todaysCars and update it in employee section
    setInteriorTodaysCars()

    return null
}

function setEmployeeTodaysCars(Employes) {
    for (let EmployeeId in Employes) {
        var employeId = Employes[EmployeeId]
        areaname.push(employeId.Working_Address)

        // console.log(employeId);
        // console.log(areaname);
        clusterName.push(employeId.ClusterNumber)
            // console.log(clusterName);
    }

    return null
}

function setTodaysCars() {
    var i = 0
    var j = 0
    for (k = 0; k < employeeIdArray.length; k++) {
        var ClusterRef = database.ref(
                `cars/clusters/${areaname[i]}/${clusterName[i]}/CarLocations`
            )
            // console.log(`${i}:cars/clusters/${areaname[i]}/${clusterName[i]}/CarLocations`);
        ClusterRef.once('value', (snap) => {
            var carsnum = snap.val()
                // console.log(carsnum);

            var carsNumber = Object.keys(carsnum)
                // console.log("c=" + carsNumber);
            var employeeid = employeeIdArray[j]
                // console.log("id : "+j+employeeid);
            database
                .ref('Employee/' + employeeid)
                .update({ todaysCars: carsNumber.join() })
            database
                .ref('Employee/' + employeeid)
                .child('Missed Car History')
                .child(getTodayDate())
                .update({ todaysCars: carsNumber.join() })
                // console.log(areaname[j]);
            database
                .ref('Employees/' + areaname[j] + '/' + employeeid)
                .update({ todaysCars: carsNumber.join() })
                // console.log('one cycle complete' + Object.keys(Employes)[j]);
            j++
        })

        i++
    }
    return null
}

function setInteriorEmployeeTodaysCars(Employes) {
    for (let EmployeeId in Employes) {
        var employeId = Employes[EmployeeId]
        areaname.push(employeId.Working_Address)

        // console.log(employeId);
        // console.log(areaname);
        clusterName.push(employeId.ClusterNumber)
            // console.log(clusterName);
    }

    return null
}

function setInteriorTodaysCars() {
    var i = 0
    var j = 0
    for (k = 0; k < employeeIdArray.length; k++) {
        var ClusterRef = database.ref(
                `InteriorClusters/${areaname[i]}/${clusterName[i]}/CarLocations`
            )
            // console.log(`${i}:InteriorClusters/${areaname[i]}/`+getGroup());
        ClusterRef.once('value', (snap) => {
            var carsnum = snap.val()
                // console.log(carsnum);
                // var start = 0;
            var carsNumber = Object.keys(carsnum)
                // console.log("c=" + carsNumber);
            var employeeid = employeeIdArray[j]
                // console.log("id : "+j+employeeid);
            database
                .ref('InteriorEmployee/' + employeeid)
                .update({ todaysCars: carsNumber.join() })
                // start = start + gap;
                // console.log(areaname[j]);
                // carsNumber = carsNumber.filter( function( el ) {
                //   return carsNumber.slice(0,3).indexOf( el ) < 0;
                // });
            database
                .ref('InteriorEmployees/' + areaname[j] + '/' + employeeid)
                .update({ todaysCars: carsNumber.join() })
                // console.log('one cycle complete' + Object.keys(Employes)[j]);
            j++
        })

        i++
    }
    return null
}

function getGroup() {
    var group = 'Group'
        // console.log(parseInt(getTodayDate().toString().substring(0,2)));
    if (
        parseInt(getTodayDate().toString().substring(0, 2)) < 7 ||
        (parseInt(getTodayDate().toString().substring(0, 2)) > 15 &&
            parseInt(getTodayDate().toString().substring(0, 2)) < 23)
    ) {
        group = group + 'A'
    } else {
        group = group + 'B'
    }
    return group
}

/* <-------- removing old car and making new list --------->  */
function newTodaysCars(carsNameToBeRemoved, todaysCars) {
    var str = todaysCars.replace(carsNameToBeRemoved, '')
        // console.log(str);
    return str
}

// <------------- sorting of json ------------->
function getCarNumbers(objs) {
    var objArray = []
    var numberArray = {}
    Object.keys(objs).forEach((element) => {
        objArray.push(objs[element])
    })
    objArray.sort((a, b) => parseFloat(a.houseNumber) - parseFloat(b.houseNumber))

    for (var i = 0; i < objArray.length; i++) {
        numberArray[' ' + objArray[i]['number']] = objArray[i]
    }

    return numberArray
}

// <------------- today's Date ------------->
function getTodayDate() {
    var todayUs = new Date()
    var offset = '+5.5' // since database belongs to US
    var utc = todayUs.getTime() + todayUs.getTimezoneOffset() * 60000 // therefore converting time to IST
    var today = new Date(utc + 3600000 * offset)
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    var yyyy = today.getFullYear()

    today = yyyy + '-' + mm + '-' + dd
        // console.log(today);
    return today
}