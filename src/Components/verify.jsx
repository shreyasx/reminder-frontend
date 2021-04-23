import React, { useState, useEffect } from "react";
import { API } from "../backend";

const Verify = ({ match }) => {
	const [resp, setResp] = useState(false);
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
				setResp(res);
				setLoading(false);
			})
			.catch(console.log);
	};

	useEffect(check, [match.params.token]);

	return (
		<>
			{loading ? (
				<img
					style={{ width: "200px" }}
					src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
					alt="loading"
				/>
			) : (
				<h2>
					{resp === true ? (
						<>
							Account verified. Go to{" "}
							<a href="https://reminder-app-shreyasx.vercel.app/">
								Reminders & Todos
							</a>{" "}
							or refresh the page that brought you here.
						</>
					) : (
						resp.error
					)}
				</h2>
			)}
		</>
	);
};

export default Verify;
