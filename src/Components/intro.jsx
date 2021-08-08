import React from "react";
import { isAuthenticated } from "../auth/helper";

const IntroText = () => {
	return (
		<>
			<h2>Hey there, {isAuthenticated().user.name}.</h2>
			<p>
				Here you can see all your Reminders & Todos. We would love for you to
				keep in mind a few things.
			</p>
			<ul>
				<li>
					You need to verify your email address to be able to set reminders.
				</li>
				<li>You cannot set a reminder in the next 2 minutes.</li>
			</ul>
		</>
	);
};

export default IntroText;
