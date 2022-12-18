USE employees_db;

INSERT INTO department (name) 
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');

INSERT INTO role (title, salary, department_id) 
VALUES ('Sales Lead', 100000, 1),
       ('Salesperson', 80000, 1),
       ('Lead Engineer', 150000, 2),
       ('Software Engineer', 120000, 2),
       ('Finance Manager', 160000, 3),
       ('Accountant', 125000, 3),
       ('Legal Team Lead', 250000, 4),
       ('Lawyer', 500000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('Barry','Allen', 1, NULL),
       ('John','Doe', 2, NULL),
       ('Jane','Smith', 3, 2),
       ('Harry','Potter', 4, 1),
       ('Karen','Leksli', 5, NULL),
       ('Danny','Phantom', 6, 1),
       ('George','Ape', 7, NULL),
       ('Stella','Artois', 8, NULL);