import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './components/auth/login';
import Store from './components/products/store';
import Register from './components/auth/register';
import ProtectedRoute from './components/auth/protectedRoute';
import { AuthProvider } from './context/authContext';
import { Navigate } from 'react-router-dom';
import Error404 from './pages/Error404';
import ProductProvider from './context/productContext';
import Layout from './Layout';
import ProductDetails from './components/products/productDetailsIndividual/productDetails';
import CartPage from './components/products/productDetailsIndividual/CartPage';
import CheckoutPage from './components/products/productDetailsIndividual/checkoutpage';

import ContactForm from './pages/contact';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/adminDashboard';
import ManageProducts from './pages/admin/manageProducts';
import ManageUsers from './pages/admin/manageUsers';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Router>

          <Routes>

            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/contact" element={<ContactForm />} />
              <Route path="/register" element={<Register />} />
              <Route path="/checkout" element={<CheckoutPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<ManageProducts />} />
                  <Route path='users' element={<ManageUsers />} />
                </Route>
              </Route>


              {/* <Route element={<ProtectedRoute />}> */}
              <Route path="/store" element={<Store />} />
              <Route path="/store/:id" element={<ProductDetails />} />
              <Route path='/cart' element={<CartPage />} />
              {/* </Route> */}



              <Route path="*" element={<Error404 />} />
            </Route>
          </Routes>
        </Router>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
