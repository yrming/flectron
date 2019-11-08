<template>
  <div class="login-layout-wrapper">
    <a-layout v-if="!loading" class="login-layout">
      <a-layout-content style="padding: 64px">
        <div class="login-top">
          <!-- <img src="@/assets/logo.png" alt="" /> -->
          FLECTRON
        </div>
        <a-form :form="form" class="login-form" @submit="handleSubmit">
          <a-form-item>
            <a-input
              v-decorator="[
                'userName',
                {
                  rules: [{ required: true, message: '请输入你的账号' }]
                }
              ]"
              placeholder="账号"
            >
              <a-icon
                slot="prefix"
                type="user"
                style="color: rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              v-decorator="[
                'password',
                {
                  rules: [{ required: true, message: '请输入你的密码' }]
                }
              ]"
              type="password"
              placeholder="密码"
            >
              <a-icon
                slot="prefix"
                type="lock"
                style="color: rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-checkbox
              v-decorator="[
                'remember',
                {
                  valuePropName: 'checked',
                  initialValue: true
                }
              ]"
            >
              自动登录
            </a-checkbox>
            <a class="login-form-forgot" @click="forgetPwdClick">
              忘记密码
            </a>
            <a-button
              type="primary"
              html-type="submit"
              class="login-form-button"
              :loading="sumbitLoading"
            >
              登 录
            </a-button>
          </a-form-item>
        </a-form>
      </a-layout-content>
      <a-layout-footer style="text-align: center;">
        ❤️⭕️⭕️
      </a-layout-footer>
    </a-layout>
    <a-layout v-else>
      <a-spin style="height:100vh;line-height:100vh;" />
    </a-layout>
  </div>
</template>
<script>
import { xauth, setAccount, getAccount } from "@/utils/fanfouService";
import { shell } from "electron";
export default {
  data() {
    return {
      loading: true,
      sumbitLoading: false
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  mounted() {
    let account = getAccount();
    if (account && account.token) {
      this.$router.replace({ path: "/home" });
    } else {
      this.loading = false;
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.sumbitLoading = true;
          (async () => {
            let userInfo = await xauth(values.userName, values.password);
            if (!userInfo) {
              this.$message.error("登录失败，账号或密码错误");
              this.sumbitLoading = false;
            } else {
              userInfo._remember = values.remember;
              setAccount(userInfo);
              this.$router.replace({ path: "/home" });
            }
          })();
        }
      });
    },
    forgetPwdClick() {
      shell.openExternal("http://fanfou.com/reset");
    }
  }
};
</script>
<style lang="less" scoped>
.login-layout {
  -webkit-app-region: drag;
  background-image: url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg);
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  .login-top {
    height: 44px;
    line-height: 44px;
    margin-top: 12px;
    margin-bottom: 40px;
    text-align: center;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    font-size: 33px;
    img {
      height: 44px;
      margin-right: 16px;
      vertical-align: top;
    }
  }
  .login-form {
    width: 300px;
    margin: 0 auto;
  }
  .login-form-forgot {
    float: right;
  }
  .login-form-button {
    width: 100%;
  }
}
</style>
