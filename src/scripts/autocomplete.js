var Autocomplete=function(){"use strict";const t=(t,s)=>{for(let i in s)"addClass"===i?h(t,"add",s[i]):"removeClass"===i?h(t,"remove",s[i]):t.setAttribute(i,s[i])},s=t=>(t.firstElementChild||t).textContent.trim(),i=(t,s)=>{t.scrollTop=t.offsetTop-s.offsetHeight},h=(t,s,i)=>t.classList[s](i),e=(s,i)=>{t(s,{"aria-activedescendant":i||""})},a=(t,s,i,h)=>{const e=h.previousSibling,a=e?e.offsetHeight:0;if("0"==t.getAttribute("aria-posinset")&&(h.scrollTop=t.offsetTop-((t,s)=>{const i=document.querySelectorAll("#"+t+" > li:not(."+s+")");let h=0;return[].slice.call(i).map(t=>h+=t.offsetHeight),h})(s,i)),t.offsetTop-a<h.scrollTop)h.scrollTop=t.offsetTop-a;else{const s=t.offsetTop+t.offsetHeight-a;s>h.scrollTop+h.offsetHeight&&(h.scrollTop=s-h.offsetHeight)}},n=t=>document.createElement(t),l=t=>document.querySelector(t),o=(t,s,i)=>{t.addEventListener(s,i)},r=(t,s,i)=>{t.removeEventListener(s,i)},c=27,d=13,u=38,m=40,p=9;return class{constructor(v,b){let{delay:f=500,clearButton:x=!0,howManyCharacters:C=1,selectFirst:y=!1,insertToInput:k=!1,showAllValues:w=!1,cache:g=!1,disableCloseOnSelect:j=!1,classGroup:V,classPreventClosing:S,classPrefix:O,ariaLabelClear:A,onSearch:I,onResults:R=(()=>{}),onSubmit:P=(()=>{}),onOpened:T=(()=>{}),onReset:B=(()=>{}),onRender:G=(()=>{}),onClose:J=(()=>{}),noResults:N=(()=>{}),onSelectedItem:$=(()=>{})}=b;var q;this.t=()=>{var s,i,h,e,a;this.s(),s=this.i,i=this.h,h=this.l,e=this.o,a=this.u,t(i,{id:h,tabIndex:"0",role:"listbox"}),t(e,{addClass:a+"-results-wrapper"}),e.insertAdjacentElement("beforeend",i),s.parentNode.insertBefore(e,s.nextSibling),o(this.i,"input",this.m),this.p&&o(this.i,"click",this.m),this.v({element:this.i,results:this.h})},this.C=(t,s)=>{this.k&&("update"===t?this.i.setAttribute(this.g,s.value):"remove"===t?this.i.removeAttribute(this.g):this.i.value=this.i.getAttribute(this.g))},this.m=t=>{let{target:s,type:i}=t;if("true"===this.i.getAttribute("aria-expanded")&&"click"===i)return;const h=s.value.replace(this.j,"\\$&");this.C("update",s);const e=this.p?0:this.V;clearTimeout(this.S),this.S=setTimeout(()=>{this.O(h.trim())},e)},this.A=()=>{var s;t(this.i,{"aria-owns":this.I+"-list","aria-expanded":"false","aria-autocomplete":"list","aria-activedescendant":"",role:"combobox",removeClass:"auto-expanded"}),h(this.o,"remove",this.R),(0==(null==(s=this.P)?void 0:s.length)&&!this.T||this.p)&&(this.h.textContent=""),this.B=this.G?0:-1,this.J()},this.O=t=>{this.N=t,this.$(!0),function(t,s){void 0===t&&(t=!1),t&&(h(t,"remove","hidden"),o(t,"click",s))}(this.q,this.destroy),0==t.length&&this.F&&h(this.q,"add","hidden"),this.L>t.length&&!this.p?this.$():this.M({currentValue:t,element:this.i}).then(s=>{const i=this.i.value.length,e=s.length;this.P=Array.isArray(s)?s:JSON.parse(JSON.stringify(s)),this.$(),this.D(),0==e&&0==i&&h(this.q,"add","hidden"),0==e&&i?(h(this.i,"remove","auto-expanded"),this.A(),this.H({element:this.i,currentValue:t,template:this.K}),this.U()):(e>0||(t=>t&&"object"==typeof t&&t.constructor===Object)(s))&&(this.B=this.G?0:-1,this.K(),this.U())}).catch(()=>{this.$(),this.A()})},this.$=t=>this.i.parentNode.classList[t?"add":"remove"](this.W),this.D=()=>h(this.i,"remove",this.X),this.U=()=>{o(this.i,"keydown",this.Y),o(this.i,"click",this.Z),["mousemove","click"].map(t=>{o(this.h,t,this._)}),o(document,"click",this.tt)},this.K=s=>{t(this.i,{"aria-expanded":"true",addClass:this.u+"-expanded"}),this.h.textContent="";const e=0===this.P.length?this.st({currentValue:this.N,matches:0,template:s}):this.st({currentValue:this.N,matches:this.P,classGroup:this.it});this.h.insertAdjacentHTML("afterbegin",e),h(this.o,"add",this.R);const a=this.it?":not(."+this.it+")":"";this.ht=document.querySelectorAll("#"+this.l+" > li"+a),(s=>{for(let i=0;i<s.length;i++)t(s[i],{role:"option",tabindex:"-1","aria-selected":"false","aria-setsize":s.length,"aria-posinset":i})})(this.ht),this.et({type:"results",element:this.i,results:this.h}),this.at(),i(this.h,this.o)},this.tt=t=>{let{target:s}=t,i=null;(s.closest("ul")&&this.nt||s.closest("."+this.lt))&&(i=!0),s.id===this.I||i||this.A()},this.at=()=>{if(this.ot(l("."+this.rt)),!this.G)return;const{firstElementChild:s}=this.h,i=this.it&&this.P.length>0&&this.G?s.nextElementSibling:s;this.ct({index:this.B,element:this.i,object:this.P[this.B]}),t(i,{id:this.dt+"-0",addClass:this.rt,"aria-selected":"true"}),e(this.i,this.dt+"-0")},this.Z=()=>{this.h.textContent.length>0&&!h(this.o,"contains",this.R)&&(t(this.i,{"aria-expanded":"true",addClass:this.u+"-expanded"}),h(this.o,"add",this.R),i(this.h,this.o),this.at(),this.et({type:"showItems",element:this.i,results:this.h}))},this._=t=>{t.preventDefault();const{target:s,type:i}=t,e=s.closest("li"),a=null==e?void 0:e.hasAttribute("role"),n=this.rt,o=l("."+n);e&&a&&("click"===i&&this.ut(e),"mousemove"!==i||h(e,"contains",n)||(this.ot(o),this.pt(e),this.B=this.vt(e),this.ct({index:this.B,element:this.i,object:this.P[this.B]})))},this.ut=t=>{t&&0!==this.P.length?(this.F&&h(this.q,"remove","hidden"),this.i.value=s(t),this.bt({index:this.B,element:this.i,object:this.P[this.B],results:this.h}),this.nt||(this.ot(t),this.A()),this.C("remove")):!this.nt&&this.A()},this.vt=t=>Array.prototype.indexOf.call(this.ht,t),this.Y=t=>{const{keyCode:i}=t,a=h(this.o,"contains",this.R),n=this.P.length+1;switch(this.ft=l("."+this.rt),i){case u:case m:if(t.preventDefault(),n<=1&&this.G||!a)return;i===u?(this.B<0&&(this.B=n-1),this.B-=1):(this.B+=1,this.B>=n&&(this.B=0)),this.ot(this.ft),this.B>=0&&this.B<n-1?(this.T&&a&&(this.i.value=s(this.ht[this.B])),this.ct({index:this.B,element:this.i,object:this.P[this.B]}),this.pt(this.ht[this.B])):(this.C(),e(this.i),this.ct({index:null,element:this.i,object:null}));break;case d:this.ut(this.ft);break;case p:case c:t.stopPropagation(),this.A()}},this.pt=s=>{const i=this.dt+"-"+this.vt(s);t(s,{id:i,"aria-selected":"true",addClass:this.rt}),e(this.i,i),a(s,this.l,this.it,this.h)},this.ot=s=>{s&&t(s,{id:"",removeClass:this.rt,"aria-selected":"false"})},this.s=()=>{this.F&&(t(this.q,{class:this.u+"-clear hidden",type:"button",title:this.xt,"aria-label":this.xt}),this.i.insertAdjacentElement("afterend",this.q))},this.destroy=()=>{this.F&&h(this.q,"add","hidden"),this.i.value="",this.i.focus(),this.h.textContent="",this.A(),this.D(),this.Ct(this.i),r(this.i,"keydown",this.Y),r(this.i,"click",this.Z),r(document,"click",this.tt)},this.I=v,this.i=document.getElementById(v),this.M=(q=I,Boolean(q&&"function"==typeof q.then)?I:t=>{let{currentValue:s,element:i}=t;return Promise.resolve(I({currentValue:s,element:i}))}),this.st=R,this.v=G,this.bt=P,this.ct=$,this.et=T,this.Ct=B,this.H=N,this.J=J,this.V=f,this.L=C,this.F=x,this.G=y,this.T=k,this.p=w,this.it=V,this.lt=S,this.xt=A||"clear the search query",this.u=O?O+"-auto":"auto",this.nt=j,this.k=g,this.l=this.u+"-"+this.I+"-results",this.g="data-cache-auto-"+this.I,this.W=this.u+"-is-loading",this.R=this.u+"-is-active",this.rt=this.u+"-selected",this.dt=this.u+"-selected-option",this.X=this.u+"-error",this.j=/[|\\{}()[\]^$+*?.]/g,this.S=null,this.o=n("div"),this.h=n("ul"),this.q=n("button"),this.t()}}}();
export default Autocomplete;

export function createAutocomplete(inputId, onSelect){
    return new Autocomplete(inputId, {
        howManyCharacters: 2,

        // onSearch: ({ currentValue }) => {
        //     const api = `https://photon.komoot.io/api/?q=${encodeURI(currentValue)}&lang=en`;
        //
        //     return new Promise((resolve) => {
        //         fetch(api)
        //             .then((response) => response.json())
        //             .then((data) => {
        //                 resolve(data.features);
        //             })
        //             .catch((error) => {
        //                 console.error(error);
        //             });
        //     });
        // },
        //
        // onResults: ({ matches }) => {
        //     return matches
        //         .filter((feature)=> feature.properties.type === "city" || feature.properties.city !== undefined)
        //         .filter((feature, index) => index < 5)
        //         .map((feature) => {
        //             let text = feature.properties.state || feature.properties.county || "";
        //             if(text !== "") text += ", ";
        //             return `<li><span class="font-bold py-2">${feature.properties.name}</span><br/>
        //     ${text}${feature.properties.country}
        //     </li>`
        //         })
        //         .join("");
        // },


        onSearch: ({ currentValue }) => {
            const api = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURI(currentValue)}&key=VOTRE_CLE_API&language=fr&pretty=1`;

            return new Promise((resolve) => {
                fetch(api)
                    .then((response) => response.json())
                    .then((data) => {
                        resolve(data.results);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            });
        },

        onResults: ({ matches }) => {
            return matches
                .filter((result, index) => index < 5)
                .map((result) => {
                    let components = result.components;
                    let name = components.neighbourhood || components.suburb || components.city || components.town || components.village;
                    let details = [components.city, components.state, components.country].filter(Boolean).join(", ");
                    return `<li><span class="font-bold py-2">${name}</span><br/>${details}</li>`
                })
                .join("");
        },

        // Add this new callback
        onSubmit: ({ index, element, object }) => {
            const selectedValue = object.properties.name;
            onSelect(selectedValue);
        }
    });
}