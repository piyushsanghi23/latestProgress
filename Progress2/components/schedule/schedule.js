$body = $("body");
app.openDatabase = function () {
    if (!this.checkSimulator()) {
        db = window.sqlitePlugin.openDatabase(
            // options
            {
                name: "progress.db",
                location: 1 // for iOS, see the doc for details for copying in documents sub directory
            },
            // success callback
            function (msg) {
                //alert("success: " + JSON.stringify(msg));
            },
            // error callback
            function (msg) {
                //alert("error: " + msg);
            }
        );
    }
};
app.update = function (table_name) {
    alert("in update");
    var d = new Date();
    var h = d.getHours();
    if (!this.checkSimulator()) {
        if (this.checkOpenedDatabase()) {
            alert("f");
            db.transaction(function (tx) {
                tx.executeSql('UPDATE' + table_name + 'SET log_time=' + h + 'WHERE email=' + email + ';',
                    function (tx, res) {
                        alert(JSON.stringify(res));
                    },
                    function (tx, res) {
                        alert(JSON.stringify(res));
                        //alert('error: ' + res.message);
                    }
                );
            });
            alert("ff");
        }
    }
};
app.dropTable = function (table_name) {
    //alert(table_name);
    if (!this.checkSimulator()) {
        if (this.checkOpenedDatabase()) {
            db.transaction(function (tx) {
                tx.executeSql(
                    'DROP TABLE ' + table_name, [],
                    function (tx, res) {
                        //alert('Table deleted');
                    },
                    // note: gets called when deleting table without having inserted rows,
                    //       to avoid this error use: 'DROP TABLE IF EXISTS test'
                    function (tx, res) {
                        //alert('error: ' + res.message);
                    }
                );
            });
        }
    }
};

app.insertRecord = function (table_name) {
    if (!this.checkSimulator()) {
        if (this.checkOpenedDatabase()) {
            db.transaction(function (tx) {
                if (table_name == 'log') {
                    var w = interview_date;
                    var x = email;
                    var y = candidateName;
                    var z = profile_id;
                    var d = new Date();
                    var h = d.getHours();
                    tx.executeSql("CREATE TABLE IF NOT EXISTS log (email text primary key,name text,profile_id text,date Date, log_value integer,log_time int,contact_name text,contact_number text)");
                    tx.executeSql(
                        "INSERT INTO log (email,name,profile_id,date,log_value,log_time,contact_name,contact_number) VALUES (?,?,?,?,?,?,?,?)", [x, y, z, w, 1, h, app.contactInfo[0][0], app.contactInfo[0][1]],
                        function (tx, res) {
                            //alert(JSON.stringify(res) + "   " + w);
                        },
                        function (tx, res) {
                            alert('error: ' + res.message);
                        });

                } else if (table_name == 'schedule') {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS schedule (Round_Name text ,Interviewer text,Start_Time text, End_Time text,dgn1 text,dgn2 text)");

                    for (var i in app.employee) {
                        var round = app.employee[i].name;
                        round = round.split(',');
                        tx.executeSql(

                            "INSERT INTO schedule (Round_Name,Interviewer,Start_Time,End_Time,dgn1,dgn2) VALUES (?,?,?,?,?,?)", [round[0], round[3], round[1], round[2], round[4], round[5]],
                            function (tx, res) {

                                // alert(JSON.stringify(res));
                            },
                            function (tx, res) {
                                alert('error: ' + res.message);
                            });
                    }
                    var round = app.employee[0].name;
                    // alert(round);
                    round = round.split(',');
                    var max = round[2];
                    max = max.split(" ");
                    for (var i = 1; i < app.employee.length; i++) {
                        var round = app.employee[i].name;
                        round = round.split(',');
                        var time = round[2];
                        time = time.split(" ");
                        if (!(max[1] == 'PM' && time[1] == 'AM')) {
                            if (max[1] == 'AM' && time[1] == 'PM') {
                                max = time;

                            } else {
                                max[1] = time[1];
                                var y = max[0];
                                y = y.split(":");

                                var x = time[0];
                                x = x.split(":");

                                x[1] = parseInt(x[1], 10);
                                x[0] = parseInt(x[0], 10);
                                y[1] = parseInt(y[1], 10);
                                y[0] = parseInt(y[0], 10);
                                if (x[0] > y[0]) {

                                    max = time;

                                } else if (x[0] == y[0]) {
                                    if (x[1] >= y[1]) {
                                        max = time;
                                    }


                                } else {

                                }
                            }

                        }
                    }


                    greatestTime = max;
                    // alert(max);
                    feedback_timer = setInterval(changeHref(), 43200000);

                } else if (table_name == 'beacon') {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS beacon (DeviceDescription text ,Tag1 text unique,Content_Type1 text, Content text)");
                    for (var i in app.beaconRegions) {
                        tx.executeSql(
                            "INSERT INTO beacon (DeviceDescription,Tag1,Content_Type1,Content) VALUES (?,?,?,?)", [app.beaconRegions[i].DeviceDescription, app.beaconRegions[i].Tag1, app.beaconRegions[i].Content_Type1, app.beaconRegions[i].Content],
                            function (tx, res) {
                                //alert(JSON.stringify(app.beaconRegions[i]));

                            },
                            function (tx, res) {
                                alert('error: ' + res.message);
                            });
                    }
                    //changeHref();
                    // alert("about to start beacons search");
                    app.startScanForBeacons();
                }


            });
        }
    }
};

function convertMonthNameToNumber(monthName) {
    var myDate = new Date(monthName + " 1, 2000");
    var monthDigit = myDate.getMonth();
    return isNaN(monthDigit) ? 0 : (monthDigit + 1);
}

function parseTime(s) {
    var part = s.match(/(\d+):(\d+)(?: )?(am|pm)?/i);
    var hh = parseInt(part[1], 10);
    var mm = parseInt(part[2], 10);
    var ap = part[3] ? part[3].toUpperCase() : null;
    if (ap === "AM") {
        if (hh == 12) {
            hh = 0;
        }
    }
    if (ap === "PM") {
        if (hh != 12) {
            hh += 12;
        }
    }
    return {
        hh: hh,
        mm: mm
    };
}

function changeHref() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    //alert(mm + dd + yyyy + hours + minutes);
    var x = interview_date;
    //alert(x);
    //alert('changeHref' + x);
    x = x.split(' ');
    x[1] = convertMonthNameToNumber(x[1])
        //alert(x[0]);
        //alert(x[1] + x[2] + x[3]);
    if (x[1] < 10) {
        x[1] = '0' + x[1]
    }
    if (x[2] < 10) {
        x[2] = '0' + x[2]
    }
    if (x[1] == mm && x[2] == dd && x[3] == yyyy) {
        // alert("greatest time in" + greatestTime[0] + greatestTime[1])
        var time1 = greatestTime[0] + " " + greatestTime[1];

        time1 = parseTime(time1);
        // alert(time1.hh);
        // alert(time1.mm);
        var date1 = new Date(2000, 0, 1, time1.hh, time1.mm); // 9:00 AM
        var date2 = new Date(2000, 0, 1, hours, minutes); // 5:00 PM
        if (date2 > date1) {

            // alert("currenttime greater" + diff);
            document.getElementById('feedback').href = 'components/feedback/feedback.html';
        } else {
            clearInterval(feedback_timer);
            var diff = date1 - date2;
            setTimeout(function () {
                //alert("kl");
                document.getElementById('feedback').href = 'components/feedback/feedback.html';
            }, diff);
        }

    }
    if ((x[2] < dd && x[1] == mm && x[3] == yyyy) || x[1] < mm && x[3] == yyyy || x[3] < yyyy) {
        clearInterval(feedback_timer);
        document.getElementById('feedback').href = 'components/feedback/feedback.html';
    }
}
app.readRecords = function (table_name) {
    // alert(table_name);
    if (!this.checkSimulator()) {
        if (this.checkOpenedDatabase()) {
            db.transaction(function (tx) {
                tx.executeSql(
                    "select * from " + table_name + ";", [],
                    function (tx, res) {
                        if (table_name == 'log') {
                            //alert(table_name + "		" + res.rows.length);
                            for (var i = 0; i < res.rows.length; i++) {
                                var row = res.rows.item(i);
                                log_details.push(res.rows.item(i));
                            }
                            candidateName = log_details[0].name;
                            interview_date = log_details[0].date;
                            //alert("log"+log_details[0].date)
                            email = log_details[0].email;
                            log_time = log_details[0].log_time;

                            //alert(interview_date);
                            dataBaseFunction();
                            profile_id = log_details[0].profile_id;
                            myfun();
                            document.getElementById('login').style.display = 'none';
                            profileDisplay2();
                            var d = new Date();
                            var h = d.getHours();
                            app.contactInfo[0][0] = log_details[0].contact_name;
                            app.contactInfo[0][1] = log_details[0].contact_number;
                            c_n = log_details[0].contact_number;
                            c_name = log_details[0].contact_name;
                            //alert(log_time);
                            if (Math.abs(log_time - h) >= 1) {
                                // alert(Math.abs(log_time - h));
                                app.openDatabase();
                                if (wifi_flag == 1) {}
                                // add logic for checking wifi and then drop 
                                else {
                                    app.dropTable('schedule');
                                    $.ajax({
                                        url: url_login,
                                        type: 'GET',
                                        success: function (result) {
                                            $.ajax({
                                                url: "https://www.rollbase.com/rest/api/getRelationships?sessionId=" + sessionId + "&objName=Profile2&id=" + profile_id + "&relName=R257829363&fieldList=name&output=json",
                                                type: 'GET',
                                                success: function (result) {
                                                    //alert(JSON.stringify(result));
                                                    app.openDatabase();

                                                    app.employee = result;
                                                    //alert(JSON.stringify(app.employee));
                                                    app.insertRecord('schedule');
                                                    app.dropTable('log');
                                                    app.insertRecord('log');

                                                },
                                                error: function (result) {
                                                    alert("error:" + JSON.stringify(result));
                                                }
                                            });
                                        },
                                        error: function (result) {
                                            alert(error.message);
                                        }
                                    });

                                }
                            }
                        } else if (table_name == 'schedule') {
                            for (var i = 0; i < res.rows.length; i++) {
                                //alert("testin "+i + "        " + JSON.stringify(res.rows.item(i)));
                                app.employee[i] = res.rows.item(i).Round_Name + ',' + res.rows.item(i).Start_Time + ',' + res.rows.item(i).End_Time + ',' + res.rows.item(i).Interviewer + ',' + res.rows.item(i).dgn1 + ',' + res.rows.item(i).dgn2;
                                //alert(i + "        " + JSON.stringify(app.employee[i]));
                                reading = 1;


                            }

                            var max = res.rows.item(0).End_Time;

                            max = max.split(" ");
                            for (var i = 1; i < app.employee.length; i++) {
                                var time1 = app.employee[i].split(',');


                                var time = time1[2];

                                time = time.split(" ");
                                if (!(max[1] == 'PM' && time[1] == 'AM')) {
                                    if (max[1] == 'AM' && time[1] == 'PM') {
                                        max = time;

                                    } else {
                                        max[1] = time[1];
                                        var y = max[0];
                                        y = y.split(":");

                                        var x = time[0];
                                        x = x.split(":");

                                        x[1] = parseInt(x[1], 10);
                                        x[0] = parseInt(x[0], 10);
                                        y[1] = parseInt(y[1], 10);
                                        y[0] = parseInt(y[0], 10);
                                        if (x[0] > y[0]) {

                                            max = time;

                                        } else if (x[0] == y[0]) {
                                            if (x[1] >= y[1]) {
                                                max = time;
                                            }


                                        } else {

                                        }
                                    }

                                }

                            }
                            greatestTime = max;
                            //alert("j" + greatestTime);
                            feedback_timer = setInterval(changeHref(), 43200000);
                        } else if (table_name == 'beacon') {
                            //alert(table_name + "		" + res.rows.length);
                            for (var i = 0; i < res.rows.length; i++) {
                                app.beaconRegions[i] = res.rows.item(i);

                            }
                            ///alert(JSON.stringify(app.beaconRegions))
                            app.startScanForBeacons();
                        }

                    },
                    function (tx, res) {
                        //alert('error: ' + res.message);
                    });
            });
        }
    }
};
app.countRecords = function () {

    if (!this.checkSimulator()) {
        if (this.checkOpenedDatabase()) {

            db.transaction(function (tx) {
                tx.executeSql(
                    "select count(*) as cnt from log;", [],
                    function (tx, res) {
                        //alert("count records");
                        log_count = res.rows.item(0).cnt;
                        //alert(log_count);
                        if (log_count == 1) {
                            //alert(log_count);
                            app.readRecords('log');
                            app.readRecords('schedule');
                            app.readRecords('beacon');


                        }


                    },
                    function (tx, res) {
                        //alert('error: ' + res.message);
                        //app.insertRecord2();
                    });
            });
        }
    }
};

app.checkOpenedDatabase = function () {
        if (db == null) {
            // wrapping in a timeout so the button doesn't stay in 'pressed' state
            setTimeout(function () {
                //alert("open the database first");
            });
            return false;
        }
        return true;
    },

    app.checkSimulator = function () {
        if (window.navigator.simulator === true) {
            //alert('This plugin is not available in the simulator.');
            return true;
        } else if (window.sqlitePlugin === undefined) {
            //alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
            return true;
        } else {
            return false;
        }
    };

function dis() {
    //alert("in dis");
    for (var i in app.employee) {
        //alert("in for loop");
        //  alert(app.employee);
        count_dis = 1;
        //alert("nv");
        var round;
        //   alert("before if n esle");
        if (reading == 1) {
            //alert("in if");
            round = app.employee[i].split(',');
            // alert(round);
        } else {
            // alert("in else");
            round = app.employee[i].name;
            round = round.split(',');
        }
        // alert(round);   
        //alert(round);
        var node = document.createElement("li");
        node.setAttribute("class", "time");
        node.setAttribute('id', i);
        node.setAttribute('onclick', 'show(this.id)');
        var text = "Time: " + round[1] + "-" + round[2];
        //  alert(text);
        var textnode = document.createTextNode(text);
        //textNode.setAttribute("class", "textItem");
        // node.appendChild(textnode);  i commented
        // alert("appended");
        document.getElementById("employee_list").appendChild(node);
        //    alert("appended in employee ");
        var node2 = document.createElement('div');
        node2.setAttribute("class", "arrow");
        node2.setAttribute('id', 'arrow' + i);
        var img = document.createElement('img');
        img.setAttribute("class", "imgArrow");
        img.setAttribute("id", "Arrow" + i);
        img.setAttribute('src', 'images/arrow-downAsset 2@1x.png');
        node2.appendChild(img);
        //var textnode1 = document.createTextNode(text1);
        //node2.appendChild(img);
        document.getElementById(i).appendChild(node2);

        var node3 = document.createElement('div');
        node3.setAttribute("class", "listItem");
        var text3 = round[0];
        var textnode3 = document.createTextNode(text3);
        node3.appendChild(textnode3);
        document.getElementById(i).appendChild(node3);

        var div = document.createElement("div");
        div.setAttribute("class", "divItem");
        div.setAttribute('id', 'div' + i);
        /* var img = document.createElement('img');
         img.setAttribute("class", "imgItem");
         img.setAttribute('src', emp[i].image);
         div.appendChild(img);*/
        var name = document.createElement("div");
        name.setAttribute('id', 'name');
        var text2 = "By: " + round[3];
        var textnode2 = document.createTextNode(text2);
        var para = document.createElement("p");
        para.setAttribute("class", "by_para");
        name.appendChild(textnode);
        para.appendChild(textnode2);
        name.appendChild(para);
        // name.appendChild(textnode2);
        //name.appendChild(br);

        var name1 = document.createElement("div");
        name.setAttribute('id', 'name');
        var text3 = "Designation: " + round[4] + ',';
        var textnode3 = document.createTextNode(text3);
        name.appendChild(textnode3);
        var name2 = document.createElement("div");
        name.setAttribute('id', 'name');
        var text4 = round[5] + '.';
        var textnode4 = document.createTextNode(text4);
        name.appendChild(textnode4);

        div.appendChild(name);
        div.appendChild(name1);
        div.appendChild(name2);

        document.getElementById("employee_list").appendChild(div);
        if (i == app.employee.length - 1) {

            clearInterval(my);

            app.openDatabase();

            app.readRecords('log');
            var text_query = app.contactInfo[0][0];
            var text_query_c = app.contactInfo[0][1];


            var textnode_query = document.createTextNode(text_query);

            document.getElementById('contact_name').appendChild(textnode_query);



            var textnode_query_contact = document.createTextNode(text_query_c);

            document.getElementById('contact_href').appendChild(textnode_query_contact);

            var number = document.getElementById('contact_href');

            number.setAttribute("href", "tel: " + app.contactInfo[0][1]);

        }
    }

}

var my = setInterval('dis()', 1000);

function show(id) {
    var x = 'div' + id;
    for (i in app.employee) {
        if (x == 'div' + i) {


            if (document.getElementById('div' + i).style.display == 'block') {
                alert("came in if")
                document.getElementById("Arrow" + id).src = 'images/arrow-downAsset 2@1x.png';


                document.getElementById('div' + i).style.display = 'none';


            } else {

                document.getElementById("Arrow" + id).src = 'images/arrow-upAsset 1@1x.png';

                document.getElementById('div' + i).style.display = 'block';

            }
        } else {

            document.getElementById("Arrow" + i).src = 'images/arrow-downAsset 2@1x.png'
            document.getElementById('div' + i).style.display = 'none';

        }
    }
}