// localStorage
const STORAGE_KEY = "vue-todo";
const todoStorage = {
  fetch() {
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    todos.forEach((todo, index) => {
      todo.id = index;
    });
    todoStorage.uid = todos.length;
    return todos;
  },
  save(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }
};

// visibility filters
const filters = {
  all(todos) {
    return todos;
  },
  active(todos) {
    return todos.filter((todo) => !todo.completed);
  },
  completed(todos) {
    return todos.filter((todo) => todo.completed);
  }
};

// app Vue instance
const app = Vue.createApp({
  data() {
    return {
      todos: todoStorage.fetch(),
      newTodo: "",
      visibility: "all"
    }
  },

  watch: {
    todos: {
      handler(todos) {
        todoStorage.save(todos);
      },
      deep: true
    }
  },

  computed: {
    filteredTodos() {
      return filters[this.visibility](this.todos);
    },
    completedNum() {
      return filters.completed(this.todos).length;
    },
  },
  
  methods: {
    addTodo() {
      const value = this.newTodo; 
      if (!value) {
        return;
      }
      this.todos.push({
        id: todoStorage.uid++,
        task: value,
        completed: false
      });
      this.newTodo = "";
    },

    removeTodo(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1);
    },

    removeCompleted() {
      this.todos = filters.active(this.todos);
    }
  },
});

// mount
const vm = app.mount("#app");

// handle routing
function onHashChange() {
  const visibility = window.location.hash.replace(/#\/?/, "");
  if (filters[visibility]) {
    vm.visibility = visibility;
  } else {
    window.location.hash = "";
    vm.visibility = "all";
  }
}

window.addEventListener("hashchange", onHashChange);
onHashChange();