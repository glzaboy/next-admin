import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import defaultSettings from "../settings.json";

// import { version } from "../../../package.json";

const namespace = "global";

export interface GlobalState {
  settings?: typeof defaultSettings;
  userInfo?: {
    name?: string;
    avatar?: string;
    job?: string;
    organization?: string;
    location?: string;
    email?: string;
    permissions: Record<string, string[]>;
  };
  userLoading?: boolean;
  lang?: string;
  theme?: string;
}

const initialState: GlobalState = {
  settings: defaultSettings,
  userInfo: {
    permissions: {},
  },
};
// 创建带有命名空间的reducer
const globalSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<GlobalState>) => {
      const { settings } = action.payload;
      state.settings = settings;
    },
    updateUserInfo: (state, action: PayloadAction<GlobalState>) => {
      const { userInfo = initialState.userInfo, userLoading } = action.payload;
      state.userInfo = userInfo;
      state.userLoading = userLoading;
    },
    setLang: (state, action: PayloadAction<GlobalState>) => {
      const { lang } = action.payload;
      state.lang = lang;
    },
    setTheme: (state, action: PayloadAction<GlobalState>) => {
      const { theme } = action.payload;
      state.theme = theme;
    },
  },
  extraReducers: () => {},
});

export const selectGlobal = (state: RootState) => state.global;

export const { updateSettings, updateUserInfo, setLang, setTheme } =
  globalSlice.actions;

export default globalSlice.reducer;
