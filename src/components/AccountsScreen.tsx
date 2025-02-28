import React from 'react';
import { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    Button, 
    List, 
    ListItem, 
    ListItemText,
    ListItemSecondaryAction,
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Account } from '../types/Account';
import AccountDialog from './AccountDialog';

export default function AccountsScreen() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    // Temporary mock data - replace with API call later
    useEffect(() => {
        setAccounts([
            { id: '1', name: 'Main Account', currency: 'EUR' },
            { id: '2', name: 'Savings', currency: 'EUR' },
        ]);
    }, []);

    const handleAddAccount = () => {
        setSelectedAccount(null);
        setOpenDialog(true);
    };

    const handleEditAccount = (account: Account) => {
        setSelectedAccount(account);
        setOpenDialog(true);
    };

    const handleDeleteAccount = (accountId: string) => {
        setAccounts(accounts.filter(account => account.id !== accountId));
    };

    const handleSaveAccount = (account: Account) => {
        if (selectedAccount) {
            setAccounts(accounts.map(a => a.id === account.id ? account : a));
        } else {
            setAccounts([...accounts, { ...account, id: Date.now().toString() }]);
        }
        setOpenDialog(false);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                sx={{ mb: 3 }}
            >
                Accounts
            </Typography>
            
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddAccount}
                sx={{ mb: 4, width: '300px', py: 1.5 }}
            >
                ADD ACCOUNT
            </Button>

            <List sx={{ width: '100%' }}>
                {accounts.map((account) => (
                    <ListItem 
                        key={account.id}
                        sx={{ 
                            mb: 2,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            boxShadow: 1,
                            pr: 12 // Add padding for action buttons
                        }}
                    >
                        <ListItemText 
                            primary={account.name}
                            secondary={`Currency: ${account.currency}`}
                            primaryTypographyProps={{
                                variant: 'h6',
                                component: 'h2'
                            }}
                        />
                        <ListItemSecondaryAction>
                            <IconButton 
                                edge="end" 
                                aria-label="edit"
                                onClick={() => handleEditAccount(account)}
                                sx={{ mr: 1 }}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton 
                                edge="end" 
                                aria-label="delete"
                                onClick={() => handleDeleteAccount(account.id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>

            <AccountDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSave={handleSaveAccount}
                account={selectedAccount}
            />
        </Container>
    );
} 