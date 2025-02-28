import React, { useState } from 'react';
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
    const [accounts, setAccounts] = useState<Account[]>([
        { id: '1', name: 'Main Account', currency: 'EUR' },
        { id: '2', name: 'Savings', currency: 'EUR' },
    ]);
    const [balances, setBalances] = useState<Balance[]>([]);

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
                    onEnterBalances={() => setCurrentScreen('enterBalances')}
                    onBack={() => setCurrentScreen('main')}
                />
            )}
            {currentScreen === 'enterBalances' && (
                <EnterBalancesScreen
                    accounts={accounts}
                    onSave={handleSaveBalances}
                />
            )}
        </LocalizationProvider>
    );
}

export default App;
