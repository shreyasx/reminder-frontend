import "./wdyr";
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import Loading from "react-fullscreen-loading";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
const App = lazy(() => import("./App"));
const Footer = lazy(() => import("./Components/footer"));

ReactDOM.render(
	<Suspense
		fallback={<Loading loading background="#faebd7" loaderColor="#000" />}
	>
		<App />
		<Footer />
	</Suspense>,
	document.getElementById("content-wrap")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
