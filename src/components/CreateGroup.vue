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
      if (this.$v.$invalid) {
        this.$v.$touch();
        Toast.add("Fill in required fields", "db5c5c");
        return;
      }
      const dataFrame = {
        id: this.$store.getters.groupsCount,
        name: this.name,
        children: [],
      };
      this.$store.commit("createGroup", dataFrame);
      Toast.add("New group successfully created", "5cdb95");
      this.name = "";
      this.$v.$reset();
    },
  },
};
</script>