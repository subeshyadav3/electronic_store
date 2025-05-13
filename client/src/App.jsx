import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/auth/login';
import Store from './components/products/store';
import Register from './components/auth/register';
import ProtectedRoute from './components/auth/protectedRoute';
import { AuthProvider } from './context/authContext';
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
import ManageProductIndividual from './pages/admin/manageProductIndividual';
import ManageUserIndividual from './pages/admin/manageUsersIndividual';
import ManageOrder from './pages/admin/manageOrder';
import ManageOrderUpdate from './pages/admin/manageOrderUpdate';
import { ToastProvider } from './context/toastContext';
import Logout from './components/auth/logout';
import CreateProductForm from './pages/admin/createProducts';
import CustomerDashboard from './pages/client/dashboard';
import CustomerLayout from './pages/client/customerLayout';

function App() {
  return (
    <ToastProvider>
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
                
                <Route path="/dashboard">

                  <Route
                    path="admin"
                    element={
                      <ProtectedRoute
                        allowedRoles={['admin']}
                        redirectTo="/dashboard/customer" 
                      />
                    }
                  >
                    <Route element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="products" element={<ManageProducts />} />
                      <Route path="products/:id" element={<ManageProductIndividual />} />
                      <Route path="products/create" element={<CreateProductForm />} />
                      <Route path="users" element={<ManageUsers />} />
                      <Route path="users/:id" element={<ManageUserIndividual />} />
                      <Route path="orders" element={<ManageOrder />} />
                      <Route path="orders/:id" element={<ManageOrderUpdate />} />
                    </Route>
                  </Route>

         
                  <Route
                    path="customer"
                    element={
                      <ProtectedRoute
                        allowedRoles={['customer']}
                        redirectTo="/dashboard/admin"
                      />
                    }
                  >
                    <Route element={<CustomerLayout />}>
                      <Route index element={<CustomerDashboard />} />
                    </Route>
                  </Route>
                </Route>

                <Route path="/store" element={<Store />} />


                <Route path="/store/:id" element={<ProductDetails />} />

                <Route element={<ProtectedRoute allowedRoles={['admin', 'customer']} />}>
                  <Route path="/logout" element={<Logout />} />

                  <Route path='/cart' element={<CartPage />} />
                  <Route path='/checkout' element={<CheckoutPage />} />
                </Route>


                <Route path="*" element={<Error404 />} />
              </Route>
            </Routes>
          </Router>
        </ProductProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
