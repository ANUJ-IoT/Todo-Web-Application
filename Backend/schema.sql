CREATE DATABASE IF NOT EXISTS todo_app;

USE todo_app;

-- User Table
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    pass VARCHAR(255) NOT NULL
);

-- Notes Table
CREATE TABLE notes (
    noteId INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    detail TEXT,
    id INT NOT NULL,
    cat ENUM('short', 'long') NOT NULL,

    FOREIGN KEY (id) REFERENCES user(id)
        ON DELETE CASCADE
);

-- Master Notes Table
CREATE TABLE master_notes (
    noteId INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    detail TEXT,
    id INT NOT NULL,
    cat ENUM('short', 'long') NOT NULL,

    FOREIGN KEY (id) REFERENCES user(id)
        ON DELETE CASCADE
);