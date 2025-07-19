// Use import.meta.env for Vite or fallback to window.env or default
const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  (typeof window !== 'undefined' && window.env && window.env.REACT_APP_API_URL) ||
  'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('API Base URL:', this.baseURL);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('accessToken');

    const config = {
      ...options, // Spread options first
      headers: {
        // Default to JSON, but can be overridden by options or removed for FormData
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers, // Spread custom headers from options last to allow override
      },
    };
    
    // If body is FormData, delete Content-Type to let browser set it
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    console.log(`Making ${options.method || 'GET'} request to ${url}`);
    console.log('Request config:', config);
    if (options.body && typeof options.body === 'string') {
      console.log('Request body:', JSON.parse(options.body));
    }

    try {
      const response = await fetch(url, config);
      
      console.log(`Response status: ${response.status}`);
      
      if (response.status === 204) { // Handle No Content response
        return null;
      }

      // Try to parse JSON, but handle cases where it might not be JSON (e.g. text error)
      let responseData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        responseData = await response.json();
        console.log('Response data:', JSON.stringify(responseData, null, 2));
      } else {
        responseData = await response.text(); // Fallback to text
        console.log('Response text:', responseData);
      }
      
      if (!response.ok) {
        // Instead of throwing just the error message, throw the full responseData object
        throw responseData;
      }
      
      return responseData;
    } catch (error) {
      console.error(`API request failed for endpoint ${endpoint}:`, JSON.stringify(error, null, 2));
      throw error;
    }
  }

  // Reference Data / Industries
  async getIndustries(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/industries/?${queryString}`);
  }

  // Companies
  async getCompanies(params = {}) {
    // If no moderation_status is specified and user is admin, include pending companies
    if (!params.moderation_status && this.isAdmin()) {
      params.moderation_status = 'all';
    }
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/companies/?${queryString}`);
  }
  
  // Helper method to check if current user is admin
  isAdmin() {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return false;
      
      // Decode JWT token to check for admin role
      // This is a simple check - you might need to adjust based on your actual JWT structure
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      return payload.is_staff || payload.is_admin || payload.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  async getCompany(slug) {
    return this.request(`/companies/${slug}/`);
  }

  async createCompany(data) {
    console.log('Submitting company data:', data);
    return this.request('/companies/', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  async updateCompany(slug, data) {
    return this.request(`/companies/${slug}/`, {
      method: 'PUT', // Or PATCH
      body: data, // data can be FormData or JSON object
    });
  }

  async deleteCompany(slug) {
    return this.request(`/companies/${slug}/`, { method: 'DELETE' });
  }

  // Search (Simplified - assumes backend handles general search on entities)
  async searchAll(query) {
    // Example: search across companies. Adjust if backend has a global search endpoint.
    return this.getCompanies({ search: query });
  }

  // Dashboard
  async getDashboardStats() {
    return this.request('/dashboard/');
  }
  
  // Ecosystem
  async getEcosystemData() {
    return this.request('/ecosystem/');
  }

  // Investors
  async getInvestors(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/investors/?${queryString}`);
  }

  async getInvestor(slug) {
    return this.request(`/investors/${slug}/`);
  }
  
  async createInvestor(data) {
    return this.request('/investors/', {
      method: 'POST',
      body: data, // data can be FormData or JSON object
    });
  }

  // People
  async getPeople(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/people/?${queryString}`);
  }

  async getPerson(slug) {
    return this.request(`/people/${slug}/`);
  }
  
  async createPerson(data) {
    return this.request('/people/', {
      method: 'POST',
      body: data, // data can be FormData or JSON object
    });
  }

  // Funding Rounds
  async getFundingRounds(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/funding-rounds/?${queryString}`);
  }

  async getFundingRound(id) { // Assuming ID for funding rounds as per backend
    return this.request(`/funding-rounds/${id}/`);
  }
  
  async createFundingRound(data) { // Expects JSON data
    return this.request('/funding-rounds/', {
      method: 'POST',
      body: JSON.stringify(data), // Ensure this is JSON
      headers: { 'Content-Type': 'application/json' } // Explicitly set for this one if always JSON
    });
  }
}

// Create single instance
const apiService = new ApiService();

// Export individual API objects for convenience
export const companyAPI = {
  getAll: async (params) => {
    try {
      const response = await apiService.getCompanies(params);
      // Handle both paginated and non-paginated responses
      return {
        data: response.results || response,
        success: true
      };
    } catch (error) {
      console.error('Error fetching companies:', error);
      return { data: [], success: false, error };
    }
  },
  getOne: (slug) => apiService.getCompany(slug),
  create: (data) => apiService.createCompany(data),
  update: (slug, data) => apiService.updateCompany(slug, data),
  delete: (slug) => apiService.deleteCompany(slug),
  search: async (query, filters) => {
    try {
      const response = await apiService.getCompanies({ search: query, ...filters });
      return {
        data: response.results || response,
        success: true
      };
    } catch (error) {
      console.error('Error searching companies:', error);
      return { data: [], success: false, error };
    }
  }
};

export const industryAPI = {
  getAll: async (params) => {
    try {
      const response = await apiService.getIndustries(params);
      return {
        data: response.results || response,
        success: true
      };
    } catch (error) {
      console.error('Error fetching industries:', error);
      return { data: [], success: false, error };
    }
  }
};

export const dashboardAPI = {
  getStats: () => apiService.getDashboardStats(),
  getCuratedContent: async (type = '') => {
    let url = '/curated-content/';
    if (type) url += `?type=${type}`;
    return apiService.request(url);
  },
};

export const ecosystemAPI = {
  getData: () => apiService.getEcosystemData()
};

export const investorAPI = {
  getAll: async (params) => {
    try {
      const response = await apiService.getInvestors(params);
      return {
        data: response.results || response,
        success: true
      };
    } catch (error) {
      console.error('Error fetching investors:', error);
      return { data: [], success: false, error };
    }
  },
  getOne: (slug) => apiService.getInvestor(slug),
  create: (data) => apiService.createInvestor(data),
};

export const personAPI = {
  getAll: async (params) => {
    try {
      const response = await apiService.getPeople(params);
      return {
        data: response.results || response,
        success: true
      };
    } catch (error) {
      console.error('Error fetching people:', error);
      return { data: [], success: false, error };
    }
  },
  getOne: (slug) => apiService.getPerson(slug),
  create: (data) => apiService.createPerson(data),
};

export const fundingRoundAPI = {
  getAll: (params) => apiService.getFundingRounds(params),
  getOne: (id) => apiService.getFundingRound(id),
  create: (data) => apiService.createFundingRound(data),
};

// Curated Content API
export const curatedContentAPI = {
  getAll: (params) => apiService.request(`/curated-content/?${new URLSearchParams(params).toString()}`),
  getOne: (slug) => apiService.request(`/curated-content/${slug}/`),
  getFeatured: () => apiService.request('/curated-content/featured/'),
  getByType: () => apiService.request('/curated-content/by_type/'),
};

// Ecosystem Builder Registration API
class EcosystemBuilderRegistrationAPI extends ApiService {
  async create(data) {
    return this.request('/ecosystem-builder-registrations/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const ecosystemBuilderRegistrationAPI = new EcosystemBuilderRegistrationAPI();

// Hub API
class HubAPI extends ApiService {
  async getAll() {
    return this.request('/hubs/');
  }
  async create(data) {
    return this.request('/hubs/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
export const hubAPI = new HubAPI();

// Incubator API
class IncubatorAPI extends ApiService {
  async getAll() {
    return this.request('/incubators/');
  }
  async create(data) {
    return this.request('/incubators/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
export const incubatorAPI = new IncubatorAPI();

// Accelerator API
class AcceleratorAPI extends ApiService {
  async getAll() {
    return this.request('/accelerators/');
  }
  async create(data) {
    return this.request('/accelerators/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
export const acceleratorAPI = new AcceleratorAPI();

// University API
class UniversityAPI extends ApiService {
  async getAll() {
    return this.request('/universities/');
  }
  async create(data) {
    return this.request('/universities/', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
export const universityAPI = new UniversityAPI();

// Organization Registration API
class OrganizationRegistrationAPI extends ApiService {
  async create(data) {
    return this.request('/organization-signup/', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/organization-registrations/?${queryString}`);
  }
  
  async getOne(id) {
    return this.request(`/organization-registrations/${id}/`);
  }
  
  async approve(id) {
    return this.request(`/organization-registrations/${id}/approve/`, {
      method: 'POST'
    });
  }
  
  async reject(id, reason = '') {
    return this.request(`/organization-registrations/${id}/reject/`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  async requestInfo(id, message = '') {
    return this.request(`/organization-registrations/${id}/request_info/`, {
      method: 'POST',
      body: JSON.stringify({ message }),
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const organizationRegistrationAPI = new OrganizationRegistrationAPI();

// Contact API
class ContactAPI extends ApiService {
  async create(data) {
    return this.request('/contact/', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/contacts/?${queryString}`);
  }
  
  async getOne(id) {
    return this.request(`/contacts/${id}/`);
  }
  
  async markResolved(id) {
    return this.request(`/contacts/${id}/mark_resolved/`, {
      method: 'POST'
    });
  }
  
  async addNotes(id, notes) {
    return this.request(`/contacts/${id}/add_notes/`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const contactAPI = new ContactAPI();

// Export default service
export default apiService;