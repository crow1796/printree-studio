exports.ids=[17],exports.modules={113:function(e,t){},122:function(e,t,r){"use strict";r.r(t);var o=r(113),l=r.n(o);for(var n in o)"default"!==n&&function(e){r.d(t,e,function(){return o[e]})}(n);t.default=l.a},144:function(e,t,r){"use strict";r.r(t);var o=r(9),l=r(97),n=r(10),d=r(4),c={components:{VueTailwindModal:o.a,AvailableProducts:l.a,AuthModal:n.a},middleware:"authenticated",data:()=>({isLoading:!1,tmpSelectedProducts:[]}),computed:{...Object(d.mapGetters)({isLoggedIn:"user/isLoggedIn",user:"user/user",designMeta:"designer/designMeta"})},async created(){if(this.$storage.getLocalStorage("current_design_id")){this.isLoading=!0;await this.$store.dispatch("designer/fetchDesignDataAndCommit",this.$storage.getLocalStorage("current_design_id"));this.isLoading=!1}},mounted(){let e=0,t=document.getElementById("screen"),r=document.body.offsetWidth,o=document.body.offsetHeight;for(;e<20;){let l=Math.floor(87*Math.random())+63,n=Math.floor(360*Math.random())+-180,d=Math.floor(Math.random()*(r-0))+0-l/2,c=Math.floor(Math.random()*(o-0))+0-l/2,f=Math.floor(3*Math.random())+0,h=document.createElement("div"),v=document.createElement("div");v.style.width=h.style.width=`${l}px`,v.style.height=h.style.height=`${l}px`,h.style.left=`${d}px`,h.style.top=`${c}px`,v.style.animationDelay=`${f}s`,h.style.transform=`rotate(${n}deg)`,h.classList.add("bgbox-container"),v.classList.add("bgbox"),h.appendChild(v),t.appendChild(h),e++}},methods:{async showAvailableProducts(){if(this.$storage.getLocalStorage("current_design_id")){if(this.isLoading=!0,(await this.$store.dispatch("designer/fetchDesignDataAndCommit",this.$storage.getLocalStorage("current_design_id"))).user_id==(this.user&&this.user.uid))return this.$router.push("/collection/designer")}this.isLoading=!1,this.$refs.availableProductsModal.show()},async createNewDesign(){if(!this.tmpSelectedProducts.length)return;if(!this.isLoggedIn)return void this.$refs.authModal.show();this.$refs.authModal.hide(),this.isLoading=!0;let e=await this.$store.dispatch("designer/createNewDesign",{user:this.user,products:this.tmpSelectedProducts});this.tmpSelectedProducts=[],this.$storage.setLocalStorage("current_design_id",e.id),this.$router.push("/collection/designer")}}},f=r(2);var component=Object(f.a)(c,function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"w-full"},[e.isLoading?r("AreaLoader",{attrs:{fullscreen:""}}):e._e(),e._ssrNode(" "),r("VueTailwindModal",{ref:"availableProductsModal",attrs:{width:"100%","content-class":"rounded-none h-full shadow-none text-gray-600"}},[r("div",{staticClass:"flex flex-col flex-grow"},[r("div",{staticClass:"modal-heading border-b flex-grow p-4"},[r("div",{staticClass:"flex justify-between flex-grow items-center"},[r("div",{staticClass:"flex uppercase"},[r("strong",[e._v("Select Products")])]),e._v(" "),r("div",{staticClass:"flex text-right"},[r("div",{staticClass:"select-none cursor-pointer w-8 h-8 border rounded-full flex justify-center items-center hover:border-gray-600 hover:text-gray-700",on:{click:function(t){return e.$refs.availableProductsModal.hide()}}},[r("font-awesome-icon",{staticClass:"text-xs",attrs:{icon:["fas","times"]}})],1)])])]),e._v(" "),r("div",{staticClass:"flex modal-body flex-grow h-full"},[r("AvailableProducts",{model:{value:e.tmpSelectedProducts,callback:function(t){e.tmpSelectedProducts=t},expression:"tmpSelectedProducts"}})],1),e._v(" "),r("div",{staticClass:"flex modal-footer justify-between flex-shrink p-4 border-t items-center"},[r("a",{staticClass:"text-blue-400 cursor-help border-dashed border-b hover:border-blue-400",attrs:{href:"#"}},[e._v(e._s(e.tmpSelectedProducts.length||"No")+" Products Selected")]),e._v(" "),r("button",{staticClass:"shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter",attrs:{type:"button"},on:{click:e.createNewDesign}},[e._v("CONTINUE")])])])]),e._ssrNode(" "),r("AuthModal",{ref:"authModal",on:{"login-success":e.createNewDesign}}),e._ssrNode(' <div class="hero flex relative w-full"><div id="screen" class="z-10 overflow-hidden"></div> <div class="flex z-20 relative mt-32 w-3/5 pl-32 flex-col"><div class="w-8/12 mt-10"><div class="text-6xl font-bold leading-none">CREATE</div> <div class="text-2xl ml-2">your own designs for any product &amp; earn</div></div> <div class="flex mt-5"><button type="button" class="shadow-xl border border-white bg-primary px-8 py-4 font-bold rounded text-white hover:bg-primary-lighter"><span>START DESIGNING</span></button></div></div> <div class="flex"><img src="/forming_ideas.png"></div></div> <div class="how-it-works"><div class="text-center text-4xl font-bold my-6">HOW IT WORKS?</div></div>')],2)},[],!1,function(e){var t=r(122);t.__inject__&&t.__inject__(e)},null,"507290f3");t.default=component.exports},91:function(e,t,r){"use strict";(function(e){var o=r(94),l=r(4);t.a={components:{Tabs:o.a},async created(){this.isLoading=!0,await this.$store.dispatch("designer/fetchAvailableProducts"),this.isLoading=!1,this.categories=[{name:"all",title:"All"}]},data:()=>({groupedProducts:{},categories:[],tmpProducts:[],isLoading:!1}),computed:{...Object(l.mapGetters)({availableProducts:"designer/availableProducts"})},methods:{toggleProduct(t){if(this._hasBeenSelected(t)){if(1==this.tmpProducts.length)return;let r=e.findIndex(this.tmpProducts,{id:t.id});return this.tmpProducts.splice(r,1),void this.$emit("input",this.tmpProducts)}t=JSON.parse(JSON.stringify(t)),this.tmpProducts.push(t),this.$emit("input",this.tmpProducts)},_firstVariantPlaceholderOf(t){if(!t.availableVariants.length)return;const r=e.keys(t.availableVariants[0].printable_area);let o=e.includes(r,"front")?"front":r[0];return t.availableVariants[0].printable_area[o].placeholder},_availableSizesOf(t){if(!t.availableVariants.length)return;return e.map(t.availableVariants[0].available_sizes,"name").join(", ")},_hasBeenSelected(t){return e.find(this.tmpProducts,{id:t.id})}}}}).call(this,r(6))},92:function(e,t){},94:function(e,t,r){"use strict";var o={props:["tabs"],data(){return{activeTab:this.tabs[0]}},methods:{_isActive(e){return this.activeTab&&this.activeTab.name==e.name},switchTabTo(e){this.activeTab=e}},watch:{tabs(e){this.switchTabTo(e[0])}}},l=r(2),component=Object(l.a)(o,function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"tabs flex flex-col h-full w-full"},[e._ssrNode('<div class="tabs-head flex text-gray-400 flex-wrap">'+e._ssrList(e.tabs,function(t){return'<button type="button"'+e._ssrClass("outline-none focus:outline-none border m-1 px-8 py-2 font-bold rounded",[{"bg-gray-900 shadow-xl bg-primary border-white text-white hover:bg-primary-lighter":e._isActive(t),"text-gray-600 border-grey-lightest hover:bg-gray-100":!e._isActive(t)}])+'><span class="w-full text-center uppercase">'+e._ssrEscape(e._s(t.title))+"</span></button>"})+"</div> "),e._l(e.tabs,function(t){return e._ssrNode("<div>","</div>",[e._isActive(t)?e._ssrNode('<div class="tabs-content flex w-full h-full py-4 flex-wrap overflow-auto">',"</div>",[e._t(t.name)],2):e._e()])})],2)},[],!1,null,null,"717e4723");t.a=component.exports},95:function(e,t,r){"use strict";r.r(t);var o=r(92),l=r.n(o);for(var n in o)"default"!==n&&function(e){r.d(t,e,function(){return o[e]})}(n);t.default=l.a},97:function(e,t,r){"use strict";var o=r(91).a,l=r(2);var component=Object(l.a)(o,function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"relative flex flex-grow flex-wrap overflow-auto"},[e.isLoading?r("AreaLoader"):e._e(),e._ssrNode(" "),e._ssrNode('<div class="flex flex-wrap flex-grow p-4 text-gray-600" data-v-a52ec708>',"</div>",[r("Tabs",{attrs:{tabs:e.categories},scopedSlots:e._u([{key:"all",fn:function(){return e._l(e.availableProducts,function(t){return r("div",{key:t.id,staticClass:"flex w-1/3 p-1",on:{click:function(r){return e.toggleProduct(t)}}},[r("div",{staticClass:"select-product flex border flex-grow rounded cursor-pointer select-none",class:{"border-primary hover:border-primary-lighter":e._hasBeenSelected(t),"hover:border-gray-500":!e._hasBeenSelected(t)}},[r("div",{staticClass:"flex w-1/3 product-thumb p-4 items-center justify-center"},[r("progressive-img",{staticClass:"w-full",attrs:{src:e._firstVariantPlaceholderOf(t)}})],1),e._v(" "),r("div",{staticClass:"flex flex-grow flex-col product-desc p-4 relative",class:{"text-primary hover:text-primary-lighter":e._hasBeenSelected(t)}},[r("div",{staticClass:"font-bold text-lg mb-4"},[e._v(e._s(t.name))]),e._v(" "),r("div",{staticClass:"flex flex-col"},[r("div",{staticClass:"flex py-1 items-center"},[r("font-awesome-icon",{attrs:{icon:["fas","tag"]}}),e._v(" "),r("div",{staticClass:"pl-2"},[e._v("Sizes - "+e._s(e._availableSizesOf(t)))])],1),e._v(" "),r("div",{staticClass:"flex py-1 items-center"},[r("font-awesome-icon",{attrs:{icon:["far","circle"]}}),e._v(" "),r("div",{staticClass:"pl-2 cursor-help"},[r("span",{staticClass:"border-b border-dashed hover:border-gray-500"},[e._v(e._s(t.availableVariants.length)+" Variants")])])],1)]),e._v(" "),r("div",{staticClass:"absolute outline-none focus:outline-none bg-white select-icon rounded-full border w-8 flex h-8 items-center justify-center",class:{"border-primary hover:border-primary-lighter hover:text-primary-lighter text-primary":e._hasBeenSelected(t)},staticStyle:{right:"10px",bottom:"10px"}},[r("font-awesome-icon",{attrs:{icon:["fas",e._hasBeenSelected(t)?"check":"plus"]}})],1)])])])})},proxy:!0}])},[e._v(" "),e._l(e.categories,function(t){return r("template",{slot:t.name},[r("div",{key:t.name,staticClass:"flex flex-wrap w-full"},e._l(e.groupedProducts[t.name],function(t){return r("div",{key:t.id,staticClass:"flex w-1/3 p-1",on:{click:function(r){return e.toggleProduct(t)}}},[r("div",{staticClass:"select-product flex border flex-grow rounded cursor-pointer select-none",class:{"border-primary hover:border-primary-lighter":e._hasBeenSelected(t),"hover:border-gray-500":!e._hasBeenSelected(t)}},[r("div",{staticClass:"flex w-1/3 product-thumb p-4 items-center justify-center"},[r("progressive-img",{staticClass:"w-full",attrs:{src:e._firstVariantPlaceholderOf(t)}})],1),e._v(" "),r("div",{staticClass:"flex flex-grow flex-col product-desc p-4 relative",class:{"text-primary hover:text-primary-lighter":e._hasBeenSelected(t)}},[r("div",{staticClass:"font-bold text-lg mb-4"},[e._v(e._s(t.name))]),e._v(" "),r("div",{staticClass:"flex flex-col"},[r("div",{staticClass:"flex py-1 items-center"},[r("font-awesome-icon",{attrs:{icon:["fas","tag"]}}),e._v(" "),r("div",{staticClass:"pl-2"},[e._v("Sizes - "+e._s(e._availableSizesOf(t)))])],1),e._v(" "),r("div",{staticClass:"flex py-1 items-center"},[r("font-awesome-icon",{attrs:{icon:["far","circle"]}}),e._v(" "),r("div",{staticClass:"pl-2 cursor-help"},[r("span",{staticClass:"border-b border-dashed hover:border-gray-500"},[e._v(e._s(t.availableVariants.length)+" Variants")])])],1)]),e._v(" "),r("div",{staticClass:"absolute outline-none focus:outline-none bg-white select-icon rounded-full border w-10 flex h-10 items-center justify-center",class:{"border-primary hover:border-primary-lighter hover:text-primary-lighter text-primary":e._hasBeenSelected(t)},staticStyle:{right:"10px",bottom:"10px"}},[r("font-awesome-icon",{attrs:{icon:["fas",e._hasBeenSelected(t)?"check":"plus"]}})],1)])])])}),0)])})],2)],1)],2)},[],!1,function(e){var t=r(95);t.__inject__&&t.__inject__(e)},"a52ec708","748f5b6e");t.a=component.exports}};
//# sourceMappingURL=106f1d10e74d0d3fb130.js.map