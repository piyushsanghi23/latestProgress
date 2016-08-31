$body = $("body");

$(document).on({
    ajaxStart: function () {
        $body.addClass("loading");
         setTimeout(function(){ $body.removeClass("loading"); }   
,8000);
    },
    ajaxStop: function () {
        $body.removeClass("loading");
    } 
     
});
var app = {
        data: {}
    };

'use strict';
(function () {
    

    var bootstrap = function () {
        $(function () {
            app.mobileApp = new kendo.mobile.Application(document.body, {
                skin: 'nova',
                initial: 'components/homeView/view.html'
            });
        });
    };

    if (window.cordova) {
     
        document.addEventListener('deviceready', function () {
            
            document.addEventListener("offline", onOffline, false);
            if (window.navigator.simulator != true) {
                
                cordova.plugins.locationManager.isBluetoothEnabled()
                    .then(function (isEnabled) {
                        console.log("isEnabled: " + isEnabled);
                        if (isEnabled) {
                           
                            //cordova.plugins.locationManager.disableBluetooth();
                        } else {
                            cordova.plugins.locationManager.enableBluetooth();
                        }
                    })
                    .fail(function (e) {
                        console.error(e);
                    })
                    .done();
            }
             document.addEventListener("online", onOnline, false);
            function onOnline(){
               
                wifi_flag=0;
            }
            function onOffline() {
                // Handle the offline event
               
                wifi_flag = 1;
                document.getElementById('note_wifi').style.display = 'block';
                setTimeout(function () {
                    document.getElementById('note_wifi').style.display = 'none';
                }, 3000);
                document.getElementById('note_wifi_feed').style.display = 'block';
                setTimeout(function () {
                    document.getElementById('note_wifi_feed').style.display = 'none';
                }, 3000);
                if (count == 1 && count_dis == 0) {
                    app.openDatabase();
                    app.readRecords('test');
                    app.readRecords('schedule');
                    app.readRecords('beacon');
                    app.startScanForBeacons();
                    count++;
                }
            }
         
            app.openDatabase();
            app.countRecords();
            if (navigator && navigator.splashscreen) {
                //alert("deviceReady");
                navigator.splashscreen.hide();
            }
            var element = document.getElementById('appDrawer');
            if (typeof (element) != 'undefined' && element !== null) {
                if (window.navigator.msPointerEnabled) {
                    $('#navigation-container').on('MSPointerDown', 'a', function (event) {
                        app.keepActiveState($(this));
                    });
                } else {
                    $('#navigation-container').on('touchstart', 'a', function (event) {
                        app.keepActiveState($(this).closest('li'));
                    });
                }
            }

            bootstrap();

        }, false);

    } else {
        bootstrap();
    }


    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $('#navigation-container li.active').removeClass('active');
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function () {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };

    app.openLink = function (url) {
        if (url.substring(0, 4) === 'geo:' && device.platform === 'iOS') {
            url = 'http://maps.apple.com/?ll=' + url.substring(4, url.length);
        }

        window.open(url, '_system');
        if (window.event) {
            window.event.preventDefault && window.event.preventDefault();
            window.event.returnValue = false;
        }

    };
    
   

}());



/*
rest api to push the data*/
// END_CUSTOM_CODE_kendoUiMobileApp