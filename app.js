// import libraries
import express from "express";
import colors from "colors";
import mariadb from "mariadb";
import { validateForm } from "./services/validation.js";
import dotenv from "dotenv";

dotenv.config();

// define database credentials
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// define function to connect to the DB
async function connect() {
  try {
    const conn = await pool.getConnection();
    return conn;
  } catch (err) {
    console.log(`Error connecting to the database: ${err}`);
  }
}

// instantiate an express application
const app = express();

// define a port number for our server to listen on
const PORT = process.env.APP_PORT || 3000;

// middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// set the view engine
app.set("view engine", "ejs");

// serve static files from the 'public' directory
app.use(express.static("public"));

// default route for our home page, tasks are sorted by due date & priority
app.get("/", async (req, res) => {
  try {
    const conn = await connect();

    // instantiate taskList from query, taskList ordered by due date (ascending) and priority (High(1) > Medium(2) > Low(3))
    const taskList = await conn.query(`SELECT * FROM tasks WHERE view = 1
      ORDER BY dueDate ASC, 
      CASE priority 
        WHEN 'High' THEN 1
        WHEN 'Medium' THEN 2
        WHEN 'Low' THEN 3
      END ASC
    `);

    // release connection
    conn.end();
    res.render("home", { taskList });
  } catch (error) {
    console.error("Database query error:", error);

    res.status(500).send("An error occurred while fetching tasks.");
  }
});

// define addTask route
app.get("/addTask", (req, res) => {
  res.render("addtask");
});

// define createTask route insert form fields into database
app.post("/createTask", async (req, res) => {
  try {
    // create new task object
    const task = {
      title: req.body.title,
      dueDate: req.body.dueDate,
      location: req.body.location,
      description: req.body.description,
      priority: req.body.priority,
      type: req.body.type,
    };

    // Need to determine form validation requirements if any and add them into the validateForm funtion in validate.js file)
    /*
  const result = validateForm(task);
  if (!result.isValid) {
    console.log(result.errors);
    res.send(result.errors);
    return;
  }
    */

    // connect to the database
    const conn = await connect();

    // add the task to the database
    await conn.query(
      `INSERT INTO tasks (title, dueDate, location, description, priority, type, view) 
    VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [
        task.title,
        task.dueDate,
        task.location,
        task.description,
        task.priority,
        task.type,
      ]
    );

    // release connection
    conn.end();
    res.redirect("/");
  } catch (error) {
    console.error("Database query error:", error);
    if (conn) {
      conn.end();
    }
    res.status(500).send("An error occurred while fetching tasks.");
  }
});

// define editTask get route to populate edit task form with data from database
app.get("/editTask/:taskId", async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId, 10);
    const conn = await connect();
    const task = await conn.query(`SELECT * FROM tasks WHERE taskId = ?`, [
      taskId,
    ]);

    // fix due dat e format error between mariaDB and js
    task[0].dueDate = task[0].dueDate.toISOString().split("T")[0];

    // release connection
    conn.end();
    res.render("editTask", { task: task[0] });
  } catch (error) {
    console.error("Database query error:", error);
    if (conn) {
      conn.end();
    }
    res.status(500).send("An error occurred while fetching tasks.");
  }
});

// define viewTask route to view specific task details
app.get("/viewTask/:taskId", async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId, 10);
    const conn = await connect();
    const task = await conn.query(`SELECT * FROM tasks WHERE taskId = ?`, [
      taskId,
    ]);

    // release connection
    conn.end();
    res.render("viewTask", { task: task[0] });
  } catch (error) {
    console.error("Database query error:", error);
    if (conn) {
      conn.end();
    }
    res.status(500).send("An error occurred while fetching tasks.");
  }
});

// define updateTask post route to update database with editTask form data
app.post("/updateTask/:taskId", async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId, 10);
    const conn = await connect();
    console.log(req.body);
    //checks if the user clicked update or delete
    //need validation on this so spoofing cant exist
    if (req.body?.PUT == 1) {
      console.log("Update");
      // set view to false if status is completed
      const viewValue = req.body.status === "Completed" ? false : true;

      await conn.query(
        `UPDATE tasks SET title=?, dueDate=?, location=?, description=?, priority=?, type=?, status=?, view=? WHERE taskId=?`,
        [
          req.body.title,
          req.body.dueDate,
          req.body.location,
          req.body.description,
          req.body.priority,
          req.body.type,
          req.body.status,
          viewValue,
          taskId,
        ]
      );
    } else if (req.body.DELETE == 1) {
      console.log("Delete");
      await conn.query(`UPDATE tasks SET view = ? WHERE taskId = ?`, [
        0,
        taskId,
      ]);
      //route to home
      conn.end();
      res.redirect(`/`);
      return;
    }

    // release connection
    conn.end();
    res.redirect(`/viewTask/${taskId}`);
  } catch (error) {
    console.error("Database query error:", error);
    if (conn) {
      conn.end();
    }
    res.status(500).send("An error occurred while fetching tasks.");
  }
});

// tell the server to listen on our specified port
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
