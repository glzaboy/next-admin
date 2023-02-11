import { createHash } from "crypto";
import type { Hash } from "crypto";
import { sign, verify } from "jsonwebtoken";
import type { Jwt, JwtPayload } from "jsonwebtoken";

/**
 * md5加密
 * @param str 加密串
 * @returns md5 32位小写hex格式
 */
export function md5(str: string): string {
  const hash: Hash = createHash("md5");
  return hash.update(str, "utf-8").digest("hex");
}
/**
 * 生成随机字符串
 * @param len 字符串长度
 * @returns
 */
export const randomString = (len: number): string => {
  len = len || 32;
  const baseString =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var ret = "";
  for (; len > 0; len--) {
    ret += baseString.charAt(Math.floor(Math.random() * baseString.length));
  }
  return ret;
};
/**
 * 密码加密
 * @param password 原密码
 * @returns 加密后的密码
 */
export const encodePassword = (password: string): string => {
  var max: number = 20;
  var min: number = 2;
  const salt = randomString(5);
  var times: number = Math.floor(Math.random() * (max - min) + min);
  var tmpPasswd = password;
  for (var i = 0; i < times; i++) {
    tmpPasswd = md5(salt + tmpPasswd);
  }
  return `$md5\$${times}\$${salt}\$${tmpPasswd}`;
};
/**
 * 验证密码
 * @param password 原始密码
 * @param encodedPassword 加密后的密码
 * @returns true 密码一致，false 密码不一致
 */
export const validPassword = (
  password: string,
  encodedPassword: string
): boolean => {
  const passwordSplit = encodedPassword.split("$");
  if (passwordSplit.length != 5) {
    return false;
  }
  if (passwordSplit[1] != "md5") {
    return false;
  }
  const times = parseInt(passwordSplit[2]);
  const salt = passwordSplit[3];
  var tmpPasswd = password;
  for (var i = 0; i < times; i++) {
    tmpPasswd = md5(salt + tmpPasswd);
  }
  return tmpPasswd === passwordSplit[4];
};
/**
 * Jwt签名
 * @param payload 数据
 * @param expiresIn 有效期
 * @returns 签名结果
 */
export const signJwt = (
  payload: string | object,
  expiresIn?: string
): string => {
  return sign(payload, process.env.JWT || "jwt", {
    algorithm: "HS256",
    expiresIn: expiresIn ?? "1 days",
  });
};
/**
 * Jwt数据校验
 * @param token token
 * @returns 验证结果
 */
export const verifyJwt = (token: string): Jwt | JwtPayload | string => {
  return verify(token, process.env.JWT || "jwt", { algorithms: ["HS256"] });
};
