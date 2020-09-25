DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department(
    id INTEGER AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role(
    id INTEGER AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NULL,
    salary DECIMAL (10, 2) NULL,
    department_id INTEGER NOT NULL, 
    PRIMARY KEY (id)
);

CREATE TABLE employee(
    id INTEGER AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR (30) NULL,
    role_id INTEGER NULL,
    manager_id INTEGER DEFAULT NULL, 
    PRIMARY KEY (id)
);

CREATE TABLE manager(
    id INTEGER AUTO_INCREMENT NOT NULL,
    manager_name VARCHAR(30) NULL,
    PRIMARY KEY (id)
);


