
const mockGetGroupBalances = (groupMembers: string[], expenses: any[]) => {
    const balances: any = {};
    groupMembers.forEach(m => balances[m] = 0);

    expenses.forEach(expense => {
        const amount = expense.amount;
        const paidBy = expense.paidBy;

        console.log(`Expense: ${expense.description}, Amount: ${amount}, PaidBy: ${paidBy}, Type: ${expense.splitType}`);

        if (balances[paidBy] !== undefined) {
            balances[paidBy] += amount;
        }

        if (expense.splitType === 'EQUAL') {
            const splitCount = expense.splits.length;
            const splitAmount = amount / splitCount;
            console.log(`  Split Equal: ${splitAmount} per person (${splitCount} people)`);
            expense.splits.forEach((split: any) => {
                const id = split.user;
                if (balances[id] !== undefined) {
                    balances[id] -= splitAmount;
                }
            });
        } else if (expense.splitType === 'PERCENTAGE') {
            expense.splits.forEach((split: any) => {
                const id = split.user;
                const splitAmount = (amount * (split.percentage || 0)) / 100;
                if (balances[id] !== undefined) {
                    balances[id] -= splitAmount;
                }
            });
        }
        // ... other types
    });

    return balances;
};

// Test Case 1: Simple Equal Split
const members1 = ['A', 'B'];
const expenses1 = [
    {
        description: 'Lunch',
        amount: 100,
        paidBy: 'A',
        splitType: 'EQUAL',
        splits: [{ user: 'A' }, { user: 'B' }]
    }
];
console.log('Test 1:', mockGetGroupBalances(members1, expenses1));

// Test Case 2: Payer not in split
const members2 = ['A', 'B', 'C'];
const expenses2 = [
    {
        description: 'Dinner',
        amount: 90,
        paidBy: 'A',
        splitType: 'EQUAL',
        splits: [{ user: 'B' }, { user: 'C' }]
    }
];
console.log('Test 2:', mockGetGroupBalances(members2, expenses2));

// Test Case 3: Unequal Split (Percentage)
const members3 = ['A', 'B'];
const expenses3 = [
    {
        description: 'Drinks',
        amount: 100,
        paidBy: 'A',
        splitType: 'PERCENTAGE',
        splits: [{ user: 'A', percentage: 60 }, { user: 'B', percentage: 40 }]
    }
];
console.log('Test 3:', mockGetGroupBalances(members3, expenses3));
