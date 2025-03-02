// import express module
import express from "express";
import colors from "colors";
import mariadb from 'mariadb';
import { validateForm } from './services/validation.js';
import dotenv from 'dotenv';

dotenv.config();


// define database credentials
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});


// define function to connect to the DB
async function connect() {
  try {
      const conn = await pool.getConnection();
      console.log('Connected to the database!')
      return conn;
  } catch (err) {
      console.log(`Error connecting to the database ${err}`)
  }
}

// instantiate an express application
const app = express();

//define a port number for our server to listen on
const PORT = process.env.APP_PORT || 3000;

// handling form submission for data sent in the URL-encoded format
app.use(express.urlencoded({ extended: true }));

//set the view engine
app.set("view engine", "ejs");

// serve static files from the 'public' directory
app.use(express.static("public"));




// default route with list of tasks from database
app.get('/', async (req, res) => {

  //Connect to the database
  const conn = await connect();

  //Query the database
  const taskList = await conn.query('SELECT * FROM tasks')

  console.log(taskList);

  res.render('home', { taskList });
});



// addTask route
app.get("/addTask", (req, res) => {
  res.render("addtask");
});



// createTask route to handle new task submission
app.post("/createTask", async (req, res) => {

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
  const insertQuery = await conn.query(`INSERT INTO tasks 
    (title, dueDate, location, description, priority, type) VALUES (?,?,?,?,?,?)`, 
    [task.title, task.dueDate, task.location, task.description, task.priority, task.type]);
 
  // log task to console for testing/validation
  console.log(task);

  // get updated tasklist from database
  const taskList = await conn.query('SELECT * FROM tasks');

  // send home page with updated tasklist
  res.render('home', { taskList });
});


// editTask route to display edit task form for a specific task
app.get("/editTask/:taskId", async (req, res) => {
  const taskId = parseInt(req.params.taskId, 10);
  const conn = await connect();
  const task = await conn.query(`SELECT * FROM tasks WHERE taskId = ${taskId}`);
  // fix due dat e format error between mariaDB and js
  task[0].dueDate = task[0].dueDate.toISOString().split("T")[0];
  
  // release connnection
  conn.end();
  
  res.render("editTask", { task: task[0] });
 
});


// viewTask route to render specific task details on view.ejs page
app.get("/viewTask/:taskId", async (req, res) => {
  const taskId = parseInt(req.params.taskId,10);
  const conn = await connect();
  const task = await conn.query(`SELECT * FROM tasks WHERE taskId = ${taskId}`);
 
  // release connection
  conn.end();
  
  res.render("viewTask", { task: task[0] });
  
});


// updateTask route to handle task updates
app.post("/updateTask/:taskId", async (req, res) => {
  const taskId = parseInt(req.params.taskId, 10);
  const conn = await connect();

  // ff status is "Completed", set view to false
  const viewValue = req.body.status === "Completed" ? false : true;
  
  await conn.query(
    `UPDATE tasks SET title='${req.body.title}', dueDate='${req.body.dueDate}', location='${req.body.location}', description='${req.body.description}', priority='${req.body.priority}', type='${req.body.type}', status='${req.body.status}', view=${viewValue} WHERE taskId=${taskId}`
  );

  // release connection
  conn.end();

  res.redirect(`/viewTask/${taskId}`);
});


// tell the server to listen on port 3000
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
