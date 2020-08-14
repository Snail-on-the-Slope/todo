<template>
  <div class="card-item">
    <h3>{{data.title}}</h3>
    <div class="description-text">
      <div class="description-first">
        <p>{{ desc }}</p>
        <div class="btn-more" v-if="more.more" @click.prevent="moreClick">more</div>
      </div>
      <div class="description-more">
        <p v-if="more.p">{{more.text}}</p>
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
    more: {
      more: false,
      less: false,
      p: false,
      text: "",
    },
  }),
  computed: {
    mark() {
      return this.data.completed ? "Mark Done" : "Mark in Work";
    },
    desc() {
      this.more = {
        more: false,
        less: false,
        p: false,
        text: "",
      };
      return this.data.description.length < 25
        ? this.data.description
        : ((this.more.more = true),
          (this.more.text = this.data.description.slice(25)),
          this.data.description.slice(0, 25) + "...");
    },
  },
  methods: {
    moreClick() {
      this.more.more = false;
      this.more.less = true;
      this.more.p = true;
    },
    lessClick() {
      this.more.more = true;
      this.more.less = false;
      this.more.p = false;
    },
    markDone() {
      this.groupId || this.groupId === 0
        ? this.$store.commit("changeTaskInGroup", {
            idGroup: this.groupId,
            idTask: this.idx,
          })
        : this.$store.commit("changeTask", this.data.id);
      // this.data.completed
      //   ? Toast.add(`Task "${this.data.title}" is Done`, "5cdb95")
      //   : Toast.add(`Task "${this.data.title}" in Work`, "d9db5c");
    },
    deleteTask() {
      console.log("delete", this.groupId, this.idx, this.data.id);
      Toast.add(`Task "${this.data.title}" deleted`, "db5c5c");
      this.groupId || this.groupId === 0
        ? this.$store.commit("deleteChildrenGroup", {
            idGroup: this.groupId,
            idTask: this.idx,
          })
        : this.$store.commit("deleteTask", this.idx);
    },
  },
};
</script>
