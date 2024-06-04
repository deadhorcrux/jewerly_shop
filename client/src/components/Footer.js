import React from 'react';
import {Link} from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-body-tertiary text-center">
            <div className="container p-4">
                <section className="">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                            <h5 className="text-uppercase">Учредитель</h5>
                            <ul className="list-unstyled mb-0">
                                <li><a className="text-body" href="#!">АО "Аве.Даймондз"</a></li>
                                <li><a className="text-body" href="#!">+7(985) 785-65-20</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                            <h5 className="text-uppercase">Поставщик</h5>
                            <ul className="list-unstyled mb-0">
                                <li><a className="text-body" href="#!">АЛРОСА</a></li>
                                <li><a className="text-body" href="#!">De beers</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                            <h5 className="text-uppercase">Номер</h5>
                            <ul className="list-unstyled mb-0">
                                <li><a className="text-body" href="#!">7(495)699-37-81</a></li>
                                <li><a className="text-body" href="#!">7(495)586-43-37</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                            <h5 className="text-uppercase">Адрес</h5>
                            <ul className="list-unstyled mb-0">
                                <li><a className="text-body" href="#!">респ Саха, Якутия, ул. Ленина, д. 6</a></li>
                                <li><a className="text-body" href="#!">Москва, Красная площадь, 3 </a></li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
            <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                © 2024 Copyright:
                <Link to="/" >
                    <a className="text-reset fw-bold">AVE.DIAMONDS</a>
                </Link>
            </div>
        </footer>
    );
}

export default Footer;

