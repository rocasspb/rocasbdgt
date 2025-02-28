import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AccountsScreen from './components/AccountsScreen';
import EnterBalancesScreen from './components/EnterBalancesScreen';
import { Account } from './types/Account';
import { Balance } from './types/Balance';

type Screen = 'accounts' | 'enterBalances';

function App() {
    const [currentScreen, setCurrentScreen] = useState<Screen>('accounts');
    const [accounts, setAccounts] = useState<Account[]>([
        { id: '1', name: 'Main Account', currency: 'EUR' },
        { id: '2', name: 'Savings', currency: 'EUR' },
    ]);

    const handleSaveBalances = (balances: Balance[]) => {
        console.log('Saving balances:', balances);
        setCurrentScreen('accounts');
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            {currentScreen === 'accounts' && (
                <AccountsScreen 
                    accounts={accounts}
                    setAccounts={setAccounts}
                    onEnterBalances={() => setCurrentScreen('enterBalances')}
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
