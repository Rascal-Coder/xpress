function N(r,t){t===void 0&&(t={});var e=t.insertAt;if(!(typeof document>"u")){var a=document.head||document.getElementsByTagName("head")[0],i=document.createElement("style");i.type="text/css",e==="top"&&a.firstChild?a.insertBefore(i,a.firstChild):a.appendChild(i),i.styleSheet?i.styleSheet.cssText=r:i.appendChild(document.createTextNode(r))}}var F="@keyframes watermark{0%{background-position:0 0}25%{background-position:100% 100%}50%{background-position:100% 0}75%{background-position:0 100%}to{background-position:0 0}}";N(F);var R=function(r,t){return R=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,a){e.__proto__=a}||function(e,a){for(var i in a)Object.prototype.hasOwnProperty.call(a,i)&&(e[i]=a[i])},R(r,t)};function X(r,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");R(r,t);function e(){this.constructor=r}r.prototype=t===null?Object.create(t):(e.prototype=t.prototype,new e)}var _=function(){return _=Object.assign||function(t){for(var e,a=1,i=arguments.length;a<i;a++){e=arguments[a];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])}return t},_.apply(this,arguments)};function S(r,t,e,a){function i(n){return n instanceof e?n:new e(function(o){o(n)})}return new(e||(e=Promise))(function(n,o){function l(c){try{d(a.next(c))}catch(h){o(h)}}function s(c){try{d(a.throw(c))}catch(h){o(h)}}function d(c){c.done?n(c.value):i(c.value).then(l,s)}d((a=a.apply(r,t||[])).next())})}function b(r,t){var e={label:0,sent:function(){if(n[0]&1)throw n[1];return n[1]},trys:[],ops:[]},a,i,n,o=Object.create((typeof Iterator=="function"?Iterator:Object).prototype);return o.next=l(0),o.throw=l(1),o.return=l(2),typeof Symbol=="function"&&(o[Symbol.iterator]=function(){return this}),o;function l(d){return function(c){return s([d,c])}}function s(d){if(a)throw new TypeError("Generator is already executing.");for(;o&&(o=0,d[0]&&(e=0)),e;)try{if(a=1,i&&(n=d[0]&2?i.return:d[0]?i.throw||((n=i.return)&&n.call(i),0):i.next)&&!(n=n.call(i,d[1])).done)return n;switch(i=0,n&&(d=[d[0]&2,n.value]),d[0]){case 0:case 1:n=d;break;case 4:return e.label++,{value:d[1],done:!1};case 5:e.label++,i=d[1],d=[0];continue;case 7:d=e.ops.pop(),e.trys.pop();continue;default:if(n=e.trys,!(n=n.length>0&&n[n.length-1])&&(d[0]===6||d[0]===2)){e=0;continue}if(d[0]===3&&(!n||d[1]>n[0]&&d[1]<n[3])){e.label=d[1];break}if(d[0]===6&&e.label<n[1]){e.label=n[1],n=d;break}if(n&&e.label<n[2]){e.label=n[2],e.ops.push(d);break}n[2]&&e.ops.pop(),e.trys.pop();continue}d=t.call(r,e)}catch(c){d=[6,c],i=0}finally{a=n=0}if(d[0]&5)throw d[1];return{value:d[0]?d[1]:void 0,done:!0}}}var q=function(r){return r.toDataURL("image/png",1)},V=function(r){return typeof r=="function"},x=function(r){return r===void 0},Y=function(r){return typeof r=="string"},B=function(r,t,e){t===void 0&&(t={}),e===void 0&&(e="http://www.w3.org/2000/svg");var a=document.createElementNS(e,r);for(var i in t)a.setAttribute(i,t[i]);return a},K=function(r,t,e){for(var a=[],i="",n="",o=0,l=t.length;o<l;o++){if(n=t.charAt(o),n===`
`){a.push(i),i="";continue}i+=n,r.measureText(i).width>e&&(a.push(i.substring(0,i.length-1)),i="",o--)}return a.push(i),a},U=function(r,t){return S(void 0,void 0,void 0,function(){var e,a,i,n,o,l,s,d,c;return b(this,function(h){switch(h.label){case 0:return e=B("svg",{xmlns:"http://www.w3.org/2000/svg"}),a=document.createElement("div"),a.setAttribute("xmlns","http://www.w3.org/1999/xhtml"),a.style.cssText=`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font: `.concat(r.font,`;
  color: `).concat(t.fontColor,`;
`),a.innerHTML="<div class='rich-text-content'>".concat(t.content,"</div>"),document.body.appendChild(a),[4,$(a)];case 1:return h.sent(),i=(c=a.querySelector(".rich-text-content"))===null||c===void 0?void 0:c.getBoundingClientRect(),n=i?.width,o=i?.height,document.body.removeChild(a),l=t.richTextWidth||n||t.width,s=t.richTextHeight||o||t.height,e.setAttribute("width",l.toString()),e.setAttribute("height",s.toString()),d=B("foreignObject",{width:l.toString(),height:s.toString()}),d.appendChild(a),e.appendChild(d),[2,{element:e,width:l,height:s}]}})})};function $(r){return S(this,void 0,void 0,function(){var t,e,a,i,n;return b(this,function(o){switch(o.label){case 0:t=r.querySelectorAll("img"),e=function(l){var s,d,c,h,v;return b(this,function(u){switch(u.label){case 0:if(s=l.getAttribute("src"),!s)return[3,6];u.label=1;case 1:return u.trys.push([1,5,,6]),[4,fetch(s)];case 2:return d=u.sent(),[4,d.blob()];case 3:return c=u.sent(),[4,new Promise(function(m,p){var f=new FileReader;f.onloadend=function(){return m(f.result)},f.onerror=p,f.readAsDataURL(c)})];case 4:return h=u.sent(),Y(h)&&l.setAttribute("src",h),[3,6];case 5:return v=u.sent(),console.error("Error converting ".concat(s," to base64:"),v),[3,6];case 6:return[2]}})},a=0,i=Array.from(t),o.label=1;case 1:return a<i.length?(n=i[a],[5,e(n)]):[3,4];case 2:o.sent(),o.label=3;case 3:return a++,[3,1];case 4:return[2]}})})}var J=function(r){var t=r.outerHTML.replace(/<(img|br|input|hr|embed)(.*?)>/g,"<$1$2/>").replace(/\n/g,"").replace(/\t/g,"").replace(/#/g,"%23");return"data:image/svg+xml;charset=utf-8,".concat(t)},y=function(r,t){return x(r)?t:r},G=function(r,t,e){t===void 0&&(t=void 0),e===void 0&&(e=void 0);var a=new Image;return a.setAttribute("crossOrigin","anonymous"),!x(t)&&(a.width=t),!x(e)&&(a.height=e),a.src=r,new Promise(function(i){a.onload=function(){i(a)}})},Q=function(r,t,e){return Array.from({length:r},function(){return new Array(t).fill(e)})},z={width:300,height:300,rotate:45,layout:"default",auxiliaryLine:!1,translatePlacement:"middle",contentType:"text",content:"hello watermark-js-plus",textType:"fill",imageWidth:0,imageHeight:0,lineHeight:30,zIndex:2147483647,backgroundPosition:"0 0",backgroundRepeat:"repeat",fontSize:"20px",fontFamily:"sans-serif",fontStyle:"",fontVariant:"",fontColor:"#000",fontWeight:"normal",filter:"none",letterSpacing:"0px",wordSpacing:"0px",globalAlpha:.5,mode:"default",mutationObserve:!0,monitorProtection:!1,movable:!1,parent:"body",onSuccess:function(){},onBeforeDestroy:function(){},onDestroyed:function(){},onObserveError:function(){}},Z=function(r,t,e){var a=r.getContext("2d");if(a===null)throw new Error("get context error");a.font="".concat(t.fontStyle," ").concat(t.fontVariant," ").concat(t.fontWeight," ").concat(t.fontSize," ").concat(t.fontFamily),a.filter=t.filter,a.letterSpacing=t.letterSpacing,a.wordSpacing=t.wordSpacing,t?.rotate&&(t.rotate=(360-t.rotate%360)*(Math.PI/180)),x(e.textRowMaxWidth)&&(t.textRowMaxWidth=t.width);var i={image:{rect:{width:t.imageWidth,height:t.imageHeight},position:{x:0,y:0}},textLine:{data:[],yOffsetValue:0},advancedStyleParams:{linear:{x0:0,x1:0},radial:{x0:0,y0:0,r0:0,x1:0,y1:0,r1:0},conic:{x:0,y:0,startAngle:0},pattern:{}}};switch(t.contentType){case"text":i.textLine.data=[t.content];break;case"multi-line-text":i.textLine.data=K(a,t.content,t.textRowMaxWidth);break}var n=t.width/2,o=t.height/2,l="middle",s="center";switch(!x(e?.translateX)&&!x(e?.translateY)?(n=e?.translateX,o=e?.translateY,l="top",s="left"):(i.advancedStyleParams.linear.x0=-t.width/2,i.advancedStyleParams.linear.x1=t.width/2,i.advancedStyleParams.radial.r0=0,i.advancedStyleParams.radial.r1=t.width/2),e.translatePlacement){case"top":n=t.width/2,o=0,l="top",i.advancedStyleParams.linear.x0=-t.width/2,i.advancedStyleParams.linear.x1=t.width/2,i.advancedStyleParams.radial.y0=i.textLine.data.length*t.lineHeight/2,i.advancedStyleParams.radial.y1=i.textLine.data.length*t.lineHeight/2,i.advancedStyleParams.conic.y=i.textLine.data.length*t.lineHeight/2;break;case"top-start":n=0,o=0,l="top",s="start",i.advancedStyleParams.linear.x0=0,i.advancedStyleParams.linear.x1=t.width,i.advancedStyleParams.radial.x0=t.width/2,i.advancedStyleParams.radial.y0=i.textLine.data.length*t.lineHeight/2,i.advancedStyleParams.radial.x1=t.width/2,i.advancedStyleParams.radial.y1=i.textLine.data.length*t.lineHeight/2,i.advancedStyleParams.conic.x=t.width/2,i.advancedStyleParams.conic.y=i.textLine.data.length*t.lineHeight/2;break;case"top-end":n=t.width,o=0,l="top",s="end",i.advancedStyleParams.linear.x0=0,i.advancedStyleParams.linear.x1=-t.width,i.advancedStyleParams.radial.x0=-t.width/2,i.advancedStyleParams.radial.y0=i.textLine.data.length*t.lineHeight/2,i.advancedStyleParams.radial.x1=-t.width/2,i.advancedStyleParams.radial.y1=i.textLine.data.length*t.lineHeight/2,i.advancedStyleParams.conic.x=-t.width/2,i.advancedStyleParams.conic.y=i.textLine.data.length*t.lineHeight/2;break;case"bottom":n=t.width/2,o=t.height,l="bottom",i.advancedStyleParams.linear.x0=-t.width/2,i.advancedStyleParams.linear.x1=t.width/2,i.advancedStyleParams.radial.y0=-i.textLine.data.length*t.lineHeight/2,i.advancedStyleParams.radial.y1=-i.textLine.data.length*t.lineHeight/2,i.advancedStyleParams.conic.x=0,i.advancedStyleParams.conic.y=-i.textLine.data.length*t.lineHeight/2;break;case"bottom-start":n=0,o=t.height,l="bottom",s="start",i.advancedStyleParams.linear.x0=0,i.advancedStyleParams.linear.x1=t.width,i.advancedStyleParams.radial.x0=t.width/2,i.advancedStyleParams.radial.y0=-i.textLine.data.length*t.lineHeight/2,i.advancedStyleParams.radial.x1=t.width/2,i.advancedStyleParams.radial.y1=-i.textLine.data.length*t.lineHeight/2,i.advancedStyleParams.conic.x=t.width/2,i.advancedStyleParams.conic.y=-i.textLine.data.length*t.lineHeight/2;break;case"bottom-end":n=t.width,o=t.height,l="bottom",s="end",i.advancedStyleParams.linear.x0=0,i.advancedStyleParams.linear.x1=-t.width,i.advancedStyleParams.radial.x0=-t.width/2,i.advancedStyleParams.radial.y0=-i.textLine.data.length*t.lineHeight/2,i.advancedStyleParams.radial.x1=-t.width/2,i.advancedStyleParams.radial.y1=-i.textLine.data.length*t.lineHeight/2,i.advancedStyleParams.conic.x=-t.width/2,i.advancedStyleParams.conic.y=-i.textLine.data.length*t.lineHeight/2;break;case"left":n=0,o=t.height/2,s="start",i.advancedStyleParams.linear.x0=0,i.advancedStyleParams.linear.x1=t.width,i.advancedStyleParams.radial.x0=t.width/2,i.advancedStyleParams.radial.x1=t.width/2,i.advancedStyleParams.conic.x=t.width/2,i.advancedStyleParams.conic.y=0;break;case"right":n=t.width,o=t.height/2,s="end",i.advancedStyleParams.linear.x0=0,i.advancedStyleParams.linear.x1=-t.width,i.advancedStyleParams.radial.x0=-t.width/2,i.advancedStyleParams.radial.x1=-t.width/2,i.advancedStyleParams.conic.x=-t.width/2,i.advancedStyleParams.conic.y=0;break}if(t.translateX=n,t.translateY=o,x(e?.textBaseline)&&(t.textBaseline=l),x(e?.textAlign)&&(t.textAlign=s),["text","multi-line-text"].includes(t.contentType))switch(t.textBaseline){case"middle":i.textLine.yOffsetValue=(i.textLine.data.length-1)*t.lineHeight/2;break;case"bottom":case"alphabetic":case"ideographic":i.textLine.yOffsetValue=(i.textLine.data.length-1)*t.lineHeight+(t.lineHeight-parseInt(t.fontSize))/2;break;case"top":case"hanging":i.textLine.yOffsetValue=-t.lineHeight/2+parseInt(t.fontSize)/2;break}return i},I=function(r){typeof window>"u"||r&&(Object.defineProperty(window,"MutationObserver",{writable:!1,configurable:!1}),Object.defineProperty(window,"requestAnimationFrame",{writable:!1,configurable:!1}))},C=function(){function r(t,e){this.props=t,this.options=e,this.canvas=r.createCanvas(this.options.width,this.options.height),this.recommendOptions=Z(this.canvas,this.options,this.props)}return r.createCanvas=function(t,e){var a,i=window.devicePixelRatio||1,n=document.createElement("canvas");return n.width=t*i,n.height=e*i,n.style.width="".concat(t,"px"),n.style.height="".concat(e,"px"),(a=n.getContext("2d"))===null||a===void 0||a.setTransform(i,0,0,i,0,0),n},r.clearCanvas=function(t){var e=t.getContext("2d");if(e===null)throw new Error("get context error");e.restore(),e.resetTransform(),e.clearRect(0,0,t.width,t.height);var a=window.devicePixelRatio||1;e.setTransform(a,0,0,a,0,0)},r.prototype.getCanvas=function(){return this.canvas},r.prototype.clear=function(){r.clearCanvas(this.canvas)},r.prototype.draw=function(){var t=this,e=this.canvas.getContext("2d");if(e===null)throw new Error("get context error");return this.options.auxiliaryLine&&(e.beginPath(),e.rect(0,0,this.options.width,this.options.height),e.lineWidth=1,e.strokeStyle="#000",e.stroke(),e.closePath(),e.beginPath(),e.rect(this.options.translateX,this.options.translateY,1,1),e.lineWidth=1,e.strokeStyle="#f00",e.stroke(),e.closePath()),this.setStyle(e),e.save(),e.translate(this.options.translateX,this.options.translateY),e.rotate(this.options.rotate),new Promise(function(a){switch(t.options.contentType){case"text":t.drawText(e,a);break;case"image":t.drawImage(e,a);break;case"multi-line-text":t.drawMultiLineText(e,a);break;case"rich-text":t.drawRichText(e,a);break}})},r.prototype.setStyle=function(t){var e,a="fillStyle";this.options.textType==="stroke"&&(a="strokeStyle");var i=this.options.fontColor;if(!((e=this.options)===null||e===void 0)&&e.advancedStyle)switch(this.options.advancedStyle.type){case"linear":i=this.createLinearGradient(t);break;case"radial":i=this.createRadialGradient(t);break;case"conic":i=this.createConicGradient(t);break;case"pattern":i=this.createPattern(t);break}t[a]&&i&&(t[a]=i),this.options.textAlign&&(t.textAlign=this.options.textAlign),this.options.textBaseline&&(t.textBaseline=this.options.textBaseline),t.globalAlpha=this.options.globalAlpha,this.options.shadowStyle&&(t.shadowBlur=y(this.options.shadowStyle.shadowBlur,0),t.shadowColor=y(this.options.shadowStyle.shadowColor,"#00000000"),t.shadowOffsetX=y(this.options.shadowStyle.shadowOffsetX,0),t.shadowOffsetY=y(this.options.shadowStyle.shadowOffsetY,0)),V(this.options.extraDrawFunc)&&this.options.extraDrawFunc(t)},r.prototype.createLinearGradient=function(t){var e,a,i,n,o,l,s,d,c,h,v,u,m,p,f,w=t.createLinearGradient(y((i=(a=(e=this.options.advancedStyle)===null||e===void 0?void 0:e.params)===null||a===void 0?void 0:a.linear)===null||i===void 0?void 0:i.x0,this.recommendOptions.advancedStyleParams.linear.x0),y((l=(o=(n=this.options.advancedStyle)===null||n===void 0?void 0:n.params)===null||o===void 0?void 0:o.linear)===null||l===void 0?void 0:l.y0,0),y((c=(d=(s=this.options.advancedStyle)===null||s===void 0?void 0:s.params)===null||d===void 0?void 0:d.linear)===null||c===void 0?void 0:c.x1,this.recommendOptions.advancedStyleParams.linear.x1),y((u=(v=(h=this.options.advancedStyle)===null||h===void 0?void 0:h.params)===null||v===void 0?void 0:v.linear)===null||u===void 0?void 0:u.y1,0));return(f=(p=(m=this.options)===null||m===void 0?void 0:m.advancedStyle)===null||p===void 0?void 0:p.colorStops)===null||f===void 0||f.forEach(function(g){w.addColorStop(g.offset,g.color)}),w},r.prototype.createConicGradient=function(t){var e,a,i,n,o,l,s,d,c,h,v,u,m,p,f,w=t.createConicGradient(y((n=(i=(a=(e=this.options)===null||e===void 0?void 0:e.advancedStyle)===null||a===void 0?void 0:a.params)===null||i===void 0?void 0:i.conic)===null||n===void 0?void 0:n.startAngle,0),y((d=(s=(l=(o=this.options)===null||o===void 0?void 0:o.advancedStyle)===null||l===void 0?void 0:l.params)===null||s===void 0?void 0:s.conic)===null||d===void 0?void 0:d.x,this.recommendOptions.advancedStyleParams.conic.x),y((u=(v=(h=(c=this.options)===null||c===void 0?void 0:c.advancedStyle)===null||h===void 0?void 0:h.params)===null||v===void 0?void 0:v.conic)===null||u===void 0?void 0:u.y,this.recommendOptions.advancedStyleParams.conic.y));return(f=(p=(m=this.options)===null||m===void 0?void 0:m.advancedStyle)===null||p===void 0?void 0:p.colorStops)===null||f===void 0||f.forEach(function(g){w.addColorStop(g.offset,g.color)}),w},r.prototype.createRadialGradient=function(t){var e,a,i,n,o,l,s,d,c,h,v,u,m,p,f,w,g,k,P,O,E,L,T,A,D,W,H,j=t.createRadialGradient(y((n=(i=(a=(e=this.options)===null||e===void 0?void 0:e.advancedStyle)===null||a===void 0?void 0:a.params)===null||i===void 0?void 0:i.radial)===null||n===void 0?void 0:n.x0,this.recommendOptions.advancedStyleParams.radial.x0),y((d=(s=(l=(o=this.options)===null||o===void 0?void 0:o.advancedStyle)===null||l===void 0?void 0:l.params)===null||s===void 0?void 0:s.radial)===null||d===void 0?void 0:d.y0,this.recommendOptions.advancedStyleParams.radial.y0),y((u=(v=(h=(c=this.options)===null||c===void 0?void 0:c.advancedStyle)===null||h===void 0?void 0:h.params)===null||v===void 0?void 0:v.radial)===null||u===void 0?void 0:u.r0,this.recommendOptions.advancedStyleParams.radial.r0),y((w=(f=(p=(m=this.options)===null||m===void 0?void 0:m.advancedStyle)===null||p===void 0?void 0:p.params)===null||f===void 0?void 0:f.radial)===null||w===void 0?void 0:w.x1,this.recommendOptions.advancedStyleParams.radial.x1),y((O=(P=(k=(g=this.options)===null||g===void 0?void 0:g.advancedStyle)===null||k===void 0?void 0:k.params)===null||P===void 0?void 0:P.radial)===null||O===void 0?void 0:O.y1,this.recommendOptions.advancedStyleParams.radial.y1),y((A=(T=(L=(E=this.options)===null||E===void 0?void 0:E.advancedStyle)===null||L===void 0?void 0:L.params)===null||T===void 0?void 0:T.radial)===null||A===void 0?void 0:A.r1,this.recommendOptions.advancedStyleParams.radial.r1));return(H=(W=(D=this.options)===null||D===void 0?void 0:D.advancedStyle)===null||W===void 0?void 0:W.colorStops)===null||H===void 0||H.forEach(function(M){j.addColorStop(M.offset,M.color)}),j},r.prototype.createPattern=function(t){var e,a,i,n,o,l,s,d;return t.createPattern((n=(i=(a=(e=this.options)===null||e===void 0?void 0:e.advancedStyle)===null||a===void 0?void 0:a.params)===null||i===void 0?void 0:i.pattern)===null||n===void 0?void 0:n.image,((d=(s=(l=(o=this.options)===null||o===void 0?void 0:o.advancedStyle)===null||l===void 0?void 0:l.params)===null||s===void 0?void 0:s.pattern)===null||d===void 0?void 0:d.repetition)||"")},r.prototype.setText=function(t,e){var a="fillText";this.options.textType==="stroke"&&(a="strokeText"),t[a]&&t[a](e.text,e.x,e.y,e.maxWidth)},r.prototype.drawText=function(t,e){this.setText(t,{text:this.options.content,x:0,y:0-this.recommendOptions.textLine.yOffsetValue,maxWidth:this.options.textRowMaxWidth||this.options.width}),e(t.canvas)},r.prototype.drawImage=function(t,e){var a=this;G(this.options.image).then(function(i){var n=a.getImageRect(i),o=n.width,l=n.height,s=a.getDrawImagePosition(o,l);t.drawImage(i,s.x,s.y,o,l),e(t.canvas)})},r.prototype.drawMultiLineText=function(t,e){var a=this,i=this.recommendOptions.textLine.data,n=this.recommendOptions.textLine.yOffsetValue;i.forEach(function(o,l){a.setText(t,{text:o,x:0,y:a.options.lineHeight*l-n,maxWidth:a.options.textRowMaxWidth||a.options.width})}),e(t.canvas)},r.prototype.drawRichText=function(t,e){return S(this,void 0,void 0,function(){var a,i=this;return b(this,function(n){switch(n.label){case 0:return[4,U(t,this.options)];case 1:return a=n.sent(),G(J(a.element),a.width,a.height).then(function(o){var l=i.getDrawImagePosition(o.width,o.height);t.drawImage(o,l.x,l.y,o.width,o.height),e(t.canvas)}),[2]}})})},r.prototype.getImageRect=function(t){var e={width:this.options.imageWidth||0,height:this.options.imageHeight||0};switch(!0){case(e.width!==0&&e.height===0):e.height=e.width*t.height/t.width;break;case(e.width===0&&e.height!==0):e.width=e.height*t.width/t.height;break;case(e.width===0&&e.height===0):e.width=t.width,e.height=t.height;break}return e},r.prototype.getDrawImagePosition=function(t,e){var a,i,n={x:-t/2,y:-e/2};switch(this.options.translatePlacement){case"top":n.x=-t/2,n.y=0;break;case"top-start":n.x=0,n.y=0;break;case"top-end":n.x=-t,n.y=0;break;case"bottom":n.x=-t/2,n.y=-e;break;case"bottom-start":n.x=0,n.y=-e;break;case"bottom-end":n.x=-t,n.y=-e;break;case"left":n.x=0,n.y=-e/2;break;case"right":n.x=-t,n.y=-e/2;break}return!x((a=this.props)===null||a===void 0?void 0:a.translateX)&&(n.x=0),!x((i=this.props)===null||i===void 0?void 0:i.translateY)&&(n.y=0),n},r}(),tt=function(){function r(t,e){var a,i,n,o;this.options=t,this.partialWidth=this.options.width,this.partialHeight=this.options.height,this.rows=((a=this.options.gridLayoutOptions)===null||a===void 0?void 0:a.rows)||1,this.cols=((i=this.options.gridLayoutOptions)===null||i===void 0?void 0:i.cols)||1,this.matrix=((n=this.options.gridLayoutOptions)===null||n===void 0?void 0:n.matrix)||Q(this.rows,this.cols,1),this.gap=((o=this.options.gridLayoutOptions)===null||o===void 0?void 0:o.gap)||[0,0],this.partialCanvas=e}return r.prototype.draw=function(){var t,e,a,i,n,o,l,s,d=C.createCanvas(((t=this.options.gridLayoutOptions)===null||t===void 0?void 0:t.width)||this.partialWidth*this.cols+this.gap[0]*this.cols,((e=this.options.gridLayoutOptions)===null||e===void 0?void 0:e.height)||this.partialHeight*this.rows+this.gap[1]*this.rows),c=d.getContext("2d");!((a=this.options.gridLayoutOptions)===null||a===void 0)&&a.backgroundImage&&c?.drawImage((i=this.options.gridLayoutOptions)===null||i===void 0?void 0:i.backgroundImage,0,0,(n=this.options.gridLayoutOptions)===null||n===void 0?void 0:n.width,(o=this.options.gridLayoutOptions)===null||o===void 0?void 0:o.height);for(var h=0;h<this.rows;h++)for(var v=0;v<this.cols;v++)!((s=(l=this.matrix)===null||l===void 0?void 0:l[h])===null||s===void 0)&&s[v]&&c?.drawImage(this.partialCanvas,this.partialWidth*v+this.gap[0]*v,this.partialHeight*h+this.gap[1]*h,this.partialWidth,this.partialHeight);return d},r}(),et=function(r,t){switch(r.layout){case"grid":return new tt(r,t).draw();default:return t}},it=function(r){var t,e,a;switch(r.layout){case"grid":{var i=((t=r.gridLayoutOptions)===null||t===void 0?void 0:t.cols)||1,n=((e=r.gridLayoutOptions)===null||e===void 0?void 0:e.rows)||1,o=((a=r.gridLayoutOptions)===null||a===void 0?void 0:a.gap)||[0,0];return[r.width*i+o[0]*i,r.height*n+o[1]*n]}default:return[r.width,r.height]}},at=function(){function r(t){t===void 0&&(t={}),this.parentElement=document.body,this.isCreating=!1,this.props=t,this.options=_(_({},z),t),this.changeParentElement(this.options.parent),this.watermarkCanvas=new C(this.props,this.options),I(this.options.monitorProtection)}return r.prototype.changeOptions=function(){return S(this,arguments,void 0,function(t,e,a){return t===void 0&&(t={}),e===void 0&&(e="overwrite"),a===void 0&&(a=!0),b(this,function(i){switch(i.label){case 0:return this.initConfigData(t,e),I(this.options.monitorProtection),a?(this.remove(),[4,this.create()]):[3,2];case 1:i.sent(),i.label=2;case 2:return[2]}})})},r.prototype.create=function(){return S(this,void 0,void 0,function(){var t,e,a,i,n,o,l,s,d,c,h,v;return b(this,function(u){switch(u.label){case 0:return this.isCreating?[2]:(this.isCreating=!0,this.validateUnique()?this.validateContent()?(t=x(this.watermarkDom),[4,(o=this.watermarkCanvas)===null||o===void 0?void 0:o.draw()]):(this.isCreating=!1,[2]):(this.isCreating=!1,[2]));case 1:if(u.sent(),this.layoutCanvas=et(this.options,(l=this.watermarkCanvas)===null||l===void 0?void 0:l.getCanvas()),e=q(this.layoutCanvas),(s=this.watermarkCanvas)===null||s===void 0||s.clear(),this.watermarkDom=document.createElement("div"),a=document.createElement("div"),this.watermarkDom.__WATERMARK__="watermark",this.watermarkDom.__WATERMARK__INSTANCE__=this,i=this.checkParentElementType(),this.watermarkDom.style.cssText=`
      z-index:`.concat(this.options.zIndex,`!important;display:block!important;visibility:visible!important;transform:none!important;scale:none!important;
      `).concat(i==="custom"?"top:0!important;bottom:0!important;left:0!important;right:0!important;height:100%!important;pointer-events:none!important;position:absolute!important;":"position:relative!important;",`
    `),n=it(this.options),a.style.cssText=`
      display:block!important;visibility:visible!important;pointer-events:none;top:0;bottom:0;left:0;right:0;transform:none!important;scale:none!important;
      position:`.concat(i==="root"?"fixed":"absolute",`!important;-webkit-print-color-adjust:exact!important;width:100%!important;height:100%!important;
      z-index:`).concat(this.options.zIndex,"!important;background-image:url(").concat(e,")!important;background-repeat:").concat(this.options.backgroundRepeat,`!important;
      background-size:`).concat(n[0],"px ").concat(n[1],"px!important;background-position:").concat(this.options.backgroundPosition,`;
      `).concat(this.options.movable?"animation: 200s linear 0s infinite alternate watermark !important;":"",`
    `),this.watermarkDom.appendChild(a),this.parentElement.appendChild(this.watermarkDom),this.options.mutationObserve)try{this.bindMutationObserve()}catch{(c=(d=this.options).onObserveError)===null||c===void 0||c.call(d)}return t&&((v=(h=this.options).onSuccess)===null||v===void 0||v.call(h)),this.isCreating=!1,[2]}})})},r.prototype.destroy=function(){this.remove(),this.watermarkDom=void 0},r.prototype.check=function(){return S(this,void 0,void 0,function(){return b(this,function(t){return[2,this.parentElement.contains(this.watermarkDom)]})})},r.prototype.remove=function(){var t,e,a,i,n,o,l,s;(e=(t=this.options).onBeforeDestroy)===null||e===void 0||e.call(t),(a=this.observer)===null||a===void 0||a.disconnect(),(i=this.parentObserve)===null||i===void 0||i.disconnect(),this.unbindCheckWatermarkElementEvent(),(o=(n=this.watermarkDom)===null||n===void 0?void 0:n.parentNode)===null||o===void 0||o.removeChild(this.watermarkDom),(s=(l=this.options).onDestroyed)===null||s===void 0||s.call(l)},r.prototype.initConfigData=function(t,e){var a=this;e===void 0&&(e="overwrite"),e==="append"?Object.keys(t).forEach(function(i){a.props&&(a.props[i]=t[i])}):this.props=t,this.options=_(_({},z),this.props),this.changeParentElement(this.options.parent),this.watermarkCanvas=new C(this.props,this.options)},r.prototype.changeParentElement=function(t){if(typeof t=="string"){var e=document.querySelector(t);e&&(this.parentElement=e)}else this.parentElement=t;this.parentElement||console.error("[WatermarkJsPlus]: please pass a valid parent element.")},r.prototype.validateUnique=function(){var t=!0;return Array.from(this.parentElement.childNodes).forEach(function(e){t&&Object.hasOwnProperty.call(e,"__WATERMARK__")&&(t=!1)}),t},r.prototype.validateContent=function(){switch(this.options.contentType){case"image":return Object.hasOwnProperty.call(this.options,"image");case"multi-line-text":case"rich-text":case"text":return this.options.content.length>0}},r.prototype.checkParentElementType=function(){return["html","body"].includes(this.parentElement.tagName.toLocaleLowerCase())?"root":"custom"},r.prototype.checkWatermarkElement=function(){return S(this,void 0,void 0,function(){return b(this,function(t){switch(t.label){case 0:return this.parentElement.contains(this.watermarkDom)?[3,2]:(this.remove(),[4,this.create()]);case 1:t.sent(),t.label=2;case 2:return this.bindCheckWatermarkElementEvent(),[2]}})})},r.prototype.bindMutationObserve=function(){var t=this;this.watermarkDom&&(this.bindCheckWatermarkElementEvent(),this.observer=new MutationObserver(function(e){return S(t,void 0,void 0,function(){return b(this,function(a){switch(a.label){case 0:return e.length>0?(this.remove(),[4,this.create()]):[3,2];case 1:a.sent(),a.label=2;case 2:return[2]}})})}),this.observer.observe(this.watermarkDom,{attributes:!0,childList:!0,subtree:!0,characterData:!0}),this.parentObserve=new MutationObserver(function(e){return S(t,void 0,void 0,function(){var a,i,n,o;return b(this,function(l){switch(l.label){case 0:a=0,i=e,l.label=1;case 1:return a<i.length?(n=i[a],n?.target===this.watermarkDom||((o=n?.removedNodes)===null||o===void 0?void 0:o[0])===this.watermarkDom||n.type==="childList"&&n.target===this.parentElement&&n.target.lastChild!==this.watermarkDom?(this.remove(),[4,this.create()]):[3,3]):[3,4];case 2:l.sent(),l.label=3;case 3:return a++,[3,1];case 4:return[2]}})})}),this.parentObserve.observe(this.parentElement,{attributes:!0,childList:!0,subtree:!0,characterData:!0}))},r.prototype.bindCheckWatermarkElementEvent=function(){this.unbindCheckWatermarkElementEvent(),this.checkWatermarkElementRequestID=requestAnimationFrame(this.checkWatermarkElement.bind(this))},r.prototype.unbindCheckWatermarkElementEvent=function(){x(this.checkWatermarkElementRequestID)||cancelAnimationFrame(this.checkWatermarkElementRequestID)},r}();(function(r){X(t,r);function t(e){e===void 0&&(e={});var a={globalAlpha:.005,mode:"blind"};return r.call(this,_(_({},e),a))||this}return t.prototype.changeOptions=function(){return S(this,arguments,void 0,function(e,a,i){return e===void 0&&(e={}),a===void 0&&(a="overwrite"),i===void 0&&(i=!0),b(this,function(n){switch(n.label){case 0:return e.globalAlpha=.005,e.mode="blind",this.initConfigData(e,a),I(this.options.monitorProtection),i?(this.remove(),[4,this.create()]):[3,2];case 1:n.sent(),n.label=2;case 2:return[2]}})})},t.decode=function(e){var a=e.url,i=a===void 0?"":a,n=e.fillColor,o=n===void 0?"#000":n,l=e.compositeOperation,s=l===void 0?"color-burn":l,d=e.mode,c=d===void 0?"canvas":d,h=e.compositeTimes,v=h===void 0?3:h,u=e.onSuccess;if(i&&c==="canvas"){var m=new Image;m.src=i,m.addEventListener("load",function(){var p=m.width,f=m.height,w=C.createCanvas(p,f),g=w.getContext("2d");if(!g)throw new Error("get context error");g.drawImage(m,0,0,p,f),g.globalCompositeOperation=s,g.fillStyle=o;for(var k=0;k<v;k++)g.fillRect(0,0,p,f);var P=q(w);V(u)&&u?.(P)})}},t})(at);export{at as Watermark};
