import React, { useEffect } from "react";
import {
  Tooltip,
  Input,
  Avatar,
  Select,
  Dropdown,
  Menu,
  Divider,
  Message,
  Button,
} from "@arco-design/web-react";
import {
  IconLanguage,
  IconNotification,
  IconSunFill,
  IconMoonFill,
  IconUser,
  IconSettings,
  IconPoweroff,
  IconExperiment,
  IconDashboard,
  IconInteraction,
  IconTag,
  IconLoading,
} from "@arco-design/web-react/icon";
import { useAppSelector, useAppDispatch } from "../../modules/store";
import {
  selectGlobal,
  setLang,
  setTheme,
  updateUserInfo,
  updateUserReq,
} from "@/modules/global";
import Logo from "@/public/assets/logo.svg";
import MessageBox from "../MessageBox";
import IconButton from "./IconButton";
import Settings from "../Settings";
import styles from "./style/index.module.less";
import useStorage from "@/utils/useStorage";
import useLocale from "@/utils/useLocale";
import { generatePermission } from "@/routes";
import { requestMsg } from "@/utils/request";
import { apiResponse } from "@/server/dto/baseResponse";
import Link from "next/link";

function Navbar({ show }: { show: boolean }) {
  const globalState = useAppSelector(selectGlobal);
  const dispatch = useAppDispatch();

  const t = useLocale();
  const { userInfo, userLoading, lang, theme } = globalState;

  const [role, setRole] = useStorage("userRole", "admin");

  function logout() {
    requestMsg<apiResponse>("/api/logout").then((res) => {
      dispatch(updateUserReq());
    });
  }

  function onMenuItemClick(key: string) {
    if (key === "logout") {
      logout();
    } else {
      Message.info(`You clicked ${key}`);
    }
  }

  useEffect(() => {
    dispatch(
      updateUserInfo({
        userInfo: {
          ...userInfo,
          permissions: generatePermission(role || ""),
        },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  if (!show) {
    return (
      <div className={styles["fixed-settings"]}>
        <Settings
          trigger={
            <Button icon={<IconSettings />} type="primary" size="large" />
          }
        />
      </div>
    );
  }

  const handleChangeRole = () => {
    const newRole = role === "admin" ? "user" : "admin";
    setRole(newRole);
  };

  const droplist = (
    <Menu onClickMenuItem={onMenuItemClick}>
      <Menu.SubMenu
        key="role"
        title={
          <>
            <IconUser className={styles["dropdown-icon"]} />
            <span className={styles["user-role"]}>
              {role === "admin"
                ? t["menu.user.role.admin"]
                : t["menu.user.role.user"]}
            </span>
          </>
        }
      >
        <Menu.Item onClick={handleChangeRole} key="switch role">
          <IconTag className={styles["dropdown-icon"]} />
          {t["menu.user.switchRoles"]}
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="setting">
        <IconSettings className={styles["dropdown-icon"]} />
        {t["menu.user.setting"]}
      </Menu.Item>
      <Menu.SubMenu
        key="more"
        title={
          <div style={{ width: 80 }}>
            <IconExperiment className={styles["dropdown-icon"]} />
            {t["message.seeMore"]}
          </div>
        }
      >
        <Menu.Item key="workplace">
          <IconDashboard className={styles["dropdown-icon"]} />
          {t["menu.dashboard.workplace"]}
        </Menu.Item>
        <Menu.Item key="card list">
          <IconInteraction className={styles["dropdown-icon"]} />
          {t["menu.list.cardList"]}
        </Menu.Item>
      </Menu.SubMenu>

      <Divider style={{ margin: "4px 0" }} />
      <Menu.Item key="logout">
        <IconPoweroff className={styles["dropdown-icon"]} />
        {t["navbar.logout"]}
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <Link href="/">
            <Logo />
          </Link>
          <div className={styles["logo-name"]}>Arco Pro</div>
        </div>
      </div>
      <ul className={styles.right}>
        <li>
          <Select
            triggerElement={<IconButton icon={<IconLanguage />} />}
            options={[
              { label: "??????", value: "zh-CN" },
              { label: "English", value: "en-US" },
            ]}
            value={lang}
            triggerProps={{
              autoAlignPopupWidth: false,
              autoAlignPopupMinWidth: true,
              position: "br",
            }}
            trigger="hover"
            onChange={(value: "zh-CN" | "en-US") => {
              dispatch(setLang({ lang: value }));
            }}
          />
        </li>
        {userInfo?.name && (
          <li>
            <MessageBox>
              <IconButton icon={<IconNotification />} />
            </MessageBox>
          </li>
        )}
        <li>
          <Tooltip
            content={
              theme === "light"
                ? t["settings.navbar.theme.toDark"]
                : t["settings.navbar.theme.toLight"]
            }
          >
            <IconButton
              icon={theme !== "dark" ? <IconMoonFill /> : <IconSunFill />}
              onClick={() =>
                dispatch(
                  setTheme({ theme: theme === "light" ? "dark" : "light" })
                )
              }
            />
          </Tooltip>
        </li>
        {userInfo?.name && <Settings />}
        {userInfo?.name && (
          <li>
            <Dropdown droplist={droplist} position="br" disabled={userLoading}>
              <Avatar size={32} style={{ cursor: "pointer" }}>
                {userLoading ? (
                  <IconLoading />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="avatar" src={userInfo.avatar} />
                )}
              </Avatar>
            </Dropdown>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
