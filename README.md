# Task Manager

## Overview
The **Task Manager** is a web-based application designed to help users organize and track their tasks effectively. It allows users to create, view, update, and remove tasks while ensuring that priorities and due dates are managed efficiently.


## Features
- **Home Page:** Displays a list of tasks sorted by due date and priority.
- **Add Task:** Users can enter new tasks with details such as title, due date, location, description, priority, and type.
- **Edit Task:** Existing tasks can be modified, including updates to their title, description, priority, type, and status (Not Started, In Progress, Completed).
- **Delete Task:** Users can remove completed or unnecessary tasks from the system.
- **Task Validation:** Ensures required fields are filled, due dates are valid, and priority/status selections are correct.
- **Error Handling:** Displays user-friendly messages when validation fails.
- **Database Integration:** Uses **MariaDB** for persistent task storage.


## Usage
-Click "Add Task" to create a new task.
-Click on a task title to view its details.
-Use history option to view a list of all previously completed tasks. 
-Use the edit option to update task information.
-Mark tasks as completed or delete them when no longer needed.


## Technologies Used
-Node.js & Express.js (Server-side framework)
-EJS (Templating engine)
-Bootstrap Icons (UI Enhancements)
-JavaScript, HTML, CSS (Frontend development)
-MariaDB (Database)


## Authors 
@Bolshialex
- Designed the overall application layout and optimized the user interaction flow.
- Styled and structured all user interface components using CSS.
- Optimized backend routes and logic to improve performance and maintainability.
- Designed and implemented the database schema, ensuring efficient data organization and retrieval.
- Developed client-side form validation to enhance data integrity and user experience.

@mlarsen-source
- Engineered the backend framework and routing.
- Developed server-side logic to handle task management operations.
- Configured and optimized MariaDB database connections and queries for performance and reliability.
- Implemented task filtering by priority, due date, and status, enhancing task organization and usability.
- Designed and integrated server-side form validation to enforce data accuracy and security.

