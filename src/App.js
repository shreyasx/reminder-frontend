import PrivateRoute from "./auth/helper/PrivateRoutes";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Welcome from "./Components/welcome";
import Home from "./Components/home";
import Verify from "./Components/verify";
import "./style.css";

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<PrivateRoute path="/:username" exact component={Home} />
				<Route path="/" exact component={Welcome} />
				<Route path="/verify/:token" exact component={Verify} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;