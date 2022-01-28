<template>
  <nav-bar />

  <main role="main" class="">

    <div id="statusBar" class="invisible">
      <!-- <div id="statusBar-buttons"><button type="button" class="close ml-2" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div> -->
      <div id="messages-wrapper"></div>
    </div>

    <div class="container-fluid h-100">

      <div class="row justify-content-center h-100 p-2">
        <splitpanes class="default-theme container-with-height" vertical :push-other-panes="false">

          <pane id="leftCol" class="col split">
            <splitpanes horizontal :push-other-panes="false">
              <pane id="mapping-wrapper" class="editor-wrapper split">
                <mapping-editor />
              </pane>

              <pane id="data-wrapper" class="editor-wrapper split">
                <data-editor />
              </pane>
            </splitpanes>
          </pane>
          <pane id="rightCol" class="col split">
            <div id="out-wrapper" class="editor-wrapper h-100">
              <out-editor />
            </div>
          </pane>
        </splitpanes>
      </div>

    </div>

  </main>
</template>

<script>

import MadamsEditor from './controller/madamseditor.js'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import NavBar from './components/navbar.vue'
import MappingEditor from './components/mapping-editor.vue'
import DataEditor from './components/data-editor.vue'
import OutEditor from './components/out-editor.vue'

export default {
    name: 'App',
    components: {
      Splitpanes, Pane, NavBar, MappingEditor, DataEditor, OutEditor
    },
    data() {
        return {
            tagsWereChanged: false
        }
    },
    created() {

        var toClose = false

        function toggle(e) {
            e.stopPropagation();
            var btn = this;

            var menu = btn.nextSibling;

            while (menu && menu.nodeType != 1) {
                menu = menu.nextSibling
            }
            if (!menu) return;
            if (menu.style.display !== 'block') {
                menu.style.display = 'block';
                if (toClose) toClose.style.display = "none";
                toClose = menu;
            } else {
                menu.style.display = 'none';
                toClose = false;
            }

        }
        function closeAll() {
            toClose.style.display = 'none';
            toClose = false;
        }

        window.addEventListener("DOMContentLoaded", function () {
            document.querySelectorAll('[data-toggle="dropdown"]').forEach(function (btn) {
                btn.addEventListener("click", toggle, true);
            });
        });

        window.onclick = function (event) {
            if (toClose) {
                closeAll.call(event.target);
            }
        };
    },
    mounted() {
        console.log(process.env);

        let options = {};
        window.process = {
          env: {
              NODE_ENV: 'development'
          }
        };
        if (process && process.env.NODE_ENV === 'development') {
          options = {
            'data': {
              'type': 'url' , // url|json
              'value': './example-data.json', // string|json
              // 'name': '' // string (required for json)
            },
            'mapping': {
              'type': 'url' , // url|yaml
              'value': './example-mapping.yml', // string
              //'name': '' // string (required for yaml)
            },
            'rmlMapperUrl': 'http://localhost:3000/rmlmapper'
          }
        } else {
          options = {
            'data': {
              'type': 'url' ,
              'value': './example-material-data.json',
            },
            'mapping': {
              'type': 'url' ,
              'value': './example-material-mapping.yml',
            },
            'rmlMapperUrl': 'https://ledot.de/rmlmapper'
          }
        }
        options.run = function (mapping, result) {
          // the variable 'this' contains the MadamsEditor class
          console.log('Run', mapping, result);
        }
        new MadamsEditor(options);
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

html,
body {
  height: 100%;
}

main {
  height: calc(100% - 60px);
}

.container-with-height {
  height: 900px;
}

.container-fluid {
  background: #7B007B;
}

.col {
  padding: 0 !important;
}

h4 {
  color: #406594
}

h4 .text-muted {
  color: #859bb7 !important
}

.btn, .btn-sm {
  border-radius: 0;
}

.dropdown-menu {
  border-radius: 0;
}

.editor-title {
  height: 25px;
  margin: 0 5px;
}

.editor-title .float-right {
  margin-right: 13px;
}

.editor {
  height: calc(100% - 25px);
}

#statusBar {
  height: 32px;
  padding: 0 8px 8px 8px;
  position: fixed;
  bottom: 0;
  z-index: 99;
  width: 100%;
}

#statusBar-buttons {
  position: absolute;
  right: 30px;
  z-index: 1;
}

#messages-wrapper {
  background: white;
  width: 100%;
  height: 100%;
  border-top: 1px solid #dcdcdc;
  overflow: hidden;
}

#messages-wrapper .alert {
  border-radius: 0;
  border-top: 1px solid #dcdcdc;
  margin: 0 0 -1px 0;
  padding: 0 10px;
  font-size: .9rem;
}

#leftCol {
  background: white;
}

#leftCol .dropleft .dropdown-menu {
  top: 100%;
  right: -5px;
}

#rightCol {
  background: white;
}

.gutter.gutter-horizontal {
  cursor: ew-resize;
  border-left: 1px solid #7B007B;
  background: white;
}

.gutter.gutter-vertical {
  cursor: ns-resize;
  border-top: 1px solid #7B007B;
}

.editor-title .dropdown > button {
  font-size: .5rem;
  padding: .1rem .5rem;
}
</style>
