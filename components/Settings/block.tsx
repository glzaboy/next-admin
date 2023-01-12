import React, { ReactNode } from "react";
import { Switch, Divider, InputNumber } from "@arco-design/web-react";
import { useAppSelector, useAppDispatch } from "@/modules/store";
import { selectGlobal, updateSettings } from "@/modules/global";
import useLocale from "@/utils/useLocale";
import styles from "./style/block.module.less";

export interface BlockProps {
  title?: ReactNode;
  options?: {
    name: string;
    value:
      | "colorWeek"
      | "navbar"
      | "menu"
      | "footer"
      | "themeColor"
      | "menuWidth";
    type?: "switch" | "number";
  }[];
  children?: ReactNode;
}

export default function Block(props: BlockProps) {
  const globalState = useAppSelector(selectGlobal);
  const dispatch = useAppDispatch();

  const { title, options, children } = props;
  const locale = useLocale();
  const { settings: setting } = globalState;
  console.log(setting);

  return (
    <div className={styles.block}>
      <h5 className={styles.title}>{title}</h5>
      {options &&
        options.map((option) => {
          const type = option.type || "switch";

          return (
            <div className={styles["switch-wrapper"]} key={option.value}>
              <span>{locale[option.name]}</span>
              {type === "switch" && setting != undefined && (
                <Switch
                  size="small"
                  checked={!!setting[option.value]}
                  onChange={(checked) => {
                    const newSetting = {
                      ...setting,
                      [option.value]: checked,
                    };
                    dispatch(
                      updateSettings({
                        settings: newSetting,
                      })
                    );
                    // set color week
                    if (checked && option.value === "colorWeek") {
                      document.body.style.filter = "invert(80%)";
                    }
                    if (!checked && option.value === "colorWeek") {
                      document.body.style.filter = "none";
                    }
                  }}
                />
              )}
              {type === "number" && setting != undefined && (
                <InputNumber
                  style={{ width: 80 }}
                  size="small"
                  value={setting?.menuWidth}
                  onChange={(value) => {
                    const newSetting = {
                      ...setting,
                      [option.value]: value,
                    };
                    dispatch(
                      updateSettings({
                        settings: newSetting,
                      })
                    );
                  }}
                />
              )}
            </div>
          );
        })}
      {children}
      <Divider />
    </div>
  );
}
