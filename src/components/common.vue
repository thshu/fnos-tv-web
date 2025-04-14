<script type="text/javascript">
import md5 from 'js-md5';
import axios from 'axios';
import VueCookies from 'vue-cookies';
import Snackbar from 'node-snackbar';
import router from "@/router/index.js";

// 定义一些公共的属性和方法
let title = 'FNOS';
let fnHost = "/fnos";
let apiUrl = `${fnHost}/v`;
let imgUrl = `${apiUrl}/api/v1/sys/img`
const isMo = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

let api_key = "16CCEB3D-AB42-077D-36A1-F355324E4237"

function GetSigin(config) {

  return generateSignature({
    'method': config.method,
    'url': "/v" + config.url,
    'data': config.data ? config.data : {}
  }, api_key);
}


function instanceRequestBase(config) {
  config.headers.authx = GetSigin(config);
  return config;
}

function instanceResponseBase(config) {
  return config;
}

const NoLoginInstance = axios.create({
  baseURL: apiUrl
})
const LoginInstance = axios.create({
  baseURL: apiUrl
})
// 登录使用的拦截器
LoginInstance.interceptors.request.use(
    config => {
      let authorization = VueCookies.get("authorization")
      if (!authorization) {
        console.log('跳转登录页')
        router.push('/login')
      }
      config.headers.Authorization = authorization;
      config = instanceRequestBase(config);
      return config;
    }
)

LoginInstance.interceptors.response.use(
    response => {
      let code = response.data.code
      if (code === -2) {
        console.log(12)
        router.push('/login')
        return
      }
      if (code === 0) {
        return response.data.data;
      }
      return Promise.reject(response);
    },
    error => {
      if (axios.isCancel(error) || error.name === 'CanceledError') {
        return; // 不报错，静默处理
      }
      return Promise.reject(error);
    }
)

// 非登录使用的拦截器
NoLoginInstance.interceptors.request.use(
    config => {
      config = instanceRequestBase(config);
      return config
    }
)

NoLoginInstance.interceptors.response.use(
    response => {
      let code = response.data.code
      if (code === 0) {
        return response.data.data;
      }
      ShowMsg(response.data.msg)
      return Promise.reject(response);
    },
    error => {
      if (axios.isCancel(error) || error.name === 'CanceledError') {
        return; // 不报错，静默处理
      }
      return Promise.reject(error);
    }
)

async function requests(method, uri, isLogin = false, data = {}) {
  let instance = LoginInstance;
  if (!isLogin) {
    instance = NoLoginInstance;
  }
  if (method === "POST") {
    return await instance.post(uri, data)
  } else {
    return await instance.get(uri)
  }

}


function ShowMsg(msg) {
  Snackbar.show({pos: 'top-center', text: msg, showAction: false});
}

function initConfig() {
  if (localStorage.getItem("title") != null) {
    title = localStorage.getItem("title")
  }
  if (localStorage.getItem("img_url") != null) {
    imgUrl = localStorage.getItem("img_url")
    if (process.env.NODE_ENV !== 'production' && localStorage.getItem("img_url").length === 0) {
      imgUrl = apiUrl;
    }
  }
}

function parseUrl(o) {
  const [s, a] = o.split("?")
      , c = a ? a.split("&").reduce((et, tt) => {
        const [rt, st] = tt.split("=");
        return st !== "undefined" && st !== "null" && (et[rt] = st),
            et
      }
      , {}) : {};
  return [s, c]
}

function hashSignatureData(o = "") {
  try {
    const s = o.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
        , a = decodeURIComponent(s);
    return md5(a)
  } catch (s) {
    return console.log(s),
        md5(o)
  }
}

function stringifyParams(o = {}) {
  const s = new URLSearchParams;
  for (const a of Object.keys(o).sort())
    !isUndefined$2(o[a]) && !isNull$1(o[a]) && s.append(a, o[a]);
  return s.toString().replace(/\+/g, "%20")
}

function getRandomNumber(o = 0, s = 100, a = "round") {
  return Math[a](Math.random() * (s - o) + o)
}

function generateSignature(o, s = "") {
  var a;
  try {
    const c = ((a = o == null ? void 0 : o.method) == null ? void 0 : a.toUpperCase()) === "GET"
        , [et, tt] = parseUrl(o.url ?? "")
        , rt = c ? stringifyParams({
      ...o == null ? void 0 : o.params,
      ...tt
    }) : o != null && o.data ? JSON.stringify(o == null ? void 0 : o.data) : ""
        , st = hashSignatureData(rt)
        , it = getRandomNumber(1e5, 1e6).toString().padStart(6, "0")
        , ot = Date.now() + ""
        , lt = ["NDzZTVxnRKP8Z0jXg1VAMonaG8akvh", et, it, ot, st, s].join("_")
        , ct = {
      nonce: it,
      timestamp: ot,
      sign: md5(lt)
    };
    return Object.entries(ct).map(([dt, ht]) => `${dt}=${ht}`).join("&")
  } catch (c) {
    return console.log(c),
        ""
  }
}


initConfig()
// 暴露出这些属性和方法
export default {
  apiUrl,
  title,
  isMo,
  imgUrl,
  ShowMsg,
  requests,
  fnHost
}
</script>