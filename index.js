const { prompt } = require('inquirer');
const db = require('./db');
require("console.table");

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
                    name: "Update an Employee's Manager",
                    value: "UPDATE_EMPLOYEE_MANAGER"
                },
                {
                    name: "View Employees by Manager",
                    value: "VIEW_EMPLOYEES_BY_MANAGER"
                },
                {
                    name: "View Employees by Department",
                    value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
                },
                {
                    name: "Delete a Department",
                    value: "DELETE_DEPARTMENT"
                },
                {
                    name: "Delete a Role",
                    value: "DELETE_ROLE"
                },
                {
                    name: "Delete an Employee",
                    value: "DELETE_EMPLOYEE"
                },
                {
                    name: "View Total Utilized Department Budget",
                    value: "VIEW_TOTAL_BUDGET"
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
            case "UPDATE_EMPLOYEE_MANAGER" : updateEmployeeManager();
            break;
            case "VIEW_EMPLOYEES_BY_MANAGER" : viewEmployeeManager();
            break;
            case "VIEW_EMPLOYEES_BY_DEPARTMENT" : viewEmployeeDepartment();
            break;
            case "DELETE_DEPARTMENT" : deleteDepartment();
            break;
            case "DELETE_ROLE" : deleteRole();
            break;
            case "DELETE_EMPLOYEE" : deleteEmployee();
            break;
            case "VIEW_TOTAL_BUDGET" : viewTotalBudget();
            break;
            case "QUIT" : quit();
            break;
            default: console.error("Unexpected User Choice");
            break;
        }
    })
};

// view all departments
function viewDepartments() {
    db.viewAllDepartments() 
        .then(([data]) => {
            // store data inside variable
            let departments = data;
            // console log statement to print new line for formatting display
            console.log("\n");
            console.table(departments);
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
            .then(() => console.log(`✅ Successfully Added ${department.name} to the database`))
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
                        .then(() => console.log(`✅ Successfully Added ${role.role_name} to the database`))
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
                            .then(() => console.log(`✅ Successfully Added ${firstName} ${lastName} to the database`))
                            .then(() => loadQuestions())
                        })
                })
            })
    })
};

// update employee's role
function updateEmployeeRole() {
    // grab all current employees to se who to update
    db.findAllEmployees()
    .then(([data]) => {
      const currentEmployees = data.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

      prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee's role do you want to update?",
          choices: currentEmployees
        }
      ])
        .then(res => {
          let employeeId = res.employeeId;
        //   grab all current roles to assign to employee
          db.findAllRoles()
            .then(([data]) => {
              const currentRoles = data.map(({ id, title }) => ({
                name: title,
                value: id
              }));

              prompt([
                {
                  type: "list",
                  name: "roleId",
                  message: "Which role do you want to assign the selected employee?",
                  choices: currentRoles
                }
              ])
                .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                .then(() => console.log("✅ Successfully updated employee's role"))
                .then(() => loadQuestions())
            });
        });
    })
};

// *update employee manager *bonus
function updateEmployeeManager() {
    db.viewAllEmployees()
        .then(([data]) => {
            const currentEmployees = data.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
            }));

            prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "Which employee's manager would you like to update?",
                    choices: currentEmployees
                }
            ])
            .then(res => {
                let employeeId = res.employeeId
                // possible managers are any employees
                db.findPossibleManagers(employeeId)
                    .then(([data]) => {
                        const possibleManagers = data.map(({ id, first_name, last_name }) => ({
                            name: `${first_name} ${last_name}`,
                            value: id
                        }));

                        prompt([
                            {
                                type: "list",
                                name: "managerId",
                                message: "Which employee would you like to manage the selected employee?",
                                choices: possibleManagers
                            }
                        ])
                        .then(res => db.updateEmployeeManager(employeeId, res.managerId))
                        .then(() => console.log("✅ Successfully updated employee's manager"))
                        .then(() => loadQuestions())
                    })
            })
        })
};

// *view employees by manager *bonus
function viewEmployeeManager() {
    db.viewAllEmployees()
        .then(([data]) => {
            const currentManagers = data.map(({ id, first_name, last_name}) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([
                {
                    type: 'list',
                    name: 'managerId',
                    message: 'Which manager do you want see who is working under them?',
                    choices: currentManagers
                }
            ])
            .then(res => db.findEmployeesByManager(res.managerId))
            .then (([data]) => {
                console.log("\n");
                if(data.length === 0) {
                    console.log("The selected employee is not a manager and does not have anyone working under them");
                } else {
                    console.table(data);
                }
            })
            .then(() => loadQuestions())
        })
};

// *view employees by department *bonus
function viewEmployeeDepartment() {
    db.viewAllDepartments()
      .then(([data]) => {
        const currentDepartments = data.map(({ id, name }) => ({
            name: name,
            value: id
        }));

        prompt([
            {
                type: "list",
                name: "departmentId",
                message: "Which department would you like to see?",
                choices: currentDepartments
            }
        ])
        .then(res => db.findEmployeesByDepartment(res.departmentId))
        .then(([data]) => {
            console.log("\n");
            console.table(data);
        })
        .then(() => loadQuestions())
      });
};

// delete departments
function deleteDepartment() {
    db.viewAllDepartments()
    .then(([data]) => {
        const departmentChoices = data.map(({ id, name }) => ({
          name: name,
          value: id
        }));
  
        prompt({
          type: "list",
          name: "departmentId",
          message: "Which department would you like to delete? (Note: This will also remove associated roles and employees)",
          choices: departmentChoices
        })
          .then(res => db.removeDepartment(res.departmentId))
          .then(() => console.log(`✅ Successfully removed department from the database`))
          .then(() => loadQuestions())
      })
};

// delete roles
function deleteRole() {
    db.viewAllRoles()
    .then(([data]) => {
      const currentRoles = data.map(({ id, title }) => ({
        name: title,
        value: id
      }));

      prompt([
        {
          type: "list",
          name: "roleId",
          message: "Which role do you want to remove? (Note: This will also remove associated employees)",
          choices: currentRoles
        }
      ])
        .then(res => db.removeRole(res.roleId))
        .then(() => console.log("✅ Successfully removed role from the database"))
        .then(() => loadQuestions())
    })
};

// delete employees
function deleteEmployee() {
    db.viewAllEmployees()
    .then(([data]) => {
      const currentEmployees = data.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

      prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee do you want to remove?",
          choices: currentEmployees
        }
      ])
        .then(res => db.removeEmployee(res.employeeId))
        .then(() => console.log("✅ Successfully removed employee from the database"))
        .then(() => loadMainPrompts())
    })
};

// view total utilized budget
function viewTotalBudget() {
    db.viewDepartmentBudgets()
      .then(([data]) => {
        console.log("\n");
        console.table(data);
      })
      .then(() => loadQuestions());
};

// end program
function quit() {
    console.log("Thank you for using my program!")
    // quit current process
    process.exit();
};

// initialize program
loadQuestions();