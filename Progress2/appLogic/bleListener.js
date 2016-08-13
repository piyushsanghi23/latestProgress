'use strict';
var counter = 0;
var link;
app.startScanForBeacons = function () {
    //alert('startScanForBeacons')
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
            // alert("p");
            //document.getElementById('link').click();
            //alert("0");
            //document.getElementById('login').style.display='none';
            //alert(pluginResult.beacons[0].rssi);
            counter = 0;
            currentBeacon = pluginResult.beacons[0].uuid;
            for (var r in app.beaconRegions) {
                var region = app.beaconRegions[r]
                    // $("#login").append("R"+region.uuid+"         "+"p"+pluginResult.beacons[0].uuid);
                if (currentBeacon == region.uuid) {
                    //$("#login").append("video");
                    if (pluginResult.beacons[0].rssi >= -70 && pluginResult.beacons[0].rssi <= -37)
                        vibrate();
                    //link = region.url;
                    //document.getElementById(region.img_id).style.display='none'; 
                    // alert(r);
                    var beacon_div = document.createElement('div');
                    beacon_div.setAttribute("class", "beacon");
                    var text1 = 'hey';
                    var textnode1 = document.createTextNode(text1);
                    beacon_div.appendChild(textnode1);
                    document.getElementById('login').appendChild(beacon_div);
                    flag_img[r] = 1;
                    
                    img_counter = setInterval('tick()', 1000);
                    if(my_flag_pp==1){
                        alert("in my flag pp ");
                        alert(id_hint_pno);
                        tick_page(id_hint_pno,region.url,r);
                    }

                    // $("#login").append("video");
                }
                //$("#login").append("video");

            }


            //vibrate();
            //screen.lockOrientation('landscape');
            // $('#image').hide();
            // $('#player').show();
            //$('#video-display ').show();

            //$("#appendSection").html("video" + currentBeacon);
            //
            $('#video-display  source').attr('src', link);

            autoplay();




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
                if (counter == 0) {
                    //startVuforia();
                    document.getElementById('login').style.display = 'block';
                    counter++;
                }
            }
        }
    }
}