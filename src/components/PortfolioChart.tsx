import React from 'react';
import { Typography, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartDataPoint {
    date: string;
    total: number;
    ma6?: number;
}

interface PortfolioChartProps {
    data: ChartDataPoint[];
}

export default function PortfolioChart({ data }: PortfolioChartProps) {
    // Calculate 6-point moving average
    const dataWithMA = data.map((point, index) => {
        if (index < 5) {
            return { ...point, ma6: null };
        }
        const last6Points = data.slice(index - 5, index + 1);
        const ma6 = last6Points.reduce((sum, p) => sum + p.total, 0) / 6;
        return { ...point, ma6 };
    });

    return (
        <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
                Portfolio Value Over Time
            </Typography>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={dataWithMA}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="date" 
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            style={{ fontSize: '0.75rem' }}
                        />
                        <YAxis 
                            domain={[
                                (dataMin: number) => Math.min(dataMin, (dataMin * 0.9)),
                                (dataMax: number) => Math.max(dataMax, (dataMax * 1.1))
                            ]}
                            tickFormatter={(value) => value.toFixed(2)}
                            style={{ fontSize: '0.75rem' }}
                        />
                        <Tooltip 
                            formatter={(value: number) => value.toFixed(2)}
                        />
                        <Legend style={{ fontSize: '0.75rem' }} />
                        <Line 
                            type="monotone" 
                            dataKey="total" 
                            stroke="#2196f3" 
                            strokeWidth={2}
                            dot={false}
                            name="Total"
                        />
                        <Line 
                            type="monotone" 
                            dataKey="ma6" 
                            stroke="#4caf50" 
                            strokeWidth={2}
                            dot={false}
                            name="6-point MA"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Paper>
    );
} 