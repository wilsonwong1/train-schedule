$(document).ready(function () {
    var firebaseConfig = {
        apiKey: "AIzaSyAVoqhadygoqJ25eOrhg9-_4R_miSHC1jI",
        authDomain: "hwk7-d37e1.firebaseapp.com",
        databaseURL: "https://hwk7-d37e1.firebaseio.com",
        projectId: "hwk7-d37e1",
        storageBucket: "hwk7-d37e1.appspot.com",
        messagingSenderId: "30557386312",
        appId: "1:30557386312:web:d4a6ed841ec835cf338a7d"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    const database = firebase.database();

    const trainname = $('.train-name');
    const destination = $('.destination-name');
    const traintime = $('.train-time');
    const frequency = $('.frequency-min');

    const addtrain = $('.add-train');
    const train_schedule = $('.trainschedule');
    const trainlist = $('.train-list');


    addtrain.on('submit', function (e) {
        e.preventDefault();


        let train = trainname.val();
        trainname.val('');
        let dest = destination.val();
        destination.val('');
        let ttime = traintime.val();
        traintime.val('');
        let freq = frequency.val();
        frequency.val('');

        database.ref('traindata').push({
            "name": train,
            "destination": dest,
            "traintime": ttime,
            "frequency": freq,
            "dateAdded": firebase.database.ServerValue.TIMESTAMP // creates timestamp
        });
        trainlist.empty();

        database.ref('traindata')
            .orderByChild("dateAdded")
            // .endAt()
            // .limitToLast(1)
            .on('child_added', snap => {
                let data = snap.val();
                console.log(data.name);
                var convertedTime = moment(data.traintime, "HH:mm")
                    // .add(8, "minutes");
                    .subtract(1, "years");

                console.log(convertedTime);
                // var currentTime = moment();
                // console.log("Current Time: " + currentTime.format("HH:mm"));
                var tDifference = moment().diff(moment(convertedTime), "minutes");
                console.log(tDifference, " - total mins");

                var tRemainder = tDifference % data.frequency;
                console.log(tRemainder, " - remaining");

                var tRemainingToNextTrain = data.frequency - tRemainder;
                console.log("Minutes till next train: ", tRemainingToNextTrain);

                var timeOfNextTrain = moment().add(tRemainingToNextTrain, "minutes");
                console.log("Next arrival: ", moment(timeOfNextTrain).format("HH:mm"));

                trainlist.append(
                    `<tr>
                        <td>${data.name}</td>
                        <td>${data.destination}</td>
                        <td>${data.frequency} mins</td>
                        <td>${timeOfNextTrain.format("HH:mm")}</td>
                        <td>${tRemainingToNextTrain} min</td>            
                    </tr>`
                );
            });
    });
});