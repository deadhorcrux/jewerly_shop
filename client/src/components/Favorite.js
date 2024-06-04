import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { addToCart } from './js/addToCart';
import minus from './img/minus.svg';
import plus from './img/plus.svg';
import './All.css';

function Favorite() {
    const navigate = useNavigate();
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchFavoriteItems = async () => {
            try {
                const response = await fetch('/favorite', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch favorite items');
                }
                const data = await response.json();
                setFavoriteItems(data);
            } catch (error) {
                console.error('Error fetching favorite items:', error);
            }
        };

        fetchFavoriteItems();
    }, []);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                // Fetch cart items
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCart();
    }, []);

    const handleQuantityChange = async (productId, action) => {
        // Handle quantity change
    };

    const removeFromFavorites = async (productId) => {
        try {
            const response = await fetch(`/favorite/remove/${productId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to remove item from favorites');
            }
            // Refresh the list of favorite items after successful removal
            const updatedFavoriteItems = favoriteItems.filter(item => item.jewerly_id !== productId);
            setFavoriteItems(updatedFavoriteItems);
        } catch (error) {
            console.error('Error removing item from favorites:', error);
        }
    };

    return (
        <section className="vh-100">
            <div className="container">
                <Header />
                <h1 className="mb-4">Избранное</h1>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {favoriteItems.map((product, index) => (
                        <div key={index} className="col-md-3">
                            <div className="card h-100">
                                <div className="card-body">
                                    <img src={product.image_url} className="card-img-top" alt="Product"/>
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">Тип {product.jewerly_type_name}</p>
                                    <p className="card-text">Камень {product.stone_name} {product.carat} карат</p>
                                    <p className="card-text">Метал {product.metal_name} {product.purity} пробы</p>
                                    <div className="d-flex justify-content-between">
                                        <p className="card-text">{product.price * (1 + product.percent / 100)} ₽</p>
                                        <div className="d-flex align-items-center">
                                            <img src={minus} alt="Remove from favorites" width="20" height="20" className="me-2" onClick={() => removeFromFavorites(product.jewerly_id)} />
                                            {cartItems.some(item => item.id === product.id && item.count > 0) ? (
                                                <div className="d-flex align-items-center">
                                                    <img src={minus} width="20" height="20" alt="Minus" className="me-2" onClick={() => handleQuantityChange(product.id, 'decrease')} />
                                                    <input id={`quantity-${product.id}`} min="0" name="quantity" value={cartItems.find(item => item.id === product.id).count} type="number" className="form-control ultra-small-select" readOnly />
                                                    <img src={plus} width="20" height="20" alt="Plus" className="ms-2" onClick={() => handleQuantityChange(product.id, 'increase')} />
                                                </div>
                                            ) : (
                                                <button className="btn btn-primary" onClick={() =>{ addToCart(product.id, navigate); window.location.reload();}}>В корзину</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Favorite;
