import React from "react";
import PrivateRoute from "./auth/helper/PrivateRoutes";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Welcome, Home, Verify } from "./Components";
import { API } from "./backend";
import { isAuthenticated } from "./auth/helper";
import { getPushEndpont } from "./utils/push";
import "./style.css";

const App = () => {
	React.useEffect(() => {
		(async () => {
			try {
				const subscription = await getPushEndpont();
				await fetch(`${API}/subscribe/${isAuthenticated().user.username}`, {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: `Bearer ${isAuthenticated().token}`,
					},
					body: JSON.stringify(subscription),
				});
			} catch (error) {
				console.log(error);
			}
		})();
	});

	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={Welcome} />
				<PrivateRoute path="/:username" exact component={Home} />
				<Route path="/verify/:token" exact component={Verify} />
			</Switch>
		</BrowserRouter>
	);
};

export default App;
