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
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completedDate DATE
);

INSERT INTO tasks (title, dueDate, location, description, priority, type) 
VALUES
('Complete Final Project', '2025-03-20', 'Seattle', 'Complete Final Project for Software Development Class', 'High', 'School'),
('Register for Classes', '2025-05-01', 'Auburn', 'Register for Summer and Fall Quarter Classes', 'High', 'School'),
('Apply for Internships', '2025-04-30', 'Auburn', 'Submit Applications for Summer Internship', 'Medium', 'School'),
('Doctor Appointment', '2025-03-22', 'Federal Way', 'Annual Wellness Exam', 'Medium', 'Health'),
('Pay Electricity Bill', '2025-04-01', 'Kent', 'Pay the Monthly Electricity Bill', 'Medium', 'Financial'),
('Fix Broken Sink', '2025-04-15', 'Federal Way', 'Fix the Leaking Bathroom Sink', 'Low', 'General'),
('Attend Conference', '2025-05-15', 'Seattle', 'Attend the Annual Tech Industry Conference', 'Medium', 'Work'),
('Spring Break Trip', '2025-03-24', 'Hawaii', 'Spring Break Vacation', 'Low', 'Personal');

INSERT INTO tasks (title, dueDate, location, description, priority, type, status, view, completedDate ) 
VALUES 
('Clean Garage', '2025-03-01', 'Federal Way', 'Clean and Organize the Garage', 'Low', 'General', 'Completed', false, '2025-03-05'),
('Get Oil Changed', '2025-03-15', 'Kent', 'Take Car to Mechanic to Change Oil ', 'Medium', 'General', 'Completed', false, '2025-03-10'),
('Dental Exam', '2025-02-25', 'Renton', 'Routine Dental Exam', 'Medium', 'Health', 'Completed', false, '2025-02-26'),
('Micro Internship', '2025-03-14', 'Auburn', 'Complete Code Day Labs Micro Internship', 'High', 'School', 'Completed', false, '2025-03-14'),
('File Tax Return', '2025-03-09', 'Federal Way', 'File 2024 Federal Income Tax Return', 'High', 'Financial', 'Completed', false, '2025-02-15'),
('Grocery Shopping', '2025-03-28', 'Kent', 'Weekly Grocery Shopping', 'Low', 'General', 'Completed', false, '2025-03-10'),
('Performance Review', '2025-03-05', 'Seattle', 'Conduct Annual Performance Review', 'High', 'Work', 'Completed', false, '2025-03-05'),
('Pay Phone Bill', '2025-03-01', 'Federal Way', 'Pay the Monthly Cell Phone Bill', 'Medium', 'Financial', 'Completed', false, '2025-03-02');

SELECT * FROM tasks;