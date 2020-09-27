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
        'Add Employee',
        'Remove Employee',
        'Update Employee Role',
        'Update Employee Manager',
        'View All Roles',
        'View total budget of department',
        'Exit'
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
                addEmployee()
                break;
            case choices[3]:
                removeEmployee()
                break;
            case choices[4]:
                updateEmployeeRole()
                break;
            case choices[5]:
                updateEmployeeManager()
                break;
            case choices[6]:
                viewAllRole()
                break;
            case choices[7]:
                viewBudget()
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

            let sql = `SELECT employee.first_name, employee.last_name, employee.role_id, role.department_id, department.department_name`
            sql += ` FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department`
            sql += ` ON role.department_id = department.id`
            sql += ` WHERE department.department_name = "${dep}"`


            connection.query(sql, function (err, res) {
                if (err) throw err
                console.table(res)
            })
            start()
        })
    })
}

function addEmployee() {

    const sql = 'SELECT * FROM role; SELECT * FROM manager'
    connection.query(sql, [1, 2], function (err, res) {
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
                    const newArr = []
                    res[0].forEach((el) => {
                        newArr.push(el.id + " " + el.title)
                    })
                    return newArr
                }
            },
            {
                type: 'list',
                name: 'manager',
                message: 'What is the employee manager?',
                choices: function () {
                    const newArr = []
                    res[1].forEach((el) => {
                        newArr.push(el.id + " " + el.manager_name)
                    })
                    return newArr
                }
            },
        ]).then(function (data) {

            console.log(data)
            const roleId = parseInt(data.role.split(" "))
            const managerId = parseInt(data.manager.split(" "))

            connection.query(`INSERT INTO employee SET ?`,
                {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    role_id: roleId,
                    manager_id: managerId,
                },
                function (err, res) {
                    if (err) throw err
                    console.log(res)
                    console.log(`\n New employee ${data.first_name} ${data.last_name} successfully added to database \n`)
                    start()
                }
            )
        })
    })
}

function removeEmployee() {
    const sql = 'SELECT * FROM employee'

    connection.query(sql, function (err, res) {
        if (err) throw err

        inquirer.prompt([
            {
                type: 'list',
                name: 'to_delete',
                message: 'select the employee you want to delete',
                choices: function () {
                    const newArr = []
                    res.forEach((el) => newArr.push(el.id + " " + el.first_name + " " + el.last_name))
                    return newArr
                }
            }
        ]).then(function (data) {
            const idToDelete = parseInt(data.to_delete.split(" "))

            const sql = `DELETE FROM employee WHERE employee.id = ${idToDelete}`

            connection.query(sql, function (err, res) {
                if (err) throw err
                console.log(`\n Employee id N.${data.to_delete} has been deleted \n`)
                start()
            })

        })
    })
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
                    res[0].forEach((el) => {
                        arr.push(el.id + " " + el.first_name + " " + el.last_name)
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
                    res[1].forEach((el) => {
                        arr.push(el.id + " " + el.title)
                    })
                    return arr
                }
            }

        ]).then(function (data) {

            const employeeId = parseInt(data.employee.split(" "))

            const newRole = parseInt(data.role.split(" "))

            const sql = "UPDATE employee SET ? WHERE ?"

            connection.query(sql, [{ role_id: newRole }, { id: employeeId }], function (err, res) {
                if (err) throw err
                console.log(`\n Employee ID N.${data.employee} was updated to new role ID N.${data.role} \n`)

                start()
            })
        })
    })
}

function updateEmployeeManager() {
    const sql = 'SELECT * FROM employee; SELECT * FROM manager'

    connection.query(sql, [1, 2], function (err, res) {
        if (err) throw err


        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Select employee to udpate',
                choices: function () {
                    const arr = []
                    res[0].forEach((el) => {
                        arr.push(el.id + " " + el.first_name + " " + el.last_name)
                    })
                    return arr
                }
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Change employee manager to:',
                choices: function () {
                    const arr = []
                    res[1].forEach((el) => {
                        arr.push(el.id + " " + el.manager_name)
                    })
                    return arr
                }
            }

        ]).then(function (data) {

            const employeeId = parseInt(data.employee.split(" "))

            const newManagerId = parseInt(data.manager.split(" "))

            const sql = "UPDATE employee SET ? WHERE ?"

            connection.query(sql, [{ manager_id: newManagerId }, { id: employeeId }], function (err, res) {
                if (err) throw err
                console.log(`\n Employee ID N.${data.employee} was updated to new manager ID N.${data.manager} \n`)

                start()
            })
        })
    })
}

function viewAllRole() {
    const sql = "SELECT * FROM role"
    connection.query(sql, function (err, res) {
        if (err) throw err
        console.table(res)
        start()
    })
}

function viewBudget() {
    const sql = 'SELECT * FROM department'

    connection.query(sql, function (err, res) {
        if (err) throw err

        inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Select the budget of the department:',
                choices: function () {
                    const newArr = []
                    res.forEach((el) => newArr.push(el.department_name))
                    return newArr
                }
            }
        ]).then(function (data) {

            let sql = `SELECT employee.role_id, role.department_id, role.salary, department.department_name`
            sql += ` FROM employee`
            sql += ` LEFT JOIN role ON employee.role_id = role.id`
            sql += ` LEFT JOIN department`
            sql += ` ON role.department_id = department.id`
            sql += ` WHERE department.department_name = "${data.department}"`

            connection.query(sql, function (err, res) {
                if (err) throw err

                const budgetArr = []
                res.forEach((el) => budgetArr.push(parseInt(el.salary)))
                // console.log(budgetArr)

                let budget = 0
                budgetArr.forEach((el) => {
                    budget += el
                })
                console.log(`\n The total budget of the department is $${budget} \n`)

                start()
            })
        })
    })
}

function exit() {
    console.log('Good Bye')
    connection.end()
}




// function viewEmployeeMan() {

//     const sql = 'SELECT * FROM manager'

//     connection.query(sql, function (err, res) {

//         inquirer.prompt([
//             {
//                 type: 'list',
//                 name: 'confirm',
//                 message: 'What manager employees do you want to see?',
//                 choices: function () {
//                     const depArr = []
//                     res.forEach((el) => depArr.push(el.id + " " + el.manager_name))
//                     return depArr
//                 }
//             }
//         ]).then(function (data) {
//             const dep = parseInt(data.confirm.split(" "))

//             let sql = `SELECT employee.first_name, employee.last_name, employee.manager_id, manager.manager_name, manager.id`
//             sql += ` FROM employee`
//             sql += ` JOIN manager ON employee.manager_id = manager.id;`
//             sql += ` WHERE manager.id = "${dep}"`

//             connection.query(sql, function (err, res) {
//                 if (err) throw err
//                 console.table(res)
//                 start()
//             })

//         })
//     })
// }