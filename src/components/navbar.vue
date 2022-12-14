<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">
      <img src="logo-header.png" height=40 alt="MADAMS EDITOR" loading="lazy">
    </a>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <div v-on:click="onEditorTabClick">
            <router-link v-bind:class="'nav-item nav-link '+ editorFocus" to="/">Editor</router-link> 
          </div>
          <div v-on:click="onFilesTabClick">
            <router-link v-bind:class="'nav-item nav-link '+ filesFocus" to="/files">Mappings</router-link>
          </div>
        </div>
    </div>
    <a v-show="convertBtnStatus" class="nav-link btn btn-primary" id="convert-btn" href="#" title="Apply Mapping (Ctrl + Enter)" style="color: #fff !important;">
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-caret-right-fill" fill="currentColor"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
      </svg>
      <span class="loader spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>
      Run
    </a>
  </nav>
</template>

<script>

export default {
    name: 'NavBar',
    data() {
      return{
        convertBtnStatus : true,
        editorFocus: 'active',
        filesFocus: ''
      }
    },
    methods: {
       onFilesTabClick : function(){
        this.convertBtnStatus = false
        this.filesFocus = 'active'
        this.editorFocus = ''
       },
       onEditorTabClick : function(){
        this.convertBtnStatus = true
        this.filesFocus = ''
        this.editorFocus = 'active'
       }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
nav {
  height: 60px;
}
</style>
