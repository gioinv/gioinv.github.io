import{q as S,n as B,r as _,s as R,v as N,x as E,y as T,g as U,z as I,A,B as w,C as D,D as F,E as x,G as O,H as L,I as V,J as H,K as z,L as M,M as $}from"./Jb1G6TOb.js";async function j(t,r=S()){const{path:f,matched:y}=r.resolve(t);if(!y.length||(r._routePreloaded||(r._routePreloaded=new Set),r._routePreloaded.has(f)))return;const e=r._preloadPromises=r._preloadPromises||[];if(e.length>4)return Promise.all(e).then(()=>j(t,r));r._routePreloaded.add(f);const a=y.map(o=>{var n;return(n=o.components)==null?void 0:n.default}).filter(o=>typeof o=="function");for(const o of a){const n=Promise.resolve(o()).catch(()=>{}).finally(()=>e.splice(e.indexOf(n)));e.push(n)}await Promise.all(e)}const G=(...t)=>t.find(r=>r!==void 0);function J(t){const r=t.componentName||"NuxtLink";function f(e,a){if(!e||t.trailingSlash!=="append"&&t.trailingSlash!=="remove")return e;if(typeof e=="string")return k(e,t.trailingSlash);const o="path"in e&&e.path!==void 0?e.path:a(e).path;return{...e,name:void 0,path:k(o,t.trailingSlash)}}function y(e){const a=S(),o=z(),n=x(()=>!!e.target&&e.target!=="_self"),v=x(()=>{const d=e.to||e.href||"";return typeof d=="string"&&O(d,{acceptRelative:!0})}),b=w("RouterLink"),m=b&&typeof b!="string"?b.useLink:void 0,g=x(()=>{if(e.external)return!0;const d=e.to||e.href||"";return typeof d=="object"?!1:d===""||v.value}),i=x(()=>{const d=e.to||e.href||"";return g.value?d:f(d,a.resolve)}),s=g.value||m==null?void 0:m({...e,to:i}),p=x(()=>{var d;if(!i.value||v.value)return i.value;if(g.value){const C=typeof i.value=="object"&&"path"in i.value?L(i.value):i.value,P=typeof C=="object"?a.resolve(C).href:C;return f(P,a.resolve)}return typeof i.value=="object"?((d=a.resolve(i.value))==null?void 0:d.href)??null:f(V(o.app.baseURL,i.value),a.resolve)});return{to:i,hasTarget:n,isAbsoluteUrl:v,isExternal:g,href:p,isActive:(s==null?void 0:s.isActive)??x(()=>i.value===a.currentRoute.value.path),isExactActive:(s==null?void 0:s.isExactActive)??x(()=>i.value===a.currentRoute.value.path),route:(s==null?void 0:s.route)??x(()=>a.resolve(i.value)),async navigate(){await H(p.value,{replace:e.replace,external:g.value||n.value})}}}return B({name:r,props:{to:{type:[String,Object],default:void 0,required:!1},href:{type:[String,Object],default:void 0,required:!1},target:{type:String,default:void 0,required:!1},rel:{type:String,default:void 0,required:!1},noRel:{type:Boolean,default:void 0,required:!1},prefetch:{type:Boolean,default:void 0,required:!1},prefetchOn:{type:[String,Object],default:void 0,required:!1},noPrefetch:{type:Boolean,default:void 0,required:!1},activeClass:{type:String,default:void 0,required:!1},exactActiveClass:{type:String,default:void 0,required:!1},prefetchedClass:{type:String,default:void 0,required:!1},replace:{type:Boolean,default:void 0,required:!1},ariaCurrentValue:{type:String,default:void 0,required:!1},external:{type:Boolean,default:void 0,required:!1},custom:{type:Boolean,default:void 0,required:!1}},useLink:y,setup(e,{slots:a}){const o=S(),{to:n,href:v,navigate:b,isExternal:m,hasTarget:g,isAbsoluteUrl:i}=y(e),s=_(!1),p=_(null),d=l=>{var c;p.value=e.custom?(c=l==null?void 0:l.$el)==null?void 0:c.nextElementSibling:l==null?void 0:l.$el};function C(l){var c,u;return!s.value&&(typeof e.prefetchOn=="string"?e.prefetchOn===l:((c=e.prefetchOn)==null?void 0:c[l])??((u=t.prefetchOn)==null?void 0:u[l]))&&(e.prefetch??t.prefetch)!==!1&&e.noPrefetch!==!0&&e.target!=="_blank"&&!Q()}async function P(l=R()){if(s.value)return;s.value=!0;const c=typeof n.value=="string"?n.value:m.value?L(n.value):o.resolve(n.value).fullPath;await Promise.all([l.hooks.callHook("link:prefetch",c).catch(()=>{}),!m.value&&!g.value&&j(n.value,o).catch(()=>{})])}if(C("visibility")){const l=R();let c,u=null;N(()=>{const h=K();E(()=>{c=T(()=>{var q;(q=p==null?void 0:p.value)!=null&&q.tagName&&(u=h.observe(p.value,async()=>{u==null||u(),u=null,await P(l)}))})})}),U(()=>{c&&I(c),u==null||u(),u=null})}return()=>{var u;if(!m.value&&!g.value){const h={ref:d,to:n.value,activeClass:e.activeClass||t.activeClass,exactActiveClass:e.exactActiveClass||t.exactActiveClass,replace:e.replace,ariaCurrentValue:e.ariaCurrentValue,custom:e.custom};return e.custom||(C("interaction")&&(h.onPointerenter=P.bind(null,void 0),h.onFocus=P.bind(null,void 0)),s.value&&(h.class=e.prefetchedClass||t.prefetchedClass),h.rel=e.rel||void 0),A(w("RouterLink"),h,a.default)}const l=e.target||null,c=G(e.noRel?"":e.rel,t.externalRelAttribute,i.value||g.value?"noopener noreferrer":"")||null;return e.custom?a.default?a.default({href:v.value,navigate:b,prefetch:P,get route(){if(!v.value)return;const h=new URL(v.value,window.location.href);return{path:h.pathname,fullPath:h.pathname,get query(){return D(h.search)},hash:h.hash,params:{},name:void 0,matched:[],redirectedFrom:void 0,meta:{},href:v.value}},rel:c,target:l,isExternal:m.value||g.value,isActive:!1,isExactActive:!1}):null:A("a",{ref:p,href:v.value||null,rel:c,target:l},(u=a.default)==null?void 0:u.call(a))}}})}const X=J(F);function k(t,r){const f=r==="append"?M:$;return O(t)&&!t.startsWith("http")?t:f(t,!0)}function K(){const t=R();if(t._observer)return t._observer;let r=null;const f=new Map,y=(a,o)=>(r||(r=new IntersectionObserver(n=>{for(const v of n){const b=f.get(v.target);(v.isIntersecting||v.intersectionRatio>0)&&b&&b()}})),f.set(a,o),r.observe(a),()=>{f.delete(a),r.unobserve(a),f.size===0&&(r.disconnect(),r=null)});return t._observer={observe:y}}function Q(){const t=navigator.connection;return!!(t&&(t.saveData||/2g/.test(t.effectiveType)))}export{X as _};
