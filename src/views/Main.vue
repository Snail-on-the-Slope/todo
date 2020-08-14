<template>
  <div class="drag-n-drop">
    <div class="toasts" ref="toasts"></div>

    <h2 class="dd-title">Tasks</h2>

    <CreateTask @newTask="newTask" />

    <div class="filter-container">
      <FilterCompleted @newFilter="newFilter" />

      <input
        type="text"
        name="serchTitle"
        v-model="searchByTitle"
        placeholder="Search by task name"
      />
    </div>

    <div class="dd-first-group">
      <Container
        @drop="onDrop"
        group-name="col"
        :orientation="'horizontal'"
        :get-child-payload="getOriginalCardPayload()"
        drag-class="dd-card-ghost"
        drop-class="dd-card-ghost-drop"
      >
        <Draggable v-for="(item, idx) in filteredTasks" :key="idx">
          <CustomCard :data="item" :groupId="null" :idx="idx" />
        </Draggable>
      </Container>
    </div>

    <hr />

    <h2 class="dd-title">Drop Groups</h2>

    <CreateGroup />

    <div class="dd-result-group">
      <div v-for="(group,ind) in dropGroups" v-bind:key="ind" class="dd-drop-container">
        <div class="dd-drop-header">
          <h2>{{group.name}}</h2>
          <button class="delete" @click.prevent="deleteGroup(ind)">Delete</button>
        </div>

        <Container
          group-name="col"
          @drop="(e) => onCardDrop(group.name, e)"
          :get-child-payload="getCardPayload(group.name)"
          drag-class="dd-card-ghost"
          drop-class="dd-card-ghost-drop"
        >
          <Draggable v-for="(card, cid) in group.children" :key="cid">
            <CustomCard :data="card" :groupId="group.id" :idx="cid" />
          </Draggable>
        </Container>
      </div>
    </div>
  </div>
</template>

<script>
import { Container, Draggable } from "vue-smooth-dnd";
import CustomCard from "@/components/CustomCard.vue";
import CreateTask from "@/components/CreateTask.vue";
import CreateGroup from "@/components/CreateGroup.vue";
import FilterCompleted from "@/components/FilterCompleted.vue";
import Toast from "@/assets/toast/toast_script";

export default {
  name: "drag-n-drop",
  components: {
    Container,
    Draggable,
    CustomCard,
    CreateTask,
    CreateGroup,
    FilterCompleted,
  },

  data: function () {
    return {
      items: [],
      dropGroups: [],
      filter_completed: "all",
      searchByTitle: "",
    };
  },

  async created() {
    await this.$store.dispatch("fetchTasks");
    this.items = this.$store.getters.allTasks;
    await this.$store.dispatch("fetchGroups");
    this.dropGroups = this.$store.getters.allGroups;
  },

  computed: {
    filteredTasks() {
      return this.searchByTitle === ""
        ? this.filteredCompleted()
        : ((this.filter_completed = "all"), this.filteredTitle());
    },
  },

  methods: {
    onDrop(dropResult) {
      this.items = this.applyDrag(this.items, dropResult);
    },

    applyDrag(arr, dragResult) {
      const { removedIndex, addedIndex, payload } = dragResult;
      if (removedIndex === null && addedIndex === null) return arr;

      const result = [...arr];
      let itemToAdd = payload;

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0];
        this.$store.commit("deleteTask", removedIndex);
      }

      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd);
        this.$store.commit("createTask", { id: addedIndex, newTask: payload });
      }
      this.items = this.$store.getters.allTasks;
      return result;
    },

    onCardDrop(columnId, dropResult) {
      const { removedIndex, addedIndex, payload } = dropResult;

      if (removedIndex !== null && addedIndex !== null) return this.dropGroups;

      const result = [...this.dropGroups];

      if (removedIndex !== null) {
        let found = result.filter((p) => p.name === columnId)[0];
        found.children.splice(removedIndex, 1);
      }

      if (addedIndex !== null) {
        let found = result.filter((p) => p.name === columnId)[0];
        found.children.splice(addedIndex, 0, payload);
      }
    },

    getCardPayload(id) {
      let that = this;
      return function (index) {
        let found = that.dropGroups.filter((p) => p.name === id)[0].children[
          index
        ];
        return found;
      };
    },

    getOriginalCardPayload() {
      let that = this;
      return function (index) {
        return that.items[index];
      };
    },
    newTask() {
      this.items = this.$store.getters.allTasks;
    },
    deleteGroup(groupId) {
      this.$store.commit("deleteGroup", groupId);
    },
    newFilter(filter) {
      this.filter_completed = filter;
    },
    filteredCompleted() {
      return this.filter_completed === "all"
        ? this.items
        : this.$store.getters.getTasksWithCompletedFilter(
            this.filter_completed === "true"
          );
    },
    filteredTitle() {
      return this.$store.getters.getTasksWithTitleFilter(this.searchByTitle);
    },
  },
};
</script>
