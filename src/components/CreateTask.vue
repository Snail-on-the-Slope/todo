<template>
  <form class="create create-task" @submit.prevent="createTask">
    <input
      type="text"
      name="title"
      :class="{invalid: $v.title.$dirty && !$v.title.required}"
      placeholder="Title"
      v-model.trim="title"
    />
    <small class="helper-text invalid" v-if="$v.title.$dirty && !$v.title.required">Entery Title</small>

    <input
      type="text"
      name="description"
      :class="{invalid: $v.description.$dirty && !$v.description.required}"
      placeholder="Description"
      v-model.trim="description"
    />
    <small
      class="helper-text invalid"
      v-if="$v.description.$dirty && !$v.description.required"
    >Entery Description</small>

    <button type="submit">Create Task</button>
  </form>
</template>

<script>
// Использование Vuelidators для проверки полей
import { required } from "vuelidate/lib/validators";
import Toast from "@/assets/toast/toast_script";

export default {
  data: () => ({
    title: "",
    description: "",
  }),

  validations: {
    title: { required },
    description: { required },
  },

  methods: {
    createTask() {
      // Проверка корректного заполнения полей
      if (this.$v.$invalid) {
        this.$v.$touch();
        Toast.add("Fill in required fields", "db5c5c");
        return;
      }

      // Заполнение данных карточки задачи
      const dataFrame = {
        id: this.$store.getters.tasksCount,
        title: this.title,
        description: this.description,
        completed: false,
      };

      // Создание задачи (добавление в начало массива задач)
      this.$store.commit("createTask", { id: 0, newTask: dataFrame });
      this.$emit("newTask");

      Toast.add("New task successfully created", "5cdb95");

      this.$v.$reset();
      this.title = "";
      this.description = "";
    },
  },
};
</script>