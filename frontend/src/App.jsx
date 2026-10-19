import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import CommandCenter from './pages/CommandCenter';
import FleetOverview from './pages/FleetOverview';
import PredictiveAI from './pages/PredictiveAI';
import SensorIntelligence from './pages/SensorIntelligence';
import WorkOrders from './pages/WorkOrders';
import SpareParts from './pages/SpareParts';
import AvailabilityForecast from './pages/AvailabilityForecast';
import DigitalTwin from './pages/DigitalTwin';
import DataManagement from './pages/DataManagement';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page without persistent dashboard shell */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Dashboard Shell Routes */}
        <Route
          path="/command-center"
          element={
            <Layout>
              <CommandCenter />
            </Layout>
          }
        />
        <Route
          path="/fleet"
          element={
            <Layout>
              <FleetOverview />
            </Layout>
          }
        />
        <Route
          path="/predictive-ai"
          element={
            <Layout>
              <PredictiveAI />
            </Layout>
          }
        />
        <Route
          path="/aircraft-health"
          element={
            <Layout>
              <SensorIntelligence />
            </Layout>
          }
        />
        <Route
          path="/sensor-intelligence"
          element={
            <Layout>
              <SensorIntelligence />
            </Layout>
          }
        />
        <Route
          path="/work-orders"
          element={
            <Layout>
              <WorkOrders />
            </Layout>
          }
        />
        <Route
          path="/inventory"
          element={
            <Layout>
              <SpareParts />
            </Layout>
          }
        />
        <Route
          path="/forecast"
          element={
            <Layout>
              <AvailabilityForecast />
            </Layout>
          }
        />
        <Route
          path="/digital-twin"
          element={
            <Layout>
              <DigitalTwin />
            </Layout>
          }
        />
        <Route
          path="/analytics"
          element={
            <Layout>
              <AvailabilityForecast />
            </Layout>
          }
        />
        <Route
          path="/data-management"
          element={
            <Layout>
              <DataManagement />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <SettingsPage />
            </Layout>
          }
        />

        {/* Default route redirect to landing */}
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
