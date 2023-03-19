import axios from "axios";
import Qs from "qs";

axios.interceptors.request.use(
  (config) => {
    let accessToken = window.localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = accessToken;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

//标志当前是否正在刷洗token
let isNotRefreshing = true;
axios.interceptors.response.use(async (response) => {
  let refreshToken = window.localStorage.getItem("refreshToken");
  if (response.data.status == 403) {
    // const config = res.config;
    if (isNotRefreshing) {
      isNotRefreshing = false;
      let params = {
        refresh_token: window.localStorage.getItem("refreshToken"),
      };
      const { data: res } = await axios({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "post",
        url: "http://localhost:3000/api/refresh",
        data: Qs.stringify(params),
      });
      if (res.status == 400 || res.status == 402) {
        window.localStorage.removeItem("refreshToken");
        window.localStorage.removeItem("accessToken");
        window.location.href = "/login";
      } else if (res.status == 0) {
        let accessToken = res.accessToken
        window.localStorage.setItem("refreshToken", refreshToken);
        window.localStorage.setItem("accessToken", accessToken);
      }
    }
  }
  return response;
});

export default axios;
