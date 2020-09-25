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

function choseCategory() {
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
    return inquirer.prompt([
        {
            type: 'input',
            name: 'text',
            message: `What ${category} do you want to add?`,
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

        switch (res.confirm) {
            case 'ADD':
                addInfo()
                break;
            case 'VIEW':
                viewInfo()
                break;
            case 'UPDATE':
                udpateInfo()
                break;
            case 'EXIT':
                exit()
                break;
        }

    }

    catch (err) {
        console.log(err)
    }
}

async function addInfo() {
    try {
        const res = await choseCategory()
        const userChoice = res.category

        addingInfo(userChoice)
    }

    catch (err) {
        console.log(err)
    }
}

async function addingInfo(userChoice) {
    try {
        const res = await userContent(userChoice)

        const userInput = res.text

        console.log(userInput)

        connection.query(`INSERT INTO ${userChoice} SET ?`,
            {
                name: userInput,
            }
        )
    }

    catch (err) {
        console.log(err)
    }

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


