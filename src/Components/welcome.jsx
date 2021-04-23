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
			<h1>Sign Up</h1>{" "}
			<form>
				<label htmlFor="name">Name:</label>
				<input onChange={handleChange("name")} type="text" id="name" />
				<br />
				<label htmlFor="user">Username:</label>
				<input onChange={handleChange("username")} type="text" id="user" />
				<br />
				<label htmlFor="email">Email:</label>
				<input onChange={handleChange("email")} type="email" id="email" />
				<br />
				<label htmlFor="passw">Password:</label>
				<input onChange={handleChange("password")} type="password" id="passw" />
				<br />
				<button onClick={onSubmitSignUp}>GO!</button>
			</form>
		</>
	);

	const signinForm = () => (
		<>
			<h1>Sign In</h1>
			<form>
				<input
					onChange={handleChange("username")}
					placeholder="username"
					type="text"
					id="userr"
				/>
				<br />
				<input
					onChange={handleChange("password")}
					placeholder="pass"
					type="password"
					id="pass"
				/>
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
			{loadingMessage()}
			{errorMessage()}
			<div className="row">
				<div className="col-md-6">{signupForm()}</div>
				<div className="col-md-6">{signinForm()}</div>
			</div>
			{performRedirect()}
		</div>
	);
};

export default Welcome;
