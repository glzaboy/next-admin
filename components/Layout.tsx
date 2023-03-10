import { useAppSelector, useAppDispatch } from "@/modules/store";
import { selectGlobal, updateUserInfo } from "@/modules/global";
import React, { useState, ReactNode, useRef, useEffect, useMemo } from "react";
import { Layout, Menu, Breadcrumb, Spin } from "@arco-design/web-react";
import cs from "classnames";
import {
  IconDashboard,
  IconList,
  IconSettings,
  IconFile,
  IconApps,
  IconCheckCircle,
  IconExclamationCircle,
  IconUser,
  IconMenuFold,
  IconMenuUnfold,
} from "@arco-design/web-react/icon";
import { useRouter } from "next/router";
import qs from "query-string";
import useRoute, { IRoute } from "../routes";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import useLocale from "@/utils/useLocale";
import Link from "next/link";
import getUrlParams from "@/utils/getUrlParams";
import styles from "@/styles/layout.module.less";
import changeTheme from "@/utils/changeTheme";
import NoAccess from "@/pages/exception/403";

import { ConfigProvider } from "@arco-design/web-react";
import zhCN from "@arco-design/web-react/es/locale/zh-CN";
import enUS from "@arco-design/web-react/es/locale/en-US";
import { request } from "@/utils/request";
import { loginCheckResult } from "@/server/service/login";
import { useTimeInterVal } from "@/utils/useTimer";

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

const Sider = Layout.Sider;
const Content = Layout.Content;

function getIconFromKey(key: string) {
  switch (key) {
    case "dashboard":
      return <IconDashboard className={styles.icon} />;
    case "post":
      return <IconList className={styles.icon} />;
    case "form":
      return <IconSettings className={styles.icon} />;
    case "profile":
      return <IconFile className={styles.icon} />;
    case "visualization":
      return <IconApps className={styles.icon} />;
    case "result":
      return <IconCheckCircle className={styles.icon} />;
    case "exception":
      return <IconExclamationCircle className={styles.icon} />;
    case "user":
      return <IconUser className={styles.icon} />;
    default:
      return <div className={styles["icon-empty"]} />;
  }
}

export const LayoutDefault = ({ children }: any) => {
  const globalState = useAppSelector(selectGlobal);
  const dispatch = useAppDispatch();

  const l = useMemo(() => {
    switch (globalState.lang) {
      case "zh-CN":
        return zhCN;
      case "en-US":
        return enUS;
      default:
        return zhCN;
    }
  }, [globalState.lang]);

  const urlParams = getUrlParams();
  const router = useRouter();
  const pathname = router.pathname;
  const currentComponent = qs.parseUrl(pathname).url.slice(1);
  const locale = useLocale();
  const { userInfo, settings, lang, theme } = globalState;
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [routes, defaultRoute] = useRoute(userInfo?.permissions || {});

  const defaultSelectedKeys = [currentComponent || defaultRoute];
  const paths = (currentComponent || defaultRoute).split("/");
  const defaultOpenKeys = paths.slice(0, paths.length - 1);

  const [selectedKeys, setSelectedKeys] =
    useState<string[]>(defaultSelectedKeys);
  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys);

  const navbarHeight = 60;
  const menuWidth = collapsed ? 48 : settings?.menuWidth;

  const showNavbar = settings?.navbar && urlParams.navbar !== false;
  const showMenu = settings?.menu && urlParams.menu !== false;
  const showFooter = settings?.footer && urlParams.footer !== false;

  const routeMap = useRef<Map<string, ReactNode[]>>(new Map());
  const menuMap = useRef<
    Map<string, { menuItem?: boolean; subMenu?: boolean }>
  >(new Map());

  const [breadcrumb, setBreadCrumb] = useState<React.ReactNode[]>([]);

  function onClickMenuItem(key: string) {
    setSelectedKeys([key]);
  }
  function toggleCollapse() {
    setCollapsed((collapsed) => !collapsed);
  }
  const paddingLeft = showMenu ? { paddingLeft: menuWidth } : {};
  const paddingTop = showNavbar ? { paddingTop: navbarHeight } : {};
  const paddingStyle = { ...paddingLeft, ...paddingTop };

  useEffect(() => {
    document.cookie = `arco-lang=${lang}; path=/`;
    document.cookie = `arco-theme=${theme}; path=/`;
    changeTheme(theme || "", globalState.settings?.themeColor || "");
  }, [lang, theme, globalState.settings?.themeColor]);
  useTimeInterVal(180, () => {
    request<loginCheckResult>("/api/getUser")
      .then((data) => {
        dispatch(
          updateUserInfo({
            userInfo: {
              name: data.user?.name || "",
              permissions: {},
              avatar: data.user?.avatar || "",
            },
          })
        );
      })
      .catch((e) => {
        window.location.href = "/login";
      });
  });

  useEffect(() => {
    request<loginCheckResult>("/api/getUser")
      .then((data) => {
        dispatch(
          updateUserInfo({
            userInfo: {
              name: data.user?.name || "",
              permissions: {},
              avatar: data.user?.avatar || "",
            },
          })
        );
      })
      .catch((e) => {
        window.location.href = "/login";
      });
  }, [globalState.userDate, dispatch]);

  function renderRoutes(locale: Record<string, string>) {
    routeMap.current.clear();
    return function travel(
      _routes: IRoute[],
      level: number,
      parentNode: Array<string> = []
    ) {
      return _routes.map((route) => {
        const { breadcrumb = true, ignore } = route;
        const iconDom = getIconFromKey(route.key);
        const titleDom = (
          <>
            {iconDom} {locale[route.name] || route.name}
          </>
        );

        routeMap.current.set(
          `/${route.key}`,
          breadcrumb ? [...parentNode, route.name] : []
        );

        const visibleChildren = (route.children || []).filter((child) => {
          const { ignore, breadcrumb = true } = child;
          if (ignore || route.ignore) {
            routeMap.current.set(
              `/${child.key}`,
              breadcrumb ? [...parentNode, route.name, child.name] : []
            );
          }

          return !ignore;
        });

        if (ignore) {
          return "";
        }
        if (visibleChildren.length) {
          menuMap.current.set(route.key, { subMenu: true });
          return (
            <SubMenu key={route.key} title={titleDom}>
              {travel(visibleChildren, level + 1, [...parentNode, route.name])}
            </SubMenu>
          );
        }
        menuMap.current.set(route.key, { menuItem: true });
        return (
          <MenuItem key={route.key}>
            <Link href={`/${route.key}`}>{titleDom}</Link>
          </MenuItem>
        );
      });
    };
  }
  const updateMenuStatus = () => {
    const pathKeys = pathname.split("/");
    const newSelectedKeys: string[] = [];
    const newOpenKeys: string[] = [...openKeys];
    while (pathKeys.length > 0) {
      const currentRouteKey = pathKeys.join("/");
      const menuKey = currentRouteKey.replace(/^\//, "");
      const menuType = menuMap.current.get(menuKey);
      if (menuType && menuType.menuItem) {
        newSelectedKeys.push(menuKey);
      }
      if (menuType && menuType.subMenu && !openKeys.includes(menuKey)) {
        newOpenKeys.push(menuKey);
      }
      pathKeys.pop();
    }
    setSelectedKeys(newSelectedKeys);
    setOpenKeys(newOpenKeys);
  };

  useEffect(() => {
    const routeConfig = routeMap.current.get(pathname);
    setBreadCrumb(routeConfig || []);
    updateMenuStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <ConfigProvider
        locale={l}
        componentConfig={{
          Card: {
            bordered: false,
          },
          List: {
            bordered: false,
          },
          Table: {
            border: false,
          },
        }}
      >
        <Layout className={styles.layout}>
          <div
            className={cs(styles["layout-navbar"], {
              [styles["layout-navbar-hidden"]]: !showNavbar,
            })}
          >
            <Navbar show={!!showNavbar} />
          </div>
          <Layout>
            {showMenu && (
              <Sider
                className={styles["layout-sider"]}
                width={menuWidth}
                collapsed={collapsed}
                onCollapse={setCollapsed}
                trigger={null}
                collapsible
                breakpoint="xl"
                style={paddingTop}
              >
                <div className={styles["menu-wrapper"]}>
                  <Menu
                    collapse={collapsed}
                    onClickMenuItem={onClickMenuItem}
                    selectedKeys={selectedKeys}
                    openKeys={openKeys}
                    onClickSubMenu={(_, openKeys) => {
                      setOpenKeys(openKeys);
                    }}
                  >
                    {renderRoutes(locale)(routes, 1)}
                  </Menu>
                </div>
                <div
                  className={styles["collapse-btn"]}
                  onClick={toggleCollapse}
                >
                  {collapsed ? <IconMenuUnfold /> : <IconMenuFold />}
                </div>
              </Sider>
            )}
            <Layout className={styles["layout-content"]} style={paddingStyle}>
              <div className={styles["layout-content-wrapper"]}>
                {!!breadcrumb.length && (
                  <div className={styles["layout-breadcrumb"]}>
                    <Breadcrumb>
                      {breadcrumb.map((node, index) => (
                        <Breadcrumb.Item key={index}>
                          {typeof node === "string"
                            ? locale[node] || node
                            : node}
                        </Breadcrumb.Item>
                      ))}
                    </Breadcrumb>
                  </div>
                )}
                <Content>
                  {routeMap.current.has(pathname) ? children : <NoAccess />}
                </Content>
              </div>
              {showFooter && <Footer />}
            </Layout>
          </Layout>
        </Layout>
      </ConfigProvider>
    </>
  );
};
export const LayoutNoMemu = ({ children }: any) => {
  const globalState = useAppSelector(selectGlobal);
  const dispatch = useAppDispatch();

  const l = useMemo(() => {
    switch (globalState.lang) {
      case "zh-CN":
        return zhCN;
      case "en-US":
        return enUS;
      default:
        return zhCN;
    }
  }, [globalState.lang]);

  const urlParams = getUrlParams();
  const router = useRouter();
  const pathname = router.pathname;
  const currentComponent = qs.parseUrl(pathname).url.slice(1);
  const locale = useLocale();
  const { settings, lang, theme } = globalState;

  const navbarHeight = 60;

  const showNavbar = settings?.navbar && urlParams.navbar !== false;
  const showFooter = settings?.footer && urlParams.footer !== false;

  const paddingLeft = {};
  const paddingTop = showNavbar ? { paddingTop: navbarHeight } : {};
  const paddingStyle = { ...paddingLeft, ...paddingTop };

  useEffect(() => {
    document.cookie = `arco-lang=${lang}; path=/`;
    document.cookie = `arco-theme=${theme}; path=/`;
    changeTheme(theme || "", globalState.settings?.themeColor || "");
  }, [lang, theme, globalState.settings?.themeColor]);
  useTimeInterVal(180, () => {
    request<loginCheckResult>("/api/getUser")
      .then((data) => {
        dispatch(
          updateUserInfo({
            userInfo: {
              name: data.user?.name || "",
              permissions: {},
              avatar: data.user?.avatar || "",
            },
          })
        );
      })
      .catch((e) => {
        // window.location.href = "/login";
      });
  });

  useEffect(() => {
    request<loginCheckResult>("/api/getUser")
      .then((data) => {
        dispatch(
          updateUserInfo({
            userInfo: {
              name: data.user?.name || "",
              permissions: {},
              avatar: data.user?.avatar || "",
            },
          })
        );
      })
      .catch((e) => {
        // window.location.href = "/login";
      });
  }, [globalState.userDate, dispatch]);

  return (
    <>
      <ConfigProvider
        locale={l}
        componentConfig={{
          Card: {
            bordered: false,
          },
          List: {
            bordered: false,
          },
          Table: {
            border: false,
          },
        }}
      >
        <Layout className={styles.layout}>
          <div
            className={cs(styles["layout-navbar"], {
              [styles["layout-navbar-hidden"]]: !showNavbar,
            })}
          >
            <Navbar show={!!showNavbar} />
          </div>
          <Layout>
            <Layout className={styles["layout-content"]} style={paddingStyle}>
              <div className={styles["layout-content-wrapper"]}>
                <Content>
                  {children}
                  {/* {routeMap.current.has(pathname) ? children : <NoAccess />} */}
                </Content>
              </div>
              {showFooter && <Footer />}
            </Layout>
          </Layout>
        </Layout>
      </ConfigProvider>
    </>
  );
};
