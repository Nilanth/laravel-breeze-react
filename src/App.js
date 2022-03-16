import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from 'pages/dashboard';
import Login from 'pages/login';
import Register from 'pages/register';
import Home from 'pages/home';
import ForgotPassword from 'pages/forgot-password';
import PasswordReset from 'pages/password-reset';
import NotFoundPage from 'pages/404';

function App() {
  return (
    <div className="antialiased">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset/:token" element={<PasswordReset />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFoundPage/>}
        />
      </Routes>
    </div>
  );
}

export default App;
