import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './All.css';
import back from "./img/back.svg";

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, newPassword, confirmPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setError('');
                navigate('/login');
            } else {
                setError(data.message);
                setMessage('');
            }
        } catch (error) {
            console.error('Error resetting password', error);
            setError('Server error');
            setMessage('');
        }
    };

    return (
        <section className="vh-100 gradient-custom">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card bg-white text-dark" style={{ borderRadius: "1rem" }}>
                            <div className="card-body p-5 text-center">
                                <div className="mb-md-0 mt-md-0 pb-1">
                                    <div className="position-relative">
                                        <Link to="/" className="btn btn-link position-absolute top-0 start-0 m-2">
                                            <img src={back} alt="Back" width="20" height="20" />
                                        </Link>
                                    </div>
                                    <h2 className="fw-bold mb-2 text-uppercase">AVE.DIAMONDS</h2>
                                    <p className="fs-5 text-dark-60 mb-3">Смена пароля</p>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3 row align-items-center">
                                            <label htmlFor="staticEmail" className="fs-5 col-4 col-form-label">Почта</label>
                                            <div className="col-8">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="staticEmail"
                                                    placeholder="email@example.com"
                                                    value={email}
                                                    onChange={(e) => { setEmail(e.target.value); }}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row align-items-center">
                                            <label htmlFor="inputNewPassword" className="fs-5 col-4 col-form-label">Новый пароль</label>
                                            <div className="col-8">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="inputNewPassword"
                                                    placeholder="********"
                                                    value={newPassword}
                                                    onChange={(e) => { setNewPassword(e.target.value); }}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row align-items-center">
                                            <label htmlFor="inputConfirmPassword" className="fs-5 col-4 col-form-label">Повторите новый пароль</label>
                                            <div className="col-8">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="inputConfirmPassword"
                                                    placeholder="********"
                                                    value={confirmPassword}
                                                    onChange={(e) => { setConfirmPassword(e.target.value); }}
                                                />
                                            </div>
                                        </div>
                                        <button className="btn btn-outline-dark btn-lg px-5" type="submit">Сменить пароль</button>
                                    </form>
                                    {message && <p className="text-success mt-3">{message}</p>}
                                    {error && <p className="text-danger mt-3">{error}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ResetPassword;
