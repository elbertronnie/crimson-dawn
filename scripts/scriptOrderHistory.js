window.onload = ()=>{

    fetch('/api/customer_orders', {method: 'POST'})
    .then(res => {return res.json();})
    .then(data => {
        let iter = -1;
        data.orders.forEach(ele => {
            let type = (ele.food_item.veg == true) ? "veg" : "non-veg";
            let order = 
            `<div class="order ${ele.order_id}">
                <div class="date">
                    <div class="text">${ele.timestamp}</div>
                </div>
                <div class="food">
                    <div class="restName">
                        ${ele.food_item.restaurant.name}
                    </div>
                    <a id="${'rate'+ (++iter)}"><food-card id="${ele.food_item.food_item_id}" image="${ele.food_item.food_image_url}" title="${ele.food_item.food_name}" type=${type} price="${ele.food_item.price}" serving="${ele.food_item.serving}" count="${ele.quantity}"></food-card></a>
                </div>
            </div>`
            document.getElementById(`'rate'+${iter}`).href = `./ratingFood.html?food_item_id=${ele.food_item.food_item_id}`;
        });
    })
    .catch(err => console.log(err))

    

    document.getElementById('logout').addEventListener('click', ()=>{
        fetch('/logout', {method: 'POST'})
        .then(res => console.log(res.json()))
        .catch(err => console.log(err))
    })
}