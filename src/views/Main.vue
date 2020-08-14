<template>
  <div class="drag-n-drop">
    <!-- Блок для уведомлений -->
    <div class="toasts" ref="toasts"></div>

    <h2 class="dd-title">Tasks</h2>

    <!-- Форма создания Задач -->
    <CreateTask @newTask="newTask" />

    <!-- Блок фильтров. Работают отдельно. Только для блока Задач -->
    <div class="filter-container">
      <!-- Фильтр по статусу выполнения -->
      <FilterCompleted @newFilter="newFilter" />

      <!-- Фильтры по titlte -->
      <input
        type="text"
        name="serchTitle"
        v-model="searchByTitle"
        placeholder="Search by task name"
      />
    </div>

    <!-- Блок для Задач -->
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

    <!-- Форма создания Групп -->
    <CreateGroup />

    <!-- Блок для Групп -->
    <div class="dd-result-group">
      <div v-for="(group,ind) in dropGroups" v-bind:key="ind" class="dd-drop-container">
        <div class="dd-drop-header">
          <h2>{{group.name}}</h2>
          <button class="delete" @click.prevent="deleteGroup(ind)">Delete</button>
        </div>

        <!-- Контейнер для дочерних задач -->
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
      items: [], // массив задач
      dropGroups: [], // массив групп
      filter_completed: "all", // переменная фильтра по статусу выполнения
      searchByTitle: "", // переменная фильтра по title
    };
  },

  async created() {
    // получение задач из JSON
    await this.$store.dispatch("fetchTasks");
    this.items = this.$store.getters.allTasks;

    // получение групп из JSON
    await this.$store.dispatch("fetchGroups");
    this.dropGroups = this.$store.getters.allGroups;
  },

  computed: {
    // фильтрация задач
    filteredTasks() {
      return this.searchByTitle === ""
        ? this.filteredCompleted()
        : ((this.filter_completed = "all"), this.filteredTitle());
    },
  },

  methods: {
    // Перемещение карточки задачи (Блок Задач)
    onDrop(dropResult) {
      this.items = this.applyDrag(this.items, dropResult);
    },

    applyDrag(arr, dragResult) {
      const { removedIndex, addedIndex, payload } = dragResult;
      if (removedIndex === null && addedIndex === null) return arr;

      const result = [...arr];
      let itemToAdd = payload;

      // При перетаскивании задачи (Drag)
      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0];
        this.$store.commit("deleteTask", removedIndex);
      }

      // При добавлении задачи (Drop)
      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd);
        this.$store.commit("createTask", { id: addedIndex, newTask: payload });
      }
      this.items = this.$store.getters.allTasks;
      return result;
    },

    // Перемещение карточки задачи (Блок Групп)
    onCardDrop(columnId, dropResult) {
      const { removedIndex, addedIndex, payload } = dropResult;

      if (removedIndex !== null && addedIndex !== null) return this.dropGroups;

      const result = [...this.dropGroups];

      // При перетаскивании задачи (Drag)
      if (removedIndex !== null) {
        let found = result.filter((p) => p.name === columnId)[0];
        found.children.splice(removedIndex, 1);
      }

      // При добавлении задачи (Drop)
      if (addedIndex !== null) {
        let found = result.filter((p) => p.name === columnId)[0];
        found.children.splice(addedIndex, 0, payload);
      }
    },

    // Получение данных перемещаемой задачи (Блок Групп)
    getCardPayload(id) {
      let that = this;
      return function (index) {
        let found = that.dropGroups.filter((p) => p.name === id)[0].children[
          index
        ];
        return found;
      };
    },

    // Получение данных перемещаемой задачи (Блок Задач)
    getOriginalCardPayload() {
      let that = this;
      return function (index) {
        return that.items[index];
      };
    },

    // Обновление переменной списка задач при добавлении новой задачи
    newTask() {
      this.items = this.$store.getters.allTasks;
    },

    // Удаление группы
    deleteGroup(groupId) {
      this.$store.commit("deleteGroup", groupId);
    },

    // Отслеживание изменений переменной фильтра по статусу выполнения
    newFilter(filter) {
      this.filter_completed = filter;
    },

    // Фильтрация по статусу выполнения
    filteredCompleted() {
      return this.filter_completed === "all"
        ? this.items
        : this.$store.getters.getTasksWithCompletedFilter(
            this.filter_completed === "true"
          );
    },

    // Фильтрация по Title
    filteredTitle() {
      return this.$store.getters.getTasksWithTitleFilter(this.searchByTitle);
    },
  },
};
</script>
