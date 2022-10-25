document.onload = ()=>{
    let edit = document.getElementById('edit');
    let save = document.getElementById('save');
    if(document.location.href === 'http://127.0.0.1:3000/Restaurant/foodItem.html'){
        console.log("It's add");
        save.disabled = false;
        edit.disabled = true;

        edit.addEventListener('click', ()=>{
            document.getElementById('name').disabled = false;
            document.getElementById('price').disabled = false;
            document.getElementById('veg').disabled = false;
            document.getElementById('serving').disabled = false;

            edit.disabled = true;
            save.disabled = false;
        })

        save.addEventListener('click', ()=>{
            document.getElementById('name').disabled = true;
            let name = document.getElementById('name').value;
            document.getElementById('price').disabled = true;
            let price = document.getElementById('price').value;
            document.getElementById('veg').disabled = true;
            let veg = document.getElementById('veg').value;
            document.getElementById('serving').disabled = true;
            let serving = document.getElementById('serving').value;

            edit.disabled = false;
            save.disabled = true;

            let data = {
                'food_name': name,
                'price': price,
                'veg': veg,
                'serving': serving
            }
            console.log(data);
            fetch('/api/add_food_item', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(data)})
            .then((res)=>{
                console.log(res.json());
            })
            .catch(err=> console.log(err))
        })
    }
    else{
        console.log("It's edit");
        save.disabled = true;
        edit.disabled = false;

        let food_item_id = Number((new URL(document.location)).searchParams.get('food_item_id'));

        fetch('/api/food_item', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'food_item_id': food_item_id})})
        .then(res => console.log(res.json()))
        .then(data => {
            console.log(data);

            document.getElementById('name').value = data.food_name;
            document.getElementById('price').value = data.price;
            document.getElementById('veg').value = data.veg;
            document.getElementById('serving').value = data.serving;
            document.getElementById('dish-img').style.backgroundImage.url = data.food_image_url;
        })
        .catch(err => console.log(err))

        edit.addEventListener('click', ()=>{
            document.getElementById('name').disabled = false;
            document.getElementById('price').disabled = false;
            document.getElementById('veg').disabled = false;
            document.getElementById('serving').disabled = false;

            edit.disabled = true;
            save.disabled = false;
        })

        save.addEventListener('click', ()=>{
            document.getElementById('name').disabled = true;
            let name = document.getElementById('name').value;
            document.getElementById('price').disabled = true;
            let price = document.getElementById('price').value;
            document.getElementById('veg').disabled = true;
            let veg = document.getElementById('veg').value;
            document.getElementById('serving').disabled = true;
            let serving = document.getElementById('serving').value;

            edit.disabled = false;
            save.disabled = true;

            let data = {
                'food_item_id': food_item_id,
                'food_name': name,
                'price': price,
                'veg': veg,
                'serving': serving
            }

            fetch('/api/edit_food_item', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(data)})
            .then((res)=>{
                console.log(res.json());
            })
            .catch(err=> console.log(err))
        })
    }
}