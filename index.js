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
    database: "employee_db"
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


function exit() {
    console.log('Good Bye')
    connection.end()
}













// function initialChoice() {
//     return inquirer.prompt([
//         {
//             type: 'list',
//             name: 'confirm',
//             message: 'Do you want to add, view or update information?',
//             choices: ['ADD', 'VIEW', 'UPDATE', 'EXIT']
//         }
//     ])
// }

// // add category
// function addCategory() {
//     return inquirer.prompt([
//         {
//             type: 'list',
//             name: 'category',
//             message: 'Do you want to add departments, roles or employees?',
//             choices: ['DEPARTMENT', 'ROLE', 'EMPLOYEE']
//         }
//     ])
// }

// // user inputs
// function userContent(category) {

//     switch (category) {
//         case 'DEPARTMENT':
//             return inquirer.prompt([
//                 {
//                     type: 'input',
//                     name: 'text',
//                     message: `What ${category} do you want to add?`,
//                 }
//             ])

//         case 'ROLE':
//             return inquirer.prompt([
//                 {
//                     type: 'input',
//                     name: 'title',
//                     message: `What ${category} do you want to add?`,
//                 },
//                 {
//                     type: 'input',
//                     name: 'salary',
//                     message: `What salary for this role?`,
//                 },
//                 {
//                     type: 'input',
//                     name: 'department',
//                     message: `What is the department id number for this role?`,

//                 }
//             ])

//         case 'EMPLOYEE':
//             return inquirer.prompt([
//                 {
//                     type: 'input',
//                     name: 'first_name',
//                     message: `What is the employee first name?`,
//                 },
//                 {
//                     type: 'input',
//                     name: 'last_name',
//                     message: `What is the employee last name?`,
//                 },
//                 {
//                     type: 'input',
//                     name: 'role',
//                     message: `What is the employee role id?`
//                 },
//                 {
//                     type: 'input',
//                     name: 'manager',
//                     message: `What is the manager role id?`,
//                 },
//             ])
//     }
// }

// // view functions
// function viewCategory() {
//     return inquirer.prompt([
//         {
//             type: 'list',
//             name: 'view',
//             message: 'What category do you want to view',
//             choices: ['DEPARTMENT', 'ROLE', 'EMPLOYEE']
//         }
//     ])
// }

// // update employee role or manager
// function choseUpdate() {
//     return inquirer.prompt([
//         {
//             type: 'list',
//             name: 'to_update',
//             message: 'What category do you want to view',
//             choices: ['ROLE', 'MANAGER']
//         }
//     ])
// }

// // exit
// function exit() {
//     console.log("Thank you for your input")

//     connection.end()
// }

// // start
// async function start() {
//     try {
//         const res = await initialChoice()

//         const category = res.confirm
//         // console.log(category)

//         if (category === "EXIT") {
//             exit()
//         } else if (category === "ADD") {
//             addAction(category)
//         } else if (category === "VIEW") {
//             viewAction(category)
//         } else if (category === "UPDATE") {
//             updateEmpoyee()
//         }
//     }

//     catch (err) {
//         console.log(err)
//     }
// }

// // ADD
// // ==============================================
// // add actions
// async function addAction(category) {
//     try {
//         const res = await addCategory()
//         const userChoice = res.category
//         // console.log("---------", userChoice)

//         addInfo(userChoice)
//     }

//     catch (err) {
//         console.log(err)
//     }
// }
// // add info
// async function addInfo(userChoice) {
//     try {
//         const res = await userContent(userChoice)

//         const category = userChoice
//         console.log(category)

//         switch (category) {
//             case 'DEPARTMENT':
//                 connection.query(`INSERT INTO ${category} SET ?`,
//                     {
//                         name: res.text,
//                     }
//                 )
//                 break;
//             case 'ROLE':
//                 connection.query(`INSERT INTO ${category} SET ?`,
//                     {
//                         title: res.title,
//                         salary: res.salary,
//                         department_id: parseInt(res.department)
//                     }
//                 )
//                 break;
//             case 'EMPLOYEE':
//                 connection.query(`INSERT INTO ${category} SET ?`,
//                     {
//                         first_name: res.first_name,
//                         last_name: res.last_name,
//                         role_id: parseInt(res.role),
//                         manager_id: parseInt(res.manager)
//                     }
//                 )
//                 break;
//         }
//     }

//     catch (err) {
//         console.log(err)
//     }

//     start()
// }

// // VIEW
// // ==============================================
// // view actions
// async function viewAction(category) {
//     try {
//         const res = await viewCategory()
//         const userChoice = res.view
//         // console.log("---------", userChoice)

//         viewInfo(userChoice)
//     }

//     catch (err) {
//         console.log(err)
//     }
// }
// // view infos
// function viewInfo(userChoice) {

//     const sql = `SELECT * FROM ${userChoice}`

//     connection.query(sql, function (err, result) {
//         if (err) throw err

//         console.table("\n", result)
//     })

//     start()

// }

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




