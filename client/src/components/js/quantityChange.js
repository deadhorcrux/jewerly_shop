export const quantityChange = async (cartItems, setCartItems, productId, action) => {
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
