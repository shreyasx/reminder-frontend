import "./wdyr";
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { reminders, todos, sw, isVerified } from "./store/reducers";
import Loading from "react-fullscreen-loading";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
const App = lazy(() => import("./App"));
const Footer = lazy(() => import("./Components/footer"));

const rootReducer = combineReducers({ reminders, todos, isVerified, sw });
const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

ReactDOM.render(
	<Provider store={store}>
		<Suspense
			fallback={<Loading loading background="#fff" loaderColor="#000" />}
		>
			<App />
			<Footer />
		</Suspense>
	</Provider>,
	document.getElementById("content-wrap")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
	onSuccess: () => store.dispatch({ type: "SW_INIT" }),
	onUpdate: registration => {
		const waitingServiceWorker = registration.waiting;

		if (waitingServiceWorker) {
			waitingServiceWorker.addEventListener("statechange", event => {
				if (event.target.state === "activated") {
					window.location.reload();
				}
			});
			waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
		}
	},
});
