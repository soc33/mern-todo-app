const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const PORT = process.env.PORT || 4000;
const todoRoutes = express.Router();

let Todo = require('./models/todo.model');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  //
  app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname = 'client/build/index.html'));
  })
}
//build mode
mongoose.connect(process.env.MONGODB_URI || 'mongodb://heroku_jckt15hn:heroku_jckt15hn@ds147746.mlab.com:47746/heroku_jckt15hn', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
  console.log("MongoDB database connection established successfully");
})

todoRoutes.route('/').get(function(req, res) {
  Todo.find(function(err, todos) {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});

todoRoutes.route('/:id').get(function(req, res) {
  let id = req.params.id;
  Todo.findById(id, function(err, todo) {
    res.json(todo);
  });
});

todoRoutes.route('/add').post(function(req, res) {
  let todo = new Todo(req.body);
  todo.save()
  .then(todo => {
    res.status(200).json({'todo': 'todo added successfully'});
  })
  .catch(err => {
    res.status(400).send('adding new todo failed');
  });
});

todoRoutes.route('/update/:id').post(function(req, res) {
  Todo.findById(req.params.id, function(err, todo) {
    if (!todo)
    res.status(404).send("data is not found");
    else
    todo.todo_description = req.body.todo_description;
    todo.todo_responsible = req.body.todo_responsible;
    todo.todo_priority = req.body.todo_priority;
    todo.todo_completed = req.body.todo_completed;
    
    todo.save().then(todo => {
      res.json('Todo updated!');
    })
    .catch(err => {
      res.status(400).send("Update not possible");
    });
  });
});

app.use('/todos', todoRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/public/index.html'));
})

//start server
app.listen(PORT, (req, res) => {
  console.log( `server listening on PORT: ${PORT}`);
})