const mysql = require("mysql");

// mysql connection
//=====================================================
const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "employee_db",

    multipleStatements: true
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    show()
});



function show() {
    const sql = 'SELECT * FROM department; SELECT * FROM employee'

    connection.query(sql, [1, 2], function (err, result) {
        if (err) throw err

        console.log(result[0][0].department_name)
        // console.log(result[1])
    })

    connection.end

}



// Once enabled, you can execute queries with multiple statements by separating each statement with a semi - colon;.Result will be an array for each statement.

//     Example
// connection.query('SELECT ?; SELECT ?', [1, 2], function (err, results) {
//         if (err) throw err;

//         // `results` is an array with one element for every statement in the query:
//         console.log(results[0]); // [{1: 1}]
//         console.log(results[1]); // [{2: 2}]
//     });
