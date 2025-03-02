CREATE SCHEMA task_manager;

USE task_manager;

DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
    taskId INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    dueDate DATE,
    location VARCHAR(255),
    description TEXT,
    priority ENUM('Low', 'Medium', 'High'),
    type ENUM('Work', 'School', 'Personal', 'Financial', 'Health', 'Travel', 'General'),
    status ENUM('Not Started', 'In Progress', 'Completed', 'On Hold') DEFAULT 'Not Started',
    view BOOLEAN DEFAULT TRUE,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, dueDate, location, description, priority, type)
VALUES ('Test Task', '2025-02-27', 'Auburn', 'This is a test', 'Medium', 'General')
