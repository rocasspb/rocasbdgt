import React from 'react';
import { Typography, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
    date: string;
    total: number;
}

interface PortfolioChartProps {
    data: ChartDataPoint[];
}

export default function PortfolioChart({ data }: PortfolioChartProps) {
    // Calculate min and max values with some padding
    const minValue = Math.min(...data.map(d => d.total));
    const maxValue = Math.max(...data.map(d => d.total));
    const padding = (maxValue - minValue) * 0.1; // 10% padding

    return (
        <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
                Portfolio Value Over Time
            </Typography>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="date" 
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis 
                            domain={[minValue - padding, maxValue + padding]}
                            tickFormatter={(value) => value.toFixed(2)}
                        />
                        <Tooltip />
                        <Line 
                            type="monotone" 
                            dataKey="total" 
                            stroke="#2196f3" 
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Paper>
    );
} 