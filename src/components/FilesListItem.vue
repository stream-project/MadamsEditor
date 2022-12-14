<script>
export default {
  props: {
    todo: Object,
    downloadCallback: Object,
    deleteCallback: Object,
  }
}
</script>

<style>
.card {
    margin: 10px;
    text-align: left;
}

.scroll-box {
    overflow-y: scroll;
    max-height: 500px;
    padding: 1rem
}

button{
  margin-right: 10px;
} 
</style>

<template>

  <div class="card">
    <div class="card-header">
      id: {{todo.id}} 
    </div>
    <div class="card-body">
      <p class="card-text">Name: {{todo.text}} </p>
      
        <button v-bind:id="'btn_download_'+ todo.id" type="button" class="btn btn-primary"  @click="downloadCallback(todo.id)" >
          Download mapping
        </button>
        <button v-bind:id="'btn_delete_'+ todo.id" type="button" class="btn btn-danger"  @click="deleteCallback(todo.id)">
          Delete mapping
        </button>

    </div>
  </div>
</template>