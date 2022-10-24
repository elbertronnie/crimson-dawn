customElements.define('food-card',
    class extends HTMLElement {
        constructor() {
            super();
        }
        
        render(){
            this.shadowRoot.innerHTML = `
<style>

    :host{
        align-self: stretch;
    }
    .food-card{
        /* Count=Zero */


        /* Auto layout */

        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0px;

        width: 100%;
        /*height: 120px;*/

        /* Sky/Lighter */

        background: #F2F4F5;
        /* Shadow/Medium */

        box-shadow: 0px 0px 1px rgba(20, 20, 20, 0.08), 0px 1px 8px 2px rgba(20, 20, 20, 0.08);
        border-radius: 16px;
        
        overflow: hidden

    
    }
    
    .food-card-image{
        /* Image */


        /* Auto layout */

        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 0px;

        width: 120px;


        /* Inside auto layout */

        flex: none;
        order: 0;
        align-self: stretch;
        flex-grow: 0;
    }
    
    .image{
        /* chad-montano-MqT0asuoIcU-unsplash 2 */
        
        background: url(${this.image});
        background-position: center;
        background-size: cover;

        /* Inside auto layout */

        flex: none;
        order: 0;
        align-self: stretch;
        flex-grow: 1;
    }
    
    .food-card-side-bar{
        /* Side Bar */


        /* Auto layout */

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 8px;
        gap: 4px;
        

        /* Inside auto layout */

        flex: none;
        order: 1;
        align-self: stretch;
        flex-grow: 1;
    }
    
    .food-card-bottom-row{
        /* Bottom Row */


        /* Auto layout */

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        padding: 0px;


        /* Inside auto layout */

        flex: none;
        order: 1;
        align-self: stretch;
        flex-grow: 0;
    }
    
    .food-card-top-row{
        /* Top Row */


        /* Auto layout */

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0px 8px;
        gap: 4px;


        /* Inside auto layout */

        flex: none;
        order: 0;
        align-self: stretch;
        flex-grow: 1;
    }
    
    .food-card-title{
        /* Title */


        /* Auto layout */

        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 0px;


        /* Inside auto layout */

        flex: none;
        order: 0;
        align-self: stretch;
        flex-grow: 0;
    }
    
    .food-card-price{
        /* ₹1000 */


        /* Large/Normal/Medium */

        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 24px;
        /* or 133% */


        color: #000000;


        /* Inside auto layout */

        flex: none;
        order: 1;
        align-self: stretch;
        flex-grow: 1;
    }
    
    .food-card-food-name{
        /* Chicken Biryani */


        /* Large/Normal/Bold */

        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-size: 18px;
        line-height: 24px;
        /* identical to box height, or 133% */

        display: flex;
        align-items: center;

        color: #000000;


        /* Inside auto layout */

        flex: none;
        order: 0;
        flex-grow: 1;
    }
</style>


<div class="food-card">
    <div class="food-card-image">
        <div class="image" id="image"></div>
    </div>
    <div class="food-card-side-bar">
        <div class="food-card-top-row">
            <div class="food-card-title">
                <div class="food-card-food-name" id="title">${this.title}</div>
                <food-type-icon type="${this.type}" id="type"></food-type-icon>
            </div>
            <div class="food-card-price" id="price">${this.price}</div>
        </div>
        <div class="food-card-bottom-row">
            <rating-pill rating="${this.rating}" id="rating"></rating-pill>
            <review-pill review="${this.review}" id="review"></review-pill>
            <serving-pill serving="${this.serving}" id="serving"></serving-pill>
        </div>
    </div>

    <food-button count=${this.count} id="count" edit="${this.edit}"></food-button>

</div>
`;        
        }
        
        connectedCallback(){
            const shadowRoot = this.attachShadow({mode: 'open'});
            this.render();
            this.rendered = true;

            setTimeout(async () => {
                if(!this.food_item_id) return;
                let data = await (await fetch('/api/food_item', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ food_item_id: this.food_item_id })
                })).json();
                this.title = data.food_name;
                this.price = data.price;
                this.image = data.food_image_url;
                this.type = data.veg ? 'veg' : 'non-veg';
                this.rating = data.rating;
                this.review = data.num_reviews;
                this.serving = data.serving;
                if(!this.count) this.count = 0;
            }, 0);

            setTimeout(async () => {
                const count = shadowRoot.getElementById("count");
                count.addEventListener('increment', async () => {
                    const url = this.count ? '/api/edit_food_item_cart' : '/api/add_food_item_cart';
                    const data = await (await fetch(url, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            food_item_id: this.food_item_id,
                            quantity: this.count+1,
                        }),
                    })).json();
                    if(data.done) this.count++;
                });
                count.addEventListener('decrement', async () => {
                    const url = this.count-1 ? '/api/edit_food_item_cart' : '/api/delete_food_item_cart';
                    const data = await (await fetch(url, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            food_item_id: this.food_item_id,
                            quantity: this.count-1,
                        }),
                    })).json();
                    if(data.done) this.count--;
                });
            }, 0);
        }
        
        static get observedAttributes() { 
            return ['food-item-id', 'image', 'title', 'price', 'rating', 'review', 'serving', 'type', 'count', 'edit']; 
        }
        
        attributeChangedCallback(name, oldValue, newValue) {
            if(!this.rendered) return;
            
            if(name === "image" && oldValue !== newValue){
                this.shadowRoot.getElementById('image').style.backgroundImage = `url(${newValue})`;
            } else if(name === "title" && oldValue !== newValue){
                this.shadowRoot.getElementById('title').textContent = newValue;
            } else if(name === "price" && oldValue !== newValue){
                this.shadowRoot.getElementById('price').textContent = newValue;
            } else if(name === "rating" && oldValue !== newValue){
                const rating = this.shadowRoot.getElementById('rating');
                rating.rating = newValue;
                rating.style.visibility = newValue == null ? 'hidden' : 'visible';
            } else if(name === "review" && oldValue !== newValue){
                const review = this.shadowRoot.getElementById('review');
                review.review = newValue;
                review.style.visibility = newValue == null ? 'hidden' : 'visible';
            } else if(name === "serving" && oldValue !== newValue){
                this.shadowRoot.getElementById('serving').serving = newValue;
            } else if(name === "type" && oldValue !== newValue){
                this.shadowRoot.getElementById('type').type = newValue;
            } else if(name === "count" && oldValue !== newValue){
                this.shadowRoot.getElementById('count').count = newValue;
            } else if(name === "edit" && oldValue !== newValue){
                this.shadowRoot.getElementById('count').edit = newValue;
            } 
        }

        get food_item_id(){
            return this.getAttribute("food-item-id");
        }

        set food_item_id(value){
            this.setAttribute("food-item-id", value);
        }
        
        get image(){
            return this.getAttribute("image");
        }
        
        set image(value){
            this.setAttribute("image", value);
        }
        
        get title(){
            return this.getAttribute("title");
        }
        
        set title(value){
            this.setAttribute("title", value);
        }
        
        get price(){
            return this.getAttribute("price");
        }
        
        set price(value){
            this.setAttribute("price", value);
        }
        
        get rating(){
            return this.getAttribute("rating");
        }
        
        set rating(value){
            this.setAttribute("rating", value);
        }
        
        get review(){
            return this.getAttribute("review");
        }
        
        set review(value){
            this.setAttribute("review", value);
        }
        
        get serving(){
            return this.getAttribute("serving");
        }
        
        set serving(value){
            this.setAttribute("serving", value);

        }
        
        get type(){
            return this.getAttribute("type");
        }
        
        set type(value){
            this.setAttribute("type", value);
        }
        
        get count(){
            return this.getAttribute("count");
        }
        
        set count(value){
            this.setAttribute("count", value);
        }

        get edit(){
            return this.getAttribute("edit");
        }
        
        set edit(value){
            this.setAttribute("edit", value);
        }
    }
);
