import json from "@/assets/data/tasks.json";

export default {
    state: {
        tasks: [], //{ id: 0, title: null, description: null, completed: false }
        countTasks: 0,
    },

    mutations: {
        updateTasks(state, tasks) {
            state.tasks = tasks;
            state.countTasks = state.tasks.length;
        },

        createTask(state, { id, newTask }) {
            state.tasks.splice(id, 0, newTask);
            state.countTasks++;
        },

        deleteTask(state, id) {
            state.tasks.splice(id, 1);
        },

        changeTask(state, id) {
            let task = state.tasks.filter(e => e.id === id)[0];
            task.completed = !task.completed;
        },
    },

    actions: {
        async fetchTasks(ctx) {
            try {
                var tasks = json;
                ctx.commit("updateTasks", tasks);
            } catch (e) {
                console.log(e);
            }
        },
    },

    getters: {
        allTasks(state) {
            return state.tasks;
        },

        taskById: state => id => {
            return state.tasks[id];
        },

        tasksCount(state) {
            return state.countTasks;
        },

        getTasksWithCompletedFilter: state => filter => {
            return filter ?
                state.tasks.filter(e => e.completed) :
                state.tasks.filter(e => !e.completed);
        },

        getTasksWithTitleFilter: state => filter => {
            return state.tasks.filter(e =>
                e.title.toLowerCase().includes(filter.toLowerCase())
            );
        },
    },
};