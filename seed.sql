INSERT INTO department (name)
VALUES('IT'), ('HR'), ('Marketing');

INSERT INTO role (title, salary, department_id)
VALUES('Engineer', 100, 1), ('HR Director', 80, 2), ('Marketing Officer', 100, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES('bob', 'woodwrd', 1, 2), ('mark', 'hamill', 2, 0), ('henri', 'salvador', 2, 1);