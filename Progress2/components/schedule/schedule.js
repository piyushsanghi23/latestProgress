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
                            emp.push(row.round + "	" + row.time + "	" + row.image + "	" + row.name + " " + row.role);
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
    /* for(i in emp)
     document.getElementById("employee_list").append = emp[i];*/
    for (i in emp) {
        var node = document.createElement("LI");
        var textnode = document.createTextNode(emp[i]);
        node.appendChild(textnode);
        document.getElementById("employee_list").appendChild(node);
        if (i == emp.length - 1)
            clearInterval(my);
    }

}
var my = setInterval('dis()', 1000);