const readline = require('readline');
const fs = require('fs');


const todos = [];
const interface = readline.createInterface({input: process.stdin, output: process.stdout})
const menu = `
Your options are:

1. Add a todo.
2. Remove a todo.
3. Mark a todo completed.
4. Mark a todo uncompleted.
5. Toggle a todo's priority.
6. Quit.

`

const loadTodos = function() {
  const file = fs.readFileSync('../back-end/todos.json', 'utf8');
  const data = JSON.parse(file);
  for (todo of data.todos) {
    todos.push(todo);
  }
}

const displayTodos = function(shouldPrintNumber) {
  console.log('\nHere are your current todos:\n')
  for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];
    const num = i + 1;
    let listSymbol = '*';
    let mark = '✖';
    if (shouldPrintNumber) {
      listSymbol = num + '.';
    }

    if (todo.complete) {
      mark = '✅';
    }

    todoLine = listSymbol + ' ' + todo.text + ' - priority: ' + todo.priority + ' - ' + mark;
    // or, using interpolation:
    todoLine = `${listSymbol} ${todo.text} - priority: ${todo.priority} - ${mark}`
    console.log(todoLine);
  }
}

const saveTodos = function() {
  const data = {
    todos: todos,
  };

  const newContents = JSON.stringify(data, null, 2);
  fs.writeFileSync('../back-end/todos.json', newContents);
}

const add = function(text) {
  const todo = {
    text: text,
    priority: 2,
    complete: false,
  }

  todos.push(todo);
  saveTodos();
  displayTodos(false);
  interface.close();
}

const remove = function(num) {
  todos.splice(num - 1, 1);
  saveTodos();
  displayTodos(false);
  interface.close();
}

const complete = function(num) {
  for (let i = 0; i < todos.length; i++) {
    if (i + 1 === Number(num)) {
      todos[i].complete = true;
    }
  }

  saveTodos();
  displayTodos(false);
  interface.close();
}

const uncomplete = function(num) {
  for (let i = 0; i < todos.length; i++) {
    if (i + 1 === Number(num)) {
      todos[i].complete = false;
    }
  }

  saveTodos();
  displayTodos(false);
  interface.close();
}

const togglePriority = function(num) {
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

const handleMenu = function(cmd) {
  if (cmd === '1') {
    // Add a todo.
    interface.question('\nWhat should go on your list? ', add)
  } else if (cmd === '2') {
    // Remove a todo.
    displayTodos(true);
    interface.question('\nPlease pick a todo to remove: ', remove)
  } else if (cmd === '3') {
    // Mark a todo complete.
    displayTodos(true);
    interface.question('\nPlease pick a todo to mark complete: ', complete)
  } else if (cmd === '4') {
    // Mark a todo complete.
    displayTodos(true);
    interface.question('\nPlease pick a todo to mark uncomplete: ', uncomplete)
  } else if (cmd === '5') {
    // Toggle a todo's priority.
    displayTodos(true);
    interface.question('\nPlease pick a todo to toggle its priority: ', togglePriority)
  } else {
    console.log('Quitting!');
    interface.close();
  }
}

loadTodos();
displayTodos(false);
interface.question(menu, handleMenu);
