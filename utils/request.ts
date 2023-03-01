import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import { isSSR } from "./is";
import { Message } from "@arco-design/web-react";
import requestLocale from "@/locale/request";
import { locale } from "@/utils/useLocale";
export interface RequestConfig<T = any> extends AxiosRequestConfig {
  //   errorConfig?: {
  //     errorHandler?: IErrorHandler;
  //     errorThrower?: (res: T) => void;
  //   };
  //   requestInterceptors?: IRequestInterceptorTuple[];
  //   responseInterceptors?: IResponseInterceptorTuple[];
}

let requestInstance: AxiosInstance;
let config: RequestConfig;
const getConfig = (): RequestConfig => {
  if (config) return config;
  config = {};
  return config;
};

const getRequestInstance = (): AxiosInstance => {
  if (requestInstance) return requestInstance;
  const config = getConfig();
  requestInstance = axios.create(config);

  // 当响应的数据 success 是 false 的时候，抛出 error 以供 errorHandler 处理。
  // requestInstance.interceptors.response.use((response) => {
  //   const { data } = response;
  //   // if(data?.success === false && config?.errorConfig?.errorThrower){
  //   //     // config.errorConfig.errorThrower(data);
  //   // }
  //   return response;
  // });
  return requestInstance;
};
// request 方法 opts 参数的接口
interface IRequestOptions extends AxiosRequestConfig {
  skipErrorHandler?: boolean;
  // requestInterceptors?: IRequestInterceptorTuple[];
  // responseInterceptors?: IResponseInterceptorTuple[];
  [key: string]: any;
  lang?: string;
}

// interface IRequestOptionsWithResponse extends IRequestOptions {
//   getResponse: true;
// }

// interface IRequestOptionsWithoutResponse extends IRequestOptions {
//   getResponse: false;
// }
interface IRequest {
  <T = any>(url: string, opts: IRequestOptions): Promise<T>; // getResponse 默认是 false， 因此不提供该参数时，只返回 data
  <T = any>(url: string): Promise<T>; // 不提供 opts 时，默认使用 'GET' method，并且默认返回 data
}

const request: IRequest = (
  url: string,
  opts: IRequestOptions = { method: "GET" }
) => {
  const t = locale(requestLocale, opts.lang || "zh-CN");
  if (isSSR) {
    if (url.startsWith("http://") || url.startsWith("https://")) {
    } else {
      url = "http://localhost:3000/" + url;
    }
  }
  const requestInstance = getRequestInstance();
  return new Promise((resolve, reject) => {
    requestInstance
      .request({ ...opts, url })
      .then((res) => {
        const data = res.data;
        if (data.code != 0) {
          reject(data.msg);
        }
        resolve(res.data);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          reject(
            t["request.server.unavailable"] +
              error.response.status +
              " " +
              error.response.statusText
          );
        } else if (error.request) {
          reject(t["request.server.network.error"] + error.request);
        } else {
          reject(t["request.server.retry"] + error);
        }
      });
  });
};
/**
 * UI请求，异常消息信息提示
 * @param url url
 * @param opts 参数
 * @returns
 */
const requestMsg: IRequest = (
  url: string,
  opts: IRequestOptions = { method: "GET" }
) => {
  const t = locale(requestLocale, opts.lang || "zh-CN");
  const requestInstance = getRequestInstance();
  return new Promise((resolve, reject) => {
    if (isSSR) {
      reject(t["request.browsers.only"]);
    }
    requestInstance
      .request({ ...opts, url })
      .then((res) => {
        const data = res.data;
        if (data.code != 0) {
          Message.error(data.msg);
          reject(data.msg);
        }
        resolve(res.data);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          Message.error(
            t["request.server.unavailable"] + " " + error.response.statusText
          );
          reject(
            t["request.server.unavailable"] +
              error.response.status +
              " " +
              error.response.statusText
          );
        } else if (error.request) {
          Message.error(
            t["request.server.network.error"] + " " + error.request
          );
          reject(t["request.server.network.error"] + error.request);
        } else {
          Message.error(t["request.server.retry"] + " " + error);
          reject(t["request.server.retry"] + error);
        }
      });
  });
};

export { request, requestMsg, getRequestInstance };

export type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  IRequestOptions as RequestOptions,
  IRequest as Request,
};
