import {
  Form,
  Input,
  Checkbox,
  Link,
  Button,
  Space,
} from "@arco-design/web-react";
import { IconLock, IconUser } from "@arco-design/web-react/icon";
import React, { useEffect, useState } from "react";
import useStorage from "@/utils/useStorage";
import useLocale from "@/utils/useLocale";
import locale from "@/locale/login";
import styles from "./style/index.module.less";
import { requestMsg } from "@/utils/request";
import { apiResponse } from "@/server/dto/baseResponse";
import { useCountdown } from "@/utils/useTimer";

export default function LoginForm() {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginParams, setLoginParams, removeLoginParams] =
    useStorage("loginParams");

  const t = useLocale(locale);

  const [rememberPassword, setRememberPassword] = useState<boolean>(false);
  const { countdown, setupCountdown } = useCountdown(15);
  function afterLoginSuccess(params: Record<string, string>) {
    // 记住密码
    if (rememberPassword) {
      setLoginParams(JSON.stringify(params));
    } else {
      removeLoginParams();
    }
    // 跳转首页
    window.location.href = "/dashboard/workplace";
  }
  const login = (params: Record<string, string>) => {
    setErrorMessage("");
    setLoading(true);
    requestMsg<apiResponse>("/api/login", { method: "post", data: params })
      .then((res) => {
        afterLoginSuccess(params);
      })
      .catch((err) => {
        setErrorMessage(err || t["login.form.login.errMsg"]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function onSubmitClick() {
    form
      .validate()
      .then((values) => {
        setupCountdown();
        login(values);
      })
      .catch((err) => {
        setupCountdown();
        console.error(err);
      });
  }

  // 读取 localStorage，设置初始值
  useEffect(() => {
    const rememberPassword = !!loginParams;

    if (form && rememberPassword) {
      const parseParams = JSON.parse(loginParams);
      form.setFieldsValue(parseParams);
    }
    setRememberPassword(rememberPassword);
  }, [form, loginParams]);

  return (
    <div className={styles["login-form-wrapper"]}>
      <div className={styles["login-form-title"]}>{t["login.form.title"]}</div>
      <div className={styles["login-form-sub-title"]}>
        {t["login.form.title"]}
      </div>
      <div className={styles["login-form-error-msg"]}>{errorMessage}</div>
      <Form
        className={styles["login-form"]}
        layout="vertical"
        form={form}
        initialValues={{
          type: "PASSWORD",
        }}
      >
        <Form.Item
          hidden={true}
          field="type"
          rules={[{ required: true, message: t["login.form.userName.errMsg"] }]}
        >
          <Input
            placeholder={t["login.form.userName.placeholder"]}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Form.Item
          field="userName"
          rules={[{ required: true, message: t["login.form.userName.errMsg"] }]}
        >
          <Input
            prefix={<IconUser />}
            placeholder={t["login.form.userName.placeholder"]}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Form.Item
          field="password"
          rules={[{ required: true, message: t["login.form.password.errMsg"] }]}
        >
          <Input.Password
            prefix={<IconLock />}
            placeholder={t["login.form.password.placeholder"]}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Space size={16} direction="vertical">
          <div className={styles["login-form-password-actions"]}>
            <Checkbox checked={rememberPassword} onChange={setRememberPassword}>
              {t["login.form.rememberPassword"]}
            </Checkbox>
            <Link>{t["login.form.forgetPassword"]}</Link>
          </div>
          <Button
            type="primary"
            long
            onClick={onSubmitClick}
            loading={loading || countdown > 0}
          >
            {t["login.form.login"] +
              (countdown <= 0 ? "" : "(" + countdown + ")")}
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
  );
}
