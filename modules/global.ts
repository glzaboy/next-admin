import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
// import { version } from "../../../package.json";

const namespace = "global";

export interface IGlobalState {
  /**
   * 当前屏幕尺寸
   */
  currentScreen?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  /**
   * 设备类型
   */
  screenType?: "pc" | "mobile" | "table";
  /**
   * 菜单状态
   */
  menuStatus?: "collapsed" | "hide" | "expand";
  /**
   * 主题色
   */
  themeColor?: "system" | "light" | "dark";
}

const initialState: IGlobalState = {
  menuStatus: "collapsed",
  themeColor: "system",
};

// 创建带有命名空间的reducer
const globalSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    switchScreen: (state, action: PayloadAction<IGlobalState>) => {
      if (action?.payload?.menuStatus != undefined) {
        state.menuStatus = action.payload.menuStatus;
      }
      if (action?.payload?.screenType != undefined) {
        state.screenType = action.payload.screenType;
      }
      if (action?.payload?.currentScreen != undefined) {
        state.currentScreen = action.payload.currentScreen;
      }
    },
    switchTheme: (state, action: PayloadAction<IGlobalState>) => {
      // console.log(action);
      if (action?.payload?.themeColor != undefined) {
        state.themeColor = action.payload.themeColor;
      }
    },
  },
  extraReducers: () => {},
});

export const selectGlobal = (state: RootState) => state.global;

export const { switchScreen, switchTheme } = globalSlice.actions;

export default globalSlice.reducer;
