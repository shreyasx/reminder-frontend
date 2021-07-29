import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/helper";
import { API } from "../backend";
import { addTodo, deleteTodo, updateTodo } from "./homeHelper";

const Todos = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [todos, setTodos] = useState([]);

	const errorMessage = () =>
		error && <p key={1} style={{ color: "red" }}>{`Invalid data entered.`}</p>;

	const getTodos = () => {
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
				setLoading(false);
			})
			.catch(console.log);
	};

	useEffect(getTodos, []);

	return (
		<>
			{errorMessage()}
			<h3>Todos:</h3>
			{loading ? (
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
										setLoading(true);
										updateTodo(todo._id, getTodos);
									}}
									checked={todo.completed}
									key={i + 99}
									type="checkbox"
									id={`todo${todo.i + 1}`}
									value={todo.title}
								/>{" "}
								<label key={i + 98} htmlFor={`todo${todo.i + 1}`}>
									{todo.title}
								</label>
							</>
						);
					})}
				</>
			)}
			<h4>Add Todo:</h4>
			<label className={`label2`} htmlFor="tofoTitle">
				Title:
			</label>
			<input type="text" id="todoTitle" />
			<br />
			<br />
			{!loading && (
				<button
					onClick={() => {
						setError(false);
						setLoading(true);
						addTodo(getTodos, () => {
							setError(true);
							setLoading(false);
						});
					}}
				>
					Add todo
				</button>
			)}
		</>
	);
};

export default Todos;
