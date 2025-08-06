import React from "react";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import TicketsManagerTabs from "../../components/TicketsManagerTabs";
import Ticket from "../../components/Ticket";
import logo from "../../assets/logo.png";

import { i18n } from "../../translate/i18n";

const useStyles = makeStyles(theme => ({
	chatContainer: {
		flex: 1,
		padding: 0,
		height: `calc(100vh - 48px)`,
		overflowY: "hidden",
		backgroundColor: "#0f0f0f",
	},

	chatPapper: {
		display: "flex",
		height: "100%",
		backgroundColor: "#0f0f0f",
		borderRadius: 0,
		boxShadow: "none",
	},

	contactsWrapper: {
		display: "flex",
		height: "100%",
		flexDirection: "column",
		overflowY: "hidden",
		backgroundColor: "#1a1a1a",
		borderRight: "1px solid #333333",
	},
	messagessWrapper: {
		display: "flex",
		height: "100%",
		flexDirection: "column",
		backgroundColor: "#0f0f0f",
	},
	welcomeMsg: {
		background: "#0f0f0f",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
		textAlign: "center",
		flexDirection: "column",
	},
	welcomeText: {
		color: "#ffffff",
		fontSize: "1.5rem",
		fontWeight: 300,
		marginBottom: theme.spacing(2),
	},
	welcomeSubtext: {
		color: "#a0a0a0",
		fontSize: "1rem",
	},
	logo: {
		maxWidth: "200px",
		height: "auto",
		marginBottom: theme.spacing(3),
		opacity: 0.7,
	}
}));

const Chat = () => {
	const classes = useStyles();
	const { ticketId } = useParams();

	return (
		<div className={classes.chatContainer}>
			<div className={classes.chatPapper}>
				<Grid container spacing={0}>
					<Grid item xs={4} className={classes.contactsWrapper}>
						<TicketsManagerTabs />
					</Grid>
					<Grid item xs={8} className={classes.messagessWrapper}>
						{ticketId ? (
							<>
								<Ticket />
							</>
						) : (
							<div className={classes.welcomeMsg}>
								<img 
									src={logo} 
									alt="Logo" 
									className={classes.logo}
								/>
								<Typography className={classes.welcomeText}>
									{i18n.t("chat.noTicketMessage")}
								</Typography>
								<Typography className={classes.welcomeSubtext}>
									Selecione um ticket para começar a conversa
								</Typography>
							</div>
						)}
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default Chat;
