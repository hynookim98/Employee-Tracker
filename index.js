const { prompt } = require('inquirer');
const db = require('./db');

// main loading screen with questions for user
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

// view all departments
function viewDepartments() {
    db.viewAllDepartments() 
        .then(([data]) => {
            // store data inside variable
            let departments = data;
            // console log statement to print new line for formatting display
            console.log("\n");
            console.log(departments);
        })
        // after finishing function return to main question for diff input 
        .then(() => loadQuestions());
};

// view all roles
function viewRoles() {
    db.viewAllRoles()
        .then(([data]) => {
            console.log('\n');
            // ? console.log or table?
            console.table(data);
        })
        .then(() => loadQuestions());
};

// view all employees
function viewEmployees() {
    db.viewAllEmployees()
        .then(([data]) => {
            console.log("\n");
            console.table(data);
        })
        .then(() => loadQuestions());
};

// add a department
function addDepartment() {
    prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ])
    .then(res => {
        let department = res;
        // call a function to create the department passing it the name as a parameter
        db.createDepartment(department)
            .then(() => console.log(`✅ Added ${department.name} to the database`))
            .then(() => loadQuestions())
    });
};

// add a role 
function addRole() {
    // this will grab all the current departments so when the user creates a new ROLE they can add it to an pre-existing department
    db.viewAllDepartments()
        .then(([data]) => {
            // map function creates new array after running a function through each item
            const currentDepartments = data.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt([
                {
                    name: "role_name",
                    message: "What is the name of the new role?"
                },
                {
                    name: "salary",
                    message: "What is the salary for the new role?"
                },
                {
                    type: 'list',
                    name: 'department_id',
                    message: `Which department does ${this.role_name} belong to?`,
                    choices: currentDepartments
                }
            ])
                .then(role => {
                    db.createRole(role)
                        .then(() => console.log(`✅ Added ${role.role_name} to the database`))
                        .then(() => loadQuestions())
                });
        });
};

// add an employee
function addEmployee() {
    prompt([
        {
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            message: "What is the employee's last name?"
        }
    ])
    .then(res => {
        let fname = res.first_name;
        let lname = res.last_name;

        db.viewAllRoles()
            .then(([data]) => {
                const currentRoles = data.map(({ id, title }) => ({
                    name: title,
                    value: id
                }));

                prompt({
                    type: "list",
                    name: "roleId",
                    message: "What is the employee's role?",
                    choices: currentRoles
                })
                .then(res => {
                    let roleId = res.roleId;
                    
                    db.findAllEmployees()
                        .then(([data]) => {
                        const currentEmployees = data.map(({ id, first_name, last_name }) => ({
                            name: `${first_name} ${last_name}`,
                            value: id
                        }));

                        // create an option in case employee does not have manager
                        currentEmployees.unshift({ name: "None", value: null });

                        prompt({
                            type: "list",
                            name: "managerId",
                            message: "Who is the employee's manager?",
                            choices: currentEmployees
                        })
                            .then(res => {
                                // store response
                            let employee = {
                                manager_id: res.managerId,
                                role_id: roleId,
                                first_name: firstName,
                                last_name: lastName
                            }

                            db.createEmployee(employee);
                            })
                            .then(() => console.log(`✅Added ${firstName} ${lastName} to the database`))
                            .then(() => loadQuestions())
                        })
                })
            })
    })
};

// initialize program
loadQuestions();