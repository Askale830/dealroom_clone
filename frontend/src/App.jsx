import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import SectorsPage from './pages/SectorsPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import AddCompanyPage from './pages/AddCompanyPage';
import InvestorsPage from './pages/InvestorsPage';
import InvestorDetailPage from './pages/InvestorDetailPage';
import IndustriesPage from './pages/IndustriesPage';
import FundingPage from './pages/FundingPage';
import TransactionsPage from './pages/TransactionsPage';
import EcosystemPage from './pages/EcosystemPage';
import InvestmentPage from './pages/InvestmentPage';
import PeoplePage from './pages/PeoplePage';
import CuratedContentPage from './pages/CuratedContentPage';
import CuratedContentDetailPage from './pages/CuratedContentDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminCompaniesPage from './pages/AdminCompaniesPage';
import HubsPage from './pages/HubsPage';
import IncubatorsPage from './pages/IncubatorsPage';
import AcceleratorsPage from './pages/AcceleratorsPage';
import UniversitiesPage from './pages/UniversitiesPage';
import EcosystemBuilderInfoPage from './pages/EcosystemBuilderInfoPage';
import RegisterHubPage from './pages/RegisterHubPage';
import RegisterIncubatorPage from './pages/RegisterIncubatorPage';
import RegisterAcceleratorPage from './pages/RegisterAcceleratorPage';
import RegisterUniversityPage from './pages/RegisterUniversityPage';
import SignupOrganizationPage from './pages/SignupOrganizationPage';
import SignupSuccessPage from './pages/SignupSuccessPage';
import AdminOrganizationsPage from './pages/AdminOrganizationsPage';
import AdminContactsPage from './pages/AdminContactsPage';
import TestApiPage from './pages/TestApiPage';
import NotFoundPage from './pages/NotFoundPage';
import ContactPage from './pages/ContactPage';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />
        <Route path="/signup-organization" element={<SignupOrganizationPage />} />
        <Route path="/signup-success" element={<SignupSuccessPage />} />
        <Route path="/admin/organizations" element={<AdminOrganizationsPage />} />
        <Route path="/admin/contacts" element={<AdminContactsPage />} />
        <Route path="/test-api" element={<TestApiPage />} />
        {/* Main App Routes */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } />
              <Route path="/sectors" element={<SectorsPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/companies/add" element={
                <PrivateRoute>
                  <AddCompanyPage />
                </PrivateRoute>
              } />
              <Route path="/companies/:slug" element={<CompanyDetailPage />} />
              <Route path="/admin/companies" element={<AdminCompaniesPage />} />
              <Route path="/investors" element={<InvestorsPage />} />
              <Route path="/investors/:slug" element={<InvestorDetailPage />} />
              <Route path="/industries" element={<IndustriesPage />} />
              <Route path="/funding" element={<FundingPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/ecosystem" element={<EcosystemPage />} />
              <Route path="/investment" element={<InvestmentPage />} />
              <Route path="/people" element={<PeoplePage />} />
              <Route path="/curated-content" element={<CuratedContentPage />} />
              <Route path="/curated-content/:slug" element={<CuratedContentDetailPage />} />
              <Route path="/hubs" element={<EcosystemBuilderInfoPage nextPath="/hubs/register" />} />
              <Route path="/incubators" element={<EcosystemBuilderInfoPage nextPath="/incubators/register" />} />
              <Route path="/accelerators" element={<EcosystemBuilderInfoPage nextPath="/accelerators/register" />} />
              <Route path="/universities" element={<EcosystemBuilderInfoPage nextPath="/universities/register" />} />
              <Route path="/hubs/register" element={<RegisterHubPage />} />
              <Route path="/incubators/register" element={<RegisterIncubatorPage />} />
              <Route path="/accelerators/register" element={<RegisterAcceleratorPage />} />
              <Route path="/universities/register" element={<RegisterUniversityPage />} />
              <Route path="/contact" element={<ContactPage />} />
              {/* Add a catch-all for 404 within the layout if needed */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;