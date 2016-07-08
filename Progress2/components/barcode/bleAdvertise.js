var i = 1;

function myfun2() {
    alert(8);
    /*navigator.notification.confirm("my fun2",function(){});
    pushNotification.registerDevice(
        function (token) {
            alert(JSON.stringify(token));
        },
        function (status) {
            alert("failed to register: " + status);
        }
    );*/
    bluetoothle.initialize(function (result) {
        alert("initialze" + JSON.stringify(result));
    }, {
        request: true,
        statusReceiver: false
    });
    bluetoothle.startScan(function (data) {
        //alert(JSON.stringify(data));
    }, function (err) {
        //alert(JSON.stringify(err));
    }, {
        "services": [],
    });
    /*setTimeout(nfc.addNdefListener(
        function (nfcEvent) {
            var tag = nfcEvent.tag,
                ndefMessage = tag.ndefMessage;
            alert(JSON.stringify(ndefMessage));

            alert(nfc.bytesToString(ndefMessage[0].payload).substring(3));
        },
        function () {
            alert("Waiting for NDEF tag");
        },
        function (error) {
            alert("Error adding NDEF listener " + JSON.stringify(error));
        }
    ),5);*/
    bluetoothle.initializePeripheral(function (result) {
        alert("initialze" + JSON.stringify(result));
    }, {
        request: true,
        statusReceiver: false
    });
    bluetoothle.addService(function (result) {
        alert("success advertising" + JSON.stringify(result) + "data is ");
    }, function (error) {
        alert(JSON.stringify(error));
    }, {
        service: "1234",
        characteristics: [
            {
                uuid: "2f234454-cf6d-4a0f-adf2-f4911ba9ffa9",
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
    					}
  							]
    });

    bluetoothle.startAdvertising(function (result) {
        alert("success advertising" + JSON.stringify(result) + "data is " + bluetoothle.stringToBytes("1234"));
    }, function (error) {
        alert(JSON.stringify(error));
    }, {
        services: ["1234"],
        service: "1234",
        name: "Hello World",
        mode: "lowLatency",
        connectable: true,
        timeout: 500,
        powerLevel: "high",


    });
    
    /*  ble.isEnabled(

          function () {
              ble.startScan([], function (device) {
                      //alert(JSON.stringify(device));
                      //
                      if (i == 1) {

                          //ID.sensor_id = device.id; 
                          sensor_id = device.id;
                      }
                      i = i + 1;
                      //alert("inside");

                      document.getElementById("bleButton").style.display = "none";
                      //alert("for test" + JSON.stringify(device));
                      var deviceList = document.getElementById("deviceList");
                      var listItem = document.createElement('li');
                      listItem.setAttribute("id", "beacon");
                      var html = '<b> Beacon id:</b><br/><label id="beacon" >' + device.id + '</label>&nbsp;|&nbsp;RSSI: ' + device.rssi;
                      listItem.dataset.deviceId = device.id; // TODO
                      listItem.innerHTML = html;
                      deviceList.appendChild(listItem);



                      ble.stopScan(

                          function () {
                              //alert("Scan complete");
                          },
                          function () {
                              alert("stopScan failed");
                          }
                      );



                  },
                  function (error) {
                      alert("error");
                  });


          },
          function () {
              alert("Bluetooth is *not* enabled");
          }



      );*/



    //alert(sensor_id);


}

function myfun3() {
    /*setTimeout(bluetoothle.connect(function (res) {
        alert(JSON.stringify(res));
    }, function (err) {
        alert(JSON.stringify(err));
        bluetoothle.disconnect(function (res) {
            alert(JSON.stringify(res));
        }, function (err) {
            alert(JSON.stringify(err));
        }, {
            "address": sensor_id
        });
         bluetoothle.reconnect(function (res) {
                        alert(JSON.stringify(res));
                    }, function (err) {
                        alert(JSON.stringify(err));
                    }, {
                        "address": sensor_id
                    });
    }, {
        "address": sensor_id
    }), 5000);*/
    /*  bluetoothle.requestLocation(function (res) {
          alert(JSON.stringify(res));
      }, function (err) {
          alert(JSON.stringify(err));
      });*/

    /* ble.connect(sensor_id, function (res) {
         alert("hello connect");
         alert("connected" + JSON.strinigify(res) + sensor_id.service_uuid);

         ble.read(sensor_id, service_uuid, characteristic_uuid, function (res) {
             alert(JSON.stringify(res));
         }, function (err) {
             alert("error in read" + JSON.stringify(err));
         });
     }, function (err) {
         alert("eror" + JSON.stringify(err));
     });*/


}