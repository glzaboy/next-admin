import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

import { Provider } from "react-redux";
import store from "../modules/store";
import "../styles/globals.less";
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  Layout?: () => ReactElement<any, any>;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const Layout = Component.Layout ?? null;
  if (!Layout) {
    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    );
  } else {
    return (
      <Provider store={store}>
        {/* @ts-ignore */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    );
  }
}
