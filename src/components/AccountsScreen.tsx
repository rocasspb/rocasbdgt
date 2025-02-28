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
    IconButton,
    Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Account } from '../types/Account';
import AccountDialog from './AccountDialog';

interface AccountsScreenProps {
    accounts: Account[];
    setAccounts: (accounts: Account[]) => void;
    onBack: () => void;
}

export default function AccountsScreen({ accounts, setAccounts, onBack }: AccountsScreenProps) {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

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
                    Accounts
                </Typography>
                <Button
                    variant="outlined"
                    onClick={onBack}
                >
                    BACK
                </Button>
            </Stack>
            
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddAccount}
                sx={{ 
                    mb: 4, 
                    width: '100%', 
                    py: 2,
                    borderRadius: 3,
                    fontSize: '1.1rem'
                }}
            >
                ADD ACCOUNT
            </Button>

            <List sx={{ width: '100%', mb: 4 }}>
                {accounts.map((account) => (
                    <ListItem 
                        key={account.id}
                        sx={{ 
                            mb: 2,
                            bgcolor: 'background.paper',
                            borderRadius: 3,
                            boxShadow: 1,
                            pr: 12,
                            p: 3
                        }}
                    >
                        <ListItemText 
                            primary={account.name}
                            secondary={`Currency: ${account.currency}`}
                            primaryTypographyProps={{
                                variant: 'h5',
                                component: 'h2',
                                sx: { mb: 1 }
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