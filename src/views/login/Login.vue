<template>
  <div class="main">
    <img src="../../images/background.png" alt="" />
    <section class="login_container">
      <img src="../../images/service.png" alt="" />
      <el-form
        ref="ruleFormRef"
        :model="login"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <el-input v-model="login.username" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="login.password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="submit(ruleFormRef)">登录</el-button>
        </el-form-item>
        <el-form-item class="lastone" prop="type">
          <el-checkbox-group v-model="login.type">
            <el-checkbox label="自动登录" name="type" />
          </el-checkbox-group>
          <span class="zhuce">免费注册</span>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from "vue";
import axios from "../../api/http.js";
import Qs from "qs";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();
const ruleFormRef = ref();
const { proxy } = getCurrentInstance();
const socket = proxy.$socket;
const login = reactive({
  username: "", // 用户名
  password: "", // 用户注册密码
  type: "", // 多选框
  avatar: window.localStorage.getItem("avatar"),
});

const rules = reactive({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 1, max: 10, message: "用户名长度在1到10之间", trigger: "blur" },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
    { min: 6, max: 12, message: "密码长度在6到12之间", trigger: "blur" },
  ],
});
function submit(formEl) {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      let params = {
        username: login.username,
        password: login.password,
      };
      const { data: res } = await axios({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "post",
        url: "http://localhost:3000/api/login",
        data: Qs.stringify(params),
      });
      if (res.status !== 0) {
        ElMessage.error(res.message);
      } else {
        window.localStorage.setItem("accessToken", res.accessToken);
        window.localStorage.setItem("refreshToken", res.refreshToken);
        router.push({ path: "/" });
      }
    }
  });
}
</script>

<style lang="less" scoped>
.main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 620px;
  height: 440px;
  background-color: #d9e6ff;
  img {
    position: absolute;
    bottom: 20px;
    left: 20px;
    width: 290px;
  }
}
.login_container {
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  width: 240px;
  height: 340px;
  padding: 20px;
  background-color: #fff;
  img {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translate(-50%);
    width: 40px;
  }
  .zhuce {
    color: #3d7fff;
    margin-left: 60px;
    cursor: pointer;
  }
}
/deep/.el-form {
  margin-top: 80px;
}
/deep/.el-input {
  width: 220px;
}
/deep/.el-form-item__content {
  margin-left: 0 !important;
}
/deep/ .el-button {
  width: 100%;
  background-color: #5790ff;
}
</style>