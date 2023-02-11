import { serialize, CookieSerializeOptions } from "cookie";
import { NextApiResponse } from "next";

/**
 * This sets `cookie` using the `res` object
 */

export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) => {
  const stringValue =
    typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

  if (typeof options.maxAge === "number") {
    options.expires = new Date(Date.now() + options.maxAge * 1000);
  }
  res.setHeader("Set-Cookie", serialize(name, stringValue, options));
};
/**
 * 删除cookie
 * @param res
 * @param name
 * @param options
 */
export const deleteCookie = (
  res: NextApiResponse,
  name: string,
  options: CookieSerializeOptions = {}
) => {
  options.expires = new Date("1970");
  options.maxAge = -1;

  res.setHeader("Set-Cookie", serialize(name, "deleted", options));
};
