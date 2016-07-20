var deviceArray = [];
var rssiArray = [];
var i = 1;
var bytes, encodedString, x;

var val = "xyx";
//var profile_id1=bluetoothle.encodedStringToBytes(profile_id)
//var profile_id1=stringToBytes(profile_id);
function myfun2() {
    ble.isEnabled(
        function() {
            ble.startScan([], function(device) {
                    deviceArray.push(device.id);
                    rssiArray.push(device.rssi);
                    document.getElementById("bleButton").style.display = "none";
                    // alert("for test" + JSON.stringify(device));
                    var deviceList = document.getElementById("deviceList");
                    var listItem = document.createElement('li');
                    listItem.setAttribute("id", "beacon");
                    var html = '<b> Beacon id:</b><br/>' + device.id + '&nbsp;|&nbsp;Name: ' + device.name + '&nbsp;|&nbsp;RSSI: ' + device.rssi;
                    //listItem.dataset.deviceId = device.id;
                    listItem.innerHTML = html;
                    deviceList.appendChild(listItem);
                },
                function(error) {
                    alert("error");
                });
            setTimeout(function() {
                ble.stopScan(
                    function() {
                        alert("Scan complete");
                    },
                    function() {
                        alert("stopScan failed");
                    }
                );
            }, 15000);


        },
        function() {
            alert("Bluetooth is *not* enabled");
        }
    );
}

function advertise() {
    bluetoothle.initialize(function(result) {
        //alert("initialze" + JSON.stringify(result));
        bytes = bluetoothle.stringToBytes(profile_id);
        encodedString = bluetoothle.bytesToEncodedString(bytes);
        alert(bytes + "   " + encodedString)
    }, {
        request: true,
        statusReceiver: false
    });

    bluetoothle.initializePeripheral(function(result) {
        //alert("initialze" + JSON.stringify(result));
    }, {
        request: true,
        statusReceiver: false
    });
    bluetoothle.addService(function(result) {
        //alert("success service" + JSON.stringify(result));
    }, function(error) {
        //alert(JSON.stringify(error));
    }, {
        service: "1234",
        characteristics: [{
            uuid: "1234",
            permissions: {
                read: true,
                write: true,
                //readEncryptionRequired: true,
                //writeEncryptionRequired: true,
            },
            properties: {
                read: true,
                writeWithoutResponse: true,
                write: true,
                notify: true,
                indicate: true,
                //authenticatedSignedWrites: true,
                //notifyEncryptionRequired: true,
                //indicateEncryptionRequired: true,
            }
        }]
    }, {
        service: "1235",
        characteristics: [{
            uuid: "1235",
            permissions: {
                read: true,
                write: true,
                //readEncryptionRequired: true,
                //writeEncryptionRequired: true,
            },
            properties: {
                read: true,
                writeWithoutResponse: true,
                write: true,
                notify: true,
                indicate: true,
                //authenticatedSignedWrites: true,
                //notifyEncryptionRequired: true,
                //indicateEncryptionRequired: true,
            }
        }]
    });
    // alert( " " + profile_id1);
    bluetoothle.startAdvertising(function(result) {
        alert(bytes + "   " + encodedString);
        alert("success advertising" + JSON.stringify(result));
    }, function(error) {
        alert("error" + JSON.stringify(error));
    }, {
        services: ["1235"],
        service: "1235",
        mode: "lowLatency",
        timeout: 500,
        powerLevel: "low",
        manufacturerId: 0x004C,
        //manufacturerSpecificData:  bluetoothle.bytesToEncodedString(profile_id),
        //manufacturerSpecificData: 'OTg0MTEyMzQ1'
        manufacturerSpecificData: encodedString,

    });
}

function myfun3() {
    var max = indexOfMax(rssiArray);

    sensor_id = deviceArray[max];
    alert(sensor_id);
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}



