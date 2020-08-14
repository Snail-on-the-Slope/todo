<template>
  <div class="filter-completed">
    <select v-model="filterCompleted" @click.prevent="$emit('newFilter', filterCompleted)">
      <option value="all">all</option>
      <option value="false">in work</option>
      <option value="true">completed</option>
    </select>
  </div>
</template>

<script>
export default {
  data: () => ({
    filterCompleted: "all",
  }),
};
</script>