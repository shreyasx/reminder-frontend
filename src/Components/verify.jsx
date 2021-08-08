import React, { useState, useEffect } from "react";
import { API } from "../backend";

const Verify = ({ match }) => {
	const [resp, setResp] = useState("");
	const [loading, setLoading] = useState(true);

	const check = () => {
		fetch(`${API}/user/verify-email`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ token: match.params.token }),
		})
			.then(R => R.json())
			.then(res => {
				setResp(res.message);
				setLoading(false);
			})
			.catch(console.log);
	};

	useEffect(check, [match.params.token]);

	return (
		<>
			{loading ? (
				<h4>Loading..</h4>
			) : (
				<h4>
					{resp === "done" ? (
						<>
							Account verified. Go to{" "}
							<a href="https://remindersandtodos.netlify.app/">
								Reminders & Todos
							</a>{" "}
							or refresh the page that brought you here.
						</>
					) : (
						resp
					)}
				</h4>
			)}
		</>
	);
};

Verify.whyDidYouRender = true;

export default Verify;
