(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{380:function(t,e,r){"use strict";r.r(e);var n={props:{source:{type:Array}},created:function(){this.list.push(this.source[0])},data:function(){return{list:[{text:"Trang chủ",disabled:!1,href:"/"}]}}},c=r(73),o=r(104),l=r.n(o),d=(r(7),r(8),r(9),r(74),r(16),r(17),r(11),r(10),r(2)),f=(r(381),r(76)),v=r(6);function h(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}function m(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?h(Object(source),!0).forEach((function(e){Object(d.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):h(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}var _=Object(v.a)(f.a).extend({name:"v-breadcrumbs-item",props:{activeClass:{type:String,default:"v-breadcrumbs__item--disabled"},ripple:{type:[Boolean,Object],default:!1}},computed:{classes:function(){return Object(d.a)({"v-breadcrumbs__item":!0},this.activeClass,this.disabled)}},render:function(t){var e=this.generateRouteLink(),r=e.tag,data=e.data;return t("li",[t(r,m(m({},data),{},{attrs:m(m({},data.attrs),{},{"aria-current":this.isActive&&this.isLink?"page":void 0})}),this.$slots.default)])}}),x=r(1),y=Object(x.e)("v-breadcrumbs__divider","li"),w=r(24);function C(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}var O=Object(v.a)(w.a).extend({name:"v-breadcrumbs",props:{divider:{type:String,default:"/"},items:{type:Array,default:function(){return[]}},large:Boolean},computed:{classes:function(){return function(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?C(Object(source),!0).forEach((function(e){Object(d.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):C(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}({"v-breadcrumbs--large":this.large},this.themeClasses)}},methods:{genDivider:function(){return this.$createElement(y,this.$slots.divider?this.$slots.divider:this.divider)},genItems:function(){for(var t=[],e=!!this.$scopedSlots.item,r=[],i=0;i<this.items.length;i++){var n=this.items[i];r.push(n.text),e?t.push(this.$scopedSlots.item({item:n})):t.push(this.$createElement(_,{key:r.join("."),props:n},[n.text])),i<this.items.length-1&&t.push(this.genDivider())}return t}},render:function(t){var e=this.$slots.default||this.genItems();return t("ul",{staticClass:"v-breadcrumbs",class:this.classes},e)}}),j=r(162),component=Object(c.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-breadcrumbs",{staticClass:"mb-2 mt-2",attrs:{items:t.list},scopedSlots:t._u([{key:"divider",fn:function(){return[r("v-icon",[t._v("mdi-chevron-right")])]},proxy:!0}])})}),[],!1,null,null,null);e.default=component.exports;l()(component,{VBreadcrumbs:O,VIcon:j.a})},381:function(t,e,r){var content=r(382);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(14).default)("b1bed018",content,!0,{sourceMap:!1})},382:function(t,e,r){(e=r(13)(!1)).push([t.i,".theme--light.v-breadcrumbs .v-breadcrumbs__divider,.theme--light.v-breadcrumbs .v-breadcrumbs__item--disabled{color:rgba(0,0,0,.38)}.theme--dark.v-breadcrumbs .v-breadcrumbs__divider,.theme--dark.v-breadcrumbs .v-breadcrumbs__item--disabled{color:hsla(0,0%,100%,.5)}.v-breadcrumbs{align-items:center;display:flex;flex-wrap:wrap;flex:0 1 auto;list-style-type:none;margin:0;padding:18px 12px}.v-breadcrumbs li{align-items:center;display:inline-flex;font-size:14px}.v-breadcrumbs li .v-icon{font-size:16px}.v-breadcrumbs li:nth-child(2n){padding:0 12px}.v-breadcrumbs__item{align-items:center;display:inline-flex;text-decoration:none;transition:.3s cubic-bezier(.25,.8,.5,1)}.v-breadcrumbs__item--disabled{pointer-events:none}.v-breadcrumbs--large li,.v-breadcrumbs--large li .v-icon{font-size:16px}",""]),t.exports=e},383:function(t,e,r){var content=r(387);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(14).default)("292fe8dc",content,!0,{sourceMap:!1})},384:function(t,e,r){"use strict";r.r(e);r(8),r(64);var n=r(25),c={mixins:[r(385).a],props:{te:{type:Array}},created:function(){this.setData()},data:function(){return{total:0,source:0,location:0}},methods:{setData:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.getBacterias();case 2:r=e.sent,t.total=r.length,t.source=r.filter((function(t){return""!==t.source_isolated})).length,t.location=r.filter((function(t){return t.locationId>0})).length;case 6:case"end":return e.stop()}}),e)})))()}}},o=(r(386),r(73)),l=r(104),d=r.n(l),f=r(161),v=r(86),h=r(162),component=Object(o.a)(c,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-card",{staticClass:"mr-2",attrs:{height:"100%"}},[r("v-card-title",{attrs:{"primary-title":""}},[r("div",{staticClass:"pt-3"},[r("v-icon",{staticClass:"mr-2",attrs:{color:"light-blue accent-4"}},[t._v("fa-line-chart")]),t._v("Thống kê\n    ")],1)]),t._v(" "),r("v-card-text",[r("div",{staticStyle:{"border-bottom":"2px solid #F9AE3B",margin:"10px 0"}}),t._v(" "),r("div",{staticClass:"d-flex analytics mt-2"},[r("div",{staticStyle:{width:"60%"},attrs:{align:"left"}},[t._v("Số chủng:")]),t._v(" "),r("div",{staticStyle:{width:"40%"},attrs:{align:"right"}},[t._v(t._s(t.total))])]),t._v(" "),r("div",{staticClass:"d-flex analytics"},[r("div",{staticStyle:{width:"60%"},attrs:{align:"left"}},[t._v("Nguồn phân lập:")]),t._v(" "),r("div",{staticStyle:{width:"40%"},attrs:{align:"right"}},[t._v(t._s(t.source))])]),t._v(" "),r("div",{staticClass:"d-flex analytics"},[r("div",{staticStyle:{width:"60%"},attrs:{align:"left"}},[t._v("Địa điểm")]),t._v(" "),r("div",{staticStyle:{width:"40%"},attrs:{align:"right"}},[t._v(t._s(t.location))])])])],1)}),[],!1,null,"a53cc4b8",null);e.default=component.exports;d()(component,{VCard:f.a,VCardText:v.a,VCardTitle:v.b,VIcon:h.a})},385:function(t,e,r){"use strict";r.d(e,"a",(function(){return data}));r(26),r(8),r(9),r(10),r(64);var n=r(25),data={methods:{getBacterias:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$axios.get("".concat(t.$config.DATA_URL,"/bacterias.json?timestamp=").concat((new Date).getTime())).then((function(t){var e=t.data[2].data;return e.forEach((function(element){element.code||(element.code="")})),e})).catch((function(t){$nuxt.error({statusCode:t.response.status,message:t.message})}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))()},getLocation:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$axios.get("".concat(t.$config.DATA_URL,"/locations.json?timestamp=").concat((new Date).getTime())).then((function(t){return t.data[2].data})).catch((function(t){$nuxt.error({statusCode:t.response.status,message:t.message})}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))()},getCategories:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$axios.get("".concat(t.$config.DATA_URL,"/categories.json?timestamp=").concat((new Date).getTime())).then((function(t){return t.data[2].data})).catch((function(t){$nuxt.error({statusCode:t.response.status,message:t.message})}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))()},getCharacteristics:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$axios.get("".concat(t.$config.DATA_URL,"/characteristics.json?timestamp=").concat((new Date).getTime())).then((function(t){return t.data[2].data})).catch((function(t){$nuxt.error({statusCode:t.response.status,message:t.message})}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))()},getCharacteristicDetails:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$axios.get("".concat(t.$config.DATA_URL,"/characteristic_details.json?timestamp=").concat((new Date).getTime())).then((function(t){return t.data[2].data})).catch((function(t){$nuxt.error({statusCode:t.response.status,message:t.message})}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))()},getCharacteristicDetailValues:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$axios.get("".concat(t.$config.DATA_URL,"/bacteria_characteristic_details.json?timestamp=").concat((new Date).getTime())).then((function(e){return e.data[2].data.filter((function(e){return e.bacteriaId===t.$route.query.id}))})).catch((function(t){$nuxt.error({statusCode:t.response.status,message:t.message})}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))()},getClassifyValues:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$axios.get("".concat(t.$config.DATA_URL,"/bacteria_classifies.json?timestamp=").concat((new Date).getTime())).then((function(e){return e.data[2].data.filter((function(e){return e.bacteriaId===t.$route.query.id}))})).catch((function(t){$nuxt.error({statusCode:t.response.status,message:t.message})}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))()}}}},386:function(t,e,r){"use strict";r(383)},387:function(t,e,r){(e=r(13)(!1)).push([t.i,".analytics[data-v-a53cc4b8]{line-height:2em;font-size:1.16em;font-weight:700;border-bottom:1px dotted grey}",""]),t.exports=e},388:function(t,e,r){"use strict";r.d(e,"a",(function(){return n}));r(105),r(29),r(11);var n={methods:{DisplayEmpty:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"-";return t||e},getName:function(t,e){if(!t||0===t.length)return"-";var rt=t.find((function(t){return t.id===e}));return void 0!==rt?rt.name:""},gotoPage:function(t){var data=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];e?location.href=t:Object.keys(data).length>0?this.$router.push({path:t,query:data}):this.$router.push(t)}}}},390:function(t,e,r){"use strict";(function(t){r(8),r(105),r(9),r(57),r(75),r(10),r(64);var n=r(25),c=r(380),o=r(384),l=r(388),d=r(385);e.a={validate:function(t){return/^\d+$/.test(t.query.id)},mixins:[l.a,d.a],head:function(){return{title:"Thông tin chi tiết vi khuẩn vi khuẩn"}},data:function(){return{bacteria:{},classifies:this.$store.state.classifies,classifyValues:[],isLoadClassify:!1,characteristics:this.$store.state.characteristics,characteristicValues:[],naviB:[{text:"Danh sách chủng vi khuẩn",disabled:!1,href:"/bacterias"},{text:"Chi tiết",disabled:!0}],isLoadCharact:!1,isLoadCharactDetail:!1}},created:function(){0===this.$store.state.location.length&&this.setLocation(),0===this.$store.state.categories.length&&this.setCategories(),this.setCharactics(),this.setClassifies()},mounted:function(){this.inits()},methods:{inits:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.getBacterias();case 2:r=e.sent,t.bacteria=r.find((function(e){return e.id=t.$route.query.id}));case 4:case"end":return e.stop()}}),e)})))()},getValClass:function(t,e){if(0===t.length)return"-";var rt=t.find((function(t){return t.classifyId===e}));return void 0!==rt?rt.value:""},getValCharacs:function(t,e){if(!t||0===t.length)return"";var rt=t.find((function(t){return t.characteristic_detailId===e}));return void 0!==rt?rt.value.includes("NULL")?"":rt.value:""},setClassifies:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.isLoadClassify=!0,0!==t.$store.state.classifies.length){e.next=7;break}return e.t0=t.$store,e.next=5,t.getClassifies();case 5:e.t1=e.sent,e.t0.dispatch.call(e.t0,"writeClassifies",e.t1);case 7:return e.next=9,t.getClassifyValues();case 9:t.classifyValues=e.sent,t.isLoadClassify=!1;case 11:case"end":return e.stop()}}),e)})))()},getClassifies:function(){var e=this;return Object(n.a)(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,e.$axios.get("".concat(t.env.API_URL,"/api/classifies")).then((function(t){return t.data})).catch((function(t){$nuxt.error({statusCode:t.response.status,message:t.message})}));case 2:return r.abrupt("return",r.sent);case 3:case"end":return r.stop()}}),r)})))()},setLocation:function(){var t=this;this.isLoadClassify=!0,this.getLocation().then((function(e){t.$store.dispatch("writeLocation",e),t.isLoadClassify=!1}))},setCategories:function(){var t=this;this.getCategories().then((function(e){t.$store.dispatch("writeCategories",e)}))},setCharactics:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){var r,details;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(0!==t.$store.state.characteristics.length){e.next=13;break}return t.isLoadCharact=!0,e.next=4,t.getCharacteristics();case 4:return r=e.sent,t.isLoadCharact=!1,t.isLoadCharactDetail=!0,e.next=9,t.getCharacteristicDetails();case 9:details=e.sent,t.isLoadCharactDetail=!1,r.forEach((function(t){details.filter((function(e){return e.characteristicId===t.id}));t.details=details.filter((function(e){return e.characteristicId===t.id}))})),t.$store.dispatch("writeCharacteristics",r);case 13:return e.next=15,t.getCharacteristicDetailValues();case 15:t.characteristicValues=e.sent;case 16:case"end":return e.stop()}}),e)})))()}},components:{navi:c.default,analytic:o.default}}}).call(this,r(138))},393:function(t,e,r){var content=r(403);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(14).default)("65b64fa4",content,!0,{sourceMap:!1})},402:function(t,e,r){"use strict";r(393)},403:function(t,e,r){(e=r(13)(!1)).push([t.i,".box[data-v-095b2592]{border:1px solid #bbdefb;border-radius:4px;padding:5px}.box>.subject[data-v-095b2592]{font-weight:700;margin:-16px 0 0 3px;background:#fff;width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;padding:0 5px}",""]),t.exports=e},423:function(t,e,r){"use strict";r.r(e);var n=r(390).a,c=(r(402),r(73)),o=r(104),l=r.n(o),d=r(161),f=r(86),v=r(373),h=r(162),m=r(375),_=r(160),component=Object(c.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("navi",{attrs:{source:t.naviB}}),t._v(" "),r("div",{staticClass:"d-flex mt-2"},[r("div",{staticStyle:{width:"20%"}},[r("analytic")],1),t._v(" "),r("div",{staticStyle:{width:"80%"}},[r("v-card",[r("v-card-text",[r("div",{staticClass:"title"},[r("strong",[t._v(t._s(t.bacteria.name))])]),t._v(" "),r("v-icon",{staticClass:"mr-1 ml-2",attrs:{color:"blue",size:"30"}},[t._v("fa-facebook-square")]),t._v(" "),r("v-icon",{attrs:{color:"blue",size:"30"}},[t._v("fa-twitter-square")]),t._v(" "),r("v-layout",{attrs:{row:"",wrap:"","ml-1":"","mr-1":"","mt-2":""}},[r("v-flex",{attrs:{xs2:""}},[r("v-icon",{attrs:{size:"11",color:"grey light-2"}},[t._v("fa-play")]),t._v(" Ký hiệu:\n            ")],1),t._v(" "),r("v-flex",{attrs:{xs4:"","mb-2":""}},[t._v("\n              "+t._s(t.bacteria.symbol)+"\n            ")]),t._v(" "),r("v-flex",{attrs:{xs2:""}},[r("v-icon",{attrs:{size:"11",color:"grey light-2"}},[t._v("fa-play")]),t._v(" Mã chủng vi khuẩn:\n            ")],1),t._v(" "),r("v-flex",{attrs:{xs4:""}},[t._v("\n              "+t._s(t.bacteria.code)+"\n            ")]),t._v(" "),r("v-flex",{attrs:{xs2:"","mb-2":""}},[r("v-icon",{attrs:{size:"11",color:"grey light-2"}},[t._v("fa-play")]),t._v(" Nguồn phân lập:\n            ")],1),t._v(" "),r("v-flex",{attrs:{xs10:""}},[t._v("\n              "+t._s(t.bacteria.source_isolated)+"\n            ")]),t._v(" "),r("v-flex",{attrs:{xs2:"","mb-2":""}},[r("v-icon",{attrs:{size:"11",color:"grey light-2"}},[t._v("fa-play")]),t._v(" Chủng loại:\n            ")],1),t._v(" "),r("v-flex",{attrs:{xs10:""}},[t._v("\n              "+t._s(t.getName(t.$store.state.categories,t.bacteria.categoryId))+"\n            ")]),t._v(" "),r("v-flex",{attrs:{xs2:""}},[r("v-icon",{attrs:{size:"11",color:"grey light-2"}},[t._v("fa-play")]),t._v(" Địa điểm:\n            ")],1),t._v(" "),r("v-flex",{attrs:{xs10:""}},[t._v("\n              "+t._s(t.getName(t.$store.state.location,t.bacteria.locationId))+"\n            ")])],1),t._v(" "),r("div",{staticClass:"box mt-5"},[r("div",{staticClass:"subject"},[t._v("Phân loại")]),t._v(" "),t.isLoadClassify?r("v-progress-circular",{attrs:{indeterminate:"",color:"brown",size:"24"}}):t._e(),t._v(" "),t._l(t.$store.state.classifies,(function(e,i){return r("v-layout",{key:i,attrs:{row:"",wrap:"","ml-3":"","mb-1":""}},[r("v-flex",{attrs:{xs3:""}},[r("v-icon",{staticStyle:{"margin-top":"-3px"},attrs:{size:"14",color:"grey light-2"}},[t._v("fa-plus-circle")]),t._v(" "+t._s(e.name)+":\n                ")],1),t._v(" "),r("v-flex",{attrs:{xs9:""}},[t._v("\n                  "+t._s(t.getValClass(t.classifyValues,e.id))+"\n                ")])],1)}))],2),t._v(" "),t._l(t.$store.state.characteristics,(function(e,i){return r("div",{key:i,staticClass:"box mt-4"},[r("div",{staticClass:"subject"},[t._v(t._s(e.name))]),t._v(" "),t.isLoadCharact?r("v-progress-circular",{attrs:{indeterminate:"",color:"brown",size:"24"}}):t._e(),t._v(" "),t._l(e.details,(function(e,n){return r("v-layout",{key:n,attrs:{row:"",wrap:"","ml-3":"","mb-1":""}},[null!==e.name?r("v-flex",{attrs:{xs3:""}},[null===e.parentId?r("div",[r("v-icon",{staticStyle:{"margin-top":"-3px"},attrs:{size:"14",color:"grey light-2"}},[t._v("fa-plus-circle")]),t._v(" "+t._s(e.name)+":\n                  ")],1):t._e(),t._v(" "),null!==e.parentId?r("div",{staticClass:"ml-3"},[r("v-icon",{staticStyle:{"margin-top":"-3px"},attrs:{size:"12",color:"grey light-2"}},[t._v("fa-minus-circle")]),t._v(" "+t._s(e.name)+":\n                  ")],1):t._e(),t._v(" "),t.isLoadCharactDetail?r("v-progress-circular",{attrs:{indeterminate:"",color:"brown",size:"24"}}):t._e()],1):t._e(),t._v(" "),r("v-flex",{attrs:{xs9:""}},[t._v("\n                  \n                  "+t._s(t.getValCharacs(t.characteristicValues,e.id))+"\n                ")])],1)}))],2)}))],2)],1)],1)])],1)}),[],!1,null,"095b2592",null);e.default=component.exports;l()(component,{Navi:r(380).default,Analytic:r(384).default}),l()(component,{VCard:d.a,VCardText:f.a,VFlex:v.a,VIcon:h.a,VLayout:m.a,VProgressCircular:_.a})}}]);