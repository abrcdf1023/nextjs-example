import React, { useEffect, useState } from 'react'

import NextApp, { AppContext, AppProps as NextAppProps } from "next/app";
import Cookies from "universal-cookie";
import accepts from "accepts";
import { flatten } from "@e-group/utils";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import { IntlControlProvider, SetMessages, Theme } from "@e-group/material";
import { CircularProgress } from '@material-ui/core';
import { FixedCenter } from "@e-group/material-layout";

import { store } from "redux/configureAppStore";
import { Messages } from "./locales/types";
import theme from "./theme";

export type SupportedLanguage = "en" | "zh-tw";

export interface AppProps {
  locale: SupportedLanguage;
  messages: Messages;
}

const App = ({
  Component,
  pageProps,
  locale,
  messages,
}: NextAppProps & AppProps) => {
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Fixed material-ui style SSR issue.
  // Example: https://github.com/mui-org/material-ui/tree/next/examples/nextjs
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const handleLoadMessages = (locale: string, setMessages: SetMessages) => {
    setMessagesLoading(true);
    import(`./locales/${locale}`).then((res) => {
      setMessages(flatten(res.default));
      setMessagesLoading(false);
    });
  };

  return (
    <CookiesProvider>
      <Provider store={store}>
          <IntlControlProvider
            defaultLocale="en"
            messages={flatten(messages)}
            locale={locale}
            onUpdateLocale={handleLoadMessages}
          >
            {messagesLoading ? (
              <FixedCenter>
                <CircularProgress />
              </FixedCenter>
            ) : (
              <Theme theme={theme}>
                <Component {...pageProps} />
              </Theme>
            )}
          </IntlControlProvider>
        </Provider>
    </CookiesProvider>
  )
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  const {
    ctx: { req },
  } = appContext;
  const supportedLanguages: SupportedLanguage[] = ["en", "zh-tw"];

  let locale = "en";
  if (req) {
    // Get first supported request local
    // Reference, https://github.com/vercel/next.js/tree/canary/examples/with-react-intl
    const accept = accepts(req);
    const acceptLocale = accept.language(supportedLanguages);
    const cookies = new Cookies(req.headers.cookie);
    if (cookies.get("locale")) {
      locale = cookies.get("locale");
    } else if (acceptLocale) {
      locale = acceptLocale;
    }
  }
  const messages = await import(`./locales/${locale}`).then(
    (res) => res.default
  );

  return { locale, messages, ...appProps };
};

export default App
