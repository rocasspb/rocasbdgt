import React from 'react';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { Account } from '../types/Account';

interface AccountDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (account: Account) => void;
    account: Account | null;
}

export default function AccountDialog({ open, onClose, onSave, account }: AccountDialogProps) {
    const [name, setName] = useState('');
    const [currency] = useState('EUR'); // For now, only EUR is supported

    useEffect(() => {
        if (account) {
            setName(account.name);
        } else {
            setName('');
        }
    }, [account]);

    const handleSubmit = () => {
        onSave({
            id: account?.id || '',
            name,
            currency
        });
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {account ? 'Edit Account' : 'Add Account'} 
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Account Name"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                        value={currency}
                        label="Currency"
                        disabled
                    >
                        <MenuItem value="EUR">EUR</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
} 