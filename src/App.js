import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Supabase client — initialised once here, import from './supabase' anywhere you need it
import './supabase';

import TradeFlowLanding from './componet/tradeflowlanding';
import SignUp           from './componet/user/signup';
import Login            from './componet/user/login';
import About            from './componet/about';
import Dashboard        from './dashboard/dashboard';
import CopyTrading      from './dashboard/CopyTrading';
import HireTrader       from './dashboard/Hiretrader';
import TradingTerminal  from './dashboard/terminal';
import Marketplace      from './dashboard/MarketPlace';
import Policy           from './componet/policy';
import Terms            from './componet/terms';
import Insights         from './dashboard/insights';
import Profile          from './dashboard/profile';
import Settings         from './dashboard/settings';
import Support          from './dashboard/support';
import Payment          from './dashboard/payment';
import Notifications    from './dashboard/notification';
import Subscription from './dashboard/subscription';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"             element={<TradeFlowLanding />} />
        <Route path="/about"        element={<About />} />
        <Route path="/signup"       element={<SignUp />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/dashboard"    element={<Dashboard />} />
        <Route path="/copy-trading" element={<CopyTrading />} />
        <Route path="/hire-trader"  element={<HireTrader />} />
        <Route path="/terminal"     element={<TradingTerminal />} />
        <Route path="/market-place" element={<Marketplace />} />
        <Route path="/policy"       element={<Policy />} />
        <Route path="/terms"        element={<Terms />} />
        <Route path="/insights"     element={<Insights />} />
        <Route path="/profile"      element={<Profile />} />
        <Route path="/settings"     element={<Settings />} />
        <Route path="/support"      element={<Support />} />
        <Route path="/payments"     element={<Payment />} />
        <Route path="/notification" element={<Notifications />} />
        <Route path='/billing' element={<Subscription />} />
      </Routes>
    </Router>
  );
}

export default App;