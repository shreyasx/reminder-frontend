import React, { useState } from "react";
import { authenticate, signin, signup, isAuthenticated } from "../auth/helper";
import { Redirect } from "react-router-dom";
import { Grid, TextField, Paper, Button } from "@material-ui/core";
import useStyles from "./styles";

const Welcome = () => {
	const [values, setValues] = useState({
		registerError: {},
		name: "",
		username: "",
		email: "",
		password: "",
		loading: false,
		didRedirect: false,
	});

	const classes = useStyles();

	const { name, error, username, email, password, loading } = values;

	const handleChange = nam => event =>
		setValues({ ...values, [nam]: event.target.value });

	const quote = () => (
		<div id="quoteContainer">
			<p id="quote">
				"Men more frequently require to be reminded, than to be informed."
				<br />
				<span id="author">― Samuel Johnson, The Rambler</span>
			</p>
		</div>
	);

	const onSubmitSignIn = event => {
		event.preventDefault();
		setValues({ ...values, loading: true });
		signin({ username: username.toLowerCase(), password })
			.then(data => {
				if (data.error) {
					setValues({ ...values, error: data.error, loading: false });
				} else {
					authenticate(data, () => {
						setValues({
							...values,
							didRedirect: true,
						});
					});
				}
			})
			.catch(er => {
				console.log("Signin request failed");
			});
	};

	const onSubmitSignUp = event => {
		event.preventDefault();
		setValues({ ...values, loading: true });
		signup({ name, username: username.toLowerCase(), password, email })
			.then(data => {
				if (data.error) {
					setValues({ ...values, error: data.error, loading: false });
				} else {
					authenticate(data, () => {
						setValues({
							...values,
							didRedirect: true,
						});
					});
				}
			})
			.catch(er => {
				console.log("Signin request failed");
			});
	};

	const signupForm = () => (
		<>
			<h3>Register Now!</h3>
			<div>
				<TextField
					style={{ minWidth: "300px" }}
					error={values.registerError.name && true}
					id="outlined-error-helper-text"
					label={values.registerError.name ? "Error" : "Name"}
					placeholder="Shreyas J"
					helperText={
						values.registerError.name
							? values.registerError.name
							: "3 or more characters"
					}
					variant="outlined"
				/>
			</div>
			<form style={{ margin: "20px" }}>
				<label className={`label`} htmlFor="name">
					Name:
				</label>
				<input
					placeholder="3 or more characters"
					onChange={handleChange("name")}
					type="text"
					id="name"
				/>
				<br />
				<label className={`label`} htmlFor="user">
					Username:
				</label>
				<input
					placeholder="3 or more characters"
					onChange={handleChange("username")}
					type="text"
					id="user"
				/>
				<br />
				<label className={`label`} htmlFor="email">
					Email:
				</label>
				<input
					placeholder="Will receive reminders"
					onChange={handleChange("email")}
					type="email"
					id="email"
				/>
				<br />
				<label className={`label`} htmlFor="passw">
					Password:
				</label>
				<input
					placeholder="5 or more characters"
					onChange={handleChange("password")}
					type="password"
					id="passw"
				/>
				<br />
				<Button onClick={onSubmitSignUp} variant="contained">
					Register
				</Button>
			</form>
		</>
	);

	const signinForm = () => (
		<>
			<h3>Log In</h3>{" "}
			<form style={{ margin: "20px" }}>
				<label className={`label`} htmlFor="userr">
					Username:
				</label>
				<input onChange={handleChange("username")} type="email" id="userr" />
				<br />
				<label className={`label`} htmlFor="pass">
					Password:
				</label>
				<input onChange={handleChange("password")} type="password" id="pass" />
				<br />
				<button onClick={onSubmitSignIn}>GO!</button>
			</form>
		</>
	);

	const loadingMessage = () => loading && <h2>Loading...</h2>;

	const performRedirect = () =>
		isAuthenticated() && (
			<Redirect to={`/${isAuthenticated().user.username}`} />
		);

	const errorMessage = () => (
		<div style={{ display: error ? "" : "none", color: "red" }}>{error}</div>
	);

	return isAuthenticated().user ? (
		<Redirect to={`/${isAuthenticated().user.username}`} />
	) : (
		<>
			<p id="intro">
				Hello, welcome to Reminders & Todos. Here you sign in and set reminders,
				or To-dos, and when the time comes, you get reminded on the email
				address that you provide. Try now!
			</p>
			{loadingMessage()}
			{errorMessage()}
			<Grid container spacing={1}>
				<Grid item xs={12} sm={6}>
					<Paper className={classes.paper}>{signupForm()}</Paper>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Paper className={classes.paper}>{signinForm()}</Paper>
				</Grid>
			</Grid>
			{/* <div className="row">
				<div className="col-md-6">{signupForm()}</div>
				<div className="col-md-6">{signinForm()}</div>
			</div> */}
			{quote()}
			{performRedirect()}
		</>
	);
};

Welcome.whyDidYouRender = true;

export default Welcome;
