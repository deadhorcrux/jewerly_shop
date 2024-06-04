import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Cart from "./components/Cart";
import ProtectedRoute from "./ProtectedRoute";
import Register from "./components/Register";
import Stub from "./components/Stub";
import Catalog from "./components/Catalog";
import Orders from "./components/Orders";
import ProductCard from "./components/ProductCard";
import ResetPassword from "./components/ResetPassword";
import Favorite from "./components/Favorite";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register/>} />
                <Route path="/stub" element={<Stub/>} />
                <Route path="/catalog" element={<Catalog/>} />
                <Route path="/reset-password" element={<ResetPassword/>}/>
                <Route path="/favorite" element={<Favorite/>}/>
                <Route
                    path="/orders"
                    element={
                    <ProtectedRoute>
                        <Orders/>
                    </ProtectedRoute>
                    }
                />
                <Route path="/product/:productId" element={<ProductCard/>}/>
                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
