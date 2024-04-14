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
        }
    }, [selectedCategory, userId]);

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

    const handleTransactionAmountChange = (event) => {
        setTransactionAmount(event.target.value);
    };

    const handleTransactionSubmit = async (event) => {
        event.preventDefault();
        try {
            let url;
            const selectedSubcategory = document.getElementById("subcategory").value;

            if (selectedCategory === 'savings') {
                if (selectedSubcategory === 'insert') {
                    url = `http://localhost:3001/add-to-savings/${userId}`;
                } else if (selectedSubcategory === 'take out') {
                    url = `http://localhost:3001/take-from-savings/${userId}`;
                }
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: transactionAmount }),
            });
            if (response.ok) {
                const responseData = await response.json();
                setBalance(responseData.balance);
                setSavings(responseData.saving);
                setTransactionAmount(0);
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
                                        <select id="subcategory">
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
