(function(){
class DCLogic{constructor(p){this.props=p||{};this.state={}} setState(o){if(typeof o==='function')o=o(this.state);Object.assign(this.state,o);schedule()}}
window.DCLogic=DCLogic;let comp,tplNodes,mount,pending=false;
function schedule(){if(pending)return;pending=true;Promise.resolve().then(()=>{pending=false;draw()})}
function get(p,sc){p=p.trim();if(p==='true')return true;if(p==='false')return false;if(/^-?\d+(\.\d+)?$/.test(p))return +p;let v=sc;for(const k of p.split('.')){if(v==null)return undefined;v=v[k]}return v}
const H=/\{\{([^}]+)\}\}/g;
function interp(s,sc){return s.replace(H,(m,p)=>{const v=get(p,sc);return v==null?'':String(v)})}
function raw(s,sc){const m=s.match(/^\{\{([^}]+)\}\}$/);return m?get(m[1],sc):interp(s,sc)}
function render(n,sc){
 if(n.nodeType===3)return [document.createTextNode(interp(n.nodeValue,sc))];
 if(n.nodeType!==1)return [];
 const t=n.tagName.toLowerCase();
 if(t==='sc-if'){return raw(n.getAttribute('value'),sc)?kids(n,sc):[]}
 if(t==='sc-for'){const l=raw(n.getAttribute('list'),sc)||[];const as=n.getAttribute('as');let out=[];l.forEach(it=>{const s2=Object.create(sc);s2[as]=it;out=out.concat(kids(n,s2))});return out}
 const e=document.createElementNS(n.namespaceURI,n.localName);
 for(const a of n.attributes){if(a.name.startsWith('hint-'))continue;
  if(/^on[a-z]/i.test(a.name)){const f=raw(a.value,sc);if(typeof f==='function')e.addEventListener(a.name.slice(2).toLowerCase(),f);continue}
  e.setAttribute(a.name,interp(a.value,sc))}
 if(t==='template'){return [e]}
 kids(n,sc).forEach(c=>e.appendChild(c));return [e]}
function kids(n,sc){let o=[];n.childNodes.forEach(c=>{o=o.concat(render(c,sc))});return o}
function draw(){const v=comp.renderVals();const f=document.createDocumentFragment();tplNodes.forEach(n=>render(n,v).forEach(c=>f.appendChild(c)));mount.replaceChildren(f)}
document.addEventListener('DOMContentLoaded',()=>{
 const x=document.querySelector('x-dc');const h=x.querySelector('helmet');if(h){[...h.childNodes].forEach(c=>document.head.appendChild(c));h.remove()}
 const sc=[...document.scripts].find(s=>s.textContent.includes('class Component'));
 const C=new Function(sc.textContent+';return Component')();
 let props={};try{props=JSON.parse(sc.dataset.props||'{}')}catch(e){};const pv={};for(const k in props)pv[k]=props[k].default;
 const q=new URLSearchParams(location.search);if(q.get('theme'))pv.theme=q.get('theme');
 tplNodes=[...x.childNodes];mount=document.createElement('div');x.replaceWith(mount);
 comp=new C(pv);if(!comp.state)comp.state={};window.__comp=comp;draw();
 window.addEventListener('scroll',()=>{if(comp.state&&'sy' in comp.state){comp.state.sy=window.scrollY;schedule()}},{passive:true});
});
})();
