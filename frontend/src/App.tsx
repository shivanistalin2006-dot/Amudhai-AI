import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { InventoryView } from './views/InventoryView';
import { SmartInsightsView } from './views/SmartInsightsView';
import { WasteAnalyticsView } from './views/WasteAnalyticsView';
import { QrTraceabilityView } from './views/QrTraceabilityView';
import { ReportsView } from './views/ReportsView';
import { BatchPassportModal } from './components/BatchPassportModal';
import { AddItemModal } from './components/AddItemModal';
import { AlertsDrawer } from './components/AlertsDrawer';
import { RecipeModal } from './components/RecipeModal';
import { initialInventory, initialInsights, InventoryItem, SmartInsight, UseBeforeWasteRecipe } from './mockData';
import { CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export function App() {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Core Mock State (Frontend-Only, Zero Backend Dependencies)
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [insights, setInsights] = useState<SmartInsight[]>(initialInsights);

  // Modals & Drawers
  const [selectedBatchForPassport, setSelectedBatchForPassport] = useState<InventoryItem | null>(null);
  const [selectedRecipeForModal, setSelectedRecipeForModal] = useState<UseBeforeWasteRecipe | null>(null);
  const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);

  // Toast System
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Add Item to Inventory
  const handleAddItem = (newItem: InventoryItem) => {
    setInventory((prev) => [newItem, ...prev]);

    // If item is expiring soon, add a simulated AI insight
    if (newItem.expiryDaysRemaining <= 3) {
      const newInsight: SmartInsight = {
        id: `ins-${Date.now()}`,
        title: `${newItem.name} registered with short expiry (${newItem.expiryDaysRemaining} days)`,
        description: `New batch ${newItem.batchId} (${newItem.quantity} ${newItem.unit}) scheduled for expedited FEFO kitchen usage.`,
        category: 'Urgent',
        recommendedAction: `Incorporate ${newItem.name} into tomorrow's cooking schedule.`,
        impact: `Protects ${newItem.quantity} ${newItem.unit} from spoilage`,
        batchId: newItem.batchId,
        timestamp: 'Just now'
      };
      setInsights((prev) => [newInsight, ...prev]);
    }
  };

  // Apply AI Action
  const handleApplyInsight = (insight: SmartInsight) => {
    showToast(`Action applied: "${insight.recommendedAction}"`);
  };

  // Urgent batch alert count
  const alertCount = inventory.filter(
    (i) => i.status === 'High Risk' || i.status === 'Expiring Soon'
  ).length;

  // View: Landing Screen (Requirement #1)
  if (viewMode === 'landing') {
    return (
      <LandingView
        onGetStarted={() => {
          setViewMode('app');
          setActiveTab('dashboard');
          showToast('Welcome to ZeroPlate AI Dashboard! All mock telemetry active.');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-xs font-medium leading-snug">{toastMessage}</p>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex w-full">
        
        {/* Left Sidebar (Requirement #2) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          alertCount={alertCount}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Navbar */}
          <Navbar
            activeTab={activeTab}
            onToggleMobile={() => setMobileOpen(!mobileOpen)}
            onOpenAlerts={() => setIsAlertsOpen(true)}
            onGoToLanding={() => setViewMode('landing')}
            alertCount={alertCount}
          />

          {/* Active View Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            
            {activeTab === 'dashboard' && (
              <DashboardView
                inventory={inventory}
                insights={insights}
                onNavigate={setActiveTab}
                onOpenAlerts={() => setIsAlertsOpen(true)}
                onSelectBatch={(batch) => setSelectedBatchForPassport(batch)}
                onViewRecipe={(recipe) => setSelectedRecipeForModal(recipe)}
                onToast={showToast}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryView
                inventory={inventory}
                onOpenAddModal={() => setIsAddItemOpen(true)}
                onSelectBatch={(batch) => setSelectedBatchForPassport(batch)}
                onToast={showToast}
              />
            )}

            {activeTab === 'insights' && (
              <SmartInsightsView
                insights={insights}
                onApplyAction={handleApplyInsight}
                onToast={showToast}
              />
            )}

            {activeTab === 'analytics' && (
              <WasteAnalyticsView onToast={showToast} />
            )}

            {activeTab === 'qr' && (
              <QrTraceabilityView
                inventory={inventory}
                onSelectBatch={(batch) => setSelectedBatchForPassport(batch)}
                onToast={showToast}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsView onToast={showToast} />
            )}

          </main>

          {/* Footer */}
          <footer className="py-4 px-6 border-t border-slate-200/80 bg-white text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">ZeroPlate AI</span>
              <span>•</span>
              <span>Smart Food Inventory. Less Waste. More Impact.</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Problem ID: 26234</span>
              <span>•</span>
              <span>Smart India Hackathon</span>
            </div>
          </footer>

        </div>
      </div>

      {/* Modals & Drawers */}
      <BatchPassportModal
        item={selectedBatchForPassport}
        onClose={() => setSelectedBatchForPassport(null)}
        onToast={showToast}
      />

      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onAdd={handleAddItem}
        onToast={showToast}
      />

      <AlertsDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        items={inventory}
        onSelectBatch={(batch) => setSelectedBatchForPassport(batch)}
        onToast={showToast}
      />

      <RecipeModal
        recipe={selectedRecipeForModal}
        onClose={() => setSelectedRecipeForModal(null)}
        onAddToMenu={(recipe) => {
          showToast(`"${recipe.name}" added to today's priority menu.`);
          setSelectedRecipeForModal(null);
        }}
      />

    </div>
  );
}

export default App;

