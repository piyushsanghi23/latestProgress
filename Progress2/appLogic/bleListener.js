'use strict';
var counter = 0;
app.startScanForBeacons = function () {
    // alert('startScanForBeacons')
    //startVuforia();
    window.locationManager = cordova.plugins.locationManager;
    var delegate = new cordova.plugins.locationManager.Delegate()
    delegate.didDetermineStateForRegion = function (pluginResult) {
        
        //alert('didDetermineStateForRegion: ' + JSON.stringify(pluginResult))

    }

    delegate.didStartMonitoringForRegion = function (pluginResult) {
        // alert('didStartMonitoringForRegion:' + JSON.stringify(pluginResult))
    }

    delegate.didRangeBeaconsInRegion = function (pluginResult) {
        //alert('didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult))
        app.didRangeBeaconsInRegion(pluginResult)
    }

    // Set the delegate object to use.
    locationManager.setDelegate(delegate)

    // Start monitoring and ranging our beacons.
    for (var r in app.beaconRegions) {
        var region = app.beaconRegions[r]
            //alert("beacon" + r);
        var beaconRegion = new locationManager.BeaconRegion(
            region.id, region.uuid, region.major, region.minor)

        // Start monitoring.
        locationManager.startMonitoringForRegion(beaconRegion)
            .fail(console.error)
            .done()

        // Start ranging.
        locationManager.startRangingBeaconsInRegion(beaconRegion)
            .fail(console.error)
            .done()
    }
}
var m = -60;
var time = '';
// Display pages depending of which beacon is close.
app.didRangeBeaconsInRegion = function (pluginResult) {
    // There must be a beacon within range.

    if (0 == pluginResult.beacons.length) {
        close();
        return
    }


    // $("#appendSection").append(pluginResult.beacons[0].proximity + '<br>');
    // currentBeacon=pluginResult.beacons[0].uuid;


    /*   if ((pluginResult.beacons[0].proximity == 'ProximityUnknown')) {
        $('#player').hide();
        currentBeacon='';
        alert("unknown");
		
    }*/
    if ((pluginResult.beacons[0].proximity == 'ProximityImmediate' ||
            pluginResult.beacons[0].proximity == 'ProximityNear')) {
        //{
        
        time = new Date();
        // $("#appendSection").append(x1);
        var x1 = currentBeacon == pluginResult.beacons[0].uuid;
        if (!x1) {
            //stopVuforia();
            counter=0;
            currentBeacon = pluginResult.beacons[0].uuid;
            if (currentBeacon == "f7028248-68b4-4f65-8087-d5d5cb3a1cb") {

                //window.location = "components/homeView/view.html"
                $('#place').html("you are at beacon 1");
                $('#placeDescription').html("welcome to canteen");

                vibrate();
                //screen.lockOrientation('landscape');
                 $('#image').hide();
                $('#player').show();
                $('#video-display ').show();
                //$("#appendSection").html("video" + currentBeacon);
                //
               $('#video-display  source').attr('src', 'videos/incubator_x264.mp4');
                 //$('#iframe-display').attr('src', 'https://www.youtube.com/watch?v=H-PWeICLvDw');
               // document.getElementById('iframe-display').src
                autoplay();

                //var vid = document.getElementById('video-display');
                //$('#video-display')[0].onended=function(){
                //alert("complete");}
                /* if(vid.ended){
                     alert("I'm done!");
                 }
                 else
                     alert("I'm done44!");*/
                //screen.unlockOrientation();

            }
            if (currentBeacon == "2f234454-cf6d-4a0f-adf2-f4911ba9ffa9") {

                $('#place').html("you are at beacon 2");
                $('#placeDescription').html("welcome to Alcantra");
                vibrate();

                //$('player').show();
                //$("#appendSection").html("video" + currentBeacon);
                
                $('#video-display').hide();
                $('#video-display')[0].pause();
                $('#player').show();
                
                $('#image').show();
                //autoplay();
            }
            if (currentBeacon == "2f234454-cf6d-4a0f-adf2-f4911ba9ffa8") {


                //window.location = "components/homeView/view.html"
                $('#place').html("you are at beacon 3");
                $('#placeDescription').html("welcome to Incubator");
                //navigator.vibrate(300);
                vibrate();
                //$('#video-display ').show();
                //$("#appendSection").html("video" + currentBeacon);
                $('#image').hide();
                $('#player').show();
                $('#video-display ').show();
                $('#video-display  source').attr('src', 'videos/lunchRoom_x264.mp4');
                autoplay();
            }



            // $("#appendSection").append("" +  currentBeacon + "rssi" + "  " +counter);
        }


    }

}

function vibrate() {
    var myVar = setInterval(function () {
        navigator.vibrate(500);
    }, 2000);
    setTimeout(function () {
        clearTimeout(myVar)
    }, 7500);
}

function autoplay() {
    $('#video-display ').load();
    $('#video-display').play();
}

function close() {
    var x = new Date();
    if (time == '') {
        time = x;
    } else {
        if (x > time) {
            var dif = x.getTime() - time.getTime();
            var Seconds_from_T1_to_T2 = dif / 1000;
            // $("#appendSection").append(Seconds_from_T1_to_T2 + '<br>');
            if (Seconds_from_T1_to_T2 >= 8) {
                currentBeacon = '';
				//$("#appendSection").append(Seconds_from_T1_to_T2 + '<br>');
                $('#player').hide();
                $('#video-display')[0].pause();
                if(counter==0){
                 //startVuforia();
                    counter++;
                }
            }
        }
    }
}