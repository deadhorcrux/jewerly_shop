import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import left from "./img/back.svg"
import right from "./img/right.svg"
import alert from "bootstrap/js/src/alert";

function ProductCarousel() {
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleProducts, setVisibleProducts] = useState([]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/ware');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const productsData = await response.json();
                setProducts(productsData);
                setVisibleProducts(productsData.slice(0,5));
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }

        fetchProducts();
    }, []);

    const moveNext = () => {
        setCurrentIndex(prevIndex => (prevIndex === visibleProducts.length - 1 ? 0 : prevIndex + 1));
    };

    const movePrev = () => {
        setCurrentIndex(prevIndex => (prevIndex === 0 ? visibleProducts.length - 1 : prevIndex - 1));
    };

    useEffect(() => {
        setVisibleProducts(products.slice(currentIndex,currentIndex+5));
    }, [currentIndex, products]);

    return (
        <section>
            <div className="carousel-inner" role="listbox">
                <div className="container">
                    <div className="row">
                        <img className={"col-1 move-button"} src={left} onClick={movePrev} alt="Назад"/>
                        {visibleProducts.map((product, index) => (
                            <div
                                key={product.id}
                                className={`col-2 col-custom rounded-5 ${index === 0 ? 'active' : ''}`}
                            >
                                <img className="d-block w-100 rounded-5" src={product.image_url} alt={product.name} />
                                <h5>{product.name}</h5>
                                <p>{product.stone_name} {product.carat}</p>
                                <p>{product.metal_name} {product.purity}</p>
                            </div>
                        ))}
                        <img className={"col-1 move-button"} src={right} onClick={moveNext} alt="Вперёд" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductCarousel;
