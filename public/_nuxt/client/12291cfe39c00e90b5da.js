(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{875:function(e,t,r){"use strict";r.r(t);var o=[function(){var e=this.$createElement,t=this._self._c||e;return t("div",[t("img",{staticClass:"w-16 mx-auto mb-3",attrs:{src:r(156)}})])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"mb-3"},[t("button",{staticClass:"w-full items-center justify-center focus:outline-none outline-none flex flex-grow border px-3 py-2 font-bold rounded text-white border-white bg-primary hover:bg-primary-lighter"},[this._v("SIGN IN")])])}],n=(r(15),r(1)),l={layout:"empty",head:{title:"Admin Login"},middleware:"admin-auth",data:function(){return{isLoginFailed:!1,formData:{email:null,password:null},isLoading:!1}},methods:{signIn:function(){var e=Object(n.a)(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return this.isLoading=!0,e.next=3,this.$store.dispatch("user/signIn",this.formData);case 3:if(t=e.sent,this.isLoading=!1,t.status){e.next=8;break}return this.isLoginFailed=!0,e.abrupt("return");case 8:this.$axios.setToken(t.user.token,"Bearer"),this.$router.push("/admin/collections");case 10:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()}},d=r(7),component=Object(d.a)(l,function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"flex flex-grow min-h-screen justify-center mt-32"},[e.isLoading?r("AreaLoader",{attrs:{fullscreen:""}}):e._e(),e._v(" "),r("form",{staticClass:"w-3/12",on:{submit:function(t){return t.preventDefault(),e.signIn(t)}}},[r("div",{staticClass:"shadow-xl rounded-lg flex flex-col p-6"},[e._m(0),e._v(" "),r("div",{staticClass:"text-3xl font-bold text-center"},[e._v("Admin Login")]),e._v(" "),r("div",{staticClass:"mb-3 mt-3"},[r("label",{staticClass:"font-bold",attrs:{for:"email"}},[e._v("Email")]),e._v(" "),r("div",[r("input",{directives:[{name:"model",rawName:"v-model",value:e.formData.email,expression:"formData.email"},{name:"validate",rawName:"v-validate",value:"required|email",expression:"'required|email'"}],staticClass:"w-full py-2 px-3 border rounded focus:outline-none outline-none",class:{"border-red-400":e.errors.has("email"),"focus:border-gray-600":!e.errors.has("email")},attrs:{name:"email",autocomplete:"off",type:"text",placeholder:"email@example.com","data-vv-as":"Email"},domProps:{value:e.formData.email},on:{input:function(t){t.target.composing||e.$set(e.formData,"email",t.target.value)}}})]),e._v(" "),e.errors.has("email")?r("span",{staticClass:"text-red-700 text-xs pt-1 font-bold inline-block"},[e._v(e._s(e.errors.first("email")))]):e._e()]),e._v(" "),r("div",{staticClass:"mb-3"},[r("label",{staticClass:"font-bold",attrs:{for:"pass"}},[e._v("Password")]),e._v(" "),r("div",[r("input",{directives:[{name:"model",rawName:"v-model",value:e.formData.password,expression:"formData.password"},{name:"validate",rawName:"v-validate",value:"required|min:6",expression:"'required|min:6'"}],staticClass:"w-full py-2 px-3 border rounded focus:outline-none outline-none",class:{"border-red-400":e.errors.has("pass"),"focus:border-gray-600":!e.errors.has("pass")},attrs:{type:"password",name:"pass",placeholder:"Password","data-vv-as":"Password"},domProps:{value:e.formData.password},on:{input:function(t){t.target.composing||e.$set(e.formData,"password",t.target.value)}}})]),e._v(" "),e.errors.has("pass")?r("span",{staticClass:"text-red-700 text-xs pt-1 font-bold inline-block"},[e._v(e._s(e.errors.first("pass")))]):e._e()]),e._v(" "),e.isLoginFailed?r("div",{staticClass:"mb-3 bg-red-200 text-red-500 p-3 rounded text-center"},[e._v("Invalid Email or Password. Please try again.")]):e._e(),e._v(" "),e._m(1)])])],1)},o,!1,null,null,null);t.default=component.exports}}]);