import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ContentCreation from './pages/ContentCreation';
import Analytics from './pages/Analytics';
import CharacterCreator from './pages/CharacterCreator';
import MonetizationStrategies from './pages/MonetizationStrategies';
import AIAgent from './pages/AIAgent';
import SocialConnections from './pages/SocialConnections';
import ContentScheduling from './pages/ContentScheduling';
import AutoRunAgent from './pages/AutoRunAgent';
import DigitalProductCreator from './pages/DigitalProductCreator';
import Pricing from './pages/Pricing';
import ProductAnalytics from './pages/ProductAnalytics';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Onboarding from './pages/Onboarding';
import About from './pages/About';
import TermsAndConditions from './pages/TermsAndConditions';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51234567890');

function App() {
  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navigation />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/create" element={<ContentCreation />} />
                <Route path="/schedule" element={<ContentScheduling />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/character" element={<CharacterCreator />} />
                <Route path="/monetization" element={<MonetizationStrategies />} />
                <Route path="/agent" element={<AIAgent />} />
                <Route path="/autorun" element={<AutoRunAgent />} />
                <Route path="/products" element={<DigitalProductCreator />} />
                <Route path="/product-analytics" element={<ProductAnalytics />} />
                <Route path="/connections" element={<SocialConnections />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/about" element={<About />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/auth/callback" element={<OAuthCallback />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </Elements>
    </BrowserRouter>
  );
}

// OAuth Callback Handler
function OAuthCallback() {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center max-w-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-white font-semibold">Completing connection...</p>
        <p className="text-slate-400 text-sm mt-2">You will be redirected shortly</p>
      </div>
    </div>
  );
}

export default App;
