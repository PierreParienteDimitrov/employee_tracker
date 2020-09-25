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

// add functions
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
                // {
                //     type: 'list',
                //     name: 'department',
                //     message: `What is the department id number for this role?`,
                //     choices: connection.query("SELECT * FROM department", function (err, result) {
                //         if (err) err

                //         const arr = []
                //         result.forEach(el => arr.push(el.id + " " + el.name))
                //         return arr
                //     })
                // }
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

function exit() {
    console.log("Thank you for your input")

    connection.end()
}


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
            updateAction(category)
        }

    }

    catch (err) {
        console.log(err)
    }
}

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

function viewInfo(userChoice) {

    const sql = `SELECT * FROM ${userChoice}`

    connection.query(sql, function (err, result) {
        if (err) throw err

        console.table("\n", result)
    })

    start()

}




// async function addDept(userChoice) {
//     try {
//         const res = await addingDept()

//         const userChoice = res.department

//         connection.query('INSERT INTO department SET ?',
//             {
//                 name: userChoice,
//             }
//         )
//     }

//     catch (err) {
//         console.log(err)
//     }

//     start()
// }


