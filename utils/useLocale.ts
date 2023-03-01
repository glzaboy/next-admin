import defaultLocale from "@/locale";
import { selectGlobal } from "@/modules/global";
import { useAppSelector } from "@/modules/store";

/**
 * 获取用户翻译项目
 * @param locale 语言翻译文件
 * @returns 翻译项目
 */
function useLocale(locale: any = null): Record<string, string> {
  return (locale || defaultLocale)[useLocaleName()] || {};
}
/**
 * 返回客户端使用语言名称
 * @returns 语言名称
 */
export function useLocaleName(): string {
  const globalState = useAppSelector(selectGlobal);

  return globalState.lang || "zh-CN";
}
export function locale(
  locale: any = null,
  lang: string
): Record<string, string> {
  return (locale || defaultLocale)[lang || "zh-CN"] || {};
}
export default useLocale;
