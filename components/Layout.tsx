import { useAppSelector, useAppDispatch } from "../modules/store";
import { selectGlobal, switchScreen, switchTheme } from "../modules/global";

export const LayoutDefault = ({ children }: any) => {
  return <>{children}</>;
};
