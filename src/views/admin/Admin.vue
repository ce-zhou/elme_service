<template>
  <div class="main">
    <div class="top">
      <div @click="getImg">
        <img v-if="admin.imageUrl" :src="admin.imageUrl" class="avatar" />
        <img
          class="avatar"
          v-else
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
          alt=""
        />
      </div>
      <span>{{admin.myList.username}}服务中~</span>
    </div>
    <button @click="goHome">聊天</button>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { reactive, getCurrentInstance } from "vue";
import axios from "../../api/http.js";
import Qs from "qs";
import { useRouter } from "vue-router";

let inputElement = null;
const store = useStore();
const router = useRouter();
const {proxy} = getCurrentInstance();
const socket = proxy.$socket;
const admin = reactive({
  imageUrl: null,
  myList: {},
});

async function initData() {
  admin.imageUrl = window.localStorage.getItem("avatar");
  // 获取用户信息
  const { data: res } = await axios({
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "get",
    url: "http://localhost:3000/my/userinfo",
  });
  console.log(res);
  admin.myList = res.data;
  store.commit("setMyinfo", res.data);
}
initData();

function getImg() {
  if (inputElement === null) {
    inputElement = document.createElement("input");
    inputElement.setAttribute("type", "file");
    inputElement.style.display = "none";
  }
  if (window.addEventListener) {
    inputElement.addEventListener("change", uploadFile, false);
  } else {
    inputElement.attachEvent("onchange", uploadFile);
  }
  document.body.appendChild(inputElement);
  inputElement.click();
}

async function uploadFile(el) {
  if (el && el.target && el.target.files && el.target.files.length > 0) {
    const files = el.target.files[0];
    const isLt2M = files.size / 1024 / 1024 < 2;
    const size = files.size / 1024 / 1024;
    // 判断上传文件的大小
    if (!isLt2M) {
      tElMessage.error("上传头像图片大小不能超过 2MB!");
    } else if (files.type.indexOf("image") === -1) {
      //如果不是图片格式
      // this.$dialog.toast({ mes: '请选择图片文件' });
      ElMessage.error("请选择图片文件");
    } else {
      const reader = new FileReader(); // 创建读取文件对象
      reader.readAsDataURL(el.target.files[0]); // 发起异步请求，读取文件
      reader.onload = async function () {
        // 文件读取完成后
        // 读取完成后，将结果赋值给img的src
        admin.imageUrl = this.result;
        // 数据传到后台
        const base64String = admin.imageUrl;
        //这里对base64串进行操作，去掉url头，并转换为byte
        const bytes = window.atob(base64String.split(",")[1]);
        const ab = new ArrayBuffer(bytes.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < bytes.length; i++) {
          ia[i] = bytes.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: "image/jpeg" });
        const formData = new FormData();
        formData.append("file", blob, Date.now() + ".jpg");
        let params = {
          avatar: admin.imageUrl,
        };
        const { data: res } = await axios({
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "post",
          url: "http://localhost:3000/my/update/avatar",
          data: Qs.stringify(params),
        });
        window.localStorage.setItem("avatar", admin.imageUrl);
      };
    }
  }
}

function goHome() {
  socket.connect();
  socket.emit("login", { name: admin.myList.username, avatar: admin.myList.user_pic }, (results) => {
    if (results) {
      ElMessage.success("用户登陆成功");
    } else {
      ElMessage.error("用户登陆失败");
    }
  });
  socket.on("login", (data) => {
    data.forEach(item=> {
      store.state.userList.push(item)
    })
    
  });
  router.push("/home");
}
</script>

<style lang="less" scoped>
.main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 400px;
  background-color: #eee;
}
.top {
  display: flex;
  align-items: center;
  width: 100%;
  height: 80px;
  background-color: #41a5ee;
  color: #fff;
  font-size: 30px;
  font-weight: 700;
  .avatar {
    width: 60px;
    border-radius: 50%;
    margin: 0 20px;
  }
}
</style>