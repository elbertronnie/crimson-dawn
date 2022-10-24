import dotenv from 'dotenv'
dotenv.config()

import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import pg from 'pg';

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

    res.redirect('/');
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
        res.redirect('/');
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
        res.redirect('/');
    });
});


app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});


app.get('/api/customer_details', restrict_customer, async (req, res) => {

    let customer_result = await pool.query(
        `SELECT customer_id, name, email, address FROM customers WHERE customer_id=$1;`, 
        [req.session.customer_id]
    );
    let cart_result = await pool.query(
        `SELECT food_item_id, food_name, price, veg, serving, food_image_url, restaurant_id, name, address, restaurant_image_url, quantity 
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

app.get('/api/edit_customer', restrict_customer, async (req, res) => {
    let { name, email, password, address, cart } = req.body;

    let password_hash = password ? await hash(password) : undefined;

    const client = pool.connect();

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

    const client = pool.connect();

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
        await pool.query(
            `INSERT INTO food_items(restaurant_id, food_name, price, veg, serving)
             VALUES($1, $2, $3, $4, $5)`,
            [req.session.restaurant_id, food_name, price, veg, serving]
        );
        res.json({ done: true });
    } catch(e) {
        res.json({ done: false });
    }
});



app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
