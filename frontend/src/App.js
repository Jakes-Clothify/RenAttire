import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import HomeLanding from "./pages/HomeLanding";
import Shop from "./pages/Shop";
import ShopFilters from "./pages/ShopFilters";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import MyRentals from "./pages/MyRentals";
import Admin from "./pages/Admin";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";

import ClothDetails from "./pages/ClothDetails";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import ProductDetails from "./pages/ProductDetails";
import EditCloth from "./pages/EditCloth";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeLanding />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/filters" element={<ShopFilters />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/cloth/:id" element={<ClothDetails />} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
          <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/my-rentals" element={<PrivateRoute><MyRentals /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="/admin/cloth/:id/edit" element={<AdminRoute><EditCloth /></AdminRoute>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
