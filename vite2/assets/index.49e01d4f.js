import{q as e,l as t,r as n,h as i,n as o,c as r,a,_ as l,G as s,b as d}from"./vendor.01bbadf9.js";!function(e=".",t="__import__"){try{self[t]=new Function("u","return import(u)")}catch(n){const i=new URL(e,location),o=e=>{URL.revokeObjectURL(e.src),e.remove()};self[t]=e=>new Promise(((n,r)=>{const a=new URL(e,i);if(self[t].moduleMap[a])return n(self[t].moduleMap[a]);const l=new Blob([`import * as m from '${a}';`,`${t}.moduleMap['${a}']=m;`],{type:"text/javascript"}),s=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(l),onerror(){r(new Error(`Failed to import: ${e}`)),o(s)},onload(){n(self[t].moduleMap[a]),o(s)}});document.head.appendChild(s)})),self[t].moduleMap={}}}("/vite2/assets/");let c=new Set;const p=e=>{var t;return"symbol"==typeof(null===(t=null==e?void 0:e.type)||void 0===t?void 0:t.$$typeof)},m=e=>{var t;return(null===(t=null==e?void 0:e.type)||void 0===t?void 0:t.$$typeof)===Symbol.for("react.forward_ref")},h=e=>{if(!e)return;const t=(e=>{const t=Object.keys(e).find((e=>e.startsWith("__reactInternalInstance$")||e.startsWith("__reactFiber$")));if(t)return e[t]})(e);return t||h(e.parentElement)},u=e=>{const t=null==e?void 0:e.type;if(!t)return;const{displayName:n,name:i}=t;return"string"==typeof n?n:"string"==typeof i?i:void 0},f=e=>{var t;return null!==(t=(e=>{if(!(null==e?void 0:e.pendingProps))return;const{"data-inspector-line":t,"data-inspector-column":n,"data-inspector-relative-path":i}=e.pendingProps;return t&&n&&i?{lineNumber:t,columnNumber:n,relativePath:i}:void 0})(e))&&void 0!==t?t:(e=>{if(!(null==e?void 0:e._debugSource))return;const{fileName:t,lineNumber:n,columnNumber:i}=e._debugSource;return t&&n?{lineNumber:String(n),columnNumber:String(null!=i?i:1),absolutePath:t}:void 0})(e)},g=e=>{if(!e)return;const t=(e=>{let t=e.return;for(;t;){if(!p(t))return t;t=t.return}return null})(e);if(!t)return;const n="string"==typeof(null==(i=t)?void 0:i.type);var i;const o=!t.child.sibling;let r=!n&&o?t:e;const a=r;for(;r;){if(f(r))return r;r=r.return}return a},v=e=>{const t=h(e),n=g(t);return f(n)},b=e=>{const t=h(e),n=g(t),i=(e=>{var t,n;let i,o=e;for(;o;){let e,r=null!==(t=o.return)&&void 0!==t?t:void 0;for(;p(r);)m(r)&&(e=r),r=null!==(n=null==r?void 0:r.return)&&void 0!==n?n:void 0;if(e&&(o=e),u(o)&&(i||(i=o),f(o)))return o;o=r}return i})(n),o=u(i),r=e.nodeName.toLowerCase();return{fiber:n,name:o,title:o?`${r} in <${o}>`:r}};function E(e){return e.getBoundingClientRect()}class w{constructor(e,t){this.node=e.createElement("div"),this.border=e.createElement("div"),this.padding=e.createElement("div"),this.content=e.createElement("div"),this.border.style.borderColor=x.border,this.padding.style.borderColor=x.padding,this.content.style.backgroundColor=x.background,Object.assign(this.node.style,{borderColor:x.margin,pointerEvents:"none",position:"fixed"}),this.node.style.zIndex="10000000",this.node.appendChild(this.border),this.border.appendChild(this.padding),this.padding.appendChild(this.content),t.appendChild(this.node)}remove(){this.node.parentNode&&this.node.parentNode.removeChild(this.node)}update(e,t){_(t,"margin",this.node),_(t,"border",this.border),_(t,"padding",this.padding),Object.assign(this.content.style,{height:e.height-t.borderTop-t.borderBottom-t.paddingTop-t.paddingBottom+"px",width:e.width-t.borderLeft-t.borderRight-t.paddingLeft-t.paddingRight+"px"}),Object.assign(this.node.style,{top:e.top-t.marginTop+"px",left:e.left-t.marginLeft+"px"})}}class y{constructor(e,t){this.tip=e.createElement("div"),Object.assign(this.tip.style,{display:"flex",flexFlow:"row nowrap",alignItems:"center",backgroundColor:"#333740",borderRadius:"2px",fontFamily:'"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',fontWeight:"bold",padding:"6px 8px",pointerEvents:"none",position:"fixed",fontSize:"12px",whiteSpace:"nowrap"}),this.nameSpan=e.createElement("span"),this.tip.appendChild(this.nameSpan),Object.assign(this.nameSpan.style,{display:"flex",flexDirection:"column",borderRight:"1px solid #aaaaaa",paddingRight:"0.8rem",marginRight:"0.8rem"}),this.titleDiv=e.createElement("div"),this.nameSpan.appendChild(this.titleDiv),Object.assign(this.titleDiv.style,{color:"#ee78e6",fontSize:"16px"}),this.infoDiv=e.createElement("div"),this.nameSpan.appendChild(this.infoDiv),Object.assign(this.infoDiv.style,{color:"#ee78e6",fontSize:"14px"}),this.dimSpan=e.createElement("span"),this.tip.appendChild(this.dimSpan),Object.assign(this.dimSpan.style,{color:"#d7d7d7"}),this.tip.style.zIndex="10000000",t.appendChild(this.tip)}remove(){this.tip.parentNode&&this.tip.parentNode.removeChild(this.tip)}updateText(e,t,n,i){this.titleDiv.textContent=e,this.infoDiv.textContent=null!=t?t:"",this.dimSpan.textContent=`${Math.round(n)}px × ${Math.round(i)}px`}updatePosition(e,t){const n=this.tip.getBoundingClientRect(),i=function(e,t,n){const i=Math.max(n.height,20),o=Math.max(n.width,60),r=5;let a;a=e.top+e.height+i<=t.top+t.height?e.top+e.height<t.top+0?t.top+r:e.top+e.height+r:e.top-i<=t.top+t.height?e.top-i-r<t.top+r?t.top+r:e.top-i-r:t.top+t.height-i-r;let l=e.left+r;e.left<t.left&&(l=t.left+r);e.left+o>t.left+t.width&&(l=t.left+t.width-o-r);return a+="px",l+="px",{style:{top:a,left:l}}}(e,t,{width:n.width,height:n.height});Object.assign(this.tip.style,i.style)}}class I{constructor(){const e=window.__REACT_DEVTOOLS_TARGET_WINDOW__||window;this.window=e;const t=window.__REACT_DEVTOOLS_TARGET_WINDOW__||window;this.tipBoundsWindow=t;const n=e.document;this.container=n.createElement("div"),this.container.style.zIndex="10000000",this.tip=new y(n,this.container),this.rects=[],this.removeCallback=()=>{},n.body.appendChild(this.container)}remove(){this.tip.remove(),this.rects.forEach((e=>{e.remove()})),this.rects.length=0,this.container.parentNode&&this.container.parentNode.removeChild(this.container),this.removeCallback()}setRemoveCallback(e){this.removeCallback=e.bind(this)}inspect(e,t,n){var i;const o=e.filter((e=>e.nodeType===Node.ELEMENT_NODE));for(;this.rects.length>o.length;){const e=this.rects.pop();null==e||e.remove()}if(0===o.length)return;for(;this.rects.length<o.length;)this.rects.push(new w(this.window.document,this.container));const r={top:Number.POSITIVE_INFINITY,right:Number.NEGATIVE_INFINITY,bottom:Number.NEGATIVE_INFINITY,left:Number.POSITIVE_INFINITY};if(o.forEach(((e,t)=>{const n=E(e,this.window),i=function(e){const t=window.getComputedStyle(e);return{borderLeft:parseInt(t.borderLeftWidth,10),borderRight:parseInt(t.borderRightWidth,10),borderTop:parseInt(t.borderTopWidth,10),borderBottom:parseInt(t.borderBottomWidth,10),marginLeft:parseInt(t.marginLeft,10),marginRight:parseInt(t.marginRight,10),marginTop:parseInt(t.marginTop,10),marginBottom:parseInt(t.marginBottom,10),paddingLeft:parseInt(t.paddingLeft,10),paddingRight:parseInt(t.paddingRight,10),paddingTop:parseInt(t.paddingTop,10),paddingBottom:parseInt(t.paddingBottom,10)}}(e);r.top=Math.min(r.top,n.top-i.marginTop),r.right=Math.max(r.right,n.left+n.width+i.marginRight),r.bottom=Math.max(r.bottom,n.top+n.height+i.marginBottom),r.left=Math.min(r.left,n.left-i.marginLeft);this.rects[t].update(n,i)})),!t){t=o[0].nodeName.toLowerCase();const e=o[0],n=null===(i=e.ownerDocument.defaultView)||void 0===i?void 0:i.__REACT_DEVTOOLS_GLOBAL_HOOK__;if(null==n?void 0:n.rendererInterfaces){let i=null;for(const t of n.rendererInterfaces.values()){const n=t.getFiberIDForNative(e,!0);if(null!==n){i=t.getDisplayNameForFiberID(n,!0);break}}i&&(t+=` (in ${i})`)}}this.tip.updateText(t,n,r.right-r.left,r.bottom-r.top);const a=E(this.tipBoundsWindow.document.documentElement,this.window);this.tip.updatePosition({top:r.top,left:r.left,height:r.bottom-r.top,width:r.right-r.left},{top:a.top+this.tipBoundsWindow.scrollY,left:a.left+this.tipBoundsWindow.scrollX,height:this.tipBoundsWindow.innerHeight,width:this.tipBoundsWindow.innerWidth})}}function _(e,t,n){Object.assign(n.style,{borderTopWidth:`${e[`${t}Top`]}px`,borderLeftWidth:`${e[`${t}Left`]}px`,borderRightWidth:`${e[`${t}Right`]}px`,borderBottomWidth:`${e[`${t}Bottom`]}px`,borderStyle:"solid"})}const x={background:"rgba(120, 170, 210, 0.7)",padding:"rgba(77, 200, 0, 0.3)",margin:"rgba(255, 155, 0, 0.3)",border:"rgba(255, 200, 50, 0.3)"},C=["control","shift","command","c"],L=o=>{const{keys:r,onHoverElement:a,onClickElement:l,disableLaunchEditor:s,children:d}=o,p=(null!=r?r:C).join("+"),[m,h]=n.useState(!1),u=n.useRef(),f=e=>{var t;const n=u.current,i=v(e),o=null==i?void 0:i.relativePath,{fiber:r,name:l,title:s}=b(e);null===(t=null==n?void 0:n.inspect)||void 0===t||t.call(n,[e],s,o),null==a||a({element:e,fiber:r,codeInfo:i,name:l})},g=n=>{var i;const o=u.current;null===(i=null==o?void 0:o.remove)||void 0===i||i.call(o),u.current=void 0,h(!1);const r=v(n),{fiber:a,name:d}=b(n);s||(n=>{if(!n)return;const{lineNumber:i,columnNumber:o,relativePath:r,absolutePath:a}=n,l=Boolean(r),s={fileName:l?r:a,lineNumber:i,colNumber:o};fetch(`${l?`${t}/relative`:t}?${e.stringify(s)}`)})(r),null==l||l({element:n,fiber:a,codeInfo:r,name:d})},E=()=>{const e=new I,t=function(e){function t(e){e&&"function"==typeof e.addEventListener&&(e.addEventListener("click",o,!0),e.addEventListener("mousedown",r,!0),e.addEventListener("mouseover",r,!0),e.addEventListener("mouseup",r,!0),e.addEventListener("pointerdown",a,!0),e.addEventListener("pointerover",l,!0),e.addEventListener("pointerup",s,!0))}function n(){i(window),c.forEach((function(e){try{i(e.contentWindow)}catch(t){}})),c=new Set}function i(e){e&&"function"==typeof e.removeEventListener&&(e.removeEventListener("click",o,!0),e.removeEventListener("mousedown",r,!0),e.removeEventListener("mouseover",r,!0),e.removeEventListener("mouseup",r,!0),e.removeEventListener("pointerdown",a,!0),e.removeEventListener("pointerover",l,!0),e.removeEventListener("pointerup",s,!0))}function o(t){var i;t.preventDefault(),t.stopPropagation(),n(),null===(i=e.onClick)||void 0===i||i.call(e,t.target)}function r(e){e.preventDefault(),e.stopPropagation()}function a(e){e.preventDefault(),e.stopPropagation()}function l(n){var i;n.preventDefault(),n.stopPropagation();const o=n.target;if("IFRAME"===o.tagName){const e=o;try{c.has(e)||(t(e.contentWindow),c.add(e))}catch(r){}}null===(i=e.onPointerOver)||void 0===i||i.call(e,n.target)}function s(e){e.preventDefault(),e.stopPropagation()}return t(window),n}({onPointerOver:f,onClick:g});e.setRemoveCallback(t),u.current=e,h(!0)},w=()=>{var e;null===(e=u.current)||void 0===e||e.remove(),h(!1)},y=()=>m?w():E();return n.useEffect((()=>{const e=(e,t)=>{t.key===p?y():m&&"esc"===t.key&&w()};return i(`${p}, esc`,e),window.__REACT_DEV_INSPECTOR_TOGGLE__=y,()=>{i.unbind(`${p}, esc`,e),delete window.__REACT_DEV_INSPECTOR_TOGGLE__}}),[p,m,y]),d},N=o.h1`
  font-size: 4rem;
  padding: 0 3rem;
`,R=e=>{const{children:t}=e;return n.createElement(N,null,t)},T=o.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 2rem;
  font-size: 1.5rem;
  color: #999;
  
  p {
    margin: 0.5rem auto;
  }
`,O=e=>{const{children:t}=e;return n.createElement(T,null,t)},S=r`
  display: inline-block;
  padding: 0.5rem 0.8rem;
  font: 12px SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
  font-size: 1.2rem;
  height: 1.2rem;
  line-height: 1.2rem;
  color: #444d56;
  vertical-align: middle;
  background-color: #fafbfc;
  border: 1px solid #d1d5da;
  border-radius: 0.4rem;
  box-shadow: inset 0 -1px 0 #d1d5da;
`,$=o.div`
  display: inline-block;
  padding: 0 0.5rem;
  opacity:1;
  animation: flickerAnimation 1.6s ease-in-out infinite;
  
  & > .${S} {
    margin: auto 0.8rem;
  }
  
  @keyframes flickerAnimation {
    0%   { opacity: 1; }
    50%  { opacity: .4; }
    100% { opacity: 1; }
  }
`,k=o.div`
  vertical-align: center;
  margin: 0 auto;
  padding: 2rem;
  font-size: 1.5rem;
  color: #666;
`,D=({children:e})=>n.createElement("kbd",{className:S},e);class W extends n.Component{render(){const{children:e}=this.props;return n.createElement(k,null,n.createElement("span",null,"press"),n.createElement($,null,e),n.createElement("span",null,"to try! 🍭"))}}const B=a`
  html, body, #root {
    margin: 0;
    width: 100%;
    height: 100%;
  }
`,j=o.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`,P=o(l)`

`,M="https://github.com/zthxxx/react-dev-inspector",F=()=>n.createElement(L,{disableLaunchEditor:!0,onClickElement:e=>{if(console.debug(e),!e.codeInfo)return;const{relativePath:t,lineNumber:n}=e.codeInfo;window.open(`${M}/blob/master/sites/umi3/${t}#L${n}`)}},n.createElement(s,{styles:B}),n.createElement(j,null,n.createElement(P,{href:M}),n.createElement(R,null,n.createElement("span",null,"React Dev Inspector")),n.createElement(O,null,n.createElement("p",null,"Quick jump to local IDE source code directly from browser React component by just a simple click!"),n.createElement("p",null,n.createElement("small",null,"( for this prod online demo page, jump to GitHub file )"))),n.createElement(W,null,n.createElement(D,null,"Ctrl ⌃"),"+",n.createElement(D,null,"Shift ⇧"),"+",n.createElement(D,null,"Command ⌘"),"+",n.createElement(D,null,"C"))));d.render(n.createElement(F,null),document.getElementById("root"));
