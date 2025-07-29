import React, { useEffect, useState, useContext } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import brLocale from 'date-fns/locale/pt-BR';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Button, Grid, TextField } from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import api from '../../services/api';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import './button.css';
import { i18n } from '../../translate/i18n';
import { AuthContext } from "../../context/Auth/AuthContext";
import { useTheme } from '@material-ui/core';
import FilterListIcon from '@mui/icons-material/FilterList';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            display: false,
        },
        title: {
            display: false,
        },
        tooltip: {
            backgroundColor: '#1a1a1a',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#333333',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
                label: (context) => {
                    return `Atendimentos: ${context.raw}`;
                },
            },
        },
    },
    animation: {
        duration: 1000,
        easing: 'easeInOutQuad',
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: '#333333',
                borderColor: '#333333',
            },
            ticks: {
                color: '#a0a0a0',
                font: {
                    size: 12,
                },
            },
        },
        x: {
            grid: {
                color: '#333333',
                borderColor: '#333333',
            },
            ticks: {
                color: '#a0a0a0',
                font: {
                    size: 12,
                },
                maxRotation: 45,
            },
        },
    },
    elements: {
        bar: {
            borderRadius: 6,
            borderSkipped: false,
        },
    },
};

export const ChartsDate = () => {
    const theme = useTheme();
    const [initialDate, setInitialDate] = useState(new Date());
    const [finalDate, setFinalDate] = useState(new Date());
    const [ticketsData, setTicketsData] = useState({ data: [], count: 0 });
    const { user } = useContext(AuthContext);

    const companyId = user.companyId;

    useEffect(() => {
        if (companyId) {
            handleGetTicketsInformation();
        }
    }, [companyId]);

    // Cores sólidas para as barras
    const barColors = [
        '#00d4aa', // Verde primário
        '#4facfe', // Azul
        '#fa709a', // Rosa
        '#ffce54', // Amarelo
        '#9966ff', // Roxo
        '#ff9f40', // Laranja
        '#4bc0c0', // Ciano
        '#c9cbcf', // Cinza
    ];    const dataCharts = {
        labels: ticketsData && ticketsData?.data.length > 0 && ticketsData?.data.map((item) => (item.hasOwnProperty('horario') ? `Das ${item.horario}:00 as ${item.horario}:59` : item.data)),
        datasets: [
            {
                data: ticketsData?.data.length > 0 && ticketsData?.data.map((item) => item.total),
                backgroundColor: ticketsData?.data.map((_, index) => barColors[index % barColors.length] + '80'), // Cores com transparência
                borderColor: ticketsData?.data.map((_, index) => barColors[index % barColors.length]), // Bordas coloridas
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
                hoverBackgroundColor: ticketsData?.data.map((_, index) => barColors[index % barColors.length]), // Cores sólidas ao hover
                hoverBorderColor: '#00d4aa', // Borda principal ao hover
                hoverBorderWidth: 3,
            },
        ],
    };

    const handleGetTicketsInformation = async () => {
        try {
            const { data } = await api.get(`/dashboard/ticketsDay?initialDate=${format(initialDate, 'yyyy-MM-dd')}&finalDate=${format(finalDate, 'yyyy-MM-dd')}&companyId=${companyId}`);
            setTicketsData(data);
        } catch (error) {
            toast.error('Erro ao buscar informações dos tickets');
        }
    }

    return (
        <>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                {i18n.t("dashboard.users.totalAttendances")} ({ticketsData?.count})
            </Typography>

            <Grid container spacing={2}>
                <Grid item>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={brLocale}>
                        <DatePicker
                            value={initialDate}
                            onChange={(newValue) => { setInitialDate(newValue) }}
                            label={i18n.t("dashboard.date.initialDate")}
                            renderInput={(params) => 
                                <TextField 
                                    fullWidth 
                                    {...params} 
                                    sx={{ 
                                        width: '20ch',
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#2a2a2a',
                                            color: '#ffffff',
                                            '& fieldset': {
                                                borderColor: '#333333',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#00d4aa',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#00d4aa',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#a0a0a0',
                                            '&.Mui-focused': {
                                                color: '#00d4aa',
                                            },
                                        },
                                        '& .MuiIconButton-root': {
                                            color: '#a0a0a0',
                                        },
                                    }} 
                                />
                            }
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={brLocale}>
                        <DatePicker
                            value={finalDate}
                            onChange={(newValue) => { setFinalDate(newValue) }}
                            label={i18n.t("dashboard.date.finalDate")}
                            renderInput={(params) => 
                                <TextField 
                                    fullWidth 
                                    {...params} 
                                    sx={{ 
                                        width: '20ch',
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#2a2a2a',
                                            color: '#ffffff',
                                            '& fieldset': {
                                                borderColor: '#333333',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#00d4aa',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#00d4aa',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#a0a0a0',
                                            '&.Mui-focused': {
                                                color: '#00d4aa',
                                            },
                                        },
                                        '& .MuiIconButton-root': {
                                            color: '#a0a0a0',
                                        },
                                    }} 
                                />
                            }
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item>
                    <Button
                        startIcon={<FilterListIcon />}
                        sx={{
                            color: "white",
                            background: "linear-gradient(135deg, #00d4aa 0%, #4facfe 100%)",
                            boxShadow: "0 4px 15px rgba(0, 212, 170, 0.3)",
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 600,
                            padding: "10px 24px",
                            '&:hover': {
                                background: "linear-gradient(135deg, #4facfe 0%, #00d4aa 100%)",
                                boxShadow: "0 6px 20px rgba(0, 212, 170, 0.4)",
                                transform: "translateY(-2px)",
                            },
                            transition: "all 0.3s ease",
                        }}
                        onClick={handleGetTicketsInformation}
                        variant='contained'
                    >
                        Filtrar
                    </Button>
                </Grid>
            </Grid>
            <Bar options={options} data={dataCharts} style={{ maxWidth: '100%', maxHeight: '280px' }} />
        </>
    );
}