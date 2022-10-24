customElements.define('restaurant-card',
    class extends HTMLElement {
        constructor() {
            super();
        }
        
        render(){
            this.shadowRoot.innerHTML = `
<style>
    .restaurant-card{
        /* Restaurant Card */

        overflow: hidden;

        /* Auto layout */

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0px;

        position: relative;
        width: 320px;
        height: 360px;

        /* Sky/Lighter */

        background: #F2F4F5;
        /* Shadow/Medium */

        box-shadow: 0px 0px 1px rgba(20, 20, 20, 0.08), 0px 1px 8px 2px rgba(20, 20, 20, 0.08);
        border-radius: 16px;
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
        margin: -32px 0px;
    }

    .info{
        /* Info */


        /* Auto layout */

        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0px;

        /* Inside auto layout */

        flex: none;
        order: 1;
        align-self: stretch;
        flex-grow: 0;
    }

    .top{
        /* Top */


        /* Auto layout */

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0px 8px;

        height: 32px;

        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(4px);
        /* Note: backdrop-filter has minimal browser support */


        /* Inside auto layout */

        flex: none;
        order: 0;
        align-self: stretch;
        flex-grow: 0;
    }

    .bottom{
        /* Bottom */


        /* Auto layout */

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 16px;
        gap: 4px;

        /* Inside auto layout */

        flex: none;
        order: 1;
        align-self: stretch;
        flex-grow: 0;
    }

    .heading{
        /* Heading */


        /* Auto layout */

        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 0px;
        gap: 8px;

        /* Inside auto layout */

        flex: none;
        order: 0;
        align-self: stretch;
        flex-grow: 0;
    }

    .title{
        /* Chawla Chicken */

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

    .address{
        /* Address, Gwalior, India - 474015 */

        /* Regular/Normal/Medium */

        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        /* identical to box height, or 150% */

        display: flex;
        align-items: center;

        color: #000000;


        /* Inside auto layout */

        flex: none;
        order: 1;
        align-self: stretch;
        flex-grow: 0;
    }
</style>


<div class="restaurant-card">
    <div class="image" id="image"></div>
    <div class="info">
        <div class="top">
            <rating-pill rating="${this.rating}" id="rating"></rating-pill>
            <review-pill review="${this.review}" id="review"></review-pill>
            <bought-pill buys="${this.buys}" id="buys"></bought-pill>
        </div>
        <div class="bottom">
            <div class="heading">
                <div class="title" id="title">${this.title}</div>
                <food-type-icon type="${this.type}" id="type"></food-type-icon>
            </div>
            <div class="address" id="address">${this.address}</div>
        </div>
    </div>
</div>
`;        
        }
        
        connectedCallback(){
            const shadowRoot = this.attachShadow({mode: 'open'});
            this.render();
            this.rendered = true;

            setTimeout(async () => {
                if(!this.restaurant_id) return;
                let data = await (await fetch('/api/restaurant_card', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ restaurant_id: this.restaurant_id })
                })).json();
                this.image = data.restaurant_image_url;
                this.title = data.name;
                this.rating = data.rating;
                this.review = data.num_review;
                this.buys = data.num_buys;
                this.type = data.veg ? 'veg' : 'non-veg';
                this.address = data.address;
            }, 0);
        }
        
        static get observedAttributes() { 
            return ['restaurant-id', 'image', 'title', 'rating', 'review', 'buys', 'type', 'address']; 
        }
        
        attributeChangedCallback(name, oldValue, newValue) {
            if(!this.rendered) return;
            
            if(name === "image" && oldValue !== newValue){
                this.shadowRoot.getElementById('image').style.backgroundImage = `url(${newValue})`;
            } else if(name === "title" && oldValue !== newValue){
                this.shadowRoot.getElementById('title').textContent = newValue;
            } else if(name === "rating" && oldValue !== newValue){
                this.shadowRoot.getElementById('rating').rating = newValue;
            } else if(name === "review" && oldValue !== newValue){
                this.shadowRoot.getElementById('review').review = newValue;
            } else if(name === "buys" && oldValue !== newValue){
                this.shadowRoot.getElementById('buys').buys = newValue;
            } else if(name === "type" && oldValue !== newValue){
                this.shadowRoot.getElementById('type').type = newValue;
            } else if(name === "address" && oldValue !== newValue){
                this.shadowRoot.getElementById('address').textContent = newValue;
            }
        }
        
        get restaurant_id(){
            return this.getAttribute("restaurant-id");
        }
        
        set restaurant_id(value){
            this.setAttribute("restaurant-id", value);
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
        
        get buys(){
            return this.getAttribute("buys");
        }
        
        set buys(value){
            this.setAttribute("buys", value);
        }
        
        get type(){
            return this.getAttribute("type");
        }
        
        set type(value){
            this.setAttribute("type", value);
        }
        
        get address(){
            return this.getAttribute("address");
        }
        
        set address(value){
            this.setAttribute("address", value);
        }
    }
);
