import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider }   from './context/AuthContext';
import { DraftProvider }  from './context/DraftContext';
import { CartProvider }   from './context/CartContext';
import ProtectedRoute     from './components/ProtectedRoute';
import Navbar             from './components/layout/Navbar';

// ── Pages ─────────────────────────────────────────────────────────────────────
import Home               from './pages/Home';
import Login              from './pages/Login';
import Register           from './pages/Register';
import Fashion            from './pages/fashion';
import Furniture          from './pages/Furniture';
import Beads              from './pages/Beads';
import CustomOrder        from './pages/CustomOrder';
import About              from './pages/About';
import Shop               from './pages/Shop';
import Gallery            from './pages/Gallery';
import SearchResults      from './pages/SearchResults';
import ProductDetail      from './pages/ProductDetail';
import Checkout           from './pages/Checkout';
import UserProfile        from './pages/UserProfile';
import VendorDashboard    from './pages/VendorDashboard';
import AdminDashboard     from './pages/AdminDashboard';
import OrderTracking      from './pages/OrderTracking';
import AffiliateDashboard from './pages/AffiliateDashboard';
import Cart               from './pages/Cart';
import Contact            from './pages/Contact';
import Drafts             from './pages/Drafts';
import VendorLanding      from './pages/VendorLanding';
import AffiliateLanding   from './pages/AffiliateLanding';
import Syndicate          from './pages/Syndicate';
import ArtisanChatPage    from './pages/ArtisanChatPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <DraftProvider>
          <Router>
            <Navbar />
            <Routes>

              {/* ── PUBLIC ───────────────────────────────────────────────── */}
              <Route path="/"              element={<Home />}             />
              <Route path="/login"         element={<Login />}            />
              <Route path="/register"      element={<Register />}         />
              <Route path="/fashion"       element={<Fashion />}          />
              <Route path="/furniture"     element={<Furniture />}        />
              <Route path="/beads"         element={<Beads />}            />
              <Route path="/about"         element={<About />}            />
              <Route path="/shop"          element={<Shop />}             />
              <Route path="/products"      element={<Shop />}             />
              <Route path="/gallery"       element={<Gallery />}          />
              <Route path="/search"        element={<SearchResults />}    />
              <Route path="/product/:slug" element={<ProductDetail />}    />
              <Route path="/contact"       element={<Contact />}          />
              <Route path="/vendor"        element={<VendorLanding />}    />
              <Route path="/affiliate"     element={<AffiliateLanding />} />
              <Route path="/syndicate"     element={<Syndicate />}        />
              <Route path="/artisan-chat"  element={<ArtisanChatPage />}  />

              {/* ── ANY LOGGED-IN USER ───────────────────────────────────── */}
              <Route path="/cart"          element={<ProtectedRoute><Cart /></ProtectedRoute>}          />
              <Route path="/checkout"      element={<ProtectedRoute><Checkout /></ProtectedRoute>}      />
              <Route path="/profile"       element={<ProtectedRoute><UserProfile /></ProtectedRoute>}   />
              <Route path="/order-tracking" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
              <Route path="/custom-order"  element={<ProtectedRoute><CustomOrder /></ProtectedRoute>}   />
              <Route path="/drafts"        element={<ProtectedRoute><Drafts /></ProtectedRoute>}        />

              {/* ── AFFILIATE ONLY ───────────────────────────────────────── */}
              <Route path="/affiliate/dashboard" element={
                <ProtectedRoute role="affiliate"><AffiliateDashboard /></ProtectedRoute>
              } />

              {/* ── VENDOR ONLY ──────────────────────────────────────────── */}
              <Route path="/vendor/dashboard" element={
                <ProtectedRoute role="vendor"><VendorDashboard /></ProtectedRoute>
              } />

              {/* ── ADMIN ONLY ───────────────────────────────────────────── */}
              {/* ✅ /admin matches ROLE_REDIRECTS in AuthContext */}
              <Route path="/admin" element={
                <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
              } />

            </Routes>
          </Router>
        </DraftProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;