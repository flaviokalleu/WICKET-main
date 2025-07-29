import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import brLocale from 'date-fns/locale/pt-BR';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { i18n } from '../../translate/i18n';
import { AuthContext } from "../../context/Auth/AuthContext";
import FilterListIcon from '@mui/icons-material/FilterList';
import api from '../../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const ChatsUser = () => {
    const [initialDate, setInitialDate] = useState(new Date());
    const [finalDate, setFinalDate] = useState(new Date());
    const [ticketsData, setTicketsData] = useState([]);
    const { user } = useContext(AuthContext);

    const companyId = user?.companyId;

    // Memoized fetch function
    const handleGetTicketsInformation = useCallback(async () => {
        if (!companyId) return;

        try {
            const { data } = await api.get(`/dashboard/ticketsUsers`, {
                params: {
                    initialDate: format(initialDate, 'yyyy-MM-dd'),
                    finalDate: format(finalDate, 'yyyy-MM-dd'),
                    companyId,
                },
            });
            setTicketsData(data?.data || []);
        } catch (error) {
            toast.error('Erro ao buscar informações dos tickets');
        }
    }, [initialDate, finalDate, companyId]);

    useEffect(() => {
        handleGetTicketsInformation();
    }, [handleGetTicketsInformation]);

    const pieData = {
        labels: ticketsData.map((item) => item.nome || 'Desconhecido'),
        datasets: [
            {
                data: ticketsData.map((item) => item.quantidade || 0),
                backgroundColor: [
                    '#00d4aa',
                    '#4facfe', 
                    '#fa709a',
                    '#89f7fe',
                    '#ffecd2',
                    '#a8edea',
                    '#d299c2',
                    '#66a6ff'
                ],
                hoverBackgroundColor: [
                    '#00b894',
                    '#00f2fe',
                    '#fee140',
                    '#66a6ff',
                    '#fcb69f',
                    '#fed6e3',
                    '#fef9d7',
                    '#89f7fe'
                ],
                borderColor: '#333333',
                borderWidth: 2,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#ffffff',
                    font: {
                        size: 12,
                        family: 'Inter, sans-serif',
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
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
                    label: (tooltipItem) => {
                        const value = tooltipItem.raw || 0;
                        const label = tooltipItem.label || 'Sem Nome';
                        const total = tooltipItem.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
        elements: {
            arc: {
                borderWidth: 2,
            },
        },
    };

    return (
        <div style={{ 
            backgroundColor: 'transparent', 
            borderRadius: '0',
            padding: '16px',
            color: '#ffffff'
        }}>
            <Grid container spacing={3} alignItems="center" style={{ marginBottom: '24px' }}>
                <Grid item xs={12} sm={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={brLocale}>
                        <DatePicker
                            value={initialDate}
                            onChange={setInitialDate}
                            label={i18n.t("dashboard.date.initialDate")}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    fullWidth 
                                    size="small"
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            backgroundColor: '#2a2a2a',
                                            color: '#ffffff',
                                            borderRadius: '8px',
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#a0a0a0',
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#333333',
                                        },
                                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#00d4aa',
                                        },
                                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#00d4aa',
                                        },
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={brLocale}>
                        <DatePicker
                            value={finalDate}
                            onChange={setFinalDate}
                            label={i18n.t("dashboard.date.finalDate")}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    fullWidth 
                                    size="small"
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            backgroundColor: '#2a2a2a',
                                            color: '#ffffff',
                                            borderRadius: '8px',
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#a0a0a0',
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#333333',
                                        },
                                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#00d4aa',
                                        },
                                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#00d4aa',
                                        },
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Button
                        startIcon={<FilterListIcon />}
                        onClick={handleGetTicketsInformation}
                        variant="contained"
                        size="small"
                        sx={{
                            background: 'linear-gradient(145deg, #00d4aa, #00b894)',
                            color: '#ffffff',
                            borderRadius: '8px',
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            '&:hover': {
                                background: 'linear-gradient(145deg, #00b894, #009688)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(0, 212, 170, 0.3)',
                            },
                        }}
                    >
                        {i18n.t("FILTRAR")}
                    </Button>
                </Grid>
            </Grid>

            <div style={{ 
                marginTop: '20px', 
                position: 'relative', 
                height: '320px', 
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {ticketsData.length > 0 ? (
                    <div style={{ 
                        width: '280px', 
                        height: '280px', 
                        margin: '0 auto'
                    }}>
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        color: '#a0a0a0',
                        fontSize: '16px'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'linear-gradient(145deg, #333333, #2a2a2a)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px auto',
                            fontSize: '24px'
                        }}>
                            📊
                        </div>
                        Nenhum dado disponível para o período selecionado
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatsUser;
