export const exportCart = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/cart', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch cart items');
        }
        const cartData = await response.json();
        return cartData.items;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return [];
    }
};
