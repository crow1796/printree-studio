exports.ids=[5],exports.modules={146:function(t,e,r){"use strict";r.r(e);var o=r(83),d=r.n(o),n=r(4),c={layout:"admin_dashboard",async mounted(){await this.$store.dispatch("admin/getPayouts",{}),this.isLoading=!1},data:()=>({isLoading:!0}),computed:{...Object(n.mapGetters)({payouts:"admin/payouts"})},methods:{formatTimestamp:t=>d()(t.toDate()).format("MMMM Do YYYY, h:mm:ss a"),processBtnTextOf(t){let text="PROCESS";switch(t){case"processing":text="PAID"}return text},async updatePayoutStatusTo(t,e){this.isLoading=!0;const r=await this.$store.dispatch("admin/updatePayoutStatusTo",{payout:t,status:e});this.isLoading=!1,r.status?this.$toast.success("Payout has been updated successfully.",{position:"top"}):this.$toast.error(r.message||"Payout processing failed.",{position:"top"})},processPayout(t){let e="processing";switch(t.status){case"pending":e="processing";break;case"processing":e="paid"}this.updatePayoutStatusTo(t,e)}}},l=r(2),component=Object(l.a)(c,function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"relative sm:px-8"},[t.isLoading?r("AreaLoader"):t._e(),t._ssrNode(' <div class="my-2 flex justify-between items-center"><h2 class="text-2xl font-semibold leading-tight">Payout</h2></div> '),t._ssrNode('<div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">',"</div>",[t._ssrNode('<div class="inline-block min-w-full border-l border-r overflow-hidden">',"</div>",[t._ssrNode('<table class="min-w-full leading-normal table-fixed">',"</table>",[t._ssrNode('<thead><tr><th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">Requested At</th> <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">Recipient</th> <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Status</th> <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Actions</th></tr></thead> '),t._ssrNode("<tbody>","</tbody>",[t._ssrNode((t.payouts.length?"\x3c!----\x3e":'<tr><td colspan="3" class="text-xl text-gray-600 px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">You have no collection(s).</td></tr>')+" "),t._l(t.payouts,function(e){return t._ssrNode("<tr>","</tr>",[t._ssrNode('<td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-left"><div class="text-gray-900 whitespace-no-wrap">'+t._ssrEscape(t._s(t.formatTimestamp(e.created_at)))+'</div></td> <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm"><div><span class="font-bold">Complete Name:</span>'+t._ssrEscape("\n                "+t._s(e.name)+"\n              ")+'</div> <div><span class="font-bold">Mobile Number:</span>'+t._ssrEscape("\n                "+t._s(e.mobile)+"\n              ")+'</div> <div><span class="font-bold">Amount (PHP):</span>'+t._ssrEscape("\n                "+t._s(e.amount)+"\n              ")+'</div></td> <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"><span'+t._ssrClass("relative inline-block px-3 py-1 font-semibold leading-tight text-xs uppercase text-gray-800 rounded-full",{"bg-red-200":"declined"===e.status||"cancelled"===e.status,"bg-blue-200":"pending"===e.status,"bg-green-200":"paid"===e.status,"bg-yellow-200":"processing"===e.status})+">"+t._ssrEscape(t._s(e.status))+"</span></td> "),t._ssrNode('<td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">',"</td>",[t._ssrNode("<div>","</div>",["cancelled"!==e.status&&"paid"!==e.status&&"declined"!==e.status?r("button",{directives:[{name:"tippy",rawName:"v-tippy",value:{arrow:!0},expression:"{arrow: true}"}],staticClass:"px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1",attrs:{type:"button",title:"Decline Request"},on:{click:function(r){return t.updatePayoutStatusTo(e,"declined")}}},[r("font-awesome-icon",{attrs:{icon:["fas","times"]}}),t._ssrNode(' <span class="ml-1">DECLINE</span>')],2):t._e(),t._ssrNode(" "),"paid"!==e.status&&"cancelled"!==e.status?r("button",{directives:[{name:"tippy",rawName:"v-tippy",value:{arrow:!0},expression:"{arrow: true}"}],staticClass:"px-2 py-1 text-xs hover:bg-gray-200 border rounded mx-1",attrs:{type:"button",title:"processing"===e.status?"Mark as Paid":"Process Payout"},on:{click:function(r){return t.processPayout(e)}}},[r("font-awesome-icon",{attrs:{icon:["fas","check"]}}),t._ssrNode(' <span class="ml-1">'+t._ssrEscape("\n                    "+t._s(t.processBtnTextOf(e.status))+"\n                  ")+"</span>")],2):t._e()],2)])],2)})],2)],2)])])],2)},[],!1,null,null,"041412ec");e.default=component.exports}};
//# sourceMappingURL=73b512ad8992216c807d.js.map