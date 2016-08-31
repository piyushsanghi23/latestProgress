'use strict';
var counter = 0;
var link;
setInterval(function(){  app.startScanForBeacons(); }, 3000);

app.startScanForBeacons = function () {
    myfun();
    window.locationManager = cordova.plugins.locationManager;
    var delegate = new cordova.plugins.locationManager.Delegate()
    delegate.didDetermineStateForRegion = function (pluginResult) {
      
    }

    delegate.didStartMonitoringForRegion = function (pluginResult) {
        
    }

    delegate.didRangeBeaconsInRegion = function (pluginResult) {
     
        app.didRangeBeaconsInRegion(pluginResult)
    }

    // Set the delegate object to use.
    locationManager.setDelegate(delegate)

    // Start monitoring and ranging our beacons.
    for (var r in app.beaconRegions) {
        var region = app.beaconRegions[r];
       
        var beaconRegion = new locationManager.BeaconRegion(region.DeviceDescription,
            region.Tag1)

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

app.didRangeBeaconsInRegion = function (pluginResult) {
    
    if (0 == pluginResult.beacons.length) {
      
        close();
        return
    }

   
    if ((pluginResult.beacons[0].proximity == 'ProximityImmediate' ||
            pluginResult.beacons[0].proximity == 'ProximityNear')) {
    

        time = new Date();
     
        var x1 = currentBeacon == pluginResult.beacons[0].uuid;
        if (!x1) {
           
            counter = 0;
            currentBeacon = pluginResult.beacons[0].uuid;
        
            for (var r in app.beaconRegions) {
                var region = app.beaconRegions[r]
              
                if (currentBeacon == region.Tag1) {
          
                    url_video=region.Content;
                    if(flag_img[r]==0){
                        vibrate();
                        vibrate();
                    flag_img[r] = 1;
                //    alert("please go to progress premises ");
                    img_counter = setInterval('tick()', 1000);
                  
                    }
                    if(my_flag_pp==1){
                      
                        tick_page(id_hint_pno,r);
                    }

                }
            

            }  
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


