import Vue from "vue";
import Vuex from "vuex";
import Tasks from "./modules/tasks";
import Groups from "./modules/groups";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        Tasks,
        Groups,
    },
});