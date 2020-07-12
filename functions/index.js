const functions = require('firebase-functions');
const firebase = require('firebase-admin');
var config = {
  apiKey: "AIzaSyDKUTIUzqfbyW4jCzq96NRSM7BnnGJRpL4",
  authDomain: "cmoto-4267a.web.app",
  databaseURL: "https://cmoto-4267a.firebaseio.com",
  storageBucket: "https://console.firebase.google.com/project/cmoto-4267a/storage/cmoto-4267a.appspot.com"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

// this will update database for regular change i.e. cleaning cars , removing cleaned cars, updating to do cars
var Cars;
exports.UpdatingDataBase = functions.database.ref('/Car Status/{CarNumber}')
.onUpdate((change, context) => {  
    console.log("updation of cars work started");
     const before = change.before.val();
     const after = change.after.val();
     console.log(after);
    if(after.status !== 'cleaned'){
      return null;
    }
    if(before.status === after.status){
      return null;
    }
     const employeeId = before.doneBy;
     console.log(employeeId);
     var todaysCarsLeft;
     var CarNumberToBeRemoved;

     var ref = database.ref('/Employee/' + employeeId);
     ref.once("value", function(snapshot) {
      Cars = snapshot.val();
      console.log('Cars = ' + Cars);
      
      CarNumberToBeRemoved = context.params.CarNumber;
      todaysCarsLeft = newTodaysCars(CarNumberToBeRemoved,Cars.todaysCars);
      console.log('cars to be removed = ' + CarNumberToBeRemoved);
      ref.update({"todaysCars" : todaysCarsLeft});
      var CarCatgory = Cars.Working_Address;
      firebase.database().ref('Employees/'+ CarCatgory+'/'+employeeId).update({"todaysCars" : todaysCarsLeft});
      
      // check if payment is done than remove car from expired
      if(Cars.Days_Left === 26){
        var obj = {};
        obj[CarNumberToBeRemoved] = null;
        database.ref('Expired/'+CarCatgory).update(obj);
        database.ref('cars/'+CarCatgory+'/'+CarNumberToBeRemoved).update({"Payment":"Active"});

      }
       // updating employee earnings
       // first getting the category of car
       var category;
       var price;
       var income;
       var carRef = database.ref('cars/'+ CarCatgory + '/' + CarNumberToBeRemoved);
       carRef.once('value',(snapshot) => {
          category = snapshot.val().category;
          if(category.toString().toLowerCase() === 'sedan' || category.toString().toLowerCase() === 'luv'){
              price = 14;
          }else if(category.toString().toLowerCase() === 'hatchback'){
            price = 12;
          }else if(category.toString().toLowerCase() === 'suv'){
            price = 18;
          }
       });
       var EmployeeEarningRef = ref.child('Work History').child(getTodayDate());
       EmployeeEarningRef.once('value',(snapshot) => {
         console.log(snapshot.val());
         
         if(isNaN(snapshot.val().income)){
           console.log("Income is set to be zero :" + getTodayDate());
           EmployeeEarningRef.update({'income' : 0});
          }else{
            price = price + snapshot.val().income;
         }
         console.log(price);
          income = price;
         EmployeeEarningRef.update({'income' : income});
       });
       var DaysAvailiableRef = database.ref('Car Status/' + CarNumberToBeRemoved);
       DaysAvailiableRef.once('value',(snap) => {
         var Payment = snap.val().Payment;
         var DaysLeft = snap.val().Days_Left;
         if(Payment === "Active"){
           if(DaysLeft === 1){
            DaysAvailiableRef.update({"Payment" : "Expired"});
            carRef.update({"Payment" : "Expired"});
            var date = getTodayDate();
            var obj = {};
            obj[CarNumberToBeRemoved] = date;
            firebase.database().ref('Expired/'+CarCatgory).update(obj);
            console.log(CarNumberToBeRemoved);
           }
           DaysAvailiableRef.update({"Days_Left" : DaysLeft-1});
         }
       });
    });


    

     return null;
  });


//  this function will make cluster each time a new car is added or removed or payment of car is expired or clusters are changed
  exports.makeClusters = functions.database.ref('/cars')
  .onWrite((change,context) => {
    const before = change.before.val();
    const after = change.after.val();
    console.log("cluster making has started");
    

    var ref = database.ref("/cars");
  var i=0;
  var CarLocations = new Object();
  var AreaNumber = 0;
  ref.once("value", function(snapshot) {
    console.log("clustering function started at backend");
    console.log(snapshot.val());
    var areas = snapshot.val();
    i=0;

    for(let area in areas){
      
      socities = areas[area];
      var areaName = Object.keys(areas)[AreaNumber];
      if(typeof areaName === 'undefined'){
          AreaNumber = 0;
          areaName = Object.keys(areas)[AreaNumber];
          console.log("areaname found undefined and reset to : " + areaName);
      }
      i=0;
      console.log("area = "+ areaName + socities);
      var SocietyNumber = 0;
      var carnumber = 0;
    for(let society in socities){
      
      
      Society = socities[society];
      var SocietyName = Object.keys(socities)[SocietyNumber];
      CarLocations = new Object();
      console.log("society = "+ SocietyName + Society);
      
      
      for(let CarNumBer in Society){
        
        let car = Society[CarNumBer];
          console.log("car = " + car);
          if(car.Payment === "Expired"){
              console.log(car.number);
              carnumber++;
          }else{
          CarLocations[Object.keys(Society)[carnumber]] = car.Location;
          console.log(CarLocations + " " + carnumber);
          carnumber++;
          }

          if(Object.keys(CarLocations).length === 5){
            console.log(areaName + " and " + SocietyName);
            database.ref("/cars/clusters/" + areaName + "/" + SocietyName + `/clusters ${i}`).set({CarLocations});
            i++;
            console.log(CarLocations);
            CarLocations = new Object();
            
          }
        
        
      }
      if(Object.keys(CarLocations).length > 0){
        console.log(areaName + " and " + SocietyName);
        database.ref("/cars/clusters/" + areaName + "/" + SocietyName + `/clusters ${i}`).set({CarLocations});
        i++;
        console.log(CarLocations);
        CarLocations = new Object();
        
      }

      carnumber = 0;
      SocietyNumber++;
      
    }
    
    
  AreaNumber++;
}

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


  });

  
  var areaname = [];
  var clusterName = [];
  var employeeIdArray;
  var Employes;
  // regular Function to allocate cars to each employee and setting the status of each car to 'In Waiting'
  exports.scheduledFunctionForSettingCars = functions.https.onRequest((req,res) => {

  // this function will call the sequence of async functions and wait for thier data fetch
   getEmployeeRef();


   // this snippet will turn the status of car to "In waiting"
    var carStatusRef = database.ref('Car Status');
    carStatusRef.once('value' , (snap) => {
      // console.log(snap.val());
      var carNums = Object.keys(snap.val());
      for(let i in carNums){
      database.ref('Car Status/' + carNums[i]).update({ 'status':'In waiting'});
      }
    });

    // sending the response of function completion and ends up the https request
    res.send("function complete");
    res.end();

  });

  var totalEmployee;

  // first function of chain of async function to add todaysCars in each employee
  // this will will read the employee id and employee snapshot
  async function getEmployeeRef() {
    var EmployeeRef = database.ref('Employee');
    
    await EmployeeRef.once('value',(snapshot) => {
      console.log(snapshot.val());
      Employes = snapshot.val();
      employeeIdArray = Object.keys(Employes);
      totalEmployee = employeeIdArray.length;
      console.log(employeeIdArray);
      

      //this function will read out the values from employee snapshot which is needed like working address 
      setEmployeeTodaysCars(Employes);
      
    });


    // this function will create the string of todaysCars and update it in employee section
    setTodaysCars();
  
    return null;
  }

  function setEmployeeTodaysCars(Employes) {
   
    for(let EmployeeId in Employes){
      
      var employeId = Employes[EmployeeId];
      areaname.push(employeId.Working_Address);
      
      console.log(employeId);
      console.log(areaname);
      clusterName.push(employeId.ClusterNumber);
      console.log(clusterName);
      
      
    }
    
    
    return null;
  }

  function setTodaysCars() {
    
    var i =0;
    var j =0;
    for(k=0; k<employeeIdArray.length; k++){
    var ClusterRef = database.ref(`cars/clusters/${areaname[i]}/${clusterName[i]}/CarLocations`);
    console.log(`${i}:cars/clusters/${areaname[i]}/${clusterName[i]}/CarLocations`);
      ClusterRef.once('value',(snap) => {
        var carsnum = snap.val();
        console.log(carsnum);
        
        var carsNumber = Object.keys(carsnum);
        console.log("c=" + carsNumber);
        var employeeid = employeeIdArray[j];
        console.log("id : "+j+employeeid);
        database.ref('Employee/' + employeeid).update({'todaysCars' : carsNumber.join()});
        console.log(areaname[j]);
        database.ref('Employees/' + areaname[j] + '/' + employeeid).update({'todaysCars' : carsNumber.join()});
        console.log('one cycle complete' + Object.keys(Employes)[j]);
        j++;
      });
      
      i++;
    }
      return null;
  }
  



  /* <-------- removing old car and making new list --------->  */
  function newTodaysCars(carsNameToBeRemoved, todaysCars){
    
    var str = todaysCars.replace(carsNameToBeRemoved,"");
    console.log(str);
    return str;
  }




  // <------------- today's Date ------------->
function getTodayDate(){
  var todayUs = new Date();
  var offset = '+5.5';                                                    // since database belongs to US 
  var utc = todayUs.getTime() + (todayUs.getTimezoneOffset() * 60000);    // therefore converting time to IST
  var today = new Date(utc + (3600000*offset));
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + '-' + mm + '-' + yyyy;
  console.log(today);
 return today;
}






  