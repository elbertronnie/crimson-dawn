window.onload = ()=>{

    fetch('/api/customer_orders', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ completed: false })
    })
    .then(res => {return res.json();})
    .then(data => {
        let orders = '';
        data.orders.forEach(ele => {
            let order = 
            `<div class="order ${ele.order_id}">
                <div class="date">
                    <div class="text">${new Date(ele.timestamp).toDateString()}</div>
                </div>
                <div class="food">
                    <div class="restName">
                        ${ele.food_item.restaurant.name}
                    </div>
                    <a style="text-decoration: none;" href="./ratingFood.html?food_item_id=${ele.food_item.food_item_id}"><food-card food-item-id="${ele.food_item.food_item_id}" count="${ele.quantity}"></food-card></a>
                </div>
            </div>`
            orders += order;
        });
        console.log(orders);
        document.getElementById('orders').innerHTML = orders;
    })
    .catch(err => console.log(err));

    

    document.getElementById('logout').addEventListener('click', ()=>{
        fetch('/logout', {method: 'POST'})
        .then(() => window.location.href = "/")
        .catch(err => console.log(err))
    });
}
