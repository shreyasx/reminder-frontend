import React from "react";
import PrivateRoute from "./auth/helper/PrivateRoutes";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Welcome, Tabs, Verify } from "./Components";
import "./style.css";

const App = () => (
	<BrowserRouter>
		<Switch>
			<Route path="/" exact component={Welcome} />
			<PrivateRoute path="/:username" exact component={Tabs} />
			<Route path="/verify/:token" exact component={Verify} />
		</Switch>
	</BrowserRouter>
);

App.whyDidYouRender = true;

export default App;
