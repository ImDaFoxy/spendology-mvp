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
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        updateSubcategoryOptions();
        fetchBalanceAndSavings();
    }, [selectedCategory]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleAddTransaction = async (event) => {
        event.preventDefault();
        
        if (selectedCategory === 'savings') {
            const endpoint = amount > 0 ? '/add-to-savings' : '/take-from-savings';
            const response = await fetch(`http://localhost:3001${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: Math.abs(amount) })
            });
            const data = await response.json();
            setBalance(data.balance);
            setSavings(data.saving);
            setAmount(0); // Reset the amount input field
        }
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
        const balanceResponse = await fetch('http://localhost:3001/balance');
        const balanceData = await balanceResponse.json();
        setBalance(balanceData.balance);

        const savingsResponse = await fetch('http://localhost:3001/savings');
        const savingsData = await savingsResponse.json();
        setSavings(savingsData.savings);
    };

    return (
        <>
            <div className="expense-tracker">
                <div className="container">
                    <Navbar bg="lightblue" variant="dark" expand="md" className="navbar-custom">
                        <Container>
                            <Navbar.Brand href="#home">Spendology</Navbar.Brand>
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
                                        <h2>Rp {balance}</h2>
                                    </div>
                                    <div className='saving-balance'>
                                        <h3>Your Savings</h3>
                                        <h2>Rp {savings}</h2>
                                    </div>
                                </div>
                                <div className="summary-container">
                                    <h3>This month's summary</h3>
                                    <div className="summary">
                                        <div className="income">
                                            <h4>Income</h4>
                                            <p>Rp. 0</p>
                                        </div>
                                        <div className="expense">
                                            <h4>Expense</h4>
                                            <p>Rp. 0</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="add-transaction" className="add-transaction">
                                <h2>Add Transaction</h2>
                                <form className="add-transaction-form" onSubmit={handleAddTransaction}>
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
                                        <select id="subcategory">
                                            {subcategoryOptions.map((option, index) => (
                                                <option key={index} value={option.toLowerCase()}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="amount">Enter the amount of money:</label>
                                        <input type="number" value={amount} onChange={handleAmountChange} placeholder="Amount" required />
                                    </div>
                                    <button type="submit" className="submit-button" onClick={handleAddTransaction}>Add Transaction</button>
                                </form>
                            </div>
                        </div>
                        <div className="right">
                            <div className="transactions">
                                <h2>Transactions</h2>
                                {/* Transaction List goes here */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExpenseTracker;
