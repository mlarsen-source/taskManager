// import express module
import express from 'express';

// instantiate an express application
const app = express();

// serve static files from the 'public' directory
app.use(express.static('public'));

// handling form submission for data sent in the URL-encoded format
app.use(express.urlencoded({extended: true}));

//set the view engine
app.set('view engine', 'ejs');


// default route 
app.get('/',(req, res)=>
{
  res.render('home');
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


// tell the server to listen on port 3000
app.listen(3000, ()=>
{
console.log("Server running at http://localhost:3000")
});