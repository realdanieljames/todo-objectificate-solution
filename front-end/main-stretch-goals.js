const readline = require('readline');
const fs = require('fs');


let todos = [];
let currentTodoNum = '';
const interface = readline.createInterface({ input: process.stdin, output: process.stdout })
const menu = `
Your options are:

1. Add a todo.
2. Remove a todo.
3. Remove all completed todos.
4. Mark a todo completed.
5. Mark a todo uncompleted.
6. Toggle a todo's priority.
7. Add a category to a todo.
8. Display all todos in a category.
9. Quit.

`

const loadTodos = function () {
  const file = fs.readFileSync(__dirname + '/../back-end/todos.json', 'utf8');
  const data = JSON.parse(file);
  for (todo of data.todos) {
    todos.push(todo);
  }
}

const displayTodo = function (todo, num, shouldPrintNumber) {
  let listSymbol = '*';
  let mark = '✖';
  if (shouldPrintNumber) {
    listSymbol = num + '.';
  }

  if (todo.isComplete) {
    mark = '✅';
  }

  todoLine = listSymbol + ' ' + todo.text + ' - priority: ' + todo.priority + ' - ' + mark;
  // or, using interpolation:
  todoLine = `${ listSymbol } ${ todo.text } - priority: ${ todo.priority } - ${ mark }`
  console.log(todoLine);
}

const displayTodos = function (shouldPrintNumber) {
  console.log('\nHere are your current todos:\n')
  for (let i = 0; i < todos.length; i++) {
    displayTodo(todos[i], i + 1, shouldPrintNumber)
  }
}

const saveTodos = function () {
  const data = {
    todos: todos,
  };

  const newContents = JSON.stringify(data, null, 2);
  fs.writeFileSync(__dirname + '/../back-end/todos.json', newContents);
}

const add = function (text) {
  const todo = {
    text: text,
    priority: 2,
    isComplete: false,
    categories: [],
  }

  todos.push(todo);
  saveTodos();
  displayTodos(false);
  interface.close();
}

const remove = function (num) {
  todos.splice(num - 1, 1);
  saveTodos();
  displayTodos(false);
  interface.close();
}

const complete = function (num) {
  for (let i = 0; i < todos.length; i++) {
    if (i + 1 === Number(num)) {
      todos[i].isComplete = true;
    }
  }

  saveTodos();
  displayTodos(false);
  interface.close();
}

const uncomplete = function (num) {
  for (let i = 0; i < todos.length; i++) {
    if (i + 1 === Number(num)) {
      todos[i].isComplete = false;
    }
  }

  saveTodos();
  displayTodos(false);
  interface.close();
}

const togglePriority = function (num) {
  for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];
    if (i + 1 === Number(num)) {
      if (todo.priority === 1) {
        todo.priority = 2;
      } else if (todo.priority === 2) {
        todo.priority = 1;
      }
    }
  }

  saveTodos();
  displayTodos(false);
  interface.close();
}

const categoryFollowup = function (category) {
  for (let i = 0; i < todos.length; i++) {
    if (i + 1 === Number(currentTodoNum)) {
      todos[i].categories.push(category);
    }
  }

  saveTodos();
  displayTodos(false);
  interface.close();
}

const addCategory = function (num) {
  currentTodoNum = num;
  interface.question('\nWhat category would you like to add? ', categoryFollowup);
}

const removeCompletedTodos = function () {
  const completesFilteredOut = [];
  for (const todo of todos) {
    if (todo.isComplete === false) {
      completesFilteredOut.push(todo);
    }
  }

  todos = completesFilteredOut;
  saveTodos();
  displayTodos(false);
  interface.close();
}

const displayCategory = function (category) {
  for (let i = 0; i < todos.length; i++) {
    const todo = todos[i]
    if (todo.categories.includes(category)) {
      displayTodo(todo, i + 1, false)
    }
  }

  interface.close();
}

const handleMenu = function (cmd) {
  if (cmd === '1') {
    // Add a todo.
    interface.question('\nWhat should go on your list? ', add)
  } else if (cmd === '2') {
    // Remove a todo.
    displayTodos(true);
    interface.question('\nPlease pick a todo to remove: ', remove)
  } else if (cmd === '3') {
    // Remove all completed todos.
    removeCompletedTodos();
    displayTodos(true);
  } else if (cmd === '4') {
    // Mark a todo complete.
    displayTodos(true);
    interface.question('\nPlease pick a todo to mark complete: ', complete)
  } else if (cmd === '5') {
    // Mark a todo complete.
    displayTodos(true);
    interface.question('\nPlease pick a todo to mark uncomplete: ', uncomplete)
  } else if (cmd === '6') {
    // Toggle a todo's priority.
    displayTodos(true);
    interface.question('\nPlease pick a todo to toggle its priority: ', togglePriority)
  } else if (cmd === '7') {
    // Add a category to a todo.
    displayTodos(true);
    interface.question('\nPlease pick a todo to add a category to: ', addCategory)
  } else if (cmd === '8') {
    // Display all todos in a certain category.
    interface.question('\nPlease pick a category to display: ', displayCategory)
  } else {
    console.log('Quitting!');
    interface.close();
  }
}

loadTodos();
displayTodos(false);
interface.question(menu, handleMenu);
