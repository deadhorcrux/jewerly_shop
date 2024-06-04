export const addToCart = async (productId, navigate) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const response = await fetch('/cart-edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, action: 'increase' })
        });
        if (!response.ok) {
            throw new Error('Failed to add product to cart');
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
    }
};