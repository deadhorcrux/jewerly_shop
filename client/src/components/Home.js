import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import About from "./About";
import Footer from "./Footer";
import ProductCarousel from "./Carousel";
import { Link } from 'react-router-dom';

function Home() {

    return (
        <section className="vh-100">
            <div className="container">
                <Header />
                <div className="position-relative mb-2">
                    <img
                        src="https://static.tildacdn.com/tild3333-6332-4236-b565-373739356135/image_11.png"
                        className="img-fluid"
                        alt="shop"
                    />
                    <div className="position-absolute top-50 start-50 translate-middle text-center">
                        <h1 className="text-white display-1 fw-bold">AVE.DIAMONDS</h1>
                        <p className="text-white fs-4">Лучшие ювелирные украшения на любой повод!</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h2 className="text-left">Товары</h2>
                    </div>
                    <div className="col text-end">
                        <Link to="/catalog" className="btn btn-primary">К каталогу</Link>
                    </div>
                </div>
                <ProductCarousel/>
                <About/>
                <Footer/>
            </div>
        </section>
    );
}

export default Home;
