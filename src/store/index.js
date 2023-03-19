import { createStore } from "vuex";

export default createStore({
  state: {
    myinfo: {} /* 我的信息 */,
    userinfo: {}, // 他人信息,
    userList: [
      {
        name: "默认群聊",
        img: "https://pic1.zhimg.com/50/v2-adfacac8307b48531d4e341a6090aa03_hd.jpg?source=1940ef5c",
      },
    ],
    chatType: "", // 聊天类型
    chatMessageList: [], // 聊天列表
  },
  mutations: {
    setMyinfo(state, data1) {
      state.myinfo = data1;
    },
    setUserinfo(state, data) {
      state.userinfo = data;
    },
    /* 修改聊天类型 */
    changeChatType(state, data) {
      state.chatType = data;
    },
    updateChatMessageList(state, data) {
    //   var finduser = false;
      /* 数据处理：先找到自己的聊天记录 */
      /* state.chatMessageList.forEach((list) => {
        if (list.username == data.username) {
          finduser = true;
          list.list.push(data.list);
        }
      }); */
      state.chatMessageList.push(data);
    },
  },
});
