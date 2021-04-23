import { useEffect, useState } from "react";
import { isAuthenticated, signout } from "../auth/helper";
import { API } from "../backend";
import {
	addReminder,
	deleteReminder,
	addTodo,
	deleteTodo,
	updateTodo,
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

	return (
		<>
			<h1>Hi, {isAuthenticated().user.name}</h1>
			{errorMessage()}
			{successMessage()}
			<div className="row">
				<div
					style={{ borderRight: "2px solid black", minHeight: "85vh" }}
					className="col-md-6"
				>
					<h1 style={{ color: "red" }}>Remninders</h1>
					{loadingLeft ? (
						<h3>Loading..</h3>
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
							<h2 style={{ color: "green" }}>Add Remninder</h2>
							<label htmlFor="title">Title:</label>
							<input type="text" id="title" />
							<br />
							<label htmlFor="date">Date:</label>
							<input type="date" id="date" />
							<br />
							<label htmlFor="time">Time:</label>
							<input type="time" id="time" />
							<br />
							<br />
							{verified ? (
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
								<button onClick={verify}>Verify email to set reminder</button>
							)}
						</>
					)}
				</div>
				<div
					style={{ borderLeft: "2px solid black", minHeight: "85vh" }}
					className="col-md-6"
				>
					<h1 style={{ color: "red" }}>Todos</h1>
					{loadingRight ? (
						<h3>Loading..</h3>
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
							<hr />
							<h2 style={{ color: "green" }}>Add Todo</h2>
							<label htmlFor="tofoTitle">Title:</label>
							<input type="text" id="todoTitle" />
							<br />
							<button
								onClick={() => {
									setError(false);
									setLoadingRight(true);
									addTodo(preload, () => setError(true));
								}}
							>
								Add todo
							</button>
						</>
					)}
				</div>
			</div>
			<button
				onClick={() => {
					signout(() => {
						history.push("/");
					});
				}}
				style={{ margin: "0 20px" }}
			>
				Signout
			</button>
		</>
	);
};

export default Home;
