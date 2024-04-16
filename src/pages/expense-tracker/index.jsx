import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

export const ExpenseTracker = () => {
    const [expanded, setExpanded] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('income');
    const [subcategoryOptions, setSubcategoryOptions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [savings, setSavings] = useState(0);
    const [userId, setUserId] = useState(null);
    const [transactionAmount, setTransactionAmount] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [monthlySummary, setMonthlySummary] = useState({ totalIncome: 0, totalExpense: 0 });
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const { id } = JSON.parse(userData);
            setUserId(id);
        }
    }, []);

    useEffect(() => {
        updateSubcategoryOptions();
        if (userId) {
            fetchBalanceAndSavings();
            fetchTransactions();
            fetchMonthlySummary();
        }
    }, [selectedCategory, userId]);

    // Number formatter function
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const updateSubcategoryOptions = () => {
        let newSubcategoryOptions = [];
        if (selectedCategory === 'income') {
            newSubcategoryOptions = ['Salary', 'Bonus', 'Other'];
        } else if (selectedCategory === 'expense') {
            newSubcategoryOptions = ['Rent', 'Utilities', 'Groceries', 'Other'];
        } else if (selectedCategory === 'savings') {
            newSubcategoryOptions = ['Insert', 'Take out'];
        }
        setSubcategoryOptions(newSubcategoryOptions);
    };

    const fetchBalanceAndSavings = async () => {
        const balanceResponse = await fetch(`http://localhost:3001/balance/${userId}`);
        const balanceData = await balanceResponse.json();
        setBalance(balanceData.balance);

        const savingsResponse = await fetch(`http://localhost:3001/savings/${userId}`);
        const savingsData = await savingsResponse.json();
        setSavings(savingsData.savings);
    };

    const fetchMonthlySummary = async () => {
        try {
            const response = await fetch(`http://localhost:3001/monthly-summary/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setMonthlySummary(data);
            } else {
                // Handle error
            }
        } catch (error) {
            console.error('Error fetching monthly summary:', error);
        }
    };

    const fetchTransactions = async () => {
        const response = await fetch(`http://localhost:3001/transactions/${userId}`);
        const data = await response.json();
        setTransactions(data.transactions);
    };

    const handleTransactionAmountChange = (event) => {
        setTransactionAmount(event.target.value);
    };

    const handleTransactionSubmit = async (event) => {
        event.preventDefault();
        try {
            // Get the transaction amount
            const amount = parseFloat(transactionAmount);
    
            // Check if the amount is valid (greater than 0)
            if (amount <= 0 || isNaN(amount)) {
                alert("Your input must be a positive number.");
                return; // Prevent further execution
            }
    
            // Check if the selected category is expense and if the expense exceeds the balance
            if (selectedCategory === 'expense' && amount > balance) {
                alert("Expense amount cannot exceed the available balance.");
                return; // Prevent further execution
            }
    
            // Retrieve the selected subcategory directly from the event object
            const selectedSubcategory = event.target.elements.subcategory.value.toLowerCase();
    
            // Check if the selected category is savings and if the amount exceeds the balance or savings
            if (selectedCategory === 'savings') {
                if (selectedSubcategory === 'insert' && amount > balance) {
                    alert("Savings amount cannot exceed the available balance.");
                    return; 
                } else if (selectedSubcategory === 'take out' && amount > savings) {
                    alert("The amount of savings taken out cannot exceed the available amount of savings.");
                    return;
                }
            }
        
            // Determine the URL based on the selected category and subcategory
            let url;
            let categoryId;
            if (selectedCategory === 'savings') {
                if (selectedSubcategory === 'insert') {
                    url = `http://localhost:3001/add-to-savings/${userId}`;
                } else if (selectedSubcategory === 'take out') {
                    url = `http://localhost:3001/take-from-savings/${userId}`;
                }
            } else if (selectedCategory === 'income') {
                url = `http://localhost:3001/add-income/${userId}`;
                if (selectedSubcategory === 'salary') {
                    categoryId = 1;
                } else if (selectedSubcategory === 'bonus') {
                    categoryId = 2;
                } else if (selectedSubcategory === 'other') {
                    categoryId = 3;
                }
            } else if (selectedCategory === 'expense') {
                url = `http://localhost:3001/add-expense/${userId}`;
                if (selectedSubcategory === 'rent') {
                    categoryId = 4;
                } else if (selectedSubcategory === 'utilities') {
                    categoryId = 5;
                } else if (selectedSubcategory === 'groceries') {
                    categoryId = 6;
                } else if (selectedSubcategory === 'other') {
                    categoryId = 7;
                }
            }
        
            // Make the API call
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, category: categoryId }), // Pass the category ID
            });
        
            // Handle the response
            if (response.ok) {
                const responseData = await response.json();
                if (selectedCategory === 'savings') {
                    setSavings(responseData.saving);
                    setBalance(responseData.balance);
                } else {
                    setBalance(responseData.balance);
                }
                setTransactionAmount(0);
                fetchMonthlySummary();
                fetchTransactions();
            } else {
                // Handle error
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };    

    return (
        <>
            <div className="expense-tracker">
                <div className="container">
                    <Navbar bg="lightblue" variant="dark" expand="md" className="navbar-custom">
                        <Container>
                            <Navbar.Brand href="#home" style={{ color: '#0C359E', fontWeight: 'bold' }}>Spendology</Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setExpanded(!expanded)} />
                            <Navbar.Collapse id="responsive-navbar-nav" className={expanded ? 'show' : ''}>
                                <Nav className="me-auto">
                                    <Nav.Link href="http://localhost:3000/expense-tracker">Home</Nav.Link>
                                    <Nav.Link href="http://localhost:3000/profile-page">Profile</Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>

                    <div className="content">
                        <div className="left">
                            <div className='bal-sum-container'>
                                <div className="balance-container">
                                    <div className='total-balance'>
                                        <h3>Your Balance</h3>
                                        <h2>{formatCurrency(balance)}</h2>
                                    </div>
                                    <div className='saving-balance'>
                                        <h3>Your Savings</h3>
                                        <h2>{formatCurrency(savings)}</h2>
                                    </div>
                                </div>
                                <div className="summary-container">
                                    <h3>This month's summary</h3>
                                    <div className="summary">
                                        <div className="income">
                                            <h4>Income</h4>
                                            <p>{formatCurrency(monthlySummary.totalIncome)}</p>
                                        </div>
                                        <div className="expense">
                                            <h4>Expense</h4>
                                            <p>{formatCurrency(monthlySummary.totalExpense)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="add-transaction" className="add-transaction">
                                <h2>Add Transaction</h2>
                                <form className="add-transaction-form" onSubmit={handleTransactionSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="category">Select Type:</label>
                                        <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
                                            <option value="income">Income</option>
                                            <option value="expense">Expense</option>
                                            <option value="savings">Savings</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="subcategory">Select Category:</label>
                                        <select id="subcategory" onChange={updateSubcategoryOptions}>
                                            {subcategoryOptions.map((option, index) => (
                                                <option key={index} value={option.toLowerCase()}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="amount">Enter the amount of money:</label>
                                        <input type="number" id="amount" value={transactionAmount} onChange={handleTransactionAmountChange} placeholder="Amount" required />
                                    </div>
                                    <button type="submit" className="submit-button">Add Transaction</button>
                                </form>
                            </div>
                        </div>
                        <div className="right">
                            <div className="transactions">
                                <div className="transaction-title">
                                    <h2>Transactions</h2>
                                </div>
                                <div className="transaction-list">
                                    <ul>
                                        {sortedTransactions.reverse().map((transaction, index) => (
                                            <li key={index}>
                                                <div className="transaction-inner">
                                                    <div className="transaction-type">
                                                        <h3>{transaction.type}</h3>
                                                        <p>{transaction.category}</p>
                                                    </div>
                                                    <div className="transaction-amount">
                                                        <p>{formatCurrency(transaction.amount)}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExpenseTracker;