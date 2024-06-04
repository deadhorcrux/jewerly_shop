const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'TEST',
    password: '1234',
    port: 5432,
});

const SECRET_KEY = 'your-secret-key';

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.sendStatus(403);
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

app.post('/create-order', authenticateToken, async (req, res) => {
    const { delivery_id, payment_id, delivery_address, sum, jewelry_ids } = req.body;
    const userId = req.user.userId;
    try {
        await pool.query('INSERT INTO orders (users_id, delivery_id, payment_id, status_id, delivery_address, sum, jewelry_id) VALUES ($1, $2, $3, $4, $5, $6, $7)', [userId, delivery_id, payment_id, 1, delivery_address, sum, jewelry_ids]);
        res.status(201).send({ message: 'Заказ успешно создан' });
        await pool.query('DELETE FROM cart WHERE users_id = $1', [userId]);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send({ message: 'Server error' });
    }
});

app.get('/orders', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await pool.query('SELECT o.id, o.sum, s.type, d.type as delivery_type, p.type as payment_type, s.type as status, CASE WHEN o.delivery_address IS NOT NULL THEN o.delivery_address ELSE \'\' END AS delivery_address FROM orders o JOIN status s ON o.status_id = s.id JOIN dilivery_type d ON o.delivery_id = d.id JOIN payment_type p ON o.payment_id = p.id WHERE o.users_id = $1',[userId]);

        const orders = result.rows;
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/cart', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    try {
        const cartData = await pool.query('SELECT * FROM cart WHERE users_id = $1', [userId]);
        if (cartData.rows.length === 0) {
            return res.status(404).send({ message: 'Корзина пуста' });
        }
        const cartItems = cartData.rows[0].jewerly_id;

        const itemCounts = {};
        cartItems.forEach(productId => {
            if (itemCounts[productId]) {
                itemCounts[productId]++;
            } else {
                itemCounts[productId] = 1;
            }
        });

        const itemsWithCounts = [];
        for (const productId in itemCounts) {
            const productData = await pool.query(
                `SELECT w.id, w.name, s.name AS stone_name, w.carat, m.name AS metal_name, w.purity, w.price, w.percent, w.image_url 
                FROM ware w 
                JOIN stone s ON w.stone_id = s.id 
                JOIN metal m ON w.metal_id = m.id 
                WHERE w.id = $1`,
                [productId]
            );
            if (productData.rows.length > 0) {
                const product = productData.rows[0];
                const count = itemCounts[productId];
                itemsWithCounts.push({ ...product, count });
            }
        }

        res.status(200).send({ items: itemsWithCounts });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).send({ message: 'Проблема на стороне сервера' });
    }
});

app.post('/cart-edit', authenticateToken, async (req, res) => {
    const { productId, action } = req.body;
    const userId = req.user.userId;

    try {
        const cartCheck = await pool.query('SELECT * FROM cart WHERE users_id = $1', [userId]);

        if (cartCheck.rows.length === 0) {
            if (action === 'increase') {
                await pool.query('INSERT INTO cart (users_id, jewerly_id) VALUES ($1, $2)', [userId, [productId]]);
            } else {
                return res.status(400).send({ message: 'Корзина пуста, не удается уменьшить количество товара' });
            }
        } else {
            let existingJewerlyIds = cartCheck.rows[0].jewerly_id;

            if (action === 'increase') {
                existingJewerlyIds.push(productId);
            } else if (action === 'decrease') {
                const index = existingJewerlyIds.indexOf(productId);
                if (index !== -1) {
                    existingJewerlyIds.splice(index, 1); // удаляем только один элемент с данным productId
                } else {
                    return res.status(400).send({ message: 'Товар не найден в корзине' });
                }
            }

            await pool.query('UPDATE cart SET jewerly_id = $1 WHERE users_id = $2', [existingJewerlyIds, userId]);
        }

        res.status(200).send({ message: 'Корзина успешно обновлена' });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).send({ message: 'Проблема на стороне сервера' });
    }
});

app.get('/favorite', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    try {
        const favoriteItems = await pool.query(`
            SELECT 
                w.*, 
                f.jewerly_id,
                jt.name AS jewerly_type_name,
                sh.name AS shape_name,
                st.name AS stone_name,
                m.name AS metal_name
            FROM 
                favorite f
            JOIN 
                ware w ON f.jewerly_id = w.id
            LEFT JOIN 
                jewerly_type jt ON w.jewerly_type_id = jt.id
            LEFT JOIN 
                shape sh ON w.shape_id = sh.id
            LEFT JOIN 
                stone st ON w.stone_id = st.id
            LEFT JOIN 
                metal m ON w.metal_id = m.id
            WHERE 
                f.users_id = $1
        `, [userId]);
        res.status(200).json(favoriteItems.rows);
    } catch (error) {
        console.error('Error fetching favorite items:', error);
        res.status(500).send({ message: 'Проблема на стороне сервера' });
    }
});


app.post('/favorite/add/:favoriteId', authenticateToken, async (req, res) => {
    const favoriteId = req.params.favoriteId;
    const userId = req.user.userId;
    try {
        const checkQuery = 'SELECT * FROM favorite WHERE jewerly_id = $1 AND users_id = $2';
        const checkResult = await pool.query(checkQuery, [favoriteId, userId]);
        if (checkResult.rows.length > 0) {
            return res.status(400).send({ message: 'Товар уже добавлен в избранное' });
        }

        await pool.query('INSERT INTO favorite (jewerly_id, users_id) VALUES ($1, $2)', [favoriteId, userId]);
        res.status(200).send({ message: 'Товар успешно добавлен в избранное' });
    } catch (error) {
        console.error('Error adding item to favorite:', error);
        res.status(500).send({ message: 'Проблема на стороне сервера' });
    }
});

app.delete('/favorite/remove/:favoriteId', authenticateToken, async (req, res) => {

    const favoriteId = req.params.favoriteId;
    const userId = req.user.userId;
    try {
        await pool.query('DELETE FROM favorite WHERE jewerly_id = $1 AND users_id = $2', [favoriteId, userId]);
        res.status(200).send({ message: 'Товар успешно удален из избранного' });
    } catch (error) {
        console.error('Error removing item from favorite:', error);
        res.status(500).send({ message: 'Проблема на стороне сервера' });
    }
});

app.get('/ware', async (req, res) => {
    const { stone_name, metal_name, purity, carat, jewerly_type, sortByPrice } = req.query;

    let query = `
        SELECT w.id, w.name, s.name as stone_name, w.carat, m.name as metal_name, w.purity, w.price, w.percent, w.image_url, jt.name as jewerly_type 
        FROM ware w 
        JOIN jewerly_type jt ON w.jewerly_type_id = jt.id 
        JOIN stone s ON w.stone_id = s.id 
        JOIN metal m ON w.metal_id = m.id  
        JOIN provider p ON w.provider_id = p.id
        WHERE 1=1
    `;

    const queryParams = [];
    let paramIndex = 1;

    if (stone_name) {
        query += ` AND s.name = $${paramIndex++}`;
        queryParams.push(stone_name);
    }

    if (metal_name) {
        query += ` AND m.name = $${paramIndex++}`;
        queryParams.push(metal_name);
    }

    if (purity) {
        query += ` AND w.purity = $${paramIndex++}`;
        queryParams.push(purity);
    }

    if (carat) {
        query += ` AND w.carat = $${paramIndex++}`;
        queryParams.push(carat);
    }

    if (jewerly_type) {
        query += ` AND jt.name = $${paramIndex++}`;
        queryParams.push(jewerly_type);
    }

    if (sortByPrice) {
        query += ` ORDER BY w.price ${sortByPrice === 'asc' ? 'ASC' : 'DESC'}`;
    }

    try {

        const result = await pool.query(query, queryParams);
        const products = result.rows;
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/ware/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const productQuery = `
            SELECT 
                w.*, 
                m.name AS metal_name, 
                s.name AS stone_name, 
                p.name AS provider_name,
                sh.name AS shape_name,
                sColor.color AS stone_color,
                sClass.class AS stone_class
            FROM 
                ware w
            LEFT JOIN 
                metal m ON w.metal_id = m.id
            LEFT JOIN 
                stone s ON w.stone_id = s.id
            LEFT JOIN 
                stone_color sColor ON s.stone_color_id = sColor.id
            LEFT JOIN 
                stone_class sClass ON s.stone_class_id = sClass.id    
            LEFT JOIN 
                shape sh ON w.shape_id = sh.id    
            LEFT JOIN
                provider p ON w.provider_id = p.id
            WHERE 
                w.id = $1
        `;
        const productData = await pool.query(productQuery, [productId]);
        if (productData.rows.length === 0) {
            return res.status(404).send({ message: 'Товар не найден' });
        }
        const product = productData.rows[0];
        res.status(200).send(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send({ message: 'Проблема на стороне сервера' });
    }
});

app.get('/filter-options', async (req, res) => {
    try {
        const stoneResult = await pool.query('SELECT DISTINCT name FROM stone');
        const metalResult = await pool.query('SELECT DISTINCT name FROM metal');
        const purityResult = await pool.query('SELECT DISTINCT purity FROM ware');
        const caratResult = await pool.query('SELECT DISTINCT carat FROM ware');
        const jewelryTypeResult = await pool.query('SELECT DISTINCT name FROM jewerly_type');

        const filterOptions = {
            stones: stoneResult.rows.map(row => row.name),
            metals: metalResult.rows.map(row => row.name),
            purities: purityResult.rows.map(row => row.purity),
            carats: caratResult.rows.map(row => row.carat),
            jewelryTypes: jewelryTypeResult.rows.map(row => row.name),
        };
        res.json(filterOptions);
    } catch (error) {
        console.error('Error fetching filter options:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



app.post('/check-phone', async (req, res) => {
    const { phoneNumber } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE number = $1', [phoneNumber]);
        if (result.rows.length > 0) {
            res.status(400).send({ message: 'Номер телефона уже зарегистрирован' });
        } else {
            res.status(200).send({ message: 'Номер телефона доступен' });
        }
    } catch (error) {
        console.error('Error checking phone number:', error);
        res.status(500).send({ message: 'Проблема на стороне сервера' });
    }
});

app.post('/check-email', async (req, res) => {
    const { email } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            res.status(400).send({ message: 'Электронная почта уже зарегистрирована' });
        } else {
            res.status(200).send({ message: 'Электронная почта доступна' });
        }
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).send({ message: 'Проблема на стороне сервера' });
    }
});

app.post('/register', async (req, res) => {
    const {surname, name, secondname, phoneNumber, email, password } = req.body;
    try {
        await pool.query('INSERT INTO users ( surname, name, secondname, number, email, password) VALUES ($1, $2, $3, $4, $5, $6)', [ surname, name, secondname, phoneNumber, email, password]);
        res.status(201).send({ message: 'Успешная регистрация' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ message: 'Проблема на стороне сервера' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);

        if (result.rows.length === 0) {
            return res.status(401).send({ message: 'Неверный логин или пароль' });
        }

        const user = result.rows[0];
        const token = jwt.sign({ userId: user.users_id }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send({ message: 'Проблема на стороне сервера' });
    }
});

app.post('/reset-password', async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).send({ message: 'Пароли не совпадают' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(404).send({ message: 'Пользователь с такой почтой не найден' });
        }

        await pool.query('UPDATE users SET password = $1 WHERE email = $2', [newPassword, email]);

        res.status(200).send({ message: 'Пароль успешно изменён' });
    } catch (error) {
        res.status(500).send({ message: 'Проблема на стороне сервера' });
    }
});

app.get('/delivery-types', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, type FROM dilivery_type');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching delivery types:', error);
        res.status(500).send({ message: 'Server error' });
    }
});

app.get('/payment-types', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, type FROM payment_type');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching payment types:', error);
        res.status(500).send({ message: 'Server error' });
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
