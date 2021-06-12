import PrivateRoute from "./auth/helper/PrivateRoutes";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./style.css";
import { lazy } from "react";

const Welcome = lazy(() => import("./Components/welcome"));
const Home = lazy(() => import("./Components/home"));
const Verify = lazy(() => import("./Components/verify"));
const lazyWelcome = () => <Welcome />;
const lazyHome = ({ history }) => <Home history={history} />;
const lazyVerify = () => <Verify />;

const App = () => (
	<BrowserRouter>
		<Switch>
			<Route path="/" exact component={lazyWelcome} />
			<PrivateRoute path="/:username" exact component={lazyHome} />
			<Route path="/verify/:token" exact component={lazyVerify} />
		</Switch>
	</BrowserRouter>
);

App.whyDidYouRender = true;

export default App;
