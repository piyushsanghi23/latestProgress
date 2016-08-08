function logout() {
    //alert("login");
    if (log == 1) {
        document.getElementById("login").style.display = 'block';
        log = 0;
        document.getElementById("profile").style.display = 'none';
        document.getElementById("user_profile").style.display = 'none';
    }
}

function validate(email_validate) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email_validate);
}

function back_login() {
    document.getElementById("login").style.display = 'block';
    document.getElementById("admin_div").style.display = 'none';
}

function dataBaseFunction() {
    app.openDatabase();
    app.dropTable();
    app.insertRecord();
   
    app.readRecords();
}

function authenticate() {
    var flag = validate(document.getElementById('email_box').value);
    if (flag) {
        if (document.getElementById('email_box').value == "admin@progress.com") {
            document.getElementById("login").style.display = 'none';
            document.getElementById("admin_div").style.display = 'block';
        } else {
            //alert("in");
            $.ajax({
                url: url_login,
                type: 'GET',
                success: function (result) {

                    sessionId = result.sessionId;
                    console.log("session id " + sessionId);
                    email = document.getElementById('email_box').value;
                    selectquery = "SELECT id from Profile2 where Email = '" + email + "';";
                    //alert(selectquery);
                    $.ajax({
                        url: url_email + sessionId + "&query=" + selectquery + "&output=json",
                        type: 'GET',
                        success: function (result) {
                            console.log("success" + JSON.stringify(result));
                            if (result == '') {
                                 document.getElementById('login_error').innerHTML = 'you are not a valid person';
                                document.getElementById('login_error').style.display = 'block';
   setTimeout(function(){ document.getElementById('login_error').style.display = 'none';},3000);
                            } else {
                                //$.mobile.changePage("barcode/view.html",{transition : "slide"}, false);
                                //window.open("components/profile_page.html", "_self");
                                document.getElementById("login").style.display = 'none';
                                profile_id = result;
                                myfun();
                                // document.getElementById("profile").style.display = 'block';
                                $.ajax({
                                    url: url_details1 + sessionId + "&id=" + profile_id + url_details2,
                                    type: 'GET',
                                    dataType: 'text',
                                    success: function (result) {
                                        log = 1;
                                        //console.log((result));
                                        var txt, parser, xmlDoc, value1, value2;
                                        txt = result;
                                        parser = new DOMParser();
                                        xmlDoc = parser.parseFromString(txt, "text/xml");
                                        //alert("xml");
                                        value1 = xmlDoc.getElementsByTagName("data")[0].childNodes[0].nextSibling;
                                        candidatePhoto = value1.childNodes[0].innerHTML;
                                        value1 = value1.nextSibling.nextSibling
                                        candidateEmail = value1.innerHTML;
                                        value1 = value1.nextSibling.nextSibling
                                        candidateCity = value1.innerHTML;
                                        value1 = value1.nextSibling.nextSibling
                                        candidateName = value1.innerHTML;
                                        value1 = value1.nextSibling.nextSibling
                                        candidatePhoneNumber = value1.innerHTML;
                                        //value1 = value1.nextSibling.nextSibling
                                        //candidateInterviewDate = value1.innerHTML;
                                        value1 = value1.nextSibling.nextSibling
                                        candidateGender = value1.innerHTML;
                                        //window.location.href='components/profile_page.html';
                                        dataBaseFunction();
                                         app.insertRecord2();
                                        //alert("valid email id")
                                            // $('#employee_list').innerHTML=emp;
                                        profileDisplay2();

                                        // myfun();
                                        //document.getElementById('show').click();

                                    },
                                    error: function (error) {
                                        console.log(JSON.stringify(error));
                                    }
                                });

                            }
                        },
                        error: function (error) {
                            console.log("error" + JSON.stringify(error));
                        }

                    });

                },
                error: function (error) {
                    console.log(JSON.stringify(error));
                }
            });
        }
    } else {
        document.getElementById('login_error').innerHTML = 'not valid email address';
         document.getElementById('login_error').style.display = 'block';
   setTimeout(function(){ document.getElementById('login_error').style.display = 'none';},3000);
    }



}

var AppUtils = {};
AppUtils.getHexProfileId = function (profileId) {

    return profileId.toString(16).toUpperCase();
}
AppUtils.getUUID = function (profileId) {
    var hexProfileId = this.getHexProfileId(profileId);
    var profileUUID = "";

    for (var int = 0; int < (12 - hexProfileId.length); int++) {
        profileUUID = profileUUID.concat("0");
    }
    profileUUID = profileUUID.concat(hexProfileId); // Add string converted to
    // hex with trailing zeros

    return "00000000-0000-0000-0000-".concat(profileUUID);
}

function myfun() {
    var delegate, region, beaconRegion;
    // var x = '00000000-0000-0000-0000-000' + profile_id;
    window.locationManager = cordova.plugins.locationManager;

    delegate = new cordova.plugins.locationManager.Delegate()

    locationManager.setDelegate(delegate)
        //alert(x);
        //alert(profile_id);
        //document.getElementById('yourLinkID').click();
        //alert("9");
    var x = AppUtils.getUUID(parseInt(profile_id));
    //alert(x);
    //x='2f234454-cf6d-4a0f-adf2-f4911ba9ffa8'
    region = [{
        id: "po",
        uuid: x,
        major: 5,
        minor: 2000
    }]

    beaconRegion = new locationManager.BeaconRegion(
        region[0].id, region[0].uuid, region[0].major, region[0].minor)

    locationManager.startAdvertising(beaconRegion)
        .fail(console.error)
        .done()
        //alert("9");

    //document.getElementById("bleButton").style.display = "block";

}

function scan() {
    if (window.navigator.simulator === true) {
        alert("Not Supported in Simulator.");
    } else {
        cordova.plugins.barcodeScanner.scan(
            function (result) { //alert("hello");
                if (!result.cancelled) {
                    document.getElementById("admin_div").style.display = "none";
                    //var currentMessage = resultsField.innerHTML;
                    profile_id = result.text;
                    $.ajax({
                        url: url_login,
                        type: 'GET',
                        success: function (result) {

                            sessionId = result.sessionId;
                            //alert(sessionId + "  " + profile_id);
                            myfun();
                            $.ajax({
                                url: url_details1 + sessionId + "&id=" + profile_id + url_details2,
                                type: 'GET',
                                dataType: 'text',
                                success: function (result) {
                                    log = 1;
                                    //console.log((result));
                                    var txt, parser, xmlDoc, value1, value2;
                                    txt = result;
                                    parser = new DOMParser();
                                    xmlDoc = parser.parseFromString(txt, "text/xml");

                                    //value1 = xmlDoc.getElementsByTagName("data")[0].childNodes[0].nextSibling;
                                    alert("xml");
                                    value1 = xmlDoc.getElementsByTagName("data")[0].childNodes[0].nextSibling;
                                    candidatePhoto = value1.childNodes[0].innerHTML;
                                    value1 = value1.nextSibling.nextSibling
                                    candidateEmail = value1.innerHTML;
                                    value1 = value1.nextSibling.nextSibling
                                    candidateCity = value1.innerHTML;
                                    value1 = value1.nextSibling.nextSibling
                                    candidateName = value1.innerHTML;
                                    value1 = value1.nextSibling.nextSibling
                                    candidatePhoneNumber = value1.innerHTML;
                                    //value1 = value1.nextSibling.nextSibling
                                    //candidateInterviewDate = value1.innerHTML;
                                    value1 = value1.nextSibling.nextSibling
                                    candidateGender = value1.innerHTML;
                                    //window.location.href='components/profile_page.html';
                                    app.openDatabase();
                                    app.dropTable();
                                    app.insertRecord();
                                    app.readRecords();
                                    // $('#employee_list').innerHTML=emp;
                                    alert("1");
                                    profileDisplay2();

                                    // myfun();
                                    //document.getElementById('show').click();



                                },
                                error: function (error) {
                                    alert("erro" + JSON.stringify(error));
                                }
                            });
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });


                }
            });
    }
}

function profileDisplay2() {
    //document.getElementById('admin_div').style.display = 'none';
    alert("in fun");
    document.getElementById('profile').style.display = 'block';

    //document.getElementById('profile').style.display = 'none';
    //alert("p");
    profileDisplay();

}

function profileDisplay() {
    //alert("7");
    //setTimeout(function() {
    //alert("hello");

    document.getElementById("display_name").innerHTML = "Hi " + candidateName + ",";

    //},
    //1000);


}