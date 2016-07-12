var i = 1;
//profile_id,sensor_id;

// START_CUSTOM_CODE_kendoUiMobileApp
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
function myfun() {
    //ble.scan([], 5, function(result){//alert("hryy scanning");}, function(error){});
    // alert("hello");
    /* $.ajax({
             url: '172.21.74.72:3000/',
             type: 'PUT',
             data: '/?profileid=34523&sensorid=98799', // or $('#myform').serializeArray()
             success: function () {
                 alert('PUT completed');
             }
         });*/
    var resultsField = document.getElementById("result");
    if (window.navigator.simulator === true) {
        alert("Not Supported in Simulator.");
    } else {
        cordova.plugins.barcodeScanner.scan(
            function (result) { //alert("hello");
                if (!result.cancelled) {
                    //document.getElementById("scanButton").style.display = "none";
                    var currentMessage = resultsField.innerHTML;
                   /* var html = '<html><head><script src="globalVariables.js"></script><script src="components/barcode/bleAdvertise.js"></script></head><body><h2><b>Profile Id:</b></h2><h4>' + result.text + '</h4><button style=" left: 25% ;position:relative;top:150px;width: 50%; height: 100%; display: block ; " id="bleButton" onclick="myfun2()">BLE Devices</button><div id="bleResult"><ol onclick="myfun3()" id="deviceList"></ol></div></body></html>';
					 resultsField.innerHTML = currentMessage + html;*/
                    profile_id = result.text;
                     document.getElementById("scanButton").style.display = "none";
                     document.getElementById("bleButton").style.display = "block";

                }
            },
            function (error) {
                alert("Scanning failed: " + error);
            });
    }
}

