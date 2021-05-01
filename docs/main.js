// localStorage
var STORAGE_KEY = "vue-todo";
var todoStorage = {
  fetch: function() {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    todos.forEach(function(todo, index) {
      todo.id = index;
    });
    todoStorage.uid = todos.length;
    return todos;
  },
  save: function(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }
};

// visibility filters
var filters = {
  all: function(todos) {
    return todos;
  },
  active: function(todos) {
    return todos.filter(function(todo) {
      return !todo.completed;
    });
  },
  completed: function(todos) {
    return todos.filter(function(todo) {
      return todo.completed;
    })
  }
};

// app Vue instance
var app = new Vue({
  el: "#app",
  data: {
    todos:todoStorage.fetch(),
    newTodo: "",
    visibility: "all"
  },
  watch: {
    todos: {
      handler: function(todos) {
        todoStorage.save(todos);
      },
      deep: true
    }
  },
  computed: {
    filteredTodos: function() {
      return filters[this.visibility](this.todos);
    },
    completedNum: function() {
      return filters.completed(this.todos).length;
    },
  },
  methods: {
    addTodo: function() {
      var value = this.newTodo; 
      this.todos.push({
        id: todoStorage.uid++,
        task: value,
        completed: false
      });
      this.newTodo = "";
    },

    removeTodo: function(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1);
    },

    removeCompleted: function() {
      this.todos = filters.active(this.todos);
    }
  },
});

// handle routing
function onHashChange() {
  var visibility = window.location.hash.replace(/#\/?/, "");
  if (filters[visibility]) {
    app.visibility = visibility;
  } else {
    window.location.hash = "";
    app.visibility = "all";
  }
}

window.addEventListener("hashchange", onHashChange);
onHashChange();