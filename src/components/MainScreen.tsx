import React from 'react';
import {
    Container,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Stack,
    IconButton
} from '@mui/material';
import { format } from 'date-fns';
import { Account } from '../types/Account';
import { Balance } from '../types/Balance';
import PortfolioChart from './PortfolioChart';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';

interface MainScreenProps {
    accounts: Account[];
    balances: Balance[];
    onNavigateToAccounts: () => void;
    onEnterBalances: () => void;
    onEditBalances: (date: string, values: Record<string, number>) => void;
    onImportData: (data: { accounts: Account[], balances: Balance[] }) => void;
}

export default function MainScreen({ accounts, balances, onNavigateToAccounts, onEnterBalances, onEditBalances, onImportData }: MainScreenProps) {
    // Group balances by date
    const balancesByDate = balances.reduce((acc, balance) => {
        const date = balance.date.split('T')[0];
        if (!acc[date]) {
            acc[date] = {};
        }
        acc[date][balance.accountId] = balance.value;
        return acc;
    }, {} as Record<string, Record<string, number>>);

    // Sort dates in descending order
    const dates = Object.keys(balancesByDate)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const formatDate = (dateStr: string) => {
        return format(new Date(dateStr), 'dd/MM/yyyy');
    };

    // Prepare data for the chart (in ascending order for better visualization)
    const chartData = dates.slice().reverse().map(date => {
        const rowBalances = balancesByDate[date];
        const total = accounts.reduce(
            (sum, account) => sum + (rowBalances[account.id] || 0),
            0
        );
        return {
            date: formatDate(date),
            total
        };
    });

    const handleExport = () => {
        const data = {
            accounts,
            balances
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `budget-tracker-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target?.result as string);
                        onImportData(data);
                    } catch (error) {
                        alert('Invalid file format');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Overview
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        onClick={handleImport}
                    >
                        IMPORT
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={handleExport}
                    >
                        EXPORT
                    </Button>
                    <Button 
                        variant="outlined"
                        onClick={onNavigateToAccounts}
                    >
                        MANAGE ACCOUNTS
                    </Button>
                    <Button 
                        variant="contained"
                        onClick={onEnterBalances}
                    >
                        ENTER BALANCES
                    </Button>
                </Stack>
            </Stack>

            <PortfolioChart data={chartData} />

            <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            {accounts.map(account => (
                                <TableCell key={account.id} align="right">
                                    {account.name}
                                </TableCell>
                            ))}
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dates.map(date => {
                            const rowBalances = balancesByDate[date];
                            const total = accounts.reduce(
                                (sum, account) => sum + (rowBalances[account.id] || 0),
                                0
                            );

                            return (
                                <TableRow key={date}>
                                    <TableCell component="th" scope="row">
                                        {formatDate(date)}
                                    </TableCell>
                                    {accounts.map(account => (
                                        <TableCell key={account.id} align="right">
                                            {rowBalances[account.id]?.toFixed(2) || '-'}
                                        </TableCell>
                                    ))}
                                    <TableCell align="right">
                                        {total.toFixed(2)}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={() => onEditBalances(date, rowBalances)}
                                            size="small"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
} 