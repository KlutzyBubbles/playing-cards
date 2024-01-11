/*!
 * Playing Cards undefined
 * https://github.com/KlutzyBubbles/playing-cards
 */
var playingcards;(()=>{"use strict";var e={"./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./sass/main.scss":
/*!***********************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./sass/main.scss ***!
  \***********************************************************************************************************************************************************/(e,t,r)=>{r.r(t)},"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/e=>{var t=[];function r(e){for(var r=-1,s=0;s<t.length;s++)if(t[s].identifier===e){r=s;break}return r}function s(e,s){for(var o={},a=[],i=0;i<e.length;i++){var d=e[i],l=s.base?d[0]+s.base:d[0],u=o[l]||0,c="".concat(l," ").concat(u);o[l]=u+1;var m=r(c),f={css:d[1],media:d[2],sourceMap:d[3],supports:d[4],layer:d[5]};if(-1!==m)t[m].references++,t[m].updater(f);else{var p=n(f,s);s.byIndex=i,t.splice(i,0,{identifier:c,updater:p,references:1})}a.push(c)}return a}function n(e,t){var r=t.domAPI(t);r.update(e);return function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap&&t.supports===e.supports&&t.layer===e.layer)return;r.update(e=t)}else r.remove()}}e.exports=function(e,n){var o=s(e=e||[],n=n||{});return function(e){e=e||[];for(var a=0;a<o.length;a++){var i=r(o[a]);t[i].references--}for(var d=s(e,n),l=0;l<o.length;l++){var u=r(o[l]);0===t[u].references&&(t[u].updater(),t.splice(u,1))}o=d}}},"./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/e=>{var t={};e.exports=function(e,r){var s=function(e){if(void 0===t[e]){var r=document.querySelector(e);if(window.HTMLIFrameElement&&r instanceof window.HTMLIFrameElement)try{r=r.contentDocument.head}catch(e){r=null}t[e]=r}return t[e]}(e);if(!s)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");s.appendChild(r)}},"./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/e=>{e.exports=function(e){var t=document.createElement("style");return e.setAttributes(t,e.attributes),e.insert(t,e.options),t}},"./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/(e,t,r)=>{e.exports=function(e){var t=r.nc;t&&e.setAttribute("nonce",t)}},"./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/e=>{e.exports=function(e){if("undefined"==typeof document)return{update:function(){},remove:function(){}};var t=e.insertStyleElement(e);return{update:function(r){!function(e,t,r){var s="";r.supports&&(s+="@supports (".concat(r.supports,") {")),r.media&&(s+="@media ".concat(r.media," {"));var n=void 0!==r.layer;n&&(s+="@layer".concat(r.layer.length>0?" ".concat(r.layer):""," {")),s+=r.css,n&&(s+="}"),r.media&&(s+="}"),r.supports&&(s+="}");var o=r.sourceMap;o&&"undefined"!=typeof btoa&&(s+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(o))))," */")),t.styleTagTransform(s,e,t.options)}(t,e,r)},remove:function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)}}}},"./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/e=>{e.exports=function(e,t){if(t.styleSheet)t.styleSheet.cssText=e;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(e))}}}},t={};function r(s){var n=t[s];if(void 0!==n)return n.exports;var o=t[s]={exports:{}};return e[s](o,o.exports,r),o.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var s in t)r.o(t,s)&&!r.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.nc=void 0;var s={};(()=>{
/*!************************!*\
  !*** ./sass/main.scss ***!
  \************************/
r.r(s),r.d(s,{default:()=>v});var e=r(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),t=r.n(e),n=r(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */"./node_modules/style-loader/dist/runtime/styleDomAPI.js"),o=r.n(n),a=r(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */"./node_modules/style-loader/dist/runtime/insertBySelector.js"),i=r.n(a),d=r(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */"./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),l=r.n(d),u=r(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */"./node_modules/style-loader/dist/runtime/insertStyleElement.js"),c=r.n(u),m=r(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */"./node_modules/style-loader/dist/runtime/styleTagTransform.js"),f=r.n(m),p=r(/*! !!../node_modules/mini-css-extract-plugin/dist/loader.js!../node_modules/css-loader/dist/cjs.js!../node_modules/sass-loader/dist/cjs.js!./main.scss */"./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./sass/main.scss"),y={};y.styleTagTransform=f(),y.setAttributes=l(),y.insert=i().bind(null,"head"),y.domAPI=o(),y.insertStyleElement=c();t()(p.default,y);const v=p.default&&p.default.locals?p.default.locals:void 0})(),playingcards=s})();
//# sourceMappingURL=style.js.map