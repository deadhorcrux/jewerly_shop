import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import back from './img/back.svg';
import { Link, useNavigate } from 'react-router-dom';

import './All.css';

function Register() {
    const [step, setStep] = useState(1);
    let [phoneNumber, setPhoneNumber] = useState('');
    const [surname, setSurname] = useState('');
    const [name, setName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const checkPhoneNumber = async () => {
        phoneNumber = phoneNumber.replace(/^\+/, '');
        try {
            const response = await fetch('/check-phone', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.message);
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error checking phone number', error);
            setError('Server error');
            return false;
        }
    };

    const checkEmail = async () => {
        try {
            const response = await fetch('/check-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.message);
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error checking email', error);
            setError('Server error');
            return false;
        }
    };

    const handleNext = async (e) => {
        e.preventDefault();
        setError('');

        if (step === 1) {
            if (await checkPhoneNumber()) {
                setStep(step + 1);
            }
        } else if (step === 2) {
            if (await checkEmail()) {
                setStep(step + 1);
            }
        }
    };

    const handlePrevious = () => {
        setError('');
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        phoneNumber = phoneNumber.replace(/^\+/, '');
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    surname,
                    name,
                    secondName,
                    phoneNumber,
                    email,
                    password,
                }),
            });

            if (response.ok) {
                navigate('/login');
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            console.error('Error registering user', error);
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
                                {step === 1 && (
                                    <div>
                                        <div className="position-relative">
                                            <Link to="/login" className="btn btn-link position-absolute top-0 start-0 m-2">
                                                <img src={back} alt="Back" width="20" height="20" />
                                            </Link>
                                        </div>
                                        <h2 className="fw-bold mb-2 text-uppercase">Регистрация</h2>
                                        <p className="fs-5 text-dark-60 mb-3">Введите номер телефона</p>
                                        <form onSubmit={handleNext}>
                                            <div className="mb-3 row align-items-center">
                                                <label htmlFor="number" className="fs-5 col-4 col-form-label">Номер телефона</label>
                                                <div className="col-8">
                                                    <InputMask
                                                        mask="+7(999)999-99-99"
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                    >
                                                        {(inputProps) => (
                                                            <input
                                                                {...inputProps}
                                                                type="text"
                                                                className="form-control"
                                                                id="number"
                                                                placeholder="Введите номер телефона"
                                                            />
                                                        )}
                                                    </InputMask>
                                                </div>
                                            </div>
                                            <button className="btn btn-outline-dark btn-lg px-5" type="submit">Далее</button>
                                        </form>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div>
                                        <div className="position-relative">
                                            <button className="btn btn-link position-absolute top-0 start-0 m-2" onClick={handlePrevious}>
                                                <img src={back} alt="Back" width="20" height="20" />
                                            </button>
                                        </div>
                                        <h2 className="fw-bold mb-2 text-uppercase">Регистрация</h2>
                                        <p className="fs-5 text-dark-60 mb-3">Введите ФИО и адрес электронной почты</p>
                                        <form onSubmit={handleNext}>
                                            <div className="mb-3 row align-items-center">
                                                <label htmlFor="surname" className="fs-5 col-4 col-form-label">Фамилия</label>
                                                <div className="col-8">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="surname"
                                                        placeholder="Введите фамилию"
                                                        value={surname}
                                                        onChange={(e) => setSurname(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row align-items-center">
                                                <label htmlFor="name" className="fs-5 col-4 col-form-label">Имя</label>
                                                <div className="col-8">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="name"
                                                        placeholder="Введите имя"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row align-items-center">
                                                <label htmlFor="secondName" className="fs-5 col-4 col-form-label">Отчество</label>
                                                <div className="col-8">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="secondName"
                                                        placeholder="Введите отчество"
                                                        value={secondName}
                                                        onChange={(e) => setSecondName(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row align-items-center">
                                                <label htmlFor="email" className="fs-5 col-4 col-form-label">Почта</label>
                                                <div className="col-8">
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        id="email"
                                                        placeholder="email@example.com"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <button className="btn btn-outline-dark btn-lg px-5" type="submit">Далее</button>
                                        </form>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div>
                                        <div className="position-relative">
                                            <button className="btn btn-link position-absolute top-0 start-0 m-2" onClick={handlePrevious}>
                                                <img src={back} alt="Back" width="20" height="20" />
                                            </button>
                                        </div>
                                        <h2 className="fw-bold mb-2 text-uppercase">Регистрация</h2>
                                        <p className="fs-5 text-dark-60 mb-3">Введите пароль</p>
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3 row align-items-center">
                                                <label htmlFor="password" className="fs-5 col-4 col-form-label">Пароль</label>
                                                <div className="col-8">
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="password"
                                                        placeholder="********"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row align-items-center">
                                                <label htmlFor="confirmPassword" className="fs-5 col-4 col-form-label">Подтвердите пароль</label>
                                                <div className="col-8">
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="confirmPassword"
                                                        placeholder="********"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <button className="btn btn-outline-dark btn-lg px-5" type="submit">Зарегистрироваться</button>
                                        </form>
                                    </div>
                                )}
                                {error && <p className="text-danger mt-3">{error}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Register;

