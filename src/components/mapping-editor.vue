<template>
  <div class="editor-title">
    <span id="mapping-filename">YARRRML Mapping</span> <small class="text-muted">(YAML)</small>
    <div class="float-right">
      <div class="dropdown dropleft">
        <button class="btn btn-sm" type="button" id="dropdownMenu-mapping" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-menu-down" viewBox="0 0 16 16">
            <path d="M7.646.146a.5.5 0 0 1 .708 0L10.207 2H14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h3.793L7.646.146zM1 7v3h14V7H1zm14-1V4a1 1 0 0 0-1-1h-3.793a1 1 0 0 1-.707-.293L8 1.207l-1.5 1.5A1 1 0 0 1 5.793 3H2a1 1 0 0 0-1 1v2h14zm0 5H1v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2zM2 4.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
          </svg>
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenu-mapping">
          <a class="dropdown-item" href="https://rml.io/yarrrml/spec/" target="_blank">YARRRML Specification</a>
          <a class="dropdown-item" href="https://goessner.net/articles/JsonPath/index.html" target="_blank">JSONPath Specification</a>
          <a class="dropdown-item" href="https://github.com/JSONPath-Plus/JSONPath" target="_blank">JSONPath Plus Specification</a>
        </div>
      </div>
    </div>
  </div>
  <div id="mapping-editor" class="editor"></div>
</template>

<script>

export default {
    name: 'MappingEditor'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
