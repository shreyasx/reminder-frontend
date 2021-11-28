import React, { useState } from "react";
import { authenticate, signin, signup, isAuthenticated } from "../auth/helper";
import { Redirect } from "react-router-dom";
import { Grid, TextField, Button } from "@material-ui/core";
import useStyles from "./styles";

const Welcome = () => {
	const [values, setValues] = useState({
		registerError: { email: "", password: "", username: "", name: "" },
		loginError: { username: "", password: "" },
		name: "",
		username: "",
		email: "",
		password: "",
		loading: false,
		didRedirect: false,
	});

	const handleError = error => {
		switch (error) {
			case "Name must be at least 3 characters long.":
				setValues({
					...values,
					registerError: { email: "", password: "", username: "", name: error },
				});
				break;

			case "Username must be at least 3 characters long.":
				setValues({
					...values,
					registerError: { email: "", password: "", username: error, name: "" },
				});
				break;

			case "An account with that username already exists. You can log in.":
				setValues({
					...values,
					registerError: { email: "", password: "", username: error, name: "" },
				});
				break;

			case "Enter valid username.":
				setValues({
					...values,
					registerError: { email: "", password: "", username: error, name: "" },
				});
				break;

			case "Enter a valid email address.":
				setValues({
					...values,
					registerError: { email: error, password: "", username: "", name: "" },
				});
				break;

			case "An account with that email already exists. You can log in.":
				setValues({
					...values,
					registerError: { email: error, password: "", username: "", name: "" },
				});
				break;

			case "Password must be atleast 5 characters long.":
				setValues({
					...values,
					registerError: { email: "", password: error, username: "", name: "" },
				});
				break;

			case "No account linked with that username.":
				setValues({
					...values,
					loginError: { password: "", username: error },
				});
				break;

			case "Incorrect password.":
				setValues({
					...values,
					loginError: { password: error, username: "" },
				});
				break;

			case "Username cannot be empty.":
				setValues({
					...values,
					loginError: { password: "", username: error },
				});
				break;

			case "Password cannot be empty.":
				setValues({
					...values,
					loginError: { password: error, username: "" },
				});
				break;

			default:
		}
	};

	const classes = useStyles();

	const { name, username, email, password, loading } = values;

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

	const onSubmitSignIn = () => {
		setValues({
			...values,
			loading: true,
			loginError: { password: "", username: "" },
		});
		signin({ username: username.toLowerCase(), password })
			.then(data => {
				if (data.error) {
					// setValues({ ...values, error: data.error, loading: false });
					handleError(data.error);
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
		setValues({
			...values,
			registerError: { email: "", password: "", username: "", name: "" },
			loading: true,
		});
		signup({ name, username: username.toLowerCase(), password, email }).then(
			data => {
				if (data.error) {
					handleError(data.error);
				} else {
					authenticate(data, () => {
						setValues({
							...values,
							didRedirect: true,
						});
					});
				}
			}
		);
	};

	const signupForm = () => (
		<>
			<h3>Register Now!</h3>
			<div>
				<TextField
					className={classes.inputField}
					error={values.registerError.name && true}
					label="Name"
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
					label="Username"
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
					label="Email"
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
					label="Password"
					placeholder="Password"
					type="password"
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
				disabled={loading}
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
					label="Username"
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
					label="Password"
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
				disabled={loading}
			>
				Login
			</Button>
		</>
	);

	const performRedirect = () =>
		isAuthenticated() && (
			<Redirect to={`/${isAuthenticated().user.username}`} />
		);

	return isAuthenticated().user ? (
		<Redirect to={`/${isAuthenticated().user.username}`} />
	) : (
		<>
			<p className={classes.intro}>
				Hello, welcome to Reminders & Todos. Here you sign in to set reminders,
				or To-dos, and when the time comes, you get reminded on the email
				address that you provide. You'll also be sent a little browser
				notification. Free to try now!
			</p>
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

export default Welcome;
