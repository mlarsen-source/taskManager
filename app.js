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
      END ASC`);

    conn.release();
    res.render("home", { taskList });
  } catch (error) {
    console.error("Database query error:", error);
    conn.release();
    res.status(500).send("An error occurred while fetching tasks.");
  }
});

// define completed task history route
app.get("/history", async (req, res) => {
  try {
    const conn = await connect();

    // retrieve completed tasks, sorted by completion date (most recently completed first)
    const completedList = await conn.query(
      `SELECT * FROM tasks WHERE view = 0 ORDER BY completedDate DESC`
    );

    conn.release();
    res.render("history", { completedList });
  } catch (error) {
    console.error("Database query error:", error);
    conn.release();
    res.status(500).send("An error occurred while fetching tasks.");
  }
});

// define addTask route
app.get("/addTask", (req, res) => {
  res.render("addTask");
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

    //server side validation
    const result = validateForm(task);
    if (!result.isValid) {
      console.log(result.errors);
      const errorList = result.errors;
      res.render("error", { errorList });
      return;
    }

    // connect to the database
    const conn = await connect();

    // add the task to the database
    await conn.query(
      `INSERT INTO tasks (title, dueDate, location, description, priority, type) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        task.title,
        task.dueDate,
        task.location,
        task.description,
        task.priority,
        task.type,
      ]
    );

    conn.release();
    res.redirect("/");
  } catch (error) {
    console.error("Database query error:", error);
    conn.release();
    res.status(500).send("An error occurred while creating task.");
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

    conn.release();
    res.render("editTask", { task: task[0] });
  } catch (error) {
    console.error("Database query error:", error);
    conn.release();
    res.status(500).send("An error occurred while fetching task.");
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

    conn.release();
    res.render("viewTask", { task: task[0] });
  } catch (error) {
    console.error("Database query error:", error);
    conn.release();
    res.status(500).send("An error occurred while fetching tasks.");
  }
});

// define updateTask post route to update database with editTask form data
app.post("/updateTask/:taskId", async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId, 10);
    const conn = await connect();

    // If delete button is used, skip form validation and remove the task from the database
    if (req.body.DELETE == 1) {
      console.log("Deleting Task ID:", taskId);
      await conn.query(`DELETE FROM tasks WHERE taskId = ?`, [taskId]);
      conn.release();
      return res.redirect("/");
    }

    // If update button used, validate the form and then update the database
    const task = {
      title: req.body.title,
      dueDate: req.body.dueDate,
      location: req.body.location,
      description: req.body.description,
      priority: req.body.priority,
      type: req.body.type,
      status: req.body.status,
    };

    //server side validation
    const result = validateForm(task);
    if (!result.isValid) {
      console.log(result.errors);
      const errorList = result.errors;
      res.render("error", { errorList });
      return;
    }

    // set view to false if status is completed
    const viewValue = req.body.status === "Completed" ? false : true;

    // set completedDate to the current timestamp only when status is changed to "Completed"
    const completedDate = req.body.status === "Completed" ? new Date() : null;

    await conn.query(
      `UPDATE tasks SET title=?, dueDate=?, location=?, description=?, priority=?, type=?, status=?, view=?, completedDate=? WHERE taskId=?`,
      [
        req.body.title,
        req.body.dueDate,
        req.body.location,
        req.body.description,
        req.body.priority,
        req.body.type,
        req.body.status,
        viewValue,
        completedDate,
        taskId,
      ]
    );

    conn.release();
    res.redirect(`/viewTask/${taskId}`);
  } catch (error) {
    console.error("Database query error:", error);
    conn.release();
    res.status(500).send("An error occurred while updating the task.");
  }
});

app.post(`/viewTask/complete/:taskId`, async (req, res) => {
  try {
    const conn = await connect();
    const { taskId } = req.params;

    await conn.query(
      `UPDATE tasks SET status = 'Completed', view = '0', completedDate = ? WHERE taskId = ?`,
      [new Date(), taskId]
    );
    console.log(taskId);

    conn.release();
    res.redirect(`/`);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).send("An error occurred while updating the task.");
  }
});

// tell the server to listen on our specified port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
