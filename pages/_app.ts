import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import 'styles/globals.css'
import 'styles/nprogress.css'
import App from 'App'
import Router from "next/router";
import NProgress from "nprogress";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default App
