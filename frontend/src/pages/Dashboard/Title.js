import React from "react";
import Typography from "@material-ui/core/Typography";

const Title = props => {
	return (
		<Typography 
			component="h2" 
			variant="h6" 
			gutterBottom
			sx={{
				color: "#ffffff",
				fontWeight: 600,
				fontSize: "1.1rem",
				marginBottom: "16px",
			}}
		>
			{props.children}
		</Typography>
	);
};

export default Title;
