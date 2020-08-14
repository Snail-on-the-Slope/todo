import json from "@/assets/data/groups";
export default {
    state: {
        groups: [], // { name: '', childeren}
        countGroups: 0,
    },

    mutations: {
        updateGroups(state, groups) {
            state.groups = groups;
            state.countGroups = state.groups.length;
        },

        createGroup(state, newGroup) {
            state.groups.push(newGroup);
            state.countGroups++;
        },

        deleteGroup(state, id) {
            state.groups.splice(id, 1);
        },

        changeTaskInGroup(state, { idGroup, idTask }) {
            let group = state.groups.filter(e => e.id === idGroup)[0];
            group.children[idTask].completed = !group.children[idTask]
                .completed;
        },

        deleteChildrenGroup(state, { idGroup, idTask }) {
            state.groups
                .filter(e => e.id === idGroup)[0]
                .children.splice(idTask, 1);
        },
    },

    actions: {
        async fetchGroups(ctx) {
            try {
                var groups = json;
                ctx.commit("updateGroups", groups);
            } catch (e) {
                console.log(e);
            }
        },
    },

    getters: {
        allGroups(state) {
            return state.groups;
        },

        getGroup: state => id => {
            return state.groups.filter(e => e.id === id)[0];
        },

        getChildrenById: state => idGroup => idTask => {
            let group = state.groups.filter(e => e.id === idGroup)[0];
            return group.children[idTask];
        },

        groupsCount(state) {
            return state.countGroups;
        },
    },
};