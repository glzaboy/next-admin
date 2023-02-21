import defaultLocale from "@/locale";
import { selectGlobal } from "@/modules/global";
import { useAppSelector, useAppDispatch } from "@/modules/store";

function useLocale(locale: any = null): Record<string, string> {
  const globalState = useAppSelector(selectGlobal);
  const dispatch = useAppDispatch();

  return (locale || defaultLocale)[globalState.lang || "zh-CN"] || {};
}
export function useLocaleName(locale: any = null): string {
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
