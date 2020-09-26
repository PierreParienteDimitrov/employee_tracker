INSERT INTO department (department_name)
VALUES('IT'), ('HR'), ('Marketing');

INSERT INTO role (title, salary, department_id)
VALUES('Lead Engineer', 120000, 1), ('HR Director', 120000, 2), ('Marketing Director', 120000, 3), ('Engineer', 100000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES('John', 'Doe', 1, 1), ('Mike', 'Chan', 2, 2), ('Ashley', 'Rodriguez', 3, 3), ('Tom', 'Allen', 4, 1);

INSERT INTO manager (manager_name)
VALUES('John Doe'), ('Mike Chan'), ('Ashley Rodriguez');


SELECT employee.first_name, employee.last_name, role.title, role.salary, department.department_name, manager.manager_name
FROM employee
INNER JOIN role ON employee.role_id = role.id
INNER JOIN department ON role.department_id = department.id
INNER JOIN manager ON employee.manager_id = manager.id;

SELECT employee.first_name, employee.last_name, employee.role_id, role.department_id, department.department_name
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
WHERE department.department_name = "IT";