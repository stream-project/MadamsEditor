<template>
    <!--
      We are providing each todo-item with the todo object
      it's representing, so that its content can be dynamic.
      We also need to provide each component with a "key",
      which is explained in the guide section on v-for.
    -->
    <TodoItem
      v-for="item in groceryList"
      :todo="item"
      :key="item.id"
    ></TodoItem>
    

</template>

<script>
import TodoItem from '@/components/FilesListItem'
export default {
  name: 'FilesView',
  components: {
    TodoItem
  },
  data() {
    return {
      groceryList: [
        { id: 10001, text: 'File-10001.ttl' },
        { id: 10002, text: 'File-10002.ttl' },
        { id: 10003, text: 'File-10003.ttl' },
        { id: 10004, text: 'File-10004.ttl' },
        { id: 10005, text: 'File-10005.ttl' }
      ]
    }
  }
}
</script>
