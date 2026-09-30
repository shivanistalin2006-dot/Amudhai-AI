// API Service Client for ZeroPlate AI Ecosystem

const API_BASE = '/api';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'institution' | 'ngo' | 'delivery' | 'admin';
  organization_name: string;
  phone?: string;
}

export const api = {
  // Auth
  async login(username: string, role?: string): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: 'password123', role }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/auth/users`);
    return res.json();
  },

  // Dashboard
  async getDashboardSummary() {
    const res = await fetch(`${API_BASE}/dashboard/summary`);
    if (!res.ok) throw new Error('Failed to fetch dashboard summary');
    return res.json();
  },

  // Forecast
  async predictDemand(payload: any) {
    const res = await fetch(`${API_BASE}/forecasts/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to generate forecast');
    return res.json();
  },

  async recordActuals(payload: any) {
    const res = await fetch(`${API_BASE}/forecasts/record-actuals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to record actuals');
    return res.json();
  },

  async getForecastHistory() {
    const res = await fetch(`${API_BASE}/forecasts/history`);
    return res.json();
  },

  // Inventory
  async getInventory(statusFilter = 'all', categoryFilter = 'all', search = '') {
    const params = new URLSearchParams({
      status_filter: statusFilter,
      category_filter: categoryFilter,
      search,
    });
    const res = await fetch(`${API_BASE}/inventory?${params.toString()}`);
    return res.json();
  },

  async createInventoryItem(payload: any) {
    const res = await fetch(`${API_BASE}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create inventory item');
    return res.json();
  },

  async updateInventoryItem(id: number, payload: any) {
    const res = await fetch(`${API_BASE}/inventory/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async deleteInventoryItem(id: number) {
    const res = await fetch(`${API_BASE}/inventory/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Quality & Sensors
  async getQualityReadings() {
    const res = await fetch(`${API_BASE}/quality/readings`);
    return res.json();
  },

  async addQualityReading(payload: any) {
    const res = await fetch(`${API_BASE}/quality/readings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async analyzeFoodImage() {
    const res = await fetch(`${API_BASE}/quality/analyze-image`, { method: 'POST' });
    return res.json();
  },

  // Surplus Food
  async getSurplus(category = 'all', statusFilter = 'all') {
    const params = new URLSearchParams({ category, status_filter: statusFilter });
    const res = await fetch(`${API_BASE}/surplus?${params.toString()}`);
    return res.json();
  },

  async publishSurplus(payload: any) {
    const res = await fetch(`${API_BASE}/surplus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to publish surplus food');
    return res.json();
  },

  async acceptDonation(listingId: number, ngoId: number) {
    const res = await fetch(`${API_BASE}/donations/${listingId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ngo_id: ngoId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to accept donation');
    }
    return res.json();
  },

  async rejectDonation(listingId: number, ngoId: number, reason: string) {
    const res = await fetch(`${API_BASE}/donations/${listingId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ngo_id: ngoId, reason }),
    });
    return res.json();
  },

  // NGOs
  async getNgos() {
    const res = await fetch(`${API_BASE}/ngos`);
    return res.json();
  },

  async getNgoMatches(listingId: number) {
    const res = await fetch(`${API_BASE}/ngos/matches/${listingId}`);
    return res.json();
  },

  // Logistics
  async getDeliveries(statusFilter = 'all') {
    const res = await fetch(`${API_BASE}/deliveries?status_filter=${statusFilter}`);
    return res.json();
  },

  async updateDeliveryStatus(deliveryId: number, status: string, proofNotes?: string) {
    const res = await fetch(`${API_BASE}/deliveries/${deliveryId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, proof_notes: proofNotes }),
    });
    return res.json();
  },

  // Food Processing
  async getProcessingBatches() {
    const res = await fetch(`${API_BASE}/processing/batches`);
    return res.json();
  },

  async createProcessingBatch(payload: any) {
    const res = await fetch(`${API_BASE}/processing/batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Sustainability
  async getSustainabilityReport() {
    const res = await fetch(`${API_BASE}/sustainability/report`);
    return res.json();
  },

  // Notifications
  async getNotifications(role?: string) {
    const res = await fetch(`${API_BASE}/notifications?role=${role || 'all'}`);
    return res.json();
  },

  async markNotificationRead(id: number) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' });
    return res.json();
  },

  async markAllNotificationsRead() {
    const res = await fetch(`${API_BASE}/notifications/mark-all-read`, { method: 'POST' });
    return res.json();
  }
};
