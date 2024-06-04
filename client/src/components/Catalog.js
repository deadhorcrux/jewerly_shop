import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import { addToCart } from './js/addToCart';
import { exportCart } from './js/exportCart';
import { quantityChange } from './js/quantityChange';
import minus from './img/minus.svg';
import plus from './img/plus.svg';
import './All.css';
import favorite from "./img/favorite.svg";

function Catalog() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [sortByPrice, setSortByPrice] = useState('asc');
    const [filters, setFilters] = useState({
        stone_name: '',
        metal_name: '',
        purity: '',
        carat: '',
        jewerly_type: ''
    });

    const [filterOptions, setFilterOptions] = useState({
        stones: [],
        metals: [],
        purities: [],
        carats: [],
        jewelryTypes: []
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const query = new URLSearchParams({ ...filters, sortByPrice });
                const response = await fetch(`/ware?${query.toString()}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [filters, sortByPrice]);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const response = await fetch('/filter-options');
                if (!response.ok) {
                    throw new Error('Failed to fetch filter options');
                }
                const data = await response.json();
                setFilterOptions(data);
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };

        fetchFilterOptions();
    }, []);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const cartData = await exportCart();
                setCartItems(cartData);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCart();
    }, []);

    const handleSortByPrice = (e) => {
        setSortByPrice(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleQuantityChange = async (productId, action) => {
        await quantityChange(cartItems, setCartItems, productId, action);
    };

    return (
        <section className="vh-100">
            <div className="container">
                <Header />
                <h1 className="mb-4">Каталог</h1>
                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="sortByPrice" className="form-label">Сортировать по цене</label>
                        <select
                            id="sortByPrice"
                            className="form-select small-select"
                            value={sortByPrice}
                            onChange={handleSortByPrice}
                        >
                            <option value="asc">По возрастанию цены</option>
                            <option value="desc">По убыванию цены</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="filterStoneName" className="form-label">Тип камня</label>
                        <select
                            id="filterStoneName"
                            name="stone_name"
                            className="form-select small-select"
                            value={filters.stone_name}
                            onChange={handleFilterChange}
                        >
                            <option value="">Все</option>
                            {filterOptions.stones && filterOptions.stones.map(stone => (
                                <option key={stone} value={stone}>{stone}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        <label htmlFor="filterMetalName" className="form-label">Тип металла</label>
                        <select
                            id="filterMetalName"
                            name="metal_name"
                            className="form-select small-select"
                            value={filters.metal_name}
                            onChange={handleFilterChange}
                        >
                            <option value="">Все</option>
                            {filterOptions.metals && filterOptions.metals.map(metal => (
                                <option key={metal} value={metal}>{metal}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        <label htmlFor="filterPurity" className="form-label">Чистота</label>
                        <select
                            id="filterPurity"
                            name="purity"
                            className="form-select small-select"
                            value={filters.purity}
                            onChange={handleFilterChange}
                        >
                            <option value="">Все</option>
                            {filterOptions.purities && filterOptions.purities.map(purity => (
                                <option key={purity} value={purity}>{purity}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        <label htmlFor="filterCarat" className="form-label">Карат</label>
                        <select
                            id="filterCarat"
                            name="carat"
                            className="form-select small-select"
                            value={filters.carat}
                            onChange={handleFilterChange}
                        >
                            <option value="">Все</option>
                            {filterOptions.carats && filterOptions.carats.map(carat => (
                                <option key={carat} value={carat}>{carat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        <label htmlFor="filterJewerlyType" className="form-label">Тип ювелирного изделия</label>
                        <select
                            id="filterJewerlyType"
                            name="jewerly_type"
                            className="form-select small-select"
                            value={filters.jewerly_type}
                            onChange={handleFilterChange}
                        >
                            <option value="">Все</option>
                            {filterOptions.jewelryTypes && filterOptions.jewelryTypes.map(jewelryType => (
                                <option key={jewelryType} value={jewelryType}>{jewelryType}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {products.map((product, index) => (
                        <div key={index} className="col-md-2">
                            <div className="card h-100">
                                <div className="card-body">
                                    <Link to={`/product/${product.id}`}>
                                        <img src={product.image_url} className="card-img-top" alt="Product"/>
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">{product.jewerly_type}</p>
                                        <p className="card-text">{product.stone_name} {product.carat}</p>
                                        <p className="card-text">{product.metal_name} {product.purity}</p>
                                    </Link>
                                    <div className="d-flex justify-content-between">
                                        <p className="card-text">{product.price * (1 + product.percent / 100)} ₽</p>
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
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Catalog;