<template>
  <form class="create create-group" @submit.prevent="createGroup">
    <input
      type="text"
      name="name"
      :class="{invalid: $v.name.$dirty && !$v.name.required}"
      placeholder="Name"
      v-model.trim="name"
    />
    <small class="helper-text invalid" v-if="$v.name.$dirty && !$v.name.required">Entery Name</small>

    <button type="submit">Create Group</button>
  </form>
</template>

<script>
// Использование Vuelidators для проверки полей
import { required } from "vuelidate/lib/validators";
import Toast from "@/assets/toast/toast_script";

export default {
  data: () => ({
    name: "",
  }),

  validations: {
    name: { required },
  },

  methods: {
    createGroup() {
      // Проверка корректного заполнения поля
      if (this.$v.$invalid) {
        this.$v.$touch();
        Toast.add("Fill in required fields", "db5c5c");
        return;
      }

      // Заполнение данных группы
      const dataFrame = {
        id: this.$store.getters.groupsCount,
        name: this.name,
        children: [],
      };

      // Создание группы (добавление в конец массива групп)
      this.$store.commit("createGroup", dataFrame);

      Toast.add("New group successfully created", "5cdb95");

      this.$v.$reset();
      this.name = "";
    },
  },
};
</script>