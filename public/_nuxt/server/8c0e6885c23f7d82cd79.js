exports.ids=[10],exports.modules={114:function(e,t,r){"use strict";var o=r(4),l={computed:{...Object(o.mapGetters)({totalProfit:"user_dashboard/totalProfit"})}},n=r(2),component=Object(n.a)(l,function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"flex"},[this._ssrNode('<div class="no-underline md:text-blue-dark flex items-center bg-primary rounded-full h-8 px-4 text-white text-sm leading-none">',"</div>",[t("number",{ref:"profit",attrs:{to:this.totalProfit,format:function(e){return e.formatMoney("₱ ")},duration:.4}})],1)])},[],!1,null,null,"6792cc19");t.a=component.exports},142:function(e,t,r){"use strict";r.r(t);var o=r(4),l=r(114),n=r(9),d=r(97),c={layout:"user_dashboard",components:{VueTailwindModal:n.a,TotalProfitCounter:l.a,AvailableProducts:d.a},async mounted(){await this.$store.dispatch("user_dashboard/getUserCollectionsOf",this.user.uid);await this.$store.dispatch("user_dashboard/getTotalProfitOf",this.user),this.isLoading=!1},data:()=>({isLoading:!0,tmpSelectedProducts:[]}),computed:{...Object(o.mapGetters)({userCollections:"user_dashboard/userCollections",isLoggedIn:"user/isLoggedIn",user:"user/user"})},methods:{async showAvailableProducts(){this.isLoading=!1,this.$refs.availableProductsModal.show()},async createNewDesign(){if(!this.tmpSelectedProducts.length)return;this.isLoading=!0;let e=await this.$store.dispatch("designer/createNewDesign",{user:this.user,products:this.tmpSelectedProducts});this.tmpSelectedProducts=[],this.$storage.setLocalStorage("current_design_id",e.id),this.$router.push("/collection/designer")},editCollection(e){this.$storage.setLocalStorage("current_design_id",e.id),this.$router.replace("/collection/designer")},showDeleteCollectionConfirmation(e){this.collectionToDelete=e,this.$refs.deleteConfirmationModal.show()},hideDeleteCollectionConfirmation(){this.collectionToDelete=null,this.$refs.deleteConfirmationModal.hide()},async deleteCollection(){this.isLoading=!0,this.$refs.deleteConfirmationModal.hide(),this.$storage.removeLocalStorage("current_design_id"),await this.$store.dispatch("designer/deleteCollection",this.collectionToDelete.id),this.$store.dispatch("user_dashboard/removeCollectionById",this.collectionToDelete.id),this.isLoading=!1}}},f=r(2),component=Object(f.a)(c,function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"relative"},[e.isLoading?r("AreaLoader"):e._e(),e._ssrNode(" "),r("VueTailwindModal",{ref:"availableProductsModal",attrs:{width:"100%","content-class":"rounded-none h-full shadow-none text-gray-600"}},[r("div",{staticClass:"flex flex-col h-full"},[r("div",{staticClass:"modal-heading border-b w-full p-4"},[r("div",{staticClass:"flex justify-between w-full items-center"},[r("div",{staticClass:"flex uppercase"},[r("strong",[e._v("Select Products")])]),e._v(" "),r("div",{staticClass:"flex text-right"},[r("div",{staticClass:"select-none cursor-pointer w-8 h-8 border rounded-full flex justify-center items-center hover:border-gray-600 hover:text-gray-700",on:{click:function(t){return e.$refs.availableProductsModal.hide()}}},[r("font-awesome-icon",{staticClass:"text-xs",attrs:{icon:["fas","times"]}})],1)])])]),e._v(" "),r("div",{staticClass:"flex modal-body flex-grow h-full"},[r("AvailableProducts",{model:{value:e.tmpSelectedProducts,callback:function(t){e.tmpSelectedProducts=t},expression:"tmpSelectedProducts"}})],1),e._v(" "),r("div",{staticClass:"flex modal-footer justify-between flex-shrink p-4 border-t items-center"},[r("a",{staticClass:"text-blue-400 cursor-help border-dashed border-b hover:border-blue-400",attrs:{href:"#"}},[e._v(e._s(e.tmpSelectedProducts.length||"No")+" Products Selected")]),e._v(" "),r("button",{staticClass:"shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter",attrs:{type:"button"},on:{click:e.createNewDesign}},[e._v("CONTINUE")])])])]),e._ssrNode(" "),r("VueTailwindModal",{ref:"deleteConfirmationModal",attrs:{width:"30%","content-class":"rounded-none shadow-none text-gray-600"}},[r("div",{staticClass:"flex flex-col"},[r("div",{staticClass:"modal-heading border-b w-full p-4"},[r("div",{staticClass:"flex justify-between w-full items-center"},[r("div",{staticClass:"flex uppercase justify-center flex-grow"},[r("strong",[e._v("Confirmation")])])])]),e._v(" "),r("div",{staticClass:"modal-body p-4 text-center"},[e._v("Are you sure you want to delete this collection?")]),e._v(" "),r("div",{staticClass:"flex modal-footer justify-between flex-shrink p-4 border-t items-center"},[r("button",{staticClass:"justify-center items-center focus:outline-none outline-none border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100",attrs:{type:"button"},on:{click:e.hideDeleteCollectionConfirmation}},[e._v("No")]),e._v(" "),r("button",{staticClass:"shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter",attrs:{type:"button"},on:{click:e.deleteCollection}},[e._v("Yes")])])])]),e._ssrNode(" "),e._ssrNode('<div class="flex justify-between items-center">',"</div>",[e._ssrNode('<div class="flex">',"</div>",[r("nuxt-link",{staticClass:"no-underline flex items-center text-blue-600 text-sm border-b",attrs:{to:"/dashboard/collections/orders"}},[r("span",{staticClass:"mr-3"},[r("font-awesome-icon",{attrs:{icon:["fas","boxes"]}})],1),e._v(" Orders\n      ")]),e._ssrNode(" "),r("nuxt-link",{staticClass:"no-underline flex items-center text-blue-600 text-sm border-b ml-6",attrs:{to:"/dashboard/collections/payout"}},[r("span",{staticClass:"mr-3"},[r("font-awesome-icon",{attrs:{icon:["fas","receipt"]}})],1),e._v(" Payout\n      ")])],2),e._ssrNode(" "),r("TotalProfitCounter")],2),e._ssrNode(" "),e._ssrNode('<div class="py-4">',"</div>",[e._ssrNode('<div class="my-2 flex sm:flex-row justify-between items-center"><h2 class="text-2xl font-semibold leading-tight">My Collections</h2> <button type="button" class="border px-8 py-2 font-bold rounded outline-none focus:outline-none border-white bg-primary text-white hover:bg-primary-lighter">Create New Collection</button></div> '),e._ssrNode('<div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">',"</div>",[e._ssrNode('<div class="inline-block min-w-full border-l border-r overflow-hidden">',"</div>",[e._ssrNode('<table class="min-w-full leading-normal table-fixed">',"</table>",[e._ssrNode('<thead><tr><th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">Name</th> <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Status</th> <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Actions</th></tr></thead> '),e._ssrNode("<tbody>","</tbody>",[e._ssrNode((e.userCollections.length?"\x3c!----\x3e":'<tr><td colspan="3" class="text-xl text-gray-600 px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">You have no collection(s).</td></tr>')+" "),e._l(e.userCollections,function(col){return e._ssrNode("<tr>","</tr>",[e._ssrNode('<td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"><div class="flex items-center"><div class="ml-3"><p class="text-gray-900 whitespace-no-wrap"><span'+e._ssrClass("relative text-xs inline-block px-3 py-1 font-semibold leading-tight mr-1",{"text-white":"sell"===col.plan,"text-blue-800":"buy"===col.plan})+"><span aria-hidden"+e._ssrClass("absolute inset-0 rounded-full",{"bg-primary":"sell"===col.plan,"bg-blue-400":"buy"===col.plan})+'></span> <span class="relative uppercase">'+e._ssrEscape(e._s(col.plan))+'</span></span> <a href="#" class="text-blue-600 hover:underline"><span>'+e._ssrEscape(e._s(col.name))+'</span></a></p></div></div></td> <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"><span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight text-xs"><span aria-hidden'+e._ssrClass("absolute inset-0 opacity-50 rounded-full",{"bg-green-200":"approved"===col.status,"bg-blue-200":"pending"===col.status})+'></span> <span class="relative uppercase">'+e._ssrEscape(e._s(col.status))+"</span></span></td> "),e._ssrNode('<td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">',"</td>",[e._ssrNode("<div>","</div>",[r("button",{directives:[{name:"tippy",rawName:"v-tippy",value:{arrow:!0},expression:"{arrow: true}"}],staticClass:"px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1",attrs:{type:"button",title:"Delete"},on:{click:function(t){return e.showDeleteCollectionConfirmation(col)}}},[r("font-awesome-icon",{attrs:{icon:["fas","trash"]}})],1),e._ssrNode(" "),r("button",{directives:[{name:"tippy",rawName:"v-tippy",value:{arrow:!0},expression:"{arrow: true}"}],staticClass:"px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1",attrs:{type:"button",title:"Share"}},[r("font-awesome-icon",{attrs:{icon:["fas","share-alt"]}})],1)],2)])],2)})],2)],2)])])],2)],2)},[],!1,null,null,"f543e204");t.default=component.exports},91:function(e,t,r){"use strict";(function(e){var o=r(94),l=r(4);t.a={components:{Tabs:o.a},async created(){this.isLoading=!0,await this.$store.dispatch("designer/fetchAvailableProducts"),this.isLoading=!1,this.categories=[{name:"all",title:"All"}]},data:()=>({groupedProducts:{},categories:[],tmpProducts:[],isLoading:!1}),computed:{...Object(l.mapGetters)({availableProducts:"designer/availableProducts"})},methods:{toggleProduct(t){if(this._hasBeenSelected(t)){if(1==this.tmpProducts.length)return;let r=e.findIndex(this.tmpProducts,{id:t.id});return this.tmpProducts.splice(r,1),void this.$emit("input",this.tmpProducts)}t=JSON.parse(JSON.stringify(t)),this.tmpProducts.push(t),this.$emit("input",this.tmpProducts)},_firstVariantPlaceholderOf(t){if(!t.availableVariants.length)return;const r=e.keys(t.availableVariants[0].printable_area);let o=e.includes(r,"front")?"front":r[0];return t.availableVariants[0].printable_area[o].placeholder},_availableSizesOf(t){if(!t.availableVariants.length)return;return e.map(t.availableVariants[0].available_sizes,"name").join(", ")},_hasBeenSelected(t){return e.find(this.tmpProducts,{id:t.id})}}}}).call(this,r(6))},92:function(e,t){},94:function(e,t,r){"use strict";var o={props:["tabs"],data(){return{activeTab:this.tabs[0]}},methods:{_isActive(e){return this.activeTab&&this.activeTab.name==e.name},switchTabTo(e){this.activeTab=e}},watch:{tabs(e){this.switchTabTo(e[0])}}},l=r(2),component=Object(l.a)(o,function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"tabs flex flex-col h-full w-full"},[e._ssrNode('<div class="tabs-head flex text-gray-400 flex-wrap">'+e._ssrList(e.tabs,function(t){return'<button type="button"'+e._ssrClass("outline-none focus:outline-none border m-1 px-8 py-2 font-bold rounded",[{"bg-gray-900 shadow-xl bg-primary border-white text-white hover:bg-primary-lighter":e._isActive(t),"text-gray-600 border-grey-lightest hover:bg-gray-100":!e._isActive(t)}])+'><span class="w-full text-center uppercase">'+e._ssrEscape(e._s(t.title))+"</span></button>"})+"</div> "),e._l(e.tabs,function(t){return e._ssrNode("<div>","</div>",[e._isActive(t)?e._ssrNode('<div class="tabs-content flex w-full h-full py-4 flex-wrap overflow-auto">',"</div>",[e._t(t.name)],2):e._e()])})],2)},[],!1,null,null,"717e4723");t.a=component.exports},95:function(e,t,r){"use strict";r.r(t);var o=r(92),l=r.n(o);for(var n in o)"default"!==n&&function(e){r.d(t,e,function(){return o[e]})}(n);t.default=l.a},97:function(e,t,r){"use strict";var o=r(91).a,l=r(2);var component=Object(l.a)(o,function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"relative flex flex-grow flex-wrap overflow-auto"},[e.isLoading?r("AreaLoader"):e._e(),e._ssrNode(" "),e._ssrNode('<div class="flex flex-wrap flex-grow p-4 text-gray-600" data-v-a52ec708>',"</div>",[r("Tabs",{attrs:{tabs:e.categories},scopedSlots:e._u([{key:"all",fn:function(){return e._l(e.availableProducts,function(t){return r("div",{key:t.id,staticClass:"flex w-1/3 p-1",on:{click:function(r){return e.toggleProduct(t)}}},[r("div",{staticClass:"select-product flex border flex-grow rounded cursor-pointer select-none",class:{"border-primary hover:border-primary-lighter":e._hasBeenSelected(t),"hover:border-gray-500":!e._hasBeenSelected(t)}},[r("div",{staticClass:"flex w-1/3 product-thumb p-4 items-center justify-center"},[r("progressive-img",{staticClass:"w-full",attrs:{src:e._firstVariantPlaceholderOf(t)}})],1),e._v(" "),r("div",{staticClass:"flex flex-grow flex-col product-desc p-4 relative",class:{"text-primary hover:text-primary-lighter":e._hasBeenSelected(t)}},[r("div",{staticClass:"font-bold text-lg mb-4"},[e._v(e._s(t.name))]),e._v(" "),r("div",{staticClass:"flex flex-col"},[r("div",{staticClass:"flex py-1 items-center"},[r("font-awesome-icon",{attrs:{icon:["fas","tag"]}}),e._v(" "),r("div",{staticClass:"pl-2"},[e._v("Sizes - "+e._s(e._availableSizesOf(t)))])],1),e._v(" "),r("div",{staticClass:"flex py-1 items-center"},[r("font-awesome-icon",{attrs:{icon:["far","circle"]}}),e._v(" "),r("div",{staticClass:"pl-2 cursor-help"},[r("span",{staticClass:"border-b border-dashed hover:border-gray-500"},[e._v(e._s(t.availableVariants.length)+" Variants")])])],1)]),e._v(" "),r("div",{staticClass:"absolute outline-none focus:outline-none bg-white select-icon rounded-full border w-8 flex h-8 items-center justify-center",class:{"border-primary hover:border-primary-lighter hover:text-primary-lighter text-primary":e._hasBeenSelected(t)},staticStyle:{right:"10px",bottom:"10px"}},[r("font-awesome-icon",{attrs:{icon:["fas",e._hasBeenSelected(t)?"check":"plus"]}})],1)])])])})},proxy:!0}])},[e._v(" "),e._l(e.categories,function(t){return r("template",{slot:t.name},[r("div",{key:t.name,staticClass:"flex flex-wrap w-full"},e._l(e.groupedProducts[t.name],function(t){return r("div",{key:t.id,staticClass:"flex w-1/3 p-1",on:{click:function(r){return e.toggleProduct(t)}}},[r("div",{staticClass:"select-product flex border flex-grow rounded cursor-pointer select-none",class:{"border-primary hover:border-primary-lighter":e._hasBeenSelected(t),"hover:border-gray-500":!e._hasBeenSelected(t)}},[r("div",{staticClass:"flex w-1/3 product-thumb p-4 items-center justify-center"},[r("progressive-img",{staticClass:"w-full",attrs:{src:e._firstVariantPlaceholderOf(t)}})],1),e._v(" "),r("div",{staticClass:"flex flex-grow flex-col product-desc p-4 relative",class:{"text-primary hover:text-primary-lighter":e._hasBeenSelected(t)}},[r("div",{staticClass:"font-bold text-lg mb-4"},[e._v(e._s(t.name))]),e._v(" "),r("div",{staticClass:"flex flex-col"},[r("div",{staticClass:"flex py-1 items-center"},[r("font-awesome-icon",{attrs:{icon:["fas","tag"]}}),e._v(" "),r("div",{staticClass:"pl-2"},[e._v("Sizes - "+e._s(e._availableSizesOf(t)))])],1),e._v(" "),r("div",{staticClass:"flex py-1 items-center"},[r("font-awesome-icon",{attrs:{icon:["far","circle"]}}),e._v(" "),r("div",{staticClass:"pl-2 cursor-help"},[r("span",{staticClass:"border-b border-dashed hover:border-gray-500"},[e._v(e._s(t.availableVariants.length)+" Variants")])])],1)]),e._v(" "),r("div",{staticClass:"absolute outline-none focus:outline-none bg-white select-icon rounded-full border w-10 flex h-10 items-center justify-center",class:{"border-primary hover:border-primary-lighter hover:text-primary-lighter text-primary":e._hasBeenSelected(t)},staticStyle:{right:"10px",bottom:"10px"}},[r("font-awesome-icon",{attrs:{icon:["fas",e._hasBeenSelected(t)?"check":"plus"]}})],1)])])])}),0)])})],2)],1)],2)},[],!1,function(e){var t=r(95);t.__inject__&&t.__inject__(e)},"a52ec708","748f5b6e");t.a=component.exports}};
//# sourceMappingURL=8c0e6885c23f7d82cd79.js.map