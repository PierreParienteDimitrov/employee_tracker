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

//=====================================================
// app
//=====================================================
function initialChoice() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'confirm',
            message: 'Do you want to add, view or update information?',
            choices: ['ADD', 'VIEW', 'UPDATE', 'EXIT']
        }
    ])
}

// add category
function addCategory() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'category',
            message: 'Do you want to add departments, roles or employees?',
            choices: ['DEPARTMENT', 'ROLE', 'EMPLOYEE']
        }
    ])
}

// user inputs
function userContent(category) {

    switch (category) {
        case 'DEPARTMENT':
            return inquirer.prompt([
                {
                    type: 'input',
                    name: 'text',
                    message: `What ${category} do you want to add?`,
                }
            ])

        case 'ROLE':
            return inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: `What ${category} do you want to add?`,
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: `What salary for this role?`,
                },
                {
                    type: 'input',
                    name: 'department',
                    message: `What is the department id number for this role?`,

                }
            ])

        case 'EMPLOYEE':
            return inquirer.prompt([
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
                    type: 'input',
                    name: 'role',
                    message: `What is the employee role id?`
                },
                {
                    type: 'input',
                    name: 'manager',
                    message: `What is the manager role id?`,
                },
            ])
    }
}

// view functions
function viewCategory() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'view',
            message: 'What category do you want to view',
            choices: ['DEPARTMENT', 'ROLE', 'EMPLOYEE']
        }
    ])
}

// update employee role or manager
function choseUpdate() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'to_update',
            message: 'What category do you want to view',
            choices: ['ROLE', 'MANAGER']
        }
    ])
}

// exit
function exit() {
    console.log("Thank you for your input")

    connection.end()
}

// start
async function start() {
    try {
        const res = await initialChoice()

        const category = res.confirm
        // console.log(category)

        if (category === "EXIT") {
            exit()
        } else if (category === "ADD") {
            addAction(category)
        } else if (category === "VIEW") {
            viewAction(category)
        } else if (category === "UPDATE") {
            updateEmpoyee()
        }
    }

    catch (err) {
        console.log(err)
    }
}

// ADD
// ==============================================
// add actions
async function addAction(category) {
    try {
        const res = await addCategory()
        const userChoice = res.category
        // console.log("---------", userChoice)

        addInfo(userChoice)
    }

    catch (err) {
        console.log(err)
    }
}
// add info
async function addInfo(userChoice) {
    try {
        const res = await userContent(userChoice)

        const category = userChoice
        console.log(category)

        switch (category) {
            case 'DEPARTMENT':
                connection.query(`INSERT INTO ${category} SET ?`,
                    {
                        name: res.text,
                    }
                )
                break;
            case 'ROLE':
                connection.query(`INSERT INTO ${category} SET ?`,
                    {
                        title: res.title,
                        salary: res.salary,
                        department_id: parseInt(res.department)
                    }
                )
                break;
            case 'EMPLOYEE':
                connection.query(`INSERT INTO ${category} SET ?`,
                    {
                        first_name: res.first_name,
                        last_name: res.last_name,
                        role_id: parseInt(res.role),
                        manager_id: parseInt(res.manager)
                    }
                )
                break;
        }
    }

    catch (err) {
        console.log(err)
    }

    start()
}

// VIEW
// ==============================================
// view actions
async function viewAction(category) {
    try {
        const res = await viewCategory()
        const userChoice = res.view
        // console.log("---------", userChoice)

        viewInfo(userChoice)
    }

    catch (err) {
        console.log(err)
    }
}
// view infos
function viewInfo(userChoice) {

    const sql = `SELECT * FROM ${userChoice}`

    connection.query(sql, function (err, result) {
        if (err) throw err

        console.table("\n", result)
    })

    start()

}

// UPDATE
// ==============================================
async function updateEmpoyee() {

    try {

        const res = await choseUpdate()
        const toUpdate = res.to_update

        connection.query(
            "SELECT * FROM employee",
            function (err, res) {
                if (err) throw err

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Select the employee to update',
                        choices: function () {
                            const arr = []
                            res.forEach((el) => arr.push(el.id + " " + el.first_name))
                            console.log(arr)
                            return arr
                        }
                    },
                    {
                        type: 'input',
                        name: 'updated',
                        message: `Enter the new ${toUpdate} for this employee`,
                        validate: function (value) {
                            if (isNaN(value) === false) {
                                return true
                            }
                            return false;
                        }

                    }
                ]).then(function (data) {

                    const chosen = data.employee.split(' ')
                    const choseId = parseInt(chosen[0])
                    const updated = parseInt(data.updated)

                    // console.log(choseId)
                    // console.log(typeof (choseId))
                    // console.log(newRole)

                    const sql = "UPDATE employee SET ? WHERE ?"

                    if (toUpdate === 'ROLE') {
                        connection.query(sql, [{ role_id: updated }, { id: choseId }], function (err, res) {
                            if (err) throw err
                            console.table(res)
                        })
                    } else if (toUpdate === 'MANAGER') {
                        connection.query(sql, [{ manager_id: updated }, { id: choseId }], function (err, res) {
                            if (err) throw err
                            console.table(res)
                        })
                    }
                    start()
                })
            }
        )



    }

    catch (err) {
        console.log(err)
    }


}




