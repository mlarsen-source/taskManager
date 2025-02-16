// import express module
import express from 'express';

// instantiate an express application
const app = express();

// instantiate an array to store form submissions
const taskList = [];

// serve static files from the 'public' directory
app.use(express.static('public'));

// handling form submission for data sent in the URL-encoded format
app.use(express.urlencoded({extended: true}));

//set the view engine
app.set('view engine', 'ejs');


// default route 
app.get('/',(req, res)=>
{
  res.render('home',{taskList});
});


// viewTask route
app.get('/viewTask', (req, res) =>
{
  res.render('viewTask');
});


// addTask route
app.get('/addTask', (req, res) =>
{
  res.render('addTask');
});

  
// editTask route
app.get('/editTask', (req, res) =>
{
  res.render('editTask');
});


// post route to handle addTask form submission
app.post('/createTask', (req, res) =>
{
  // create new task object 
  const task = 
  {
    title: req.body.title,
    startDate: req.body.startDate,
    startTime: req.body.startDate,
    endDate: req.body.endDate,
    endTime: req.body.endTime,
    location: req.body.location,
    description: req.body.description,
    priority: req.body.priority,
    type: req.body.type,
    status: "Not Started",
    view: true,
    created: new Date()
  };
  
  // log task to console for testing/validation
  console.log(task);
      
  // Save task object to the taskList array
  taskList.push(task)
      
  // Log the contactList array to the console for testing/validation
  console.log(req.body);
    
  // send viewTask page with newly created task to user
  res.render('viewTask', { task });
});

// post route to handle searchTask form submission
app.post('/searchTask', (req, res) =>
{
  // create new searchList array
  const searchList = [];
  
  // create new search object 
  const searchtask = 
  {
    title: req.body.title,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    created: req.body.created,
    location: req.body.location,
    priority: req.body.priority,
    type: req.body.type,
    status: req.body.status
  };
  
  // log search object to console for testing/validation
  console.log(searchtask);
      
  // need to add logic to find matching tasks in taskList and add them to searchList
      
  
    
  // send editTask page with newly created searchList to user
  res.render('editTask', { searchList });
});



// tell the server to listen on port 3000
app.listen(3000, ()=>
{
console.log("Server running at http://localhost:3000")
});