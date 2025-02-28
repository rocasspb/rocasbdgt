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

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }, [accounts]);

    useEffect(() => {
        localStorage.setItem('balances', JSON.stringify(balances));
    }, [balances]);

    const handleSaveBalances = (newBalances: Balance[]) => {
        setBalances([...balances, ...newBalances]);
        setCurrentScreen('main');
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            {currentScreen === 'main' && (
                <MainScreen 
                    accounts={accounts}
                    balances={balances}
                    onNavigateToAccounts={() => setCurrentScreen('accounts')}
                    onEnterBalances={() => setCurrentScreen('enterBalances')}
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
                    onBack={() => setCurrentScreen('main')}
                />
            )}
        </LocalizationProvider>
    );
}

export default App;
