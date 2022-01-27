<template>
  <div class="hello">
    <h1>Taxonomy service</h1>
    <tag-list :taglist="taglist" />
  </div>
</template>

<script>

import taglist_v from './tag-list.vue'
import {fetchTags_SPARQL} from '../controller/helper.js'

export default {
    name: 'mymain',
    props: {
    },
    data() {
        return {
            taglist: [],
            fetchTags: () => {}
        }
    },
    components: {
        'tag-list': taglist_v
    },
    async created() {
        this.fetchTags = async function() {
            this.taglist = await fetchTags_SPARQL();
            this.taglist = this.taglist.sort((a, b) => {
                var nameA = a.name.toUpperCase(); // Groß-/Kleinschreibung ignorieren
                var nameB = b.name.toUpperCase(); // Groß-/Kleinschreibung ignorieren
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // Namen müssen gleich sein
                return 0;
            });
            
            if (this.taglist.length < 1) {
                this.$swal({
                    icon: 'warning',
                    title: 'Warning',
                    text: 'There are no tags stored at the endpoint. This could also be the result of an error.'
                });
            }
        }
        
        this.fetchTags();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
