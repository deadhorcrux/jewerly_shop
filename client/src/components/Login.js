import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './All.css';
import back from "./img/back.svg";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            console.error('Error logging in', error);
            setError('Server error');
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
                                    <p className="fs-5 text-dark-60 mb-3">Авторизация</p>
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
                                            <label htmlFor="inputPassword" className="fs-5 col-4 col-form-label">Пароль</label>
                                            <div className="col-8">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="inputPassword"
                                                    placeholder="********"
                                                    value={password}
                                                    onChange={(e) => { setPassword(e.target.value); }}
                                                />
                                            </div>
                                        </div>

                                        <p className="small mb-3 pb-lg-2">
                                            <Link to="/reset-password" className="text-dark-50" href="#!">Не помню пароль</Link>
                                        </p>

                                        <button className="btn btn-outline-dark btn-lg px-5" type="submit">Войти</button>
                                    </form>
                                </div>
                                <div>
                                    <p className="mb-0">
                                        <Link to="/register" className="text-dark-50 fw-bold">Зарегистрироваться</Link>
                                    </p>
                                </div>
                                {error && <p className="text-danger mt-0">{error}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;
