import React, { useState } from "react";
import { authenticate, signin, signup, isAuthenticated } from "../auth/helper";
import { Redirect } from "react-router-dom";
import { Grid, TextField, Button } from "@material-ui/core";
import useStyles from "./styles";

const Welcome = () => {
	const [values, setValues] = useState({
		registerError: { email: "", password: "", username: "" },
		loginError: { username: "", password: "" },
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
					className={classes.inputField}
					error={values.registerError.name && true}
					label={values.registerError.name ? "Error" : "Name"}
					placeholder="Shreyas J"
					helperText={
						values.registerError.name
							? values.registerError.name
							: "3 or more characters."
					}
					onChange={handleChange("name")}
					variant="outlined"
				/>
				<TextField
					className={classes.inputField}
					error={values.registerError.username && true}
					label={values.registerError.username ? "Error" : "Username"}
					placeholder="shreyasx"
					helperText={
						values.registerError.username
							? values.registerError.username
							: "3 or more characters."
					}
					onChange={handleChange("username")}
					variant="outlined"
				/>
				<TextField
					className={classes.inputField}
					error={values.registerError.email && true}
					label={values.registerError.email ? "Error" : "Email"}
					placeholder="shreyxs@gmail.com"
					helperText={
						values.registerError.email
							? values.registerError.email
							: "You'll need to verify it."
					}
					onChange={handleChange("email")}
					variant="outlined"
				/>
				<TextField
					className={classes.inputField}
					error={values.registerError.password && true}
					label={values.registerError.password ? "Error" : "Password"}
					placeholder="Password"
					helperText={
						values.registerError.password
							? values.registerError.password
							: "5 or more characters."
					}
					onChange={handleChange("password")}
					variant="outlined"
				/>
			</div>
			<Button
				className={classes.buttons}
				onClick={onSubmitSignUp}
				color="primary"
				variant="contained"
				disabled={false}
			>
				Register
			</Button>
		</>
	);

	const signinForm = () => (
		<>
			<h3>Log In</h3>
			<div>
				<TextField
					className={classes.inputField}
					error={values.loginError.username && true}
					label={values.loginError.username ? "Error" : "Username"}
					placeholder="shreyasx"
					helperText={
						values.loginError.username
							? values.loginError.username
							: values.username
							? `Hey, ${values.username}!`
							: `Hey!`
					}
					onChange={handleChange("username")}
					variant="outlined"
				/>
				<TextField
					className={classes.inputField}
					error={values.loginError.password && true}
					label={values.loginError.password ? "Error" : "Password"}
					placeholder="Password"
					type="password"
					helperText={
						values.loginError.password
							? values.loginError.password
							: "Forgot? Can't help it. :("
					}
					onChange={handleChange("password")}
					variant="outlined"
				/>
			</div>
			<Button
				className={classes.buttons}
				onClick={onSubmitSignIn}
				color="primary"
				variant="contained"
			>
				Login
			</Button>
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
			<Grid container justifyContent="center" spacing={1}>
				<Grid className={classes.paper} item xs={12} sm={10} md={6}>
					{signupForm()}
				</Grid>
				<Grid className={classes.paper} item xs={12} sm={10} md={6}>
					{signinForm()}
				</Grid>
			</Grid>
			{quote()}
			{performRedirect()}
		</>
	);
};

Welcome.whyDidYouRender = true;

export default Welcome;
