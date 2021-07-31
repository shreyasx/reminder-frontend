import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Tab from "@material-ui/core/Tab";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import AlarmAddIcon from "@material-ui/icons/AlarmAdd";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { isAuthenticated } from "../auth/helper";
import { Reminders, Todos, AddReminder } from ".";

const introText = () => (
	<>
		<h3>Hey there, {isAuthenticated().user.name}.</h3>
		<p>
			Here you can see all your Reminders & Todos. We would love for you to keep
			in mind a few things.
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

export default function ScrollableTabsButtonForce() {
	const classes = useStyles();
	const [value, setValue] = React.useState(0);
	const handleChange = (event, newValue) => setValue(newValue);
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
				{introText()}
				<Reminders />
			</TabPanel>
			<TabPanel value={value} index={1}>
				{introText()}
				<AddReminder />
			</TabPanel>
			<TabPanel value={value} index={2}>
				{introText()}
				<Todos />
			</TabPanel>
			<TabPanel value={value} index={3}>
				{introText()}
				Profile YO
			</TabPanel>
		</div>
	);
}
