import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Auth} from "./pages/auth/index";
import { ExpenseTracker } from './pages/expense-tracker/index';
import {Profile} from './pages/profile-page/index';
import { SignIn } from './pages/auth/index'; // Importing SignIn instead of Auth
import { SignUp } from './pages/auth/signUp';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<SignIn/>}/>
          <Route path="/auth/signUp/*" element={<SignUp/>}/>
          <Route path="/expense-tracker" element={<ExpenseTracker/>}/>
          <Route path="/profile-page" element={<Profile/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;