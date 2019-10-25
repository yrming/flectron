import Vue from "vue";
import filters from "./filters/index";
import {
  Button,
  Layout,
  Icon,
  Menu,
  Input,
  Form,
  Checkbox,
  Message,
  List,
  Avatar,
  Skeleton,
  Spin,
  Modal,
  Popconfirm,
  Tabs,
  Upload
} from "ant-design-vue";
import { Scroll } from "view-design";
import "view-design/dist/styles/iview.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

Vue.use(Button);
Vue.use(Layout);
Vue.use(Icon);
Vue.use(Menu);
Vue.use(Input);
Vue.use(Form);
Vue.use(Checkbox);
Vue.use(Message);
Vue.use(List);
Vue.use(Avatar);
Vue.use(Skeleton);
Vue.use(Spin);
Vue.use(Modal);
Vue.use(Popconfirm);
Vue.use(Tabs);
Vue.use(Upload);
Vue.component("Scroll", Scroll);
Vue.prototype.$message = Message;
Vue.prototype.$confirm = Modal.confirm;

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
