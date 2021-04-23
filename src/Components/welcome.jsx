import React, { useState } from "react";
import { authenticate, signin, signup, isAuthenticated } from "../auth/helper";
import { Redirect } from "react-router-dom";

const Welcome = () => {
	const [values, setValues] = useState({
		error: "",
		name: "",
		username: "",
		email: "",
		password: "",
		loading: false,
		didRedirect: false,
	});

	const { name, error, username, email, password, loading } = values;

	const handleChange = nam => event => {
		setValues({ ...values, [nam]: event.target.value });
	};

	const quote = () => (
		<div id="quoteContainer">
			<p id="quote">
				"Men more frequently require to be reminded than informed."
				<br />
				<span id="author">― Samuel Johnson, The Rambler</span>
			</p>
		</div>
	);

	const onSubmitSignIn = event => {
		event.preventDefault();
		setValues({ ...values, loading: true });
		signin({ username, password })
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
		signup({ name, username, password, email })
			.then(data => {
				if (data.error) {
					setValues({ ...values, error: data.error, loading: false });
				} else {
					signin({ username, password })
						.then(dat => {
							if (dat.error) {
								setValues({ ...values, error: dat.error, loading: false });
							} else {
								authenticate(dat, () => {
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
				}
			})
			.catch(er => {
				console.log("Error in signup");
			});
	};

	const signupForm = () => (
		<>
			<h3 style={{ marginLeft: "110px" }}>Register</h3>{" "}
			<form style={{ margin: "20px" }}>
				<label className={`label`} htmlFor="name">
					Name:
				</label>
				<input onChange={handleChange("name")} type="text" id="name" />
				<br />
				<label className={`label`} htmlFor="user">
					Username:
				</label>
				<input onChange={handleChange("username")} type="text" id="user" />
				<br />
				<label className={`label`} htmlFor="email">
					Email:
				</label>
				<input onChange={handleChange("email")} type="email" id="email" />
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
				<button onClick={onSubmitSignUp}>GO!</button>
			</form>
		</>
	);

	const signinForm = () => (
		<>
			<h3 style={{ marginLeft: "125px" }}>Log In</h3>{" "}
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

	const performRedirect = () => {
		if (isAuthenticated())
			return <Redirect to={`/${isAuthenticated().user.username}`} />;
	};

	const errorMessage = () => (
		<div style={{ display: error ? "" : "none", color: "red" }}>{error}</div>
	);

	return isAuthenticated().user ? (
		<Redirect to={`/${isAuthenticated().user.username}`} />
	) : (
		<div>
			<p id="intro">
				Hello, welcome to Reminders & Todos. Here you sign in and set reminders,
				or To-dos, and you get reminded on the email address that you provide.
				What you waiting for?
			</p>
			{loadingMessage()}
			{errorMessage()}
			<div className="row">
				<div className="col-md-6">{signupForm()}</div>
				<div className="col-md-6">{signinForm()}</div>
			</div>
			{quote()}
			{performRedirect()}
		</div>
	);
};

export default Welcome;
