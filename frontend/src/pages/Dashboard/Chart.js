import React, { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import {
	CartesianGrid,
	XAxis,
	YAxis,
	Label,
	ResponsiveContainer,
	LineChart,
	Line,
	Tooltip,
	Legend,
} from "recharts";
import { startOfHour, parseISO, format } from "date-fns";

import Title from "./Title";
import useTickets from "../../hooks/useTickets";

const Chart = ({ dateStartTicket, dateEndTicket, queueTicket }) => {
	const theme = useTheme();

	const { tickets, count } = useTickets({
		dateStart: dateStartTicket,
		dateEnd: dateEndTicket,
		queueIds: queueTicket ? `[${queueTicket}]` : "[]",
	});

	const [chartData, setChartData] = useState([
		{ time: "00:00", amount: 0 },
		{ time: "01:00", amount: 0 },
		{ time: "02:00", amount: 0 },
		{ time: "03:00", amount: 0 },
		{ time: "04:00", amount: 0 },
		{ time: "05:00", amount: 0 },
		{ time: "06:00", amount: 0 },
		{ time: "07:00", amount: 0 },
		{ time: "08:00", amount: 0 },
		{ time: "09:00", amount: 0 },
		{ time: "10:00", amount: 0 },
		{ time: "11:00", amount: 0 },
		{ time: "12:00", amount: 0 },
		{ time: "13:00", amount: 0 },
		{ time: "14:00", amount: 0 },
		{ time: "15:00", amount: 0 },
		{ time: "16:00", amount: 0 },
		{ time: "17:00", amount: 0 },
		{ time: "18:00", amount: 0 },
		{ time: "19:00", amount: 0 },
		{ time: "20:00", amount: 0 },
		{ time: "21:00", amount: 0 },
		{ time: "22:00", amount: 0 },
		{ time: "23:00", amount: 0 },
	]);

	useEffect(() => {
		setChartData((prevState) => {
			let aux = [...prevState];

			aux.forEach((a) => {
				tickets.forEach((ticket) => {
					format(startOfHour(parseISO(ticket.createdAt)), "HH:mm") ===
						a.time && a.amount++;
				});
			});

			return aux;
		});
	}, [tickets]);

	return (
		<React.Fragment>
			<Title>{`${"Atendimentos Criados: "}${count}`}</Title>
			<ResponsiveContainer width="100%" height={300}>
				<LineChart
					data={chartData}
					margin={{
						top: 20,
						right: 30,
						left: 20,
						bottom: 20,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" stroke="#333333" />
					<XAxis
						dataKey="time"
						stroke="#a0a0a0"
						tick={{ fill: "#a0a0a0", fontSize: 12 }}
					/>
					<YAxis
						type="number"
						allowDecimals={false}
						stroke="#a0a0a0"
						tick={{ fill: "#a0a0a0", fontSize: 12 }}
					>
						<Tooltip 
							contentStyle={{
								backgroundColor: "#1a1a1a",
								border: "1px solid #333333",
								borderRadius: "8px",
								color: "#ffffff",
							}}
							labelStyle={{ color: "#ffffff" }}
						/>
						<Legend 
							wrapperStyle={{ color: "#a0a0a0" }}
						/>
						<Label
							angle={270}
							position="left"
							style={{
								textAnchor: "middle",
								fill: "#a0a0a0",
								fontSize: 12,
							}}
						>
							Tickets
						</Label>
					</YAxis>
					<Line
						type="monotone"
						dataKey="amount"
						stroke="#00d4aa"
						strokeWidth={3}
						dot={{ fill: "#00d4aa", strokeWidth: 2, r: 4 }}
						activeDot={{ r: 6, stroke: "#00d4aa", strokeWidth: 2, fill: "#ffffff" }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</React.Fragment>
	);
};

export default Chart;
