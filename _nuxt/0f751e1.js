(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{383:function(t,e,r){var content=r(387);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(14).default)("292fe8dc",content,!0,{sourceMap:!1})},384:function(t,e,r){"use strict";r.r(e);r(8),r(64);var n=r(25),c={mixins:[r(385).a],props:{te:{type:Array}},created:function(){this.setData()},data:function(){return{total:0,source:0,location:0}},methods:{setData:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.getBacterias();case 2:r=e.sent,t.total=r.length,t.source=r.filter((function(t){return""!==t.source_isolated})).length,t.location=r.filter((function(t){return t.locationId>0})).length;case 6:case"end":return e.stop()}}),e)})))()}}},o=(r(386),r(73)),l=r(104),d=r.n(l),h=r(161),f=r(86),m=r(162),component=Object(o.a)(c,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-card",{staticClass:"mr-2",attrs:{height:"100%"}},[r("v-card-title",{attrs:{"primary-title":""}},[r("div",{staticClass:"pt-3"},[r("v-icon",{staticClass:"mr-2",attrs:{color:"light-blue accent-4"}},[t._v("fa-line-chart")]),t._v("Thống kê\n    ")],1)]),t._v(" "),r("v-card-text",[r("div",{staticStyle:{"border-bottom":"2px solid #F9AE3B",margin:"10px 0"}}),t._v(" "),r("div",{staticClass:"d-flex analytics mt-2"},[r("div",{staticStyle:{width:"60%"},attrs:{align:"left"}},[t._v("Số chủng:")]),t._v(" "),r("div",{staticStyle:{width:"40%"},attrs:{align:"right"}},[t._v(t._s(t.total))])]),t._v(" "),r("div",{staticClass:"d-flex analytics"},[r("div",{staticStyle:{width:"60%"},attrs:{align:"left"}},[t._v("Nguồn phân lập:")]),t._v(" "),r("div",{staticStyle:{width:"40%"},attrs:{align:"right"}},[t._v(t._s(t.source))])]),t._v(" "),r("div",{staticClass:"d-flex analytics"},[r("div",{staticStyle:{width:"60%"},attrs:{align:"left"}},[t._v("Địa điểm")]),t._v(" "),r("div",{staticStyle:{width:"40%"},attrs:{align:"right"}},[t._v(t._s(t.location))])])])],1)}),[],!1,null,"a53cc4b8",null);e.default=component.exports;d()(component,{VCard:h.a,VCardText:f.a,VCardTitle:f.b,VIcon:m.a})},385:function(t,e,r){"use strict";r.d(e,"a",(function(){return data}));r(26),r(8),r(9),r(10),r(64);var n=r(25),data={methods:{getBacterias:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$axios.get("".concat("http://localhost:3001/data","/bacterias.json?timestamp=").concat((new Date).getTime())).then((function(t){var e=t.data[2].data;return e.forEach((function(element){element.code||(element.code="")})),e})).catch((function(t){$nuxt.error({statusCode:t.response.status,message:t.message})}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))()},getLocation:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$axios.get("".concat("http://localhost:3001/data","/locations.json?timestamp=").concat((new Date).getTime())).then((function(t){return t.data[2].data})).catch((function(t){$nuxt.error({statusCode:t.response.status,message:t.message})}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))()},getCategories:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$axios.get("".concat("http://localhost:3001/data","/categories.json?timestamp=").concat((new Date).getTime())).then((function(t){return t.data[2].data})).catch((function(t){$nuxt.error({statusCode:t.response.status,message:t.message})}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))()},getCharacteristics:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$axios.get("".concat("http://localhost:3001/data","/characteristics.json?timestamp=").concat((new Date).getTime())).then((function(t){return t.data[2].data})).catch((function(t){$nuxt.error({statusCode:t.response.status,message:t.message})}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))()},getCharacteristicDetails:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$axios.get("".concat("http://localhost:3001/data","/characteristic_details.json?timestamp=").concat((new Date).getTime())).then((function(t){return t.data[2].data})).catch((function(t){$nuxt.error({statusCode:t.response.status,message:t.message})}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))()},getCharacteristicDetailValues:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$axios.get("".concat("http://localhost:3001/data","/bacteria_characteristic_details.json?timestamp=").concat((new Date).getTime())).then((function(e){return e.data[2].data.filter((function(e){return e.bacteriaId===t.$route.query.id}))})).catch((function(t){$nuxt.error({statusCode:t.response.status,message:t.message})}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))()},getClassifyValues:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$axios.get("".concat("http://localhost:3001/data","/bacteria_classifies.json?timestamp=").concat((new Date).getTime())).then((function(e){return e.data[2].data.filter((function(e){return e.bacteriaId===t.$route.query.id}))})).catch((function(t){$nuxt.error({statusCode:t.response.status,message:t.message})}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))()}}}},386:function(t,e,r){"use strict";r(383)},387:function(t,e,r){(e=r(13)(!1)).push([t.i,".analytics[data-v-a53cc4b8]{line-height:2em;font-size:1.16em;font-weight:700;border-bottom:1px dotted grey}",""]),t.exports=e},393:function(t,e,r){var content=r(408);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(14).default)("ee5fd020",content,!0,{sourceMap:!1})},403:function(t,e,r){t.exports=r.p+"img/first.cc707a6.jpg"},404:function(t,e,r){t.exports=r.p+"img/second.a44b20c.jpg"},405:function(t,e,r){t.exports=r.p+"img/third.714be22.jpg"},406:function(t,e,r){t.exports=r.p+"img/fourth.5a6ba16.jpg"},407:function(t,e,r){"use strict";r(393)},408:function(t,e,r){(e=r(13)(!1)).push([t.i,".frame[data-v-074c88c2]{margin:10px 1px}",""]),t.exports=e},422:function(t,e,r){"use strict";r.r(e);r(29),r(32),r(237);var n=r(384),c=r(403),o=r.n(c),l=r(404),d=r.n(l),h=r(405),f=r.n(h),m=r(406),v=r.n(m),x={data:function(){return{list:[],banners:[],first:o.a,second:d.a,third:f.a,fourth:v.a,search:{name:"",code:"",symbol:""}}},created:function(){this.banners.push({src:o.a}),this.banners.push({src:d.a}),this.banners.push({src:f.a}),this.banners.push({src:v.a})},mounted:function(){},methods:{onSearch:function(){var t={};this.search.name&&(t.name=this.search.name),this.search.symbol&&(t.symbol=this.search.symbol),this.search.code&&(t.code=this.search.code),this.$router.push({path:"/bacterias/",query:t})}},components:{analytic:n.default}},y=(r(407),r(73)),w=r(104),_=r.n(w),C=r(361),k=r(161),S=r(86),$=r(423),j=r(424),V=r(162),R=r(378),component=Object(y.a)(x,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("v-card",{staticClass:"mt-2"},[r("v-carousel",{attrs:{cycle:"",height:"250","hide-delimiter-background":"","show-arrows-on-hover":"",interval:"3000"}},t._l(t.banners,(function(t,i){return r("v-carousel-item",{key:i,attrs:{src:t.src}})})),1)],1),t._v(" "),r("div",{staticClass:"d-flex mt-3"},[r("div",{staticStyle:{width:"20%"}},[r("analytic")],1),t._v(" "),r("div",{staticStyle:{width:"80%"}},[r("v-card",[r("v-card-text",[r("div",{staticClass:"text-left mt-1 mb-3"},[t._v("\n            (*) Nhập một trong các điều kiện bên dưới để tìm kiếm.\n          ")]),t._v(" "),r("div",{staticClass:"d-flex"},[r("div",{staticStyle:{width:"80%"}},[r("div",{staticClass:"d-flex"},[r("div",{staticStyle:{width:"19%"}},[t._v("Tên vi khuẩn")]),t._v(" "),r("div",{staticClass:"mb-2",staticStyle:{width:"79%"}},[r("v-text-field",{staticClass:"search",attrs:{outlined:"","hide-details":"",placeholder:"Ví dụ: Bacillus subtilis"},on:{keyup:function(e){return e.type.indexOf("key")||13===e.keyCode?t.onSearch(e):null}},model:{value:t.search.name,callback:function(e){t.$set(t.search,"name",e)},expression:"search.name"}})],1)]),t._v(" "),r("div",{staticClass:"d-flex"},[r("div",{staticStyle:{width:"19%"}},[t._v("Ký hiệu")]),t._v(" "),r("div",{staticClass:"mb-2",staticStyle:{width:"79%"}},[r("v-text-field",{staticClass:"search",attrs:{outlined:"","hide-details":"",placeholder:"Ví dụ: B20.1"},on:{keyup:function(e){return e.type.indexOf("key")||13===e.keyCode?t.onSearch(e):null}},model:{value:t.search.symbol,callback:function(e){t.$set(t.search,"symbol",e)},expression:"search.symbol"}})],1)]),t._v(" "),r("div",{staticClass:"d-flex"},[r("div",{staticStyle:{width:"19%"}},[t._v("Mã vi khuẩn")]),t._v(" "),r("div",{staticClass:"mb-2",staticStyle:{width:"79%"}},[r("v-text-field",{staticClass:"search",attrs:{outlined:"","hide-details":"",placeholder:"Ví dụ: Ví dụ: RIA2.V001"},on:{keyup:function(e){return e.type.indexOf("key")||13===e.keyCode?t.onSearch(e):null}},model:{value:t.search.code,callback:function(e){t.$set(t.search,"code",e)},expression:"search.code"}})],1)])]),t._v(" "),r("div",{staticStyle:{width:"22%"}},[r("v-btn",{staticClass:"mb-2",attrs:{disabled:!t.search.name&&!t.search.code&&!t.search.symbol,color:"primary",block:"",height:"56"},on:{click:t.onSearch}},[r("v-icon",[t._v("fa-search")]),t._v("Tìm kiếm")],1)],1)])])],1)],1)])],1)}),[],!1,null,"074c88c2",null);e.default=component.exports;_()(component,{Analytic:r(384).default}),_()(component,{VBtn:C.a,VCard:k.a,VCardText:S.a,VCarousel:$.a,VCarouselItem:j.a,VIcon:V.a,VTextField:R.a})}}]);