(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{166:function(t,e,n){"use strict";(function(t){n(108);var o=n(72),r=n.n(o);e.a=function(e){var n=e.$axios,o=e.redirect;n.defaults.baseURL=t.env.apiBaseUrl,n.onRequest((function(t){})),n.onError((function(e){if(~e.message.indexOf("code 401"))o("/");else if(!~e.message.indexOf("code 403")){console.log(e);var n={level:"ERROR-AXIOS",ua:window.navigator.userAgent.toLowerCase(),status:e.statusCode,message:e.message,stack:e.stack};r.a.post("".concat(t.env.slsBaseUrl,"/js-logging-biz"),n).catch((function(t){console.log(t)}))}}))}}).call(this,n(157))},167:function(t,e,n){"use strict";n(7),n(8),n(9),n(16),n(17),n(11),n(10);var o=n(2),r=n(0),c=n(85),l=n(132);function f(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function d(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?f(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):f(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}r.a.component("ValidationProvider",c.a),Object(c.b)({bails:!1}),Object(c.c)("required",d({},l.c)),Object(c.c)("max",d({},l.b)),Object(c.c)("email",d({},l.a))},168:function(t,e){},169:function(t,e,n){"use strict";var o=n(232);e.a=function(t){var e=t.store;window.onNuxtReady((function(){new o.a({storage:window.sessionStorage}).plugin(e)}))}},203:function(t,e,n){var content=n(267);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(14).default)("6570a8f6",content,!0,{sourceMap:!1})},205:function(t,e,n){var content=n(284);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(14).default)("56b15182",content,!0,{sourceMap:!1})},228:function(t,e,n){t.exports=n.p+"img/bacteria.5a9e779.svg"},235:function(t,e,n){"use strict";n(29);var o=n(228),r=n.n(o),c={data:function(){return{topSearch:"",bacteria:r.a,icons:["fa-facebook-square","fa-twitter-square"],fixed:!1,items:[{icon:"mdi-apps",title:"Welcome",to:"/"},{icon:"mdi-chart-bubble",title:"Inspire",to:"/inspire"}],miniVariant:!1,right:!0,rightDrawer:!1,title:"Vuetify.js"}},mounted:function(){this.$route.query.keyword&&(this.topSearch=this.$route.query.keyword)},methods:{onSearch:function(){this.topSearch&&this.$router.push({path:"/bacterias/",query:{keyword:this.topSearch}})},getMenuClass:function(t){return t===this.$route.name?"menu-btn-active":"menu-btn"},onHome:function(){this.$router.push("/")},onContact:function(){this.$router.push("/contact")},onLogin:function(){this.$router.push("/login")},onBacterias:function(){this.$router.push("/bacterias")},onAboutus:function(){this.$router.push("/about-us")}}},l=(n(283),n(73)),f=n(104),d=n.n(f),v=n(371),h=n(379),m=n(361),x=n(161),_=n(86),y=n(372),w=n(373),k=n(374),C=n(162),O=n(375),j=n(376),S=n(377),V=n(378),component=Object(l.a)(c,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-app",[n("v-app-bar",{attrs:{outlined:"",elevation:"0",fixed:"",app:"",height:"110"}},[n("div",{staticStyle:{width:"100%"},attrs:{align:"center"}},[n("v-container",[n("v-layout",{attrs:{row:"",wrap:"","frame-top":""}},[n("v-flex",{attrs:{xs9:""}},[n("div",{attrs:{align:"left"}},[n("img",{staticStyle:{cursor:"pointer"},attrs:{src:t.bacteria,width:"50",title:"Website lưu trữ thông tin các chủng vi khuẩn phục vụ nuôi trồng thủy sản"},on:{click:t.onHome}}),t._v(" "),n("span",{staticClass:"logo-1"},[t._v(" THÔNG TIN ")]),t._v(" "),n("span",{staticClass:"logo-2"},[t._v(" VI KHUẨN ")]),t._v(" "),n("span",{staticClass:"logo-1"},[t._v(" TRỰC TUYẾN ")])])]),t._v(" "),n("v-flex",{attrs:{xs3:"","d-flex":"","text-right":"","pt-3":""}},[n("v-icon",{staticClass:"mr-1",attrs:{color:"blue",size:"30"}},[t._v("fa-facebook-square")]),t._v(" "),n("v-icon",{staticClass:"mr-1",attrs:{color:"blue",size:"30"}},[t._v("fa-twitter-square")]),t._v(" "),n("v-text-field",{staticClass:"search-top",attrs:{outlined:"","hide-details":"","append-icon":"fa-search",placeholder:"Tên, ký hiệu, ..."},on:{"click:append":t.onSearch,keyup:function(e){return e.type.indexOf("key")||13===e.keyCode?t.onSearch(e):null}},model:{value:t.topSearch,callback:function(e){t.topSearch=e},expression:"topSearch"}})],1)],1)],1),t._v(" "),n("div",{staticClass:"menu"},[n("v-container",{staticClass:"pa-0"},[n("v-layout",{attrs:{row:"",wrap:"","ml-1":""}},[n("v-flex",{attrs:{xs8:"","d-flex":""}},[n("v-icon",{staticClass:"menu-icon mr-2",attrs:{color:"blue darken-3"},on:{click:t.onHome}},[t._v("fa-home")]),t._v(" "),n("ul",{staticClass:"menu-btn"},[n("li",{class:t.getMenuClass("about-us")},[n("nuxt-link",{attrs:{to:"/about-us"}},[t._v("Giới thiệu")])],1),t._v(" "),n("li",{class:t.getMenuClass("bacterias")},[n("nuxt-link",{attrs:{to:"/bacterias"}},[t._v("Thông tin vi khuẩn")])],1),t._v(" "),n("li",{class:t.getMenuClass("contact")},[n("nuxt-link",{attrs:{to:"/contact"}},[t._v("Liên hệ")])],1)])],1),t._v(" "),n("v-flex",{attrs:{xs4:"","text-right":""}})],1)],1)],1)],1)]),t._v(" "),n("v-main",[n("v-container",[n("nuxt")],1)],1),t._v(" "),n("v-container",[n("v-footer",{attrs:{dark:"",padless:""}},[n("v-card",{staticClass:"flex",attrs:{flat:"",tile:""}},[n("v-card-title",{staticClass:"teal"},[n("div",[n("strong",{staticClass:"subheading"},[t._v("Trung tâm lưu trữ các chủng loại vi khuẩn phục vụ nuôi trồng thủy\n            sản\n          ")]),t._v(" "),n("div",{staticStyle:{"font-size":"13px","line-height":"18px","font-weight":"normal"}},[t._v("\n            Trụ sở: 123 Nguyễn Thái Bình, Phường 3, Quận Tân Phú, Hồ Chí Minh\n            "),n("br"),t._v("\n            Điện thoại: 08.3343433   Fax: 08.3343433"),n("br"),t._v("\n            email: abc@yahoo.com\n          ")])]),t._v(" "),n("v-spacer"),t._v(" "),t._l(t.icons,(function(e){return n("v-btn",{key:e,attrs:{dark:"",icon:""}},[n("v-icon",{attrs:{size:"24px"}},[t._v(t._s(e))])],1)}))],2),t._v(" "),n("v-card-text",{staticClass:"py-2 white--text text-center"},[t._v("\n        Copyright©"+t._s((new Date).getFullYear())+"\n      ")])],1)],1)],1)],1)}),[],!1,null,null,null);e.a=component.exports;d()(component,{VApp:v.a,VAppBar:h.a,VBtn:m.a,VCard:x.a,VCardText:_.a,VCardTitle:_.b,VContainer:y.a,VFlex:w.a,VFooter:k.a,VIcon:C.a,VLayout:O.a,VMain:j.a,VSpacer:S.a,VTextField:V.a})},239:function(t,e,n){n(240),t.exports=n(241)},266:function(t,e,n){"use strict";n(203)},267:function(t,e,n){(e=n(13)(!1)).push([t.i,"h1[data-v-495dc2cf]{font-size:20px}",""]),t.exports=e},272:function(t,e,n){var content=n(273);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(14).default)("5c670272",content,!0,{sourceMap:!1})},273:function(t,e,n){(e=n(13)(!1)).push([t.i,'html{font-family:"Source Sans Pro",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;font-size:16px;word-spacing:1px;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;box-sizing:border-box}*,:after,:before{box-sizing:border-box;margin:0}.v-text-field.v-text-field--enclosed .v-input__append-inner,.v-text-field.v-text-field--enclosed .v-input__append-outer,.v-text-field.v-text-field--enclosed .v-input__prepend-inner,.v-text-field.v-text-field--enclosed .v-input__prepend-outer{margin-top:7px!important}.v-card__title{padding:5px 15px!important}.v-breadcrumbs{padding:0!important}.container{max-width:1185px!important}',""]),t.exports=e},283:function(t,e,n){"use strict";n(205)},284:function(t,e,n){(e=n(13)(!1)).push([t.i,"ul.menu-btn{margin:0;padding:0}li.menu-btn,li.menu-btn-active{float:left;list-style:none;font-weight:700}li.menu-btn{color:#fff}li.menu-btn-active{background:#05a2d3;color:#fff}li.menu-btn a:active,li.menu-btn a:link,li.menu-btn a:visited{text-decoration:none;color:#fff;padding:0 10px}li.menu-btn a:hover{text-decoration:none;background:#05a2d3;display:block;padding:0 10px}li.menu-btn-active a:active,li.menu-btn-active a:link,li.menu-btn-active a:visited{text-decoration:none;color:#fff;padding:0 10px}.menu-icon{margin-top:-5px!important}.v-toolbar{box-shadow:0 1px 2px -1px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)}.v-toolbar__content,.v-toolbar__extension{margin:0!important}.menu{line-height:36px;background:#f9ae3b;margin:8px -17px 0;padding:0 48px}.logo-1,.logo-2{font-weight:700}.logo-1{font-size:1.3em}.logo-2{font-size:1.6em;color:#05a2d3}.frame-top{margin-top:8px}.search-top>.v-input__control>.v-input__slot{min-height:40px!important}.search-top .v-input__append-outer{margin-top:10px!important}",""]),t.exports=e},339:function(t,e,n){"use strict";n.r(e),n.d(e,"state",(function(){return o})),n.d(e,"getters",(function(){return r})),n.d(e,"mutations",(function(){return c})),n.d(e,"actions",(function(){return l}));var o=function(){return{loginId:null,loggedIn:!1,token:null,location:[],classifies:[],characteristics:[],categories:[]}},r={},c={setLocation:function(t,e){t.location=e},setClassifies:function(t,e){t.classifies=e},setCategories:function(t,e){t.categories=e},setCharacteristics:function(t,e){t.characteristics=e}},l={writeLocation:function(t,e){t.commit("setLocation",e)},writeClassifies:function(t,e){t.commit("setClassifies",e)},writeCategories:function(t,e){t.commit("setCategories",e)},writeCharacteristics:function(t,e){t.commit("setCharacteristics",e)}}},62:function(t,e,n){"use strict";var o={layout:"empty",props:{error:{type:Object,default:null}},data:function(){return{pageNotFound:"404 Not Found",otherError:"An error occurred"}},head:function(){return{title:404===this.error.statusCode?this.pageNotFound:this.otherError}}},r=(n(266),n(73)),c=n(104),l=n.n(c),f=n(371),component=Object(r.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-app",{attrs:{dark:""}},[404===t.error.statusCode?n("h1",[t._v("\n    "+t._s(t.pageNotFound)+"\n  ")]):n("h1",[t._v("\n    "+t._s(t.otherError)+"\n  ")]),t._v(" "),n("NuxtLink",{attrs:{to:"/"}},[t._v(" Home page ")])],1)}),[],!1,null,"495dc2cf",null);e.a=component.exports;l()(component,{VApp:f.a})}},[[239,8,1,9]]]);