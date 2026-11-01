import React, { useState, useEffect } from 'react';
import Navbar from './components/brand/Navbar';
import HomePortal from './components/dashboards/HomePortal';
import ManagerDashboard from './components/dashboards/ManagerDashboard';
import EmployeeDashboard from './components/dashboards/EmployeeDashboard';
import CustomerDashboard from './components/dashboards/CustomerDashboard';
import { api, getCachedUser, removeToken } from './lib/api';
import { User, UserRole } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');

  useEffect(() => {
    const cached = getCachedUser();
    if (cached) {
      setCurrentUser(cached);
      setActiveTab(cached.role);
    }
  }, []);

  const handleSelectRole = async (role: UserRole) => {
    try {
      const res = await api.login(role);
      setCurrentUser(res.user);
      setActiveTab(role);
    } catch (err) {
      console.error('Role selection failed:', err);
      setActiveTab(role);
    }
  };

  const handleLogout = () => {
    removeToken();
    setCurrentUser(null);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar
        user={currentUser}
        activeTab={activeTab}
        onSelectRole={handleSelectRole}
        onLogout={handleLogout}
        onGoHome={() => setActiveTab('home')}
      />

      <main className="flex-1">
        {activeTab === 'home' && <HomePortal onSelectRole={handleSelectRole} />}
        {activeTab === 'manager' && <ManagerDashboard />}
        {activeTab === 'employee' && <EmployeeDashboard />}
        {activeTab === 'customer' && <CustomerDashboard />}
      </main>
    </div>
  );
}
