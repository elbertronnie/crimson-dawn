customElements.define('food-type-chooser',
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({mode: 'open'});
            this.render();
            this.rendered = true;
        }
        
        render(){
            this.shadowRoot.innerHTML = `
    <style>
    .food-type-chooser{
        /* Type=Both */


        /* Auto layout */
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 0px;

        position: absolute;
        width: 228px;
        height: 32px;
        left: 20px;
        top: 20px;
    }

    .food-type-button{
        box-sizing: border-box;

        /* Auto layout */

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 8px 16px;

        /* Primary/Base */

        border: 1px solid #6B4EFF;

        /* Inside auto layout */

        flex: none;
        flex-grow: 0;
    }

    .both{
       border-radius: 48px 0px 0px 48px;
    }

    .non-veg{
        border-radius: 0px 48px 48px 0px;
    }

    .selected{
        /* Primary/Base */
        background: #6B4EFF;
    }

    .text{
        /* Text */

        /* Regular/None/Medium */

        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 16px;
        /* identical to box height, or 100% */

        text-align: center;

        /* Primary/Base */

        color: #6B4EFF;


        /* Inside auto layout */

        flex: none;
    }

    .selected > .text{
        /* Sky/White */
        color: #FFFFFF;
    }
    </style>

    <div class="food-type-chooser">
        <div class="food-type-button both" id="both">
            <div class="text">Both</div>
        </div>
        <div class="food-type-button veg" id="veg">
            <div class="text">Veg</div>
        </div>
        <div class="food-type-button non-veg" id="non-veg">
            <div class="text">Non-Veg</div>
        </div>
    </div>
`;        
        }
        
        connectedCallback(){
            ["both", "veg", "non-veg"]
                .forEach((id) => {
                    this.shadowRoot.getElementById(id).addEventListener('click', () => {
                        this.dispatchEvent(new CustomEvent('change', {
                            bubbles: true,
                            composed: true,
                            detail: id
                        }));
                    });
                });
        }
        
        static get observedAttributes() { 
            return ['type']; 
        }
        
        attributeChangedCallback(name, oldValue, newValue) {
            if(!this.rendered) return;
            
            if(name === "type" && oldValue !== newValue){
                this.shadowRoot.getElementById("both").classList.remove("selected");
                this.shadowRoot.getElementById("veg").classList.remove("selected");
                this.shadowRoot.getElementById("non-veg").classList.remove("selected");
                this.shadowRoot.getElementById(newValue).classList.add("selected");
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
