import React, { ReactElement, useEffect } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

import { Provider } from "react-redux";
import store from "@/modules/store";
import "@/styles/globals.less";
import NProgress from "nprogress";
import { useRouter } from "next/router";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  Layout?: () => ReactElement<any, any>;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  useEffect(() => {
    const handleStart = () => {
      console.log("handleStart");
      NProgress.set(0.4);
      NProgress.start();
    };

    const handleStop = () => {
      console.log("handledone");
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);
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
