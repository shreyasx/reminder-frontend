import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { signout } from "../auth/helper";
import { Reminders, Todos, AddReminder, IntroText } from ".";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import { connect } from "react-redux";
import {
	getReminders,
	clearReminderMessages,
} from "../store/actions/reminders";
import { getTodos, clearTodoMessages } from "../store/actions/todos";
import AlarmAddIcon from "@material-ui/icons/AlarmAdd";
import {
	Typography,
	Button,
	Tab,
	useMediaQuery,
	Tabs,
	AppBar,
	Box,
} from "@material-ui/core";

const mapDispatchToProps = dispatch => ({
	getReminders: () => dispatch(getReminders()),
	getTodos: () => dispatch(getTodos()),
	clearReminderMessages: () => dispatch(clearReminderMessages()),
	clearTodoMessages: () => dispatch(clearTodoMessages()),
});

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-force-tabpanel-${index}`}
			aria-labelledby={`scrollable-force-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index) {
	return {
		id: `tab-${index}`,
		"aria-controls": `tabpanel-${index}`,
	};
}

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		width: "100%",
		backgroundColor: theme.palette.background.paper,
	},
	tabs: { margin: "0 auto" },
}));

const lastTab = JSON.parse(localStorage.getItem("lastTab"));

function ScrollableTabsButtonForce(props) {
	const classes = useStyles();
	const [value, setValue] = React.useState(lastTab ? lastTab : 0);

	React.useEffect(() => {
		props.getReminders();
		props.getTodos();
		// eslint-disable-next-line
	}, []);

	const handleChange = (event, newValue) => {
		setValue(newValue);
		props.clearReminderMessages();
		props.clearTodoMessages();
		localStorage.setItem("lastTab", JSON.stringify(newValue));
	};

	const matches = useMediaQuery("(min-width: 740px)");

	return (
		<div className={classes.root}>
			<AppBar position="static" color="default">
				<Tabs
					className={`${matches ? classes.tabs : ""}`}
					value={value}
					onChange={handleChange}
					indicatorColor="primary"
					textColor="primary"
					variant="scrollable"
					scrollButtons="on"
				>
					<Tab label="Reminders" icon={<AccessAlarmIcon />} {...a11yProps(0)} />
					<Tab label="Add Reminder" icon={<AlarmAddIcon />} {...a11yProps(1)} />
					<Tab label="To-dos" icon={<CheckCircleIcon />} {...a11yProps(2)} />
					<Tab label="Profile" icon={<AccountCircleIcon />} {...a11yProps(3)} />
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0}>
				<IntroText />
				<Reminders />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<IntroText />
				<AddReminder />
			</TabPanel>
			<TabPanel value={value} index={2}>
				<IntroText />
				<Todos />
			</TabPanel>
			<TabPanel value={value} index={3}>
				<IntroText />
				<Button
					onClick={() => signout(() => props.history.push("/"))}
					variant="outlined"
					color="primary"
				>
					signout
				</Button>
			</TabPanel>
		</div>
	);
}

export default connect(null, mapDispatchToProps)(ScrollableTabsButtonForce);
