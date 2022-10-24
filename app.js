import dotenv from 'dotenv'
dotenv.config()

import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import pg from 'pg';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' })

// Connection details are specified through the .env file
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: process.env.EXPRESS_SESSION_SECRET,
}));

app.use(express.static("Auth"));
app.use(express.static("."));


async function hash(password) {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString("hex")

        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(salt + ":" + derivedKey.toString('hex'))
        });
    })
}

async function verify(password, hash) {
    return new Promise((resolve, reject) => {
        const [salt, key] = hash.split(":")
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(key == derivedKey.toString('hex'))
        });
    })
}


const restrict_customer = (req, res, next) => {
  if(req.session.customer_id){
    next();
  } else {
    res.redirect("/login.html");
  }
};

const restrict_restaurant = (req, res, next) => {
  if(req.session.restaurant_id){
    next();
  } else {
    res.redirect("/loginRes.html");
  }
};


app.post('/register', async (req, res) => {
    let { name, email, password, address } = req.body;

    let { rows } = await pool.query("SELECT 0 from customers WHERE email=$1", [email]); 
    if(rows.length != 0) {
        return res.send("You are already registered");
    }
    await pool.query(
        "INSERT INTO customers(name, email, password, address) VALUES($1, $2, $3, $4)", 
        [name, email, await hash(password), address]
    );

    res.redirect('/user/search.html');
});

app.post('/restaurant/register', async (req, res) => {
    let { store_name, email, password, store_address } = req.body;

    let { rows } = await pool.query("SELECT 0 from restaurants WHERE email=$1", [email]); 
    if(rows.length != 0) {
        return res.send("You are already registered");
    }
    await pool.query(
        "INSERT INTO restaurants(name, email, password, address) VALUES($1, $2, $3, $4)", 
        [store_name, email, await hash(password), store_address]
    );

    res.redirect('/');
});

app.post('/login', async (req, res) => {
    let { email, password, remember_me } = req.body;

    let { rows } = await pool.query("SELECT customer_id, password FROM customers WHERE email=$1", [email]);
    
    if(rows.length === 0) {
        return res.send("You have not registered yet");
    }

    if(!await verify(password, rows[0].password)) {
        return res.send("Email-Id or Password is incorrect");
    }

    req.session.regenerate(() => {
        req.session.customer_id = rows[0].customer_id;
        req.session.cookie.maxAge = remember_me ? 30*24*60*60*1000 : 6*60*60*1000;
        res.redirect('./user/search.html');
    });
});

app.post('/restaurant/login', async (req, res) => {
    let { email, password, remember_me } = req.body;

    let { rows } = await pool.query("SELECT restaurant_id, password FROM customers WHERE email=$1", [email]);
    
    if(rows.length === 0) {
        return res.send("You have not registered yet");
    }

    if(!await verify(password, rows[0].password)) {
        return res.send("Email-Id or Password is incorrect");
    }

    req.session.regenerate(() => {
        req.session.restaurant_id = rows[0].restaurant_id;
        req.session.cookie.maxAge = remember_me ? 30*24*60*60*1000 : 6*60*60*1000;
        res.redirect('./');
    });
});


app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});


app.get('/api/get_id', async (req, res) => {
    res.json({ customer_id: req.session.customer_id, restaurant_id: req.session.restaurant_id });
});

app.get('/api/customer_details', restrict_customer, async (req, res) => {

    let customer_result = await pool.query(
        `SELECT customer_id, name, email, address FROM customers WHERE customer_id=$1;`, 
        [req.session.customer_id]
    );
    let cart_result = await pool.query(
        `SELECT food_item_id, food_name, price, veg, serving, food_image_url, 
                restaurant_id, name, address, restaurant_image_url, quantity 
         FROM carts NATURAL JOIN food_items NATURAL JOIN restaurants WHERE customer_id=$1`,
        [req.session.customer_id]
    );

    let cart_rows = cart_result.rows.map(({food_item_id, food_name, price, veg, serving, food_image_url, restaurant_id, name, address, restaurant_image_url, quantity }) => {
        return {
            food_item_id, 
            food_name, 
            price, 
            veg, 
            serving, 
            food_image_url,
            quantity,
            restaurant: {
                restaurant_id, 
                name, 
                address, 
                restaurant_image_url
            }
        };
    });

    res.json({...customer_result.rows[0], cart: cart_rows});    
});

app.get('/api/restaurant_details', restrict_restaurant, async (req, res) => {
    let restaurant_result = await pool.query(
        `SELECT restaurant_id, name, email, address, restaurant_image_url 
         FROM restaurants where restaurant_id=$1`,
        [req.session.restaurant_id]
    );

    let tag_result = await pool.query(
        `SELECT tag_name FROM restaurant_tags NATURAL JOIN tags WHERE restaurant_id=$1`,
        [req.session.restaurant_id]
    );

    let tags = tag_result.rows.map(({tag_name}) => tag_name);

    res.json({...restaurant_result.rows[0], tags});
});

app.post('/api/edit_customer', restrict_customer, async (req, res) => {
    let { name, email, password, address, cart } = req.body;

    let password_hash = password ? await hash(password) : undefined;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        await client.query(
            `UPDATE customers SET 
                name = COALESCE($2, name),
                email = COALESCE($3, email), 
                password = COALESCE($4, password), 
                address = COALESCE($5, address)
             WHERE customer_id=$1`,
            [req.session.customer_id, name, email, password_hash, address]
        );

        if(cart){
            await client.query(`DELETE FROM carts WHERE customer_id=$1`, [req.session.customer_id]);
            cart.map(async ({food_item_id, quantity}) => {
                await client.query(
                    `INSERT INTO carts(customer_id, food_item_id, quantity) VALUES($1, $2, $3)`,
                    [req.session.customer_id, food_item_id, quantity]
                );
            });
            await Promise.all(cart);
        }

        await client.query("COMMIT");

        res.json({done: true});
    } catch(e) {
        await client.query("ROLLBACK");
        res.json({done: false});
    } finally {
        client.release();
    }
});

app.post('/api/add_food_item_cart', restrict_customer, async (req, res) => {
    let { food_item_id, quantity } = req.body;

    try {
        await pool.query(
            `INSERT INTO carts(customer_id, food_item_id, quantity) VALUES($1, $2, $3)`,
            [req.session.customer_id, food_item_id, quantity]
        );
        res.json({ done: true });
    } catch(e) {
        res.json({ done: false });
    }
});

app.post('/api/edit_food_item_cart', restrict_customer, async (req, res) => { 
    let { food_item_id, quantity } = req.body;

    try {
        await pool.query(
            `UPDATE carts SET 
                food_item_id = COALESCE($2, food_item_id),
                quantity = COALESCE($3, quantity)
             WHERE costumer_id=$1`,
            [req.session.customer_id, food_item_id, quantity]
        );
        res.json({ done: true });
    } catch(e) {
        res.json({ done: false });
    }
});

app.delete('/api/delete_food_item_cart', restrict_customer, async (req, res) => {
    let { food_item_id } = req.body;

    try {
        await pool.query(
            `DELETE FROM carts WHERE customer_id=$1 AND food_item_id=$2`,
            [req.session.customer_id, food_item_id]
        );
        res.json({ done: true });
    } catch(e) {
        res.json({ done: false });
    }
});

app.post('/api/edit_restaurant', restrict_restaurant, async (req, res) => {
    let { name, email, password, address, tags } = req.body;

    let password_hash = password ? await hash(password) : undefined;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        await client.query(
            `UPDATE restaurants SET
                name = COALESCE($2, name),
                email = COALESCE($3, email),
                password = COALESCE($4, password),
                address = COALESCE($5, address)
             WHERE restaurant_id=$1`,
            [req.session.restaurant_id, name, email, password_hash, address]
        );

        if(tags){
            await client.query(`DELETE FROM restaurant_tags WHERE restaurant_id=$1`, [req.session.restaurant_id]);
            tags.map(async ({tag_id}) => {
                await client.query(
                    `INSERT INTO restaurant_tags(restaurant_id, tag_id) VALUES($1, $2)`,
                    [req.session.restaurant_id, tag_id]
                );
            });
            await Promise.all(tags);
        }

        await client.query("COMMIT");

        res.json({done: true});
    } catch(e) {
        await client.query("ROLLBACK");
        res.json({done: false});
    } finally {
        client.release();
    }
});

app.post('/api/edit_food_item', restrict_restaurant, async (req, res) => {
    let { food_item_id, food_name, price, veg, serving } = req.body;

    try {
        await pool.query(
            `UPDATE food_items SET 
                food_name = COALESCE($3, food_name),
                price = COALESCE($4, price),
                veg = COALESCE($5, veg),
                serving = COALESCE($6, serving)
            WHERE restaurant_id=$1 AND food_item_id=$2`,
            [req.session.restaurant_id, food_item_id, food_name, price, veg, serving]
        );
        res.json({ done: true });
    } catch(e) {
        res.json({ done: false });
    }
});

app.post('/api/add_food_item', restrict_restaurant, async (req, res) => {
    let { food_name, price, veg, serving } = req.body;

    try {
        let result = await pool.query(
            `INSERT INTO food_items(restaurant_id, food_name, price, veg, serving)
             VALUES($1, $2, $3, $4, $5) RETURNING food_item_id`,
            [req.session.restaurant_id, food_name, price, veg, serving]
        );
        res.json({ 
            food_item_id: result.rows[0].food_item_id, 
            done: true, 
        });
    } catch(e) {
        res.json({ done: false });
    }
});

app.delete('/api/delete_food_item', restrict_restaurant, async (req, res) => {
    let { food_item_id } = req.body;

    try {
        await pool.query(
            `DELETE FROM food_items WHERE food_item_id=$2 AND restaurant_id=$1`,
            [req.session.restaurant_id, food_item_id]
        );
        res.json({ done: true });
    } catch(e) {
        res.json({ done: false });
    }
});

app.post('/api/food_item', async (req, res) => {
    let { food_item_id } = req.body;

    try {
        let food_item_result = await pool.query(
            `SELECT food_item_id, restaurant_id, food_name, price, veg, serving, food_image_url FROM food_items
             WHERE food_item_id=$1`,
            [food_item_id]
        );

        let restaurant_result = await pool.query(
            `SELECT restaurant_id, name, address, restaurant_image_url, 
             ARRAY_AGG(JSON_BUILD_OBJECT('tag_id', tag_id, 'tag_name', tag_name)) tags 
             FROM restaurant NATURAL JOIN restaurant_tags
             WHERE restaurant_id=$1
             GROUP BY restaurant_id, name, address, restaurant_image_url`,
            [food_item_result.rows[0].restaurant_id]
        );

        let rating_result = await pool.query(
            `SELECT AVG(rating) AS rating, COUNT(rating_food_id) AS num_reviews FROM rating_foods 
             WHERE food_item_id=$1`,
            [food_item_id]
        );

        let order_result = await pool.query(
            `SELECT SUM(quantity) as num_buys FROM orders WHERE food_item_id=$1`,
            [food_item_id]
        );

        res.json({
            ...food_item_result.rows[0],
            restaurant: {
                ...restaurant_result.rows[0]
            },
            ...rating_result.rows[0],
            ...order_result.rows[0],
        });
    } catch(e) {
        res.json({});
    }
});

app.post('/api/restaurant', async (req, res) => {
    let { restaurant_id } = req.body;

    try {
        let restaurant_result = await pool.query(
            `SELECT restaurant_id, name, address, restaurant_image_url, 
             COALESCE(ARRAY_AGG(JSON_BUILD_OBJECT('tag_id', tag_id, 'tag_name', tag_name))
                      FILTER (WHERE tag_id IS NOT NULL), '{}') AS tags 
             FROM restaurants NATURAL LEFT OUTER JOIN restaurant_tags NATURAL LEFT OUTER JOIN tag
             WHERE restaurant_id=$1
             GROUP BY restaurant_id, name, address, restaurant_image_url`,
            [restaurant_id]
        );

        let review_result = await pool.query(
            `SELECT AVG(rating) AS rating, 
             COALESCE(ARRAY_AGG(JSON_BUILD_OBJECT(
                'name', customers.name, 
                'rating', rating, 
                'review', review)) 
             FILTER (WHERE rating IS NOT NULL), '{}') AS reviews
             FROM restaurants NATURAL LEFT OUTER JOIN review_restaurants NATURAL LEFT OUTER JOIN customers
             WHERE restaurant_id=$1
             GROUP BY restaurant_id`,
            [restaurant_id]
        );
        let food_item_result = await pool.query(
            `SELECT ARRAY_AGG(JSON_BUILD_OBJECT(
                'food_item_id', food_item_id, 
                'food_name', food_name, 
                'price', price, 
                'veg', veg, 
                'serving', serving, 
                'food_image_url', food_image_url)) food_items
             FROM food_items
             WHERE restaurant_id=$1
             GROUP BY restaurant_id`,
            [restaurant_id]
        );
        
        res.json({
            ...restaurant_result.rows[0],
            ...review_result.rows[0],
            ...food_item_result.rows[0],
        });
    } catch(e) {
        res.json({});
    }
});

app.post('/api/restaurant_card', async (req, res) => {
    let { restaurant_id } = req.body;

    try {
        let restaurant_result = await pool.query(
            `SELECT restaurant_id, name, address, restaurant_image_url, 
            COALESCE(ARRAY_AGG(JSON_BUILD_OBJECT('tag_id', tag_id, 'tag_name', tag_name))
              FILTER (WHERE tag_id IS NOT NULL), '{}') AS tags 
             FROM restaurants NATURAL LEFT OUTER JOIN restaurant_tags NATURAL LEFT OUTER JOIN tag
             WHERE restaurant_id=$1
             GROUP BY restaurant_id, name, address, restaurant_image_url`,
            [restaurant_id]
        );

        let review_result = await pool.query(
            `SELECT AVG(rating) AS rating, COUNT(rating) as num_reviews
             FROM restaurants NATURAL LEFT OUTER JOIN review_restaurants
             WHERE restaurant_id=$1
             GROUP BY restaurant_id`,
            [restaurant_id]
        );

        let order_result = await pool.query(
            `SELECT SUM(quantity) as num_buys FROM orders NATURAL JOIN food_items WHERE restaurant_id=$1`,
            [restaurant_id]
        );

        res.json({
            ...restaurant_result.rows[0],
            ...review_result.rows[0],
            ...order_result.rows[0], 
        });
    } catch(e) {
        res.json({});
    }
});

app.post('/api/restaurant_orders', restrict_restaurant, async (req, res) => {
    let result = await pool.query(
        `SELECT ARRAY_AGG(JSON_BUILD_OBJECT(
            'order_id', order_id,
            'customer', JSON_BUILD_OBJECT(
                'customer_id', customer_id,
                'name', name),
            'food_item', JSON_BUILD_OBJECT(
                'food_item_id', food_item_id,
                'food_name', food_name,
                'price', price,
                'veg', veg,
                'serving', serving,
                'food_image_url', food_image_url),
            'quantity', quantity,
            'timestamp', timestamp,
            'delivery_location', delivery_location)) orders 
         FROM orders NATURAL JOIN customers NATURAL JOIN food_items
         WHERE restaurant_id=$1 AND completed=$2
         GROUP BY restaurant_id`,
        [req.session.restaurant_id, req.body.completed]
    );

    res.json(result.rows[0]);
});

app.post('/api/restaurant_order_complete', restrict_restaurant, async (req, res) => {
    try{
        await pool.query(
            `UPDATE orders SET
                completed = TRUE
             WHERE order_id=$2 AND restaurant_id=$1`,
            [req.session.restaurant_id, req.body.order_id]
        );

        res.json({ done: true });
    } catch(e){
        res.json({ done: false });
    }
});

app.post('/api/tags', async (_, res) => {
    let tags_result = await pool.query(`SELECT tag_id, tag_name FROM tag`);

    res.json({ tags: tags_result.rows });
});

app.post('api/add_tag', async (req, res) => {
    try {
        let tag_result = pool.query(
            `INSERT INTO tag(tag_name) VALUES($1) RETURNING tag_id`,
            [req.body.name]
        );

        res.json({
            tag_id: tag_result.rows[0].tag_id,
            done: true,
        });
    } catch(e){
        res.json({ done: false });
    }
});

app.post('/api/upload_restaurant_image', restrict_restaurant, upload.single('image'), async (req, res) => {
    await pool.query(
        `UPDATE restaurants SET
            restaurant_image_url = $2
         WHERE restaurant_id=$1`,
        [req.session.restaurant_id, `/uploads/${req.file.filename}`]
    );

    res.end();
});

app.post('/api/upload_food_image', restrict_restaurant, upload.single('image'), async (req, res) => {
    await pool.query(
        `UPDATE food_items SET
            food_image_url = $3
         WHERE food_item_id=$2 AND restaurant_id=$1`,
        [req.session.restaurant_id, req.body.id, `/uploads/${req.file.filename}`]
    );

    res.end();
});

app.post('/api/place_order', restrict_customer, async (req, res) => {
    try{
        await pool.query(
            `WITH deleted AS (DELETE FROM cart WHERE customer_id=$1 
                              RETURNING food_item_id, customer_id, quantity)
             INSERT INTO orders(food_item_id, customer_id, quantity, timestamp, delivery_location, completed)
             SELECT food_item_id, customer_id, quantity, 
                    $2 AS timestamp, $3 AS delivery_location, FALSE as completed`,
            [req.session.customer_id, new Date(), req.body.delivery_location]
        ); 

        res.json({ done: true });
    } catch(e){
        res.json({ done: false });
    }
});

app.post('/api/add_rating', restrict_customer, async (req, res) => {
    let { food_item_id, rating } = req.body;

    try {
        await pool.query(
            `INSERT INTO rating_foods(customer_id, rating, food_item_id) 
             VALUES($1, $2, $3)`,
            [req.session.customer_id, rating, food_item_id]
        );

        res.json({ done: true });
    } catch(e){
        res.json({ done: false });
    }
});

app.post('/api/add_review', restrict_customer, async (req, res) => {
    let { restaurant_id, rating, review } = req.body;

    try {
        await pool.query(
            `INSERT INTO review_restaurants(customer_id, rating, review, restaurant_id) 
             VALUES($1, $2, $3, $4)`,
            [req.session.customer_id, rating, review, restaurant_id]
        );

        res.json({ done: true });
    } catch(e){
        res.json({ done: false });
    }
});

app.post('/api/customer_orders', restrict_customer, async (req, res) => {
    let result = await pool.query(
        `SELECT ARRAY_AGG(JSON_BUILD_OBJECT(
            'order_id', order_id,
            'food_item', JSON_BUILD_OBJECT(
                'food_item_id', food_item_id,
                'food_name', food_name,
                'price', price,
                'veg', veg,
                'serving', serving,
                'food_image_url', food_image_url,
                'restaurant', JSON_BUILD_OBJECT(
                    'restaurant_id', restaurant_id,
                    'name', restaurants.name,
                    'address', restaurants.address,
                    'restaurant_image_url', restaurant_image_url)),
            'quantity', quantity,
            'timestamp', timestamp,
            'delivery_location', delivery_location)) orders 
         FROM orders NATURAL JOIN food_items NATURAL JOIN restaurants
         WHERE customer_id=$1 AND completed=$2
         GROUP BY customer_id`,
        [req.session.customer_id, req.body.completed]
    );

    res.json(result.rows[0]);
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
