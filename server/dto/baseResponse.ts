export type apiResponse = {
  /**
   * 错误码，非 0 表示失败
   */
  code: number;
  /**
   * 错误描述
   */
  msg: string;
};

type api2 = { ca: string } | apiResponse;

const a: api2 = { code: 2, msg: "fdf", ca: "fd" };
