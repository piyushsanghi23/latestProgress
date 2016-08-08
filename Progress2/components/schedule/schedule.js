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

app.dropTable2 = function () {
    if (!this.checkSimulator()) {
        if (this.checkOpenedDatabase()) {
            db.transaction(function (tx) {
                tx.executeSql(
                    'DROP TABLE log', [],
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
app.insertRecord2 = function () {
    alert("P");
    if (!this.checkSimulator()) {
        if (this.checkOpenedDatabase()) {
            var x=email;
            var y=candidateName;
            var z=profile_id;
            //alert(x);
            db.transaction(function (tx) {
                tx.executeSql("CREATE TABLE IF NOT EXISTS log (email text ,name text,profile_id text, log_value integer)");
                    tx.executeSql(
                        "INSERT INTO log (email,name,profile_id,log_value) VALUES (?,?,?,?)", [x,y,z,1],
                        function (tx, res) {
                            //alert("insertId: ");
                        },
                        function (tx, res) {
                            alert('error: ' + res.message);
                        });
                
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

app.readRecords2 = function () {
    if (!this.checkSimulator()) {
        if (this.checkOpenedDatabase()) {
            db.transaction(function (tx) {
                tx.executeSql(
                    "select * from log;", [],
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

                            log_details.push(res.rows.item(i));
                            
                            //alert(JSON.stringify(emp[0]));
                            //document.getElementById('employee_list').innerHTML=emp;

                        }
                        
                        candidateName=log_details[0].name;
                        dataBaseFunction();
                        document.getElementById('login').style.display='none';
                         profileDisplay2();
                        //dis();

                    },
                    function (tx, res) {
                        //alert('error: ' + res.message);
                        //alert("in readrecords2");
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
                     log_count= res.rows.item(0).cnt;
                       	 //alert(log_count);
                         if(log_count==1)
                             {
                                 app.readRecords2();
                                   
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
var i = 0;

function dis() {

  
            
            //document.getElementById('employee_list').innerHTML='';
       
    for (i in emp) {
        count_dis=1;
        var node = document.createElement("li");
        node.setAttribute("class", "listItem");
        node.setAttribute('id', i);
        node.setAttribute('onclick', 'show(this.id)');
        var text = emp[i].round;
        var textnode = document.createTextNode(text);
        //textNode.setAttribute("class", "textItem");
        node.appendChild(textnode);
        document.getElementById("employee_list").appendChild(node);

        var node2 = document.createElement('div');
        node2.setAttribute("class", "arrow");
        node2.setAttribute('id', 'arrow' + i);
        var text1 = '\u276f';
        var textnode1 = document.createTextNode(text1);
        node2.appendChild(textnode1);
        document.getElementById(i).appendChild(node2);

        var node3 = document.createElement('div');
        node3.setAttribute("class", "time");
        //node2.setAttribute('id','arrow'+i);
        var img1 = document.createElement('img')
        img1.setAttribute('class', 'timeItem')
        img1.setAttribute('src', 'images/timer.png');
        node3.appendChild(img1);
        var text3 = emp[i].time;
        var textnode3 = document.createTextNode(text3);
        node3.appendChild(textnode3);
        document.getElementById(i).appendChild(node3);

        var div = document.createElement("div");
        div.setAttribute("class", "divItem");
        div.setAttribute('id', 'div' + i);
        var img = document.createElement('img');
        img.setAttribute("class", "imgItem");
        img.setAttribute('src', emp[i].image);
        div.appendChild(img);
        var name = document.createElement("div");
        name.setAttribute('id', 'name');
        var text2 = emp[i].name;
        var textnode2 = document.createTextNode(text2);
        name.appendChild(textnode2);
        //document.getElementById("employee_list").appendChild(div);
        var role = document.createElement("div");
        role.setAttribute('id', 'role');
        var text3 = emp[i].role;
        var textnode3 = document.createTextNode(text3);
        role.appendChild(textnode3);
        div.appendChild(name);
        div.appendChild(role);
        document.getElementById("employee_list").appendChild(div);
        if (i == emp.length - 1){
            clearInterval(my);
        }
    }

}
var my = setInterval('dis()', 1000);

function show(id) {
    var x = 'div' + id;
    //alert(emp.length);
    for (i in emp) {
        if (x == 'div' + i) {
            //alert(x + "   " + i);
            if (document.getElementById('div' + i).style.display == 'block') {
                var arrow = document.getElementById('arrow' + i);
                arrow.setAttribute('class', 'arrow');
                document.getElementById('div' + i).style.display = 'none';
            } else {
                document.getElementById('div' + i).style.display = 'block';
                var arrow = document.getElementById('arrow' + i);
                arrow.setAttribute('class', 'arrow2');
            }
        } else {
            //alert(x + "   " + i);
            document.getElementById('div' + i).style.display = 'none';
            var arrow = document.getElementById('arrow' + i);
            arrow.setAttribute('class', 'arrow');
        }
    }
}