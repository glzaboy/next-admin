import React from "react";
import { Trigger, Typography } from "@arco-design/web-react";
import { SketchPicker } from "react-color";
import { generate, getRgbStr } from "@arco-design/color";
import { useAppSelector, useAppDispatch } from "@/modules/store";
import { selectGlobal, updateSettings } from "@/modules/global";
import useLocale from "@/utils/useLocale";
import styles from "./style/color-panel.module.less";

function ColorPanel() {
  const globalState = useAppSelector(selectGlobal);
  const dispatch = useAppDispatch();
  const theme =
    document.querySelector("body")?.getAttribute("arco-theme") || "light";
  const { settings } = globalState;
  const locale = useLocale();
  const themeColor = settings?.themeColor;
  const list = generate(themeColor || "", {
    list: true,
    dark: theme === "dark",
  });
  return (
    <div>
      <Trigger
        trigger="hover"
        position="bl"
        popup={() => (
          <SketchPicker
            color={themeColor}
            onChangeComplete={(color) => {
              const newColor = color.hex;
              if (settings) {
                dispatch(
                  updateSettings({
                    settings: { ...settings, themeColor: newColor },
                  })
                );
              }

              const newList = generate(newColor, {
                list: true,
                dark: theme === "dark",
              });
              newList.forEach((l: string, index: number) => {
                const rgbStr = getRgbStr(l);
                document.body.style.setProperty(
                  `--arcoblue-${index + 1}`,
                  rgbStr
                );
              });
            }}
          />
        )}
      >
        <div className={styles.input}>
          <div
            className={styles.color}
            style={{ backgroundColor: themeColor }}
          />
          <span>{themeColor}</span>
        </div>
      </Trigger>
      <ul className={styles.ul}>
        {list.map((item: string, index: number) => (
          <li
            key={index}
            className={styles.li}
            style={{ backgroundColor: item }}
          />
        ))}
      </ul>
      <Typography.Paragraph style={{ fontSize: 12 }}>
        {locale["settings.color.tooltip"]}
      </Typography.Paragraph>
    </div>
  );
}

export default ColorPanel;
