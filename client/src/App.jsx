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
import ProductDetails from './components/products/productDetails';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Router>
          <Routes>

            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />


              <Route element={<ProtectedRoute />}>
                <Route path="/store" element={<Store />} />
                <Route path="/store/:id" element={<ProductDetails />} />

              </Route>

              <Route path="*" element={<Error404 />} />
            </Route>
          </Routes>
        </Router>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
