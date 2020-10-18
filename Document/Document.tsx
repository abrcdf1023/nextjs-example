import React from "react";
import NextDocument, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { ServerStyleSheets } from "@material-ui/core";
import theme from "../App/theme";

interface DocumentProps {
  lang: string;
}
export default class Document extends NextDocument<DocumentProps> {
  // `getInitialProps` belongs to `_document` (instead of `_app`),
  // it's compatible with static-site generation (SSG).
  static async getInitialProps(ctx: DocumentContext) {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      });

    const initialProps = await NextDocument.getInitialProps(ctx);
    const { req } = ctx;
    const { locale } = req as any;
    return {
      lang: locale ? locale.split("-")[0] : undefined,
      ...initialProps,

      // Styles fragment is rendered after the app and page rendering finish.
      styles: [
        ...React.Children.toArray(initialProps.styles),
        sheets.getStyleElement(),
      ],
    };
  }

  render() {
    return (
      <Html lang={this.props.lang}>
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-112777879-1"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
