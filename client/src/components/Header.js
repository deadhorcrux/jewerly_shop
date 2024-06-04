import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import cart from './img/cart.svg';
import logout from './img/logout.svg';
import order from './img/order.svg'
import favorite from './img/favorite.svg'
import './All.css';

function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    };

    const scrollToAbout = () => {
        if (location.pathname === '/') {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            navigate('/');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary gradient-custom navbar-custom">
            <div className="container d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <Link className="nav-link me-3" to="/catalog">Каталог</Link>
                    <a className="nav-link" href="#about" onClick={scrollToAbout}>О нас</a>
                </div>
                <Link className="navbar-brand mx-auto" to="/">AVE.DIAMONDS</Link>
                {!isAuthenticated && (
                    <Link to="/login" className="btn btn-primary me-3">Вход</Link>
                )}
                {isAuthenticated && (
                    <>
                        <Link to="/favorite" className="btn me-1">
                            <img src={favorite} alt="Избранное" width="20" height="20" />
                        </Link>
                        <Link to="/orders" className="btn me-1">
                            <img src={order} alt="Заказы" width="20" height="20" />
                        </Link>
                        <Link to="/cart" className="btn  me-1">
                            <img src={cart} alt="Корзина" width="20" height="20" />
                        </Link>
                        <div className="d-flex align-items-center">
                            <button className="btn " onClick={handleLogout}>
                                <img src={logout} alt="Logout" width="20" height="20" />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Header;
