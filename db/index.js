const connection = require('./connection');

// create a database class with functions for connection.js to use
class dataBase {
    constructor(connection) {
        this.connection = connection;
    }

    viewAllDepartments() {
        // mysql query to select all departments
        return this.connection.promise().query(
            "SELECT department.id, department.name FROM department;"
        );
    };

    viewAllRoles() {
        // query to select all roles and join role's salary with department id
        return this.connection.promise().query(
            "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
        );
    };

    viewAllEmployees() {
        // query to select all employees and join with their roles, departments, managers, and salaries to display all together
        return this.connection.promise().query( 
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
        );
    };

    createDepartment(department) {
        // query to update department table with new department
        return this.connection.promise().query(
            "INSERT INTO department SET ?", department
        );
    };

    createRole(role) {
        // query to update roles table with new role
        return this.connection.promise().query(
            "INSERT INTO role SET ?", role
        );
    };

    createEmployee(newHire) {
        return this.connection.promise().query(
            "INSERT INTO employee SET ?", newHire
        );
    };

    updateEmployeeRole(employeeId, roleId) {
        return this.connection.promise().query(
            "UPDATE employee SET role_id = > WHERE id = ?", [roleId, employeeId]
        );
    };

    findPossibleManagers(employeeId) {
        // find all possible managers which is all the employees minus the one we are updating
        return this.connection.promise().query(
            "SELECT id, first_name, last_name FROM employee WHERE id != ?", employeeId
        );
    };

    updateEmployeeManager(employeeId, managerId) {
        return this.connection.promise().query(
            "UPDATE employee SET manager_id = ? WHERE id = ?", [managerId, employeeId]
        );
    };
}

module.exports = new dataBase(connection);