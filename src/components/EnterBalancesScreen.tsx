import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Stack,
    Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import { Account } from '../types/Account';
import { Balance } from '../types/Balance';

interface EnterBalancesScreenProps {
    accounts: Account[];
    onSave: (balances: Balance[]) => void;
    onBack: () => void;
}

export default function EnterBalancesScreen({ accounts, onSave, onBack }: EnterBalancesScreenProps) {
    const [date, setDate] = useState<Date>(new Date());
    const [values, setValues] = useState<Record<string, string>>({});

    const handleValueChange = (accountId: string, value: string) => {
        setValues(prev => ({
            ...prev,
            [accountId]: value
        }));
    };

    const handleSubmit = () => {
        const balances: Balance[] = Object.entries(values)
            .filter(([_, value]) => value !== '')
            .map(([accountId, value]) => ({
                id: Date.now().toString() + accountId,
                accountId,
                date: date.toISOString(),
                value: parseFloat(value)
            }));
        
        onSave(balances);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack 
                direction="row" 
                justifyContent="space-between" 
                alignItems="center" 
                sx={{ mb: 3 }}
            >
                <Typography 
                    variant="h4" 
                    component="h1"
                >
                    Enter Balances
                </Typography>
                <Button
                    variant="outlined"
                    onClick={onBack}
                >
                    BACK
                </Button>
            </Stack>

            <Paper sx={{ p: 3, mb: 3 }}>
                <DatePicker
                    label="Date"
                    value={date}
                    onChange={(newDate: Date | null) => newDate && setDate(newDate)}
                    format="dd/MM/yyyy"
                    sx={{ width: '100%', mb: 3 }}
                />

                <Stack spacing={2}>
                    {accounts.map(account => (
                        <TextField
                            key={account.id}
                            label={account.name}
                            type="number"
                            value={values[account.id] || ''}
                            onChange={(e) => handleValueChange(account.id, e.target.value)}
                            InputProps={{
                                endAdornment: account.currency
                            }}
                            fullWidth
                        />
                    ))}
                </Stack>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{ mt: 3, width: '100%', py: 1.5 }}
                >
                    SAVE BALANCES
                </Button>
            </Paper>
        </Container>
    );
} 