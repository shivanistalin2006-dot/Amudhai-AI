import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { ForecastView } from './views/ForecastView';
import { InventoryView } from './views/InventoryView';
import { QualityView } from './views/QualityView';
import { SurplusView } from './views/SurplusView';
import { NgoNetworkView } from './views/NgoNetworkView';
import { LogisticsView } from './views/LogisticsView';
import { FoodProcessingView } from './views/FoodProcessingView';
import { SustainabilityView } from './views/SustainabilityView';
import { SettingsView } from './views/SettingsView';
import { api, User } from './api';

export function App() {
  // Current logged in demo user
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    username: 'kitchen_admin',
    email: 'kitchen@loyola.edu',
    role: 'institution',
    organization_name: 'Loyola College Mega Mess',
    phone: '+91 98400 11223',
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<'en' | 'ta'>('en');

  // Shared Data States
  const [summaryData, setSummaryData] = useState<any>(null);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const loadDashboardData = async () => {
    setSummaryLoading(true);
    try {
      const data = await api.getDashboardSummary();
      setSummaryData(data);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setSummaryLoading(false);
    }
  };

  const loadNotifications = async (role?: string) => {
    try {
      const res = await api.getNotifications(role || currentUser.role);
      setNotifications(res.notifications || []);
      setUnreadCount(res.unread_count || 0);
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  };

  useEffect(() => {
    loadDashboardData();
    loadNotifications();
  }, []);

  const handleSwitchUser = async (username: string, role: string) => {
    const orgMap: Record<string, string> = {
      kitchen_admin: 'Loyola College Mega Mess',
      hotel_admin: 'Hotel Annapoorna Grand',
      ngo_user: 'Akshaya Food Bank Chennai',
      delivery_driver: 'Murugan K. (GreenExpress 01)',
      platform_admin: 'Amudhai Ecosystem HQ',
    };

    const newUser: User = {
      id: username === 'kitchen_admin' ? 1 : username === 'ngo_user' ? 3 : username === 'delivery_driver' ? 4 : 5,
      username,
      email: `${username}@amudhai.eco`,
      role: role as any,
      organization_name: orgMap[username] || 'Amudhai Partner',
      phone: '+91 98400 00000',
    };

    setCurrentUser(newUser);
    loadNotifications(role);

    // If active tab is not allowed for new role, default to dashboard
    const roleAllowedTabs: Record<string, string[]> = {
      institution: ['dashboard', 'forecast', 'inventory', 'quality', 'surplus', 'ngos', 'logistics', 'processing', 'sustainability', 'settings'],
      ngo: ['dashboard', 'surplus', 'ngos', 'logistics', 'sustainability', 'settings'],
      delivery: ['dashboard', 'surplus', 'logistics', 'sustainability', 'settings'],
      admin: ['dashboard', 'forecast', 'inventory', 'quality', 'surplus', 'ngos', 'logistics', 'processing', 'sustainability', 'settings'],
    };

    if (!roleAllowedTabs[role]?.includes(activeTab)) {
      setActiveTab('dashboard');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSurplusSuggested = (kg: number) => {
    loadDashboardData();
    loadNotifications();
  };

  return (
    <div className="min-h-screen bg-[#F7F8F2] flex">
      {/* Sidebar */}
      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        lang={lang}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          collapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          currentUser={currentUser}
          onSwitchUser={handleSwitchUser}
          activeTab={activeTab}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={handleMarkAllRead}
          onRefreshData={() => {
            loadDashboardData();
            loadNotifications();
          }}
          lang={lang}
          setLang={setLang}
        />

        {/* View Router */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              summaryData={summaryData}
              loading={summaryLoading}
              onNavigate={setActiveTab}
              lang={lang}
            />
          )}

          {activeTab === 'forecast' && (
            <ForecastView
              onSurplusSuggested={handleSurplusSuggested}
              lang={lang}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView lang={lang} />
          )}

          {activeTab === 'quality' && (
            <QualityView lang={lang} />
          )}

          {activeTab === 'surplus' && (
            <SurplusView
              currentUser={currentUser}
              onNavigate={setActiveTab}
              lang={lang}
            />
          )}

          {activeTab === 'ngos' && (
            <NgoNetworkView
              onNavigate={setActiveTab}
              lang={lang}
            />
          )}

          {activeTab === 'logistics' && (
            <LogisticsView
              currentUser={currentUser}
              lang={lang}
            />
          )}

          {activeTab === 'processing' && (
            <FoodProcessingView lang={lang} />
          )}

          {activeTab === 'sustainability' && (
            <SustainabilityView lang={lang} />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              currentUser={currentUser}
              onSwitchUser={handleSwitchUser}
              lang={lang}
              setLang={setLang}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
