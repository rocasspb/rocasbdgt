import React, { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AccountsScreen from './components/AccountsScreen';
import EnterBalancesScreen from './components/EnterBalancesScreen';
import MainScreen from './components/MainScreen';
import { Account } from './types/Account';
import { Balance } from './types/Balance';

type Screen = 'main' | 'accounts' | 'enterBalances';

function App() {
    const [currentScreen, setCurrentScreen] = useState<Screen>('main');
    const [accounts, setAccounts] = useState<Account[]>(() => {
        const saved = localStorage.getItem('accounts');
        return saved ? JSON.parse(saved) : [
            { id: '1', name: 'Main Account', currency: 'EUR' },
            { id: '2', name: 'Savings', currency: 'EUR' },
        ];
    });
    const [balances, setBalances] = useState<Balance[]>(() => {
        const saved = localStorage.getItem('balances');
        return saved ? JSON.parse(saved) : [];
    });
    const [editingDate, setEditingDate] = useState<string | null>(null);
    const [editingValues, setEditingValues] = useState<Record<string, number>>({});

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }, [accounts]);

    useEffect(() => {
        localStorage.setItem('balances', JSON.stringify(balances));
    }, [balances]);

    const handleEditBalances = (date: string, values: Record<string, number>) => {
        setEditingDate(date);
        setEditingValues(values);
        setCurrentScreen('enterBalances');
    };

    const handleSaveBalances = (newBalances: Balance[]) => {
        if (editingDate) {
            // Remove old balances for this date
            const filteredBalances = balances.filter(b => b.date.split('T')[0] !== editingDate);
            setBalances([...filteredBalances, ...newBalances]);
            setEditingDate(null);
            setEditingValues({});
        } else {
            setBalances([...balances, ...newBalances]);
        }
        setCurrentScreen('main');
    };

    const handleImportData = (data: { accounts: Account[], balances: Balance[] }) => {
        if (data.accounts && Array.isArray(data.accounts)) {
            setAccounts(data.accounts);
        }
        if (data.balances && Array.isArray(data.balances)) {
            setBalances(data.balances);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            {currentScreen === 'main' && (
                <MainScreen 
                    accounts={accounts}
                    balances={balances}
                    onNavigateToAccounts={() => setCurrentScreen('accounts')}
                    onEnterBalances={() => setCurrentScreen('enterBalances')}
                    onEditBalances={handleEditBalances}
                    onImportData={handleImportData}
                />
            )}
            {currentScreen === 'accounts' && (
                <AccountsScreen 
                    accounts={accounts}
                    setAccounts={setAccounts}
                    onBack={() => setCurrentScreen('main')}
                />
            )}
            {currentScreen === 'enterBalances' && (
                <EnterBalancesScreen
                    accounts={accounts}
                    onSave={handleSaveBalances}
                    onBack={() => {
                        setCurrentScreen('main');
                        setEditingDate(null);
                        setEditingValues({});
                    }}
                    initialDate={editingDate ? new Date(editingDate) : new Date()}
                    initialValues={editingValues}
                />
            )}
        </LocalizationProvider>
    );
}

export default App;
