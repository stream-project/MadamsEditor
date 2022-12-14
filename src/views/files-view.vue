<template>
    <!--
      We are providing each todo-item with the todo object
      it's representing, so that its content can be dynamic.
      We also need to provide each component with a "key",
      which is explained in the guide section on v-for.
    -->
    <TodoItem
      v-for="item in showList"
      :todo="item"
      :key="item.id"
      :downloadCallback="downloadCallback"
      :deleteCallback="deleteCallback"
    ></TodoItem>
    <div id="paginationDiv">
      <paginate
        id="unit"
        :page-count="totalPages"
        :page-range="5"
        :margin-pages="0"
        :initial-page="1"
        :click-handler="pageClickCallback"
        :prev-class="'ignore'"
        :next-class="'ignore'"
        :disabled-class="'ignore'"
      ></paginate>
    </div>
    

</template>

<script>
import TodoItem from '@/components/FilesListItem'
import VuejsPaginateNext from '@/components/files-paginator.vue'
let dummyList = []
for(let i = 1; i<=11; i++){
  dummyList.push({id: 1000 + i, text: 'File_'+i+'.rml'})
}
var pagesize  = 5

export default {
  name: 'FilesView',
  components: {
    TodoItem,
    Paginate: VuejsPaginateNext
  },
  methods: {
      pageClickCallback (pageNum) {
        console.log(pageNum)
        var start = (pageNum - 1) * pagesize
        var end = Math.min(dummyList.length, pageNum * pagesize)
        if(start < dummyList.length)
          this.showList = dummyList.slice(start, end)
      },
      downloadCallback(id){
        console.log('download' + id)

      },
      deleteCallback(id){
        console.log('delete' + id)
      } 
    },
  data() {
    return {
      showList: dummyList.slice(0, Math.min(dummyList.length, pagesize)),
      page: 1,
      totalPages: Math.ceil(dummyList.length / pagesize)
    }
  },
  
};
</script>

<style>
div#paginationDiv
{

    margin: 10px;
    padding: 10px;
}
</style>

