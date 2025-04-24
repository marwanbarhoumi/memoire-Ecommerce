import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./Components/Login/SignIn";
import SignUp from "./Components/Login/SignUp";
import NavigationBr from "./Components/NavigationBr";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./JS/action/authActions";
import Home from "./Components/Home";
import AdminDashboard from "./Components/Private_Routes/Admin/AdminDashboard";
import ProductList from "./Components/Products/ProductList";
import AddProduct from "./Components/Products/AddProduct";
import EditProduct from "./Components/Products/EditProduct";
import ProductDetails from "./Components/Products/ProductDetails";
import PrivateRoute from "./Components/Private_Routes";
import CartPage from './Components/Products/CartPage';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);
  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    <div className="App">
      <NavigationBr />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="/edit" element={<EditProduct />} />
        <Route path="/products/:idprod" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route 
            path="/edit/:id"  
            element={currentUser?.role === "admin" ? <EditProduct /> : <Navigate to="/" />} 
          />
        
        {/* Route pour les admins */}
        <Route
          path="/admin_dashbord"
          element={
            <PrivateRoute>
              {currentUser?.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" />
              )}
            </PrivateRoute>
          }
        />
        
        {/* Route pour les clients */}
        <Route
          path="/client_home"
          element={
            <PrivateRoute>
              {currentUser?.role === "client" ? (
                <Home />
              ) : (
                <Navigate to="/" />
              )}
            </PrivateRoute>
          }
        />
        
      </Routes>

    </div>
  );
}

export default App;