const readline = require('readline');
const fs = require('fs');


let globalTodos = [];
const interface = readline.createInterface({input: process.stdin, output: process.stdout})
const menu = `
Your options are:

1. Add a todo.
2. Remove a todo.
3. Remove all completed todos.
4. Mark a todo completed.
5. Mark a todo uncompleted.
6. Toggle a todo's priority.
7. Quit.

`


const loadTodos = function() {
  // console.log(__dirname)
  // -> /Users/[yourusername]/some-other-directories/todo-objectificate/front-end
  const file = fs.readFileSync(__dirname + '/../back-end/todos.json', 'utf8');
  const data = JSON.parse(file);
  globalTodos = data.todos;

  // or, the manual way:
  // for (todo of data.todos) {
  //   globalTodos.push(todo);
  // }

  // or, replacing all the above, if you wanna feel clever with unreadable code:
  // globalTodos = JSON.parse(fs.readFileSync(__dirname + '/../back-end/todos.json', 'utf8')).todos
}


const displayTodos = function(shouldPrintNumber) {
  console.log('\nHere are your current todos:\n')
  for (let i = 0; i < globalTodos.length; i++) {
    const todo = globalTodos[i];
    const text = todo.text;
    const isComplete = todo.isComplete;
    const priority = todo.priority;
    const num = i + 1;
    let listSymbol = '*';
    let mark = '✖';
    if (shouldPrintNumber) {
      listSymbol = num + '.';
    }

    if (isComplete) {
      mark = '✅';
    }

    todoLine = listSymbol + ' ' + text + ' - priority: ' + priority + ' - ' + mark;
    // or, using interpolation:
    todoLine = `${listSymbol} ${todo.text} - priority: ${todo.priority} - ${mark}`
    console.log(todoLine);
  }
}

const saveTodos = function() {
  // make a data object with our updated todos array as its todos property
  const data = {
    todos: globalTodos,
  };

  // console.log('data:', data)

  // make that object into a JSON string
  const newContents = JSON.stringify(data, null, 2);
  // console.log('newcontents: ', newContents)

  // write that JSON string into the file
  fs.writeFileSync(__dirname + '/../back-end/todos.json', newContents);
}

const add = function(answer) {
  const todo = {
    text: answer,
    priority: 2,
    isComplete: false,
  }

  globalTodos.push(todo);
  saveTodos();
  displayTodos(false);
  interface.close();
}

const remove = function(num) {
  globalTodos.splice(num - 1, 1);
  saveTodos();
  displayTodos(false);
  interface.close();
}

const complete = function(num) {
  for (let i = 0; i < globalTodos.length; i++) {
    if (i + 1 === Number(num)) {
      globalTodos[i].isComplete = true;
    }
  }

  saveTodos();
  displayTodos(false);
  interface.close();
}

const uncomplete = function(num) {
  for (let i = 0; i < globalTodos.length; i++) {
    if (i + 1 === Number(num)) {
      globalTodos[i].isComplete = false;
    }
  }

  saveTodos();
  displayTodos(false);
  interface.close();
}

const togglePriority = function(num) {
  for (let i = 0; i < globalTodos.length; i++) {
    const todo = globalTodos[i];
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

const removeCompletedTodos = function() {
  const completesFilteredOut = [];
  for (const todo of globalTodos) {
    if (todo.isComplete === false) {
      completesFilteredOut.push(todo);
    }
  }

  globalTodos = completesFilteredOut;
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
  } else {
    console.log('Quitting!');
    interface.close();
  }
}

loadTodos();
displayTodos(false);
interface.question(menu, handleMenu);
