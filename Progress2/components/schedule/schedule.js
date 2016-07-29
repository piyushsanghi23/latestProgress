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

app.dropTable = function () {
    if (!this.checkSimulator()) {
        if (this.checkOpenedDatabase()) {
            db.transaction(function (tx) {
                tx.executeSql(
                    'DROP TABLE test', [],
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

app.insertRecord = function () {
    if (!this.checkSimulator()) {
        if (this.checkOpenedDatabase()) {
            db.transaction(function (tx) {
                tx.executeSql("CREATE TABLE IF NOT EXISTS test (id integer primary key, round text,time text,image text,name text,role text)");
                for (var i in app.employee) {
                    var x = app.employee[i];
                    tx.executeSql(
                        "INSERT INTO test (round, time, image, name, role) VALUES (?,?,?,?,?)", [x.round, x.time, x.image, x.name, x.role],
                        function (tx, res) {
                            //alert("insertId: " + res.insertId + ", rows affected: " + res.rowsAffected);
                        },
                        function (tx, res) {
                            //alert('error: ' + res.message);
                        });
                }
            });
        }
    }
};

app.readRecords = function () {
    if (!this.checkSimulator()) {
        if (this.checkOpenedDatabase()) {
            db.transaction(function (tx) {
                tx.executeSql(
                    "select * from test;", [],
                    function (tx, res) {
                        for (var i = 0; i < res.rows.length; i++) {
                            var row = res.rows.item(i);
                            /*alert(
                                "row " + i + ":\n" +
                                " - id = " + row.id + "\n" +
                                " - round = " + row.round + "\n" +
                                " - time = " + row.time + "\n" +
                                " - image = " + row.image + "\n" +
                                " - name = " + row.name + "\n" +
                                " - role= " + row.role
                            );*/

                            emp.push(res.rows.item(i));
                            //alert(JSON.stringify(emp[0]));
                            //document.getElementById('employee_list').innerHTML=emp;

                        }
                        //dis();

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
                    "select count(id) as cnt from test;", [],
                    function (tx, res) {
                        //alert("rows: " + res.rows.item(0).cnt);
                    },
                    function (tx, res) {
                        //alert('error: ' + res.message);
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
var i = 0;

function dis() {

    for (i in emp) {
        var node = document.createElement("li");
        node.setAttribute("class", "listItem");
        node.setAttribute('id', i);
        var text = emp[i].round;
        var textnode = document.createTextNode(text);
        node.appendChild(textnode);
        document.getElementById("employee_list").appendChild(node);
        
      /*  var node2=document.createElement('h3');
        node2.setAttribute("class", "timeItem");
        var text1 = emp[i].time;
        var textnode1 = document.createTextNode(text1);
        node2.appendChild(textnode1);
        document.getElementById(i).appendChild(node2);*/
        
        var div = document.createElement("div");
        div.setAttribute("class", "divItem");
        div.setAttribute('id', 'div' + i);
        var img=document.createElement('img');
         //div.setAttribute("class", "imgItem");
        img.setAttribute('src',emp[i].image);
        div.appendChild(img);
        var text2 = emp[i].name + "\n" + emp[i].role;
        var textnode2 = document.createTextNode(text2);
        div.appendChild(textnode2);
        document.getElementById("employee_list").appendChild(div);
        if (i == emp.length - 1)
            clearInterval(my);
    }

}
var my = setInterval('dis()', 1000);

function show() {
    // if(document.getElementByClassName=='listItem')

    document.getElementById('employee_list').onclick = function (e) {
        //alert(e.target.id)
        var x = 'div' + e.target.id;
        for (i in emp) {
            if (x == 'div' + i) {
               //alert(x + "   " + i);
                if(document.getElementById('div' + i).style.display =='none')
                document.getElementById('div' + i).style.display = 'block';
                else
                    document.getElementById('div' + i).style.display = 'none';
            } else {
                //alert(x + "   " + i);
                document.getElementById('div' + i).style.display = 'none';
            }
        }
        // document.getElementById(x).style.display='block';

    }
}