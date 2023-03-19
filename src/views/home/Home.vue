<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="240px">
        <el-row style="height: 60px; line-height: 60px">
          <div class="myinfo">
            <el-avatar :src="home.avatar"></el-avatar>
            <span>{{ myInfo.username }}</span>
          </div>
        </el-row>
        <el-row style="height: 50px">
          <el-input
            v-model="home.keyword"
            placeholder="Pick a date"
            :prefix-icon="Search"
          />
        </el-row>
        <el-row>
          <el-table
            :data="
              userList.filter(
                (data) =>
                  (!home.keyword ||
                    data.name
                      .toLowerCase()
                      .includes(home.keyword.toLowerCase())) &&
                  !data.name
                    .toLowerCase()
                    .includes(myInfo.username.toLowerCase())
              )
            "
            style="width: 100%"
          >
            <el-table-column label="好友列表">
              <template #default="scope">
                <div @click="setUserinfo(scope.row)">
                  <el-avatar :src="scope.row.img"></el-avatar>
                  <span class="name">{{ scope.row.name }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-aside>
      <el-container>
        <el-header style="text-align: center">
          <span>{{ home.username }}</span>
        </el-header>
        <el-main>
          <div class="container" v-if="home.msgList">
            <div v-for="(list, index) in home.msgList" :key="index">
              <div
                v-if="
                  list.receiver == home.username && home.username == '默认群聊'
                "
              >
                <p :class="{ right: list.type == 'my' }">
                  <el-avatar
                    v-if="list.type == 'user'"
                    :src="list.senderimg"
                  ></el-avatar>
                  <el-avatar
                    v-if="list.type == 'my'"
                    :src="list.senderimg"
                    style="float: right"
                  ></el-avatar>
                  <span class="content">{{ list.msg }}</span>
                </p>
              </div>
              <div v-else>
                <!-- 根据接收者和发送者定位聊天记录 -->
                <div
                  v-if="
                    (list.receiver == myInfo.username &&
                      list.sender == home.username) ||
                    (list.receiver == home.username &&
                      list.sender == myInfo.username)
                  "
                >
                  <!-- 再循环显示聊天记录 -->
                  <p :class="{ right: list.type == 'my' }">
                    <el-avatar
                      v-if="list.type == 'user'"
                      :src="list.senderimg"
                      class="user"
                    ></el-avatar>
                    <el-avatar
                      v-if="list.type == 'my'"
                      :src="list.senderimg"
                      style="float: right"
                      class="my"
                    ></el-avatar>
                    <span class="content">{{ list.msg }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </el-main>
        <el-footer>
          <el-input
            v-model="home.inputValue"
            placeholder="Please input"
            clearable
            @keyup.enter="send"
            @focus="home.exeute = true"
          />
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance } from "vue";
import { useStore } from "vuex";

const store = useStore();
const { proxy } = getCurrentInstance();
const socket = proxy.$socket;
const userList = store.state.userList;
const myInfo = store.state.myinfo;
const home = reactive({
  inputValue: "", // 输入框内容
  keyword: "", // 搜索框
  username: "",
  msgList: [],
  img: "",
  avatar: window.localStorage.getItem("avatar"),
  exeute: true,
});


socket.on("messageList", (data)=> {
  console.log(home.exeute);
    if (home.exeute) {
      console.log('ok');
      // store.commit("updateChatMessageList", data);
      home.msgList.push(data);
    }
})


function send() {
  /* 发送消息 */
  // 判断是群聊还是私聊
  home.exeute = false;
  if (store.state.chatType == "group") {
    let data = {
      type: "my",
      sender: myInfo.username, //发送者id
      senderimg: myInfo.user_pic, //发送者的img
      receiver: "默认群聊", //接收方id
      // time: time.toLocaleString(), //发送时间
      msg: home.inputValue, //消息内容
    };
    socket.emit("groupChat", data);
    // store.commit("updateChatMessageList", data);
    home.msgList.push(data);
    console.log(home.msgList);
  } else {
    let data = {
      type: "my",
      sender: myInfo.username, //发送者id
      senderimg: myInfo.user_pic, //发送者的img
      receiver: home.username, //接收方id
      // time: time.toLocaleString(), //发送时间
      msg: home.inputValue, //消息内容
    };
    home.msgList.push(data);
    socket.emit("privateChat", data);
  }
  /* 清空输入框 */
  home.inputValue = "";
}

function setUserinfo(row) {
  if (row.name == "默认群聊") {
    store.commit("changeChatType", "group");
  } else {
    store.commit("changeChatType", "private");
  }
  store.commit("setUserinfo", row);
  home.username = store.state.userinfo.name;
  home.img = store.state.userinfo.img;
}
</script>

<style lang="less" scoped>
.common-layout {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 900px;
  height: 500px;
}
.el-container {
  height: 100%;
  .el-aside {
    background-color: #d3dce6;
    /deep/.el-row {
      display: block;
      text-align: center;
    }
    .name {
      margin-left: 20px;
    }
  }
  .el-main {
    background-color: #e9eef3;

    .container {
      width: 100%;
    }
    .container P {
      width: 100%;
      height: 50px;
      line-height: 50px;
    }
    .content {
      background-color: antiquewhite;
      padding: 10px;
      border-radius: 10px;
      font-weight: bold;
    }
    .right {
      text-align: right;
    }
  }
  .el-header,
  .el-footer {
    line-height: 60px;
    background-color: #b3c0d1;
  }
  .el-input {
    height: 40px;
  }
  .myinfo {
    text-align: left;
    vertical-align: middle;
    margin-top: 10px;
    margin-left: 10px;
  }
  .myinfo span {
    margin-left: 20px;
    text-align: left;
    vertical-align: middle;
  }
}
.user {
  margin-right: 10px;
}
.my {
  margin-left: 10px;
}
</style>