customElements.define('food-button',
    class extends HTMLElement {
        constructor() {
            super();
        }
        
        zero(){
            return `<div class="button" id="add">Add</div>`;
        }
        
        more(){
            return `<div class="plus-circle" id="plus">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.00004 5.33333V10.6667M5.33337 8H10.6667M14.6667 8C14.6667 11.6819 11.6819 14.6667 8.00004 14.6667C4.31814 14.6667 1.33337 11.6819 1.33337 8C1.33337 4.3181 4.31814 1.33333 8.00004 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z" stroke="#5538EE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="text">${this.count}</div>
                    <div class="minus-circle" id="minus">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.33337 8H10.6667M14.6667 8C14.6667 11.6819 11.6819 14.6667 8.00004 14.6667C4.31814 14.6667 1.33337 11.6819 1.33337 8C1.33337 4.3181 4.31814 1.33333 8.00004 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z" stroke="#5538EE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
`;
        }
        
        render(){
            this.shadowRoot.innerHTML = `
<style>
    :host{
        /* Button */


        /* Auto layout */

        display: flex;
        flex-direction: column;
        justify-content: ${this.count == 0 ? 'center' : 'space-between'};
        align-items: center;
        padding: 16px;

        width: calc(64px - 2*16px);

        /* Primary/Lighter */

        background: #C6C4FF;

        /* Inside auto layout */

        flex: none;
        order: 2;
        align-self: stretch;
        flex-grow: 0;
    }

    .button{
        /* Add */

        /* Regular/Normal/Medium */

        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        /* identical to box height, or 150% */


        /* Primary/Dark */

        color: #5538EE;


        /* Inside auto layout */

        flex: none;
        order: 0;
        flex-grow: 0;
    }

    .plus-circle{
        /* plus-circle */


        width: 16px;
        height: 16px;


        /* Inside auto layout */

        flex: none;
        order: 0;
        flex-grow: 0;
    }

    .text{
        /* 2 */


        width: 10px;
        height: 24px;

        /* Regular/Normal/Medium */

        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        /* identical to box height, or 150% */


        /* Primary/Dark */

        color: #5538EE;


        /* Inside auto layout */

        flex: none;
        order: 1;
        flex-grow: 0;
    }

    .minus-circle{
        /* minus-circle */


        width: 16px;
        height: 16px;


        /* Inside auto layout */

        flex: none;
        order: 2;
        flex-grow: 0;
    }

</style>
    
${this.count == 0 ? this.zero() : this.more()}
`;
            setTimeout(() => {
                [['add', 'increment'], ['plus', 'increment'], ['minus', 'decrement']]
                    .map(([id, event]) => [this.shadowRoot.getElementById(id), event])
                    .filter(([el, _]) => el !== null)
                    .forEach(([el, event]) => {
                        el.addEventListener('click', () => {
                            this.dispatchEvent(new CustomEvent(event, {
                                bubbles: true,
                                composed: true,
                            }));
                        });
                    });
            }, 0);
        }
        
        connectedCallback(){
            const shadowRoot = this.attachShadow({mode: 'open'});
            this.render();
            this.rendered = true;
        }
        
        static get observedAttributes() { 
            return ['count']; 
        }
        
        attributeChangedCallback(name, oldValue, newValue) {
            if(!this.rendered) return;
            
            if(name === "count" && oldValue !== newValue){
                this.render();
            }
        }
        
        get count(){
            return this.getAttribute("count");
        }
        
        set count(value){
            this.setAttribute("count", value);
        }
    }
);
