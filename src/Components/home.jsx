import { useEffect, useState } from "react";
import { isAuthenticated, signout } from "../auth/helper";
import { API } from "../backend";
import {
	addReminder,
	addTodo,
	deleteTodo,
	updateTodo,
	deleteReminder,
} from "./homeHelper";
import Dustbin from "../images/dustbin.webp";

const Home = ({ history }) => {
	const [reminders, setReminders] = useState([]);
	const [todos, setTodos] = useState([]);
	const [loadingLeft, setLoadingLeft] = useState(true);
	const [loadingRight, setLoadingRight] = useState(true);
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);
	const [verified, setVerified] = useState(false);

	const preload = () => {
		fetch(`${API}/user/${isAuthenticated().user.username}/todos`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${isAuthenticated().token}`,
			},
		})
			.then(r => r.json())
			.then(resp => {
				setTodos(resp);
				setLoadingRight(false);
			})
			.catch(console.log);
		fetch(`${API}/user/${isAuthenticated().user.username}/reminders`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${isAuthenticated().token}`,
			},
		})
			.then(r => r.json())
			.then(resp => {
				setReminders(
					resp.map(rem => {
						const { date, title, _id } = rem;
						const d = new Date(date);
						return { date: d.toString().split(" GMT")[0], title, _id };
					})
				);
				setLoadingLeft(false);
			})
			.catch(console.log);
		fetch(`${API}/user/${isAuthenticated().user.username}/isVerified`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${isAuthenticated().token}`,
			},
		})
			.then(r => r.json())
			.then(setVerified)
			.catch(console.log);
	};

	useEffect(preload, []);

	const verify = () => {
		setLoadingLeft(true);
		fetch(`${API}/user/verify/${isAuthenticated().user.username}`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${isAuthenticated().token}`,
			},
		})
			.then(r => r.json())
			.then(resp => {
				setLoadingLeft(false);
				resp === "Sent mail" ? setSuccess(true) : setError(true);
			})
			.catch(er => {
				setLoadingLeft(false);
				console.log(er);
			});
	};

	const errorMessage = () => {
		return error ? (
			<p style={{ color: "red" }}>{`Invalid data entered.`}</p>
		) : (
			""
		);
	};

	const successMessage = () => {
		return success ? (
			<p
				style={{ color: "green" }}
			>{`Sent a mail to the email address you provided. Check your mail!`}</p>
		) : (
			""
		);
	};

	const introText = () => (
		<>
			<button
				onClick={() => {
					signout(() => {
						history.push("/");
					});
				}}
				style={{ float: "right" }}
			>
				Signout
			</button>
			<h3>Hey there, {isAuthenticated().user.name}.</h3>
			<p>
				Here you can see all your Reminders & Todos. We would love for you to
				keep in mind a few things.
			</p>
			<ul>
				<li>
					You need to verify your email address to be able to set reminders.
				</li>
				<li>
					You cannot set a reminder in the next 2 minutes. I mean, why would you
					wanna do that, right?
				</li>
			</ul>
		</>
	);

	return (
		<div id="homeDiv">
			{introText()}
			{errorMessage()}
			{successMessage()}
			<div style={{ marginTop: "30px" }} className="row">
				<div className="halves col-md-6">
					<h3>Remninders:</h3>
					{loadingLeft ? (
						<h3>Loading..</h3>
					) : reminders.length === 0 ? (
						<h5>List empty!</h5>
					) : (
						<>
							<ul style={{ listStyleType: "circle" }}>
								{reminders.map((reminder, i) => {
									return (
										<li key={i + 97}>
											{reminder.title}: {reminder.date}{" "}
											<img
												style={{
													height: "22px",
													border: "1px solid black",
													cursor: "pointer",
												}}
												onClick={() => {
													setLoadingLeft(true);
													deleteReminder(reminder._id, preload);
												}}
												src={Dustbin}
												alt="Dustbin"
											/>
										</li>
									);
								})}
							</ul>
							<hr />
						</>
					)}
					<div
						style={
							verified
								? {}
								: {
										filter: "blur(1.5px)",
										pointerEvents: "none",
								  }
						}
						id="blur"
					>
						<h4>Add Remninder:</h4>
						<label className={`label2`} htmlFor="title">
							Title:
						</label>
						<input type="text" id="title" />
						<br />
						<label className={`label2`} htmlFor="date">
							Date:
						</label>
						<input type="date" id="date" />
						<br />
						<label className={`label2`} htmlFor="time">
							Time:
						</label>
						<input type="time" id="time" />
						<br />
					</div>
					<br />
					{loadingLeft ? (
						""
					) : verified ? (
						<button
							onClick={() => {
								setError(false);
								setLoadingLeft(true);
								addReminder(preload, () => setError(true));
							}}
						>
							Add reminder
						</button>
					) : (
						<button style={{ color: "red" }} onClick={verify}>
							Verify email to set reminder
						</button>
					)}
				</div>
				<div className="halves col-md-6">
					<h3>Todos:</h3>
					{loadingRight ? (
						<h3>Loading..</h3>
					) : todos.length === 0 ? (
						<h5>List empty!</h5>
					) : (
						<>
							{todos.map((todo, i) => {
								return (
									<>
										<input
											onChange={() => {
												setLoadingRight(true);
												updateTodo(todo._id, preload);
											}}
											checked={todo.completed && "checked"}
											key={i + 99}
											type="checkbox"
											id={`todo${todo.i + 1}`}
											value={todo.title}
										/>{" "}
										<label key={i + 98} htmlFor={`todo${todo.i + 1}`}>
											{todo.title}
										</label>{" "}
										<img
											style={{
												height: "22px",
												border: "1px solid black",
												cursor: "pointer",
											}}
											onClick={() => {
												setLoadingRight(true);
												deleteTodo(todo._id, preload);
											}}
											src={Dustbin}
											alt="Dustbin"
										/>
										<br />
									</>
								);
							})}
						</>
					)}
					<hr />
					<h4>Add Todo:</h4>
					<label className={`label2`} htmlFor="tofoTitle">
						Title:
					</label>
					<input type="text" id="todoTitle" />
					<br />
					<br />
					{!loadingRight && (
						<button
							onClick={() => {
								setError(false);
								setLoadingRight(true);
								addTodo(preload, () => setError(true));
							}}
						>
							Add todo
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
