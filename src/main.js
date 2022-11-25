import { createApp } from 'vue'
import App from './App.vue'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import BootstrapIcon from '@dvuckovic/vue3-bootstrap-icons'
import router from './router'
//import LaravelVuePagination from 'laravel-vue-pagination';
import Paginate from "vuejs-paginate-next";


const app = createApp(App)
app.component('BootstrapIcon', BootstrapIcon)
app.use(router)
app.use(VueSweetalert2)
app.use(Paginate)
app.mount('#app')
