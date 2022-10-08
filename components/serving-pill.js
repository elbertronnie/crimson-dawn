customElements.define('serving-pill',
    class extends HTMLElement {
        constructor() {
            super();
        }
        
        connectedCallback(){
            const shadowRoot = this.attachShadow({mode: 'open'});
            this.shadowRoot.innerHTML = `
    <style>
        .pill{
            /* Serving Pill */


            /* Auto layout */

            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 4px 8px;
            gap: 2px;

            position: relative;
            height: calc(24px - 2*4px);

            border-radius: 32px;
        }

        .pill-icon{
            height: 16px;
            width: 16px;
        }

        .pill-text{
            /* 4.0 */

            height: 14px;

            /* Regular/None/Regular */

            font-family: 'Inter';
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 16px;
            /* identical to box height, or 100% */


            /* Primary/Base */

            color: #6B4EFF;


            /* Inside auto layout */

            flex: none;
            order: 0;
            flex-grow: 0;
        }
    </style>

    <div class="pill">
        <div class="pill-text" id="text">${this.serving}</div>
        <div class="pill-icon">
            <svg slot="icon" width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.3333 13V11.6667C11.3333 10.9594 11.0524 10.2811 10.5523 9.78105C10.0522 9.28095 9.3739 9 8.66666 9H3.33332C2.62608 9 1.9478 9.28095 1.44771 9.78105C0.947608 10.2811 0.666656 10.9594 0.666656 11.6667V13M15.3333 13V11.6667C15.3329 11.0758 15.1362 10.5018 14.7742 10.0349C14.4122 9.56791 13.9054 9.23438 13.3333 9.08667M10.6667 1.08667C11.2403 1.23353 11.7487 1.56713 12.1117 2.03487C12.4748 2.50261 12.6719 3.07789 12.6719 3.67C12.6719 4.26211 12.4748 4.83739 12.1117 5.30513C11.7487 5.77287 11.2403 6.10647 10.6667 6.25333M8.66666 3.66667C8.66666 5.13943 7.47275 6.33333 5.99999 6.33333C4.52723 6.33333 3.33332 5.13943 3.33332 3.66667C3.33332 2.19391 4.52723 1 5.99999 1C7.47275 1 8.66666 2.19391 8.66666 3.66667Z" stroke="#6B4EFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    </div>
`;
            this.rendered = true;
        }
        
        static get observedAttributes() { 
            return ['serving']; 
        }
        
        attributeChangedCallback(name, oldValue, newValue) {
            if(!this.rendered) return;
            
            if(name === 'serving' && oldValue !== newValue){
                this.shadowRoot.getElementById('text').textContent = newValue;
            }
        }
        
        get serving(){
            return this.getAttribute('serving');
        }
        
        set serving(value){
            this.setAttribute('serving', value);
        }
    }
);
