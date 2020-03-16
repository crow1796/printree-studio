(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{471:function(t,e,r){"use strict";(function(t){r(152),r(38),r(43),r(44),r(24),r(51);var o=r(5),n=(r(15),r(1)),l=r(618),c=r(19);e.a={components:{Tabs:l.a},created:function(){var t=Object(n.a)(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return this.isLoading=!0,t.next=3,this.$store.dispatch("designer/fetchAvailableProducts");case 3:this.isLoading=!1,this.categories=[{name:"all",title:"All"}];case 5:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),data:function(){return{groupedProducts:{},categories:[],tmpProducts:[],isLoading:!1}},computed:Object(o.a)({},Object(c.b)({availableProducts:"designer/availableProducts"})),methods:{toggleProduct:function(e){if(this._hasBeenSelected(e)){if(1==this.tmpProducts.length)return;var r=t.findIndex(this.tmpProducts,{id:e.id});return this.tmpProducts.splice(r,1),void this.$emit("input",this.tmpProducts)}e=JSON.parse(JSON.stringify(e)),this.tmpProducts.push(e),this.$emit("input",this.tmpProducts)},_firstVariantPlaceholderOf:function(e){if(e.availableVariants.length){var r=t.keys(e.availableVariants[0].printable_area),o=t.includes(r,"front")?"front":r[0];return e.availableVariants[0].printable_area[o].placeholder}},_availableSizesOf:function(e){if(e.availableVariants.length)return t.map(e.availableVariants[0].available_sizes,"name").join(", ")},_hasBeenSelected:function(e){return t.find(this.tmpProducts,{id:e.id})}}}}).call(this,r(32))},472:function(t,e,r){},618:function(t,e,r){"use strict";r(35);var o={props:["tabs"],data:function(){return{activeTab:this.tabs[0]}},methods:{_isActive:function(t){return this.activeTab&&this.activeTab.name==t.name},switchTabTo:function(t){this.activeTab=t}},watch:{tabs:function(t){this.switchTabTo(t[0])}}},n=r(7),component=Object(n.a)(o,function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"tabs flex flex-col h-full w-full"},[r("div",{staticClass:"tabs-head flex text-gray-400 flex-wrap"},t._l(t.tabs,function(e){return r("button",{key:"title"+e.name,staticClass:"outline-none focus:outline-none border m-1 px-8 py-2 font-bold rounded",class:[{"bg-gray-900 shadow-xl bg-primary border-white text-white hover:bg-primary-lighter":t._isActive(e),"text-gray-600 border-grey-lightest hover:bg-gray-100":!t._isActive(e)}],attrs:{type:"button"},on:{click:function(r){return t.switchTabTo(e)}}},[r("span",{staticClass:"w-full text-center uppercase"},[t._v(t._s(e.title))])])}),0),t._v(" "),t._l(t.tabs,function(e){return r("div",{key:"content"+e.name},[t._isActive(e)?r("div",{staticClass:"tabs-content flex w-full h-full py-4 flex-wrap overflow-auto"},[t._t(e.name)],2):t._e()])})],2)},[],!1,null,null,null);e.a=component.exports},620:function(t,e,r){"use strict";var o=r(472);r.n(o).a},632:function(t,e,r){"use strict";var o=r(471).a,n=(r(620),r(7)),component=Object(n.a)(o,function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"relative flex flex-grow flex-wrap overflow-auto"},[t.isLoading?r("AreaLoader"):t._e(),t._v(" "),r("div",{staticClass:"flex flex-wrap flex-grow p-4 text-gray-600"},[r("Tabs",{attrs:{tabs:t.categories},scopedSlots:t._u([{key:"all",fn:function(){return t._l(t.availableProducts,function(e){return r("div",{key:e.id,staticClass:"flex w-1/3 p-1",on:{click:function(r){return t.toggleProduct(e)}}},[r("div",{staticClass:"select-product flex border flex-grow rounded cursor-pointer select-none",class:{"border-primary hover:border-primary-lighter":t._hasBeenSelected(e),"hover:border-gray-500":!t._hasBeenSelected(e)}},[r("div",{staticClass:"flex w-1/3 product-thumb p-4 items-center justify-center"},[r("progressive-img",{staticClass:"w-full",attrs:{src:t._firstVariantPlaceholderOf(e)}})],1),t._v(" "),r("div",{staticClass:"flex flex-grow flex-col product-desc p-4 relative",class:{"text-primary hover:text-primary-lighter":t._hasBeenSelected(e)}},[r("div",{staticClass:"font-bold text-lg mb-4"},[t._v(t._s(e.name))]),t._v(" "),r("div",{staticClass:"flex flex-col"},[r("div",{staticClass:"flex py-1 items-center"},[r("font-awesome-icon",{attrs:{icon:["fas","tag"]}}),t._v(" "),r("div",{staticClass:"pl-2"},[t._v("Sizes - "+t._s(t._availableSizesOf(e)))])],1),t._v(" "),r("div",{staticClass:"flex py-1 items-center"},[r("font-awesome-icon",{attrs:{icon:["far","circle"]}}),t._v(" "),r("div",{staticClass:"pl-2 cursor-help"},[r("span",{staticClass:"border-b border-dashed hover:border-gray-500"},[t._v(t._s(e.availableVariants.length)+" Variants")])])],1)]),t._v(" "),r("div",{staticClass:"absolute outline-none focus:outline-none bg-white select-icon rounded-full border w-8 flex h-8 items-center justify-center",class:{"border-primary hover:border-primary-lighter hover:text-primary-lighter text-primary":t._hasBeenSelected(e)},staticStyle:{right:"10px",bottom:"10px"}},[r("font-awesome-icon",{attrs:{icon:["fas",t._hasBeenSelected(e)?"check":"plus"]}})],1)])])])})},proxy:!0}])},[t._v(" "),t._l(t.categories,function(e){return r("template",{slot:e.name},[r("div",{key:e.name,staticClass:"flex flex-wrap w-full"},t._l(t.groupedProducts[e.name],function(e){return r("div",{key:e.id,staticClass:"flex w-1/3 p-1",on:{click:function(r){return t.toggleProduct(e)}}},[r("div",{staticClass:"select-product flex border flex-grow rounded cursor-pointer select-none",class:{"border-primary hover:border-primary-lighter":t._hasBeenSelected(e),"hover:border-gray-500":!t._hasBeenSelected(e)}},[r("div",{staticClass:"flex w-1/3 product-thumb p-4 items-center justify-center"},[r("progressive-img",{staticClass:"w-full",attrs:{src:t._firstVariantPlaceholderOf(e)}})],1),t._v(" "),r("div",{staticClass:"flex flex-grow flex-col product-desc p-4 relative",class:{"text-primary hover:text-primary-lighter":t._hasBeenSelected(e)}},[r("div",{staticClass:"font-bold text-lg mb-4"},[t._v(t._s(e.name))]),t._v(" "),r("div",{staticClass:"flex flex-col"},[r("div",{staticClass:"flex py-1 items-center"},[r("font-awesome-icon",{attrs:{icon:["fas","tag"]}}),t._v(" "),r("div",{staticClass:"pl-2"},[t._v("Sizes - "+t._s(t._availableSizesOf(e)))])],1),t._v(" "),r("div",{staticClass:"flex py-1 items-center"},[r("font-awesome-icon",{attrs:{icon:["far","circle"]}}),t._v(" "),r("div",{staticClass:"pl-2 cursor-help"},[r("span",{staticClass:"border-b border-dashed hover:border-gray-500"},[t._v(t._s(e.availableVariants.length)+" Variants")])])],1)]),t._v(" "),r("div",{staticClass:"absolute outline-none focus:outline-none bg-white select-icon rounded-full border w-10 flex h-10 items-center justify-center",class:{"border-primary hover:border-primary-lighter hover:text-primary-lighter text-primary":t._hasBeenSelected(e)},staticStyle:{right:"10px",bottom:"10px"}},[r("font-awesome-icon",{attrs:{icon:["fas",t._hasBeenSelected(e)?"check":"plus"]}})],1)])])])}),0)])})],2)],1)],1)},[],!1,null,"a52ec708",null);e.a=component.exports},684:function(t,e,r){"use strict";var o=r(5),n=r(19),l={computed:Object(o.a)({},Object(n.b)({totalProfit:"user_dashboard/totalProfit"}))},c=r(7),component=Object(c.a)(l,function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"flex"},[e("div",{staticClass:"no-underline md:text-blue-dark flex items-center bg-primary rounded-full h-8 px-4 text-white text-sm leading-none"},[e("number",{ref:"profit",attrs:{to:this.totalProfit,format:function(t){return t.formatMoney("₱ ")},duration:.4}})],1)])},[],!1,null,null,null);e.a=component.exports},865:function(t,e,r){"use strict";r.r(e);r(33);var o=r(5),n=(r(15),r(1)),l=r(19),c=r(684),d=r(52),f=r(632),h={layout:"user_dashboard",components:{VueTailwindModal:d.a,TotalProfitCounter:c.a,AvailableProducts:f.a},mounted:function(){var t=Object(n.a)(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.$store.dispatch("user_dashboard/getUserCollectionsOf",this.user.uid);case 2:return t.sent,t.next=5,this.$store.dispatch("user_dashboard/getTotalProfitOf",this.user);case 5:this.isLoading=!1;case 6:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),data:function(){return{isLoading:!0,tmpSelectedProducts:[]}},computed:Object(o.a)({},Object(l.b)({userCollections:"user_dashboard/userCollections",isLoggedIn:"user/isLoggedIn",user:"user/user"})),methods:{showAvailableProducts:function(){var t=Object(n.a)(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:this.isLoading=!1,this.$refs.availableProductsModal.show();case 2:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),createNewDesign:function(){var t=Object(n.a)(regeneratorRuntime.mark(function t(){var e;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(this.tmpSelectedProducts.length){t.next=2;break}return t.abrupt("return");case 2:return this.isLoading=!0,t.next=5,this.$store.dispatch("designer/createNewDesign",{user:this.user,products:this.tmpSelectedProducts});case 5:e=t.sent,this.tmpSelectedProducts=[],this.$storage.setLocalStorage("current_design_id",e.id),this.$router.push("/collection/designer");case 9:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),editCollection:function(t){this.$storage.setLocalStorage("current_design_id",t.id),this.$router.replace("/collection/designer")},showDeleteCollectionConfirmation:function(t){this.collectionToDelete=t,this.$refs.deleteConfirmationModal.show()},hideDeleteCollectionConfirmation:function(){this.collectionToDelete=null,this.$refs.deleteConfirmationModal.hide()},deleteCollection:function(){var t=Object(n.a)(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return this.isLoading=!0,this.$refs.deleteConfirmationModal.hide(),this.$storage.removeLocalStorage("current_design_id"),t.next=5,this.$store.dispatch("designer/deleteCollection",this.collectionToDelete.id);case 5:this.$store.dispatch("user_dashboard/removeCollectionById",this.collectionToDelete.id),this.isLoading=!1;case 7:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}()}},v=r(7),component=Object(v.a)(h,function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"relative"},[t.isLoading?r("AreaLoader"):t._e(),t._v(" "),r("VueTailwindModal",{ref:"availableProductsModal",attrs:{width:"100%","content-class":"rounded-none h-full shadow-none text-gray-600"}},[r("div",{staticClass:"flex flex-col h-full"},[r("div",{staticClass:"modal-heading border-b w-full p-4"},[r("div",{staticClass:"flex justify-between w-full items-center"},[r("div",{staticClass:"flex uppercase"},[r("strong",[t._v("Select Products")])]),t._v(" "),r("div",{staticClass:"flex text-right"},[r("div",{staticClass:"select-none cursor-pointer w-8 h-8 border rounded-full flex justify-center items-center hover:border-gray-600 hover:text-gray-700",on:{click:function(e){return t.$refs.availableProductsModal.hide()}}},[r("font-awesome-icon",{staticClass:"text-xs",attrs:{icon:["fas","times"]}})],1)])])]),t._v(" "),r("div",{staticClass:"flex modal-body flex-grow h-full"},[r("AvailableProducts",{model:{value:t.tmpSelectedProducts,callback:function(e){t.tmpSelectedProducts=e},expression:"tmpSelectedProducts"}})],1),t._v(" "),r("div",{staticClass:"flex modal-footer justify-between flex-shrink p-4 border-t items-center"},[r("a",{staticClass:"text-blue-400 cursor-help border-dashed border-b hover:border-blue-400",attrs:{href:"#"}},[t._v(t._s(t.tmpSelectedProducts.length||"No")+" Products Selected")]),t._v(" "),r("button",{staticClass:"shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter",attrs:{type:"button"},on:{click:t.createNewDesign}},[t._v("CONTINUE")])])])]),t._v(" "),r("VueTailwindModal",{ref:"deleteConfirmationModal",attrs:{width:"30%","content-class":"rounded-none shadow-none text-gray-600"}},[r("div",{staticClass:"flex flex-col"},[r("div",{staticClass:"modal-heading border-b w-full p-4"},[r("div",{staticClass:"flex justify-between w-full items-center"},[r("div",{staticClass:"flex uppercase justify-center flex-grow"},[r("strong",[t._v("Confirmation")])])])]),t._v(" "),r("div",{staticClass:"modal-body p-4 text-center"},[t._v("Are you sure you want to delete this collection?")]),t._v(" "),r("div",{staticClass:"flex modal-footer justify-between flex-shrink p-4 border-t items-center"},[r("button",{staticClass:"justify-center items-center focus:outline-none outline-none border px-3 py-2 font-bold rounded text-gray-600 border-grey-lightest hover:bg-gray-100",attrs:{type:"button"},on:{click:t.hideDeleteCollectionConfirmation}},[t._v("No")]),t._v(" "),r("button",{staticClass:"shadow-xl border border-white bg-primary px-8 py-2 font-bold rounded text-white hover:bg-primary-lighter",attrs:{type:"button"},on:{click:t.deleteCollection}},[t._v("Yes")])])])]),t._v(" "),r("div",{staticClass:"flex justify-between items-center"},[r("div",{staticClass:"flex"},[r("nuxt-link",{staticClass:"no-underline flex items-center text-blue-600 text-sm border-b",attrs:{to:"/dashboard/collections/orders"}},[r("span",{staticClass:"mr-3"},[r("font-awesome-icon",{attrs:{icon:["fas","boxes"]}})],1),t._v(" Orders\n      ")]),t._v(" "),r("nuxt-link",{staticClass:"no-underline flex items-center text-blue-600 text-sm border-b ml-6",attrs:{to:"/dashboard/collections/payout"}},[r("span",{staticClass:"mr-3"},[r("font-awesome-icon",{attrs:{icon:["fas","receipt"]}})],1),t._v(" Payout\n      ")])],1),t._v(" "),r("TotalProfitCounter")],1),t._v(" "),r("div",{staticClass:"py-4"},[r("div",{staticClass:"my-2 flex sm:flex-row justify-between items-center"},[r("h2",{staticClass:"text-2xl font-semibold leading-tight"},[t._v("My Collections")]),t._v(" "),r("button",{staticClass:"border px-8 py-2 font-bold rounded outline-none focus:outline-none border-white bg-primary text-white hover:bg-primary-lighter",attrs:{type:"button"},on:{click:t.showAvailableProducts}},[t._v("Create New Collection")])]),t._v(" "),r("div",{staticClass:"-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto"},[r("div",{staticClass:"inline-block min-w-full border-l border-r overflow-hidden"},[r("table",{staticClass:"min-w-full leading-normal table-fixed"},[t._m(0),t._v(" "),r("tbody",[t.userCollections.length?t._e():r("tr",[r("td",{staticClass:"text-xl text-gray-600 px-5 py-5 border-b border-gray-200 bg-white text-sm text-center",attrs:{colspan:"3"}},[t._v("You have no collection(s).")])]),t._v(" "),t._l(t.userCollections,function(col){return r("tr",{key:col.id},[r("td",{staticClass:"px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"},[r("div",{staticClass:"flex items-center"},[r("div",{staticClass:"ml-3"},[r("p",{staticClass:"text-gray-900 whitespace-no-wrap"},[r("span",{staticClass:"relative text-xs inline-block px-3 py-1 font-semibold leading-tight mr-1",class:{"text-white":"sell"===col.plan,"text-blue-800":"buy"===col.plan}},[r("span",{staticClass:"absolute inset-0 rounded-full",class:{"bg-primary":"sell"===col.plan,"bg-blue-400":"buy"===col.plan},attrs:{"aria-hidden":""}}),t._v(" "),r("span",{staticClass:"relative uppercase"},[t._v(t._s(col.plan))])]),t._v(" "),r("a",{staticClass:"text-blue-600 hover:underline",attrs:{href:"#"},on:{click:function(e){return e.preventDefault(),t.editCollection(col)}}},[r("span",[t._v(t._s(col.name))])])])])])]),t._v(" "),r("td",{staticClass:"px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"},[r("span",{staticClass:"relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight text-xs"},[r("span",{staticClass:"absolute inset-0 opacity-50 rounded-full",class:{"bg-green-200":"approved"===col.status,"bg-blue-200":"pending"===col.status},attrs:{"aria-hidden":""}}),t._v(" "),r("span",{staticClass:"relative uppercase"},[t._v(t._s(col.status))])])]),t._v(" "),r("td",{staticClass:"px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"},[r("div",[r("button",{directives:[{name:"tippy",rawName:"v-tippy",value:{arrow:!0},expression:"{arrow: true}"}],staticClass:"px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1",attrs:{type:"button",title:"Delete"},on:{click:function(e){return t.showDeleteCollectionConfirmation(col)}}},[r("font-awesome-icon",{attrs:{icon:["fas","trash"]}})],1),t._v(" "),r("button",{directives:[{name:"tippy",rawName:"v-tippy",value:{arrow:!0},expression:"{arrow: true}"}],staticClass:"px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1",attrs:{type:"button",title:"Share"}},[r("font-awesome-icon",{attrs:{icon:["fas","share-alt"]}})],1)])])])})],2)])])])])],1)},[function(){var t=this.$createElement,e=this._self._c||t;return e("thead",[e("tr",[e("th",{staticClass:"px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left"},[this._v("Name")]),this._v(" "),e("th",{staticClass:"px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"},[this._v("Status")]),this._v(" "),e("th",{staticClass:"px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center"},[this._v("Actions")])])])}],!1,null,null,null);e.default=component.exports}}]);