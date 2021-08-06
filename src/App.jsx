import React from "react";
import PrivateRoute from "./auth/helper/PrivateRoutes";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Welcome, Home, Verify } from "./Components";
import "./style.css";

const App = () => {
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

App.whyDidYouRender = true;

export default App;
