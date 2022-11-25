<script>
export default {
  props: {
    todo: Object
  }
}
</script>

<style>
.card {
    margin: 10px;
}

.scroll-box {
    overflow-y: scroll;
    max-height: 500px;
    padding: 1rem
}

.card-body{

} 
</style>

<template>

  <div class="card">
    <div class="card-header">
      id: {{todo.id}} 
    </div>
    <div class="card-body">
      <p class="card-text">Name: {{todo.text}} </p>
      
        <button id="btn_{{todo.id}}" type="button" class="btn btn-primary">
          Download file
        </button>

    </div>
  </div>
</template>