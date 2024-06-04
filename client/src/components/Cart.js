import React, { useState, useEffect } from 'react';
import minus from './img/minus.svg';
import plus from './img/plus.svg';
import Header from "./Header";
import {Link} from "react-router-dom";
import {exportCart} from "./js/exportCart"
import {quantityChange} from "./js/quantityChange"

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [deliveryTypes, setDeliveryTypes] = useState([]);
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [selectedDeliveryType, setSelectedDeliveryType] = useState('');
    const [selectedPaymentType, setSelectedPaymentType] = useState('');
    const [address, setAddress] = useState('');

    useEffect( () => {
        const fetchData = async () => {
            setCartItems(await exportCart());
            await fetchDeliveryTypes();
            await fetchPaymentTypes();
        };

        fetchData();
    }, []);

    const handleQuantityChangeWrapper = async (productId, action) => {
        await quantityChange(cartItems, setCartItems, productId, action);
    };

    const fetchDeliveryTypes = async () => {
        try {
            const response = await fetch('/delivery-types');
            const data = await response.json();
            setDeliveryTypes(data);
        } catch (error) {
            console.error('Error fetching delivery types:', error);
        }
    };

    const fetchPaymentTypes = async () => {
        try {
            const response = await fetch('/payment-types');
            const data = await response.json();
            setPaymentTypes(data);
        } catch (error) {
            console.error('Error fetching payment types:', error);
        }
    };

    const handleQuantityChange = async (productId, action) => {
        try {
            const token = localStorage.getItem('token');
            const updatedCartItems = cartItems.map(item => {
                if (item.id === productId) {
                    if (action === 'increase') {
                        item.count++;
                    } else if (action === 'decrease' && item.count > 0) {
                        item.count--;
                    }
                }
                return item;
            }).filter(item => item.count > 0);

            setCartItems(updatedCartItems);

            await fetch('/cart-edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId, action })
            });
        } catch (error) {
            console.error('Error updating cart items:', error);
        }
    };

    const handleOrder = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!selectedDeliveryType || !selectedPaymentType) {
                throw new Error('Выберите тип доставки и тип оплаты');
            }

            const orderData = {
                delivery_id: selectedDeliveryType,
                payment_id: selectedPaymentType,
                status_id: 1,
                delivery_address: address,
                sum: calculateTotal(),
                jewelry_ids: cartItems.map(item => item.id)
            };

            const response = await fetch('/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const responseData = await response.json();

            console.log('Order placed successfully:', responseData);
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };


    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.count * (1 + item.percent / 100), 0);
    };

    return (
        <section className="h-100">
            <Header/>
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-8">
                        <div className="card mb-4">
                            <div className="card-header py-3">
                                <h5 className="mb-0">Корзина</h5>
                                <h5 className="mb-0">Товаров: {cartItems.length}</h5>
                            </div>
                            <div className="card-body">
                                {cartItems.map((item, index) => (
                                    <CartItem key={index} item={item} handleQuantityChange={handleQuantityChange} />
                                ))}
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Итоговая сумма:</h5>
                                    <h5 className="mb-0">{calculateTotal().toFixed(2)} ₽</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <PaymentSection
                            deliveryTypes={deliveryTypes}
                            paymentTypes={paymentTypes}
                            selectedDeliveryType={selectedDeliveryType}
                            setSelectedDeliveryType={setSelectedDeliveryType}
                            address={address}
                            setAddress={setAddress}
                            selectedPaymentType={selectedPaymentType}
                            setSelectedPaymentType={setSelectedPaymentType}
                            handleOrder={handleOrder}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

const CartItem = ({ item, handleQuantityChange }) => {
    return (
        <div className="row">
            <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
                <div className="bg-image hover-overlay hover-zoom ripple rounded" data-mdb-ripple-color="light">
                    <img src={item.image_url} className="w-100" alt="Product" />
                    <a href="#!">
                        <div className="mask" style={{ backgroundColor: "rgba(251, 251, 251, 0.2)" }}></div>
                    </a>
                </div>
            </div>

            <div className="col-lg-5 col-md-6 mb-4 mb-lg-0">
                <p><strong>{item.name}</strong></p>
                <p className="card-text">{item.stone_name} {item.carat}</p>
                <p className="card-text">{item.metal_name} {item.purity}</p>
            </div>

            <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                <div className="d-flex justify-content-center align-items-center">
                    <div className="mx-2">
                        <div className="d-flex align-items-center">
                            <img src={minus} width="20" height="20" alt="Minus" className="me-2" onClick={() => handleQuantityChange(item.id, 'decrease')} />
                            <input id={`quantity-${item.id}`} min="0" name="quantity" value={item.count} type="number" className="form-control" readOnly />
                            <img src={plus} width="20" height="20" alt="Plus" className="ms-2" onClick={() => handleQuantityChange(item.id, 'increase')} />
                        </div>
                        <div className="text-center">Количество</div>
                    </div>
                </div>
                <p className="text-start text-md-center">
                    <strong>{item.price * (1 + item.percent / 100)} ₽</strong>
                </p>
            </div>
        </div>
    );
};

const PaymentSection = ({ deliveryTypes, paymentTypes, selectedDeliveryType, setSelectedDeliveryType, address, setAddress, selectedPaymentType, setSelectedPaymentType, handleOrder }) => {
    return (
        <div className="card mb-4">
            <div className="card-header py-3">
                <h5 className="mb-0">Оплата</h5>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label htmlFor="deliveryType" className="form-label">Тип доставки</label>
                    <select id="deliveryType" className="form-select" value={selectedDeliveryType} onChange={(e) => setSelectedDeliveryType(e.target.value)}>
                        <option value="">Выберите тип доставки</option>
                        {deliveryTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.type}</option>
                        ))}
                    </select>
                </div>
                {selectedDeliveryType === 'Доставка' && (
                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">Адрес доставки</label>
                        <input type="text" id="address" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                )}
                <div className="mb-3">
                    <label htmlFor="paymentType" className="form-label">Тип оплаты</label>
                    <select id="paymentType" className="form-select" value={selectedPaymentType} onChange={(e) => setSelectedPaymentType(e.target.value)}>
                        <option value="">Выберите тип оплаты</option>
                        {paymentTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.type}</option>
                        ))}
                    </select>
                </div>
                <Link to="/orders" className="btn me-3">
                    <button className="btn btn-primary" onClick={handleOrder}>Заказать</button>
                </Link>
            </div>
        </div>
    );
};

export default Cart;
