const inquirer = require('inquirer')
const mysql = require("mysql");
const cTable = require('console.table');


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
    start();
});


// app
//=====================================================
const choices =
    [
        'View All Employees',
        'View All Employees by Department',
        'View All Employees by Manager',
        'Add Employee',
        'Remove Employee',
        'Update Employee Role',
        'Update Employee Manager',
        'View All Roles',
        'Exit'
    ]

const manager =
    [
        '1 John Doe',
        '2 Mike Chan',
        '3 Ashley Rodriguez'
    ]

function start() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: choices
        }
    ]).then(function (data) {
        const userChoice = data.action

        switch (userChoice) {
            case choices[0]:
                viewAllEmployee()
                break;
            case choices[1]:
                viewEmployeeDep()
                break;
            case choices[2]:
                viewEmployeeMan()
                break;
            case choices[3]:
                addEmployee()
                break;
            case choices[4]:
                removeEmployee()
                break;
            case choices[5]:
                updateEmployeeRole()
                break;
            case choices[6]:
                updateEmployeeManager()
                break;
            case choices[7]:
                viewAllRole()
                break;
            case choices[8]:
                exit()
                break;
        }
    })
}

function viewAllEmployee() {
    const sql = "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.department_name, manager.manager_name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id INNER JOIN manager ON employee.manager_id = manager.id"
    connection.query(sql, function (err, res) {
        if (err) throw err
        console.table(res)
        start()
    })
}

function viewEmployeeDep() {

    const sql = 'SELECT * FROM department'

    connection.query(sql, function (err, res) {

        inquirer.prompt([
            {
                type: 'list',
                name: 'confirm',
                message: 'What department employees do you want to see?',
                choices: function () {
                    const depArr = []
                    res.forEach((el) => depArr.push(el.department_name))
                    return depArr
                }
            }
        ]).then(function (data) {
            const dep = data.confirm

            const sql = `SELECT employee.first_name, employee.last_name, employee.role_id, role.department_id, department.department_name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department.department_name = "${dep}"`

            connection.query(sql, function (err, res) {
                if (err) throw err
                console.table(res)
            })
            start()
        })
    })
}

function viewEmployeeMan() {
    console.log('Hello')
}

function addEmployee() {

    const sql = "SELECT * FROM role"
    connection.query(sql, function (err, res) {
        if (err) throw err

        inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: `What is the employee first name?`,
            },
            {
                type: 'input',
                name: 'last_name',
                message: `What is the employee last name?`,
            },
            {
                type: 'list',
                name: 'role',
                message: `What is the employee role?`,
                choices: function () {
                    const depArr = []
                    let index = 1
                    res.forEach((el) => {
                        depArr.push(index + " " + el.title)
                        index++
                    })
                    return depArr
                }
            },
            {
                type: 'list',
                name: 'manager',
                message: 'What is the employee manager?',
                choices: manager
            },
        ]).then(function (data) {

            console.log(data)
            const roleId = parseInt(data.role.split(" ")[0])
            const managerId = parseInt(data.manager.split(" ")[0])

            connection.query(`INSERT INTO employee SET ?`,
                {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    role_id: roleId,
                    manager_id: managerId,
                },
                function (err, res) {
                    if (err) throw err
                    console.log('Successfully added employee to database')
                    start()
                }
            )
        })
    })
}

function removeEmployee() {
    console.log('Remove Employee')
}

function updateEmployeeRole() {
    const sql = 'SELECT * FROM employee; SELECT * FROM role'

    connection.query(sql, [1, 2], function (err, res) {
        if (err) throw err


        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Select employee to udpate',
                choices: function () {
                    const arr = []
                    let index = 1
                    res[0].forEach((el) => {
                        arr.push(index + " " + el.first_name + " " + el.last_name)
                        index++
                    })
                    return arr
                }
            },
            {
                type: 'list',
                name: 'role',
                message: 'Change employee role to:',
                choices: function () {
                    const arr = []
                    let index = 1
                    res[1].forEach((el) => {
                        arr.push(index + " " + el.title)
                        index++
                    })
                    return arr
                }
            }

        ]).then(function (data) {

            console.log(data)
            const employeeId = parseInt(data.employee.split(" "))
            console.log(employeeId)

            const newRole = parseInt(data.role.split(" "))
            console.log(newRole)

            const sql = "UPDATE employee SET ? WHERE ?"

            connection.query(sql, [{ role_id: newRole }, { id: employeeId }], function (err, res) {
                if (err) throw err
                console.table(res)

                start()

            })
        })
    })
}


function exit() {
    console.log('Good Bye')
    connection.end()
}





// // UPDATE
// // ==============================================
// async function updateEmpoyee() {

//     try {

//         const res = await choseUpdate()
//         const toUpdate = res.to_update

//         connection.query(
//             "SELECT * FROM employee",
//             function (err, res) {
//                 if (err) throw err

//                 inquirer.prompt([
//                     {
//                         type: 'list',
//                         name: 'employee',
//                         message: 'Select the employee to update',
//                         choices: function () {
//                             const arr = []
//                             res.forEach((el) => arr.push(el.id + " " + el.first_name))
//                             console.log(arr)
//                             return arr
//                         }
//                     },
//                     {
//                         type: 'input',
//                         name: 'updated',
//                         message: `Enter the new ${toUpdate} for this employee`,
//                         validate: function (value) {
//                             if (isNaN(value) === false) {
//                                 return true
//                             }
//                             return false;
//                         }

//                     }
//                 ]).then(function (data) {

//                     const chosen = data.employee.split(' ')
//                     const choseId = parseInt(chosen[0])
//                     const updated = parseInt(data.updated)

//                     // console.log(choseId)
//                     // console.log(typeof (choseId))
//                     // console.log(newRole)

//                     const sql = "UPDATE employee SET ? WHERE ?"

//                     if (toUpdate === 'ROLE') {
//                         connection.query(sql, [{ role_id: updated }, { id: choseId }], function (err, res) {
//                             if (err) throw err
//                             console.table(res)
//                         })
//                     } else if (toUpdate === 'MANAGER') {
//                         connection.query(sql, [{ manager_id: updated }, { id: choseId }], function (err, res) {
//                             if (err) throw err
//                             console.table(res)
//                         })
//                     }
//                     start()
//                 })
//             }
//         )



//     }

//     catch (err) {
//         console.log(err)
//     }


// }




