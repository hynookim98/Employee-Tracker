const { prompt } = require('inquirer');

function loadQuestions() {
    prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                {
                    name: "View All Departments",
                    value: "VIEW_ALL_DEPARTMENTS"
                },
                {
                    name: "View All Roles",
                    value: "VIEW_ALL_ROLES"
                },
                {
                    name: "View All Employees",
                    value: "VIEW_ALL_EMPLOYEES"
                },
                {
                    name: "Add A Department",
                    value: "ADD_DEPARTMENT"
                },
                {
                    name: "Add A Role",
                    value: "ADD_ROLE"
                },
                {
                    name: "Add An Employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "Update An Employee Role",
                    value: "UPDATE_EMPLOYEE_ROLE"
                },
                {
                    name: 'Quit Program',
                    value: "QUIT"
                }
            ]
        }
    ]).then(res => {
        // storing user input inside variable userChoice
        let userChoice = res.choice;
        // using switch case as conditional statement to run a certain function depending on the users' choice
        switch(userChoice) {
            case "VIEW_ALL_DEPARTMENTS" : viewDepartments();
            break;
            case "VIEW_ALL_ROLES" : viewRoles();
            break;
            case "VIEW_ALL_EMPLOYEES" : viewEmployees();
            break;
            case "ADD_DEPARTMENT" : addDepartment();
            break;
            case "ADD_ROLE" : addRole();
            break;
            case "ADD_EMPLOYEE" : addEmployee();
            break;
            case "UPDATE_EMPLOYEE_ROLE" : updateEmployeeRole();
            break;
            case "QUIT" : quit();
            break;
            default: console.error("Unexpected User Choice");
            break;
        };
    });
};



// initialize program
loadQuestions();