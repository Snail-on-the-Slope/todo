<template>
  <div class="card-item">
    <h3>{{data.title}}</h3>

    <div class="description-text">
      <div class="description-first">
        <p v-if="!more.p">{{ desc }}</p>
        <div class="btn-more" v-if="more.more" @click.prevent="moreClick">more</div>
      </div>

      <div class="description-more">
        <p v-if="more.p">{{ data.description }}</p>
        <div class="btn-less" v-if="more.less" @click.prevent="lessClick">less</div>
      </div>
    </div>

    <div class="buttons">
      <button :class="{done: data.completed}" class="btn" @click.prevent="markDone()">{{mark}}</button>
      <button class="btn delete" @click.prevent="deleteTask">Delete</button>
    </div>
  </div>
</template>

<script>
import Toast from "@/assets/toast/toast_script";

export default {
  name: "CustomCard",

  props: { data: Object, groupId: Number, idx: Number },

  data: () => ({
    maxLengthDescription: 25,
    more: {
      // объект для полного просмотра description
      more: false,
      less: false,
      p: false,
    },
  }),

  computed: {
    // Текст кнопки Mark
    mark() {
      return this.data.completed ? "Mark Done" : "Mark in Work";
    },

    // Вывод description
    desc() {
      // Обнуление this.more
      this.more = {
        more: false,
        less: false,
        p: false,
      };

      return this.data.description.length < this.maxLengthDescription
        ? this.data.description
        : ((this.more.more = true),
          this.data.description.slice(0, this.maxLengthDescription) + "...");
    },
  },

  methods: {
    // Открыть полный description
    moreClick() {
      this.more.more = false;
      this.more.less = true;
      this.more.p = true;
    },

    // Обрезать description
    lessClick() {
      this.more.more = true;
      this.more.less = false;
      this.more.p = false;
    },

    // Изменение статуса выполнения
    markDone() {
      this.groupId || this.groupId === 0
        ? // в дочерних задачах группы
          this.$store.commit("changeTaskInGroup", {
            idGroup: this.groupId,
            idTask: this.idx,
          })
        : // в списке задач
          this.$store.commit("changeTask", this.data.id);
    },

    // Удаление задачи
    deleteTask() {
      Toast.add(`Task "${this.data.title}" deleted`, "db5c5c");

      this.groupId || this.groupId === 0
        ? // из дочерних задач группы
          this.$store.commit("deleteChildrenGroup", {
            idGroup: this.groupId,
            idTask: this.idx,
          })
        : // из списка задач
          this.$store.commit("deleteTask", this.idx);
    },
  },
};
</script>
