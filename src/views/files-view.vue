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
// var dummyList = []
// for(let i = 1; i<=11; i++){
//   dummyList.push({id: 1000 + i, text: 'File_'+i+'.rml'})
// }

var pagesize  = 5

export default {
  name: 'FilesView',
  components: {
    TodoItem,
    Paginate: VuejsPaginateNext
  },
  mounted() {
    this.fetchData()
  },
  methods: {
      fetchData(){
        fetch("http://127.0.0.1:5001/getrmlfiles")
        .then(data => {
            if (!data.ok) {
                throw new Error('Network response was not ok');
            }
            return data.json()
            })
            .then(json => {
              var nameList = json.map( (file_name) => {
                return {id: file_name.split('.')[0] , text: file_name} 
              });
              console.log(nameList)
              this.dummyList = nameList
              this.showList =  this.dummyList.slice(0, Math.min(this.dummyList.length, pagesize))
              this.totalPages = Math.ceil(this.dummyList.length / pagesize)
            })
            .catch(error => {
                console.log('error', 'Fetching RML data failed. ' + error)
            });
      },
      pageClickCallback (pageNum) {
        console.log(pageNum)
        var start = (pageNum - 1) * pagesize
        var end = Math.min(this.dummyList.length, pageNum * pagesize)
        if(start < this.dummyList.length)
          this.showList = this.dummyList.slice(start, end)
      },
      downloadCallback(id){
        console.log('download' + id)
        var data = { "id" : id };
        var url = new URL("http://127.0.0.1:5001/getrmlfile");
        for (let k in data) { url.searchParams.append(k, data[k]); }
        fetch(url)
        .then(data => {
            if (!data.ok) {
                throw new Error('Network response was not ok');
            }
            return data.text()
            })
            .then(text => {
              console.log(text)
              var c = document.createElement("a");
              c.download = id + ".rml";
              var t = new Blob([text], {
              type: "text/rml"
              });
              c.href = window.URL.createObjectURL(t);
              c.click();
            })
            .catch(error => {
                console.log('error', 'Fetching RML data failed. ' + error)
            });

      },
      deleteCallback(id){
        console.log('delete' + id)
        var data = { "id" : id };
        var url = new URL("http://127.0.0.1:5001/deletermlfile");
        for (let k in data) { url.searchParams.append(k, data[k]); }
        fetch(url, {
                method: "DELETE"
            })
            .then(res => {
                return res.status
            })
            .then(code => {
                if(code == 200){
                    this.fetchData();
                    console.log('success', 'RML with id: ' + id + ' deleted!');
                }
                else if(code == 404){
                    console.log('error', 'RML with id: ' + id + ' not found!');
                }
            })
            .catch(e => {
                console.log('error', 'RML Delete failed: ' + e);
            })
      } 
    },
  data() {
    return {
      dummyList:[], 
      showList: [],
      page: 1,
      totalPages: 1
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

