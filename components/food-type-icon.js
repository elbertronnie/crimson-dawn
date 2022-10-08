customElements.define('food-type-icon',
    class extends HTMLElement {
        constructor() {
            super();
        }
        
        render(){
            this.shadowRoot.innerHTML = `
    <style>
    .food-type{
        /* Food Type */


        box-sizing: border-box;

        position: relative;
        width: 24px;
        height: 24px;

        /* Red/Darkest */

        border: 2px solid ${this.color};

        /* Inside auto layout */

        flex: none;
        order: 1;
        flex-grow: 0;
    }
    
    .food-type-icon{
        /* circle */


        position: absolute;
        width: 14px;
        height: 14px;
        left: 3px;
        top: 3px;
    }

    </style>

    <div class="food-type" id="food-type">
        <div class="food-type-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path id="path" d="M1 7C1 3.68629 3.68629 1 7 1C10.3137 1 13 3.68629 13 7C13 10.3137 10.3137 13 7 13C3.68629 13 1 10.3137 1 7Z" fill="${this.color}" stroke="${this.color}" stroke-width="1.5"/>
            </svg>
        </div>
    </div>
`;        
        }
        
        connectedCallback(){
            const shadowRoot = this.attachShadow({mode: 'open'});
            this.render();
            this.rendered = true;
        }
        
        static get observedAttributes() { 
            return ['type']; 
        }
        
        get color(){
            return this.type === 'veg'      ? '#198155' :
                   this.type === 'non-veg'  ? '#D3180C' : '';
        }
        
        attributeChangedCallback(name, oldValue, newValue) {
            if(!this.rendered) return;
            
            if(name === "type" && oldValue !== newValue){
                this.render();
            }
        }
        
        get type(){
            return this.getAttribute("type");
        }
        
        set type(value){
            this.setAttribute("type", value);
        }
    }
);
