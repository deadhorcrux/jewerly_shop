import React, { useState, useEffect } from 'react';
import Header from "./Header";

function OrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/orders',{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const ordersData = await response.json();
                setOrders(ordersData);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <section className="h-100">
            <Header/>
            <div className="container py-5">
                <h2 className="mb-4">Список заказов</h2>
                <div className="row">
                    {orders.map(order => (
                        <OrderItem key={order.id} order={order} />
                    ))}
                </div>
            </div>
        </section>
    );
}

const OrderItem = ({ order }) => {
    return (
        <div className="col-md-6 mb-4">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Заказ #{order.id}</h5>
                    <p className="card-text">Статус: {order.status}</p>
                    <p className="card-text">Сумма: {order.sum} ₽</p>
                    <p className="card-text">Адрес доставки: {order.delivery_address}</p>
                    <p className="card-text">Тип доставки: {order.delivery_type}</p>
                    <p className="card-text">Тип оплаты: {order.payment_type}</p>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
