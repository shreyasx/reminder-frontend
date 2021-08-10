import React from "react";
import PrivateRoute from "./auth/helper/PrivateRoutes";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Welcome, Home, Verify } from "./Components";
import { useSelector } from "react-redux";
import Alert from "./utils/alert";
import "./style.css";

const App = () => {
	const sw = useSelector(state => state.sw);
	React.useEffect(() => console.log("sw-", sw), [sw]);

	const updateServiceWorker = () => {
		const registrationWaiting = sw.serviceWorkerRegistration.waiting;
		if (registrationWaiting) {
			registrationWaiting.postMessage({ type: "SKIP_WAITING" });
			registrationWaiting.addEventListener("statechange", e => {
				if (e.target.state === "activated") {
					window.location.reload();
				}
			});
		}
	};

	return (
		<>
			{sw.serviceWorkerInitialized && (
				<Alert text="Page has been saved for offline use" />
			)}
			{sw.serviceWorkerUpdated && (
				<Alert
					text="There is a new version available."
					type="SW_UPDATE"
					buttonText="Update"
					onClick={updateServiceWorker}
				/>
			)}
			<BrowserRouter>
				<Switch>
					<Route path="/" exact component={Welcome} />
					<PrivateRoute path="/:username" exact component={Home} />
					<Route path="/verify/:token" exact component={Verify} />
				</Switch>
			</BrowserRouter>
		</>
	);
};

App.whyDidYouRender = true;

export default App;
