import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your pages (adjust paths if needed)
import TradeFlowLanding from './componet/tradeflowlanding';
import SignUp from './componet/user/signup';
import Login from './componet/user/login';
import About from './componet/about';
import Dashboard from './dashboard/dashboard';
import CopyTrading from './dashboard/CopyTrading';
import HireTrader from './dashboard/Hiretrader';
import Terminal from './dashboard/terminal';
import TradingTerminal from './dashboard/terminal';
import Marketplace from './dashboard/MarketPlace';
import Policy from './componet/policy';
import Terms from './componet/terms';
import Insights from './dashboard/insights';
import Profile from './dashboard/profile';
import Settings from './dashboard/settings';
import Support from './dashboard/support';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TradeFlowLanding />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/copy-trading" element={<CopyTrading />} />
        <Route path="/hire-trader" element={<HireTrader />} />
        <Route path="/terminal" element={<TradingTerminal />} />
        <Route path='/market-place' element= {<Marketplace />} />
        <Route path='/policy' element={<Policy />} />
        <Route path='/terms' element= {<Terms />} />
        <Route path='/insights' element= {<Insights />} />
        <Route path='/profile' element= {<Profile />}/>
        <Route path='/settings' element= {<Settings />} />
        <Route path='/support' element= {<Support />} />
      </Routes>
    </Router>
  );
}

export default App;