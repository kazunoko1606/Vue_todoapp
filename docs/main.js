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
    todos:[],
    newTodo: "",
    visibility: "all"
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
      if (value) {
        this.todos.push({task: value, completed: false});
        this.newTodo = "";
      }
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