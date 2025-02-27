// import express module
import express from "express";
import colors from "colors";

// instantiate an express application
const app = express();

// instantiate an array to store form submissions
const taskList = [];

// instantiate counter for task numbers
let taskCounter = 1;

// serve static files from the 'public' directory
app.use(express.static("public"));

// handling form submission for data sent in the URL-encoded format
app.use(express.urlencoded({ extended: true }));

//set the view engine
app.set("view engine", "ejs");


// default route
app.get("/", (req, res) => {
  res.render("home", { taskList });
});

// addTask route
app.get("/addTask", (req, res) => {
  res.render("addtask");
});


// createTask route to handle addTask form submission
app.post("/createTask", (req, res) => {
  // create new task object
  const task = {
    taskId: taskCounter,
    title: req.body.title,
    dueDate: req.body.dueDate,
    location: req.body.location,
    description: req.body.description,
    priority: req.body.priority,
    type: req.body.type,
    status: "Not Started",
    view: true,
    created: new Date(),
  };

  // increment taskCounter variable;
  taskCounter++;
 
  // log task to console for testing/validation
  console.log(task);

  // Save task object to the taskList array
  taskList.push(task);

  // Log the contactList array to the console for testing/validation
  console.log(req.body);

  // send home page with tasklist
  res.render("home", { taskList });
});



// viewTask route to render specific task details on view.ejs page
app.get("/viewTask/:taskId", (req, res) => {
  const taskId = parseInt(req.params.taskId, 10);
  const task = taskList.find((t) => t.taskId === taskId);

  res.render("viewTask", { task });
  
});

// editTask route to display edit task form for a specific task
app.get("/editTask/:taskId", (req, res) => {
  const taskId = parseInt(req.params.taskId, 10);
  const task = taskList.find((t) => t.taskId === taskId);

  res.render("editTask", { task });
 
});

// updateTask route to handle task updates
app.post("/updateTask/:taskId", (req, res) => {
  const taskId = parseInt(req.params.taskId, 10);
  const task = taskList.find((t) => t.taskId === taskId);

  task.title = req.body.title;
  task.dueDate = req.body.dueDate;
  task.location = req.body.location;
  task.description = req.body.description;
  task.priority = req.body.priority;
  task.type = req.body.type;
  task.status = req.body.status;

  // redirect back to the updated task details page
  res.redirect(`/viewTask/${taskId}`);
  
});



// tell the server to listen on port 3000
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000".bgRed);
});
