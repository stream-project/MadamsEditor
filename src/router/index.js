import { createRouter, createWebHistory } from 'vue-router'
import EditorView from '../views/editor-view.vue'
import FilesView from '../views/files-view.vue'

const routes = [
  {
    path: '/',
    name: 'EditorView',
    component: EditorView
  },
  {
    path: '/files',
    name: 'FilesView',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: FilesView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router