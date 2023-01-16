import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import { isSSR } from "./is";
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
  //   config = getPluginManager().applyPlugins({
  //     key: "request",
  //     type: ApplyPluginsType.modify,
  //     initialValue: {},
  //   });
  return config;
};

const getRequestInstance = (): AxiosInstance => {
  if (requestInstance) return requestInstance;
  const config = getConfig();
  requestInstance = axios.create(config);

  // config?.requestInterceptors?.forEach((interceptor) => {
  //     if(interceptor instanceof Array){
  //         requestInstance.interceptors.request.use((config) => {
  //             const { url } = config;
  //             if(interceptor[0].length === 2){
  //             const { url: newUrl, options } = interceptor[0](url, config);
  //             return { ...options, url: newUrl };
  //             }
  //             return interceptor[0](config);
  //         }, interceptor[1]);
  //         } else {
  //         requestInstance.interceptors.request.use((config) => {
  //             const { url } = config;
  //             if(interceptor.length === 2){
  //             const { url: newUrl, options } = interceptor(url, config);
  //             return { ...options, url: newUrl };
  //             }
  //             return interceptor(config);
  //         })
  //         }
  // });

  // config?.responseInterceptors?.forEach((interceptor) => {
  //     interceptor instanceof Array ?
  //     requestInstance.interceptors.response.use(interceptor[0], interceptor[1]):
  //         requestInstance.interceptors.response.use(interceptor);
  // });

  // 当响应的数据 success 是 false 的时候，抛出 error 以供 errorHandler 处理。
  requestInstance.interceptors.response.use((response) => {
    const { data } = response;
    // if(data?.success === false && config?.errorConfig?.errorThrower){
    //     // config.errorConfig.errorThrower(data);
    // }
    return response;
  });
  return requestInstance;
};
// request 方法 opts 参数的接口
interface IRequestOptions extends AxiosRequestConfig {
  skipErrorHandler?: boolean;
  // requestInterceptors?: IRequestInterceptorTuple[];
  // responseInterceptors?: IResponseInterceptorTuple[];
  [key: string]: any;
}

// interface IRequestOptionsWithResponse extends IRequestOptions {
//   getResponse: true;
// }

// interface IRequestOptionsWithoutResponse extends IRequestOptions {
//   getResponse: false;
// }
interface IRequest {
  //   <T = any>(url: string, opts: IRequestOptionsWithResponse): Promise<
  //     AxiosResponse<T>
  //   >;
  //   <T = any>(url: string, opts: IRequestOptionsWithoutResponse): Promise<T>;
  <T = any>(url: string, opts: IRequestOptions): Promise<T>; // getResponse 默认是 false， 因此不提供该参数时，只返回 data
  <T = any>(url: string): Promise<T>; // 不提供 opts 时，默认使用 'GET' method，并且默认返回 data
}

const request: IRequest = (url: string, opts: any = { method: "GET" }) => {
  const requestInstance = getRequestInstance();
  const config = getConfig();
  const {
    getResponse = false,
    requestInterceptors,
    responseInterceptors,
  } = opts;
  //   const requestInterceptorsToEject = requestInterceptors?.map((interceptor) => {
  //     if (interceptor instanceof Array) {
  //       return requestInstance.interceptors.request.use((config) => {
  //         const { url } = config;
  //         if (interceptor[0].length === 2) {
  //           const { url: newUrl, options } = interceptor[0](url, config);
  //           return { ...options, url: newUrl };
  //         }
  //         return interceptor[0](config);
  //       }, interceptor[1]);
  //     } else {
  //       return requestInstance.interceptors.request.use((config) => {
  //         const { url } = config;
  //         if (interceptor.length === 2) {
  //           const { url: newUrl, options } = interceptor(url, config);
  //           return { ...options, url: newUrl };
  //         }
  //         return interceptor(config);
  //       });
  //     }
  //   });
  //   const responseInterceptorsToEject = responseInterceptors?.map(
  //     (interceptor) => {
  //       return interceptor instanceof Array
  //         ? requestInstance.interceptors.response.use(
  //             interceptor[0],
  //             interceptor[1]
  //           )
  //         : requestInstance.interceptors.response.use(interceptor);
  //     }
  //   );
  return new Promise((resolve, reject) => {
    requestInstance
      .request({ ...opts, url })
      .then((res) => {
        // requestInterceptorsToEject?.forEach((interceptor) => {
        //   requestInstance.interceptors.request.eject(interceptor);
        // });
        // responseInterceptorsToEject?.forEach((interceptor) => {
        //   requestInstance.interceptors.response.eject(interceptor);
        // });
        resolve(getResponse ? res : res.data);
      })
      .catch((error) => {
        // requestInterceptorsToEject?.forEach((interceptor) => {
        //   requestInstance.interceptors.request.eject(interceptor);
        // });
        // responseInterceptorsToEject?.forEach((interceptor) => {
        //   requestInstance.interceptors.response.eject(interceptor);
        // });
        try {
          //   const handler = config?.errorConfig?.errorHandler;
          //   if (handler) handler(error, opts, config);
        } catch (e) {
          reject(e);
        }
        reject(error);
      });
  });
};
export { request, getRequestInstance };

export type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  //   RequestError,
  //   IResponseInterceptor as ResponseInterceptor,
  IRequestOptions as RequestOptions,
  IRequest as Request,
};
