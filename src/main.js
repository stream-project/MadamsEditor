import { createApp } from 'vue'
import App from './App.vue'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import BootstrapIcon from '@dvuckovic/vue3-bootstrap-icons'

createApp(App).component('BootstrapIcon', BootstrapIcon).use(VueSweetalert2).mount('#app')
