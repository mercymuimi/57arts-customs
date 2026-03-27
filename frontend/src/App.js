import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DraftProvider } from './context/DraftContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Fashion from './pages/fashion';
import Furniture from './pages/Furniture';
import Beads from './pages/Beads';
import CustomOrder from './pages/CustomOrder';
import About from './pages/About';
import Shop from './pages/Shop';
import Gallery from './pages/Gallery';
import SearchResults from './pages/SearchResults';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import UserProfile from './pages/UserProfile';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import OrderTracking from './pages/OrderTracking';
import AffiliateDashboard from './pages/AffiliateDashboard';
import Cart from './pages/Cart';
import ArtisanChat from './pages/ArtisanChat';
import Contact from './pages/Contact';
import Drafts from './pages/Drafts';
import VendorLanding from './pages/VendorLanding';
import AffiliateLanding from './pages/AffiliateLanding';
import Syndicate from './pages/Syndicate';

function App() {
  return (
    <AuthProvider>
      <DraftProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/"                    element={<Home />}               />
            <Route path="/login"               element={<Login />}              />
            <Route path="/register"            element={<Register />}           />
            <Route path="/fashion"             element={<Fashion />}            />
            <Route path="/furniture"           element={<Furniture />}          />
            <Route path="/beads"               element={<Beads />}              />
            <Route path="/custom-order"        element={<CustomOrder />}        />
            <Route path="/about"               element={<About />}              />
            <Route path="/shop"                element={<Shop />}               />
            <Route path="/products"            element={<Shop />}               />
            <Route path="/gallery"             element={<Gallery />}            />
            <Route path="/search"              element={<SearchResults />}      />
            <Route path="/product/:slug"       element={<ProductDetail />}      />
            <Route path="/checkout"            element={<Checkout />}           />
            <Route path="/profile"             element={<UserProfile />}        />
            <Route path="/vendor/dashboard"    element={<VendorDashboard />}    />
            <Route path="/admin/dashboard"     element={<AdminDashboard />}     />
            <Route path="/order-tracking"      element={<OrderTracking />}      />
            <Route path="/affiliate/dashboard" element={<AffiliateDashboard />} />
            <Route path="/cart"                element={<Cart />}               />
            <Route path="/artisan-chat"        element={<ArtisanChat />}        />
            <Route path="/contact"             element={<Contact />}            />
            <Route path="/drafts"              element={<Drafts />}             />
            <Route path="/vendor"              element={<VendorLanding />}      />
            <Route path="/affiliate"           element={<AffiliateLanding />}   />
            <Route path="/syndicate"           element={<Syndicate />}          />
          </Routes>
        </Router>
      </DraftProvider>
    </AuthProvider>
  );
}

export default App;