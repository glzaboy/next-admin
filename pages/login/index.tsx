import { useAppSelector, useAppDispatch } from "@/modules/store";
import { selectGlobal } from "@/modules/global";
import Head from "next/head";
import React, { useEffect, useState, useRef } from "react";
import {
  Form,
  Input,
  Checkbox,
  Link,
  Button,
  Space,
} from "@arco-design/web-react";
import locale from "./locale";
import { IconLock, IconUser } from "@arco-design/web-react/icon";

import styles from "./style/index.module.less";
import useLocale from "@/utils/useLocale";
import useStorage from "@/utils/useStorage";
import type { Data } from "@/pages/api/login";
import { request } from "@/utils/request";
import { LayoutNoMemu } from "@/components/Layout";

export default function Home() {
  const t = useLocale(locale);
  const globalState = useAppSelector(selectGlobal);
  useEffect(() => {
    document.body.setAttribute("arco-theme", "light");
  }, []);
  // const formRef = useRef<FormInstance<Data>>();
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginParams, setLoginParams, removeLoginParams] =
    useStorage("loginParams");

  const [rememberPassword, setRememberPassword] = useState(!!loginParams);
  const login = (params: Record<string, string>) => {
    setErrorMessage("");
    setLoading(true);
    request<Data>("/api/login", { method: "post", data: params })
      .then((res) => {
        const { status, msg } = res;
        res.status;
        if (status === "ok") {
          afterLoginSuccess(params);
        } else {
          setErrorMessage(msg || t["login.form.login.errMsg"]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function onSubmitClick() {
    form.validate().then((values) => {
      login(values);
    });
  }
  function afterLoginSuccess(params: Record<string, string>) {
    // 记住密码
    if (rememberPassword) {
      setLoginParams(JSON.stringify(params));
    } else {
      removeLoginParams();
    }
    // 记录登录状态
    localStorage.setItem("userStatus", "login");
    // 跳转首页
    window.location.href = "/";
  }
  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico"
        />
      </Head>
      {/* {er && <div>{er}</div>}
      {s && <div>{s.name}</div>} */}
      <div className={styles["login-form-wrapper"]}>
        <div className={styles["login-form-title"]}>
          {t["login.form.title"]}
        </div>
        <div className={styles["login-form-sub-title"]}>
          {t["login.form.title"]}
        </div>
        <div className={styles["login-form-error-msg"]}>{errorMessage}</div>
        <Form
          className={styles["login-form"]}
          layout="vertical"
          // ref={formRef}
          form={form}
          initialValues={{
            userName: "glzaboy",
            password: "admin888",
            loginType: "PASSWORD",
          }}
        >
          <Form.Item
            field="loginType"
            rules={[
              { required: true, message: t["login.form.userName.errMsg"] },
            ]}
          >
            <Input onPressEnter={onSubmitClick} />
          </Form.Item>
          <Form.Item
            field="userName"
            rules={[
              { required: true, message: t["login.form.userName.errMsg"] },
            ]}
          >
            <Input
              prefix={<IconUser />}
              placeholder={t["login.form.userName.placeholder"]}
              onPressEnter={onSubmitClick}
            />
          </Form.Item>
          <Form.Item
            field="password"
            rules={[
              { required: true, message: t["login.form.password.errMsg"] },
            ]}
          >
            <Input.Password
              prefix={<IconLock />}
              placeholder={t["login.form.password.placeholder"]}
              onPressEnter={onSubmitClick}
            />
          </Form.Item>
          <Space size={16} direction="vertical">
            <div className={styles["login-form-password-actions"]}>
              <Checkbox
                checked={rememberPassword}
                onChange={setRememberPassword}
              >
                {t["login.form.rememberPassword"]}
              </Checkbox>
              <Link>{t["login.form.forgetPassword"]}</Link>
            </div>
            <Button
              type="primary"
              long
              onClick={onSubmitClick}
              loading={loading}
            >
              {t["login.form.login"]}
            </Button>
            <Button
              type="text"
              long
              className={styles["login-form-register-btn"]}
            >
              {t["login.form.register"]}
            </Button>
          </Space>
        </Form>
      </div>
    </>
  );
}
Home.Layout = LayoutNoMemu;
