(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Do="183",Zh=0,ml=1,Jh=2,fr=1,No=2,_s=3,Kn=0,Vt=1,Ht=2,Xn=0,Hi=1,gl=2,xl=3,_l=4,Qh=5,_i=100,ed=101,td=102,nd=103,id=104,sd=200,rd=201,ad=202,od=203,La=204,Ia=205,ld=206,cd=207,hd=208,dd=209,ud=210,fd=211,pd=212,md=213,gd=214,Da=0,Na=1,Ua=2,Xi=3,Fa=4,Oa=5,Ba=6,ka=7,Uo=0,xd=1,_d=2,An=0,th=1,nh=2,ih=3,Ds=4,sh=5,rh=6,ah=7,vl="attached",vd="detached",oh=300,Mi=301,qi=302,zr=303,Hr=304,Lr=306,Cn=1e3,Tn=1001,Sr=1002,At=1003,lh=1004,vs=1005,Rt=1006,pr=1007,Gn=1008,Jt=1009,ch=1010,hh=1011,ws=1012,Fo=1013,Pn=1014,sn=1015,Yn=1016,Oo=1017,Bo=1018,Ts=1020,dh=35902,uh=35899,fh=1021,ph=1022,rn=1023,jn=1026,yi=1027,ko=1028,zo=1029,Ki=1030,Ho=1031,Vo=1033,mr=33776,gr=33777,xr=33778,_r=33779,za=35840,Ha=35841,Va=35842,Ga=35843,Wa=36196,Xa=37492,qa=37496,Ka=37488,Ya=37489,ja=37490,$a=37491,Za=37808,Ja=37809,Qa=37810,eo=37811,to=37812,no=37813,io=37814,so=37815,ro=37816,ao=37817,oo=37818,lo=37819,co=37820,ho=37821,uo=36492,fo=36494,po=36495,mo=36283,go=36284,xo=36285,_o=36286,Es=2300,As=2301,Vr=2302,yl=2303,Ml=2400,Sl=2401,bl=2402,yd=2500,Md=0,mh=1,vo=2,Sd=3200,Go=0,bd=1,oi="",Et="srgb",Yt="srgb-linear",br="linear",at="srgb",wi=7680,wl=519,wd=512,Td=513,Ed=514,Wo=515,Ad=516,Rd=517,Xo=518,Cd=519,yo=35044,Pd=35048,Tl="300 es",En=2e3,Rs=2001;function Ld(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function Id(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function Cs(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Dd(){const r=Cs("canvas");return r.style.display="block",r}const El={};function wr(...r){const e="THREE."+r.shift();console.log(e,...r)}function gh(r){const e=r[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=r[1];t&&t.isStackTrace?r[0]+=" "+t.getLocation():r[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return r}function Ie(...r){r=gh(r);const e="THREE."+r.shift();{const t=r[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...r)}}function Oe(...r){r=gh(r);const e="THREE."+r.shift();{const t=r[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...r)}}function Tr(...r){const e=r.join(" ");e in El||(El[e]=!0,Ie(...r))}function Nd(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}const Ud={[Da]:Na,[Ua]:Ba,[Fa]:ka,[Xi]:Oa,[Na]:Da,[Ba]:Ua,[ka]:Fa,[Oa]:Xi};class Qi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,e);e.target=null}}}const kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Al=1234567;const Ms=Math.PI/180,Yi=180/Math.PI;function mn(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(kt[r&255]+kt[r>>8&255]+kt[r>>16&255]+kt[r>>24&255]+"-"+kt[e&255]+kt[e>>8&255]+"-"+kt[e>>16&15|64]+kt[e>>24&255]+"-"+kt[t&63|128]+kt[t>>8&255]+"-"+kt[t>>16&255]+kt[t>>24&255]+kt[n&255]+kt[n>>8&255]+kt[n>>16&255]+kt[n>>24&255]).toLowerCase()}function $e(r,e,t){return Math.max(e,Math.min(t,r))}function qo(r,e){return(r%e+e)%e}function Fd(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function Od(r,e,t){return r!==e?(t-r)/(e-r):0}function Ss(r,e,t){return(1-t)*r+t*e}function Bd(r,e,t,n){return Ss(r,e,1-Math.exp(-t*n))}function kd(r,e=1){return e-Math.abs(qo(r,e*2)-e)}function zd(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function Hd(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function Vd(r,e){return r+Math.floor(Math.random()*(e-r+1))}function Gd(r,e){return r+Math.random()*(e-r)}function Wd(r){return r*(.5-Math.random())}function Xd(r){r!==void 0&&(Al=r);let e=Al+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function qd(r){return r*Ms}function Kd(r){return r*Yi}function Yd(r){return(r&r-1)===0&&r!==0}function jd(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function $d(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function Zd(r,e,t,n,i){const s=Math.cos,a=Math.sin,o=s(t/2),c=a(t/2),l=s((e+n)/2),h=a((e+n)/2),d=s((e-n)/2),u=a((e-n)/2),f=s((n-e)/2),x=a((n-e)/2);switch(i){case"XYX":r.set(o*h,c*d,c*u,o*l);break;case"YZY":r.set(c*u,o*h,c*d,o*l);break;case"ZXZ":r.set(c*d,c*u,o*h,o*l);break;case"XZX":r.set(o*h,c*x,c*f,o*l);break;case"YXY":r.set(c*f,o*h,c*x,o*l);break;case"ZYZ":r.set(c*x,c*f,o*h,o*l);break;default:Ie("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function un(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function ot(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const Er={DEG2RAD:Ms,RAD2DEG:Yi,generateUUID:mn,clamp:$e,euclideanModulo:qo,mapLinear:Fd,inverseLerp:Od,lerp:Ss,damp:Bd,pingpong:kd,smoothstep:zd,smootherstep:Hd,randInt:Vd,randFloat:Gd,randFloatSpread:Wd,seededRandom:Xd,degToRad:qd,radToDeg:Kd,isPowerOfTwo:Yd,ceilPowerOfTwo:jd,floorPowerOfTwo:$d,setQuaternionFromProperEuler:Zd,normalize:ot,denormalize:un};class Xe{constructor(e=0,t=0){Xe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos($e(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*i+e.x,this.y=s*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class In{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,a,o){let c=n[i+0],l=n[i+1],h=n[i+2],d=n[i+3],u=s[a+0],f=s[a+1],x=s[a+2],g=s[a+3];if(d!==g||c!==u||l!==f||h!==x){let m=c*u+l*f+h*x+d*g;m<0&&(u=-u,f=-f,x=-x,g=-g,m=-m);let p=1-o;if(m<.9995){const _=Math.acos(m),S=Math.sin(_);p=Math.sin(p*_)/S,o=Math.sin(o*_)/S,c=c*p+u*o,l=l*p+f*o,h=h*p+x*o,d=d*p+g*o}else{c=c*p+u*o,l=l*p+f*o,h=h*p+x*o,d=d*p+g*o;const _=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=_,l*=_,h*=_,d*=_}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,s,a){const o=n[i],c=n[i+1],l=n[i+2],h=n[i+3],d=s[a],u=s[a+1],f=s[a+2],x=s[a+3];return e[t]=o*x+h*d+c*f-l*u,e[t+1]=c*x+h*u+l*d-o*f,e[t+2]=l*x+h*f+o*u-c*d,e[t+3]=h*x-o*d-c*u-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,s=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(i/2),d=o(s/2),u=c(n/2),f=c(i/2),x=c(s/2);switch(a){case"XYZ":this._x=u*h*d+l*f*x,this._y=l*f*d-u*h*x,this._z=l*h*x+u*f*d,this._w=l*h*d-u*f*x;break;case"YXZ":this._x=u*h*d+l*f*x,this._y=l*f*d-u*h*x,this._z=l*h*x-u*f*d,this._w=l*h*d+u*f*x;break;case"ZXY":this._x=u*h*d-l*f*x,this._y=l*f*d+u*h*x,this._z=l*h*x+u*f*d,this._w=l*h*d-u*f*x;break;case"ZYX":this._x=u*h*d-l*f*x,this._y=l*f*d+u*h*x,this._z=l*h*x-u*f*d,this._w=l*h*d+u*f*x;break;case"YZX":this._x=u*h*d+l*f*x,this._y=l*f*d+u*h*x,this._z=l*h*x-u*f*d,this._w=l*h*d-u*f*x;break;case"XZY":this._x=u*h*d-l*f*x,this._y=l*f*d-u*h*x,this._z=l*h*x+u*f*d,this._w=l*h*d+u*f*x;break;default:Ie("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],d=t[10],u=n+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-c)*f,this._y=(s-l)*f,this._z=(a-i)*f}else if(n>o&&n>d){const f=2*Math.sqrt(1+n-o-d);this._w=(h-c)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(s+l)/f}else if(o>d){const f=2*Math.sqrt(1+o-n-d);this._w=(s-l)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+d-n-o);this._w=(a-i)/f,this._x=(s+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($e(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+a*o+i*l-s*c,this._y=i*h+a*c+s*o-n*l,this._z=s*h+a*l+n*c-i*o,this._w=a*h-n*o-i*c-s*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,s=-s,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),h=Math.sin(l);c=Math.sin(c*l)/h,t=Math.sin(t*l)/h,this._x=this._x*c+n*t,this._y=this._y*c+i*t,this._z=this._z*c+s*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+i*t,this._z=this._z*c+s*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(e=0,t=0,n=0){L.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Rl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Rl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*i-o*n),h=2*(o*t-s*i),d=2*(s*n-a*t);return this.x=t+c*l+a*d-o*h,this.y=n+c*h+o*l-s*d,this.z=i+c*d+s*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,a=t.x,o=t.y,c=t.z;return this.x=i*c-s*o,this.y=s*a-n*c,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Gr.copy(this).projectOnVector(e),this.sub(Gr)}reflect(e){return this.sub(Gr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos($e(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Gr=new L,Rl=new In;class We{constructor(e,t,n,i,s,a,o,c,l){We.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,c,l)}set(e,t,n,i,s,a,o,c,l){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=s,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],d=n[7],u=n[2],f=n[5],x=n[8],g=i[0],m=i[3],p=i[6],_=i[1],S=i[4],M=i[7],E=i[2],T=i[5],R=i[8];return s[0]=a*g+o*_+c*E,s[3]=a*m+o*S+c*T,s[6]=a*p+o*M+c*R,s[1]=l*g+h*_+d*E,s[4]=l*m+h*S+d*T,s[7]=l*p+h*M+d*R,s[2]=u*g+f*_+x*E,s[5]=u*m+f*S+x*T,s[8]=u*p+f*M+x*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-n*s*h+n*o*c+i*s*l-i*a*c}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=h*a-o*l,u=o*c-h*s,f=l*s-a*c,x=t*d+n*u+i*f;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/x;return e[0]=d*g,e[1]=(i*l-h*n)*g,e[2]=(o*n-i*a)*g,e[3]=u*g,e[4]=(h*t-i*c)*g,e[5]=(i*s-o*t)*g,e[6]=f*g,e[7]=(n*c-l*t)*g,e[8]=(a*t-n*s)*g,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-i*l,i*c,-i*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Wr.makeScale(e,t)),this}rotate(e){return this.premultiply(Wr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Wr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Wr=new We,Cl=new We().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Pl=new We().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Jd(){const r={enabled:!0,workingColorSpace:Yt,spaces:{},convert:function(i,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===at&&(i.r=qn(i.r),i.g=qn(i.g),i.b=qn(i.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===at&&(i.r=Vi(i.r),i.g=Vi(i.g),i.b=Vi(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===oi?br:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,a){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return Tr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return Tr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(i,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[Yt]:{primaries:e,whitePoint:n,transfer:br,toXYZ:Cl,fromXYZ:Pl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Et},outputColorSpaceConfig:{drawingBufferColorSpace:Et}},[Et]:{primaries:e,whitePoint:n,transfer:at,toXYZ:Cl,fromXYZ:Pl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Et}}}),r}const Qe=Jd();function qn(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Vi(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Ti;class Qd{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ti===void 0&&(Ti=Cs("canvas")),Ti.width=e.width,Ti.height=e.height;const i=Ti.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Ti}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Cs("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=qn(s[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(qn(t[n]/255)*255):t[n]=qn(t[n]);return{data:t,width:e.width,height:e.height}}else return Ie("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let eu=0;class Ko{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:eu++}),this.uuid=mn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?s.push(Xr(i[a].image)):s.push(Xr(i[a]))}else s=Xr(i);n.url=s}return t||(e.images[this.uuid]=n),n}}function Xr(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Qd.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(Ie("Texture: Unable to serialize Texture."),{})}let tu=0;const qr=new L;class Ct extends Qi{constructor(e=Ct.DEFAULT_IMAGE,t=Ct.DEFAULT_MAPPING,n=Tn,i=Tn,s=Rt,a=Gn,o=rn,c=Jt,l=Ct.DEFAULT_ANISOTROPY,h=oi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:tu++}),this.uuid=mn(),this.name="",this.source=new Ko(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Xe(0,0),this.repeat=new Xe(1,1),this.center=new Xe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(qr).x}get height(){return this.source.getSize(qr).y}get depth(){return this.source.getSize(qr).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Ie(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Ie(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==oh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Cn:e.x=e.x-Math.floor(e.x);break;case Tn:e.x=e.x<0?0:1;break;case Sr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Cn:e.y=e.y-Math.floor(e.y);break;case Tn:e.y=e.y<0?0:1;break;case Sr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ct.DEFAULT_IMAGE=null;Ct.DEFAULT_MAPPING=oh;Ct.DEFAULT_ANISOTROPY=1;class _t{constructor(e=0,t=0,n=0,i=1){_t.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s;const c=e.elements,l=c[0],h=c[4],d=c[8],u=c[1],f=c[5],x=c[9],g=c[2],m=c[6],p=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-g)<.01&&Math.abs(x-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+g)<.1&&Math.abs(x+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const S=(l+1)/2,M=(f+1)/2,E=(p+1)/2,T=(h+u)/4,R=(d+g)/4,v=(x+m)/4;return S>M&&S>E?S<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(S),i=T/n,s=R/n):M>E?M<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(M),n=T/i,s=v/i):E<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(E),n=R/s,i=v/s),this.set(n,i,s,t),this}let _=Math.sqrt((m-x)*(m-x)+(d-g)*(d-g)+(u-h)*(u-h));return Math.abs(_)<.001&&(_=1),this.x=(m-x)/_,this.y=(d-g)/_,this.z=(u-h)/_,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this.w=$e(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this.w=$e(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class nu extends Qi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Rt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new _t(0,0,e,t),this.scissorTest=!1,this.viewport=new _t(0,0,e,t),this.textures=[];const i={width:e,height:t,depth:n.depth},s=new Ct(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:Rt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new Ko(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Rn extends nu{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class xh extends Ct{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=At,this.minFilter=At,this.wrapR=Tn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class iu extends Ct{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=At,this.minFilter=At,this.wrapR=Tn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ve{constructor(e,t,n,i,s,a,o,c,l,h,d,u,f,x,g,m){Ve.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,c,l,h,d,u,f,x,g,m)}set(e,t,n,i,s,a,o,c,l,h,d,u,f,x,g,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=s,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=x,p[11]=g,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ve().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,n=e.elements,i=1/Ei.setFromMatrixColumn(e,0).length(),s=1/Ei.setFromMatrixColumn(e,1).length(),a=1/Ei.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const u=a*h,f=a*d,x=o*h,g=o*d;t[0]=c*h,t[4]=-c*d,t[8]=l,t[1]=f+x*l,t[5]=u-g*l,t[9]=-o*c,t[2]=g-u*l,t[6]=x+f*l,t[10]=a*c}else if(e.order==="YXZ"){const u=c*h,f=c*d,x=l*h,g=l*d;t[0]=u+g*o,t[4]=x*o-f,t[8]=a*l,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=f*o-x,t[6]=g+u*o,t[10]=a*c}else if(e.order==="ZXY"){const u=c*h,f=c*d,x=l*h,g=l*d;t[0]=u-g*o,t[4]=-a*d,t[8]=x+f*o,t[1]=f+x*o,t[5]=a*h,t[9]=g-u*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const u=a*h,f=a*d,x=o*h,g=o*d;t[0]=c*h,t[4]=x*l-f,t[8]=u*l+g,t[1]=c*d,t[5]=g*l+u,t[9]=f*l-x,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const u=a*c,f=a*l,x=o*c,g=o*l;t[0]=c*h,t[4]=g-u*d,t[8]=x*d+f,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=f*d+x,t[10]=u-g*d}else if(e.order==="XZY"){const u=a*c,f=a*l,x=o*c,g=o*l;t[0]=c*h,t[4]=-d,t[8]=l*h,t[1]=u*d+g,t[5]=a*h,t[9]=f*d-x,t[2]=x*d-f,t[6]=o*h,t[10]=g*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(su,e,ru)}lookAt(e,t,n){const i=this.elements;return $t.subVectors(e,t),$t.lengthSq()===0&&($t.z=1),$t.normalize(),Qn.crossVectors(n,$t),Qn.lengthSq()===0&&(Math.abs(n.z)===1?$t.x+=1e-4:$t.z+=1e-4,$t.normalize(),Qn.crossVectors(n,$t)),Qn.normalize(),Os.crossVectors($t,Qn),i[0]=Qn.x,i[4]=Os.x,i[8]=$t.x,i[1]=Qn.y,i[5]=Os.y,i[9]=$t.y,i[2]=Qn.z,i[6]=Os.z,i[10]=$t.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],d=n[5],u=n[9],f=n[13],x=n[2],g=n[6],m=n[10],p=n[14],_=n[3],S=n[7],M=n[11],E=n[15],T=i[0],R=i[4],v=i[8],w=i[12],B=i[1],C=i[5],N=i[9],F=i[13],z=i[2],k=i[6],O=i[10],H=i[14],J=i[3],Q=i[7],he=i[11],xe=i[15];return s[0]=a*T+o*B+c*z+l*J,s[4]=a*R+o*C+c*k+l*Q,s[8]=a*v+o*N+c*O+l*he,s[12]=a*w+o*F+c*H+l*xe,s[1]=h*T+d*B+u*z+f*J,s[5]=h*R+d*C+u*k+f*Q,s[9]=h*v+d*N+u*O+f*he,s[13]=h*w+d*F+u*H+f*xe,s[2]=x*T+g*B+m*z+p*J,s[6]=x*R+g*C+m*k+p*Q,s[10]=x*v+g*N+m*O+p*he,s[14]=x*w+g*F+m*H+p*xe,s[3]=_*T+S*B+M*z+E*J,s[7]=_*R+S*C+M*k+E*Q,s[11]=_*v+S*N+M*O+E*he,s[15]=_*w+S*F+M*H+E*xe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],d=e[6],u=e[10],f=e[14],x=e[3],g=e[7],m=e[11],p=e[15],_=c*f-l*u,S=o*f-l*d,M=o*u-c*d,E=a*f-l*h,T=a*u-c*h,R=a*d-o*h;return t*(g*_-m*S+p*M)-n*(x*_-m*E+p*T)+i*(x*S-g*E+p*R)-s*(x*M-g*T+m*R)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=e[9],u=e[10],f=e[11],x=e[12],g=e[13],m=e[14],p=e[15],_=t*o-n*a,S=t*c-i*a,M=t*l-s*a,E=n*c-i*o,T=n*l-s*o,R=i*l-s*c,v=h*g-d*x,w=h*m-u*x,B=h*p-f*x,C=d*m-u*g,N=d*p-f*g,F=u*p-f*m,z=_*F-S*N+M*C+E*B-T*w+R*v;if(z===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const k=1/z;return e[0]=(o*F-c*N+l*C)*k,e[1]=(i*N-n*F-s*C)*k,e[2]=(g*R-m*T+p*E)*k,e[3]=(u*T-d*R-f*E)*k,e[4]=(c*B-a*F-l*w)*k,e[5]=(t*F-i*B+s*w)*k,e[6]=(m*M-x*R-p*S)*k,e[7]=(h*R-u*M+f*S)*k,e[8]=(a*N-o*B+l*v)*k,e[9]=(n*B-t*N-s*v)*k,e[10]=(x*T-g*M+p*_)*k,e[11]=(d*M-h*T-f*_)*k,e[12]=(o*w-a*C-c*v)*k,e[13]=(t*C-n*w+i*v)*k,e[14]=(g*S-x*E-m*_)*k,e[15]=(h*E-d*S+u*_)*k,this}scale(e){const t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,a=e.x,o=e.y,c=e.z,l=s*a,h=s*o;return this.set(l*a+n,l*o-i*c,l*c+i*o,0,l*o+i*c,h*o+n,h*c-i*a,0,l*c-i*o,h*c+i*a,s*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,a){return this.set(1,n,s,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,s=t._x,a=t._y,o=t._z,c=t._w,l=s+s,h=a+a,d=o+o,u=s*l,f=s*h,x=s*d,g=a*h,m=a*d,p=o*d,_=c*l,S=c*h,M=c*d,E=n.x,T=n.y,R=n.z;return i[0]=(1-(g+p))*E,i[1]=(f+M)*E,i[2]=(x-S)*E,i[3]=0,i[4]=(f-M)*T,i[5]=(1-(u+p))*T,i[6]=(m+_)*T,i[7]=0,i[8]=(x+S)*R,i[9]=(m-_)*R,i[10]=(1-(u+g))*R,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];const s=this.determinant();if(s===0)return n.set(1,1,1),t.identity(),this;let a=Ei.set(i[0],i[1],i[2]).length();const o=Ei.set(i[4],i[5],i[6]).length(),c=Ei.set(i[8],i[9],i[10]).length();s<0&&(a=-a),cn.copy(this);const l=1/a,h=1/o,d=1/c;return cn.elements[0]*=l,cn.elements[1]*=l,cn.elements[2]*=l,cn.elements[4]*=h,cn.elements[5]*=h,cn.elements[6]*=h,cn.elements[8]*=d,cn.elements[9]*=d,cn.elements[10]*=d,t.setFromRotationMatrix(cn),n.x=a,n.y=o,n.z=c,this}makePerspective(e,t,n,i,s,a,o=En,c=!1){const l=this.elements,h=2*s/(t-e),d=2*s/(n-i),u=(t+e)/(t-e),f=(n+i)/(n-i);let x,g;if(c)x=s/(a-s),g=a*s/(a-s);else if(o===En)x=-(a+s)/(a-s),g=-2*a*s/(a-s);else if(o===Rs)x=-a/(a-s),g=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=x,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,s,a,o=En,c=!1){const l=this.elements,h=2/(t-e),d=2/(n-i),u=-(t+e)/(t-e),f=-(n+i)/(n-i);let x,g;if(c)x=1/(a-s),g=a/(a-s);else if(o===En)x=-2/(a-s),g=-(a+s)/(a-s);else if(o===Rs)x=-1/(a-s),g=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=x,l[14]=g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ei=new L,cn=new Ve,su=new L(0,0,0),ru=new L(1,1,1),Qn=new L,Os=new L,$t=new L,Ll=new Ve,Il=new In;class on{constructor(e=0,t=0,n=0,i=on.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,s=i[0],a=i[4],o=i[8],c=i[1],l=i[5],h=i[9],d=i[2],u=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin($e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin($e(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-$e(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin($e(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-$e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ie("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ll.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ll,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Il.setFromEuler(this),this.setFromQuaternion(Il,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}on.DEFAULT_ORDER="XYZ";class Yo{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let au=0;const Dl=new L,Ai=new In,Fn=new Ve,Bs=new L,rs=new L,ou=new L,lu=new In,Nl=new L(1,0,0),Ul=new L(0,1,0),Fl=new L(0,0,1),Ol={type:"added"},cu={type:"removed"},Ri={type:"childadded",child:null},Kr={type:"childremoved",child:null};class vt extends Qi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:au++}),this.uuid=mn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=vt.DEFAULT_UP.clone();const e=new L,t=new on,n=new In,i=new L(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ve},normalMatrix:{value:new We}}),this.matrix=new Ve,this.matrixWorld=new Ve,this.matrixAutoUpdate=vt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Yo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ai.setFromAxisAngle(e,t),this.quaternion.multiply(Ai),this}rotateOnWorldAxis(e,t){return Ai.setFromAxisAngle(e,t),this.quaternion.premultiply(Ai),this}rotateX(e){return this.rotateOnAxis(Nl,e)}rotateY(e){return this.rotateOnAxis(Ul,e)}rotateZ(e){return this.rotateOnAxis(Fl,e)}translateOnAxis(e,t){return Dl.copy(e).applyQuaternion(this.quaternion),this.position.add(Dl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Nl,e)}translateY(e){return this.translateOnAxis(Ul,e)}translateZ(e){return this.translateOnAxis(Fl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Fn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Bs.copy(e):Bs.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),rs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Fn.lookAt(rs,Bs,this.up):Fn.lookAt(Bs,rs,this.up),this.quaternion.setFromRotationMatrix(Fn),i&&(Fn.extractRotation(i.matrixWorld),Ai.setFromRotationMatrix(Fn),this.quaternion.premultiply(Ai.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Oe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ol),Ri.child=e,this.dispatchEvent(Ri),Ri.child=null):Oe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(cu),Kr.child=e,this.dispatchEvent(Kr),Kr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Fn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Fn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Fn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ol),Ri.child=e,this.dispatchEvent(Ri),Ri.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,e,ou),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,lu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,i=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*i,s[13]+=n-s[1]*t-s[5]*n-s[9]*i,s[14]+=i-s[2]*t-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),this.static!==!1&&(i.static=this.static),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const d=c[l];s(e.shapes,d)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(e.materials,this.material[c]));i.material=o}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];i.animations.push(s(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),d=a(e.shapes),u=a(e.skeletons),f=a(e.animations),x=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),x.length>0&&(n.nodes=x)}return n.object=i,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),e.pivot!==null&&(this.pivot=e.pivot.clone()),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}vt.DEFAULT_UP=new L(0,1,0);vt.DEFAULT_MATRIX_AUTO_UPDATE=!0;vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class nt extends vt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const hu={type:"move"};class Yr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new nt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new nt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new nt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const g of e.hand.values()){const m=t.getJointPose(g,n),p=this._getHandJoint(l,g);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,x=.005;l.inputState.pinching&&u>f+x?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=f-x&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(hu)))}return o!==null&&(o.visible=i!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new nt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const _h={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ei={h:0,s:0,l:0},ks={h:0,s:0,l:0};function jr(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class Ne{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Et){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Qe.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=Qe.workingColorSpace){return this.r=e,this.g=t,this.b=n,Qe.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=Qe.workingColorSpace){if(e=qo(e,1),t=$e(t,0,1),n=$e(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=jr(a,s,e+1/3),this.g=jr(a,s,e),this.b=jr(a,s,e-1/3)}return Qe.colorSpaceToWorking(this,i),this}setStyle(e,t=Et){function n(s){s!==void 0&&parseFloat(s)<1&&Ie("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Ie("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);Ie("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Et){const n=_h[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ie("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=qn(e.r),this.g=qn(e.g),this.b=qn(e.b),this}copyLinearToSRGB(e){return this.r=Vi(e.r),this.g=Vi(e.g),this.b=Vi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Et){return Qe.workingToColorSpace(zt.copy(this),e),Math.round($e(zt.r*255,0,255))*65536+Math.round($e(zt.g*255,0,255))*256+Math.round($e(zt.b*255,0,255))}getHexString(e=Et){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Qe.workingColorSpace){Qe.workingToColorSpace(zt.copy(this),t);const n=zt.r,i=zt.g,s=zt.b,a=Math.max(n,i,s),o=Math.min(n,i,s);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const d=a-o;switch(l=h<=.5?d/(a+o):d/(2-a-o),a){case n:c=(i-s)/d+(i<s?6:0);break;case i:c=(s-n)/d+2;break;case s:c=(n-i)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=Qe.workingColorSpace){return Qe.workingToColorSpace(zt.copy(this),t),e.r=zt.r,e.g=zt.g,e.b=zt.b,e}getStyle(e=Et){Qe.workingToColorSpace(zt.copy(this),e);const t=zt.r,n=zt.g,i=zt.b;return e!==Et?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(ei),this.setHSL(ei.h+e,ei.s+t,ei.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ei),e.getHSL(ks);const n=Ss(ei.h,ks.h,t),i=Ss(ei.s,ks.s,t),s=Ss(ei.l,ks.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const zt=new Ne;Ne.NAMES=_h;class jo{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ne(e),this.density=t}clone(){return new jo(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class vh extends vt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new on,this.environmentIntensity=1,this.environmentRotation=new on,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const hn=new L,On=new L,$r=new L,Bn=new L,Ci=new L,Pi=new L,Bl=new L,Zr=new L,Jr=new L,Qr=new L,ea=new _t,ta=new _t,na=new _t;class fn{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),hn.subVectors(e,t),i.cross(hn);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){hn.subVectors(i,t),On.subVectors(n,t),$r.subVectors(e,t);const a=hn.dot(hn),o=hn.dot(On),c=hn.dot($r),l=On.dot(On),h=On.dot($r),d=a*l-o*o;if(d===0)return s.set(0,0,0),null;const u=1/d,f=(l*c-o*h)*u,x=(a*h-o*c)*u;return s.set(1-f-x,x,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Bn)===null?!1:Bn.x>=0&&Bn.y>=0&&Bn.x+Bn.y<=1}static getInterpolation(e,t,n,i,s,a,o,c){return this.getBarycoord(e,t,n,i,Bn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Bn.x),c.addScaledVector(a,Bn.y),c.addScaledVector(o,Bn.z),c)}static getInterpolatedAttribute(e,t,n,i,s,a){return ea.setScalar(0),ta.setScalar(0),na.setScalar(0),ea.fromBufferAttribute(e,t),ta.fromBufferAttribute(e,n),na.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(ea,s.x),a.addScaledVector(ta,s.y),a.addScaledVector(na,s.z),a}static isFrontFacing(e,t,n,i){return hn.subVectors(n,t),On.subVectors(e,t),hn.cross(On).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return hn.subVectors(this.c,this.b),On.subVectors(this.a,this.b),hn.cross(On).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return fn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return fn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return fn.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return fn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return fn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,s=this.c;let a,o;Ci.subVectors(i,n),Pi.subVectors(s,n),Zr.subVectors(e,n);const c=Ci.dot(Zr),l=Pi.dot(Zr);if(c<=0&&l<=0)return t.copy(n);Jr.subVectors(e,i);const h=Ci.dot(Jr),d=Pi.dot(Jr);if(h>=0&&d<=h)return t.copy(i);const u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return a=c/(c-h),t.copy(n).addScaledVector(Ci,a);Qr.subVectors(e,s);const f=Ci.dot(Qr),x=Pi.dot(Qr);if(x>=0&&f<=x)return t.copy(s);const g=f*l-c*x;if(g<=0&&l>=0&&x<=0)return o=l/(l-x),t.copy(n).addScaledVector(Pi,o);const m=h*x-f*d;if(m<=0&&d-h>=0&&f-x>=0)return Bl.subVectors(s,i),o=(d-h)/(d-h+(f-x)),t.copy(i).addScaledVector(Bl,o);const p=1/(m+g+u);return a=g*p,o=u*p,t.copy(n).addScaledVector(Ci,a).addScaledVector(Pi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class xn{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(dn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(dn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=dn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,dn):dn.fromBufferAttribute(s,a),dn.applyMatrix4(e.matrixWorld),this.expandByPoint(dn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),zs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),zs.copy(n.boundingBox)),zs.applyMatrix4(e.matrixWorld),this.union(zs)}const i=e.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,dn),dn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(as),Hs.subVectors(this.max,as),Li.subVectors(e.a,as),Ii.subVectors(e.b,as),Di.subVectors(e.c,as),ti.subVectors(Ii,Li),ni.subVectors(Di,Ii),di.subVectors(Li,Di);let t=[0,-ti.z,ti.y,0,-ni.z,ni.y,0,-di.z,di.y,ti.z,0,-ti.x,ni.z,0,-ni.x,di.z,0,-di.x,-ti.y,ti.x,0,-ni.y,ni.x,0,-di.y,di.x,0];return!ia(t,Li,Ii,Di,Hs)||(t=[1,0,0,0,1,0,0,0,1],!ia(t,Li,Ii,Di,Hs))?!1:(Vs.crossVectors(ti,ni),t=[Vs.x,Vs.y,Vs.z],ia(t,Li,Ii,Di,Hs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,dn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(dn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(kn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),kn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),kn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),kn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),kn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),kn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),kn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),kn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(kn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const kn=[new L,new L,new L,new L,new L,new L,new L,new L],dn=new L,zs=new xn,Li=new L,Ii=new L,Di=new L,ti=new L,ni=new L,di=new L,as=new L,Hs=new L,Vs=new L,ui=new L;function ia(r,e,t,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){ui.fromArray(r,s);const o=i.x*Math.abs(ui.x)+i.y*Math.abs(ui.y)+i.z*Math.abs(ui.z),c=e.dot(ui),l=t.dot(ui),h=n.dot(ui);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const bt=new L,Gs=new Xe;let du=0;class Gt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:du++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=yo,this.updateRanges=[],this.gpuType=sn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Gs.fromBufferAttribute(this,t),Gs.applyMatrix3(e),this.setXY(t,Gs.x,Gs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix3(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix4(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyNormalMatrix(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.transformDirection(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=un(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ot(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=un(t,this.array)),t}setX(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=un(t,this.array)),t}setY(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=un(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=un(t,this.array)),t}setW(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),i=ot(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),i=ot(i,this.array),s=ot(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==yo&&(e.usage=this.usage),e}}class yh extends Gt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Mh extends Gt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class mt extends Gt{constructor(e,t,n){super(new Float32Array(e),t,n)}}const uu=new xn,os=new L,sa=new L;class Dn{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):uu.setFromPoints(e).getCenter(n);let i=0;for(let s=0,a=e.length;s<a;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;os.subVectors(e,this.center);const t=os.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(os,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(sa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(os.copy(e.center).add(sa)),this.expandByPoint(os.copy(e.center).sub(sa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let fu=0;const en=new Ve,ra=new vt,Ni=new L,Zt=new xn,ls=new xn,Dt=new L;class Ot extends Qi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:fu++}),this.uuid=mn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ld(e)?Mh:yh)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new We().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return en.makeRotationFromQuaternion(e),this.applyMatrix4(en),this}rotateX(e){return en.makeRotationX(e),this.applyMatrix4(en),this}rotateY(e){return en.makeRotationY(e),this.applyMatrix4(en),this}rotateZ(e){return en.makeRotationZ(e),this.applyMatrix4(en),this}translate(e,t,n){return en.makeTranslation(e,t,n),this.applyMatrix4(en),this}scale(e,t,n){return en.makeScale(e,t,n),this.applyMatrix4(en),this}lookAt(e){return ra.lookAt(e),ra.updateMatrix(),this.applyMatrix4(ra.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ni).negate(),this.translate(Ni.x,Ni.y,Ni.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,s=e.length;i<s;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new mt(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&Ie("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new xn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Oe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const s=t[n];Zt.setFromBufferAttribute(s),this.morphTargetsRelative?(Dt.addVectors(this.boundingBox.min,Zt.min),this.boundingBox.expandByPoint(Dt),Dt.addVectors(this.boundingBox.max,Zt.max),this.boundingBox.expandByPoint(Dt)):(this.boundingBox.expandByPoint(Zt.min),this.boundingBox.expandByPoint(Zt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Oe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Dn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Oe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const n=this.boundingSphere.center;if(Zt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];ls.setFromBufferAttribute(o),this.morphTargetsRelative?(Dt.addVectors(Zt.min,ls.min),Zt.expandByPoint(Dt),Dt.addVectors(Zt.max,ls.max),Zt.expandByPoint(Dt)):(Zt.expandByPoint(ls.min),Zt.expandByPoint(ls.max))}Zt.getCenter(n);let i=0;for(let s=0,a=e.count;s<a;s++)Dt.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Dt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Dt.fromBufferAttribute(o,l),c&&(Ni.fromBufferAttribute(e,l),Dt.add(Ni)),i=Math.max(i,n.distanceToSquared(Dt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Oe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Oe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Gt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let v=0;v<n.count;v++)o[v]=new L,c[v]=new L;const l=new L,h=new L,d=new L,u=new Xe,f=new Xe,x=new Xe,g=new L,m=new L;function p(v,w,B){l.fromBufferAttribute(n,v),h.fromBufferAttribute(n,w),d.fromBufferAttribute(n,B),u.fromBufferAttribute(s,v),f.fromBufferAttribute(s,w),x.fromBufferAttribute(s,B),h.sub(l),d.sub(l),f.sub(u),x.sub(u);const C=1/(f.x*x.y-x.x*f.y);isFinite(C)&&(g.copy(h).multiplyScalar(x.y).addScaledVector(d,-f.y).multiplyScalar(C),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-x.x).multiplyScalar(C),o[v].add(g),o[w].add(g),o[B].add(g),c[v].add(m),c[w].add(m),c[B].add(m))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let v=0,w=_.length;v<w;++v){const B=_[v],C=B.start,N=B.count;for(let F=C,z=C+N;F<z;F+=3)p(e.getX(F+0),e.getX(F+1),e.getX(F+2))}const S=new L,M=new L,E=new L,T=new L;function R(v){E.fromBufferAttribute(i,v),T.copy(E);const w=o[v];S.copy(w),S.sub(E.multiplyScalar(E.dot(w))).normalize(),M.crossVectors(T,w);const C=M.dot(c[v])<0?-1:1;a.setXYZW(v,S.x,S.y,S.z,C)}for(let v=0,w=_.length;v<w;++v){const B=_[v],C=B.start,N=B.count;for(let F=C,z=C+N;F<z;F+=3)R(e.getX(F+0)),R(e.getX(F+1)),R(e.getX(F+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Gt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const i=new L,s=new L,a=new L,o=new L,c=new L,l=new L,h=new L,d=new L;if(e)for(let u=0,f=e.count;u<f;u+=3){const x=e.getX(u+0),g=e.getX(u+1),m=e.getX(u+2);i.fromBufferAttribute(t,x),s.fromBufferAttribute(t,g),a.fromBufferAttribute(t,m),h.subVectors(a,s),d.subVectors(i,s),h.cross(d),o.fromBufferAttribute(n,x),c.fromBufferAttribute(n,g),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(g,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,f=t.count;u<f;u+=3)i.fromBufferAttribute(t,u+0),s.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,s),d.subVectors(i,s),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Dt.fromBufferAttribute(e,t),Dt.normalize(),e.setXYZ(t,Dt.x,Dt.y,Dt.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,d=o.normalized,u=new l.constructor(c.length*h);let f=0,x=0;for(let g=0,m=c.length;g<m;g++){o.isInterleavedBufferAttribute?f=c[g]*o.data.stride+o.offset:f=c[g]*h;for(let p=0;p<h;p++)u[x++]=l[f++]}return new Gt(u,h,d)}if(this.index===null)return Ie("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ot,n=this.index.array,i=this.attributes;for(const o in i){const c=i[o],l=e(c,n);t.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let h=0,d=l.length;h<d;h++){const u=l[h],f=e(u,n);c.push(f)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const i={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){const f=l[d];h.push(f.toJSON(e.data))}h.length>0&&(i[c]=h,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const l in i){const h=i[l];this.setAttribute(l,h.clone(t))}const s=e.morphAttributes;for(const l in s){const h=[],d=s[l];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,h=a.length;l<h;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}class pu{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=yo,this.updateRanges=[],this.version=0,this.uuid=mn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=mn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=mn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Wt=new L;class $o{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Wt.fromBufferAttribute(this,t),Wt.applyMatrix4(e),this.setXYZ(t,Wt.x,Wt.y,Wt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Wt.fromBufferAttribute(this,t),Wt.applyNormalMatrix(e),this.setXYZ(t,Wt.x,Wt.y,Wt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Wt.fromBufferAttribute(this,t),Wt.transformDirection(e),this.setXYZ(t,Wt.x,Wt.y,Wt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=un(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ot(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=un(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=un(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=un(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=un(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),i=ot(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),i=ot(i,this.array),s=ot(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){wr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new Gt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new $o(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){wr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let mu=0;class gn extends Qi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:mu++}),this.uuid=mn(),this.name="",this.type="Material",this.blending=Hi,this.side=Kn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=La,this.blendDst=Ia,this.blendEquation=_i,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ne(0,0,0),this.blendAlpha=0,this.depthFunc=Xi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=wl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=wi,this.stencilZFail=wi,this.stencilZPass=wi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Ie(`Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Ie(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Hi&&(n.blending=this.blending),this.side!==Kn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==La&&(n.blendSrc=this.blendSrc),this.blendDst!==Ia&&(n.blendDst=this.blendDst),this.blendEquation!==_i&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Xi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==wl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==wi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==wi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==wi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(t){const s=i(e.textures),a=i(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const zn=new L,aa=new L,Ws=new L,ii=new L,oa=new L,Xs=new L,la=new L;class Ns{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,zn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=zn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(zn.copy(this.origin).addScaledVector(this.direction,t),zn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){aa.copy(e).add(t).multiplyScalar(.5),Ws.copy(t).sub(e).normalize(),ii.copy(this.origin).sub(aa);const s=e.distanceTo(t)*.5,a=-this.direction.dot(Ws),o=ii.dot(this.direction),c=-ii.dot(Ws),l=ii.lengthSq(),h=Math.abs(1-a*a);let d,u,f,x;if(h>0)if(d=a*c-o,u=a*o-c,x=s*h,d>=0)if(u>=-x)if(u<=x){const g=1/h;d*=g,u*=g,f=d*(d+a*u+2*o)+u*(a*d+u+2*c)+l}else u=s,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u=-s,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u<=-x?(d=Math.max(0,-(-a*s+o)),u=d>0?-s:Math.min(Math.max(-s,-c),s),f=-d*d+u*(u+2*c)+l):u<=x?(d=0,u=Math.min(Math.max(-s,-c),s),f=u*(u+2*c)+l):(d=Math.max(0,-(a*s+o)),u=d>0?s:Math.min(Math.max(-s,-c),s),f=-d*d+u*(u+2*c)+l);else u=a>0?-s:s,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(aa).addScaledVector(Ws,u),f}intersectSphere(e,t){zn.subVectors(e.center,this.origin);const n=zn.dot(this.direction),i=zn.dot(zn)-n*n,s=e.radius*e.radius;if(i>s)return null;const a=Math.sqrt(s-i),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(n=(e.min.x-u.x)*l,i=(e.max.x-u.x)*l):(n=(e.max.x-u.x)*l,i=(e.min.x-u.x)*l),h>=0?(s=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(s=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),n>a||s>i||((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),d>=0?(o=(e.min.z-u.z)*d,c=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,c=(e.min.z-u.z)*d),n>c||o>i)||((o>n||n!==n)&&(n=o),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,zn)!==null}intersectTriangle(e,t,n,i,s){oa.subVectors(t,e),Xs.subVectors(n,e),la.crossVectors(oa,Xs);let a=this.direction.dot(la),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ii.subVectors(this.origin,e);const c=o*this.direction.dot(Xs.crossVectors(ii,Xs));if(c<0)return null;const l=o*this.direction.dot(oa.cross(ii));if(l<0||c+l>a)return null;const h=-o*ii.dot(la);return h<0?null:this.at(h/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Kt extends gn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.combine=Uo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const kl=new Ve,fi=new Ns,qs=new Dn,zl=new L,Ks=new L,Ys=new L,js=new L,ca=new L,$s=new L,Hl=new L,Zs=new L;class Y extends vt{constructor(e=new Ot,t=new Kt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(s&&o){$s.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=o[c],d=s[c];h!==0&&(ca.fromBufferAttribute(d,e),a?$s.addScaledVector(ca,h):$s.addScaledVector(ca.sub(t),h))}t.add($s)}return t}raycast(e,t){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),qs.copy(n.boundingSphere),qs.applyMatrix4(s),fi.copy(e.ray).recast(e.near),!(qs.containsPoint(fi.origin)===!1&&(fi.intersectSphere(qs,zl)===null||fi.origin.distanceToSquared(zl)>(e.far-e.near)**2))&&(kl.copy(s).invert(),fi.copy(e.ray).applyMatrix4(kl),!(n.boundingBox!==null&&fi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,fi)))}_computeIntersections(e,t,n){let i;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,u=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,g=u.length;x<g;x++){const m=u[x],p=a[m.materialIndex],_=Math.max(m.start,f.start),S=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let M=_,E=S;M<E;M+=3){const T=o.getX(M),R=o.getX(M+1),v=o.getX(M+2);i=Js(this,p,e,n,l,h,d,T,R,v),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const x=Math.max(0,f.start),g=Math.min(o.count,f.start+f.count);for(let m=x,p=g;m<p;m+=3){const _=o.getX(m),S=o.getX(m+1),M=o.getX(m+2);i=Js(this,a,e,n,l,h,d,_,S,M),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(c!==void 0)if(Array.isArray(a))for(let x=0,g=u.length;x<g;x++){const m=u[x],p=a[m.materialIndex],_=Math.max(m.start,f.start),S=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let M=_,E=S;M<E;M+=3){const T=M,R=M+1,v=M+2;i=Js(this,p,e,n,l,h,d,T,R,v),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const x=Math.max(0,f.start),g=Math.min(c.count,f.start+f.count);for(let m=x,p=g;m<p;m+=3){const _=m,S=m+1,M=m+2;i=Js(this,a,e,n,l,h,d,_,S,M),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function gu(r,e,t,n,i,s,a,o){let c;if(e.side===Vt?c=n.intersectTriangle(a,s,i,!0,o):c=n.intersectTriangle(i,s,a,e.side===Kn,o),c===null)return null;Zs.copy(o),Zs.applyMatrix4(r.matrixWorld);const l=t.ray.origin.distanceTo(Zs);return l<t.near||l>t.far?null:{distance:l,point:Zs.clone(),object:r}}function Js(r,e,t,n,i,s,a,o,c,l){r.getVertexPosition(o,Ks),r.getVertexPosition(c,Ys),r.getVertexPosition(l,js);const h=gu(r,e,t,n,Ks,Ys,js,Hl);if(h){const d=new L;fn.getBarycoord(Hl,Ks,Ys,js,d),i&&(h.uv=fn.getInterpolatedAttribute(i,o,c,l,d,new Xe)),s&&(h.uv1=fn.getInterpolatedAttribute(s,o,c,l,d,new Xe)),a&&(h.normal=fn.getInterpolatedAttribute(a,o,c,l,d,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:c,c:l,normal:new L,materialIndex:0};fn.getNormal(Ks,Ys,js,u.normal),h.face=u,h.barycoord=d}return h}const Vl=new L,Gl=new _t,Wl=new _t,xu=new L,Xl=new Ve,Qs=new L,ha=new Dn,ql=new Ve,da=new Ns;class _u extends Y{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=vl,this.bindMatrix=new Ve,this.bindMatrixInverse=new Ve,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new xn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Qs),this.boundingBox.expandByPoint(Qs)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Dn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Qs),this.boundingSphere.expandByPoint(Qs)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ha.copy(this.boundingSphere),ha.applyMatrix4(i),e.ray.intersectsSphere(ha)!==!1&&(ql.copy(i).invert(),da.copy(e.ray).applyMatrix4(ql),!(this.boundingBox!==null&&da.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,da)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new _t,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===vl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===vd?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ie("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;Gl.fromBufferAttribute(i.attributes.skinIndex,e),Wl.fromBufferAttribute(i.attributes.skinWeight,e),Vl.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){const a=Wl.getComponent(s);if(a!==0){const o=Gl.getComponent(s);Xl.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(xu.copy(Vl).applyMatrix4(Xl),a)}}return t.applyMatrix4(this.bindMatrixInverse)}}class Sh extends vt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Zo extends Ct{constructor(e=null,t=1,n=1,i,s,a,o,c,l=At,h=At,d,u){super(null,a,o,c,l,h,i,s,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Kl=new Ve,vu=new Ve;class Jo{constructor(e=[],t=[]){this.uuid=mn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ie("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Ve)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Ve;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,a=e.length;s<a;s++){const o=e[s]?e[s].matrixWorld:vu;Kl.multiplyMatrices(o,t[s]),Kl.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new Jo(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Zo(t,e,e,rn,sn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const s=e.bones[n];let a=t[s];a===void 0&&(Ie("Skeleton: No bone found with UUID:",s),a=new Sh),this.bones.push(a),this.boneInverses.push(new Ve().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){const a=t[i];e.bones.push(a.uuid);const o=n[i];e.boneInverses.push(o.toArray())}return e}}class Mo extends Gt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ui=new Ve,Yl=new Ve,er=[],jl=new xn,yu=new Ve,cs=new Y,hs=new Dn;class Qo extends Y{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Mo(new Float32Array(n*16),16),this.previousInstanceMatrix=null,this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,yu)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new xn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ui),jl.copy(e.boundingBox).applyMatrix4(Ui),this.boundingBox.union(jl)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Dn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ui),hs.copy(e.boundingSphere).applyMatrix4(Ui),this.boundingSphere.union(hs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.previousInstanceMatrix!==null&&(this.previousInstanceMatrix=e.previousInstanceMatrix.clone()),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,a=e*s+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(cs.geometry=this.geometry,cs.material=this.material,cs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),hs.copy(this.boundingSphere),hs.applyMatrix4(n),e.ray.intersectsSphere(hs)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,Ui),Yl.multiplyMatrices(n,Ui),cs.matrixWorld=Yl,cs.raycast(e,er);for(let a=0,o=er.length;a<o;a++){const c=er[a];c.instanceId=s,c.object=this,t.push(c)}er.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Mo(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Zo(new Float32Array(i*this.count),i,this.count,ko,sn));const s=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=i*e;s[c]=o,s.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const ua=new L,Mu=new L,Su=new We;class ai{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=ua.subVectors(n,t).cross(Mu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(ua),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Su.getNormalMatrix(e),i=this.coplanarPoint(ua).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const pi=new Dn,bu=new Xe(.5,.5),tr=new L;class el{constructor(e=new ai,t=new ai,n=new ai,i=new ai,s=new ai,a=new ai){this.planes=[e,t,n,i,s,a]}set(e,t,n,i,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=En,n=!1){const i=this.planes,s=e.elements,a=s[0],o=s[1],c=s[2],l=s[3],h=s[4],d=s[5],u=s[6],f=s[7],x=s[8],g=s[9],m=s[10],p=s[11],_=s[12],S=s[13],M=s[14],E=s[15];if(i[0].setComponents(l-a,f-h,p-x,E-_).normalize(),i[1].setComponents(l+a,f+h,p+x,E+_).normalize(),i[2].setComponents(l+o,f+d,p+g,E+S).normalize(),i[3].setComponents(l-o,f-d,p-g,E-S).normalize(),n)i[4].setComponents(c,u,m,M).normalize(),i[5].setComponents(l-c,f-u,p-m,E-M).normalize();else if(i[4].setComponents(l-c,f-u,p-m,E-M).normalize(),t===En)i[5].setComponents(l+c,f+u,p+m,E+M).normalize();else if(t===Rs)i[5].setComponents(c,u,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),pi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),pi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(pi)}intersectsSprite(e){pi.center.set(0,0,0);const t=bu.distanceTo(e.center);return pi.radius=.7071067811865476+t,pi.applyMatrix4(e.matrixWorld),this.intersectsSphere(pi)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(tr.x=i.normal.x>0?e.max.x:e.min.x,tr.y=i.normal.y>0?e.max.y:e.min.y,tr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(tr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class bh extends gn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ne(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ar=new L,Rr=new L,$l=new Ve,ds=new Ns,nr=new Dn,fa=new L,Zl=new L;class tl extends vt{constructor(e=new Ot,t=new bh){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)Ar.fromBufferAttribute(t,i-1),Rr.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Ar.distanceTo(Rr);e.setAttribute("lineDistance",new mt(n,1))}else Ie("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),nr.copy(n.boundingSphere),nr.applyMatrix4(i),nr.radius+=s,e.ray.intersectsSphere(nr)===!1)return;$l.copy(i).invert(),ds.copy(e.ray).applyMatrix4($l);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),x=Math.min(h.count,a.start+a.count);for(let g=f,m=x-1;g<m;g+=l){const p=h.getX(g),_=h.getX(g+1),S=ir(this,e,ds,c,p,_,g);S&&t.push(S)}if(this.isLineLoop){const g=h.getX(x-1),m=h.getX(f),p=ir(this,e,ds,c,g,m,x-1);p&&t.push(p)}}else{const f=Math.max(0,a.start),x=Math.min(u.count,a.start+a.count);for(let g=f,m=x-1;g<m;g+=l){const p=ir(this,e,ds,c,g,g+1,g);p&&t.push(p)}if(this.isLineLoop){const g=ir(this,e,ds,c,x-1,f,x-1);g&&t.push(g)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function ir(r,e,t,n,i,s,a){const o=r.geometry.attributes.position;if(Ar.fromBufferAttribute(o,i),Rr.fromBufferAttribute(o,s),t.distanceSqToSegment(Ar,Rr,fa,Zl)>n)return;fa.applyMatrix4(r.matrixWorld);const l=e.ray.origin.distanceTo(fa);if(!(l<e.near||l>e.far))return{distance:l,point:Zl.clone().applyMatrix4(r.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:r}}const Jl=new L,Ql=new L;class wu extends tl{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)Jl.fromBufferAttribute(t,i),Ql.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Jl.distanceTo(Ql);e.setAttribute("lineDistance",new mt(n,1))}else Ie("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Tu extends tl{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class wh extends gn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ne(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const ec=new Ve,So=new Ns,sr=new Dn,rr=new L;class Eu extends vt{constructor(e=new Ot,t=new wh){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),sr.copy(n.boundingSphere),sr.applyMatrix4(i),sr.radius+=s,e.ray.intersectsSphere(sr)===!1)return;ec.copy(i).invert(),So.copy(e.ray).applyMatrix4(ec);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,d=n.attributes.position;if(l!==null){const u=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let x=u,g=f;x<g;x++){const m=l.getX(x);rr.fromBufferAttribute(d,m),tc(rr,m,c,i,e,t,this)}}else{const u=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let x=u,g=f;x<g;x++)rr.fromBufferAttribute(d,x),tc(rr,x,c,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function tc(r,e,t,n,i,s,a){const o=So.distanceSqToPoint(r);if(o<t){const c=new L;So.closestPointToPoint(r,c),c.applyMatrix4(n);const l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;s.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Th extends Ct{constructor(e=[],t=Mi,n,i,s,a,o,c,l,h){super(e,t,n,i,s,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class vr extends Ct{constructor(e,t,n,i,s,a,o,c,l){super(e,t,n,i,s,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ps extends Ct{constructor(e,t,n=Pn,i,s,a,o=At,c=At,l,h=jn,d=1){if(h!==jn&&h!==yi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:d};super(u,i,s,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ko(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Au extends Ps{constructor(e,t=Pn,n=Mi,i,s,a=At,o=At,c,l=jn){const h={width:e,height:e,depth:1},d=[h,h,h,h,h,h];super(e,e,t,n,i,s,a,o,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Eh extends Ct{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class an extends Ot{constructor(e=1,t=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};const o=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],h=[],d=[];let u=0,f=0;x("z","y","x",-1,-1,n,t,e,a,s,0),x("z","y","x",1,-1,n,t,-e,a,s,1),x("x","z","y",1,1,e,n,t,i,a,2),x("x","z","y",1,-1,e,n,-t,i,a,3),x("x","y","z",1,-1,e,t,n,i,s,4),x("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(c),this.setAttribute("position",new mt(l,3)),this.setAttribute("normal",new mt(h,3)),this.setAttribute("uv",new mt(d,2));function x(g,m,p,_,S,M,E,T,R,v,w){const B=M/R,C=E/v,N=M/2,F=E/2,z=T/2,k=R+1,O=v+1;let H=0,J=0;const Q=new L;for(let he=0;he<O;he++){const xe=he*C-F;for(let le=0;le<k;le++){const Be=le*B-N;Q[g]=Be*_,Q[m]=xe*S,Q[p]=z,l.push(Q.x,Q.y,Q.z),Q[g]=0,Q[m]=0,Q[p]=T>0?1:-1,h.push(Q.x,Q.y,Q.z),d.push(le/R),d.push(1-he/v),H+=1}}for(let he=0;he<v;he++)for(let xe=0;xe<R;xe++){const le=u+xe+k*he,Be=u+xe+k*(he+1),it=u+(xe+1)+k*(he+1),tt=u+(xe+1)+k*he;c.push(le,Be,tt),c.push(Be,it,tt),J+=6}o.addGroup(f,J,w),f+=J,u+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new an(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class wt extends Ot{constructor(e=1,t=1,n=1,i=32,s=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:c};const l=this;i=Math.floor(i),s=Math.floor(s);const h=[],d=[],u=[],f=[];let x=0;const g=[],m=n/2;let p=0;_(),a===!1&&(e>0&&S(!0),t>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new mt(d,3)),this.setAttribute("normal",new mt(u,3)),this.setAttribute("uv",new mt(f,2));function _(){const M=new L,E=new L;let T=0;const R=(t-e)/n;for(let v=0;v<=s;v++){const w=[],B=v/s,C=B*(t-e)+e;for(let N=0;N<=i;N++){const F=N/i,z=F*c+o,k=Math.sin(z),O=Math.cos(z);E.x=C*k,E.y=-B*n+m,E.z=C*O,d.push(E.x,E.y,E.z),M.set(k,R,O).normalize(),u.push(M.x,M.y,M.z),f.push(F,1-B),w.push(x++)}g.push(w)}for(let v=0;v<i;v++)for(let w=0;w<s;w++){const B=g[w][v],C=g[w+1][v],N=g[w+1][v+1],F=g[w][v+1];(e>0||w!==0)&&(h.push(B,C,F),T+=3),(t>0||w!==s-1)&&(h.push(C,N,F),T+=3)}l.addGroup(p,T,0),p+=T}function S(M){const E=x,T=new Xe,R=new L;let v=0;const w=M===!0?e:t,B=M===!0?1:-1;for(let N=1;N<=i;N++)d.push(0,m*B,0),u.push(0,B,0),f.push(.5,.5),x++;const C=x;for(let N=0;N<=i;N++){const z=N/i*c+o,k=Math.cos(z),O=Math.sin(z);R.x=w*O,R.y=m*B,R.z=w*k,d.push(R.x,R.y,R.z),u.push(0,B,0),T.x=k*.5+.5,T.y=O*.5*B+.5,f.push(T.x,T.y),x++}for(let N=0;N<i;N++){const F=E+N,z=C+N;M===!0?h.push(z,z+1,F):h.push(z+1,z,F),v+=3}l.addGroup(p,v,M===!0?1:2),p+=v}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Vn extends wt{constructor(e=1,t=1,n=32,i=1,s=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Vn(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ir extends Ot{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const s=[],a=[];o(i),l(n),h(),this.setAttribute("position",new mt(s,3)),this.setAttribute("normal",new mt(s.slice(),3)),this.setAttribute("uv",new mt(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(_){const S=new L,M=new L,E=new L;for(let T=0;T<t.length;T+=3)f(t[T+0],S),f(t[T+1],M),f(t[T+2],E),c(S,M,E,_)}function c(_,S,M,E){const T=E+1,R=[];for(let v=0;v<=T;v++){R[v]=[];const w=_.clone().lerp(M,v/T),B=S.clone().lerp(M,v/T),C=T-v;for(let N=0;N<=C;N++)N===0&&v===T?R[v][N]=w:R[v][N]=w.clone().lerp(B,N/C)}for(let v=0;v<T;v++)for(let w=0;w<2*(T-v)-1;w++){const B=Math.floor(w/2);w%2===0?(u(R[v][B+1]),u(R[v+1][B]),u(R[v][B])):(u(R[v][B+1]),u(R[v+1][B+1]),u(R[v+1][B]))}}function l(_){const S=new L;for(let M=0;M<s.length;M+=3)S.x=s[M+0],S.y=s[M+1],S.z=s[M+2],S.normalize().multiplyScalar(_),s[M+0]=S.x,s[M+1]=S.y,s[M+2]=S.z}function h(){const _=new L;for(let S=0;S<s.length;S+=3){_.x=s[S+0],_.y=s[S+1],_.z=s[S+2];const M=m(_)/2/Math.PI+.5,E=p(_)/Math.PI+.5;a.push(M,1-E)}x(),d()}function d(){for(let _=0;_<a.length;_+=6){const S=a[_+0],M=a[_+2],E=a[_+4],T=Math.max(S,M,E),R=Math.min(S,M,E);T>.9&&R<.1&&(S<.2&&(a[_+0]+=1),M<.2&&(a[_+2]+=1),E<.2&&(a[_+4]+=1))}}function u(_){s.push(_.x,_.y,_.z)}function f(_,S){const M=_*3;S.x=e[M+0],S.y=e[M+1],S.z=e[M+2]}function x(){const _=new L,S=new L,M=new L,E=new L,T=new Xe,R=new Xe,v=new Xe;for(let w=0,B=0;w<s.length;w+=9,B+=6){_.set(s[w+0],s[w+1],s[w+2]),S.set(s[w+3],s[w+4],s[w+5]),M.set(s[w+6],s[w+7],s[w+8]),T.set(a[B+0],a[B+1]),R.set(a[B+2],a[B+3]),v.set(a[B+4],a[B+5]),E.copy(_).add(S).add(M).divideScalar(3);const C=m(E);g(T,B+0,_,C),g(R,B+2,S,C),g(v,B+4,M,C)}}function g(_,S,M,E){E<0&&_.x===1&&(a[S]=_.x-1),M.x===0&&M.z===0&&(a[S]=E/2/Math.PI+.5)}function m(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ir(e.vertices,e.indices,e.radius,e.detail)}}class Ls extends Ir{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=1/n,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ls(e.radius,e.detail)}}class Cr extends Ir{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Cr(e.radius,e.detail)}}class $n extends Ot{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const s=e/2,a=t/2,o=Math.floor(n),c=Math.floor(i),l=o+1,h=c+1,d=e/o,u=t/c,f=[],x=[],g=[],m=[];for(let p=0;p<h;p++){const _=p*u-a;for(let S=0;S<l;S++){const M=S*d-s;x.push(M,-_,0),g.push(0,0,1),m.push(S/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let _=0;_<o;_++){const S=_+l*p,M=_+l*(p+1),E=_+1+l*(p+1),T=_+1+l*p;f.push(S,M,T),f.push(M,E,T)}this.setIndex(f),this.setAttribute("position",new mt(x,3)),this.setAttribute("normal",new mt(g,3)),this.setAttribute("uv",new mt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $n(e.width,e.height,e.widthSegments,e.heightSegments)}}class Gi extends Ot{constructor(e=.5,t=1,n=32,i=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:s,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);const o=[],c=[],l=[],h=[];let d=e;const u=(t-e)/i,f=new L,x=new Xe;for(let g=0;g<=i;g++){for(let m=0;m<=n;m++){const p=s+m/n*a;f.x=d*Math.cos(p),f.y=d*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),x.x=(f.x/t+1)/2,x.y=(f.y/t+1)/2,h.push(x.x,x.y)}d+=u}for(let g=0;g<i;g++){const m=g*(n+1);for(let p=0;p<n;p++){const _=p+m,S=_,M=_+n+1,E=_+n+2,T=_+1;o.push(S,M,T),o.push(M,E,T)}}this.setIndex(o),this.setAttribute("position",new mt(c,3)),this.setAttribute("normal",new mt(l,3)),this.setAttribute("uv",new mt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gi(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Dr extends Ot{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],d=new L,u=new L,f=[],x=[],g=[],m=[];for(let p=0;p<=n;p++){const _=[],S=p/n;let M=0;p===0&&a===0?M=.5/t:p===n&&c===Math.PI&&(M=-.5/t);for(let E=0;E<=t;E++){const T=E/t;d.x=-e*Math.cos(i+T*s)*Math.sin(a+S*o),d.y=e*Math.cos(a+S*o),d.z=e*Math.sin(i+T*s)*Math.sin(a+S*o),x.push(d.x,d.y,d.z),u.copy(d).normalize(),g.push(u.x,u.y,u.z),m.push(T+M,1-S),_.push(l++)}h.push(_)}for(let p=0;p<n;p++)for(let _=0;_<t;_++){const S=h[p][_+1],M=h[p][_],E=h[p+1][_],T=h[p+1][_+1];(p!==0||a>0)&&f.push(S,M,T),(p!==n-1||c<Math.PI)&&f.push(M,E,T)}this.setIndex(f),this.setAttribute("position",new mt(x,3)),this.setAttribute("normal",new mt(g,3)),this.setAttribute("uv",new mt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Dr(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Is extends Ot{constructor(e=1,t=.4,n=12,i=48,s=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:s,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);const c=[],l=[],h=[],d=[],u=new L,f=new L,x=new L;for(let g=0;g<=n;g++){const m=a+g/n*o;for(let p=0;p<=i;p++){const _=p/i*s;f.x=(e+t*Math.cos(m))*Math.cos(_),f.y=(e+t*Math.cos(m))*Math.sin(_),f.z=t*Math.sin(m),l.push(f.x,f.y,f.z),u.x=e*Math.cos(_),u.y=e*Math.sin(_),x.subVectors(f,u).normalize(),h.push(x.x,x.y,x.z),d.push(p/i),d.push(g/n)}}for(let g=1;g<=n;g++)for(let m=1;m<=i;m++){const p=(i+1)*g+m-1,_=(i+1)*(g-1)+m-1,S=(i+1)*(g-1)+m,M=(i+1)*g+m;c.push(p,_,M),c.push(_,S,M)}this.setIndex(c),this.setAttribute("position",new mt(l,3)),this.setAttribute("normal",new mt(h,3)),this.setAttribute("uv",new mt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Is(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}function ji(r){const e={};for(const t in r){e[t]={};for(const n in r[t]){const i=r[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(Ie("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Xt(r){const e={};for(let t=0;t<r.length;t++){const n=ji(r[t]);for(const i in n)e[i]=n[i]}return e}function Ru(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function Ah(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Qe.workingColorSpace}const Cu={clone:ji,merge:Xt};var Pu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Lu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ln extends gn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Pu,this.fragmentShader=Lu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ji(e.uniforms),this.uniformsGroups=Ru(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Iu extends Ln{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Je extends gn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ne(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Go,this.normalScale=new Xe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class _n extends Je{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Xe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return $e(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ne(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ne(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ne(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Du extends gn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Go,this.normalScale=new Xe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.combine=Uo,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Nu extends gn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Sd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Uu extends gn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function ar(r,e){return!r||r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function Fu(r){function e(i,s){return r[i]-r[s]}const t=r.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function nc(r,e,t){const n=r.length,i=new r.constructor(n);for(let s=0,a=0;a!==n;++s){const o=t[s]*e;for(let c=0;c!==e;++c)i[a++]=r[o+c]}return i}function Rh(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let a=s[n];if(a!==void 0)if(Array.isArray(a))do a=s[n],a!==void 0&&(e.push(s.time),t.push(...a)),s=r[i++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[n],a!==void 0&&(e.push(s.time),a.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do a=s[n],a!==void 0&&(e.push(s.time),t.push(a)),s=r[i++];while(s!==void 0)}class es{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],s=t[n-1];n:{e:{let a;t:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=i,i=t[++n],e<i)break e}a=t.length;break t}if(!(e>=s)){const o=t[1];e<o&&(n=2,s=o);for(let c=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(i=s,s=t[--n-1],e>=s)break e}a=n,n=0;break t}break n}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let a=0;a!==i;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class Ou extends es{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ml,endingEnd:Ml}}intervalChanged_(e,t,n){const i=this.parameterPositions;let s=e-2,a=e+1,o=i[s],c=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case Sl:s=e,o=2*t-n;break;case bl:s=i.length-2,o=t+i[s]-i[s+1];break;default:s=e,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Sl:a=e,c=2*n-t;break;case bl:a=1,c=n+i[1]-i[0];break;default:a=e-1,c=t}const l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-n),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,x=(n-t)/(i-t),g=x*x,m=g*x,p=-u*m+2*u*g-u*x,_=(1+u)*m+(-1.5-2*u)*g+(-.5+u)*x+1,S=(-1-f)*m+(1.5+f)*g+.5*x,M=f*m-f*g;for(let E=0;E!==o;++E)s[E]=p*a[h+E]+_*a[l+E]+S*a[c+E]+M*a[d+E];return s}}class Bu extends es{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=(n-t)/(i-t),d=1-h;for(let u=0;u!==o;++u)s[u]=a[l+u]*d+a[c+u]*h;return s}}class ku extends es{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class zu extends es{interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this.settings||this.DefaultSettings_,d=h.inTangents,u=h.outTangents;if(!d||!u){const g=(n-t)/(i-t),m=1-g;for(let p=0;p!==o;++p)s[p]=a[l+p]*m+a[c+p]*g;return s}const f=o*2,x=e-1;for(let g=0;g!==o;++g){const m=a[l+g],p=a[c+g],_=x*f+g*2,S=u[_],M=u[_+1],E=e*f+g*2,T=d[E],R=d[E+1];let v=(n-t)/(i-t),w,B,C,N,F;for(let z=0;z<8;z++){w=v*v,B=w*v,C=1-v,N=C*C,F=N*C;const O=F*t+3*N*v*S+3*C*w*T+B*i-n;if(Math.abs(O)<1e-10)break;const H=3*N*(S-t)+6*C*v*(T-S)+3*w*(i-T);if(Math.abs(H)<1e-10)break;v=v-O/H,v=Math.max(0,Math.min(1,v))}s[g]=F*m+3*N*v*M+3*C*w*R+B*p}return s}}class vn{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ar(t,this.TimeBufferType),this.values=ar(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ar(e.times,Array),values:ar(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ku(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Bu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ou(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new zu(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.settings=this.settings),t}setInterpolation(e){let t;switch(e){case Es:t=this.InterpolantFactoryMethodDiscrete;break;case As:t=this.InterpolantFactoryMethodLinear;break;case Vr:t=this.InterpolantFactoryMethodSmooth;break;case yl:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ie("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Es;case this.InterpolantFactoryMethodLinear:return As;case this.InterpolantFactoryMethodSmooth:return Vr;case this.InterpolantFactoryMethodBezier:return yl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let s=0,a=i-1;for(;s!==i&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==i){s>=a&&(a=Math.max(a,1),s=a-1);const o=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(Oe("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,s=n.length;s===0&&(Oe("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){const c=n[o];if(typeof c=="number"&&isNaN(c)){Oe("KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){Oe("KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(i!==void 0&&Id(i))for(let o=0,c=i.length;o!==c;++o){const l=i[o];if(isNaN(l)){Oe("KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Vr,s=e.length-1;let a=1;for(let o=1;o<s;++o){let c=!1;const l=e[o],h=e[o+1];if(l!==h&&(o!==1||l!==e[0]))if(i)c=!0;else{const d=o*n,u=d-n,f=d+n;for(let x=0;x!==n;++x){const g=t[d+x];if(g!==t[u+x]||g!==t[f+x]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];const d=o*n,u=a*n;for(let f=0;f!==n;++f)t[u+f]=t[d+f]}++a}}if(s>0){e[a]=e[s];for(let o=s*n,c=a*n,l=0;l!==n;++l)t[c+l]=t[o+l];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}vn.prototype.ValueTypeName="";vn.prototype.TimeBufferType=Float32Array;vn.prototype.ValueBufferType=Float32Array;vn.prototype.DefaultInterpolation=As;class ts extends vn{constructor(e,t,n){super(e,t,n)}}ts.prototype.ValueTypeName="bool";ts.prototype.ValueBufferType=Array;ts.prototype.DefaultInterpolation=Es;ts.prototype.InterpolantFactoryMethodLinear=void 0;ts.prototype.InterpolantFactoryMethodSmooth=void 0;class Ch extends vn{constructor(e,t,n,i){super(e,t,n,i)}}Ch.prototype.ValueTypeName="color";class $i extends vn{constructor(e,t,n,i){super(e,t,n,i)}}$i.prototype.ValueTypeName="number";class Hu extends es{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-t)/(i-t);let l=e*o;for(let h=l+o;l!==h;l+=4)In.slerpFlat(s,0,a,l-o,a,l,c);return s}}class Zi extends vn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new Hu(this.times,this.values,this.getValueSize(),e)}}Zi.prototype.ValueTypeName="quaternion";Zi.prototype.InterpolantFactoryMethodSmooth=void 0;class ns extends vn{constructor(e,t,n){super(e,t,n)}}ns.prototype.ValueTypeName="string";ns.prototype.ValueBufferType=Array;ns.prototype.DefaultInterpolation=Es;ns.prototype.InterpolantFactoryMethodLinear=void 0;ns.prototype.InterpolantFactoryMethodSmooth=void 0;class Ji extends vn{constructor(e,t,n,i){super(e,t,n,i)}}Ji.prototype.ValueTypeName="vector";class Vu{constructor(e="",t=-1,n=[],i=yd){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=mn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(Wu(n[a]).scale(i));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,a=n.length;s!==a;++s)t.push(vn.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const s=t.length,a=[];for(let o=0;o<s;o++){let c=[],l=[];c.push((o+s-1)%s,o,(o+1)%s),l.push(0,1,0);const h=Fu(c);c=nc(c,1,h),l=nc(l,1,h),!i&&c[0]===0&&(c.push(s),l.push(l[0])),a.push(new $i(".morphTargetInfluences["+t[o].name+"]",c,l).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,c=e.length;o<c;o++){const l=e[o],h=l.name.match(s);if(h&&h.length>1){const d=h[1];let u=i[d];u||(i[d]=u=[]),u.push(l)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}static parseAnimation(e,t){if(Ie("AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return Oe("AnimationClip: No animation in JSONLoader data."),null;const n=function(d,u,f,x,g){if(f.length!==0){const m=[],p=[];Rh(f,m,p,x),m.length!==0&&g.push(new d(u,m,p))}},i=[],s=e.name||"default",a=e.fps||30,o=e.blendMode;let c=e.length||-1;const l=e.hierarchy||[];for(let d=0;d<l.length;d++){const u=l[d].keys;if(!(!u||u.length===0))if(u[0].morphTargets){const f={};let x;for(x=0;x<u.length;x++)if(u[x].morphTargets)for(let g=0;g<u[x].morphTargets.length;g++)f[u[x].morphTargets[g]]=-1;for(const g in f){const m=[],p=[];for(let _=0;_!==u[x].morphTargets.length;++_){const S=u[x];m.push(S.time),p.push(S.morphTarget===g?1:0)}i.push(new $i(".morphTargetInfluence["+g+"]",m,p))}c=f.length*a}else{const f=".bones["+t[d].name+"]";n(Ji,f+".position",u,"pos",i),n(Zi,f+".quaternion",u,"rot",i),n(Ji,f+".scale",u,"scl",i)}}return i.length===0?null:new this(s,c,i,o)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function Gu(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return $i;case"vector":case"vector2":case"vector3":case"vector4":return Ji;case"color":return Ch;case"quaternion":return Zi;case"bool":case"boolean":return ts;case"string":return ns}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function Wu(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=Gu(r.type);if(r.times===void 0){const t=[],n=[];Rh(r.keys,t,n,"value"),r.times=t,r.values=n}return e.parse!==void 0?e.parse(r):new e(r.name,r.times,r.values,r.interpolation)}const Wn={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(ic(r)||(this.files[r]=e))},get:function(r){if(this.enabled!==!1&&!ic(r))return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};function ic(r){try{const e=r.slice(r.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class Xu{constructor(e,t,n){const i=this;let s=!1,a=0,o=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,s===!1&&i.onStart!==void 0&&i.onStart(h,a,o),s=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,d){return l.push(h,d),this},this.removeHandler=function(h){const d=l.indexOf(h);return d!==-1&&l.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=l.length;d<u;d+=2){const f=l[d],x=l[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return x}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const qu=new Xu;class is{constructor(e){this.manager=e!==void 0?e:qu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}is.DEFAULT_MATERIAL_NAME="__DEFAULT";const Hn={};class Ku extends Error{constructor(e,t){super(e),this.response=t}}class Ph extends is{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=Wn.get(`file:${e}`);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(Hn[e]!==void 0){Hn[e].push({onLoad:t,onProgress:n,onError:i});return}Hn[e]=[],Hn[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,c=this.responseType;fetch(a).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&Ie("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const h=Hn[e],d=l.body.getReader(),u=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=u?parseInt(u):0,x=f!==0;let g=0;const m=new ReadableStream({start(p){_();function _(){d.read().then(({done:S,value:M})=>{if(S)p.close();else{g+=M.byteLength;const E=new ProgressEvent("progress",{lengthComputable:x,loaded:g,total:f});for(let T=0,R=h.length;T<R;T++){const v=h[T];v.onProgress&&v.onProgress(E)}p.enqueue(M),_()}},S=>{p.error(S)})}}});return new Response(m)}else throw new Ku(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return l.json();default:if(o==="")return l.text();{const d=/charset="?([^;"\s]*)"?/i.exec(o),u=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(u);return l.arrayBuffer().then(x=>f.decode(x))}}}).then(l=>{Wn.add(`file:${e}`,l);const h=Hn[e];delete Hn[e];for(let d=0,u=h.length;d<u;d++){const f=h[d];f.onLoad&&f.onLoad(l)}}).catch(l=>{const h=Hn[e];if(h===void 0)throw this.manager.itemError(e),l;delete Hn[e];for(let d=0,u=h.length;d<u;d++){const f=h[d];f.onError&&f.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Fi=new WeakMap;class Yu extends is{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Wn.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);else{let d=Fi.get(a);d===void 0&&(d=[],Fi.set(a,d)),d.push({onLoad:t,onError:i})}return a}const o=Cs("img");function c(){h(),t&&t(this);const d=Fi.get(this)||[];for(let u=0;u<d.length;u++){const f=d[u];f.onLoad&&f.onLoad(this)}Fi.delete(this),s.manager.itemEnd(e)}function l(d){h(),i&&i(d),Wn.remove(`image:${e}`);const u=Fi.get(this)||[];for(let f=0;f<u.length;f++){const x=u[f];x.onError&&x.onError(d)}Fi.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){o.removeEventListener("load",c,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Wn.add(`image:${e}`,o),s.manager.itemStart(e),o.src=e,o}}class ju extends is{constructor(e){super(e)}load(e,t,n,i){const s=new Ct,a=new Yu(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}}class Nr extends vt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ne(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class $u extends Nr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ne(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const pa=new Ve,sc=new L,rc=new L;class nl{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Xe(512,512),this.mapType=Jt,this.map=null,this.mapPass=null,this.matrix=new Ve,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new el,this._frameExtents=new Xe(1,1),this._viewportCount=1,this._viewports=[new _t(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;sc.setFromMatrixPosition(e.matrixWorld),t.position.copy(sc),rc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(rc),t.updateMatrixWorld(),pa.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(pa,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===Rs||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(pa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const or=new L,lr=new In,Mn=new L;class Lh extends vt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ve,this.projectionMatrix=new Ve,this.projectionMatrixInverse=new Ve,this.coordinateSystem=En,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(or,lr,Mn),Mn.x===1&&Mn.y===1&&Mn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(or,lr,Mn.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(or,lr,Mn),Mn.x===1&&Mn.y===1&&Mn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(or,lr,Mn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const si=new L,ac=new Xe,oc=new Xe;class qt extends Lh{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Yi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ms*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Yi*2*Math.atan(Math.tan(Ms*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){si.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(si.x,si.y).multiplyScalar(-e/si.z),si.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(si.x,si.y).multiplyScalar(-e/si.z)}getViewSize(e,t){return this.getViewBounds(e,ac,oc),t.subVectors(oc,ac)}setViewOffset(e,t,n,i,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ms*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*i/c,t-=a.offsetY*n/l,i*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Zu extends nl{constructor(){super(new qt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=Yi*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class Ju extends Nr{constructor(e,t,n=0,i=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.target=new vt,this.distance=n,this.angle=i,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new Zu}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class Qu extends nl{constructor(){super(new qt(90,1,.5,500)),this.isPointLightShadow=!0}}class Ih extends Nr{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Qu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Ur extends Lh{constructor(e=-1,t=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=i+t,c=i-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class ef extends nl{constructor(){super(new Ur(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class bo extends Nr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.target=new vt,this.shadow=new ef}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class bs{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const ma=new WeakMap;class tf extends is{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ie("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ie("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Wn.get(`image-bitmap:${e}`);if(a!==void 0){if(s.manager.itemStart(e),a.then){a.then(l=>{if(ma.has(a)===!0)i&&i(ma.get(a)),s.manager.itemError(e),s.manager.itemEnd(e);else return t&&t(l),s.manager.itemEnd(e),l});return}return setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const c=fetch(e,o).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(l){return Wn.add(`image-bitmap:${e}`,l),t&&t(l),s.manager.itemEnd(e),l}).catch(function(l){i&&i(l),ma.set(c,l),Wn.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});Wn.add(`image-bitmap:${e}`,c),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Oi=-90,Bi=1;class nf extends vt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new qt(Oi,Bi,e,t);i.layers=this.layers,this.add(i);const s=new qt(Oi,Bi,e,t);s.layers=this.layers,this.add(s);const a=new qt(Oi,Bi,e,t);a.layers=this.layers,this.add(a);const o=new qt(Oi,Bi,e,t);o.layers=this.layers,this.add(o);const c=new qt(Oi,Bi,e,t);c.layers=this.layers,this.add(c);const l=new qt(Oi,Bi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,s,a,o,c]=t;for(const l of t)this.remove(l);if(e===En)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Rs)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,1,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),n.texture.generateMipmaps=g,e.setRenderTarget(n,5,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class sf extends qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const il="\\[\\]\\.:\\/",rf=new RegExp("["+il+"]","g"),sl="[^"+il+"]",af="[^"+il.replace("\\.","")+"]",of=/((?:WC+[\/:])*)/.source.replace("WC",sl),lf=/(WCOD+)?/.source.replace("WCOD",af),cf=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",sl),hf=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",sl),df=new RegExp("^"+of+lf+cf+hf+"$"),uf=["material","materials","bones","map"];class ff{constructor(e,t,n){const i=n||lt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class lt{constructor(e,t,n){this.path=t,this.parsedPath=n||lt.parseTrackName(t),this.node=lt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new lt.Composite(e,t,n):new lt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(rf,"")}static parseTrackName(e){const t=df.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const s=n.nodeName.substring(i+1);uf.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(s){for(let a=0;a<s.length;a++){const o=s[a];if(o.name===t||o.uuid===t)return o;const c=n(o.children);if(c)return c}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let s=t.propertyIndex;if(e||(e=lt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ie("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){Oe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Oe("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Oe("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Oe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Oe("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Oe("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){Oe("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}const a=e[i];if(a===void 0){const l=t.nodeName;Oe("PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){Oe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Oe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}lt.Composite=ff;lt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};lt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};lt.prototype.GetterByBindingType=[lt.prototype._getValue_direct,lt.prototype._getValue_array,lt.prototype._getValue_arrayElement,lt.prototype._getValue_toArray];lt.prototype.SetterByBindingTypeAndVersioning=[[lt.prototype._setValue_direct,lt.prototype._setValue_direct_setNeedsUpdate,lt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[lt.prototype._setValue_array,lt.prototype._setValue_array_setNeedsUpdate,lt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[lt.prototype._setValue_arrayElement,lt.prototype._setValue_arrayElement_setNeedsUpdate,lt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[lt.prototype._setValue_fromArray,lt.prototype._setValue_fromArray_setNeedsUpdate,lt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const lc=new Ve;class pf{constructor(e,t,n=0,i=1/0){this.ray=new Ns(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Yo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Oe("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return lc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(lc),this}intersectObject(e,t=!0,n=[]){return wo(e,this,n,t),n.sort(cc),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)wo(e[i],this,n,t);return n.sort(cc),n}}function cc(r,e){return r.distance-e.distance}function wo(r,e,t,n){let i=!0;if(r.layers.test(e.layers)&&r.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const s=r.children;for(let a=0,o=s.length;a<o;a++)wo(s[a],e,t,!0)}}function hc(r,e,t,n){const i=mf(n);switch(t){case fh:return r*e;case ko:return r*e/i.components*i.byteLength;case zo:return r*e/i.components*i.byteLength;case Ki:return r*e*2/i.components*i.byteLength;case Ho:return r*e*2/i.components*i.byteLength;case ph:return r*e*3/i.components*i.byteLength;case rn:return r*e*4/i.components*i.byteLength;case Vo:return r*e*4/i.components*i.byteLength;case mr:case gr:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case xr:case _r:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Ha:case Ga:return Math.max(r,16)*Math.max(e,8)/4;case za:case Va:return Math.max(r,8)*Math.max(e,8)/2;case Wa:case Xa:case Ka:case Ya:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case qa:case ja:case $a:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Za:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Ja:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case Qa:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case eo:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case to:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case no:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case io:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case so:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case ro:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case ao:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case oo:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case lo:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case co:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case ho:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case uo:case fo:case po:return Math.ceil(r/4)*Math.ceil(e/4)*16;case mo:case go:return Math.ceil(r/4)*Math.ceil(e/4)*8;case xo:case _o:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function mf(r){switch(r){case Jt:case ch:return{byteLength:1,components:1};case ws:case hh:case Yn:return{byteLength:2,components:1};case Oo:case Bo:return{byteLength:2,components:4};case Pn:case Fo:case sn:return{byteLength:4,components:1};case dh:case uh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Do}}));typeof window<"u"&&(window.__THREE__?Ie("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Do);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Dh(){let r=null,e=!1,t=null,n=null;function i(s,a){t(s,a),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function gf(r){const e=new WeakMap;function t(o,c){const l=o.array,h=o.usage,d=l.byteLength,u=r.createBuffer();r.bindBuffer(c,u),r.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=r.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=r.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=r.HALF_FLOAT:f=r.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=r.SHORT;else if(l instanceof Uint32Array)f=r.UNSIGNED_INT;else if(l instanceof Int32Array)f=r.INT;else if(l instanceof Int8Array)f=r.BYTE;else if(l instanceof Uint8Array)f=r.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,c,l){const h=c.array,d=c.updateRanges;if(r.bindBuffer(l,o),d.length===0)r.bufferSubData(l,0,h);else{d.sort((f,x)=>f.start-x.start);let u=0;for(let f=1;f<d.length;f++){const x=d[u],g=d[f];g.start<=x.start+x.count+1?x.count=Math.max(x.count,g.start+g.count-x.start):(++u,d[u]=g)}d.length=u+1;for(let f=0,x=d.length;f<x;f++){const g=d[f];r.bufferSubData(l,g.start*h.BYTES_PER_ELEMENT,h,g.start,g.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(r.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:i,remove:s,update:a}}var xf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,_f=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,vf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,yf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Mf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Sf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,bf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,wf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Tf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Ef=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Af=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Rf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Cf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Pf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Lf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,If=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Df=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Nf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Uf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ff=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Of=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Bf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,kf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,zf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Hf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Vf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Gf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Wf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Xf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,qf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Kf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Yf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,jf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,$f=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Zf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Jf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Qf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,ep=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,tp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,np=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ip=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,sp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,rp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ap=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,op=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,cp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,hp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,dp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,up=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,fp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,pp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,mp=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,gp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,xp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,_p=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,vp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,yp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Mp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Sp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,bp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Tp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ep=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ap=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Rp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Cp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Pp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Lp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ip=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Dp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Np=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Up=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Fp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Op=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,kp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,zp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Hp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Vp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Gp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Wp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Xp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,qp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Kp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Yp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,$p=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Zp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Jp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Qp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,em=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,tm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,nm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,im=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,sm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,rm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,am=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,om=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,lm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,cm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,hm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,dm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,um=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,fm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,pm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,mm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const gm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,xm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_m=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ym=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Mm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,bm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,wm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Tm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Em=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Am=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Rm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Cm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Pm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Lm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Im=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Dm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Nm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Um=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Om=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Bm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,km=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Hm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Xm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,qm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Km=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ym=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,jm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ke={alphahash_fragment:xf,alphahash_pars_fragment:_f,alphamap_fragment:vf,alphamap_pars_fragment:yf,alphatest_fragment:Mf,alphatest_pars_fragment:Sf,aomap_fragment:bf,aomap_pars_fragment:wf,batching_pars_vertex:Tf,batching_vertex:Ef,begin_vertex:Af,beginnormal_vertex:Rf,bsdfs:Cf,iridescence_fragment:Pf,bumpmap_pars_fragment:Lf,clipping_planes_fragment:If,clipping_planes_pars_fragment:Df,clipping_planes_pars_vertex:Nf,clipping_planes_vertex:Uf,color_fragment:Ff,color_pars_fragment:Of,color_pars_vertex:Bf,color_vertex:kf,common:zf,cube_uv_reflection_fragment:Hf,defaultnormal_vertex:Vf,displacementmap_pars_vertex:Gf,displacementmap_vertex:Wf,emissivemap_fragment:Xf,emissivemap_pars_fragment:qf,colorspace_fragment:Kf,colorspace_pars_fragment:Yf,envmap_fragment:jf,envmap_common_pars_fragment:$f,envmap_pars_fragment:Zf,envmap_pars_vertex:Jf,envmap_physical_pars_fragment:cp,envmap_vertex:Qf,fog_vertex:ep,fog_pars_vertex:tp,fog_fragment:np,fog_pars_fragment:ip,gradientmap_pars_fragment:sp,lightmap_pars_fragment:rp,lights_lambert_fragment:ap,lights_lambert_pars_fragment:op,lights_pars_begin:lp,lights_toon_fragment:hp,lights_toon_pars_fragment:dp,lights_phong_fragment:up,lights_phong_pars_fragment:fp,lights_physical_fragment:pp,lights_physical_pars_fragment:mp,lights_fragment_begin:gp,lights_fragment_maps:xp,lights_fragment_end:_p,logdepthbuf_fragment:vp,logdepthbuf_pars_fragment:yp,logdepthbuf_pars_vertex:Mp,logdepthbuf_vertex:Sp,map_fragment:bp,map_pars_fragment:wp,map_particle_fragment:Tp,map_particle_pars_fragment:Ep,metalnessmap_fragment:Ap,metalnessmap_pars_fragment:Rp,morphinstance_vertex:Cp,morphcolor_vertex:Pp,morphnormal_vertex:Lp,morphtarget_pars_vertex:Ip,morphtarget_vertex:Dp,normal_fragment_begin:Np,normal_fragment_maps:Up,normal_pars_fragment:Fp,normal_pars_vertex:Op,normal_vertex:Bp,normalmap_pars_fragment:kp,clearcoat_normal_fragment_begin:zp,clearcoat_normal_fragment_maps:Hp,clearcoat_pars_fragment:Vp,iridescence_pars_fragment:Gp,opaque_fragment:Wp,packing:Xp,premultiplied_alpha_fragment:qp,project_vertex:Kp,dithering_fragment:Yp,dithering_pars_fragment:jp,roughnessmap_fragment:$p,roughnessmap_pars_fragment:Zp,shadowmap_pars_fragment:Jp,shadowmap_pars_vertex:Qp,shadowmap_vertex:em,shadowmask_pars_fragment:tm,skinbase_vertex:nm,skinning_pars_vertex:im,skinning_vertex:sm,skinnormal_vertex:rm,specularmap_fragment:am,specularmap_pars_fragment:om,tonemapping_fragment:lm,tonemapping_pars_fragment:cm,transmission_fragment:hm,transmission_pars_fragment:dm,uv_pars_fragment:um,uv_pars_vertex:fm,uv_vertex:pm,worldpos_vertex:mm,background_vert:gm,background_frag:xm,backgroundCube_vert:_m,backgroundCube_frag:vm,cube_vert:ym,cube_frag:Mm,depth_vert:Sm,depth_frag:bm,distance_vert:wm,distance_frag:Tm,equirect_vert:Em,equirect_frag:Am,linedashed_vert:Rm,linedashed_frag:Cm,meshbasic_vert:Pm,meshbasic_frag:Lm,meshlambert_vert:Im,meshlambert_frag:Dm,meshmatcap_vert:Nm,meshmatcap_frag:Um,meshnormal_vert:Fm,meshnormal_frag:Om,meshphong_vert:Bm,meshphong_frag:km,meshphysical_vert:zm,meshphysical_frag:Hm,meshtoon_vert:Vm,meshtoon_frag:Gm,points_vert:Wm,points_frag:Xm,shadow_vert:qm,shadow_frag:Km,sprite_vert:Ym,sprite_frag:jm},de={common:{diffuse:{value:new Ne(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new Xe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ne(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ne(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new Ne(16777215)},opacity:{value:1},center:{value:new Xe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},wn={basic:{uniforms:Xt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:Ke.meshbasic_vert,fragmentShader:Ke.meshbasic_frag},lambert:{uniforms:Xt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new Ne(0)},envMapIntensity:{value:1}}]),vertexShader:Ke.meshlambert_vert,fragmentShader:Ke.meshlambert_frag},phong:{uniforms:Xt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new Ne(0)},specular:{value:new Ne(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphong_vert,fragmentShader:Ke.meshphong_frag},standard:{uniforms:Xt([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new Ne(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag},toon:{uniforms:Xt([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new Ne(0)}}]),vertexShader:Ke.meshtoon_vert,fragmentShader:Ke.meshtoon_frag},matcap:{uniforms:Xt([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:Ke.meshmatcap_vert,fragmentShader:Ke.meshmatcap_frag},points:{uniforms:Xt([de.points,de.fog]),vertexShader:Ke.points_vert,fragmentShader:Ke.points_frag},dashed:{uniforms:Xt([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ke.linedashed_vert,fragmentShader:Ke.linedashed_frag},depth:{uniforms:Xt([de.common,de.displacementmap]),vertexShader:Ke.depth_vert,fragmentShader:Ke.depth_frag},normal:{uniforms:Xt([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:Ke.meshnormal_vert,fragmentShader:Ke.meshnormal_frag},sprite:{uniforms:Xt([de.sprite,de.fog]),vertexShader:Ke.sprite_vert,fragmentShader:Ke.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ke.background_vert,fragmentShader:Ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:Ke.backgroundCube_vert,fragmentShader:Ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ke.cube_vert,fragmentShader:Ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ke.equirect_vert,fragmentShader:Ke.equirect_frag},distance:{uniforms:Xt([de.common,de.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ke.distance_vert,fragmentShader:Ke.distance_frag},shadow:{uniforms:Xt([de.lights,de.fog,{color:{value:new Ne(0)},opacity:{value:1}}]),vertexShader:Ke.shadow_vert,fragmentShader:Ke.shadow_frag}};wn.physical={uniforms:Xt([wn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new Xe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new Ne(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new Xe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new Ne(0)},specularColor:{value:new Ne(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new Xe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag};const cr={r:0,b:0,g:0},mi=new on,$m=new Ve;function Zm(r,e,t,n,i,s){const a=new Ne(0);let o=i===!0?0:1,c,l,h=null,d=0,u=null;function f(_){let S=_.isScene===!0?_.background:null;if(S&&S.isTexture){const M=_.backgroundBlurriness>0;S=e.get(S,M)}return S}function x(_){let S=!1;const M=f(_);M===null?m(a,o):M&&M.isColor&&(m(M,1),S=!0);const E=r.xr.getEnvironmentBlendMode();E==="additive"?t.buffers.color.setClear(0,0,0,1,s):E==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(r.autoClear||S)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function g(_,S){const M=f(S);M&&(M.isCubeTexture||M.mapping===Lr)?(l===void 0&&(l=new Y(new an(1,1,1),new Ln({name:"BackgroundCubeMaterial",uniforms:ji(wn.backgroundCube.uniforms),vertexShader:wn.backgroundCube.vertexShader,fragmentShader:wn.backgroundCube.fragmentShader,side:Vt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(E,T,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),mi.copy(S.backgroundRotation),mi.x*=-1,mi.y*=-1,mi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(mi.y*=-1,mi.z*=-1),l.material.uniforms.envMap.value=M,l.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4($m.makeRotationFromEuler(mi)),l.material.toneMapped=Qe.getTransfer(M.colorSpace)!==at,(h!==M||d!==M.version||u!==r.toneMapping)&&(l.material.needsUpdate=!0,h=M,d=M.version,u=r.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new Y(new $n(2,2),new Ln({name:"BackgroundMaterial",uniforms:ji(wn.background.uniforms),vertexShader:wn.background.vertexShader,fragmentShader:wn.background.fragmentShader,side:Kn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=Qe.getTransfer(M.colorSpace)!==at,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||d!==M.version||u!==r.toneMapping)&&(c.material.needsUpdate=!0,h=M,d=M.version,u=r.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null))}function m(_,S){_.getRGB(cr,Ah(r)),t.buffers.color.setClear(cr.r,cr.g,cr.b,S,s)}function p(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(_,S=1){a.set(_),o=S,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(_){o=_,m(a,o)},render:x,addToRenderList:g,dispose:p}}function Jm(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=u(null);let s=i,a=!1;function o(C,N,F,z,k){let O=!1;const H=d(C,z,F,N);s!==H&&(s=H,l(s.object)),O=f(C,z,F,k),O&&x(C,z,F,k),k!==null&&e.update(k,r.ELEMENT_ARRAY_BUFFER),(O||a)&&(a=!1,M(C,N,F,z),k!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function c(){return r.createVertexArray()}function l(C){return r.bindVertexArray(C)}function h(C){return r.deleteVertexArray(C)}function d(C,N,F,z){const k=z.wireframe===!0;let O=n[N.id];O===void 0&&(O={},n[N.id]=O);const H=C.isInstancedMesh===!0?C.id:0;let J=O[H];J===void 0&&(J={},O[H]=J);let Q=J[F.id];Q===void 0&&(Q={},J[F.id]=Q);let he=Q[k];return he===void 0&&(he=u(c()),Q[k]=he),he}function u(C){const N=[],F=[],z=[];for(let k=0;k<t;k++)N[k]=0,F[k]=0,z[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:F,attributeDivisors:z,object:C,attributes:{},index:null}}function f(C,N,F,z){const k=s.attributes,O=N.attributes;let H=0;const J=F.getAttributes();for(const Q in J)if(J[Q].location>=0){const xe=k[Q];let le=O[Q];if(le===void 0&&(Q==="instanceMatrix"&&C.instanceMatrix&&(le=C.instanceMatrix),Q==="instanceColor"&&C.instanceColor&&(le=C.instanceColor)),xe===void 0||xe.attribute!==le||le&&xe.data!==le.data)return!0;H++}return s.attributesNum!==H||s.index!==z}function x(C,N,F,z){const k={},O=N.attributes;let H=0;const J=F.getAttributes();for(const Q in J)if(J[Q].location>=0){let xe=O[Q];xe===void 0&&(Q==="instanceMatrix"&&C.instanceMatrix&&(xe=C.instanceMatrix),Q==="instanceColor"&&C.instanceColor&&(xe=C.instanceColor));const le={};le.attribute=xe,xe&&xe.data&&(le.data=xe.data),k[Q]=le,H++}s.attributes=k,s.attributesNum=H,s.index=z}function g(){const C=s.newAttributes;for(let N=0,F=C.length;N<F;N++)C[N]=0}function m(C){p(C,0)}function p(C,N){const F=s.newAttributes,z=s.enabledAttributes,k=s.attributeDivisors;F[C]=1,z[C]===0&&(r.enableVertexAttribArray(C),z[C]=1),k[C]!==N&&(r.vertexAttribDivisor(C,N),k[C]=N)}function _(){const C=s.newAttributes,N=s.enabledAttributes;for(let F=0,z=N.length;F<z;F++)N[F]!==C[F]&&(r.disableVertexAttribArray(F),N[F]=0)}function S(C,N,F,z,k,O,H){H===!0?r.vertexAttribIPointer(C,N,F,k,O):r.vertexAttribPointer(C,N,F,z,k,O)}function M(C,N,F,z){g();const k=z.attributes,O=F.getAttributes(),H=N.defaultAttributeValues;for(const J in O){const Q=O[J];if(Q.location>=0){let he=k[J];if(he===void 0&&(J==="instanceMatrix"&&C.instanceMatrix&&(he=C.instanceMatrix),J==="instanceColor"&&C.instanceColor&&(he=C.instanceColor)),he!==void 0){const xe=he.normalized,le=he.itemSize,Be=e.get(he);if(Be===void 0)continue;const it=Be.buffer,tt=Be.type,$=Be.bytesPerElement,se=tt===r.INT||tt===r.UNSIGNED_INT||he.gpuType===Fo;if(he.isInterleavedBufferAttribute){const ae=he.data,ke=ae.stride,Re=he.offset;if(ae.isInstancedInterleavedBuffer){for(let Z=0;Z<Q.locationSize;Z++)p(Q.location+Z,ae.meshPerAttribute);C.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let Z=0;Z<Q.locationSize;Z++)m(Q.location+Z);r.bindBuffer(r.ARRAY_BUFFER,it);for(let Z=0;Z<Q.locationSize;Z++)S(Q.location+Z,le/Q.locationSize,tt,xe,ke*$,(Re+le/Q.locationSize*Z)*$,se)}else{if(he.isInstancedBufferAttribute){for(let ae=0;ae<Q.locationSize;ae++)p(Q.location+ae,he.meshPerAttribute);C.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let ae=0;ae<Q.locationSize;ae++)m(Q.location+ae);r.bindBuffer(r.ARRAY_BUFFER,it);for(let ae=0;ae<Q.locationSize;ae++)S(Q.location+ae,le/Q.locationSize,tt,xe,le*$,le/Q.locationSize*ae*$,se)}}else if(H!==void 0){const xe=H[J];if(xe!==void 0)switch(xe.length){case 2:r.vertexAttrib2fv(Q.location,xe);break;case 3:r.vertexAttrib3fv(Q.location,xe);break;case 4:r.vertexAttrib4fv(Q.location,xe);break;default:r.vertexAttrib1fv(Q.location,xe)}}}}_()}function E(){w();for(const C in n){const N=n[C];for(const F in N){const z=N[F];for(const k in z){const O=z[k];for(const H in O)h(O[H].object),delete O[H];delete z[k]}}delete n[C]}}function T(C){if(n[C.id]===void 0)return;const N=n[C.id];for(const F in N){const z=N[F];for(const k in z){const O=z[k];for(const H in O)h(O[H].object),delete O[H];delete z[k]}}delete n[C.id]}function R(C){for(const N in n){const F=n[N];for(const z in F){const k=F[z];if(k[C.id]===void 0)continue;const O=k[C.id];for(const H in O)h(O[H].object),delete O[H];delete k[C.id]}}}function v(C){for(const N in n){const F=n[N],z=C.isInstancedMesh===!0?C.id:0,k=F[z];if(k!==void 0){for(const O in k){const H=k[O];for(const J in H)h(H[J].object),delete H[J];delete k[O]}delete F[z],Object.keys(F).length===0&&delete n[N]}}}function w(){B(),a=!0,s!==i&&(s=i,l(s.object))}function B(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:w,resetDefaultState:B,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfObject:v,releaseStatesOfProgram:R,initAttributes:g,enableAttribute:m,disableUnusedAttributes:_}}function Qm(r,e,t){let n;function i(l){n=l}function s(l,h){r.drawArrays(n,l,h),t.update(h,n,1)}function a(l,h,d){d!==0&&(r.drawArraysInstanced(n,l,h,d),t.update(h,n,d))}function o(l,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,d);let f=0;for(let x=0;x<d;x++)f+=h[x];t.update(f,n,1)}function c(l,h,d,u){if(d===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let x=0;x<l.length;x++)a(l[x],h[x],u[x]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,u,0,d);let x=0;for(let g=0;g<d;g++)x+=h[g]*u[g];t.update(x,n,1)}}this.setMode=i,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function eg(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(R){return!(R!==rn&&n.convert(R)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const v=R===Yn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Jt&&n.convert(R)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==sn&&!v)}function c(R){if(R==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(Ie("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),x=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_TEXTURE_SIZE),m=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),p=r.getParameter(r.MAX_VERTEX_ATTRIBS),_=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),S=r.getParameter(r.MAX_VARYING_VECTORS),M=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),E=r.getParameter(r.MAX_SAMPLES),T=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:x,maxTextureSize:g,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:_,maxVaryings:S,maxFragmentUniforms:M,maxSamples:E,samples:T}}function tg(r){const e=this;let t=null,n=0,i=!1,s=!1;const a=new ai,o=new We,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||i;return i=u,n=d.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){const x=d.clippingPlanes,g=d.clipIntersection,m=d.clipShadows,p=r.get(d);if(!i||x===null||x.length===0||s&&!m)s?h(null):l();else{const _=s?0:n,S=_*4;let M=p.clippingState||null;c.value=M,M=h(x,u,S,f);for(let E=0;E!==S;++E)M[E]=t[E];p.clippingState=M,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=_}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,f,x){const g=d!==null?d.length:0;let m=null;if(g!==0){if(m=c.value,x!==!0||m===null){const p=f+g*4,_=u.matrixWorldInverse;o.getNormalMatrix(_),(m===null||m.length<p)&&(m=new Float32Array(p));for(let S=0,M=f;S!==g;++S,M+=4)a.copy(d[S]).applyMatrix4(_,o),a.normal.toArray(m,M),m[M+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,m}}const li=4,dc=[.125,.215,.35,.446,.526,.582],vi=20,ng=256,us=new Ur,uc=new Ne;let ga=null,xa=0,_a=0,va=!1;const ig=new L;class To{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,s={}){const{size:a=256,position:o=ig}=s;ga=this._renderer.getRenderTarget(),xa=this._renderer.getActiveCubeFace(),_a=this._renderer.getActiveMipmapLevel(),va=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,i,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=mc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=pc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(ga,xa,_a),this._renderer.xr.enabled=va,e.scissorTest=!1,ki(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Mi||e.mapping===qi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ga=this._renderer.getRenderTarget(),xa=this._renderer.getActiveCubeFace(),_a=this._renderer.getActiveMipmapLevel(),va=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Rt,minFilter:Rt,generateMipmaps:!1,type:Yn,format:rn,colorSpace:Yt,depthBuffer:!1},i=fc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=fc(e,t,n);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=sg(s)),this._blurMaterial=ag(s,e,t),this._ggxMaterial=rg(s,e,t)}return i}_compileMaterial(e){const t=new Y(new Ot,e);this._renderer.compile(t,us)}_sceneToCubeUV(e,t,n,i,s){const c=new qt(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(uc),d.toneMapping=An,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(i),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Y(new an,new Kt({name:"PMREM.Background",side:Vt,depthWrite:!1,depthTest:!1})));const g=this._backgroundBox,m=g.material;let p=!1;const _=e.background;_?_.isColor&&(m.color.copy(_),e.background=null,p=!0):(m.color.copy(uc),p=!0);for(let S=0;S<6;S++){const M=S%3;M===0?(c.up.set(0,l[S],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+h[S],s.y,s.z)):M===1?(c.up.set(0,0,l[S]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+h[S],s.z)):(c.up.set(0,l[S],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+h[S]));const E=this._cubeSize;ki(i,M*E,S>2?E:0,E,E),d.setRenderTarget(i),p&&d.render(g,c),d.render(e,c)}d.toneMapping=f,d.autoClear=u,e.background=_}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Mi||e.mapping===qi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=mc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=pc());const s=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=e;const c=this._cubeSize;ki(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,us)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodMeshes.length;for(let s=1;s<i;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){const i=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const c=a.uniforms,l=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-h*h),u=0+l*1.25,f=d*u,{_lodMax:x}=this,g=this._sizeLods[n],m=3*g*(n>x-li?n-x+li:0),p=4*(this._cubeSize-g);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=x-t,ki(s,m,p,3*g,2*g),i.setRenderTarget(s),i.render(o,us),c.envMap.value=s.texture,c.roughness.value=0,c.mipInt.value=x-n,ki(e,m,p,3*g,2*g),i.setRenderTarget(e),i.render(o,us)}_blur(e,t,n,i,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",s),this._halfBlur(a,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Oe("blur direction must be either latitudinal or longitudinal!");const h=3,d=this._lodMeshes[i];d.material=l;const u=l.uniforms,f=this._sizeLods[n]-1,x=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*vi-1),g=s/x,m=isFinite(s)?1+Math.floor(h*g):vi;m>vi&&Ie(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${vi}`);const p=[];let _=0;for(let R=0;R<vi;++R){const v=R/g,w=Math.exp(-v*v/2);p.push(w),R===0?_+=w:R<m&&(_+=2*w)}for(let R=0;R<p.length;R++)p[R]=p[R]/_;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:S}=this;u.dTheta.value=x,u.mipInt.value=S-n;const M=this._sizeLods[i],E=3*M*(i>S-li?i-S+li:0),T=4*(this._cubeSize-M);ki(t,E,T,3*M,2*M),c.setRenderTarget(t),c.render(d,us)}}function sg(r){const e=[],t=[],n=[];let i=r;const s=r-li+1+dc.length;for(let a=0;a<s;a++){const o=Math.pow(2,i);e.push(o);let c=1/o;a>r-li?c=dc[a-r+li-1]:a===0&&(c=0),t.push(c);const l=1/(o-2),h=-l,d=1+l,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,x=6,g=3,m=2,p=1,_=new Float32Array(g*x*f),S=new Float32Array(m*x*f),M=new Float32Array(p*x*f);for(let T=0;T<f;T++){const R=T%3*2/3-1,v=T>2?0:-1,w=[R,v,0,R+2/3,v,0,R+2/3,v+1,0,R,v,0,R+2/3,v+1,0,R,v+1,0];_.set(w,g*x*T),S.set(u,m*x*T);const B=[T,T,T,T,T,T];M.set(B,p*x*T)}const E=new Ot;E.setAttribute("position",new Gt(_,g)),E.setAttribute("uv",new Gt(S,m)),E.setAttribute("faceIndex",new Gt(M,p)),n.push(new Y(E,null)),i>li&&i--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function fc(r,e,t){const n=new Rn(r,e,t);return n.texture.mapping=Lr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ki(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function rg(r,e,t){return new Ln({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:ng,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Fr(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function ag(r,e,t){const n=new Float32Array(vi),i=new L(0,1,0);return new Ln({name:"SphericalGaussianBlur",defines:{n:vi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Fr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function pc(){return new Ln({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function mc(){return new Ln({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Fr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class Nh extends Rn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Th(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new an(5,5,5),s=new Ln({name:"CubemapFromEquirect",uniforms:ji(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Vt,blending:Xn});s.uniforms.tEquirect.value=t;const a=new Y(i,s),o=t.minFilter;return t.minFilter===Gn&&(t.minFilter=Rt),new nf(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(s)}}function og(r){let e=new WeakMap,t=new WeakMap,n=null;function i(u,f=!1){return u==null?null:f?a(u):s(u)}function s(u){if(u&&u.isTexture){const f=u.mapping;if(f===zr||f===Hr)if(e.has(u)){const x=e.get(u).texture;return o(x,u.mapping)}else{const x=u.image;if(x&&x.height>0){const g=new Nh(x.height);return g.fromEquirectangularTexture(r,u),e.set(u,g),u.addEventListener("dispose",l),o(g.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const f=u.mapping,x=f===zr||f===Hr,g=f===Mi||f===qi;if(x||g){let m=t.get(u);const p=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return n===null&&(n=new To(r)),m=x?n.fromEquirectangular(u,m):n.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),m.texture;if(m!==void 0)return m.texture;{const _=u.image;return x&&_&&_.height>0||g&&_&&c(_)?(n===null&&(n=new To(r)),m=x?n.fromEquirectangular(u):n.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,f){return f===zr?u.mapping=Mi:f===Hr&&(u.mapping=qi),u}function c(u){let f=0;const x=6;for(let g=0;g<x;g++)u[g]!==void 0&&f++;return f===x}function l(u){const f=u.target;f.removeEventListener("dispose",l);const x=e.get(f);x!==void 0&&(e.delete(f),x.dispose())}function h(u){const f=u.target;f.removeEventListener("dispose",h);const x=t.get(f);x!==void 0&&(t.delete(f),x.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:d}}function lg(r){const e={};function t(n){if(e[n]!==void 0)return e[n];const i=r.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&Tr("WebGLRenderer: "+n+" extension not supported."),i}}}function cg(r,e,t,n){const i={},s=new WeakMap;function a(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const x in u.attributes)e.remove(u.attributes[x]);u.removeEventListener("dispose",a),delete i[u.id];const f=s.get(u);f&&(e.remove(f),s.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return i[u.id]===!0||(u.addEventListener("dispose",a),i[u.id]=!0,t.memory.geometries++),u}function c(d){const u=d.attributes;for(const f in u)e.update(u[f],r.ARRAY_BUFFER)}function l(d){const u=[],f=d.index,x=d.attributes.position;let g=0;if(x===void 0)return;if(f!==null){const _=f.array;g=f.version;for(let S=0,M=_.length;S<M;S+=3){const E=_[S+0],T=_[S+1],R=_[S+2];u.push(E,T,T,R,R,E)}}else{const _=x.array;g=x.version;for(let S=0,M=_.length/3-1;S<M;S+=3){const E=S+0,T=S+1,R=S+2;u.push(E,T,T,R,R,E)}}const m=new(x.count>=65535?Mh:yh)(u,1);m.version=g;const p=s.get(d);p&&e.remove(p),s.set(d,m)}function h(d){const u=s.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&l(d)}else l(d);return s.get(d)}return{get:o,update:c,getWireframeAttribute:h}}function hg(r,e,t){let n;function i(u){n=u}let s,a;function o(u){s=u.type,a=u.bytesPerElement}function c(u,f){r.drawElements(n,f,s,u*a),t.update(f,n,1)}function l(u,f,x){x!==0&&(r.drawElementsInstanced(n,f,s,u*a,x),t.update(f,n,x))}function h(u,f,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,u,0,x);let m=0;for(let p=0;p<x;p++)m+=f[p];t.update(m,n,1)}function d(u,f,x,g){if(x===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<u.length;p++)l(u[p]/a,f[p],g[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,s,u,0,g,0,x);let p=0;for(let _=0;_<x;_++)p+=f[_]*g[_];t.update(p,n,1)}}this.setMode=i,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function dg(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case r.TRIANGLES:t.triangles+=o*(s/3);break;case r.LINES:t.lines+=o*(s/2);break;case r.LINE_STRIP:t.lines+=o*(s-1);break;case r.LINE_LOOP:t.lines+=o*s;break;case r.POINTS:t.points+=o*s;break;default:Oe("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function ug(r,e,t){const n=new WeakMap,i=new _t;function s(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==d){let w=function(){R.dispose(),n.delete(o),o.removeEventListener("dispose",w)};u!==void 0&&u.texture.dispose();const f=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],_=o.morphAttributes.color||[];let S=0;f===!0&&(S=1),x===!0&&(S=2),g===!0&&(S=3);let M=o.attributes.position.count*S,E=1;M>e.maxTextureSize&&(E=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const T=new Float32Array(M*E*4*d),R=new xh(T,M,E,d);R.type=sn,R.needsUpdate=!0;const v=S*4;for(let B=0;B<d;B++){const C=m[B],N=p[B],F=_[B],z=M*E*4*B;for(let k=0;k<C.count;k++){const O=k*v;f===!0&&(i.fromBufferAttribute(C,k),T[z+O+0]=i.x,T[z+O+1]=i.y,T[z+O+2]=i.z,T[z+O+3]=0),x===!0&&(i.fromBufferAttribute(N,k),T[z+O+4]=i.x,T[z+O+5]=i.y,T[z+O+6]=i.z,T[z+O+7]=0),g===!0&&(i.fromBufferAttribute(F,k),T[z+O+8]=i.x,T[z+O+9]=i.y,T[z+O+10]=i.z,T[z+O+11]=F.itemSize===4?i.w:1)}}u={count:d,texture:R,size:new Xe(M,E)},n.set(o,u),o.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(r,"morphTexture",a.morphTexture,t);else{let f=0;for(let g=0;g<l.length;g++)f+=l[g];const x=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(r,"morphTargetBaseInfluence",x),c.getUniforms().setValue(r,"morphTargetInfluences",l)}c.getUniforms().setValue(r,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(r,"morphTargetsTextureSize",u.size)}return{update:s}}function fg(r,e,t,n,i){let s=new WeakMap;function a(l){const h=i.render.frame,d=l.geometry,u=e.get(l,d);if(s.get(u)!==h&&(e.update(u),s.set(u,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),s.get(l)!==h&&(t.update(l.instanceMatrix,r.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,r.ARRAY_BUFFER),s.set(l,h))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==h&&(f.update(),s.set(f,h))}return u}function o(){s=new WeakMap}function c(l){const h=l.target;h.removeEventListener("dispose",c),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const pg={[th]:"LINEAR_TONE_MAPPING",[nh]:"REINHARD_TONE_MAPPING",[ih]:"CINEON_TONE_MAPPING",[Ds]:"ACES_FILMIC_TONE_MAPPING",[rh]:"AGX_TONE_MAPPING",[ah]:"NEUTRAL_TONE_MAPPING",[sh]:"CUSTOM_TONE_MAPPING"};function mg(r,e,t,n,i){const s=new Rn(e,t,{type:r,depthBuffer:n,stencilBuffer:i}),a=new Rn(e,t,{type:Yn,depthBuffer:!1,stencilBuffer:!1}),o=new Ot;o.setAttribute("position",new mt([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new mt([0,2,0,0,2,0],2));const c=new Iu({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),l=new Y(o,c),h=new Ur(-1,1,1,-1,0,1);let d=null,u=null,f=!1,x,g=null,m=[],p=!1;this.setSize=function(_,S){s.setSize(_,S),a.setSize(_,S);for(let M=0;M<m.length;M++){const E=m[M];E.setSize&&E.setSize(_,S)}},this.setEffects=function(_){m=_,p=m.length>0&&m[0].isRenderPass===!0;const S=s.width,M=s.height;for(let E=0;E<m.length;E++){const T=m[E];T.setSize&&T.setSize(S,M)}},this.begin=function(_,S){if(f||_.toneMapping===An&&m.length===0)return!1;if(g=S,S!==null){const M=S.width,E=S.height;(s.width!==M||s.height!==E)&&this.setSize(M,E)}return p===!1&&_.setRenderTarget(s),x=_.toneMapping,_.toneMapping=An,!0},this.hasRenderPass=function(){return p},this.end=function(_,S){_.toneMapping=x,f=!0;let M=s,E=a;for(let T=0;T<m.length;T++){const R=m[T];if(R.enabled!==!1&&(R.render(_,E,M,S),R.needsSwap!==!1)){const v=M;M=E,E=v}}if(d!==_.outputColorSpace||u!==_.toneMapping){d=_.outputColorSpace,u=_.toneMapping,c.defines={},Qe.getTransfer(d)===at&&(c.defines.SRGB_TRANSFER="");const T=pg[u];T&&(c.defines[T]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=M.texture,_.setRenderTarget(g),_.render(l,h),g=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){s.dispose(),a.dispose(),o.dispose(),c.dispose()}}const Uh=new Ct,Eo=new Ps(1,1),Fh=new xh,Oh=new iu,Bh=new Th,gc=[],xc=[],_c=new Float32Array(16),vc=new Float32Array(9),yc=new Float32Array(4);function ss(r,e,t){const n=r[0];if(n<=0||n>0)return r;const i=e*t;let s=gc[i];if(s===void 0&&(s=new Float32Array(i),gc[i]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function Pt(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function Lt(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function Or(r,e){let t=xc[e];t===void 0&&(t=new Int32Array(e),xc[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function gg(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function xg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;r.uniform2fv(this.addr,e),Lt(t,e)}}function _g(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Pt(t,e))return;r.uniform3fv(this.addr,e),Lt(t,e)}}function vg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;r.uniform4fv(this.addr,e),Lt(t,e)}}function yg(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Pt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Lt(t,e)}else{if(Pt(t,n))return;yc.set(n),r.uniformMatrix2fv(this.addr,!1,yc),Lt(t,n)}}function Mg(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Pt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Lt(t,e)}else{if(Pt(t,n))return;vc.set(n),r.uniformMatrix3fv(this.addr,!1,vc),Lt(t,n)}}function Sg(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Pt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Lt(t,e)}else{if(Pt(t,n))return;_c.set(n),r.uniformMatrix4fv(this.addr,!1,_c),Lt(t,n)}}function bg(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function wg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;r.uniform2iv(this.addr,e),Lt(t,e)}}function Tg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Pt(t,e))return;r.uniform3iv(this.addr,e),Lt(t,e)}}function Eg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;r.uniform4iv(this.addr,e),Lt(t,e)}}function Ag(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function Rg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;r.uniform2uiv(this.addr,e),Lt(t,e)}}function Cg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Pt(t,e))return;r.uniform3uiv(this.addr,e),Lt(t,e)}}function Pg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;r.uniform4uiv(this.addr,e),Lt(t,e)}}function Lg(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(Eo.compareFunction=t.isReversedDepthBuffer()?Xo:Wo,s=Eo):s=Uh,t.setTexture2D(e||s,i)}function Ig(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Oh,i)}function Dg(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Bh,i)}function Ng(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Fh,i)}function Ug(r){switch(r){case 5126:return gg;case 35664:return xg;case 35665:return _g;case 35666:return vg;case 35674:return yg;case 35675:return Mg;case 35676:return Sg;case 5124:case 35670:return bg;case 35667:case 35671:return wg;case 35668:case 35672:return Tg;case 35669:case 35673:return Eg;case 5125:return Ag;case 36294:return Rg;case 36295:return Cg;case 36296:return Pg;case 35678:case 36198:case 36298:case 36306:case 35682:return Lg;case 35679:case 36299:case 36307:return Ig;case 35680:case 36300:case 36308:case 36293:return Dg;case 36289:case 36303:case 36311:case 36292:return Ng}}function Fg(r,e){r.uniform1fv(this.addr,e)}function Og(r,e){const t=ss(e,this.size,2);r.uniform2fv(this.addr,t)}function Bg(r,e){const t=ss(e,this.size,3);r.uniform3fv(this.addr,t)}function kg(r,e){const t=ss(e,this.size,4);r.uniform4fv(this.addr,t)}function zg(r,e){const t=ss(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function Hg(r,e){const t=ss(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function Vg(r,e){const t=ss(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function Gg(r,e){r.uniform1iv(this.addr,e)}function Wg(r,e){r.uniform2iv(this.addr,e)}function Xg(r,e){r.uniform3iv(this.addr,e)}function qg(r,e){r.uniform4iv(this.addr,e)}function Kg(r,e){r.uniform1uiv(this.addr,e)}function Yg(r,e){r.uniform2uiv(this.addr,e)}function jg(r,e){r.uniform3uiv(this.addr,e)}function $g(r,e){r.uniform4uiv(this.addr,e)}function Zg(r,e,t){const n=this.cache,i=e.length,s=Or(t,i);Pt(n,s)||(r.uniform1iv(this.addr,s),Lt(n,s));let a;this.type===r.SAMPLER_2D_SHADOW?a=Eo:a=Uh;for(let o=0;o!==i;++o)t.setTexture2D(e[o]||a,s[o])}function Jg(r,e,t){const n=this.cache,i=e.length,s=Or(t,i);Pt(n,s)||(r.uniform1iv(this.addr,s),Lt(n,s));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||Oh,s[a])}function Qg(r,e,t){const n=this.cache,i=e.length,s=Or(t,i);Pt(n,s)||(r.uniform1iv(this.addr,s),Lt(n,s));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||Bh,s[a])}function e0(r,e,t){const n=this.cache,i=e.length,s=Or(t,i);Pt(n,s)||(r.uniform1iv(this.addr,s),Lt(n,s));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||Fh,s[a])}function t0(r){switch(r){case 5126:return Fg;case 35664:return Og;case 35665:return Bg;case 35666:return kg;case 35674:return zg;case 35675:return Hg;case 35676:return Vg;case 5124:case 35670:return Gg;case 35667:case 35671:return Wg;case 35668:case 35672:return Xg;case 35669:case 35673:return qg;case 5125:return Kg;case 36294:return Yg;case 36295:return jg;case 36296:return $g;case 35678:case 36198:case 36298:case 36306:case 35682:return Zg;case 35679:case 36299:case 36307:return Jg;case 35680:case 36300:case 36308:case 36293:return Qg;case 36289:case 36303:case 36311:case 36292:return e0}}class n0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Ug(t.type)}}class i0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=t0(t.type)}}class s0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let s=0,a=i.length;s!==a;++s){const o=i[s];o.setValue(e,t[o.id],n)}}}const ya=/(\w+)(\])?(\[|\.)?/g;function Mc(r,e){r.seq.push(e),r.map[e.id]=e}function r0(r,e,t){const n=r.name,i=n.length;for(ya.lastIndex=0;;){const s=ya.exec(n),a=ya.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===i){Mc(t,l===void 0?new n0(o,r,e):new i0(o,r,e));break}else{let d=t.map[o];d===void 0&&(d=new s0(o),Mc(t,d)),t=d}}}class yr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);r0(o,c,this)}const i=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):s.push(a);i.length>0&&(this.seq=i.concat(s))}setValue(e,t,n,i){const s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,a=t.length;s!==a;++s){const o=t[s],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,s=e.length;i!==s;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function Sc(r,e,t){const n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}const a0=37297;let o0=0;function l0(r,e){const t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=i;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const bc=new We;function c0(r){Qe._getMatrix(bc,Qe.workingColorSpace,r);const e=`mat3( ${bc.elements.map(t=>t.toFixed(4))} )`;switch(Qe.getTransfer(r)){case br:return[e,"LinearTransferOETF"];case at:return[e,"sRGBTransferOETF"];default:return Ie("WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function wc(r,e,t){const n=r.getShaderParameter(e,r.COMPILE_STATUS),s=(r.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+l0(r.getShaderSource(e),o)}else return s}function h0(r,e){const t=c0(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const d0={[th]:"Linear",[nh]:"Reinhard",[ih]:"Cineon",[Ds]:"ACESFilmic",[rh]:"AgX",[ah]:"Neutral",[sh]:"Custom"};function u0(r,e){const t=d0[e];return t===void 0?(Ie("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const hr=new L;function f0(){Qe.getLuminanceCoefficients(hr);const r=hr.x.toFixed(4),e=hr.y.toFixed(4),t=hr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function p0(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ys).join(`
`)}function m0(r){const e=[];for(const t in r){const n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function g0(r,e){const t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(e,i),a=s.name;let o=1;s.type===r.FLOAT_MAT2&&(o=2),s.type===r.FLOAT_MAT3&&(o=3),s.type===r.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:r.getAttribLocation(e,a),locationSize:o}}return t}function ys(r){return r!==""}function Tc(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ec(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const x0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ao(r){return r.replace(x0,v0)}const _0=new Map;function v0(r,e){let t=Ke[e];if(t===void 0){const n=_0.get(e);if(n!==void 0)t=Ke[n],Ie('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ao(t)}const y0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ac(r){return r.replace(y0,M0)}function M0(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function Rc(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const S0={[fr]:"SHADOWMAP_TYPE_PCF",[_s]:"SHADOWMAP_TYPE_VSM"};function b0(r){return S0[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const w0={[Mi]:"ENVMAP_TYPE_CUBE",[qi]:"ENVMAP_TYPE_CUBE",[Lr]:"ENVMAP_TYPE_CUBE_UV"};function T0(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":w0[r.envMapMode]||"ENVMAP_TYPE_CUBE"}const E0={[qi]:"ENVMAP_MODE_REFRACTION"};function A0(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":E0[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}const R0={[Uo]:"ENVMAP_BLENDING_MULTIPLY",[xd]:"ENVMAP_BLENDING_MIX",[_d]:"ENVMAP_BLENDING_ADD"};function C0(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":R0[r.combine]||"ENVMAP_BLENDING_NONE"}function P0(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function L0(r,e,t,n){const i=r.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=b0(t),l=T0(t),h=A0(t),d=C0(t),u=P0(t),f=p0(t),x=m0(s),g=i.createProgram();let m,p,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(ys).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(ys).join(`
`),p.length>0&&(p+=`
`)):(m=[Rc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ys).join(`
`),p=[Rc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==An?"#define TONE_MAPPING":"",t.toneMapping!==An?Ke.tonemapping_pars_fragment:"",t.toneMapping!==An?u0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ke.colorspace_pars_fragment,h0("linearToOutputTexel",t.outputColorSpace),f0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ys).join(`
`)),a=Ao(a),a=Tc(a,t),a=Ec(a,t),o=Ao(o),o=Tc(o,t),o=Ec(o,t),a=Ac(a),o=Ac(o),t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Tl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Tl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const S=_+m+a,M=_+p+o,E=Sc(i,i.VERTEX_SHADER,S),T=Sc(i,i.FRAGMENT_SHADER,M);i.attachShader(g,E),i.attachShader(g,T),t.index0AttributeName!==void 0?i.bindAttribLocation(g,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(g,0,"position"),i.linkProgram(g);function R(C){if(r.debug.checkShaderErrors){const N=i.getProgramInfoLog(g)||"",F=i.getShaderInfoLog(E)||"",z=i.getShaderInfoLog(T)||"",k=N.trim(),O=F.trim(),H=z.trim();let J=!0,Q=!0;if(i.getProgramParameter(g,i.LINK_STATUS)===!1)if(J=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,g,E,T);else{const he=wc(i,E,"vertex"),xe=wc(i,T,"fragment");Oe("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(g,i.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+k+`
`+he+`
`+xe)}else k!==""?Ie("WebGLProgram: Program Info Log:",k):(O===""||H==="")&&(Q=!1);Q&&(C.diagnostics={runnable:J,programLog:k,vertexShader:{log:O,prefix:m},fragmentShader:{log:H,prefix:p}})}i.deleteShader(E),i.deleteShader(T),v=new yr(i,g),w=g0(i,g)}let v;this.getUniforms=function(){return v===void 0&&R(this),v};let w;this.getAttributes=function(){return w===void 0&&R(this),w};let B=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return B===!1&&(B=i.getProgramParameter(g,a0)),B},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=o0++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=E,this.fragmentShader=T,this}let I0=0;class D0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new N0(e),t.set(e,n)),n}}class N0{constructor(e){this.id=I0++,this.code=e,this.usedTimes=0}}function U0(r,e,t,n,i,s){const a=new Yo,o=new D0,c=new Set,l=[],h=new Map,d=n.logarithmicDepthBuffer;let u=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(v){return c.add(v),v===0?"uv":`uv${v}`}function g(v,w,B,C,N){const F=C.fog,z=N.geometry,k=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?C.environment:null,O=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,H=e.get(v.envMap||k,O),J=H&&H.mapping===Lr?H.image.height:null,Q=f[v.type];v.precision!==null&&(u=n.getMaxPrecision(v.precision),u!==v.precision&&Ie("WebGLProgram.getParameters:",v.precision,"not supported, using",u,"instead."));const he=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,xe=he!==void 0?he.length:0;let le=0;z.morphAttributes.position!==void 0&&(le=1),z.morphAttributes.normal!==void 0&&(le=2),z.morphAttributes.color!==void 0&&(le=3);let Be,it,tt,$;if(Q){const rt=wn[Q];Be=rt.vertexShader,it=rt.fragmentShader}else Be=v.vertexShader,it=v.fragmentShader,o.update(v),tt=o.getVertexShaderID(v),$=o.getFragmentShaderID(v);const se=r.getRenderTarget(),ae=r.state.buffers.depth.getReversed(),ke=N.isInstancedMesh===!0,Re=N.isBatchedMesh===!0,Z=!!v.map,Ue=!!v.matcap,De=!!H,ce=!!v.aoMap,Me=!!v.lightMap,me=!!v.bumpMap,ze=!!v.normalMap,P=!!v.displacementMap,gt=!!v.emissiveMap,Ze=!!v.metalnessMap,st=!!v.roughnessMap,_e=v.anisotropy>0,A=v.clearcoat>0,y=v.dispersion>0,D=v.iridescence>0,j=v.sheen>0,q=v.transmission>0,W=_e&&!!v.anisotropyMap,ue=A&&!!v.clearcoatMap,re=A&&!!v.clearcoatNormalMap,Ae=A&&!!v.clearcoatRoughnessMap,Fe=D&&!!v.iridescenceMap,ee=D&&!!v.iridescenceThicknessMap,ie=j&&!!v.sheenColorMap,Se=j&&!!v.sheenRoughnessMap,be=!!v.specularMap,ge=!!v.specularColorMap,qe=!!v.specularIntensityMap,I=q&&!!v.transmissionMap,oe=q&&!!v.thicknessMap,ne=!!v.gradientMap,ye=!!v.alphaMap,te=v.alphaTest>0,K=!!v.alphaHash,we=!!v.extensions;let He=An;v.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(He=r.toneMapping);const pt={shaderID:Q,shaderType:v.type,shaderName:v.name,vertexShader:Be,fragmentShader:it,defines:v.defines,customVertexShaderID:tt,customFragmentShaderID:$,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:u,batching:Re,batchingColor:Re&&N._colorsTexture!==null,instancing:ke,instancingColor:ke&&N.instanceColor!==null,instancingMorph:ke&&N.morphTexture!==null,outputColorSpace:se===null?r.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:Yt,alphaToCoverage:!!v.alphaToCoverage,map:Z,matcap:Ue,envMap:De,envMapMode:De&&H.mapping,envMapCubeUVHeight:J,aoMap:ce,lightMap:Me,bumpMap:me,normalMap:ze,displacementMap:P,emissiveMap:gt,normalMapObjectSpace:ze&&v.normalMapType===bd,normalMapTangentSpace:ze&&v.normalMapType===Go,metalnessMap:Ze,roughnessMap:st,anisotropy:_e,anisotropyMap:W,clearcoat:A,clearcoatMap:ue,clearcoatNormalMap:re,clearcoatRoughnessMap:Ae,dispersion:y,iridescence:D,iridescenceMap:Fe,iridescenceThicknessMap:ee,sheen:j,sheenColorMap:ie,sheenRoughnessMap:Se,specularMap:be,specularColorMap:ge,specularIntensityMap:qe,transmission:q,transmissionMap:I,thicknessMap:oe,gradientMap:ne,opaque:v.transparent===!1&&v.blending===Hi&&v.alphaToCoverage===!1,alphaMap:ye,alphaTest:te,alphaHash:K,combine:v.combine,mapUv:Z&&x(v.map.channel),aoMapUv:ce&&x(v.aoMap.channel),lightMapUv:Me&&x(v.lightMap.channel),bumpMapUv:me&&x(v.bumpMap.channel),normalMapUv:ze&&x(v.normalMap.channel),displacementMapUv:P&&x(v.displacementMap.channel),emissiveMapUv:gt&&x(v.emissiveMap.channel),metalnessMapUv:Ze&&x(v.metalnessMap.channel),roughnessMapUv:st&&x(v.roughnessMap.channel),anisotropyMapUv:W&&x(v.anisotropyMap.channel),clearcoatMapUv:ue&&x(v.clearcoatMap.channel),clearcoatNormalMapUv:re&&x(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ae&&x(v.clearcoatRoughnessMap.channel),iridescenceMapUv:Fe&&x(v.iridescenceMap.channel),iridescenceThicknessMapUv:ee&&x(v.iridescenceThicknessMap.channel),sheenColorMapUv:ie&&x(v.sheenColorMap.channel),sheenRoughnessMapUv:Se&&x(v.sheenRoughnessMap.channel),specularMapUv:be&&x(v.specularMap.channel),specularColorMapUv:ge&&x(v.specularColorMap.channel),specularIntensityMapUv:qe&&x(v.specularIntensityMap.channel),transmissionMapUv:I&&x(v.transmissionMap.channel),thicknessMapUv:oe&&x(v.thicknessMap.channel),alphaMapUv:ye&&x(v.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(ze||_e),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!z.attributes.uv&&(Z||ye),fog:!!F,useFog:v.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||z.attributes.normal===void 0&&ze===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ae,skinning:N.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:xe,morphTextureStride:le,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:v.dithering,shadowMapEnabled:r.shadowMap.enabled&&B.length>0,shadowMapType:r.shadowMap.type,toneMapping:He,decodeVideoTexture:Z&&v.map.isVideoTexture===!0&&Qe.getTransfer(v.map.colorSpace)===at,decodeVideoTextureEmissive:gt&&v.emissiveMap.isVideoTexture===!0&&Qe.getTransfer(v.emissiveMap.colorSpace)===at,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Ht,flipSided:v.side===Vt,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:we&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(we&&v.extensions.multiDraw===!0||Re)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return pt.vertexUv1s=c.has(1),pt.vertexUv2s=c.has(2),pt.vertexUv3s=c.has(3),c.clear(),pt}function m(v){const w=[];if(v.shaderID?w.push(v.shaderID):(w.push(v.customVertexShaderID),w.push(v.customFragmentShaderID)),v.defines!==void 0)for(const B in v.defines)w.push(B),w.push(v.defines[B]);return v.isRawShaderMaterial===!1&&(p(w,v),_(w,v),w.push(r.outputColorSpace)),w.push(v.customProgramCacheKey),w.join()}function p(v,w){v.push(w.precision),v.push(w.outputColorSpace),v.push(w.envMapMode),v.push(w.envMapCubeUVHeight),v.push(w.mapUv),v.push(w.alphaMapUv),v.push(w.lightMapUv),v.push(w.aoMapUv),v.push(w.bumpMapUv),v.push(w.normalMapUv),v.push(w.displacementMapUv),v.push(w.emissiveMapUv),v.push(w.metalnessMapUv),v.push(w.roughnessMapUv),v.push(w.anisotropyMapUv),v.push(w.clearcoatMapUv),v.push(w.clearcoatNormalMapUv),v.push(w.clearcoatRoughnessMapUv),v.push(w.iridescenceMapUv),v.push(w.iridescenceThicknessMapUv),v.push(w.sheenColorMapUv),v.push(w.sheenRoughnessMapUv),v.push(w.specularMapUv),v.push(w.specularColorMapUv),v.push(w.specularIntensityMapUv),v.push(w.transmissionMapUv),v.push(w.thicknessMapUv),v.push(w.combine),v.push(w.fogExp2),v.push(w.sizeAttenuation),v.push(w.morphTargetsCount),v.push(w.morphAttributeCount),v.push(w.numDirLights),v.push(w.numPointLights),v.push(w.numSpotLights),v.push(w.numSpotLightMaps),v.push(w.numHemiLights),v.push(w.numRectAreaLights),v.push(w.numDirLightShadows),v.push(w.numPointLightShadows),v.push(w.numSpotLightShadows),v.push(w.numSpotLightShadowsWithMaps),v.push(w.numLightProbes),v.push(w.shadowMapType),v.push(w.toneMapping),v.push(w.numClippingPlanes),v.push(w.numClipIntersection),v.push(w.depthPacking)}function _(v,w){a.disableAll(),w.instancing&&a.enable(0),w.instancingColor&&a.enable(1),w.instancingMorph&&a.enable(2),w.matcap&&a.enable(3),w.envMap&&a.enable(4),w.normalMapObjectSpace&&a.enable(5),w.normalMapTangentSpace&&a.enable(6),w.clearcoat&&a.enable(7),w.iridescence&&a.enable(8),w.alphaTest&&a.enable(9),w.vertexColors&&a.enable(10),w.vertexAlphas&&a.enable(11),w.vertexUv1s&&a.enable(12),w.vertexUv2s&&a.enable(13),w.vertexUv3s&&a.enable(14),w.vertexTangents&&a.enable(15),w.anisotropy&&a.enable(16),w.alphaHash&&a.enable(17),w.batching&&a.enable(18),w.dispersion&&a.enable(19),w.batchingColor&&a.enable(20),w.gradientMap&&a.enable(21),v.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),v.push(a.mask)}function S(v){const w=f[v.type];let B;if(w){const C=wn[w];B=Cu.clone(C.uniforms)}else B=v.uniforms;return B}function M(v,w){let B=h.get(w);return B!==void 0?++B.usedTimes:(B=new L0(r,w,v,i),l.push(B),h.set(w,B)),B}function E(v){if(--v.usedTimes===0){const w=l.indexOf(v);l[w]=l[l.length-1],l.pop(),h.delete(v.cacheKey),v.destroy()}}function T(v){o.remove(v)}function R(){o.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:S,acquireProgram:M,releaseProgram:E,releaseShaderCache:T,programs:l,dispose:R}}function F0(){let r=new WeakMap;function e(a){return r.has(a)}function t(a){let o=r.get(a);return o===void 0&&(o={},r.set(a,o)),o}function n(a){r.delete(a)}function i(a,o,c){r.get(a)[o]=c}function s(){r=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:s}}function O0(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.materialVariant!==e.materialVariant?r.materialVariant-e.materialVariant:r.z!==e.z?r.z-e.z:r.id-e.id}function Cc(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function Pc(){const r=[];let e=0;const t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,x,g,m,p){let _=r[e];return _===void 0?(_={id:u.id,object:u,geometry:f,material:x,materialVariant:a(u),groupOrder:g,renderOrder:u.renderOrder,z:m,group:p},r[e]=_):(_.id=u.id,_.object=u,_.geometry=f,_.material=x,_.materialVariant=a(u),_.groupOrder=g,_.renderOrder=u.renderOrder,_.z=m,_.group=p),e++,_}function c(u,f,x,g,m,p){const _=o(u,f,x,g,m,p);x.transmission>0?n.push(_):x.transparent===!0?i.push(_):t.push(_)}function l(u,f,x,g,m,p){const _=o(u,f,x,g,m,p);x.transmission>0?n.unshift(_):x.transparent===!0?i.unshift(_):t.unshift(_)}function h(u,f){t.length>1&&t.sort(u||O0),n.length>1&&n.sort(f||Cc),i.length>1&&i.sort(f||Cc)}function d(){for(let u=e,f=r.length;u<f;u++){const x=r[u];if(x.id===null)break;x.id=null,x.object=null,x.geometry=null,x.material=null,x.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:c,unshift:l,finish:d,sort:h}}function B0(){let r=new WeakMap;function e(n,i){const s=r.get(n);let a;return s===void 0?(a=new Pc,r.set(n,[a])):i>=s.length?(a=new Pc,s.push(a)):a=s[i],a}function t(){r=new WeakMap}return{get:e,dispose:t}}function k0(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new Ne};break;case"SpotLight":t={position:new L,direction:new L,color:new Ne,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new Ne,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new Ne,groundColor:new Ne};break;case"RectAreaLight":t={color:new Ne,position:new L,halfWidth:new L,halfHeight:new L};break}return r[e.id]=t,t}}}function z0(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let H0=0;function V0(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function G0(r){const e=new k0,t=z0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new L);const i=new L,s=new Ve,a=new Ve;function o(l){let h=0,d=0,u=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let f=0,x=0,g=0,m=0,p=0,_=0,S=0,M=0,E=0,T=0,R=0;l.sort(V0);for(let w=0,B=l.length;w<B;w++){const C=l[w],N=C.color,F=C.intensity,z=C.distance;let k=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===Ki?k=C.shadow.map.texture:k=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)h+=N.r*F,d+=N.g*F,u+=N.b*F;else if(C.isLightProbe){for(let O=0;O<9;O++)n.probe[O].addScaledVector(C.sh.coefficients[O],F);R++}else if(C.isDirectionalLight){const O=e.get(C);if(O.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const H=C.shadow,J=t.get(C);J.shadowIntensity=H.intensity,J.shadowBias=H.bias,J.shadowNormalBias=H.normalBias,J.shadowRadius=H.radius,J.shadowMapSize=H.mapSize,n.directionalShadow[f]=J,n.directionalShadowMap[f]=k,n.directionalShadowMatrix[f]=C.shadow.matrix,_++}n.directional[f]=O,f++}else if(C.isSpotLight){const O=e.get(C);O.position.setFromMatrixPosition(C.matrixWorld),O.color.copy(N).multiplyScalar(F),O.distance=z,O.coneCos=Math.cos(C.angle),O.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),O.decay=C.decay,n.spot[g]=O;const H=C.shadow;if(C.map&&(n.spotLightMap[E]=C.map,E++,H.updateMatrices(C),C.castShadow&&T++),n.spotLightMatrix[g]=H.matrix,C.castShadow){const J=t.get(C);J.shadowIntensity=H.intensity,J.shadowBias=H.bias,J.shadowNormalBias=H.normalBias,J.shadowRadius=H.radius,J.shadowMapSize=H.mapSize,n.spotShadow[g]=J,n.spotShadowMap[g]=k,M++}g++}else if(C.isRectAreaLight){const O=e.get(C);O.color.copy(N).multiplyScalar(F),O.halfWidth.set(C.width*.5,0,0),O.halfHeight.set(0,C.height*.5,0),n.rectArea[m]=O,m++}else if(C.isPointLight){const O=e.get(C);if(O.color.copy(C.color).multiplyScalar(C.intensity),O.distance=C.distance,O.decay=C.decay,C.castShadow){const H=C.shadow,J=t.get(C);J.shadowIntensity=H.intensity,J.shadowBias=H.bias,J.shadowNormalBias=H.normalBias,J.shadowRadius=H.radius,J.shadowMapSize=H.mapSize,J.shadowCameraNear=H.camera.near,J.shadowCameraFar=H.camera.far,n.pointShadow[x]=J,n.pointShadowMap[x]=k,n.pointShadowMatrix[x]=C.shadow.matrix,S++}n.point[x]=O,x++}else if(C.isHemisphereLight){const O=e.get(C);O.skyColor.copy(C.color).multiplyScalar(F),O.groundColor.copy(C.groundColor).multiplyScalar(F),n.hemi[p]=O,p++}}m>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=de.LTC_FLOAT_1,n.rectAreaLTC2=de.LTC_FLOAT_2):(n.rectAreaLTC1=de.LTC_HALF_1,n.rectAreaLTC2=de.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const v=n.hash;(v.directionalLength!==f||v.pointLength!==x||v.spotLength!==g||v.rectAreaLength!==m||v.hemiLength!==p||v.numDirectionalShadows!==_||v.numPointShadows!==S||v.numSpotShadows!==M||v.numSpotMaps!==E||v.numLightProbes!==R)&&(n.directional.length=f,n.spot.length=g,n.rectArea.length=m,n.point.length=x,n.hemi.length=p,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=M+E-T,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=R,v.directionalLength=f,v.pointLength=x,v.spotLength=g,v.rectAreaLength=m,v.hemiLength=p,v.numDirectionalShadows=_,v.numPointShadows=S,v.numSpotShadows=M,v.numSpotMaps=E,v.numLightProbes=R,n.version=H0++)}function c(l,h){let d=0,u=0,f=0,x=0,g=0;const m=h.matrixWorldInverse;for(let p=0,_=l.length;p<_;p++){const S=l[p];if(S.isDirectionalLight){const M=n.directional[d];M.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(m),d++}else if(S.isSpotLight){const M=n.spot[f];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(m),f++}else if(S.isRectAreaLight){const M=n.rectArea[x];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(m),a.identity(),s.copy(S.matrixWorld),s.premultiply(m),a.extractRotation(s),M.halfWidth.set(S.width*.5,0,0),M.halfHeight.set(0,S.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),x++}else if(S.isPointLight){const M=n.point[u];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(m),u++}else if(S.isHemisphereLight){const M=n.hemi[g];M.direction.setFromMatrixPosition(S.matrixWorld),M.direction.transformDirection(m),g++}}}return{setup:o,setupView:c,state:n}}function Lc(r){const e=new G0(r),t=[],n=[];function i(h){l.camera=h,t.length=0,n.length=0}function s(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function c(h){e.setupView(t,h)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function W0(r){let e=new WeakMap;function t(i,s=0){const a=e.get(i);let o;return a===void 0?(o=new Lc(r),e.set(i,[o])):s>=a.length?(o=new Lc(r),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const X0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,q0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,K0=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],Y0=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],Ic=new Ve,fs=new L,Ma=new L;function j0(r,e,t){let n=new el;const i=new Xe,s=new Xe,a=new _t,o=new Nu,c=new Uu,l={},h=t.maxTextureSize,d={[Kn]:Vt,[Vt]:Kn,[Ht]:Ht},u=new Ln({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Xe},radius:{value:4}},vertexShader:X0,fragmentShader:q0}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const x=new Ot;x.setAttribute("position",new Gt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new Y(x,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=fr;let p=this.type;this.render=function(T,R,v){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===No&&(Ie("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=fr);const w=r.getRenderTarget(),B=r.getActiveCubeFace(),C=r.getActiveMipmapLevel(),N=r.state;N.setBlending(Xn),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const F=p!==this.type;F&&R.traverse(function(z){z.material&&(Array.isArray(z.material)?z.material.forEach(k=>k.needsUpdate=!0):z.material.needsUpdate=!0)});for(let z=0,k=T.length;z<k;z++){const O=T[z],H=O.shadow;if(H===void 0){Ie("WebGLShadowMap:",O,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;i.copy(H.mapSize);const J=H.getFrameExtents();i.multiply(J),s.copy(H.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/J.x),i.x=s.x*J.x,H.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/J.y),i.y=s.y*J.y,H.mapSize.y=s.y));const Q=r.state.buffers.depth.getReversed();if(H.camera._reversedDepth=Q,H.map===null||F===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===_s){if(O.isPointLight){Ie("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new Rn(i.x,i.y,{format:Ki,type:Yn,minFilter:Rt,magFilter:Rt,generateMipmaps:!1}),H.map.texture.name=O.name+".shadowMap",H.map.depthTexture=new Ps(i.x,i.y,sn),H.map.depthTexture.name=O.name+".shadowMapDepth",H.map.depthTexture.format=jn,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=At,H.map.depthTexture.magFilter=At}else O.isPointLight?(H.map=new Nh(i.x),H.map.depthTexture=new Au(i.x,Pn)):(H.map=new Rn(i.x,i.y),H.map.depthTexture=new Ps(i.x,i.y,Pn)),H.map.depthTexture.name=O.name+".shadowMap",H.map.depthTexture.format=jn,this.type===fr?(H.map.depthTexture.compareFunction=Q?Xo:Wo,H.map.depthTexture.minFilter=Rt,H.map.depthTexture.magFilter=Rt):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=At,H.map.depthTexture.magFilter=At);H.camera.updateProjectionMatrix()}const he=H.map.isWebGLCubeRenderTarget?6:1;for(let xe=0;xe<he;xe++){if(H.map.isWebGLCubeRenderTarget)r.setRenderTarget(H.map,xe),r.clear();else{xe===0&&(r.setRenderTarget(H.map),r.clear());const le=H.getViewport(xe);a.set(s.x*le.x,s.y*le.y,s.x*le.z,s.y*le.w),N.viewport(a)}if(O.isPointLight){const le=H.camera,Be=H.matrix,it=O.distance||le.far;it!==le.far&&(le.far=it,le.updateProjectionMatrix()),fs.setFromMatrixPosition(O.matrixWorld),le.position.copy(fs),Ma.copy(le.position),Ma.add(K0[xe]),le.up.copy(Y0[xe]),le.lookAt(Ma),le.updateMatrixWorld(),Be.makeTranslation(-fs.x,-fs.y,-fs.z),Ic.multiplyMatrices(le.projectionMatrix,le.matrixWorldInverse),H._frustum.setFromProjectionMatrix(Ic,le.coordinateSystem,le.reversedDepth)}else H.updateMatrices(O);n=H.getFrustum(),M(R,v,H.camera,O,this.type)}H.isPointLightShadow!==!0&&this.type===_s&&_(H,v),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,r.setRenderTarget(w,B,C)};function _(T,R){const v=e.update(g);u.defines.VSM_SAMPLES!==T.blurSamples&&(u.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Rn(i.x,i.y,{format:Ki,type:Yn})),u.uniforms.shadow_pass.value=T.map.depthTexture,u.uniforms.resolution.value=T.mapSize,u.uniforms.radius.value=T.radius,r.setRenderTarget(T.mapPass),r.clear(),r.renderBufferDirect(R,null,v,u,g,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,r.setRenderTarget(T.map),r.clear(),r.renderBufferDirect(R,null,v,f,g,null)}function S(T,R,v,w){let B=null;const C=v.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(C!==void 0)B=C;else if(B=v.isPointLight===!0?c:o,r.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const N=B.uuid,F=R.uuid;let z=l[N];z===void 0&&(z={},l[N]=z);let k=z[F];k===void 0&&(k=B.clone(),z[F]=k,R.addEventListener("dispose",E)),B=k}if(B.visible=R.visible,B.wireframe=R.wireframe,w===_s?B.side=R.shadowSide!==null?R.shadowSide:R.side:B.side=R.shadowSide!==null?R.shadowSide:d[R.side],B.alphaMap=R.alphaMap,B.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,B.map=R.map,B.clipShadows=R.clipShadows,B.clippingPlanes=R.clippingPlanes,B.clipIntersection=R.clipIntersection,B.displacementMap=R.displacementMap,B.displacementScale=R.displacementScale,B.displacementBias=R.displacementBias,B.wireframeLinewidth=R.wireframeLinewidth,B.linewidth=R.linewidth,v.isPointLight===!0&&B.isMeshDistanceMaterial===!0){const N=r.properties.get(B);N.light=v}return B}function M(T,R,v,w,B){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&B===_s)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,T.matrixWorld);const F=e.update(T),z=T.material;if(Array.isArray(z)){const k=F.groups;for(let O=0,H=k.length;O<H;O++){const J=k[O],Q=z[J.materialIndex];if(Q&&Q.visible){const he=S(T,Q,w,B);T.onBeforeShadow(r,T,R,v,F,he,J),r.renderBufferDirect(v,null,F,he,T,J),T.onAfterShadow(r,T,R,v,F,he,J)}}}else if(z.visible){const k=S(T,z,w,B);T.onBeforeShadow(r,T,R,v,F,k,null),r.renderBufferDirect(v,null,F,k,T,null),T.onAfterShadow(r,T,R,v,F,k,null)}}const N=T.children;for(let F=0,z=N.length;F<z;F++)M(N[F],R,v,w,B)}function E(T){T.target.removeEventListener("dispose",E);for(const v in l){const w=l[v],B=T.target.uuid;B in w&&(w[B].dispose(),delete w[B])}}}function $0(r,e){function t(){let I=!1;const oe=new _t;let ne=null;const ye=new _t(0,0,0,0);return{setMask:function(te){ne!==te&&!I&&(r.colorMask(te,te,te,te),ne=te)},setLocked:function(te){I=te},setClear:function(te,K,we,He,pt){pt===!0&&(te*=He,K*=He,we*=He),oe.set(te,K,we,He),ye.equals(oe)===!1&&(r.clearColor(te,K,we,He),ye.copy(oe))},reset:function(){I=!1,ne=null,ye.set(-1,0,0,0)}}}function n(){let I=!1,oe=!1,ne=null,ye=null,te=null;return{setReversed:function(K){if(oe!==K){const we=e.get("EXT_clip_control");K?we.clipControlEXT(we.LOWER_LEFT_EXT,we.ZERO_TO_ONE_EXT):we.clipControlEXT(we.LOWER_LEFT_EXT,we.NEGATIVE_ONE_TO_ONE_EXT),oe=K;const He=te;te=null,this.setClear(He)}},getReversed:function(){return oe},setTest:function(K){K?se(r.DEPTH_TEST):ae(r.DEPTH_TEST)},setMask:function(K){ne!==K&&!I&&(r.depthMask(K),ne=K)},setFunc:function(K){if(oe&&(K=Ud[K]),ye!==K){switch(K){case Da:r.depthFunc(r.NEVER);break;case Na:r.depthFunc(r.ALWAYS);break;case Ua:r.depthFunc(r.LESS);break;case Xi:r.depthFunc(r.LEQUAL);break;case Fa:r.depthFunc(r.EQUAL);break;case Oa:r.depthFunc(r.GEQUAL);break;case Ba:r.depthFunc(r.GREATER);break;case ka:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}ye=K}},setLocked:function(K){I=K},setClear:function(K){te!==K&&(te=K,oe&&(K=1-K),r.clearDepth(K))},reset:function(){I=!1,ne=null,ye=null,te=null,oe=!1}}}function i(){let I=!1,oe=null,ne=null,ye=null,te=null,K=null,we=null,He=null,pt=null;return{setTest:function(rt){I||(rt?se(r.STENCIL_TEST):ae(r.STENCIL_TEST))},setMask:function(rt){oe!==rt&&!I&&(r.stencilMask(rt),oe=rt)},setFunc:function(rt,Nn,Un){(ne!==rt||ye!==Nn||te!==Un)&&(r.stencilFunc(rt,Nn,Un),ne=rt,ye=Nn,te=Un)},setOp:function(rt,Nn,Un){(K!==rt||we!==Nn||He!==Un)&&(r.stencilOp(rt,Nn,Un),K=rt,we=Nn,He=Un)},setLocked:function(rt){I=rt},setClear:function(rt){pt!==rt&&(r.clearStencil(rt),pt=rt)},reset:function(){I=!1,oe=null,ne=null,ye=null,te=null,K=null,we=null,He=null,pt=null}}}const s=new t,a=new n,o=new i,c=new WeakMap,l=new WeakMap;let h={},d={},u=new WeakMap,f=[],x=null,g=!1,m=null,p=null,_=null,S=null,M=null,E=null,T=null,R=new Ne(0,0,0),v=0,w=!1,B=null,C=null,N=null,F=null,z=null;const k=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let O=!1,H=0;const J=r.getParameter(r.VERSION);J.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(J)[1]),O=H>=1):J.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),O=H>=2);let Q=null,he={};const xe=r.getParameter(r.SCISSOR_BOX),le=r.getParameter(r.VIEWPORT),Be=new _t().fromArray(xe),it=new _t().fromArray(le);function tt(I,oe,ne,ye){const te=new Uint8Array(4),K=r.createTexture();r.bindTexture(I,K),r.texParameteri(I,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(I,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let we=0;we<ne;we++)I===r.TEXTURE_3D||I===r.TEXTURE_2D_ARRAY?r.texImage3D(oe,0,r.RGBA,1,1,ye,0,r.RGBA,r.UNSIGNED_BYTE,te):r.texImage2D(oe+we,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,te);return K}const $={};$[r.TEXTURE_2D]=tt(r.TEXTURE_2D,r.TEXTURE_2D,1),$[r.TEXTURE_CUBE_MAP]=tt(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[r.TEXTURE_2D_ARRAY]=tt(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),$[r.TEXTURE_3D]=tt(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),se(r.DEPTH_TEST),a.setFunc(Xi),me(!1),ze(ml),se(r.CULL_FACE),ce(Xn);function se(I){h[I]!==!0&&(r.enable(I),h[I]=!0)}function ae(I){h[I]!==!1&&(r.disable(I),h[I]=!1)}function ke(I,oe){return d[I]!==oe?(r.bindFramebuffer(I,oe),d[I]=oe,I===r.DRAW_FRAMEBUFFER&&(d[r.FRAMEBUFFER]=oe),I===r.FRAMEBUFFER&&(d[r.DRAW_FRAMEBUFFER]=oe),!0):!1}function Re(I,oe){let ne=f,ye=!1;if(I){ne=u.get(oe),ne===void 0&&(ne=[],u.set(oe,ne));const te=I.textures;if(ne.length!==te.length||ne[0]!==r.COLOR_ATTACHMENT0){for(let K=0,we=te.length;K<we;K++)ne[K]=r.COLOR_ATTACHMENT0+K;ne.length=te.length,ye=!0}}else ne[0]!==r.BACK&&(ne[0]=r.BACK,ye=!0);ye&&r.drawBuffers(ne)}function Z(I){return x!==I?(r.useProgram(I),x=I,!0):!1}const Ue={[_i]:r.FUNC_ADD,[ed]:r.FUNC_SUBTRACT,[td]:r.FUNC_REVERSE_SUBTRACT};Ue[nd]=r.MIN,Ue[id]=r.MAX;const De={[sd]:r.ZERO,[rd]:r.ONE,[ad]:r.SRC_COLOR,[La]:r.SRC_ALPHA,[ud]:r.SRC_ALPHA_SATURATE,[hd]:r.DST_COLOR,[ld]:r.DST_ALPHA,[od]:r.ONE_MINUS_SRC_COLOR,[Ia]:r.ONE_MINUS_SRC_ALPHA,[dd]:r.ONE_MINUS_DST_COLOR,[cd]:r.ONE_MINUS_DST_ALPHA,[fd]:r.CONSTANT_COLOR,[pd]:r.ONE_MINUS_CONSTANT_COLOR,[md]:r.CONSTANT_ALPHA,[gd]:r.ONE_MINUS_CONSTANT_ALPHA};function ce(I,oe,ne,ye,te,K,we,He,pt,rt){if(I===Xn){g===!0&&(ae(r.BLEND),g=!1);return}if(g===!1&&(se(r.BLEND),g=!0),I!==Qh){if(I!==m||rt!==w){if((p!==_i||M!==_i)&&(r.blendEquation(r.FUNC_ADD),p=_i,M=_i),rt)switch(I){case Hi:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case gl:r.blendFunc(r.ONE,r.ONE);break;case xl:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case _l:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:Oe("WebGLState: Invalid blending: ",I);break}else switch(I){case Hi:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case gl:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case xl:Oe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case _l:Oe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Oe("WebGLState: Invalid blending: ",I);break}_=null,S=null,E=null,T=null,R.set(0,0,0),v=0,m=I,w=rt}return}te=te||oe,K=K||ne,we=we||ye,(oe!==p||te!==M)&&(r.blendEquationSeparate(Ue[oe],Ue[te]),p=oe,M=te),(ne!==_||ye!==S||K!==E||we!==T)&&(r.blendFuncSeparate(De[ne],De[ye],De[K],De[we]),_=ne,S=ye,E=K,T=we),(He.equals(R)===!1||pt!==v)&&(r.blendColor(He.r,He.g,He.b,pt),R.copy(He),v=pt),m=I,w=!1}function Me(I,oe){I.side===Ht?ae(r.CULL_FACE):se(r.CULL_FACE);let ne=I.side===Vt;oe&&(ne=!ne),me(ne),I.blending===Hi&&I.transparent===!1?ce(Xn):ce(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),s.setMask(I.colorWrite);const ye=I.stencilWrite;o.setTest(ye),ye&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),gt(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?se(r.SAMPLE_ALPHA_TO_COVERAGE):ae(r.SAMPLE_ALPHA_TO_COVERAGE)}function me(I){B!==I&&(I?r.frontFace(r.CW):r.frontFace(r.CCW),B=I)}function ze(I){I!==Zh?(se(r.CULL_FACE),I!==C&&(I===ml?r.cullFace(r.BACK):I===Jh?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):ae(r.CULL_FACE),C=I}function P(I){I!==N&&(O&&r.lineWidth(I),N=I)}function gt(I,oe,ne){I?(se(r.POLYGON_OFFSET_FILL),(F!==oe||z!==ne)&&(F=oe,z=ne,a.getReversed()&&(oe=-oe),r.polygonOffset(oe,ne))):ae(r.POLYGON_OFFSET_FILL)}function Ze(I){I?se(r.SCISSOR_TEST):ae(r.SCISSOR_TEST)}function st(I){I===void 0&&(I=r.TEXTURE0+k-1),Q!==I&&(r.activeTexture(I),Q=I)}function _e(I,oe,ne){ne===void 0&&(Q===null?ne=r.TEXTURE0+k-1:ne=Q);let ye=he[ne];ye===void 0&&(ye={type:void 0,texture:void 0},he[ne]=ye),(ye.type!==I||ye.texture!==oe)&&(Q!==ne&&(r.activeTexture(ne),Q=ne),r.bindTexture(I,oe||$[I]),ye.type=I,ye.texture=oe)}function A(){const I=he[Q];I!==void 0&&I.type!==void 0&&(r.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function y(){try{r.compressedTexImage2D(...arguments)}catch(I){Oe("WebGLState:",I)}}function D(){try{r.compressedTexImage3D(...arguments)}catch(I){Oe("WebGLState:",I)}}function j(){try{r.texSubImage2D(...arguments)}catch(I){Oe("WebGLState:",I)}}function q(){try{r.texSubImage3D(...arguments)}catch(I){Oe("WebGLState:",I)}}function W(){try{r.compressedTexSubImage2D(...arguments)}catch(I){Oe("WebGLState:",I)}}function ue(){try{r.compressedTexSubImage3D(...arguments)}catch(I){Oe("WebGLState:",I)}}function re(){try{r.texStorage2D(...arguments)}catch(I){Oe("WebGLState:",I)}}function Ae(){try{r.texStorage3D(...arguments)}catch(I){Oe("WebGLState:",I)}}function Fe(){try{r.texImage2D(...arguments)}catch(I){Oe("WebGLState:",I)}}function ee(){try{r.texImage3D(...arguments)}catch(I){Oe("WebGLState:",I)}}function ie(I){Be.equals(I)===!1&&(r.scissor(I.x,I.y,I.z,I.w),Be.copy(I))}function Se(I){it.equals(I)===!1&&(r.viewport(I.x,I.y,I.z,I.w),it.copy(I))}function be(I,oe){let ne=l.get(oe);ne===void 0&&(ne=new WeakMap,l.set(oe,ne));let ye=ne.get(I);ye===void 0&&(ye=r.getUniformBlockIndex(oe,I.name),ne.set(I,ye))}function ge(I,oe){const ye=l.get(oe).get(I);c.get(oe)!==ye&&(r.uniformBlockBinding(oe,ye,I.__bindingPointIndex),c.set(oe,ye))}function qe(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),h={},Q=null,he={},d={},u=new WeakMap,f=[],x=null,g=!1,m=null,p=null,_=null,S=null,M=null,E=null,T=null,R=new Ne(0,0,0),v=0,w=!1,B=null,C=null,N=null,F=null,z=null,Be.set(0,0,r.canvas.width,r.canvas.height),it.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:se,disable:ae,bindFramebuffer:ke,drawBuffers:Re,useProgram:Z,setBlending:ce,setMaterial:Me,setFlipSided:me,setCullFace:ze,setLineWidth:P,setPolygonOffset:gt,setScissorTest:Ze,activeTexture:st,bindTexture:_e,unbindTexture:A,compressedTexImage2D:y,compressedTexImage3D:D,texImage2D:Fe,texImage3D:ee,updateUBOMapping:be,uniformBlockBinding:ge,texStorage2D:re,texStorage3D:Ae,texSubImage2D:j,texSubImage3D:q,compressedTexSubImage2D:W,compressedTexSubImage3D:ue,scissor:ie,viewport:Se,reset:qe}}function Z0(r,e,t,n,i,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Xe,h=new WeakMap;let d;const u=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(A,y){return f?new OffscreenCanvas(A,y):Cs("canvas")}function g(A,y,D){let j=1;const q=_e(A);if((q.width>D||q.height>D)&&(j=D/Math.max(q.width,q.height)),j<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const W=Math.floor(j*q.width),ue=Math.floor(j*q.height);d===void 0&&(d=x(W,ue));const re=y?x(W,ue):d;return re.width=W,re.height=ue,re.getContext("2d").drawImage(A,0,0,W,ue),Ie("WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+W+"x"+ue+")."),re}else return"data"in A&&Ie("WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),A;return A}function m(A){return A.generateMipmaps}function p(A){r.generateMipmap(A)}function _(A){return A.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?r.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function S(A,y,D,j,q=!1){if(A!==null){if(r[A]!==void 0)return r[A];Ie("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let W=y;if(y===r.RED&&(D===r.FLOAT&&(W=r.R32F),D===r.HALF_FLOAT&&(W=r.R16F),D===r.UNSIGNED_BYTE&&(W=r.R8)),y===r.RED_INTEGER&&(D===r.UNSIGNED_BYTE&&(W=r.R8UI),D===r.UNSIGNED_SHORT&&(W=r.R16UI),D===r.UNSIGNED_INT&&(W=r.R32UI),D===r.BYTE&&(W=r.R8I),D===r.SHORT&&(W=r.R16I),D===r.INT&&(W=r.R32I)),y===r.RG&&(D===r.FLOAT&&(W=r.RG32F),D===r.HALF_FLOAT&&(W=r.RG16F),D===r.UNSIGNED_BYTE&&(W=r.RG8)),y===r.RG_INTEGER&&(D===r.UNSIGNED_BYTE&&(W=r.RG8UI),D===r.UNSIGNED_SHORT&&(W=r.RG16UI),D===r.UNSIGNED_INT&&(W=r.RG32UI),D===r.BYTE&&(W=r.RG8I),D===r.SHORT&&(W=r.RG16I),D===r.INT&&(W=r.RG32I)),y===r.RGB_INTEGER&&(D===r.UNSIGNED_BYTE&&(W=r.RGB8UI),D===r.UNSIGNED_SHORT&&(W=r.RGB16UI),D===r.UNSIGNED_INT&&(W=r.RGB32UI),D===r.BYTE&&(W=r.RGB8I),D===r.SHORT&&(W=r.RGB16I),D===r.INT&&(W=r.RGB32I)),y===r.RGBA_INTEGER&&(D===r.UNSIGNED_BYTE&&(W=r.RGBA8UI),D===r.UNSIGNED_SHORT&&(W=r.RGBA16UI),D===r.UNSIGNED_INT&&(W=r.RGBA32UI),D===r.BYTE&&(W=r.RGBA8I),D===r.SHORT&&(W=r.RGBA16I),D===r.INT&&(W=r.RGBA32I)),y===r.RGB&&(D===r.UNSIGNED_INT_5_9_9_9_REV&&(W=r.RGB9_E5),D===r.UNSIGNED_INT_10F_11F_11F_REV&&(W=r.R11F_G11F_B10F)),y===r.RGBA){const ue=q?br:Qe.getTransfer(j);D===r.FLOAT&&(W=r.RGBA32F),D===r.HALF_FLOAT&&(W=r.RGBA16F),D===r.UNSIGNED_BYTE&&(W=ue===at?r.SRGB8_ALPHA8:r.RGBA8),D===r.UNSIGNED_SHORT_4_4_4_4&&(W=r.RGBA4),D===r.UNSIGNED_SHORT_5_5_5_1&&(W=r.RGB5_A1)}return(W===r.R16F||W===r.R32F||W===r.RG16F||W===r.RG32F||W===r.RGBA16F||W===r.RGBA32F)&&e.get("EXT_color_buffer_float"),W}function M(A,y){let D;return A?y===null||y===Pn||y===Ts?D=r.DEPTH24_STENCIL8:y===sn?D=r.DEPTH32F_STENCIL8:y===ws&&(D=r.DEPTH24_STENCIL8,Ie("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===Pn||y===Ts?D=r.DEPTH_COMPONENT24:y===sn?D=r.DEPTH_COMPONENT32F:y===ws&&(D=r.DEPTH_COMPONENT16),D}function E(A,y){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==At&&A.minFilter!==Rt?Math.log2(Math.max(y.width,y.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?y.mipmaps.length:1}function T(A){const y=A.target;y.removeEventListener("dispose",T),v(y),y.isVideoTexture&&h.delete(y)}function R(A){const y=A.target;y.removeEventListener("dispose",R),B(y)}function v(A){const y=n.get(A);if(y.__webglInit===void 0)return;const D=A.source,j=u.get(D);if(j){const q=j[y.__cacheKey];q.usedTimes--,q.usedTimes===0&&w(A),Object.keys(j).length===0&&u.delete(D)}n.remove(A)}function w(A){const y=n.get(A);r.deleteTexture(y.__webglTexture);const D=A.source,j=u.get(D);delete j[y.__cacheKey],a.memory.textures--}function B(A){const y=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(y.__webglFramebuffer[j]))for(let q=0;q<y.__webglFramebuffer[j].length;q++)r.deleteFramebuffer(y.__webglFramebuffer[j][q]);else r.deleteFramebuffer(y.__webglFramebuffer[j]);y.__webglDepthbuffer&&r.deleteRenderbuffer(y.__webglDepthbuffer[j])}else{if(Array.isArray(y.__webglFramebuffer))for(let j=0;j<y.__webglFramebuffer.length;j++)r.deleteFramebuffer(y.__webglFramebuffer[j]);else r.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&r.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&r.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let j=0;j<y.__webglColorRenderbuffer.length;j++)y.__webglColorRenderbuffer[j]&&r.deleteRenderbuffer(y.__webglColorRenderbuffer[j]);y.__webglDepthRenderbuffer&&r.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const D=A.textures;for(let j=0,q=D.length;j<q;j++){const W=n.get(D[j]);W.__webglTexture&&(r.deleteTexture(W.__webglTexture),a.memory.textures--),n.remove(D[j])}n.remove(A)}let C=0;function N(){C=0}function F(){const A=C;return A>=i.maxTextures&&Ie("WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+i.maxTextures),C+=1,A}function z(A){const y=[];return y.push(A.wrapS),y.push(A.wrapT),y.push(A.wrapR||0),y.push(A.magFilter),y.push(A.minFilter),y.push(A.anisotropy),y.push(A.internalFormat),y.push(A.format),y.push(A.type),y.push(A.generateMipmaps),y.push(A.premultiplyAlpha),y.push(A.flipY),y.push(A.unpackAlignment),y.push(A.colorSpace),y.join()}function k(A,y){const D=n.get(A);if(A.isVideoTexture&&Ze(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&D.__version!==A.version){const j=A.image;if(j===null)Ie("WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)Ie("WebGLRenderer: Texture marked for update but image is incomplete");else{$(D,A,y);return}}else A.isExternalTexture&&(D.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(r.TEXTURE_2D,D.__webglTexture,r.TEXTURE0+y)}function O(A,y){const D=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&D.__version!==A.version){$(D,A,y);return}else A.isExternalTexture&&(D.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(r.TEXTURE_2D_ARRAY,D.__webglTexture,r.TEXTURE0+y)}function H(A,y){const D=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&D.__version!==A.version){$(D,A,y);return}t.bindTexture(r.TEXTURE_3D,D.__webglTexture,r.TEXTURE0+y)}function J(A,y){const D=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&D.__version!==A.version){se(D,A,y);return}t.bindTexture(r.TEXTURE_CUBE_MAP,D.__webglTexture,r.TEXTURE0+y)}const Q={[Cn]:r.REPEAT,[Tn]:r.CLAMP_TO_EDGE,[Sr]:r.MIRRORED_REPEAT},he={[At]:r.NEAREST,[lh]:r.NEAREST_MIPMAP_NEAREST,[vs]:r.NEAREST_MIPMAP_LINEAR,[Rt]:r.LINEAR,[pr]:r.LINEAR_MIPMAP_NEAREST,[Gn]:r.LINEAR_MIPMAP_LINEAR},xe={[wd]:r.NEVER,[Cd]:r.ALWAYS,[Td]:r.LESS,[Wo]:r.LEQUAL,[Ed]:r.EQUAL,[Xo]:r.GEQUAL,[Ad]:r.GREATER,[Rd]:r.NOTEQUAL};function le(A,y){if(y.type===sn&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===Rt||y.magFilter===pr||y.magFilter===vs||y.magFilter===Gn||y.minFilter===Rt||y.minFilter===pr||y.minFilter===vs||y.minFilter===Gn)&&Ie("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(A,r.TEXTURE_WRAP_S,Q[y.wrapS]),r.texParameteri(A,r.TEXTURE_WRAP_T,Q[y.wrapT]),(A===r.TEXTURE_3D||A===r.TEXTURE_2D_ARRAY)&&r.texParameteri(A,r.TEXTURE_WRAP_R,Q[y.wrapR]),r.texParameteri(A,r.TEXTURE_MAG_FILTER,he[y.magFilter]),r.texParameteri(A,r.TEXTURE_MIN_FILTER,he[y.minFilter]),y.compareFunction&&(r.texParameteri(A,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(A,r.TEXTURE_COMPARE_FUNC,xe[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===At||y.minFilter!==vs&&y.minFilter!==Gn||y.type===sn&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const D=e.get("EXT_texture_filter_anisotropic");r.texParameterf(A,D.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,i.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function Be(A,y){let D=!1;A.__webglInit===void 0&&(A.__webglInit=!0,y.addEventListener("dispose",T));const j=y.source;let q=u.get(j);q===void 0&&(q={},u.set(j,q));const W=z(y);if(W!==A.__cacheKey){q[W]===void 0&&(q[W]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,D=!0),q[W].usedTimes++;const ue=q[A.__cacheKey];ue!==void 0&&(q[A.__cacheKey].usedTimes--,ue.usedTimes===0&&w(y)),A.__cacheKey=W,A.__webglTexture=q[W].texture}return D}function it(A,y,D){return Math.floor(Math.floor(A/D)/y)}function tt(A,y,D,j){const W=A.updateRanges;if(W.length===0)t.texSubImage2D(r.TEXTURE_2D,0,0,0,y.width,y.height,D,j,y.data);else{W.sort((ee,ie)=>ee.start-ie.start);let ue=0;for(let ee=1;ee<W.length;ee++){const ie=W[ue],Se=W[ee],be=ie.start+ie.count,ge=it(Se.start,y.width,4),qe=it(ie.start,y.width,4);Se.start<=be+1&&ge===qe&&it(Se.start+Se.count-1,y.width,4)===ge?ie.count=Math.max(ie.count,Se.start+Se.count-ie.start):(++ue,W[ue]=Se)}W.length=ue+1;const re=r.getParameter(r.UNPACK_ROW_LENGTH),Ae=r.getParameter(r.UNPACK_SKIP_PIXELS),Fe=r.getParameter(r.UNPACK_SKIP_ROWS);r.pixelStorei(r.UNPACK_ROW_LENGTH,y.width);for(let ee=0,ie=W.length;ee<ie;ee++){const Se=W[ee],be=Math.floor(Se.start/4),ge=Math.ceil(Se.count/4),qe=be%y.width,I=Math.floor(be/y.width),oe=ge,ne=1;r.pixelStorei(r.UNPACK_SKIP_PIXELS,qe),r.pixelStorei(r.UNPACK_SKIP_ROWS,I),t.texSubImage2D(r.TEXTURE_2D,0,qe,I,oe,ne,D,j,y.data)}A.clearUpdateRanges(),r.pixelStorei(r.UNPACK_ROW_LENGTH,re),r.pixelStorei(r.UNPACK_SKIP_PIXELS,Ae),r.pixelStorei(r.UNPACK_SKIP_ROWS,Fe)}}function $(A,y,D){let j=r.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(j=r.TEXTURE_2D_ARRAY),y.isData3DTexture&&(j=r.TEXTURE_3D);const q=Be(A,y),W=y.source;t.bindTexture(j,A.__webglTexture,r.TEXTURE0+D);const ue=n.get(W);if(W.version!==ue.__version||q===!0){t.activeTexture(r.TEXTURE0+D);const re=Qe.getPrimaries(Qe.workingColorSpace),Ae=y.colorSpace===oi?null:Qe.getPrimaries(y.colorSpace),Fe=y.colorSpace===oi||re===Ae?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,y.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,y.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Fe);let ee=g(y.image,!1,i.maxTextureSize);ee=st(y,ee);const ie=s.convert(y.format,y.colorSpace),Se=s.convert(y.type);let be=S(y.internalFormat,ie,Se,y.colorSpace,y.isVideoTexture);le(j,y);let ge;const qe=y.mipmaps,I=y.isVideoTexture!==!0,oe=ue.__version===void 0||q===!0,ne=W.dataReady,ye=E(y,ee);if(y.isDepthTexture)be=M(y.format===yi,y.type),oe&&(I?t.texStorage2D(r.TEXTURE_2D,1,be,ee.width,ee.height):t.texImage2D(r.TEXTURE_2D,0,be,ee.width,ee.height,0,ie,Se,null));else if(y.isDataTexture)if(qe.length>0){I&&oe&&t.texStorage2D(r.TEXTURE_2D,ye,be,qe[0].width,qe[0].height);for(let te=0,K=qe.length;te<K;te++)ge=qe[te],I?ne&&t.texSubImage2D(r.TEXTURE_2D,te,0,0,ge.width,ge.height,ie,Se,ge.data):t.texImage2D(r.TEXTURE_2D,te,be,ge.width,ge.height,0,ie,Se,ge.data);y.generateMipmaps=!1}else I?(oe&&t.texStorage2D(r.TEXTURE_2D,ye,be,ee.width,ee.height),ne&&tt(y,ee,ie,Se)):t.texImage2D(r.TEXTURE_2D,0,be,ee.width,ee.height,0,ie,Se,ee.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){I&&oe&&t.texStorage3D(r.TEXTURE_2D_ARRAY,ye,be,qe[0].width,qe[0].height,ee.depth);for(let te=0,K=qe.length;te<K;te++)if(ge=qe[te],y.format!==rn)if(ie!==null)if(I){if(ne)if(y.layerUpdates.size>0){const we=hc(ge.width,ge.height,y.format,y.type);for(const He of y.layerUpdates){const pt=ge.data.subarray(He*we/ge.data.BYTES_PER_ELEMENT,(He+1)*we/ge.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,te,0,0,He,ge.width,ge.height,1,ie,pt)}y.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,te,0,0,0,ge.width,ge.height,ee.depth,ie,ge.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,te,be,ge.width,ge.height,ee.depth,0,ge.data,0,0);else Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else I?ne&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,te,0,0,0,ge.width,ge.height,ee.depth,ie,Se,ge.data):t.texImage3D(r.TEXTURE_2D_ARRAY,te,be,ge.width,ge.height,ee.depth,0,ie,Se,ge.data)}else{I&&oe&&t.texStorage2D(r.TEXTURE_2D,ye,be,qe[0].width,qe[0].height);for(let te=0,K=qe.length;te<K;te++)ge=qe[te],y.format!==rn?ie!==null?I?ne&&t.compressedTexSubImage2D(r.TEXTURE_2D,te,0,0,ge.width,ge.height,ie,ge.data):t.compressedTexImage2D(r.TEXTURE_2D,te,be,ge.width,ge.height,0,ge.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):I?ne&&t.texSubImage2D(r.TEXTURE_2D,te,0,0,ge.width,ge.height,ie,Se,ge.data):t.texImage2D(r.TEXTURE_2D,te,be,ge.width,ge.height,0,ie,Se,ge.data)}else if(y.isDataArrayTexture)if(I){if(oe&&t.texStorage3D(r.TEXTURE_2D_ARRAY,ye,be,ee.width,ee.height,ee.depth),ne)if(y.layerUpdates.size>0){const te=hc(ee.width,ee.height,y.format,y.type);for(const K of y.layerUpdates){const we=ee.data.subarray(K*te/ee.data.BYTES_PER_ELEMENT,(K+1)*te/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,K,ee.width,ee.height,1,ie,Se,we)}y.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,ie,Se,ee.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,be,ee.width,ee.height,ee.depth,0,ie,Se,ee.data);else if(y.isData3DTexture)I?(oe&&t.texStorage3D(r.TEXTURE_3D,ye,be,ee.width,ee.height,ee.depth),ne&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,ie,Se,ee.data)):t.texImage3D(r.TEXTURE_3D,0,be,ee.width,ee.height,ee.depth,0,ie,Se,ee.data);else if(y.isFramebufferTexture){if(oe)if(I)t.texStorage2D(r.TEXTURE_2D,ye,be,ee.width,ee.height);else{let te=ee.width,K=ee.height;for(let we=0;we<ye;we++)t.texImage2D(r.TEXTURE_2D,we,be,te,K,0,ie,Se,null),te>>=1,K>>=1}}else if(qe.length>0){if(I&&oe){const te=_e(qe[0]);t.texStorage2D(r.TEXTURE_2D,ye,be,te.width,te.height)}for(let te=0,K=qe.length;te<K;te++)ge=qe[te],I?ne&&t.texSubImage2D(r.TEXTURE_2D,te,0,0,ie,Se,ge):t.texImage2D(r.TEXTURE_2D,te,be,ie,Se,ge);y.generateMipmaps=!1}else if(I){if(oe){const te=_e(ee);t.texStorage2D(r.TEXTURE_2D,ye,be,te.width,te.height)}ne&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,ie,Se,ee)}else t.texImage2D(r.TEXTURE_2D,0,be,ie,Se,ee);m(y)&&p(j),ue.__version=W.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function se(A,y,D){if(y.image.length!==6)return;const j=Be(A,y),q=y.source;t.bindTexture(r.TEXTURE_CUBE_MAP,A.__webglTexture,r.TEXTURE0+D);const W=n.get(q);if(q.version!==W.__version||j===!0){t.activeTexture(r.TEXTURE0+D);const ue=Qe.getPrimaries(Qe.workingColorSpace),re=y.colorSpace===oi?null:Qe.getPrimaries(y.colorSpace),Ae=y.colorSpace===oi||ue===re?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,y.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,y.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae);const Fe=y.isCompressedTexture||y.image[0].isCompressedTexture,ee=y.image[0]&&y.image[0].isDataTexture,ie=[];for(let K=0;K<6;K++)!Fe&&!ee?ie[K]=g(y.image[K],!0,i.maxCubemapSize):ie[K]=ee?y.image[K].image:y.image[K],ie[K]=st(y,ie[K]);const Se=ie[0],be=s.convert(y.format,y.colorSpace),ge=s.convert(y.type),qe=S(y.internalFormat,be,ge,y.colorSpace),I=y.isVideoTexture!==!0,oe=W.__version===void 0||j===!0,ne=q.dataReady;let ye=E(y,Se);le(r.TEXTURE_CUBE_MAP,y);let te;if(Fe){I&&oe&&t.texStorage2D(r.TEXTURE_CUBE_MAP,ye,qe,Se.width,Se.height);for(let K=0;K<6;K++){te=ie[K].mipmaps;for(let we=0;we<te.length;we++){const He=te[we];y.format!==rn?be!==null?I?ne&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,we,0,0,He.width,He.height,be,He.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,we,qe,He.width,He.height,0,He.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?ne&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,we,0,0,He.width,He.height,be,ge,He.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,we,qe,He.width,He.height,0,be,ge,He.data)}}}else{if(te=y.mipmaps,I&&oe){te.length>0&&ye++;const K=_e(ie[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,ye,qe,K.width,K.height)}for(let K=0;K<6;K++)if(ee){I?ne&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,ie[K].width,ie[K].height,be,ge,ie[K].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,qe,ie[K].width,ie[K].height,0,be,ge,ie[K].data);for(let we=0;we<te.length;we++){const pt=te[we].image[K].image;I?ne&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,we+1,0,0,pt.width,pt.height,be,ge,pt.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,we+1,qe,pt.width,pt.height,0,be,ge,pt.data)}}else{I?ne&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,be,ge,ie[K]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,qe,be,ge,ie[K]);for(let we=0;we<te.length;we++){const He=te[we];I?ne&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,we+1,0,0,be,ge,He.image[K]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+K,we+1,qe,be,ge,He.image[K])}}}m(y)&&p(r.TEXTURE_CUBE_MAP),W.__version=q.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function ae(A,y,D,j,q,W){const ue=s.convert(D.format,D.colorSpace),re=s.convert(D.type),Ae=S(D.internalFormat,ue,re,D.colorSpace),Fe=n.get(y),ee=n.get(D);if(ee.__renderTarget=y,!Fe.__hasExternalTextures){const ie=Math.max(1,y.width>>W),Se=Math.max(1,y.height>>W);q===r.TEXTURE_3D||q===r.TEXTURE_2D_ARRAY?t.texImage3D(q,W,Ae,ie,Se,y.depth,0,ue,re,null):t.texImage2D(q,W,Ae,ie,Se,0,ue,re,null)}t.bindFramebuffer(r.FRAMEBUFFER,A),gt(y)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,j,q,ee.__webglTexture,0,P(y)):(q===r.TEXTURE_2D||q>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,j,q,ee.__webglTexture,W),t.bindFramebuffer(r.FRAMEBUFFER,null)}function ke(A,y,D){if(r.bindRenderbuffer(r.RENDERBUFFER,A),y.depthBuffer){const j=y.depthTexture,q=j&&j.isDepthTexture?j.type:null,W=M(y.stencilBuffer,q),ue=y.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;gt(y)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,P(y),W,y.width,y.height):D?r.renderbufferStorageMultisample(r.RENDERBUFFER,P(y),W,y.width,y.height):r.renderbufferStorage(r.RENDERBUFFER,W,y.width,y.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,ue,r.RENDERBUFFER,A)}else{const j=y.textures;for(let q=0;q<j.length;q++){const W=j[q],ue=s.convert(W.format,W.colorSpace),re=s.convert(W.type),Ae=S(W.internalFormat,ue,re,W.colorSpace);gt(y)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,P(y),Ae,y.width,y.height):D?r.renderbufferStorageMultisample(r.RENDERBUFFER,P(y),Ae,y.width,y.height):r.renderbufferStorage(r.RENDERBUFFER,Ae,y.width,y.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Re(A,y,D){const j=y.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(r.FRAMEBUFFER,A),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const q=n.get(y.depthTexture);if(q.__renderTarget=y,(!q.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),j){if(q.__webglInit===void 0&&(q.__webglInit=!0,y.depthTexture.addEventListener("dispose",T)),q.__webglTexture===void 0){q.__webglTexture=r.createTexture(),t.bindTexture(r.TEXTURE_CUBE_MAP,q.__webglTexture),le(r.TEXTURE_CUBE_MAP,y.depthTexture);const Fe=s.convert(y.depthTexture.format),ee=s.convert(y.depthTexture.type);let ie;y.depthTexture.format===jn?ie=r.DEPTH_COMPONENT24:y.depthTexture.format===yi&&(ie=r.DEPTH24_STENCIL8);for(let Se=0;Se<6;Se++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,ie,y.width,y.height,0,Fe,ee,null)}}else k(y.depthTexture,0);const W=q.__webglTexture,ue=P(y),re=j?r.TEXTURE_CUBE_MAP_POSITIVE_X+D:r.TEXTURE_2D,Ae=y.depthTexture.format===yi?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(y.depthTexture.format===jn)gt(y)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,Ae,re,W,0,ue):r.framebufferTexture2D(r.FRAMEBUFFER,Ae,re,W,0);else if(y.depthTexture.format===yi)gt(y)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,Ae,re,W,0,ue):r.framebufferTexture2D(r.FRAMEBUFFER,Ae,re,W,0);else throw new Error("Unknown depthTexture format")}function Z(A){const y=n.get(A),D=A.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==A.depthTexture){const j=A.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),j){const q=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,j.removeEventListener("dispose",q)};j.addEventListener("dispose",q),y.__depthDisposeCallback=q}y.__boundDepthTexture=j}if(A.depthTexture&&!y.__autoAllocateDepthBuffer)if(D)for(let j=0;j<6;j++)Re(y.__webglFramebuffer[j],A,j);else{const j=A.texture.mipmaps;j&&j.length>0?Re(y.__webglFramebuffer[0],A,0):Re(y.__webglFramebuffer,A,0)}else if(D){y.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(t.bindFramebuffer(r.FRAMEBUFFER,y.__webglFramebuffer[j]),y.__webglDepthbuffer[j]===void 0)y.__webglDepthbuffer[j]=r.createRenderbuffer(),ke(y.__webglDepthbuffer[j],A,!1);else{const q=A.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,W=y.__webglDepthbuffer[j];r.bindRenderbuffer(r.RENDERBUFFER,W),r.framebufferRenderbuffer(r.FRAMEBUFFER,q,r.RENDERBUFFER,W)}}else{const j=A.texture.mipmaps;if(j&&j.length>0?t.bindFramebuffer(r.FRAMEBUFFER,y.__webglFramebuffer[0]):t.bindFramebuffer(r.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=r.createRenderbuffer(),ke(y.__webglDepthbuffer,A,!1);else{const q=A.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,W=y.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,W),r.framebufferRenderbuffer(r.FRAMEBUFFER,q,r.RENDERBUFFER,W)}}t.bindFramebuffer(r.FRAMEBUFFER,null)}function Ue(A,y,D){const j=n.get(A);y!==void 0&&ae(j.__webglFramebuffer,A,A.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),D!==void 0&&Z(A)}function De(A){const y=A.texture,D=n.get(A),j=n.get(y);A.addEventListener("dispose",R);const q=A.textures,W=A.isWebGLCubeRenderTarget===!0,ue=q.length>1;if(ue||(j.__webglTexture===void 0&&(j.__webglTexture=r.createTexture()),j.__version=y.version,a.memory.textures++),W){D.__webglFramebuffer=[];for(let re=0;re<6;re++)if(y.mipmaps&&y.mipmaps.length>0){D.__webglFramebuffer[re]=[];for(let Ae=0;Ae<y.mipmaps.length;Ae++)D.__webglFramebuffer[re][Ae]=r.createFramebuffer()}else D.__webglFramebuffer[re]=r.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){D.__webglFramebuffer=[];for(let re=0;re<y.mipmaps.length;re++)D.__webglFramebuffer[re]=r.createFramebuffer()}else D.__webglFramebuffer=r.createFramebuffer();if(ue)for(let re=0,Ae=q.length;re<Ae;re++){const Fe=n.get(q[re]);Fe.__webglTexture===void 0&&(Fe.__webglTexture=r.createTexture(),a.memory.textures++)}if(A.samples>0&&gt(A)===!1){D.__webglMultisampledFramebuffer=r.createFramebuffer(),D.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,D.__webglMultisampledFramebuffer);for(let re=0;re<q.length;re++){const Ae=q[re];D.__webglColorRenderbuffer[re]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,D.__webglColorRenderbuffer[re]);const Fe=s.convert(Ae.format,Ae.colorSpace),ee=s.convert(Ae.type),ie=S(Ae.internalFormat,Fe,ee,Ae.colorSpace,A.isXRRenderTarget===!0),Se=P(A);r.renderbufferStorageMultisample(r.RENDERBUFFER,Se,ie,A.width,A.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+re,r.RENDERBUFFER,D.__webglColorRenderbuffer[re])}r.bindRenderbuffer(r.RENDERBUFFER,null),A.depthBuffer&&(D.__webglDepthRenderbuffer=r.createRenderbuffer(),ke(D.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(W){t.bindTexture(r.TEXTURE_CUBE_MAP,j.__webglTexture),le(r.TEXTURE_CUBE_MAP,y);for(let re=0;re<6;re++)if(y.mipmaps&&y.mipmaps.length>0)for(let Ae=0;Ae<y.mipmaps.length;Ae++)ae(D.__webglFramebuffer[re][Ae],A,y,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ae);else ae(D.__webglFramebuffer[re],A,y,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+re,0);m(y)&&p(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ue){for(let re=0,Ae=q.length;re<Ae;re++){const Fe=q[re],ee=n.get(Fe);let ie=r.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ie=A.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(ie,ee.__webglTexture),le(ie,Fe),ae(D.__webglFramebuffer,A,Fe,r.COLOR_ATTACHMENT0+re,ie,0),m(Fe)&&p(ie)}t.unbindTexture()}else{let re=r.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(re=A.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(re,j.__webglTexture),le(re,y),y.mipmaps&&y.mipmaps.length>0)for(let Ae=0;Ae<y.mipmaps.length;Ae++)ae(D.__webglFramebuffer[Ae],A,y,r.COLOR_ATTACHMENT0,re,Ae);else ae(D.__webglFramebuffer,A,y,r.COLOR_ATTACHMENT0,re,0);m(y)&&p(re),t.unbindTexture()}A.depthBuffer&&Z(A)}function ce(A){const y=A.textures;for(let D=0,j=y.length;D<j;D++){const q=y[D];if(m(q)){const W=_(A),ue=n.get(q).__webglTexture;t.bindTexture(W,ue),p(W),t.unbindTexture()}}}const Me=[],me=[];function ze(A){if(A.samples>0){if(gt(A)===!1){const y=A.textures,D=A.width,j=A.height;let q=r.COLOR_BUFFER_BIT;const W=A.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ue=n.get(A),re=y.length>1;if(re)for(let Fe=0;Fe<y.length;Fe++)t.bindFramebuffer(r.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Fe,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,ue.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Fe,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,ue.__webglMultisampledFramebuffer);const Ae=A.texture.mipmaps;Ae&&Ae.length>0?t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ue.__webglFramebuffer[0]):t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ue.__webglFramebuffer);for(let Fe=0;Fe<y.length;Fe++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(q|=r.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(q|=r.STENCIL_BUFFER_BIT)),re){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,ue.__webglColorRenderbuffer[Fe]);const ee=n.get(y[Fe]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,ee,0)}r.blitFramebuffer(0,0,D,j,0,0,D,j,q,r.NEAREST),c===!0&&(Me.length=0,me.length=0,Me.push(r.COLOR_ATTACHMENT0+Fe),A.depthBuffer&&A.resolveDepthBuffer===!1&&(Me.push(W),me.push(W),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,me)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,Me))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),re)for(let Fe=0;Fe<y.length;Fe++){t.bindFramebuffer(r.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Fe,r.RENDERBUFFER,ue.__webglColorRenderbuffer[Fe]);const ee=n.get(y[Fe]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,ue.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Fe,r.TEXTURE_2D,ee,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ue.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&c){const y=A.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[y])}}}function P(A){return Math.min(i.maxSamples,A.samples)}function gt(A){const y=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function Ze(A){const y=a.render.frame;h.get(A)!==y&&(h.set(A,y),A.update())}function st(A,y){const D=A.colorSpace,j=A.format,q=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||D!==Yt&&D!==oi&&(Qe.getTransfer(D)===at?(j!==rn||q!==Jt)&&Ie("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Oe("WebGLTextures: Unsupported texture color space:",D)),y}function _e(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(l.width=A.naturalWidth||A.width,l.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(l.width=A.displayWidth,l.height=A.displayHeight):(l.width=A.width,l.height=A.height),l}this.allocateTextureUnit=F,this.resetTextureUnits=N,this.setTexture2D=k,this.setTexture2DArray=O,this.setTexture3D=H,this.setTextureCube=J,this.rebindTextures=Ue,this.setupRenderTarget=De,this.updateRenderTargetMipmap=ce,this.updateMultisampleRenderTarget=ze,this.setupDepthRenderbuffer=Z,this.setupFrameBufferTexture=ae,this.useMultisampledRTT=gt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function J0(r,e){function t(n,i=oi){let s;const a=Qe.getTransfer(i);if(n===Jt)return r.UNSIGNED_BYTE;if(n===Oo)return r.UNSIGNED_SHORT_4_4_4_4;if(n===Bo)return r.UNSIGNED_SHORT_5_5_5_1;if(n===dh)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===uh)return r.UNSIGNED_INT_10F_11F_11F_REV;if(n===ch)return r.BYTE;if(n===hh)return r.SHORT;if(n===ws)return r.UNSIGNED_SHORT;if(n===Fo)return r.INT;if(n===Pn)return r.UNSIGNED_INT;if(n===sn)return r.FLOAT;if(n===Yn)return r.HALF_FLOAT;if(n===fh)return r.ALPHA;if(n===ph)return r.RGB;if(n===rn)return r.RGBA;if(n===jn)return r.DEPTH_COMPONENT;if(n===yi)return r.DEPTH_STENCIL;if(n===ko)return r.RED;if(n===zo)return r.RED_INTEGER;if(n===Ki)return r.RG;if(n===Ho)return r.RG_INTEGER;if(n===Vo)return r.RGBA_INTEGER;if(n===mr||n===gr||n===xr||n===_r)if(a===at)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===mr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===gr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===xr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===_r)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===mr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===gr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===xr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===_r)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===za||n===Ha||n===Va||n===Ga)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===za)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ha)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Va)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ga)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Wa||n===Xa||n===qa||n===Ka||n===Ya||n===ja||n===$a)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Wa||n===Xa)return a===at?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===qa)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===Ka)return s.COMPRESSED_R11_EAC;if(n===Ya)return s.COMPRESSED_SIGNED_R11_EAC;if(n===ja)return s.COMPRESSED_RG11_EAC;if(n===$a)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Za||n===Ja||n===Qa||n===eo||n===to||n===no||n===io||n===so||n===ro||n===ao||n===oo||n===lo||n===co||n===ho)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Za)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ja)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Qa)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===eo)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===to)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===no)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===io)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===so)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ro)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ao)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===oo)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===lo)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===co)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ho)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===uo||n===fo||n===po)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===uo)return a===at?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===fo)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===po)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===mo||n===go||n===xo||n===_o)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===mo)return s.COMPRESSED_RED_RGTC1_EXT;if(n===go)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===xo)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===_o)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ts?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}const Q0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ex=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class tx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Eh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Ln({vertexShader:Q0,fragmentShader:ex,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Y(new $n(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class nx extends Qi{constructor(e,t){super();const n=this;let i=null,s=1,a=null,o="local-floor",c=1,l=null,h=null,d=null,u=null,f=null,x=null;const g=typeof XRWebGLBinding<"u",m=new tx,p={},_=t.getContextAttributes();let S=null,M=null;const E=[],T=[],R=new Xe;let v=null;const w=new qt;w.viewport=new _t;const B=new qt;B.viewport=new _t;const C=[w,B],N=new sf;let F=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let se=E[$];return se===void 0&&(se=new Yr,E[$]=se),se.getTargetRaySpace()},this.getControllerGrip=function($){let se=E[$];return se===void 0&&(se=new Yr,E[$]=se),se.getGripSpace()},this.getHand=function($){let se=E[$];return se===void 0&&(se=new Yr,E[$]=se),se.getHandSpace()};function k($){const se=T.indexOf($.inputSource);if(se===-1)return;const ae=E[se];ae!==void 0&&(ae.update($.inputSource,$.frame,l||a),ae.dispatchEvent({type:$.type,data:$.inputSource}))}function O(){i.removeEventListener("select",k),i.removeEventListener("selectstart",k),i.removeEventListener("selectend",k),i.removeEventListener("squeeze",k),i.removeEventListener("squeezestart",k),i.removeEventListener("squeezeend",k),i.removeEventListener("end",O),i.removeEventListener("inputsourceschange",H);for(let $=0;$<E.length;$++){const se=T[$];se!==null&&(T[$]=null,E[$].disconnect(se))}F=null,z=null,m.reset();for(const $ in p)delete p[$];e.setRenderTarget(S),f=null,u=null,d=null,i=null,M=null,tt.stop(),n.isPresenting=!1,e.setPixelRatio(v),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){s=$,n.isPresenting===!0&&Ie("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&Ie("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function($){l=$},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&g&&(d=new XRWebGLBinding(i,t)),d},this.getFrame=function(){return x},this.getSession=function(){return i},this.setSession=async function($){if(i=$,i!==null){if(S=e.getRenderTarget(),i.addEventListener("select",k),i.addEventListener("selectstart",k),i.addEventListener("selectend",k),i.addEventListener("squeeze",k),i.addEventListener("squeezestart",k),i.addEventListener("squeezeend",k),i.addEventListener("end",O),i.addEventListener("inputsourceschange",H),_.xrCompatible!==!0&&await t.makeXRCompatible(),v=e.getPixelRatio(),e.getSize(R),g&&"createProjectionLayer"in XRWebGLBinding.prototype){let ae=null,ke=null,Re=null;_.depth&&(Re=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ae=_.stencil?yi:jn,ke=_.stencil?Ts:Pn);const Z={colorFormat:t.RGBA8,depthFormat:Re,scaleFactor:s};d=this.getBinding(),u=d.createProjectionLayer(Z),i.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),M=new Rn(u.textureWidth,u.textureHeight,{format:rn,type:Jt,depthTexture:new Ps(u.textureWidth,u.textureHeight,ke,void 0,void 0,void 0,void 0,void 0,void 0,ae),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const ae={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(i,t,ae),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new Rn(f.framebufferWidth,f.framebufferHeight,{format:rn,type:Jt,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await i.requestReferenceSpace(o),tt.setContext(i),tt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function H($){for(let se=0;se<$.removed.length;se++){const ae=$.removed[se],ke=T.indexOf(ae);ke>=0&&(T[ke]=null,E[ke].disconnect(ae))}for(let se=0;se<$.added.length;se++){const ae=$.added[se];let ke=T.indexOf(ae);if(ke===-1){for(let Z=0;Z<E.length;Z++)if(Z>=T.length){T.push(ae),ke=Z;break}else if(T[Z]===null){T[Z]=ae,ke=Z;break}if(ke===-1)break}const Re=E[ke];Re&&Re.connect(ae)}}const J=new L,Q=new L;function he($,se,ae){J.setFromMatrixPosition(se.matrixWorld),Q.setFromMatrixPosition(ae.matrixWorld);const ke=J.distanceTo(Q),Re=se.projectionMatrix.elements,Z=ae.projectionMatrix.elements,Ue=Re[14]/(Re[10]-1),De=Re[14]/(Re[10]+1),ce=(Re[9]+1)/Re[5],Me=(Re[9]-1)/Re[5],me=(Re[8]-1)/Re[0],ze=(Z[8]+1)/Z[0],P=Ue*me,gt=Ue*ze,Ze=ke/(-me+ze),st=Ze*-me;if(se.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(st),$.translateZ(Ze),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Re[10]===-1)$.projectionMatrix.copy(se.projectionMatrix),$.projectionMatrixInverse.copy(se.projectionMatrixInverse);else{const _e=Ue+Ze,A=De+Ze,y=P-st,D=gt+(ke-st),j=ce*De/A*_e,q=Me*De/A*_e;$.projectionMatrix.makePerspective(y,D,j,q,_e,A),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function xe($,se){se===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(se.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(i===null)return;let se=$.near,ae=$.far;m.texture!==null&&(m.depthNear>0&&(se=m.depthNear),m.depthFar>0&&(ae=m.depthFar)),N.near=B.near=w.near=se,N.far=B.far=w.far=ae,(F!==N.near||z!==N.far)&&(i.updateRenderState({depthNear:N.near,depthFar:N.far}),F=N.near,z=N.far),N.layers.mask=$.layers.mask|6,w.layers.mask=N.layers.mask&-5,B.layers.mask=N.layers.mask&-3;const ke=$.parent,Re=N.cameras;xe(N,ke);for(let Z=0;Z<Re.length;Z++)xe(Re[Z],ke);Re.length===2?he(N,w,B):N.projectionMatrix.copy(w.projectionMatrix),le($,N,ke)};function le($,se,ae){ae===null?$.matrix.copy(se.matrixWorld):($.matrix.copy(ae.matrixWorld),$.matrix.invert(),$.matrix.multiply(se.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(se.projectionMatrix),$.projectionMatrixInverse.copy(se.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Yi*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(u===null&&f===null))return c},this.setFoveation=function($){c=$,u!==null&&(u.fixedFoveation=$),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=$)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(N)},this.getCameraTexture=function($){return p[$]};let Be=null;function it($,se){if(h=se.getViewerPose(l||a),x=se,h!==null){const ae=h.views;f!==null&&(e.setRenderTargetFramebuffer(M,f.framebuffer),e.setRenderTarget(M));let ke=!1;ae.length!==N.cameras.length&&(N.cameras.length=0,ke=!0);for(let De=0;De<ae.length;De++){const ce=ae[De];let Me=null;if(f!==null)Me=f.getViewport(ce);else{const ze=d.getViewSubImage(u,ce);Me=ze.viewport,De===0&&(e.setRenderTargetTextures(M,ze.colorTexture,ze.depthStencilTexture),e.setRenderTarget(M))}let me=C[De];me===void 0&&(me=new qt,me.layers.enable(De),me.viewport=new _t,C[De]=me),me.matrix.fromArray(ce.transform.matrix),me.matrix.decompose(me.position,me.quaternion,me.scale),me.projectionMatrix.fromArray(ce.projectionMatrix),me.projectionMatrixInverse.copy(me.projectionMatrix).invert(),me.viewport.set(Me.x,Me.y,Me.width,Me.height),De===0&&(N.matrix.copy(me.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),ke===!0&&N.cameras.push(me)}const Re=i.enabledFeatures;if(Re&&Re.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&g){d=n.getBinding();const De=d.getDepthInformation(ae[0]);De&&De.isValid&&De.texture&&m.init(De,i.renderState)}if(Re&&Re.includes("camera-access")&&g){e.state.unbindTexture(),d=n.getBinding();for(let De=0;De<ae.length;De++){const ce=ae[De].camera;if(ce){let Me=p[ce];Me||(Me=new Eh,p[ce]=Me);const me=d.getCameraImage(ce);Me.sourceTexture=me}}}}for(let ae=0;ae<E.length;ae++){const ke=T[ae],Re=E[ae];ke!==null&&Re!==void 0&&Re.update(ke,se,l||a)}Be&&Be($,se),se.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:se}),x=null}const tt=new Dh;tt.setAnimationLoop(it),this.setAnimationLoop=function($){Be=$},this.dispose=function(){}}}const gi=new on,ix=new Ve;function sx(r,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Ah(r)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,_,S,M){p.isMeshBasicMaterial?s(m,p):p.isMeshLambertMaterial?(s(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(s(m,p),d(m,p)):p.isMeshPhongMaterial?(s(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(s(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,M)):p.isMeshMatcapMaterial?(s(m,p),x(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),g(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,_,S):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Vt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Vt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const _=e.get(p),S=_.envMap,M=_.envMapRotation;S&&(m.envMap.value=S,gi.copy(M),gi.x*=-1,gi.y*=-1,gi.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(gi.y*=-1,gi.z*=-1),m.envMapRotation.value.setFromMatrix4(ix.makeRotationFromEuler(gi)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,_,S){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*_,m.scale.value=S*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,_){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Vt&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function x(m,p){p.matcap&&(m.matcap.value=p.matcap)}function g(m,p){const _=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function rx(r,e,t,n){let i={},s={},a=[];const o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,S){const M=S.program;n.uniformBlockBinding(_,M)}function l(_,S){let M=i[_.id];M===void 0&&(x(_),M=h(_),i[_.id]=M,_.addEventListener("dispose",m));const E=S.program;n.updateUBOMapping(_,E);const T=e.render.frame;s[_.id]!==T&&(u(_),s[_.id]=T)}function h(_){const S=d();_.__bindingPointIndex=S;const M=r.createBuffer(),E=_.__size,T=_.usage;return r.bindBuffer(r.UNIFORM_BUFFER,M),r.bufferData(r.UNIFORM_BUFFER,E,T),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,S,M),M}function d(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return Oe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(_){const S=i[_.id],M=_.uniforms,E=_.__cache;r.bindBuffer(r.UNIFORM_BUFFER,S);for(let T=0,R=M.length;T<R;T++){const v=Array.isArray(M[T])?M[T]:[M[T]];for(let w=0,B=v.length;w<B;w++){const C=v[w];if(f(C,T,w,E)===!0){const N=C.__offset,F=Array.isArray(C.value)?C.value:[C.value];let z=0;for(let k=0;k<F.length;k++){const O=F[k],H=g(O);typeof O=="number"||typeof O=="boolean"?(C.__data[0]=O,r.bufferSubData(r.UNIFORM_BUFFER,N+z,C.__data)):O.isMatrix3?(C.__data[0]=O.elements[0],C.__data[1]=O.elements[1],C.__data[2]=O.elements[2],C.__data[3]=0,C.__data[4]=O.elements[3],C.__data[5]=O.elements[4],C.__data[6]=O.elements[5],C.__data[7]=0,C.__data[8]=O.elements[6],C.__data[9]=O.elements[7],C.__data[10]=O.elements[8],C.__data[11]=0):(O.toArray(C.__data,z),z+=H.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,N,C.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function f(_,S,M,E){const T=_.value,R=S+"_"+M;if(E[R]===void 0)return typeof T=="number"||typeof T=="boolean"?E[R]=T:E[R]=T.clone(),!0;{const v=E[R];if(typeof T=="number"||typeof T=="boolean"){if(v!==T)return E[R]=T,!0}else if(v.equals(T)===!1)return v.copy(T),!0}return!1}function x(_){const S=_.uniforms;let M=0;const E=16;for(let R=0,v=S.length;R<v;R++){const w=Array.isArray(S[R])?S[R]:[S[R]];for(let B=0,C=w.length;B<C;B++){const N=w[B],F=Array.isArray(N.value)?N.value:[N.value];for(let z=0,k=F.length;z<k;z++){const O=F[z],H=g(O),J=M%E,Q=J%H.boundary,he=J+Q;M+=Q,he!==0&&E-he<H.storage&&(M+=E-he),N.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=M,M+=H.storage}}}const T=M%E;return T>0&&(M+=E-T),_.__size=M,_.__cache={},this}function g(_){const S={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(S.boundary=4,S.storage=4):_.isVector2?(S.boundary=8,S.storage=8):_.isVector3||_.isColor?(S.boundary=16,S.storage=12):_.isVector4?(S.boundary=16,S.storage=16):_.isMatrix3?(S.boundary=48,S.storage=48):_.isMatrix4?(S.boundary=64,S.storage=64):_.isTexture?Ie("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Ie("WebGLRenderer: Unsupported uniform value type.",_),S}function m(_){const S=_.target;S.removeEventListener("dispose",m);const M=a.indexOf(S.__bindingPointIndex);a.splice(M,1),r.deleteBuffer(i[S.id]),delete i[S.id],delete s[S.id]}function p(){for(const _ in i)r.deleteBuffer(i[_]);a=[],i={},s={}}return{bind:c,update:l,dispose:p}}const ax=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Sn=null;function ox(){return Sn===null&&(Sn=new Zo(ax,16,16,Ki,Yn),Sn.name="DFG_LUT",Sn.minFilter=Rt,Sn.magFilter=Rt,Sn.wrapS=Tn,Sn.wrapT=Tn,Sn.generateMipmaps=!1,Sn.needsUpdate=!0),Sn}class lx{constructor(e={}){const{canvas:t=Dd(),context:n=null,depth:i=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=Jt}=e;this.isWebGLRenderer=!0;let x;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");x=n.getContextAttributes().alpha}else x=a;const g=f,m=new Set([Vo,Ho,zo]),p=new Set([Jt,Pn,ws,Ts,Oo,Bo]),_=new Uint32Array(4),S=new Int32Array(4);let M=null,E=null;const T=[],R=[];let v=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=An,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const w=this;let B=!1;this._outputColorSpace=Et;let C=0,N=0,F=null,z=-1,k=null;const O=new _t,H=new _t;let J=null;const Q=new Ne(0);let he=0,xe=t.width,le=t.height,Be=1,it=null,tt=null;const $=new _t(0,0,xe,le),se=new _t(0,0,xe,le);let ae=!1;const ke=new el;let Re=!1,Z=!1;const Ue=new Ve,De=new L,ce=new _t,Me={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let me=!1;function ze(){return F===null?Be:1}let P=n;function gt(b,U){return t.getContext(b,U)}try{const b={alpha:!0,depth:i,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Do}`),t.addEventListener("webglcontextlost",we,!1),t.addEventListener("webglcontextrestored",He,!1),t.addEventListener("webglcontextcreationerror",pt,!1),P===null){const U="webgl2";if(P=gt(U,b),P===null)throw gt(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw Oe("WebGLRenderer: "+b.message),b}let Ze,st,_e,A,y,D,j,q,W,ue,re,Ae,Fe,ee,ie,Se,be,ge,qe,I,oe,ne,ye;function te(){Ze=new lg(P),Ze.init(),oe=new J0(P,Ze),st=new eg(P,Ze,e,oe),_e=new $0(P,Ze),st.reversedDepthBuffer&&u&&_e.buffers.depth.setReversed(!0),A=new dg(P),y=new F0,D=new Z0(P,Ze,_e,y,st,oe,A),j=new og(w),q=new gf(P),ne=new Jm(P,q),W=new cg(P,q,A,ne),ue=new fg(P,W,q,ne,A),ge=new ug(P,st,D),ie=new tg(y),re=new U0(w,j,Ze,st,ne,ie),Ae=new sx(w,y),Fe=new B0,ee=new W0(Ze),be=new Zm(w,j,_e,ue,x,c),Se=new j0(w,ue,st),ye=new rx(P,A,st,_e),qe=new Qm(P,Ze,A),I=new hg(P,Ze,A),A.programs=re.programs,w.capabilities=st,w.extensions=Ze,w.properties=y,w.renderLists=Fe,w.shadowMap=Se,w.state=_e,w.info=A}te(),g!==Jt&&(v=new mg(g,t.width,t.height,i,s));const K=new nx(w,P);this.xr=K,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const b=Ze.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=Ze.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return Be},this.setPixelRatio=function(b){b!==void 0&&(Be=b,this.setSize(xe,le,!1))},this.getSize=function(b){return b.set(xe,le)},this.setSize=function(b,U,X=!0){if(K.isPresenting){Ie("WebGLRenderer: Can't change size while VR device is presenting.");return}xe=b,le=U,t.width=Math.floor(b*Be),t.height=Math.floor(U*Be),X===!0&&(t.style.width=b+"px",t.style.height=U+"px"),v!==null&&v.setSize(t.width,t.height),this.setViewport(0,0,b,U)},this.getDrawingBufferSize=function(b){return b.set(xe*Be,le*Be).floor()},this.setDrawingBufferSize=function(b,U,X){xe=b,le=U,Be=X,t.width=Math.floor(b*X),t.height=Math.floor(U*X),this.setViewport(0,0,b,U)},this.setEffects=function(b){if(g===Jt){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let U=0;U<b.length;U++)if(b[U].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}v.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(O)},this.getViewport=function(b){return b.copy($)},this.setViewport=function(b,U,X,G){b.isVector4?$.set(b.x,b.y,b.z,b.w):$.set(b,U,X,G),_e.viewport(O.copy($).multiplyScalar(Be).round())},this.getScissor=function(b){return b.copy(se)},this.setScissor=function(b,U,X,G){b.isVector4?se.set(b.x,b.y,b.z,b.w):se.set(b,U,X,G),_e.scissor(H.copy(se).multiplyScalar(Be).round())},this.getScissorTest=function(){return ae},this.setScissorTest=function(b){_e.setScissorTest(ae=b)},this.setOpaqueSort=function(b){it=b},this.setTransparentSort=function(b){tt=b},this.getClearColor=function(b){return b.copy(be.getClearColor())},this.setClearColor=function(){be.setClearColor(...arguments)},this.getClearAlpha=function(){return be.getClearAlpha()},this.setClearAlpha=function(){be.setClearAlpha(...arguments)},this.clear=function(b=!0,U=!0,X=!0){let G=0;if(b){let V=!1;if(F!==null){const fe=F.texture.format;V=m.has(fe)}if(V){const fe=F.texture.type,ve=p.has(fe),pe=be.getClearColor(),Te=be.getClearAlpha(),Ce=pe.r,Ge=pe.g,Ye=pe.b;ve?(_[0]=Ce,_[1]=Ge,_[2]=Ye,_[3]=Te,P.clearBufferuiv(P.COLOR,0,_)):(S[0]=Ce,S[1]=Ge,S[2]=Ye,S[3]=Te,P.clearBufferiv(P.COLOR,0,S))}else G|=P.COLOR_BUFFER_BIT}U&&(G|=P.DEPTH_BUFFER_BIT),X&&(G|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&P.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",we,!1),t.removeEventListener("webglcontextrestored",He,!1),t.removeEventListener("webglcontextcreationerror",pt,!1),be.dispose(),Fe.dispose(),ee.dispose(),y.dispose(),j.dispose(),ue.dispose(),ne.dispose(),ye.dispose(),re.dispose(),K.dispose(),K.removeEventListener("sessionstart",ol),K.removeEventListener("sessionend",ll),ci.stop()};function we(b){b.preventDefault(),wr("WebGLRenderer: Context Lost."),B=!0}function He(){wr("WebGLRenderer: Context Restored."),B=!1;const b=A.autoReset,U=Se.enabled,X=Se.autoUpdate,G=Se.needsUpdate,V=Se.type;te(),A.autoReset=b,Se.enabled=U,Se.autoUpdate=X,Se.needsUpdate=G,Se.type=V}function pt(b){Oe("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function rt(b){const U=b.target;U.removeEventListener("dispose",rt),Nn(U)}function Nn(b){Un(b),y.remove(b)}function Un(b){const U=y.get(b).programs;U!==void 0&&(U.forEach(function(X){re.releaseProgram(X)}),b.isShaderMaterial&&re.releaseShaderCache(b))}this.renderBufferDirect=function(b,U,X,G,V,fe){U===null&&(U=Me);const ve=V.isMesh&&V.matrixWorld.determinant()<0,pe=Xh(b,U,X,G,V);_e.setMaterial(G,ve);let Te=X.index,Ce=1;if(G.wireframe===!0){if(Te=W.getWireframeAttribute(X),Te===void 0)return;Ce=2}const Ge=X.drawRange,Ye=X.attributes.position;let Le=Ge.start*Ce,ct=(Ge.start+Ge.count)*Ce;fe!==null&&(Le=Math.max(Le,fe.start*Ce),ct=Math.min(ct,(fe.start+fe.count)*Ce)),Te!==null?(Le=Math.max(Le,0),ct=Math.min(ct,Te.count)):Ye!=null&&(Le=Math.max(Le,0),ct=Math.min(ct,Ye.count));const Mt=ct-Le;if(Mt<0||Mt===1/0)return;ne.setup(V,G,pe,X,Te);let yt,ht=qe;if(Te!==null&&(yt=q.get(Te),ht=I,ht.setIndex(yt)),V.isMesh)G.wireframe===!0?(_e.setLineWidth(G.wireframeLinewidth*ze()),ht.setMode(P.LINES)):ht.setMode(P.TRIANGLES);else if(V.isLine){let Bt=G.linewidth;Bt===void 0&&(Bt=1),_e.setLineWidth(Bt*ze()),V.isLineSegments?ht.setMode(P.LINES):V.isLineLoop?ht.setMode(P.LINE_LOOP):ht.setMode(P.LINE_STRIP)}else V.isPoints?ht.setMode(P.POINTS):V.isSprite&&ht.setMode(P.TRIANGLES);if(V.isBatchedMesh)if(V._multiDrawInstances!==null)Tr("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ht.renderMultiDrawInstances(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount,V._multiDrawInstances);else if(Ze.get("WEBGL_multi_draw"))ht.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const Bt=V._multiDrawStarts,Ee=V._multiDrawCounts,jt=V._multiDrawCount,et=Te?q.get(Te).bytesPerElement:1,ln=y.get(G).currentProgram.getUniforms();for(let yn=0;yn<jt;yn++)ln.setValue(P,"_gl_DrawID",yn),ht.render(Bt[yn]/et,Ee[yn])}else if(V.isInstancedMesh)ht.renderInstances(Le,Mt,V.count);else if(X.isInstancedBufferGeometry){const Bt=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Ee=Math.min(X.instanceCount,Bt);ht.renderInstances(Le,Mt,Ee)}else ht.render(Le,Mt)};function al(b,U,X){b.transparent===!0&&b.side===Ht&&b.forceSinglePass===!1?(b.side=Vt,b.needsUpdate=!0,Fs(b,U,X),b.side=Kn,b.needsUpdate=!0,Fs(b,U,X),b.side=Ht):Fs(b,U,X)}this.compile=function(b,U,X=null){X===null&&(X=b),E=ee.get(X),E.init(U),R.push(E),X.traverseVisible(function(V){V.isLight&&V.layers.test(U.layers)&&(E.pushLight(V),V.castShadow&&E.pushShadow(V))}),b!==X&&b.traverseVisible(function(V){V.isLight&&V.layers.test(U.layers)&&(E.pushLight(V),V.castShadow&&E.pushShadow(V))}),E.setupLights();const G=new Set;return b.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const fe=V.material;if(fe)if(Array.isArray(fe))for(let ve=0;ve<fe.length;ve++){const pe=fe[ve];al(pe,X,V),G.add(pe)}else al(fe,X,V),G.add(fe)}),E=R.pop(),G},this.compileAsync=function(b,U,X=null){const G=this.compile(b,U,X);return new Promise(V=>{function fe(){if(G.forEach(function(ve){y.get(ve).currentProgram.isReady()&&G.delete(ve)}),G.size===0){V(b);return}setTimeout(fe,10)}Ze.get("KHR_parallel_shader_compile")!==null?fe():setTimeout(fe,10)})};let Br=null;function Wh(b){Br&&Br(b)}function ol(){ci.stop()}function ll(){ci.start()}const ci=new Dh;ci.setAnimationLoop(Wh),typeof self<"u"&&ci.setContext(self),this.setAnimationLoop=function(b){Br=b,K.setAnimationLoop(b),b===null?ci.stop():ci.start()},K.addEventListener("sessionstart",ol),K.addEventListener("sessionend",ll),this.render=function(b,U){if(U!==void 0&&U.isCamera!==!0){Oe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(B===!0)return;const X=K.enabled===!0&&K.isPresenting===!0,G=v!==null&&(F===null||X)&&v.begin(w,F);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),K.enabled===!0&&K.isPresenting===!0&&(v===null||v.isCompositing()===!1)&&(K.cameraAutoUpdate===!0&&K.updateCamera(U),U=K.getCamera()),b.isScene===!0&&b.onBeforeRender(w,b,U,F),E=ee.get(b,R.length),E.init(U),R.push(E),Ue.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),ke.setFromProjectionMatrix(Ue,En,U.reversedDepth),Z=this.localClippingEnabled,Re=ie.init(this.clippingPlanes,Z),M=Fe.get(b,T.length),M.init(),T.push(M),K.enabled===!0&&K.isPresenting===!0){const ve=w.xr.getDepthSensingMesh();ve!==null&&kr(ve,U,-1/0,w.sortObjects)}kr(b,U,0,w.sortObjects),M.finish(),w.sortObjects===!0&&M.sort(it,tt),me=K.enabled===!1||K.isPresenting===!1||K.hasDepthSensing()===!1,me&&be.addToRenderList(M,b),this.info.render.frame++,Re===!0&&ie.beginShadows();const V=E.state.shadowsArray;if(Se.render(V,b,U),Re===!0&&ie.endShadows(),this.info.autoReset===!0&&this.info.reset(),(G&&v.hasRenderPass())===!1){const ve=M.opaque,pe=M.transmissive;if(E.setupLights(),U.isArrayCamera){const Te=U.cameras;if(pe.length>0)for(let Ce=0,Ge=Te.length;Ce<Ge;Ce++){const Ye=Te[Ce];hl(ve,pe,b,Ye)}me&&be.render(b);for(let Ce=0,Ge=Te.length;Ce<Ge;Ce++){const Ye=Te[Ce];cl(M,b,Ye,Ye.viewport)}}else pe.length>0&&hl(ve,pe,b,U),me&&be.render(b),cl(M,b,U)}F!==null&&N===0&&(D.updateMultisampleRenderTarget(F),D.updateRenderTargetMipmap(F)),G&&v.end(w),b.isScene===!0&&b.onAfterRender(w,b,U),ne.resetDefaultState(),z=-1,k=null,R.pop(),R.length>0?(E=R[R.length-1],Re===!0&&ie.setGlobalState(w.clippingPlanes,E.state.camera)):E=null,T.pop(),T.length>0?M=T[T.length-1]:M=null};function kr(b,U,X,G){if(b.visible===!1)return;if(b.layers.test(U.layers)){if(b.isGroup)X=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(U);else if(b.isLight)E.pushLight(b),b.castShadow&&E.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||ke.intersectsSprite(b)){G&&ce.setFromMatrixPosition(b.matrixWorld).applyMatrix4(Ue);const ve=ue.update(b),pe=b.material;pe.visible&&M.push(b,ve,pe,X,ce.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||ke.intersectsObject(b))){const ve=ue.update(b),pe=b.material;if(G&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),ce.copy(b.boundingSphere.center)):(ve.boundingSphere===null&&ve.computeBoundingSphere(),ce.copy(ve.boundingSphere.center)),ce.applyMatrix4(b.matrixWorld).applyMatrix4(Ue)),Array.isArray(pe)){const Te=ve.groups;for(let Ce=0,Ge=Te.length;Ce<Ge;Ce++){const Ye=Te[Ce],Le=pe[Ye.materialIndex];Le&&Le.visible&&M.push(b,ve,Le,X,ce.z,Ye)}}else pe.visible&&M.push(b,ve,pe,X,ce.z,null)}}const fe=b.children;for(let ve=0,pe=fe.length;ve<pe;ve++)kr(fe[ve],U,X,G)}function cl(b,U,X,G){const{opaque:V,transmissive:fe,transparent:ve}=b;E.setupLightsView(X),Re===!0&&ie.setGlobalState(w.clippingPlanes,X),G&&_e.viewport(O.copy(G)),V.length>0&&Us(V,U,X),fe.length>0&&Us(fe,U,X),ve.length>0&&Us(ve,U,X),_e.buffers.depth.setTest(!0),_e.buffers.depth.setMask(!0),_e.buffers.color.setMask(!0),_e.setPolygonOffset(!1)}function hl(b,U,X,G){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[G.id]===void 0){const Le=Ze.has("EXT_color_buffer_half_float")||Ze.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[G.id]=new Rn(1,1,{generateMipmaps:!0,type:Le?Yn:Jt,minFilter:Gn,samples:Math.max(4,st.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qe.workingColorSpace})}const fe=E.state.transmissionRenderTarget[G.id],ve=G.viewport||O;fe.setSize(ve.z*w.transmissionResolutionScale,ve.w*w.transmissionResolutionScale);const pe=w.getRenderTarget(),Te=w.getActiveCubeFace(),Ce=w.getActiveMipmapLevel();w.setRenderTarget(fe),w.getClearColor(Q),he=w.getClearAlpha(),he<1&&w.setClearColor(16777215,.5),w.clear(),me&&be.render(X);const Ge=w.toneMapping;w.toneMapping=An;const Ye=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),E.setupLightsView(G),Re===!0&&ie.setGlobalState(w.clippingPlanes,G),Us(b,X,G),D.updateMultisampleRenderTarget(fe),D.updateRenderTargetMipmap(fe),Ze.has("WEBGL_multisampled_render_to_texture")===!1){let Le=!1;for(let ct=0,Mt=U.length;ct<Mt;ct++){const yt=U[ct],{object:ht,geometry:Bt,material:Ee,group:jt}=yt;if(Ee.side===Ht&&ht.layers.test(G.layers)){const et=Ee.side;Ee.side=Vt,Ee.needsUpdate=!0,dl(ht,X,G,Bt,Ee,jt),Ee.side=et,Ee.needsUpdate=!0,Le=!0}}Le===!0&&(D.updateMultisampleRenderTarget(fe),D.updateRenderTargetMipmap(fe))}w.setRenderTarget(pe,Te,Ce),w.setClearColor(Q,he),Ye!==void 0&&(G.viewport=Ye),w.toneMapping=Ge}function Us(b,U,X){const G=U.isScene===!0?U.overrideMaterial:null;for(let V=0,fe=b.length;V<fe;V++){const ve=b[V],{object:pe,geometry:Te,group:Ce}=ve;let Ge=ve.material;Ge.allowOverride===!0&&G!==null&&(Ge=G),pe.layers.test(X.layers)&&dl(pe,U,X,Te,Ge,Ce)}}function dl(b,U,X,G,V,fe){b.onBeforeRender(w,U,X,G,V,fe),b.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),V.onBeforeRender(w,U,X,G,b,fe),V.transparent===!0&&V.side===Ht&&V.forceSinglePass===!1?(V.side=Vt,V.needsUpdate=!0,w.renderBufferDirect(X,U,G,V,b,fe),V.side=Kn,V.needsUpdate=!0,w.renderBufferDirect(X,U,G,V,b,fe),V.side=Ht):w.renderBufferDirect(X,U,G,V,b,fe),b.onAfterRender(w,U,X,G,V,fe)}function Fs(b,U,X){U.isScene!==!0&&(U=Me);const G=y.get(b),V=E.state.lights,fe=E.state.shadowsArray,ve=V.state.version,pe=re.getParameters(b,V.state,fe,U,X),Te=re.getProgramCacheKey(pe);let Ce=G.programs;G.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?U.environment:null,G.fog=U.fog;const Ge=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;G.envMap=j.get(b.envMap||G.environment,Ge),G.envMapRotation=G.environment!==null&&b.envMap===null?U.environmentRotation:b.envMapRotation,Ce===void 0&&(b.addEventListener("dispose",rt),Ce=new Map,G.programs=Ce);let Ye=Ce.get(Te);if(Ye!==void 0){if(G.currentProgram===Ye&&G.lightsStateVersion===ve)return fl(b,pe),Ye}else pe.uniforms=re.getUniforms(b),b.onBeforeCompile(pe,w),Ye=re.acquireProgram(pe,Te),Ce.set(Te,Ye),G.uniforms=pe.uniforms;const Le=G.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Le.clippingPlanes=ie.uniform),fl(b,pe),G.needsLights=Kh(b),G.lightsStateVersion=ve,G.needsLights&&(Le.ambientLightColor.value=V.state.ambient,Le.lightProbe.value=V.state.probe,Le.directionalLights.value=V.state.directional,Le.directionalLightShadows.value=V.state.directionalShadow,Le.spotLights.value=V.state.spot,Le.spotLightShadows.value=V.state.spotShadow,Le.rectAreaLights.value=V.state.rectArea,Le.ltc_1.value=V.state.rectAreaLTC1,Le.ltc_2.value=V.state.rectAreaLTC2,Le.pointLights.value=V.state.point,Le.pointLightShadows.value=V.state.pointShadow,Le.hemisphereLights.value=V.state.hemi,Le.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Le.spotLightMatrix.value=V.state.spotLightMatrix,Le.spotLightMap.value=V.state.spotLightMap,Le.pointShadowMatrix.value=V.state.pointShadowMatrix),G.currentProgram=Ye,G.uniformsList=null,Ye}function ul(b){if(b.uniformsList===null){const U=b.currentProgram.getUniforms();b.uniformsList=yr.seqWithValue(U.seq,b.uniforms)}return b.uniformsList}function fl(b,U){const X=y.get(b);X.outputColorSpace=U.outputColorSpace,X.batching=U.batching,X.batchingColor=U.batchingColor,X.instancing=U.instancing,X.instancingColor=U.instancingColor,X.instancingMorph=U.instancingMorph,X.skinning=U.skinning,X.morphTargets=U.morphTargets,X.morphNormals=U.morphNormals,X.morphColors=U.morphColors,X.morphTargetsCount=U.morphTargetsCount,X.numClippingPlanes=U.numClippingPlanes,X.numIntersection=U.numClipIntersection,X.vertexAlphas=U.vertexAlphas,X.vertexTangents=U.vertexTangents,X.toneMapping=U.toneMapping}function Xh(b,U,X,G,V){U.isScene!==!0&&(U=Me),D.resetTextureUnits();const fe=U.fog,ve=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?U.environment:null,pe=F===null?w.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:Yt,Te=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Ce=j.get(G.envMap||ve,Te),Ge=G.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Ye=!!X.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Le=!!X.morphAttributes.position,ct=!!X.morphAttributes.normal,Mt=!!X.morphAttributes.color;let yt=An;G.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(yt=w.toneMapping);const ht=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Bt=ht!==void 0?ht.length:0,Ee=y.get(G),jt=E.state.lights;if(Re===!0&&(Z===!0||b!==k)){const It=b===k&&G.id===z;ie.setState(G,b,It)}let et=!1;G.version===Ee.__version?(Ee.needsLights&&Ee.lightsStateVersion!==jt.state.version||Ee.outputColorSpace!==pe||V.isBatchedMesh&&Ee.batching===!1||!V.isBatchedMesh&&Ee.batching===!0||V.isBatchedMesh&&Ee.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&Ee.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&Ee.instancing===!1||!V.isInstancedMesh&&Ee.instancing===!0||V.isSkinnedMesh&&Ee.skinning===!1||!V.isSkinnedMesh&&Ee.skinning===!0||V.isInstancedMesh&&Ee.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Ee.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Ee.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Ee.instancingMorph===!1&&V.morphTexture!==null||Ee.envMap!==Ce||G.fog===!0&&Ee.fog!==fe||Ee.numClippingPlanes!==void 0&&(Ee.numClippingPlanes!==ie.numPlanes||Ee.numIntersection!==ie.numIntersection)||Ee.vertexAlphas!==Ge||Ee.vertexTangents!==Ye||Ee.morphTargets!==Le||Ee.morphNormals!==ct||Ee.morphColors!==Mt||Ee.toneMapping!==yt||Ee.morphTargetsCount!==Bt)&&(et=!0):(et=!0,Ee.__version=G.version);let ln=Ee.currentProgram;et===!0&&(ln=Fs(G,U,V));let yn=!1,hi=!1,Si=!1;const dt=ln.getUniforms(),Ut=Ee.uniforms;if(_e.useProgram(ln.program)&&(yn=!0,hi=!0,Si=!0),G.id!==z&&(z=G.id,hi=!0),yn||k!==b){_e.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),dt.setValue(P,"projectionMatrix",b.projectionMatrix),dt.setValue(P,"viewMatrix",b.matrixWorldInverse);const Jn=dt.map.cameraPosition;Jn!==void 0&&Jn.setValue(P,De.setFromMatrixPosition(b.matrixWorld)),st.logarithmicDepthBuffer&&dt.setValue(P,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&dt.setValue(P,"isOrthographic",b.isOrthographicCamera===!0),k!==b&&(k=b,hi=!0,Si=!0)}if(Ee.needsLights&&(jt.state.directionalShadowMap.length>0&&dt.setValue(P,"directionalShadowMap",jt.state.directionalShadowMap,D),jt.state.spotShadowMap.length>0&&dt.setValue(P,"spotShadowMap",jt.state.spotShadowMap,D),jt.state.pointShadowMap.length>0&&dt.setValue(P,"pointShadowMap",jt.state.pointShadowMap,D)),V.isSkinnedMesh){dt.setOptional(P,V,"bindMatrix"),dt.setOptional(P,V,"bindMatrixInverse");const It=V.skeleton;It&&(It.boneTexture===null&&It.computeBoneTexture(),dt.setValue(P,"boneTexture",It.boneTexture,D))}V.isBatchedMesh&&(dt.setOptional(P,V,"batchingTexture"),dt.setValue(P,"batchingTexture",V._matricesTexture,D),dt.setOptional(P,V,"batchingIdTexture"),dt.setValue(P,"batchingIdTexture",V._indirectTexture,D),dt.setOptional(P,V,"batchingColorTexture"),V._colorsTexture!==null&&dt.setValue(P,"batchingColorTexture",V._colorsTexture,D));const Zn=X.morphAttributes;if((Zn.position!==void 0||Zn.normal!==void 0||Zn.color!==void 0)&&ge.update(V,X,ln),(hi||Ee.receiveShadow!==V.receiveShadow)&&(Ee.receiveShadow=V.receiveShadow,dt.setValue(P,"receiveShadow",V.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&U.environment!==null&&(Ut.envMapIntensity.value=U.environmentIntensity),Ut.dfgLUT!==void 0&&(Ut.dfgLUT.value=ox()),hi&&(dt.setValue(P,"toneMappingExposure",w.toneMappingExposure),Ee.needsLights&&qh(Ut,Si),fe&&G.fog===!0&&Ae.refreshFogUniforms(Ut,fe),Ae.refreshMaterialUniforms(Ut,G,Be,le,E.state.transmissionRenderTarget[b.id]),yr.upload(P,ul(Ee),Ut,D)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(yr.upload(P,ul(Ee),Ut,D),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&dt.setValue(P,"center",V.center),dt.setValue(P,"modelViewMatrix",V.modelViewMatrix),dt.setValue(P,"normalMatrix",V.normalMatrix),dt.setValue(P,"modelMatrix",V.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const It=G.uniformsGroups;for(let Jn=0,bi=It.length;Jn<bi;Jn++){const pl=It[Jn];ye.update(pl,ln),ye.bind(pl,ln)}}return ln}function qh(b,U){b.ambientLightColor.needsUpdate=U,b.lightProbe.needsUpdate=U,b.directionalLights.needsUpdate=U,b.directionalLightShadows.needsUpdate=U,b.pointLights.needsUpdate=U,b.pointLightShadows.needsUpdate=U,b.spotLights.needsUpdate=U,b.spotLightShadows.needsUpdate=U,b.rectAreaLights.needsUpdate=U,b.hemisphereLights.needsUpdate=U}function Kh(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return N},this.getRenderTarget=function(){return F},this.setRenderTargetTextures=function(b,U,X){const G=y.get(b);G.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),y.get(b.texture).__webglTexture=U,y.get(b.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:X,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,U){const X=y.get(b);X.__webglFramebuffer=U,X.__useDefaultFramebuffer=U===void 0};const Yh=P.createFramebuffer();this.setRenderTarget=function(b,U=0,X=0){F=b,C=U,N=X;let G=null,V=!1,fe=!1;if(b){const pe=y.get(b);if(pe.__useDefaultFramebuffer!==void 0){_e.bindFramebuffer(P.FRAMEBUFFER,pe.__webglFramebuffer),O.copy(b.viewport),H.copy(b.scissor),J=b.scissorTest,_e.viewport(O),_e.scissor(H),_e.setScissorTest(J),z=-1;return}else if(pe.__webglFramebuffer===void 0)D.setupRenderTarget(b);else if(pe.__hasExternalTextures)D.rebindTextures(b,y.get(b.texture).__webglTexture,y.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Ge=b.depthTexture;if(pe.__boundDepthTexture!==Ge){if(Ge!==null&&y.has(Ge)&&(b.width!==Ge.image.width||b.height!==Ge.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");D.setupDepthRenderbuffer(b)}}const Te=b.texture;(Te.isData3DTexture||Te.isDataArrayTexture||Te.isCompressedArrayTexture)&&(fe=!0);const Ce=y.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ce[U])?G=Ce[U][X]:G=Ce[U],V=!0):b.samples>0&&D.useMultisampledRTT(b)===!1?G=y.get(b).__webglMultisampledFramebuffer:Array.isArray(Ce)?G=Ce[X]:G=Ce,O.copy(b.viewport),H.copy(b.scissor),J=b.scissorTest}else O.copy($).multiplyScalar(Be).floor(),H.copy(se).multiplyScalar(Be).floor(),J=ae;if(X!==0&&(G=Yh),_e.bindFramebuffer(P.FRAMEBUFFER,G)&&_e.drawBuffers(b,G),_e.viewport(O),_e.scissor(H),_e.setScissorTest(J),V){const pe=y.get(b.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+U,pe.__webglTexture,X)}else if(fe){const pe=U;for(let Te=0;Te<b.textures.length;Te++){const Ce=y.get(b.textures[Te]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Te,Ce.__webglTexture,X,pe)}}else if(b!==null&&X!==0){const pe=y.get(b.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,pe.__webglTexture,X)}z=-1},this.readRenderTargetPixels=function(b,U,X,G,V,fe,ve,pe=0){if(!(b&&b.isWebGLRenderTarget)){Oe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Te=y.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ve!==void 0&&(Te=Te[ve]),Te){_e.bindFramebuffer(P.FRAMEBUFFER,Te);try{const Ce=b.textures[pe],Ge=Ce.format,Ye=Ce.type;if(b.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+pe),!st.textureFormatReadable(Ge)){Oe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!st.textureTypeReadable(Ye)){Oe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=b.width-G&&X>=0&&X<=b.height-V&&P.readPixels(U,X,G,V,oe.convert(Ge),oe.convert(Ye),fe)}finally{const Ce=F!==null?y.get(F).__webglFramebuffer:null;_e.bindFramebuffer(P.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(b,U,X,G,V,fe,ve,pe=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Te=y.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ve!==void 0&&(Te=Te[ve]),Te)if(U>=0&&U<=b.width-G&&X>=0&&X<=b.height-V){_e.bindFramebuffer(P.FRAMEBUFFER,Te);const Ce=b.textures[pe],Ge=Ce.format,Ye=Ce.type;if(b.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+pe),!st.textureFormatReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!st.textureTypeReadable(Ye))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Le=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Le),P.bufferData(P.PIXEL_PACK_BUFFER,fe.byteLength,P.STREAM_READ),P.readPixels(U,X,G,V,oe.convert(Ge),oe.convert(Ye),0);const ct=F!==null?y.get(F).__webglFramebuffer:null;_e.bindFramebuffer(P.FRAMEBUFFER,ct);const Mt=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Nd(P,Mt,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Le),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,fe),P.deleteBuffer(Le),P.deleteSync(Mt),fe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,U=null,X=0){const G=Math.pow(2,-X),V=Math.floor(b.image.width*G),fe=Math.floor(b.image.height*G),ve=U!==null?U.x:0,pe=U!==null?U.y:0;D.setTexture2D(b,0),P.copyTexSubImage2D(P.TEXTURE_2D,X,0,0,ve,pe,V,fe),_e.unbindTexture()};const jh=P.createFramebuffer(),$h=P.createFramebuffer();this.copyTextureToTexture=function(b,U,X=null,G=null,V=0,fe=0){let ve,pe,Te,Ce,Ge,Ye,Le,ct,Mt;const yt=b.isCompressedTexture?b.mipmaps[fe]:b.image;if(X!==null)ve=X.max.x-X.min.x,pe=X.max.y-X.min.y,Te=X.isBox3?X.max.z-X.min.z:1,Ce=X.min.x,Ge=X.min.y,Ye=X.isBox3?X.min.z:0;else{const Ut=Math.pow(2,-V);ve=Math.floor(yt.width*Ut),pe=Math.floor(yt.height*Ut),b.isDataArrayTexture?Te=yt.depth:b.isData3DTexture?Te=Math.floor(yt.depth*Ut):Te=1,Ce=0,Ge=0,Ye=0}G!==null?(Le=G.x,ct=G.y,Mt=G.z):(Le=0,ct=0,Mt=0);const ht=oe.convert(U.format),Bt=oe.convert(U.type);let Ee;U.isData3DTexture?(D.setTexture3D(U,0),Ee=P.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(D.setTexture2DArray(U,0),Ee=P.TEXTURE_2D_ARRAY):(D.setTexture2D(U,0),Ee=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,U.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,U.unpackAlignment);const jt=P.getParameter(P.UNPACK_ROW_LENGTH),et=P.getParameter(P.UNPACK_IMAGE_HEIGHT),ln=P.getParameter(P.UNPACK_SKIP_PIXELS),yn=P.getParameter(P.UNPACK_SKIP_ROWS),hi=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,yt.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,yt.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Ce),P.pixelStorei(P.UNPACK_SKIP_ROWS,Ge),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Ye);const Si=b.isDataArrayTexture||b.isData3DTexture,dt=U.isDataArrayTexture||U.isData3DTexture;if(b.isDepthTexture){const Ut=y.get(b),Zn=y.get(U),It=y.get(Ut.__renderTarget),Jn=y.get(Zn.__renderTarget);_e.bindFramebuffer(P.READ_FRAMEBUFFER,It.__webglFramebuffer),_e.bindFramebuffer(P.DRAW_FRAMEBUFFER,Jn.__webglFramebuffer);for(let bi=0;bi<Te;bi++)Si&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,y.get(b).__webglTexture,V,Ye+bi),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,y.get(U).__webglTexture,fe,Mt+bi)),P.blitFramebuffer(Ce,Ge,ve,pe,Le,ct,ve,pe,P.DEPTH_BUFFER_BIT,P.NEAREST);_e.bindFramebuffer(P.READ_FRAMEBUFFER,null),_e.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(V!==0||b.isRenderTargetTexture||y.has(b)){const Ut=y.get(b),Zn=y.get(U);_e.bindFramebuffer(P.READ_FRAMEBUFFER,jh),_e.bindFramebuffer(P.DRAW_FRAMEBUFFER,$h);for(let It=0;It<Te;It++)Si?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Ut.__webglTexture,V,Ye+It):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Ut.__webglTexture,V),dt?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Zn.__webglTexture,fe,Mt+It):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Zn.__webglTexture,fe),V!==0?P.blitFramebuffer(Ce,Ge,ve,pe,Le,ct,ve,pe,P.COLOR_BUFFER_BIT,P.NEAREST):dt?P.copyTexSubImage3D(Ee,fe,Le,ct,Mt+It,Ce,Ge,ve,pe):P.copyTexSubImage2D(Ee,fe,Le,ct,Ce,Ge,ve,pe);_e.bindFramebuffer(P.READ_FRAMEBUFFER,null),_e.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else dt?b.isDataTexture||b.isData3DTexture?P.texSubImage3D(Ee,fe,Le,ct,Mt,ve,pe,Te,ht,Bt,yt.data):U.isCompressedArrayTexture?P.compressedTexSubImage3D(Ee,fe,Le,ct,Mt,ve,pe,Te,ht,yt.data):P.texSubImage3D(Ee,fe,Le,ct,Mt,ve,pe,Te,ht,Bt,yt):b.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,fe,Le,ct,ve,pe,ht,Bt,yt.data):b.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,fe,Le,ct,yt.width,yt.height,ht,yt.data):P.texSubImage2D(P.TEXTURE_2D,fe,Le,ct,ve,pe,ht,Bt,yt);P.pixelStorei(P.UNPACK_ROW_LENGTH,jt),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,et),P.pixelStorei(P.UNPACK_SKIP_PIXELS,ln),P.pixelStorei(P.UNPACK_SKIP_ROWS,yn),P.pixelStorei(P.UNPACK_SKIP_IMAGES,hi),fe===0&&U.generateMipmaps&&P.generateMipmap(Ee),_e.unbindTexture()},this.initRenderTarget=function(b){y.get(b).__webglFramebuffer===void 0&&D.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?D.setTextureCube(b,0):b.isData3DTexture?D.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?D.setTexture2DArray(b,0):D.setTexture2D(b,0),_e.unbindTexture()},this.resetState=function(){C=0,N=0,F=null,_e.reset(),ne.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return En}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Qe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Qe._getUnpackColorSpace()}}const Dc="frontier_horizon_3d_muted_v1";class cx{ctx=null;userMuted=!1;platformMuted=!1;engineOscMain=null;engineOscSub=null;engineFilter=null;engineGain=null;engineRunning=!1;lastSurfaceSfxTime=0;constructor(){try{this.userMuted=localStorage.getItem(Dc)==="1"}catch{this.userMuted=!1}if(typeof window<"u"){const e=()=>this.ensureContext();window.addEventListener("pointerdown",e,{passive:!0}),window.addEventListener("keydown",e,{passive:!0}),window.addEventListener("touchstart",e,{passive:!0})}}isMuted(){return this.userMuted||this.platformMuted}toggleMute(){this.userMuted=!this.userMuted;try{localStorage.setItem(Dc,this.userMuted?"1":"0")}catch{}return this.syncEngineGainMute(),this.userMuted}setPlatformMuted(e){this.platformMuted=e,this.syncEngineGainMute(),this.ctx&&(this.isMuted()&&this.ctx.state==="running"?this.ctx.suspend().catch(()=>{}):!this.isMuted()&&this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{}))}ensureContext(){if(this.isMuted())return null;if(!this.ctx&&typeof window<"u"){const e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx=new e)}return this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{}),this.ctx&&!this.engineRunning&&this.initEngineNodes(this.ctx),this.ctx}initEngineNodes(e){try{this.engineOscMain=e.createOscillator(),this.engineOscSub=e.createOscillator(),this.engineFilter=e.createBiquadFilter(),this.engineGain=e.createGain(),this.engineOscMain.type="sawtooth",this.engineOscSub.type="triangle",this.engineOscMain.frequency.value=48,this.engineOscSub.frequency.value=24,this.engineFilter.type="lowpass",this.engineFilter.frequency.value=220,this.engineFilter.Q.value=2.2,this.engineGain.gain.value=1e-4,this.engineOscMain.connect(this.engineFilter),this.engineOscSub.connect(this.engineFilter),this.engineFilter.connect(this.engineGain),this.engineGain.connect(e.destination),this.engineOscMain.start(),this.engineOscSub.start(),this.engineRunning=!0}catch{this.engineRunning=!1}}syncEngineGainMute(){!this.ctx||!this.engineGain||this.isMuted()&&this.engineGain.gain.setTargetAtTime(1e-4,this.ctx.currentTime,.04)}updateEngineSound(e,t,n){if(!this.ctx||!this.engineRunning||!this.engineOscMain||!this.engineOscSub||!this.engineFilter||!this.engineGain)return;const i=this.ctx.currentTime;if(this.isMuted()||!n){this.engineGain.gain.setTargetAtTime(1e-4,i,.06);return}const s=Math.max(0,Math.min(1,(e-800)/5700)),a=38+s*105;this.engineOscMain.frequency.setTargetAtTime(a,i,.03),this.engineOscSub.frequency.setTargetAtTime(a*.5,i,.03),this.engineFilter.frequency.setTargetAtTime(160+s*520+t*240,i,.04);const o=.022+s*.028+t*.02;this.engineGain.gain.setTargetAtTime(o,i,.04)}playGearShift(e){const t=this.ensureContext();if(!t)return;const n=t.currentTime,i=t.createOscillator(),s=t.createGain();i.type="triangle",i.frequency.setValueAtTime(e?180:130,n),i.frequency.exponentialRampToValueAtTime(e?110:190,n+.07),s.gain.setValueAtTime(.04,n),s.gain.exponentialRampToValueAtTime(.001,n+.08),i.connect(s),s.connect(t.destination),i.start(n),i.stop(n+.085)}playHorn(e=!1){const t=this.ensureContext();if(!t)return;const n=t.currentTime,i=e?185:340,s=e?233:425;for(let a=0;a<2;a++){const o=t.createOscillator(),c=t.createGain();o.type="sawtooth",o.frequency.setValueAtTime(a===0?i:s,n),c.gain.setValueAtTime(.06,n),c.gain.exponentialRampToValueAtTime(.001,n+.34),o.connect(c),c.connect(t.destination),o.start(n),o.stop(n+.35)}}playBotHorn(){const e=this.ensureContext();if(!e)return;const t=e.currentTime+.18,n=e.createOscillator(),i=e.createGain();n.type="triangle",n.frequency.setValueAtTime(480,t),n.frequency.setValueAtTime(580,t+.11),i.gain.setValueAtTime(.045,t),i.gain.exponentialRampToValueAtTime(.001,t+.25),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.26)}playDiffLockToggle(e){const t=this.ensureContext();if(!t)return;const n=t.currentTime,i=t.createOscillator(),s=t.createGain();i.type="square",i.frequency.setValueAtTime(e?240:380,n),i.frequency.exponentialRampToValueAtTime(e?460:210,n+.09),s.gain.setValueAtTime(.06,n),s.gain.exponentialRampToValueAtTime(.001,n+.1),i.connect(s),s.connect(t.destination),i.start(n),i.stop(n+.11)}playHeadlightClick(){const e=this.ensureContext();if(!e)return;const t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sine",n.frequency.setValueAtTime(920,t),n.frequency.exponentialRampToValueAtTime(520,t+.04),i.gain.setValueAtTime(.05,t),i.gain.exponentialRampToValueAtTime(.001,t+.045),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.05)}playSuspensionImpact(e){const t=this.ensureContext();if(!t)return;const n=t.currentTime,i=Math.min(1,Math.max(.2,e)),s=t.createOscillator(),a=t.createGain();s.type="sine",s.frequency.setValueAtTime(115,n),s.frequency.exponentialRampToValueAtTime(42,n+.16),a.gain.setValueAtTime(.09*i,n),a.gain.exponentialRampToValueAtTime(.001,n+.17),s.connect(a),a.connect(t.destination),s.start(n),s.stop(n+.18)}playTerrainSfx(e){const t=this.ensureContext();if(!t)return;const n=t.currentTime;if(n-this.lastSurfaceSfxTime<.22)return;this.lastSurfaceSfxTime=n;const i=t.createOscillator(),s=t.createGain();if(e==="water_ford")i.type="sine",i.frequency.setValueAtTime(280,n),i.frequency.exponentialRampToValueAtTime(540,n+.14),s.gain.setValueAtTime(.04,n);else if(e==="deep_mud")i.type="sawtooth",i.frequency.setValueAtTime(95,n),i.frequency.exponentialRampToValueAtTime(62,n+.14),s.gain.setValueAtTime(.035,n);else if(e==="soft_sand")i.type="triangle",i.frequency.setValueAtTime(420,n),i.frequency.exponentialRampToValueAtTime(290,n+.12),s.gain.setValueAtTime(.025,n);else if(e==="alpine_ice")i.type="sine",i.frequency.setValueAtTime(760,n),i.frequency.exponentialRampToValueAtTime(520,n+.1),s.gain.setValueAtTime(.028,n);else return;s.gain.exponentialRampToValueAtTime(.001,n+.15),i.connect(s),s.connect(t.destination),i.start(n),i.stop(n+.16)}playSonarPing(e){const t=this.ensureContext();if(!t)return;const n=t.currentTime,i=t.createOscillator(),s=t.createGain();i.type="sine";const a=780+Math.min(5,Math.max(1,e))*110;i.frequency.setValueAtTime(a,n),i.frequency.exponentialRampToValueAtTime(a*1.15,n+.09),s.gain.setValueAtTime(.045,n),s.gain.exponentialRampToValueAtTime(.001,n+.11),i.connect(s),s.connect(t.destination),i.start(n),i.stop(n+.12)}playWaypointReached(){const e=this.ensureContext();if(!e)return;const t=[523.25,659.25,783.99,1046.5],n=e.currentTime;for(let i=0;i<t.length;i++){const s=n+i*.075,a=e.createOscillator(),o=e.createGain();a.type="triangle",a.frequency.setValueAtTime(t[i],s),o.gain.setValueAtTime(.08,s),o.gain.exponentialRampToValueAtTime(.001,s+.28),a.connect(o),o.connect(e.destination),a.start(s),a.stop(s+.29)}}playCollectibleFound(e){const t=this.ensureContext();if(!t)return;const n=e?[587.33,739.99,880,1174.66,1479.98]:[659.25,830.61,987.77,1318.51],i=t.currentTime;for(let s=0;s<n.length;s++){const a=i+s*.065,o=t.createOscillator(),c=t.createGain();o.type="triangle",o.frequency.setValueAtTime(n[s],a),c.gain.setValueAtTime(.09,a),c.gain.exponentialRampToValueAtTime(.001,a+.26),o.connect(c),c.connect(t.destination),o.start(a),o.stop(a+.27)}}playWatchtowerActivated(){const e=this.ensureContext();if(!e)return;const t=[440,554.37,659.25,880],n=e.currentTime;for(let i=0;i<t.length;i++){const s=n+i*.08,a=e.createOscillator(),o=e.createGain();a.type="sine",a.frequency.setValueAtTime(t[i],s),o.gain.setValueAtTime(.075,s),o.gain.exponentialRampToValueAtTime(.001,s+.3),a.connect(o),o.connect(e.destination),a.start(s),a.stop(s+.31)}}playGarageClick(){const e=this.ensureContext();if(!e)return;const t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sine",n.frequency.setValueAtTime(480,t),n.frequency.linearRampToValueAtTime(680,t+.045),i.gain.setValueAtTime(.045,t),i.gain.exponentialRampToValueAtTime(.001,t+.05),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.055)}playUpgradeSuccess(){const e=this.ensureContext();if(!e)return;const t=[523.25,659.25,880],n=e.currentTime;for(let i=0;i<t.length;i++){const s=n+i*.06,a=e.createOscillator(),o=e.createGain();a.type="triangle",a.frequency.setValueAtTime(t[i],s),o.gain.setValueAtTime(.07,s),o.gain.exponentialRampToValueAtTime(.001,s+.18),a.connect(o),o.connect(e.destination),a.start(s),a.stop(s+.19)}}playError(){const e=this.ensureContext();if(!e)return;const t=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sawtooth",n.frequency.setValueAtTime(160,t),n.frequency.exponentialRampToValueAtTime(95,t+.12),i.gain.setValueAtTime(.055,t),i.gain.exponentialRampToValueAtTime(.001,t+.13),n.connect(i),i.connect(e.destination),n.start(t),n.stop(t+.14)}}new L,new L,new L,new L,new Ve,new Ne,new xn;function ut(r,e,t){return r<e?e:r>t?t:r}function ft(r,e,t,n){return Er.lerp(r,e,1-Math.exp(-t*n))}function hx(r,e){let t=(e-r+Math.PI)%(Math.PI*2);return t<0&&(t+=Math.PI*2),t-Math.PI}function Ro(r,e,t,n){const i=hx(r,e);return r+i*(1-Math.exp(-t*n))}const ps=new L;function tn(r,e,t,n,i,s){const a=2*Math.PI*i/4,o=Math.max(s-2*i,0),c=Math.PI/4;ps.copy(e),ps[n]=0,ps.normalize();const l=.5*a/(a+o),h=1-ps.angleTo(r)/c;return Math.sign(ps[t])===1?h*l:o/(a+o)+l+l*(1-h)}class Pe extends an{constructor(e=1,t=1,n=1,i=2,s=.1){const a=i*2+1;if(s=Math.min(e/2,t/2,n/2,s),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:n,segments:i,radius:s},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const c=new L,l=new L,h=new L(e,t,n).divideScalar(2).subScalar(s),d=this.attributes.position.array,u=this.attributes.normal.array,f=this.attributes.uv.array,x=d.length/6,g=new L,m=.5/a;for(let p=0,_=0;p<d.length;p+=3,_+=2)switch(c.fromArray(d,p),l.copy(c),l.x-=Math.sign(l.x)*m,l.y-=Math.sign(l.y)*m,l.z-=Math.sign(l.z)*m,l.normalize(),d[p+0]=h.x*Math.sign(c.x)+l.x*s,d[p+1]=h.y*Math.sign(c.y)+l.y*s,d[p+2]=h.z*Math.sign(c.z)+l.z*s,u[p+0]=l.x,u[p+1]=l.y,u[p+2]=l.z,Math.floor(p/x)){case 0:g.set(1,0,0),f[_+0]=tn(g,l,"z","y",s,n),f[_+1]=1-tn(g,l,"y","z",s,t);break;case 1:g.set(-1,0,0),f[_+0]=1-tn(g,l,"z","y",s,n),f[_+1]=1-tn(g,l,"y","z",s,t);break;case 2:g.set(0,1,0),f[_+0]=1-tn(g,l,"x","z",s,e),f[_+1]=tn(g,l,"z","x",s,n);break;case 3:g.set(0,-1,0),f[_+0]=1-tn(g,l,"x","z",s,e),f[_+1]=1-tn(g,l,"z","x",s,n);break;case 4:g.set(0,0,1),f[_+0]=1-tn(g,l,"x","y",s,e),f[_+1]=1-tn(g,l,"y","x",s,t);break;case 5:g.set(0,0,-1),f[_+0]=tn(g,l,"x","y",s,e),f[_+1]=1-tn(g,l,"y","x",s,t);break}}static fromJSON(e){return new Pe(e.width,e.height,e.depth,e.segments,e.radius)}}function Nc(r,e){if(e===Md)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),r;if(e===vo||e===mh){let t=r.getIndex();if(t===null){const a=[],o=r.getAttribute("position");if(o!==void 0){for(let c=0;c<o.count;c++)a.push(c);r.setIndex(a),t=r.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),r}const n=t.count-2,i=[];if(e===vo)for(let a=1;a<=n;a++)i.push(t.getX(0)),i.push(t.getX(a)),i.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(i.push(t.getX(a)),i.push(t.getX(a+1)),i.push(t.getX(a+2))):(i.push(t.getX(a+2)),i.push(t.getX(a+1)),i.push(t.getX(a)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const s=r.clone();return s.setIndex(i),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),r}function Co(r){const e=new Map,t=new Map,n=r.clone();return kh(r,n,function(i,s){e.set(s,i),t.set(i,s)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;const s=i,a=e.get(i),o=a.skeleton.bones;s.skeleton=a.skeleton.clone(),s.bindMatrix.copy(a.bindMatrix),s.skeleton.bones=o.map(function(c){return t.get(c)}),s.bind(s.skeleton,s.bindMatrix)}),n}function kh(r,e,t){t(r,e);for(let n=0;n<r.children.length;n++)kh(r.children[n],e.children[n],t)}class dx extends is{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new gx(t)}),this.register(function(t){return new xx(t)}),this.register(function(t){return new Ex(t)}),this.register(function(t){return new Ax(t)}),this.register(function(t){return new Rx(t)}),this.register(function(t){return new vx(t)}),this.register(function(t){return new yx(t)}),this.register(function(t){return new Mx(t)}),this.register(function(t){return new Sx(t)}),this.register(function(t){return new mx(t)}),this.register(function(t){return new bx(t)}),this.register(function(t){return new _x(t)}),this.register(function(t){return new Tx(t)}),this.register(function(t){return new wx(t)}),this.register(function(t){return new fx(t)}),this.register(function(t){return new Uc(t,je.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Uc(t,je.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new Cx(t)})}load(e,t,n,i){const s=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const l=bs.extractUrlBase(e);a=bs.resolveURL(l,this.path)}else a=bs.extractUrlBase(e);this.manager.itemStart(e);const o=function(l){i?i(l):console.error(l),s.manager.itemError(e),s.manager.itemEnd(e)},c=new Ph(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{s.parse(l,a,function(h){t(h),s.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s;const a={},o={},c=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===zh){try{a[je.KHR_BINARY_GLTF]=new Px(e)}catch(d){i&&i(d);return}s=JSON.parse(a[je.KHR_BINARY_GLTF].content)}else s=JSON.parse(c.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new Gx(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const d=this.pluginCallbacks[h](l);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[d.name]=d,a[d.name]=!0}if(s.extensionsUsed)for(let h=0;h<s.extensionsUsed.length;++h){const d=s.extensionsUsed[h],u=s.extensionsRequired||[];switch(d){case je.KHR_MATERIALS_UNLIT:a[d]=new px;break;case je.KHR_DRACO_MESH_COMPRESSION:a[d]=new Lx(s,this.dracoLoader);break;case je.KHR_TEXTURE_TRANSFORM:a[d]=new Ix;break;case je.KHR_MESH_QUANTIZATION:a[d]=new Dx;break;default:u.indexOf(d)>=0&&o[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}l.setExtensions(a),l.setPlugins(o),l.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}}function ux(){let r={};return{get:function(e){return r[e]},add:function(e,t){r[e]=t},remove:function(e){delete r[e]},removeAll:function(){r={}}}}function St(r,e,t){const n=r.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}const je={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class fx{constructor(e){this.parser=e,this.name=je.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const s=t.json,c=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e];let l;const h=new Ne(16777215);c.color!==void 0&&h.setRGB(c.color[0],c.color[1],c.color[2],Yt);const d=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new bo(h),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new Ih(h),l.distance=d;break;case"spot":l=new Ju(h),l.distance=d,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),bn(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),i=Promise.resolve(l),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,s=n.json.nodes[e],o=(s.extensions&&s.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(c){return n._getNodeRef(t.cache,o,c)})}}class px{constructor(){this.name=je.KHR_MATERIALS_UNLIT}getMaterialType(){return Kt}extendParams(e,t,n){const i=[];e.color=new Ne(1,1,1),e.opacity=1;const s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){const a=s.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Yt),e.opacity=a[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,Et))}return Promise.all(i)}}class mx{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=St(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}}class gx{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return St(this.parser,e,this.name)!==null?_n:null}extendMaterialParams(e,t){const n=St(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){const s=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Xe(s,s)}return Promise.all(i)}}class xx{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_DISPERSION}getMaterialType(e){return St(this.parser,e,this.name)!==null?_n:null}extendMaterialParams(e,t){const n=St(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}}class _x{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return St(this.parser,e,this.name)!==null?_n:null}extendMaterialParams(e,t){const n=St(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}}class vx{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_SHEEN}getMaterialType(e){return St(this.parser,e,this.name)!==null?_n:null}extendMaterialParams(e,t){const n=St(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(t.sheenColor=new Ne(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){const s=n.sheenColorFactor;t.sheenColor.setRGB(s[0],s[1],s[2],Yt)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,Et)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}}class yx{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return St(this.parser,e,this.name)!==null?_n:null}extendMaterialParams(e,t){const n=St(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}}class Mx{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_VOLUME}getMaterialType(e){return St(this.parser,e,this.name)!==null?_n:null}extendMaterialParams(e,t){const n=St(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;const s=n.attenuationColor||[1,1,1];return t.attenuationColor=new Ne().setRGB(s[0],s[1],s[2],Yt),Promise.all(i)}}class Sx{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_IOR}getMaterialType(e){return St(this.parser,e,this.name)!==null?_n:null}extendMaterialParams(e,t){const n=St(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5),Promise.resolve()}}class bx{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_SPECULAR}getMaterialType(e){return St(this.parser,e,this.name)!==null?_n:null}extendMaterialParams(e,t){const n=St(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));const s=n.specularColorFactor||[1,1,1];return t.specularColor=new Ne().setRGB(s[0],s[1],s[2],Yt),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,Et)),Promise.all(i)}}class wx{constructor(e){this.parser=e,this.name=je.EXT_MATERIALS_BUMP}getMaterialType(e){return St(this.parser,e,this.name)!==null?_n:null}extendMaterialParams(e,t){const n=St(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}}class Tx{constructor(e){this.parser=e,this.name=je.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return St(this.parser,e,this.name)!==null?_n:null}extendMaterialParams(e,t){const n=St(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}}class Ex{constructor(e){this.parser=e,this.name=je.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const s=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,a)}}class Ax{constructor(e){this.parser=e,this.name=je.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const a=s.extensions[t],o=i.images[a.source];let c=n.textureLoader;if(o.uri){const l=n.options.manager.getHandler(o.uri);l!==null&&(c=l)}return n.loadTextureImage(e,a.source,c)}}class Rx{constructor(e){this.parser=e,this.name=je.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const a=s.extensions[t],o=i.images[a.source];let c=n.textureLoader;if(o.uri){const l=n.options.manager.getHandler(o.uri);l!==null&&(c=l)}return n.loadTextureImage(e,a.source,c)}}class Uc{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(o){const c=i.byteOffset||0,l=i.byteLength||0,h=i.count,d=i.byteStride,u=new Uint8Array(o,c,l);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,d,u,i.mode,i.filter).then(function(f){return f.buffer}):a.ready.then(function(){const f=new ArrayBuffer(h*d);return a.decodeGltfBuffer(new Uint8Array(f),h,d,u,i.mode,i.filter),f})})}else return null}}class Cx{constructor(e){this.name=je.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const l of i.primitives)if(l.mode!==nn.TRIANGLES&&l.mode!==nn.TRIANGLE_STRIP&&l.mode!==nn.TRIANGLE_FAN&&l.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],c={};for(const l in a)o.push(this.parser.getDependency("accessor",a[l]).then(h=>(c[l]=h,c[l])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(l=>{const h=l.pop(),d=h.isGroup?h.children:[h],u=l[0].count,f=[];for(const x of d){const g=new Ve,m=new L,p=new In,_=new L(1,1,1),S=new Qo(x.geometry,x.material,u);for(let M=0;M<u;M++)c.TRANSLATION&&m.fromBufferAttribute(c.TRANSLATION,M),c.ROTATION&&p.fromBufferAttribute(c.ROTATION,M),c.SCALE&&_.fromBufferAttribute(c.SCALE,M),S.setMatrixAt(M,g.compose(m,p,_));for(const M in c)if(M==="_COLOR_0"){const E=c[M];S.instanceColor=new Mo(E.array,E.itemSize,E.normalized)}else M!=="TRANSLATION"&&M!=="ROTATION"&&M!=="SCALE"&&x.geometry.setAttribute(M,c[M]);vt.prototype.copy.call(S,x),this.parser.assignFinalMaterial(S),f.push(S)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}}const zh="glTF",ms=12,Fc={JSON:1313821514,BIN:5130562};class Px{constructor(e){this.name=je.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,ms),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==zh)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-ms,s=new DataView(e,ms);let a=0;for(;a<i;){const o=s.getUint32(a,!0);a+=4;const c=s.getUint32(a,!0);if(a+=4,c===Fc.JSON){const l=new Uint8Array(e,ms+a,o);this.content=n.decode(l)}else if(c===Fc.BIN){const l=ms+a;this.body=e.slice(l,l+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class Lx{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=je.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},c={},l={};for(const h in a){const d=Po[h]||h.toLowerCase();o[d]=a[h]}for(const h in e.attributes){const d=Po[h]||h.toLowerCase();if(a[h]!==void 0){const u=n.accessors[e.attributes[h]],f=Wi[u.componentType];l[d]=f.name,c[d]=u.normalized===!0}}return t.getDependency("bufferView",s).then(function(h){return new Promise(function(d,u){i.decodeDracoFile(h,function(f){for(const x in f.attributes){const g=f.attributes[x],m=c[x];m!==void 0&&(g.normalized=m)}d(f)},o,l,Yt,u)})})}}class Ix{constructor(){this.name=je.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class Dx{constructor(){this.name=je.KHR_MESH_QUANTIZATION}}class Hh extends es{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[s+a];return t}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=o*2,l=o*3,h=i-t,d=(n-t)/h,u=d*d,f=u*d,x=e*l,g=x-l,m=-2*f+3*u,p=f-u,_=1-m,S=p-u+d;for(let M=0;M!==o;M++){const E=a[g+M+o],T=a[g+M+c]*h,R=a[x+M+o],v=a[x+M]*h;s[M]=_*E+S*T+m*R+p*v}return s}}const Nx=new In;class Ux extends Hh{interpolate_(e,t,n,i){const s=super.interpolate_(e,t,n,i);return Nx.fromArray(s).normalize().toArray(s),s}}const nn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Wi={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Oc={9728:At,9729:Rt,9984:lh,9985:pr,9986:vs,9987:Gn},Bc={33071:Tn,33648:Sr,10497:Cn},Sa={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Po={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},ri={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Fx={CUBICSPLINE:void 0,LINEAR:As,STEP:Es},ba={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Ox(r){return r.DefaultMaterial===void 0&&(r.DefaultMaterial=new Je({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Kn})),r.DefaultMaterial}function xi(r,e,t){for(const n in t.extensions)r[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function bn(r,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(r.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Bx(r,e,t){let n=!1,i=!1,s=!1;for(let l=0,h=e.length;l<h;l++){const d=e[l];if(d.POSITION!==void 0&&(n=!0),d.NORMAL!==void 0&&(i=!0),d.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(r);const a=[],o=[],c=[];for(let l=0,h=e.length;l<h;l++){const d=e[l];if(n){const u=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):r.attributes.position;a.push(u)}if(i){const u=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):r.attributes.normal;o.push(u)}if(s){const u=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):r.attributes.color;c.push(u)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(c)]).then(function(l){const h=l[0],d=l[1],u=l[2];return n&&(r.morphAttributes.position=h),i&&(r.morphAttributes.normal=d),s&&(r.morphAttributes.color=u),r.morphTargetsRelative=!0,r})}function kx(r,e){if(r.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)r.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(r.morphTargetInfluences.length===t.length){r.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)r.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function zx(r){let e;const t=r.extensions&&r.extensions[je.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+wa(t.attributes):e=r.indices+":"+wa(r.attributes)+":"+r.mode,r.targets!==void 0)for(let n=0,i=r.targets.length;n<i;n++)e+=":"+wa(r.targets[n]);return e}function wa(r){let e="";const t=Object.keys(r).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+r[t[n]]+";";return e}function Lo(r){switch(r){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Hx(r){return r.search(/\.jpe?g($|\?)/i)>0||r.search(/^data\:image\/jpeg/)===0?"image/jpeg":r.search(/\.webp($|\?)/i)>0||r.search(/^data\:image\/webp/)===0?"image/webp":r.search(/\.ktx2($|\?)/i)>0||r.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const Vx=new Ve;class Gx{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new ux,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const c=o.match(/Version\/(\d+)/);i=n&&c?parseInt(c[1],10):-1,s=o.indexOf("Firefox")>-1,a=s?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&a<98?this.textureLoader=new ju(this.options.manager):this.textureLoader=new tf(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Ph(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return xi(s,o,i),bn(o,i),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(o)})).then(function(){for(const c of o.scenes)c.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){const a=t[i].joints;for(let o=0,c=a.length;o<c;o++)e[a[o]].isBone=!0}for(let i=0,s=e.length;i<s;i++){const a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),s=(a,o)=>{const c=this.associations.get(a);c!=null&&this.associations.set(o,c);for(const[l,h]of a.children.entries())s(h,o.children[l])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[je.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(s,a){n.load(bs.resolveURL(t.uri,i.path),s,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const a=Sa[i.type],o=Wi[i.componentType],c=i.normalized===!0,l=new o(i.count*a);return Promise.resolve(new Gt(l,a,c))}const s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(a){const o=a[0],c=Sa[i.type],l=Wi[i.componentType],h=l.BYTES_PER_ELEMENT,d=h*c,u=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,x=i.normalized===!0;let g,m;if(f&&f!==d){const p=Math.floor(u/f),_="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+p+":"+i.count;let S=t.cache.get(_);S||(g=new l(o,p*f,i.count*f/h),S=new pu(g,f/h),t.cache.add(_,S)),m=new $o(S,c,u%f/h,x)}else o===null?g=new l(i.count*c):g=new l(o,u,i.count*c),m=new Gt(g,c,x);if(i.sparse!==void 0){const p=Sa.SCALAR,_=Wi[i.sparse.indices.componentType],S=i.sparse.indices.byteOffset||0,M=i.sparse.values.byteOffset||0,E=new _(a[1],S,i.sparse.count*p),T=new l(a[2],M,i.sparse.count*c);o!==null&&(m=new Gt(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let R=0,v=E.length;R<v;R++){const w=E[R];if(m.setX(w,T[R*c]),c>=2&&m.setY(w,T[R*c+1]),c>=3&&m.setZ(w,T[R*c+2]),c>=4&&m.setW(w,T[R*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=x}return m})}loadTexture(e){const t=this.json,n=this.options,s=t.textures[e].source,a=t.images[s];let o=this.textureLoader;if(a.uri){const c=n.manager.getHandler(a.uri);c!==null&&(o=c)}return this.loadTextureImage(e,s,o)}loadTextureImage(e,t,n){const i=this,s=this.json,a=s.textures[e],o=s.images[t],c=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[c])return this.textureCache[c];const l=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const u=(s.samplers||{})[a.sampler]||{};return h.magFilter=Oc[u.magFilter]||Rt,h.minFilter=Oc[u.minFilter]||Gn,h.wrapS=Bc[u.wrapS]||Cn,h.wrapT=Bc[u.wrapT]||Cn,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==At&&h.minFilter!==Rt,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){const n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());const a=i.images[e],o=self.URL||self.webkitURL;let c=a.uri||"",l=!1;if(a.bufferView!==void 0)c=n.getDependency("bufferView",a.bufferView).then(function(d){l=!0;const u=new Blob([d],{type:a.mimeType});return c=o.createObjectURL(u),c});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(c).then(function(d){return new Promise(function(u,f){let x=u;t.isImageBitmapLoader===!0&&(x=function(g){const m=new Ct(g);m.needsUpdate=!0,u(m)}),t.load(bs.resolveURL(d,s.path),x,void 0,f)})}).then(function(d){return l===!0&&o.revokeObjectURL(c),bn(d,a),d.userData.mimeType=a.mimeType||Hx(a.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),d});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){const s=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),s.extensions[je.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[je.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const c=s.associations.get(a);a=s.extensions[je.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),s.associations.set(a,c)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let c=this.cache.get(o);c||(c=new wh,gn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(o,c)),n=c}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let c=this.cache.get(o);c||(c=new bh,gn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(o,c)),n=c}if(i||s||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),s&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let c=this.cache.get(o);c||(c=n.clone(),s&&(c.vertexColors=!0),a&&(c.flatShading=!0),i&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(o,c),this.associations.set(c,this.associations.get(n))),n=c}e.material=n}getMaterialType(){return Je}loadMaterial(e){const t=this,n=this.json,i=this.extensions,s=n.materials[e];let a;const o={},c=s.extensions||{},l=[];if(c[je.KHR_MATERIALS_UNLIT]){const d=i[je.KHR_MATERIALS_UNLIT];a=d.getMaterialType(),l.push(d.extendParams(o,s,t))}else{const d=s.pbrMetallicRoughness||{};if(o.color=new Ne(1,1,1),o.opacity=1,Array.isArray(d.baseColorFactor)){const u=d.baseColorFactor;o.color.setRGB(u[0],u[1],u[2],Yt),o.opacity=u[3]}d.baseColorTexture!==void 0&&l.push(t.assignTexture(o,"map",d.baseColorTexture,Et)),o.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,o.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(o,"metalnessMap",d.metallicRoughnessTexture)),l.push(t.assignTexture(o,"roughnessMap",d.metallicRoughnessTexture))),a=this._invokeOne(function(u){return u.getMaterialType&&u.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(u){return u.extendMaterialParams&&u.extendMaterialParams(e,o)})))}s.doubleSided===!0&&(o.side=Ht);const h=s.alphaMode||ba.OPAQUE;if(h===ba.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===ba.MASK&&(o.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&a!==Kt&&(l.push(t.assignTexture(o,"normalMap",s.normalTexture)),o.normalScale=new Xe(1,1),s.normalTexture.scale!==void 0)){const d=s.normalTexture.scale;o.normalScale.set(d,d)}if(s.occlusionTexture!==void 0&&a!==Kt&&(l.push(t.assignTexture(o,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&a!==Kt){const d=s.emissiveFactor;o.emissive=new Ne().setRGB(d[0],d[1],d[2],Yt)}return s.emissiveTexture!==void 0&&a!==Kt&&l.push(t.assignTexture(o,"emissiveMap",s.emissiveTexture,Et)),Promise.all(l).then(function(){const d=new a(o);return s.name&&(d.name=s.name),bn(d,s),t.associations.set(d,{materials:e}),s.extensions&&xi(i,d,s),d})}createUniqueName(e){const t=lt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function s(o){return n[je.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(c){return kc(c,o,t)})}const a=[];for(let o=0,c=e.length;o<c;o++){const l=e[o],h=zx(l),d=i[h];if(d)a.push(d.promise);else{let u;l.extensions&&l.extensions[je.KHR_DRACO_MESH_COMPRESSION]?u=s(l):u=kc(new Ot,l,t),i[h]={primitive:l,promise:u},a.push(u)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,i=this.extensions,s=n.meshes[e],a=s.primitives,o=[];for(let c=0,l=a.length;c<l;c++){const h=a[c].material===void 0?Ox(this.cache):this.getDependency("material",a[c].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(c){const l=c.slice(0,c.length-1),h=c[c.length-1],d=[];for(let f=0,x=h.length;f<x;f++){const g=h[f],m=a[f];let p;const _=l[f];if(m.mode===nn.TRIANGLES||m.mode===nn.TRIANGLE_STRIP||m.mode===nn.TRIANGLE_FAN||m.mode===void 0)p=s.isSkinnedMesh===!0?new _u(g,_):new Y(g,_),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),m.mode===nn.TRIANGLE_STRIP?p.geometry=Nc(p.geometry,mh):m.mode===nn.TRIANGLE_FAN&&(p.geometry=Nc(p.geometry,vo));else if(m.mode===nn.LINES)p=new wu(g,_);else if(m.mode===nn.LINE_STRIP)p=new tl(g,_);else if(m.mode===nn.LINE_LOOP)p=new Tu(g,_);else if(m.mode===nn.POINTS)p=new Eu(g,_);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&kx(p,s),p.name=t.createUniqueName(s.name||"mesh_"+e),bn(p,s),m.extensions&&xi(i,p,m),t.assignFinalMaterial(p),d.push(p)}for(let f=0,x=d.length;f<x;f++)t.associations.set(d[f],{meshes:e,primitives:f});if(d.length===1)return s.extensions&&xi(i,d[0],s),d[0];const u=new nt;s.extensions&&xi(i,u,s),t.associations.set(u,{meshes:e});for(let f=0,x=d.length;f<x;f++)u.add(d[f]);return u})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new qt(Er.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Ur(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),bn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const s=i.pop(),a=i,o=[],c=[];for(let l=0,h=a.length;l<h;l++){const d=a[l];if(d){o.push(d);const u=new Ve;s!==null&&u.fromArray(s.array,l*16),c.push(u)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new Jo(o,c)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,a=[],o=[],c=[],l=[],h=[];for(let d=0,u=i.channels.length;d<u;d++){const f=i.channels[d],x=i.samplers[f.sampler],g=f.target,m=g.node,p=i.parameters!==void 0?i.parameters[x.input]:x.input,_=i.parameters!==void 0?i.parameters[x.output]:x.output;g.node!==void 0&&(a.push(this.getDependency("node",m)),o.push(this.getDependency("accessor",p)),c.push(this.getDependency("accessor",_)),l.push(x),h.push(g))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(c),Promise.all(l),Promise.all(h)]).then(function(d){const u=d[0],f=d[1],x=d[2],g=d[3],m=d[4],p=[];for(let S=0,M=u.length;S<M;S++){const E=u[S],T=f[S],R=x[S],v=g[S],w=m[S];if(E===void 0)continue;E.updateMatrix&&E.updateMatrix();const B=n._createAnimationTracks(E,T,R,v,w);if(B)for(let C=0;C<B.length;C++)p.push(B[C])}const _=new Vu(s,void 0,p);return bn(_,i),_})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){const a=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let c=0,l=i.weights.length;c<l;c++)o.morphTargetInfluences[c]=i.weights[c]}),a})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),a=[],o=i.children||[];for(let l=0,h=o.length;l<h;l++)a.push(n.getDependency("node",o[l]));const c=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(a),c]).then(function(l){const h=l[0],d=l[1],u=l[2];u!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(u,Vx)});for(let f=0,x=d.length;f<x;f++)h.add(d[f]);if(h.userData.pivot!==void 0&&d.length>0){const f=h.userData.pivot,x=d[0];h.pivot=new L().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],x.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const s=t.nodes[e],a=s.name?i.createUniqueName(s.name):"",o=[],c=i._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&o.push(c),s.camera!==void 0&&o.push(i.getDependency("camera",s.camera).then(function(l){return i._getNodeRef(i.cameraCache,s.camera,l)})),i._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){o.push(l)}),this.nodeCache[e]=Promise.all(o).then(function(l){let h;if(s.isBone===!0?h=new Sh:l.length>1?h=new nt:l.length===1?h=l[0]:h=new vt,h!==l[0])for(let d=0,u=l.length;d<u;d++)h.add(l[d]);if(s.name&&(h.userData.name=s.name,h.name=a),bn(h,s),s.extensions&&xi(n,h,s),s.matrix!==void 0){const d=new Ve;d.fromArray(s.matrix),h.applyMatrix4(d)}else s.translation!==void 0&&h.position.fromArray(s.translation),s.rotation!==void 0&&h.quaternion.fromArray(s.rotation),s.scale!==void 0&&h.scale.fromArray(s.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){const d=i.associations.get(h);i.associations.set(h,{...d})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,s=new nt;n.name&&(s.name=i.createUniqueName(n.name)),bn(s,n),n.extensions&&xi(t,s,n);const a=n.nodes||[],o=[];for(let c=0,l=a.length;c<l;c++)o.push(i.getDependency("node",a[c]));return Promise.all(o).then(function(c){for(let h=0,d=c.length;h<d;h++){const u=c[h];u.parent!==null?s.add(Co(u)):s.add(u)}const l=h=>{const d=new Map;for(const[u,f]of i.associations)(u instanceof gn||u instanceof Ct)&&d.set(u,f);return h.traverse(u=>{const f=i.associations.get(u);f!=null&&d.set(u,f)}),d};return i.associations=l(s),s})}_createAnimationTracks(e,t,n,i,s){const a=[],o=e.name?e.name:e.uuid,c=[];ri[s.path]===ri.weights?e.traverse(function(u){u.morphTargetInfluences&&c.push(u.name?u.name:u.uuid)}):c.push(o);let l;switch(ri[s.path]){case ri.weights:l=$i;break;case ri.rotation:l=Zi;break;case ri.translation:case ri.scale:l=Ji;break;default:switch(n.itemSize){case 1:l=$i;break;case 2:case 3:default:l=Ji;break}break}const h=i.interpolation!==void 0?Fx[i.interpolation]:As,d=this._getArrayFromAccessor(n);for(let u=0,f=c.length;u<f;u++){const x=new l(c[u]+"."+ri[s.path],t.array,d,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(x),a.push(x)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=Lo(t.constructor),i=new Float32Array(t.length);for(let s=0,a=t.length;s<a;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof Zi?Ux:Hh;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function Wx(r,e,t){const n=e.attributes,i=new xn;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],c=o.min,l=o.max;if(c!==void 0&&l!==void 0){if(i.set(new L(c[0],c[1],c[2]),new L(l[0],l[1],l[2])),o.normalized){const h=Lo(Wi[o.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const s=e.targets;if(s!==void 0){const o=new L,c=new L;for(let l=0,h=s.length;l<h;l++){const d=s[l];if(d.POSITION!==void 0){const u=t.json.accessors[d.POSITION],f=u.min,x=u.max;if(f!==void 0&&x!==void 0){if(c.setX(Math.max(Math.abs(f[0]),Math.abs(x[0]))),c.setY(Math.max(Math.abs(f[1]),Math.abs(x[1]))),c.setZ(Math.max(Math.abs(f[2]),Math.abs(x[2]))),u.normalized){const g=Lo(Wi[u.componentType]);c.multiplyScalar(g)}o.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}r.boundingBox=i;const a=new Dn;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,r.boundingSphere=a}function kc(r,e,t){const n=e.attributes,i=[];function s(a,o){return t.getDependency("accessor",a).then(function(c){r.setAttribute(o,c)})}for(const a in n){const o=Po[a]||a.toLowerCase();o in r.attributes||i.push(s(n[a],o))}if(e.indices!==void 0&&!r.index){const a=t.getDependency("accessor",e.indices).then(function(o){r.setIndex(o)});i.push(a)}return Qe.workingColorSpace!==Yt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Qe.workingColorSpace}" not supported.`),bn(r,e),Wx(r,e,t),Promise.all(i).then(function(){return e.targets!==void 0?Bx(r,e.targets,t):r})}class Xx extends vh{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;const e=new an;e.deleteAttribute("uv");const t=new Je({side:Vt}),n=new Je,i=new Ih(16777215,900,28,2);i.position.set(.418,16.199,.3),this.add(i);const s=new Y(e,t);s.position.set(-.757,13.219,.717),s.scale.set(31.713,28.305,28.591),this.add(s);const a=new Qo(e,n,6),o=new vt;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const c=new Y(e,zi(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const l=new Y(e,zi(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);const h=new Y(e,zi(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const d=new Y(e,zi(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);const u=new Y(e,zi(20));u.position.set(3.235,11.486,-12.541),u.scale.set(2.5,2,.1),this.add(u);const f=new Y(e,zi(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function zi(r){return new Du({color:0,emissive:16777215,emissiveIntensity:r})}class Qt{static contactShadowTexture=null;static skyGradientTexture=null;static microTextureCache=new Map;static enhancedScenes=new WeakSet;static cachedEnvMap=null;static cachedRendererRef=null;static enhanceScene(e){if(this.enhancedScenes.has(e))return;this.enhancedScenes.add(e),e.background||(e.background=new Ne(13625591));const t=e.onBeforeRender;let n=!1;e.onBeforeRender=function(i,s,a,...o){t&&t.call(this,i,s,a,...o),!n&&i&&(n=!0,Qt.enhanceRendererAndIBL(i,s),Qt.upgradeSceneMaterials(s))}}static enhanceRendererAndIBL(e,t){try{if(e.toneMapping=Ds,e.toneMappingExposure=.88,e.shadowMap&&(e.shadowMap.enabled=!0,e.shadowMap.type=No),!t.environment){if(this.cachedRendererRef!==e||!this.cachedEnvMap){const n=new To(e);n.compileEquirectangularShader();const i=new Xx,s=n.fromScene(i,.04);this.cachedEnvMap=s.texture,this.cachedRendererRef=e,i.dispose(),n.dispose()}t.environment=this.cachedEnvMap}"environmentIntensity"in t&&(t.environmentIntensity=.28)}catch{}}static upgradeSceneMaterials(e){e.traverse(t=>{const n=t;if(!n.isMesh||!n.material)return;const i=n.rotation.x<-1.2&&n.geometry?.boundingSphere&&n.geometry.boundingSphere.radius>18;if(Array.isArray(n.material))for(let s=0;s<n.material.length;s++)this.tuneMaterial(n.material[s],!i);else this.tuneMaterial(n.material,!i)})}static tuneMaterial(e,t){const n=e;!n||!n.isMeshStandardMaterial||((n.envMapIntensity===void 0||n.envMapIntensity===1)&&(n.envMapIntensity=.35),t&&!n.transparent&&this.applyRimLight(n,16775403,.14))}static applyRimLight(e,t=16775403,n=.26){if(e.userData?.hasVisualEnhancerRim)return e;e.userData=e.userData||{},e.userData.hasVisualEnhancerRim=!0;const i=new Ne(t),s=e.onBeforeCompile;return e.onBeforeCompile=(a,o)=>{s&&s(a,o),a.uniforms.uRimColor={value:i},a.uniforms.uRimStrength={value:n},a.fragmentShader=`uniform vec3 uRimColor;
uniform float uRimStrength;
`+a.fragmentShader,a.fragmentShader=a.fragmentShader.replace("#include <dithering_fragment>",`#include <dithering_fragment>
        vec3 veViewDir = normalize(vViewPosition);
        float veRim = 1.0 - max(dot(normalize(normal), veViewDir), 0.0);
        veRim = pow(veRim, 2.75) * uRimStrength;
        gl_FragColor.rgb += uRimColor * veRim;`)},e.customProgramCacheKey=()=>`ve-rim-${t}-${n.toFixed(2)}`,e}static createBeveledBox(e=1,t=1,n=1,i=.08,s=3){return new Pe(e,t,n,s,i)}static createContactShadow(e=.8,t=.35){if(!this.contactShadowTexture&&typeof document<"u"){const a=document.createElement("canvas");a.width=128,a.height=128;const o=a.getContext("2d");if(o){const c=o.createRadialGradient(64,64,6,64,64,60);c.addColorStop(0,"rgba(15, 23, 42, 0.55)"),c.addColorStop(.55,"rgba(15, 23, 42, 0.22)"),c.addColorStop(1,"rgba(15, 23, 42, 0.0)"),o.fillStyle=c,o.fillRect(0,0,128,128)}this.contactShadowTexture=new vr(a),this.contactShadowTexture.needsUpdate=!0}const n=new $n(e*2,e*2),i=new Kt({map:this.contactShadowTexture,transparent:!0,opacity:t,depthWrite:!1}),s=new Y(n,i);return s.rotation.x=-Math.PI/2,s.position.y=.015,s}static createSkyDome(e=120){if(!this.skyGradientTexture&&typeof document<"u"){const i=document.createElement("canvas");i.width=64,i.height=256;const s=i.getContext("2d");if(s){const a=s.createLinearGradient(0,0,0,256);a.addColorStop(0,"#a5d8f3"),a.addColorStop(.48,"#cfe8f7"),a.addColorStop(.85,"#f4f9fc"),a.addColorStop(1,"#fcf8ee"),s.fillStyle=a,s.fillRect(0,0,64,256)}this.skyGradientTexture=new vr(i),this.skyGradientTexture.colorSpace=Et,this.skyGradientTexture.needsUpdate=!0}const t=new Dr(e,24,16),n=new Kt({map:this.skyGradientTexture,side:Vt,depthWrite:!1,fog:!1});return new Y(t,n)}static createMicroTexture(e){if(this.microTextureCache.has(e))return this.microTextureCache.get(e);if(typeof document>"u")return null;const t=document.createElement("canvas");t.width=256,t.height=256;const n=t.getContext("2d");if(n)if(e==="wood"){n.fillStyle="#f5ebe0",n.fillRect(0,0,256,256),n.strokeStyle="rgba(180, 140, 100, 0.14)",n.lineWidth=2;for(let s=0;s<256;s+=6)n.beginPath(),n.moveTo(0,s),n.bezierCurveTo(85,s+(s%12-6),170,s-(s%10-5),256,s),n.stroke()}else if(e==="stone"){n.fillStyle="#f1f5f9",n.fillRect(0,0,256,256);for(let s=0;s<420;s++){const a=s*73%256,o=s*137%256;n.fillStyle=s%2===0?"rgba(148, 163, 184, 0.12)":"rgba(255, 255, 255, 0.25)",n.fillRect(a,o,3,3)}}else if(e==="grid"){n.fillStyle="#fcf8ee",n.fillRect(0,0,256,256),n.strokeStyle="rgba(148, 163, 184, 0.22)",n.lineWidth=2;for(let s=0;s<=256;s+=32)n.beginPath(),n.moveTo(s,0),n.lineTo(s,256),n.moveTo(0,s),n.lineTo(256,s),n.stroke()}else{n.fillStyle="#ffffff",n.fillRect(0,0,256,256);const s=n.createLinearGradient(0,0,256,256);s.addColorStop(0,"rgba(255,255,255,0.12)"),s.addColorStop(1,"rgba(226,232,240,0.12)"),n.fillStyle=s,n.fillRect(0,0,256,256)}const i=new vr(t);return i.wrapS=Cn,i.wrapT=Cn,i.colorSpace=Et,i.needsUpdate=!0,this.microTextureCache.set(e,i),i}}class Ta{static loader=null;static modelCache=new Map;static pendingPromises=new Map;static getLoader(){return this.loader||(this.loader=new dx),this.loader}static resolveHybridModel(e){const t=new nt,n=e.proceduralFallback();if(t.add(n),e.contactShadowRadius){const s=Qt.createContactShadow(e.contactShadowRadius,.58);s.position.y=.02,t.add(s)}const i=this.modelCache.get(e.modelUrl);if(i){const s=Co(i);return e.tintColorHex!==void 0&&this.applyTint(s,e.tintColorHex),t.remove(n),t.add(s),e.onLoaded?.(s),t}return this.fetchAndNormalizeModel(e.modelUrl,e).then(s=>{if(s){const a=Co(s);e.tintColorHex!==void 0&&this.applyTint(a,e.tintColorHex),t.remove(n),t.add(a),e.onLoaded?.(a)}}).catch(()=>{}),t}static async fetchAndNormalizeModel(e,t){if(this.modelCache.has(e))return this.modelCache.get(e);if(this.pendingPromises.has(e))return this.pendingPromises.get(e);const n=new Promise(i=>{this.getLoader().load(e,a=>{const o=a.scene||a.scenes[0];if(!o){i(null);return}const c=new nt;c.add(o),o.traverse(u=>{const f=u;if(f.isMesh&&(f.castShadow=!0,f.receiveShadow=!0,f.material)){const x=Array.isArray(f.material)?f.material:[f.material];for(const g of x)(g instanceof Je||g instanceof _n)&&(g.roughness=Er.clamp(g.roughness??.45,.35,.65),g.metalness=Er.clamp(g.metalness??.15,.05,.85),Qt.applyRimLight(g,16774885,.22))}});const l=new xn().setFromObject(c),h=new L;l.getSize(h);const d=new L;if(l.getCenter(d),t.targetSize){let u=1;if(t.targetSize.maxDim){const f=Math.max(h.x,h.y,h.z)||1;u=t.targetSize.maxDim/f}else t.targetSize.y?u=t.targetSize.y/(h.y||1):t.targetSize.z?u=t.targetSize.z/(h.z||1):t.targetSize.x&&(u=t.targetSize.x/(h.x||1));o.scale.setScalar(u),l.setFromObject(c),l.getSize(h),l.getCenter(d)}t.pivotAlignment!=="center"?(o.position.x-=d.x,o.position.y-=l.min.y,o.position.z-=d.z):(o.position.x-=d.x,o.position.y-=d.y,o.position.z-=d.z),this.modelCache.set(e,c),i(c)},void 0,()=>{i(null)})});return this.pendingPromises.set(e,n),n}static applyTint(e,t){e.traverse(n=>{const i=n;if(i.isMesh&&i.material){const s=Array.isArray(i.material)?i.material[0]:i.material;s&&s.color&&!i.name.toLowerCase().includes("glass")&&!i.name.toLowerCase().includes("wheel")&&s.color.setHex(t)}})}}class gs{static textureCache=new Map;static createCarChassis(e=2.4,t=1.25,n=.65,i={baseColorHex:2450411}){const s=new nt,a=new Pe(t,n*.55,e,4,.12),o=this.createRacingLiveryTexture(i),c=new Je({map:o,roughness:.38,metalness:.18});Qt.applyRimLight(c,16774885,.25);const l=new Y(a,c);l.position.set(0,n*.38,0),l.castShadow=!0,l.receiveShadow=!0,s.add(l);const h=e*.52,d=t*.82,u=n*.55,f=new Pe(d,u,h,3,.1),x=new Je({color:988970,roughness:.15,metalness:.85}),g=new Y(f,x);g.position.set(0,n*.76,-e*.04),g.castShadow=!0,s.add(g);const m=new $n(d*.9,u*.7),p=new Je({color:3718648,roughness:.1,metalness:.4,transparent:!0,opacity:.45}),_=new Y(m,p);_.position.set(0,n*.78,h*.5+.01),_.rotation.x=-.32,s.add(_);const S=new Je({color:1976635,roughness:.6,metalness:.25}),M=new Y(new Pe(t*1.05,.12,.42,2,.04),S);M.position.set(0,.18,e*.52),M.castShadow=!0,s.add(M);const E=new Je({color:16707722,emissive:16638023,emissiveIntensity:.65,roughness:.2}),T=new Pe(.24,.12,.12,2,.03),R=new Y(T,E);R.position.set(-t*.36,n*.46,e*.5);const v=new Y(T,E);v.position.set(t*.36,n*.46,e*.5),s.add(R,v);const w=new Y(new Pe(t*1.08,.08,.32,2,.03),S);w.position.set(0,n*1.08,-e*.46),w.castShadow=!0;const B=new Y(new an(.06,.36,.12),S);B.position.set(-t*.35,n*.88,-e*.44);const C=new Y(new an(.06,.36,.12),S);C.position.set(t*.35,n*.88,-e*.44),s.add(w,B,C);const N=new Je({color:15680580,emissive:14427686,emissiveIntensity:.75,roughness:.2}),F=new Y(new Pe(t*.72,.08,.1,2,.02),N);F.position.set(0,n*.48,-e*.51),s.add(F);const z=new wt(.08,.09,.22,10);z.rotateX(Math.PI/2);const k=new Je({color:9741240,metalness:.9,roughness:.2}),O=new Y(z,k);O.position.set(-t*.22,.22,-e*.52);const H=new Y(z,k);return H.position.set(t*.22,.22,-e*.52),s.add(O,H),s}static createDetailedWheel(e=.32,t=.26,n=16436245,i=988970){const s=new nt,a=new wt(e,e,t,18);a.rotateZ(Math.PI/2);const o=new Je({color:i,roughness:.65,metalness:.08}),c=new Y(a,o);c.castShadow=!0,s.add(c);const l=new nt,h=new Is(e*.68,.04,8,18);h.rotateY(Math.PI/2);const d=new Je({color:n,metalness:.78,roughness:.25}),u=new Y(h,d);u.position.x=t*.48,l.add(u);const f=new wt(e*.25,e*.25,.06,12);f.rotateZ(Math.PI/2);const x=new Y(f,d);x.position.x=t*.48,l.add(x);const g=new an(.04,e*.56,.06);for(let T=0;T<5;T++){const R=new Y(g,d);R.position.x=t*.48,R.rotation.x=T*Math.PI*2/5,l.add(R)}s.add(l);const m=new wt(e*.52,e*.52,.03,16);m.rotateZ(Math.PI/2);const p=new Je({color:9741240,metalness:.92,roughness:.28}),_=new Y(m,p);_.position.x=t*.15,s.add(_);const S=new an(.06,e*.28,e*.28),M=new Je({color:15680580,roughness:.4,metalness:.3}),E=new Y(S,M);return E.position.set(t*.16,e*.32,0),s.add(E),{group:s,tireMesh:c,rimGroup:l}}static createRacingLiveryTexture(e){const t=`livery_${e.baseColorHex}_${e.stripeColorHex??16777215}_${e.numberText??"7"}`,n=this.textureCache.get(t);if(n)return n;const i=document.createElement("canvas");i.width=512,i.height=512;const s=i.getContext("2d"),a=`#${e.baseColorHex.toString(16).padStart(6,"0")}`;if(s.fillStyle=a,s.fillRect(0,0,512,512),e.hasCarbonHood!==!1){s.fillStyle="rgba(15, 23, 42, 0.18)";for(let h=300;h<512;h+=8)for(let d=60;d<452;d+=8)(d+h)%16===0&&s.fillRect(d,h,4,4)}const o=e.stripeColorHex!==void 0?`#${e.stripeColorHex.toString(16).padStart(6,"0")}`:"#ffffff";s.fillStyle=o,s.fillRect(206,0,36,512),s.fillRect(270,0,36,512);const c=e.accentColorHex!==void 0?`#${e.accentColorHex.toString(16).padStart(6,"0")}`:"#facc15";s.fillStyle=c,s.fillRect(198,0,6,512),s.fillRect(308,0,6,512),s.fillStyle="#ffffff",s.beginPath(),s.arc(256,170,56,0,Math.PI*2),s.fill(),s.lineWidth=6,s.strokeStyle="#0f172a",s.stroke(),s.font='900 64px "Outfit", system-ui, sans-serif',s.fillStyle="#0f172a",s.textAlign="center",s.textBaseline="middle",s.fillText(e.numberText??"7",256,172);const l=new vr(i);return l.wrapS=Cn,l.wrapT=Cn,l.needsUpdate=!0,this.textureCache.set(t,l),l}static createContactShadowMesh(e=1.4,t=.55){return Qt.createContactShadow(e,t)}}class xt{static sharedMatCache=new Map;static getBaseUrl(){return import.meta.env?.BASE_URL??"./"}static getMat(e,t,n=.5,i=.08){const s=`${e}_${t.toString(16)}_${n}_${i}`;let a=this.sharedMatCache.get(s);return a||(a=new Je({color:t,roughness:Math.max(.45,n),metalness:i}),Qt.applyRimLight(a,16775403,.18),this.sharedMatCache.set(s,a)),a}static createVehiclePrefab(e,t,n,i){const s=new nt;s.name=`Vehicle_${e}`;const a=new nt;a.name="chassis",s.add(a);const o=[],c=n==="gloss"||n==="metallic"?n:"matte",h=(Z=>{const Ue=new Je({color:Z,roughness:c==="gloss"?.32:c==="metallic"?.35:.52,metalness:c==="metallic"?.48:c==="gloss"?.14:.06});return Qt.applyRimLight(Ue,16774885,.24),o.push(Ue),Ue})(t),d=this.getMat("trim_slate",3359061,.52,.22),u=this.getMat("frame_steel",6583435,.46,.45),f=new Je({color:1976635,roughness:.2,metalness:.65}),x=new Je({color:8246268,roughness:.22,metalness:.35,transparent:!0,opacity:.55});let g=.44,m=.32,p=1.02,_=[[-1.02,.44,-1.42],[1.02,.44,-1.42],[-1.02,.44,1.42],[1.02,.44,1.42]],S=[0,1.78,.05],M=[.82,1.38,-.58];const E=()=>{const Z=new nt;if(e==="dune-buggy"){g=.46,m=.34,p=1.12,_=[[-1.12,.46,-1.48],[1.12,.46,-1.48],[-1.12,.46,1.45],[1.12,.46,1.45]],S=[0,1.62,.1],M=[.68,1.25,-.45];const ce=new Y(new Pe(1.42,.44,3.35,3,.09),h);ce.position.set(0,.64,0),ce.castShadow=!0,ce.receiveShadow=!0,Z.add(ce);const Me=new Y(new Pe(1.18,.32,1.35,3,.08),h);Me.position.set(0,.82,-1.05),Me.rotation.x=.16,Me.castShadow=!0,Z.add(Me);const me=new wt(.055,.055,1.65,8),ze=new Y(me,u);ze.position.set(-.58,1.22,.05),ze.rotation.x=.25;const P=new Y(me,u);P.position.set(.58,1.22,.05),P.rotation.x=.25;const gt=new Y(new Pe(1.22,.08,1.35,2,.03),h);gt.position.set(0,1.56,.12),Z.add(ze,P,gt);const Ze=new Y(new Pe(.95,.52,.85,2,.05),u);Ze.position.set(0,.96,1.18),Z.add(Ze)}else if(e==="canyon-pickup"){g=.48,m=.34,p=1.08,_=[[-1.08,.48,-1.68],[1.08,.48,-1.68],[-1.08,.48,1.68],[1.08,.48,1.68]],S=[0,1.94,-.35],M=[.92,1.48,-.92];const ce=new Y(new Pe(1.94,.62,4.45,3,.1),h);ce.position.set(0,.78,0),ce.castShadow=!0,ce.receiveShadow=!0,Z.add(ce);const Me=new Y(new Pe(1.78,.72,1.95,3,.1),h);Me.position.set(0,1.42,-.32),Me.castShadow=!0,Z.add(Me);const me=new Y(new Pe(1.81,.46,1.65,2,.05),f);me.position.set(0,1.44,-.32),Z.add(me);const ze=new Y(new Pe(1.72,.15,1.75,2,.03),d);ze.position.set(0,1.05,1.32);const P=new Y(new Pe(1.56,.38,.48,2,.04),u);P.position.set(0,1.22,.76),Z.add(ze,P)}else if(e==="rally-raid"){g=.46,m=.34,p=1.06,_=[[-1.06,.46,-1.45],[1.06,.46,-1.45],[-1.06,.46,1.45],[1.06,.46,1.45]],S=[0,1.78,-.05],M=[.88,1.36,-.75];const ce=gs.createCarChassis(3.85,1.92,1.15,{baseColorHex:t,stripeColorHex:16707722,accentColorHex:16347926,numberText:"44"});ce.rotation.y=Math.PI,ce.position.y=.38,Z.add(ce);const Me=new Y(new Pe(.56,.22,.85,2,.05),h);Me.position.set(0,1.68,-.1),Z.add(Me)}else if(e==="rock-crawler"){g=.58,m=.42,p=1.22,_=[[-1.22,.58,-1.55],[1.22,.58,-1.55],[-1.22,.58,1.55],[1.22,.58,1.55]],S=[0,1.92,0],M=[.8,1.52,-.68];const ce=new Y(new Pe(1.56,.56,3.4,3,.08),h);ce.position.set(0,.98,0),ce.castShadow=!0,Z.add(ce);const Me=new Y(new Pe(1.48,.65,1.95,3,.12),d);Me.position.set(0,1.52,.05),Z.add(Me);const me=new Y(new qx(.06,.06,.95,8),u);me.position.set(0,1.15,-1.85),me.rotation.x=-.55,Z.add(me)}else if(e==="mammoth-6x6"){g=.52,m=.38,p=1.16,_=[[-1.16,.52,-1.95],[1.16,.52,-1.95],[-1.16,.52,.58],[1.16,.52,.58],[-1.16,.52,1.92],[1.16,.52,1.92]],S=[0,2.12,-1.05],M=[.98,1.65,-1.55];const ce=new Y(new Pe(2.05,.58,5.25,3,.08),h);ce.position.set(0,.86,0),ce.castShadow=!0,ce.receiveShadow=!0,Z.add(ce);const Me=new Y(new Pe(1.96,.88,2.05,3,.1),h);Me.position.set(0,1.54,-1.12),Me.castShadow=!0,Z.add(Me);const me=new Y(new Pe(1.99,.44,1.65,2,.04),f);me.position.set(0,1.62,-1.15),Z.add(me);const ze=new Y(new Pe(1.88,.72,2.65,3,.08),d);ze.position.set(0,1.46,1.22),ze.castShadow=!0,Z.add(ze)}else if(e==="apex-hyper"){g=.46,m=.36,p=1.12,_=[[-1.12,.46,-1.52],[1.12,.46,-1.52],[-1.12,.46,1.52],[1.12,.46,1.52]],S=[0,1.62,-.05],M=[.92,1.24,-.68];const ce=gs.createCarChassis(4.15,2.06,1.05,{baseColorHex:t,stripeColorHex:988970,accentColorHex:3718648,numberText:"01",hasCarbonHood:!0});ce.rotation.y=Math.PI,ce.position.y=.42,Z.add(ce)}else{g=.45,m=.32,p=1.02,_=[[-1.02,.45,-1.38],[1.02,.45,-1.38],[-1.02,.45,1.38],[1.02,.45,1.38]],S=[0,1.84,.1],M=[.86,1.42,-.68];const ce=new Y(new Pe(1.84,.62,3.75,3,.1),h);ce.position.set(0,.76,0),ce.castShadow=!0,ce.receiveShadow=!0,Z.add(ce);const Me=new Y(new Pe(1.72,.72,2.25,3,.1),h);Me.position.set(0,1.42,.28),Me.castShadow=!0,Z.add(Me);const me=new Y(new Pe(1.75,.45,1.95,2,.04),f);me.position.set(0,1.45,.26),Z.add(me);const ze=new Y(new $n(1.52,.44),x);ze.position.set(0,1.46,-.87),ze.rotation.y=Math.PI,ze.rotation.x=.18,Z.add(ze);const P=gs.createDetailedWheel(.38,.24,9741240,1976635);P.group.rotation.y=Math.PI/2,P.group.position.set(0,1.12,1.98),Z.add(P.group)}const Ue=e==="mammoth-6x6"?-2.65:e==="canyon-pickup"?-2.25:-1.92,De=new Y(new Pe(p*1.85,.24,.34,2,.05),d);De.position.set(0,.56,Ue),De.castShadow=!0,Z.add(De);for(let ce=0;ce<_.length;ce++){const[Me,me,ze]=_[ce],P=new Y(new Pe(.36,.22,g*2.25,2,.06),d);P.position.set(Me*.92,me+g*.82,ze),Z.add(P)}return Z},T=this.getBaseUrl(),R=Ta.resolveHybridModel({modelUrl:`${T}models/vehicle-${e}.glb`,targetSize:{maxDim:e==="mammoth-6x6"?5.3:3.9},pivotAlignment:"bottom-center",tintColorHex:t,contactShadowRadius:e==="mammoth-6x6"?2.6:1.9,proceduralFallback:E});a.add(R);const v=[],w=[],B=e==="mammoth-6x6"?-2.62:e==="canyon-pickup"?-2.22:-1.88,C=e==="mammoth-6x6"?2.62:e==="canyon-pickup"?2.22:1.88,N=new Je({color:16707722,emissive:16638023,emissiveIntensity:.9,roughness:.25}),F=new Vn(1.65,9.5,14,1,!0);F.translate(0,-4.75,0),F.rotateX(-Math.PI/2);const z=new Kt({color:16710083,transparent:!0,opacity:.16,side:Ht,depthWrite:!1});for(const Z of[-1,1]){const Ue=new Y(new Pe(.28,.16,.1,2,.03),N);Ue.position.set(Z*(p*.68),.86,B),a.add(Ue),v.push(Ue);const De=new Y(F,z);De.position.set(Z*(p*.68),.82,B-.1),De.visible=!1,a.add(De),v.push(De)}const k=new Je({color:15680580,emissive:14427686,emissiveIntensity:.35,roughness:.3});for(const Z of[-1,1]){const Ue=new Y(new Pe(.32,.15,.1,2,.03),k);Ue.position.set(Z*(p*.68),.86,C),a.add(Ue),w.push(Ue)}const O=new nt;O.name="accLedBar",O.position.set(S[0],S[1],S[2]-.68);const H=new Y(new Pe(1.36,.12,.16,2,.03),d);O.add(H);for(let Z=0;Z<4;Z++){const Ue=new Y(new Pe(.24,.14,.14,2,.03),N);Ue.position.set(-.45+Z*.3,.06,-.04),O.add(Ue)}a.add(O);const J=new nt;J.name="accRoofRack",J.position.set(S[0],S[1],S[2]+.15);const Q=new Y(new Pe(1.42,.14,1.48,2,.04),d);J.add(Q);const he=gs.createDetailedWheel(.34,.22,16436245,1976635);he.group.rotation.z=Math.PI/2,he.group.position.set(-.22,.18,.15),J.add(he.group);const xe=new Y(new Pe(.28,.36,.42,2,.04),this.getMat("jerry_red",15680580,.48,.1));xe.position.set(.42,.22,-.2),J.add(xe),a.add(J);const le=new nt;le.name="accSnorkel",le.position.set(M[0],M[1],M[2]);const Be=new Y(new wt(.065,.075,.78,10),d);Be.rotation.x=.24;const it=new Y(new Pe(.18,.16,.24,2,.04),d);it.position.set(0,.4,.08),le.add(Be,it),a.add(le);const tt=[],$=[],se=new wt(.11,.11,.48,10),ae=this.getMat("spring_coil",15381256,.45,.35);for(let Z=0;Z<_.length;Z++){const[Ue,De,ce]=_[Z],Me=gs.createDetailedWheel(g,m,14870768,1976635);Ue<0&&(Me.rimGroup.position.x=-m*.48);const me=new nt;me.name=`wheel_${Z}`,me.position.set(Ue,De,ce),me.userData.restX=Ue,me.userData.restY=De,me.userData.restZ=ce,me.userData.radius=g,me.userData.isFront=ce<-.5,me.add(Me.group),s.add(me),tt.push(me);const ze=new Y(se,ae);ze.name=`spring_${Z}`,ze.position.set(Ue*.78,De+g*.65,ce),s.add(ze),$.push(ze)}let ke=!1;const Re={root:s,chassis:a,wheels:tt,springs:$,headlights:v,brakelights:w,accLedBar:O,accRoofRack:J,accSnorkel:le,setHeadlights(Z){ke=Z,N.emissiveIntensity=Z?2.2:.45;for(let Ue=0;Ue<v.length;Ue++){const De=v[Ue];De!==v[0]&&De!==v[2]&&(De.visible=Z)}},setBraking(Z){k.emissiveIntensity=Z?2.4:ke?.65:.25},setPaint(Z,Ue){const De=Ue==="gloss"?.28:Ue==="metallic"?.32:.55,ce=Ue==="metallic"?.48:Ue==="gloss"?.12:.05;for(let Me=0;Me<o.length;Me++)o[Me].color.setHex(Z),o[Me].roughness=De,o[Me].metalness=ce,o[Me].needsUpdate=!0},setAccessories(Z){O.visible=Z.includes("led_bar"),J.visible=Z.includes("roof_rack"),le.visible=Z.includes("snorkel")}};return Re.setPaint(t,c),Re.setAccessories(i),Re.setHeadlights(!1),Re.setBraking(!1),s.userData.vehicleHandles=Re,s}createVehiclePrefab(e,t,n,i){return xt.createVehiclePrefab(e,t,n,i)}static getVehicleHandles(e){return e.userData?.vehicleHandles?e.userData.vehicleHandles:this.createVehiclePrefab("trail-scout",16347926,"matte",[]).userData.vehicleHandles}getVehicleHandles(e){return xt.getVehicleHandles(e)}static createShowroomTurntable(){const e=new nt;e.name="ShowroomTurntable";const t=new wt(22,22,.3,48),n=this.getMat("studio_floor",16578798,.52,.04),i=new Y(t,n);i.position.y=-.22,i.receiveShadow=!0,e.add(i);const s=new wt(4.15,4.35,.22,48),a=this.getMat("turntable_rim",14870768,.48,.18),o=new Y(s,a);o.position.y=-.11,o.receiveShadow=!0,e.add(o);const c=new wt(3.8,3.85,.16,48),l=Qt.createMicroTexture("stone"),h=new Je({color:16317180,map:l,roughness:.48,metalness:.1}),d=new Y(c,h);d.position.y=-.08,d.receiveShadow=!0,e.add(d);const u=new Is(3.88,.045,10,48);u.rotateX(Math.PI/2);const f=new Je({color:16096779,emissive:14251782,emissiveIntensity:.65,roughness:.45}),x=new Y(u,f);x.position.y=-.01,e.add(x);const g=this.getMat("studio_arch",4674921,.48,.32);for(let m=0;m<3;m++){const p=(m-1)*Math.PI/4+Math.PI,_=new Y(new Pe(.45,4.2,.45,2,.05),g);_.position.set(Math.sin(p)*7.8,2,Math.cos(p)*7.8),_.castShadow=!0,e.add(_)}return e}createShowroomTurntable(){return xt.createShowroomTurntable()}static createBiomeEnvironment(e){const t=new nt;t.name=`BiomeEnv_${e}`;const n=e==="desert"?959977:e==="mountain"?12248829:3718648,i=new $n(1400,1400);i.rotateX(-Math.PI/2);const s=new Je({color:n,roughness:.45,metalness:.12,transparent:!0,opacity:.78}),a=new Y(i,s);a.position.y=-1.6,a.name="waterPlane",t.add(a);const o=e==="desert"?13135185:e==="mountain"?9741240:5999706,c=this.getMat(`horizon_peak_${e}`,o,.54,.05),l=this.getMat("snow_cap",16317180,.5,.05),h=24;for(let d=0;d<h;d++){const u=d/h*Math.PI*2,f=720+d%3*45,x=95+d%4*28,g=85+d%3*22,m=new Y(new Vn(g,x,7),c);if(m.position.set(Math.cos(u)*f,x*.42,Math.sin(u)*f),m.matrixAutoUpdate=!1,m.updateMatrix(),t.add(m),e==="mountain"||d%2===0){const p=new Y(new Vn(g*.42,x*.42,7),l);p.position.set(Math.cos(u)*f,x*.72,Math.sin(u)*f),p.matrixAutoUpdate=!1,p.updateMatrix(),t.add(p)}}return t}createBiomeEnvironment(e){return xt.createBiomeEnvironment(e)}static createBiomeDecorationProp(e,t){const n=new nt;if(n.name=`Prop_${e}_${t}`,t==="tree"){const i=this.getMat("tree_trunk",7029795,.55,.04),s=new Y(new wt(.28,.44,2.8,7),i);s.position.y=1.4,s.castShadow=!0,n.add(s);const a=e==="mountain"?3365959:e==="desert"?6660877:3900751,o=this.getMat(`foliage_${e}`,a,.52,.04);for(let c=0;c<3;c++){const l=new Y(new Vn(2.1-c*.45,2.6-c*.3,7),o);l.position.y=3.1+c*1.45,l.castShadow=!0,l.receiveShadow=!0,n.add(l)}}else if(t==="cactus"){const i=this.getMat("cactus_green",5078031,.52,.04),s=new Y(new Pe(.68,4.2,.68,2,.28),i);s.position.y=2.1,s.castShadow=!0,n.add(s);const a=new Y(new Pe(.46,1.6,.46,2,.2),i);a.position.set(-.62,2.4,0),a.castShadow=!0;const o=new Y(new Pe(.46,1.4,.46,2,.2),i);o.position.set(.62,2.8,0),o.castShadow=!0,n.add(a,o)}else if(t==="rock_arch"){const i=e==="desert"?13135185:e==="mountain"?6583435:7893356,s=this.getMat(`arch_rock_${e}`,i,.55,.05),a=new Y(new Pe(3.6,8.5,4.2,2,.45),s);a.position.set(-5.8,4.2,0),a.rotation.z=-.12,a.castShadow=!0,a.receiveShadow=!0;const o=new Y(new Pe(3.6,8.5,4.2,2,.45),s);o.position.set(5.8,4.2,0),o.rotation.z=.12,o.castShadow=!0,o.receiveShadow=!0;const c=new Y(new Pe(14.8,2.6,4.4,2,.5),s);c.position.set(0,8.4,0),c.castShadow=!0,c.receiveShadow=!0,n.add(a,o,c)}else if(t==="boulder"){const i=e==="desert"?13135185:e==="mountain"?6583435:7893356,s=this.getMat(`boulder_${e}`,i,.55,.05),a=new Y(new Ls(1.85,1),s);a.position.set(0,1.25,0),a.scale.set(1.2,.85,1.1),a.castShadow=!0,a.receiveShadow=!0;const o=new Y(new Ls(1.1,0),s);o.position.set(1.55,.75,.65),o.castShadow=!0,n.add(a,o)}else if(t==="bridge"){const i=this.getMat("bridge_wood",9132587,.54,.05),s=new Y(new Pe(5.8,.45,14,2,.08),i);s.position.y=.22,s.receiveShadow=!0,s.castShadow=!0,n.add(s);for(const a of[-2.65,2.65]){const o=new Y(new Pe(.28,.95,14,2,.05),i);o.position.set(a,.85,0),o.castShadow=!0,n.add(o)}}else if(t==="cave_arch"){const i=e==="desert"?11817737:e==="mountain"?4674921:5722958,s=this.getMat(`cave_${e}`,i,.55,.06),a=new Y(new Pe(3.8,7.2,9.5,2,.4),s);a.position.set(-5.2,3.6,0);const o=new Y(new Pe(3.8,7.2,9.5,2,.4),s);o.position.set(5.2,3.6,0);const c=new Y(new Pe(14.2,2.8,9.5,2,.45),s);c.position.set(0,7.4,0),a.castShadow=!0,o.castShadow=!0,c.castShadow=!0,n.add(a,o,c)}else if(t==="destructible_crate"){const i=this.getMat("wood_crate",14251782,.52,.06),s=new Y(new Pe(1.25,1.25,1.25,2,.08),i);s.position.y=.625,s.castShadow=!0,s.receiveShadow=!0,n.add(s)}else if(t==="destructible_fence"){const i=this.getMat("fence_wood",16096779,.5,.05),s=new Pe(.24,1.25,.24,2,.04),a=new Y(s,i);a.position.set(-1.7,.625,0);const o=new Y(s,i);o.position.set(1.7,.625,0);const c=new Pe(3.8,.22,.14,2,.03),l=new Y(c,i);l.position.set(0,.95,0);const h=new Y(c,i);h.position.set(0,.52,0),a.castShadow=!0,o.castShadow=!0,l.castShadow=!0,n.add(a,o,l,h)}else if(t==="ramp"){const i=this.getMat("ramp_deck",11817737,.52,.08),s=new Y(new Pe(5.6,.55,8.2,2,.08),i);s.position.set(0,1.05,0),s.rotation.x=.26,s.castShadow=!0,s.receiveShadow=!0,n.add(s)}return n}createBiomeDecorationProp(e,t){return xt.createBiomeDecorationProp(e,t)}static createCollectiblePrefab(e){const t=this.getBaseUrl(),n=()=>{const s=new nt;if(e==="crate"){const l=new Je({color:16096779,emissive:14251782,emissiveIntensity:.35,roughness:.45,metalness:.35}),h=this.getMat("chest_trim",7877903,.5,.2),d=new Y(new Pe(1.35,.82,.95,3,.08),l);d.position.y=.55,d.castShadow=!0,s.add(d);const u=new Y(new Pe(1.4,.38,1,3,.12),h);u.position.y=1.05,u.castShadow=!0,s.add(u)}else{const l=this.getMat("relic_pedestal",9741240,.52,.1),h=new Y(new wt(.65,.85,.55,8),l);h.position.y=.28,h.castShadow=!0,s.add(h);const d=new Je({color:16436245,emissive:16096779,emissiveIntensity:.55,roughness:.45,metalness:.45}),u=new Y(new Is(.58,.16,12,24),d);u.position.y=1.35,u.castShadow=!0,s.add(u);const f=new Y(new Cr(.32,0),new Je({color:3718648,emissive:959977,emissiveIntensity:.8,roughness:.45}));f.position.y=1.35,s.add(f)}const a=new Gi(1.2,1.5,24);a.rotateX(-Math.PI/2);const o=new Kt({color:e==="crate"?16096779:3718648,transparent:!0,opacity:.65,side:Ht,depthWrite:!1}),c=new Y(a,o);return c.position.y=.08,s.add(c),s},i=Ta.resolveHybridModel({modelUrl:`${t}models/collectible-${e}.glb`,targetSize:{maxDim:1.6},pivotAlignment:"bottom-center",contactShadowRadius:1.1,proceduralFallback:n});return i.name=`Collectible_${e}`,i}createCollectiblePrefab(e){return xt.createCollectiblePrefab(e)}static createWatchtowerPrefab(e){const t=this.getBaseUrl(),n=()=>{const s=new nt,a=e==="mountain"?4674921:7877903,o=this.getMat(`tower_frame_${e}`,a,.52,.2),c=this.getMat("tower_cabin",14251782,.48,.1),l=new wt(.18,.28,10.5,8),h=[[-1.6,-1.6],[1.6,-1.6],[-1.6,1.6],[1.6,1.6]];for(const[M,E]of h){const T=new Y(l,o);T.position.set(M,5.1,E),T.rotation.z=M>0?.08:-.08,T.rotation.x=E>0?-.08:.08,T.castShadow=!0,s.add(T)}const d=new Y(new Pe(4.2,.35,4.2,2,.06),o);d.position.y=10.2,d.castShadow=!0,s.add(d);const u=new Y(new Pe(2.8,2.2,2.8,2,.08),c);u.position.y=11.45,u.castShadow=!0,s.add(u);const f=new Y(new Vn(2.6,1.4,4),o);f.position.y=13.2,f.rotation.y=Math.PI/4,f.castShadow=!0,s.add(f);const x=new nt;x.name="radarDish",x.position.set(0,14.2,0);const g=new Y(new wt(.95,.2,.45,14),this.getMat("radar_metal",16317180,.45,.3));g.rotation.z=.65;const m=new Y(new Dr(.24,10,10),new Je({color:15680580,emissive:14427686,emissiveIntensity:1.4,roughness:.45}));m.position.y=.65,x.add(g,m),s.add(x),s.userData.radarDish=x;const p=new Gi(4.8,5.4,32);p.rotateX(-Math.PI/2);const _=new Kt({color:959977,transparent:!0,opacity:.55,side:Ht,depthWrite:!1}),S=new Y(p,_);return S.name="zoneRing",S.position.y=.12,s.add(S),s},i=Ta.resolveHybridModel({modelUrl:`${t}models/watchtower-${e}.glb`,targetSize:{y:14.5},pivotAlignment:"bottom-center",proceduralFallback:n});return i.name=`Watchtower_${e}`,i}createWatchtowerPrefab(e){return xt.createWatchtowerPrefab(e)}static createWaypointBeaconPrefab(e=16096779){const t=new nt;t.name="WaypointBeacon";const n=new wt(1.6,3.2,68,18,1,!0);n.translate(0,34,0);const i=new Kt({color:e,transparent:!0,opacity:.24,side:Ht,depthWrite:!1}),s=new Y(n,i);s.name="beaconBeam",t.add(s);const a=new Gi(4.6,5.6,36);a.rotateX(-Math.PI/2);const o=new Kt({color:e,transparent:!0,opacity:.82,side:Ht,depthWrite:!1}),c=new Y(a,o);c.position.y=.16,c.name="beaconRing",t.add(c);const l=new Je({color:e,emissive:e,emissiveIntensity:.65,roughness:.45,metalness:.2}),h=new Y(new Cr(1.15,0),l);return h.position.y=3.6,h.scale.set(1,1.45,1),h.name="beaconChevron",t.add(h),t.userData.beam=s,t.userData.ring=c,t.userData.chevron=h,t}createWaypointBeaconPrefab(e=16096779){return xt.createWaypointBeaconPrefab(e)}}class qx extends wt{}const zc=1400,dr=660,Hc=60,Tt={waypointBaseReward:110,waypointHardBonusMultiplier:1.3,watchtowerReward:120,biome10CollectiblesJackpot:1200,grandFrontierBonus:1e3,airtimeBaseReward:35,cliffRescueCashDrop:250,upgradeLevelCosts:[0,250,550,1050,1800],maxUpgradeLevel:5,statBonusPerLevel:.06},pn=[{id:"trail-scout",name:"Trail Scout 4x4",classTr:"Klasik Arazi Cip",cost:0,wheels:4,maxSpeedKmh:88,speedStat:52,torqueStat:58,gripStat:62,suspensionStat:60,restSuspensionM:.38,wheelRadiusM:.48,wheelbaseM:2.7,trackWidthM:1.85,cgHeightM:.72,massKg:1750,defaultColorHex:16347926,signatureStrengthTr:"Dengeli başlangıç 4x4 arazi aracı"},{id:"dune-buggy",name:"Dune Buggy V6",classTr:"Hafif Çöl & Ralli Buggy",cost:1200,wheels:4,maxSpeedKmh:118,speedStat:78,torqueStat:54,gripStat:66,suspensionStat:76,restSuspensionM:.48,wheelRadiusM:.5,wheelbaseM:2.85,trackWidthM:2.05,cgHeightM:.58,massKg:1280,defaultColorHex:15381256,signatureStrengthTr:"Yüksek hız, dev rampa uçuşları ve kum çevikliği"},{id:"canyon-pickup",name:"Canyon Pickup 4x4",classTr:"Ağır Hizmet Çift Kabin Kamyonet",cost:2500,wheels:4,maxSpeedKmh:102,speedStat:66,torqueStat:74,gripStat:72,suspensionStat:68,restSuspensionM:.44,wheelRadiusM:.52,wheelbaseM:3.35,trackWidthM:1.98,cgHeightM:.76,massKg:2350,defaultColorHex:15680580,signatureStrengthTr:"Güçlü çamur torku ve uzun şasi dengesi"},{id:"rally-raid",name:"Rally Raid SUV",classTr:"Dakar Sınıfı Keşif SUV",cost:4200,wheels:4,maxSpeedKmh:134,speedStat:88,torqueStat:76,gripStat:80,suspensionStat:80,restSuspensionM:.5,wheelRadiusM:.52,wheelbaseM:2.95,trackWidthM:2.04,cgHeightM:.66,massKg:1880,defaultColorHex:959977,signatureStrengthTr:"Tüm zeminlerde yüksek hız ve keskin viraj hakimiyeti"},{id:"rock-crawler",name:"Rock Crawler Pro",classTr:"Kafes Şasi Kaya Tırmanıcı",cost:6800,wheels:4,maxSpeedKmh:96,speedStat:62,torqueStat:92,gripStat:94,suspensionStat:96,restSuspensionM:.68,wheelRadiusM:.64,wheelbaseM:3.1,trackWidthM:2.25,cgHeightM:.68,massKg:1960,defaultColorHex:2278750,signatureStrengthTr:"Ekstrem süspansiyon esnemesi; dik kayalara tırmanır"},{id:"mammoth-6x6",name:"Mammoth 6x6 Truck",classTr:"6 Tekerlekli Ağır Keşif Kamyonu",cost:1e4,wheels:6,maxSpeedKmh:92,speedStat:60,torqueStat:98,gripStat:92,suspensionStat:86,restSuspensionM:.56,wheelRadiusM:.62,wheelbaseM:4.2,trackWidthM:2.3,cgHeightM:.82,massKg:3400,defaultColorHex:1409085,signatureStrengthTr:"6 bağımsız çeker tekerlek; derin çamur ve zirvelerde durdurulamaz"},{id:"apex-hyper",name:"Apex Hyper 4x4",classTr:"Ultra Arazi Süper Spor 4x4",cost:15e3,wheels:4,maxSpeedKmh:155,speedStat:98,torqueStat:95,gripStat:96,suspensionStat:90,restSuspensionM:.58,wheelRadiusM:.56,wheelbaseM:3.05,trackWidthM:2.18,cgHeightM:.56,massKg:1690,defaultColorHex:6514417,signatureStrengthTr:"Maksimum hız, tırmanma torku ve aktif süspansiyon bir arada"}],Vc=[{hex:16347926,cssHex:"#f97316",nameTr:"Keşif Turuncusu"},{hex:15680580,cssHex:"#ef4444",nameTr:"Kızıl Kanyon"},{hex:15381256,cssHex:"#eab308",nameTr:"Çöl Fırtınası Sarısı"},{hex:2278750,cssHex:"#22c55e",nameTr:"Zümrüt Yeşili"},{hex:1409085,cssHex:"#15803d",nameTr:"Taktik Haki"},{hex:959977,cssHex:"#0ea5e9",nameTr:"Alp Buzul Mavisi"},{hex:2450411,cssHex:"#2563eb",nameTr:"Kobalt Mavisi"},{hex:6514417,cssHex:"#6366f1",nameTr:"Gece İndigo"},{hex:11032055,cssHex:"#a855f7",nameTr:"Kraliyet Ametist"},{hex:16317180,cssHex:"#f8fafc",nameTr:"Zirve Beyazı"},{hex:9741240,cssHex:"#94a3b8",nameTr:"Titanyum Gümüş"},{hex:3359061,cssHex:"#334155",nameTr:"Kaya Grafit"}],Gc=[{id:"matte",nameTr:"Mat Arazi Boyası",roughness:.55,metalness:.05},{id:"gloss",nameTr:"Parlak Vernikli",roughness:.28,metalness:.12},{id:"metallic",nameTr:"Metalik Sedefli",roughness:.32,metalness:.48}],Io=[{id:"led_bar",nameTr:"Tavan LED Projektör",descTr:"Mağara ve tüneller için 4x güçlü tavan spot ışığı",cost:250},{id:"roof_rack",nameTr:"Keşif Sepeti & Yedek Lastik",descTr:"Tavan kafesi, yakıt bidonları ve tam boy stepne",cost:400},{id:"snorkel",nameTr:"Çöl & Nehir Şnorkeli",descTr:"Derin su ve çamur geçişlerinde +%15 çekiş verimi",cost:350}],Wc=[{id:"engine",nameTr:"Motor Torku & Güç",shortTr:"MOTOR",icon:"🔥",descTr:"Hızlanma, maksimum hız ve dik yokuş tırmanma torkunu artırır"},{id:"suspension",nameTr:"Süspansiyon Esnemesi",shortTr:"SÜSPANSİYON",icon:"🔩",descTr:"Yay çalışma mesafesini, sönümlemeyi ve rampa iniş dengesini artırır"},{id:"tires",nameTr:"Arazi Lastik Tutunması",shortTr:"LASTİK",icon:"🛞",descTr:"Çamur, kum, kaya ve buz üzerinde yanal/dikey tutunmayı artırır"},{id:"drivetrain",nameTr:"4x4 AWD Şanzıman",shortTr:"4x4 ŞANZIMAN",icon:"⚙️",descTr:"4x4 LOCK diferansiyel kilidi gücünü artırır, çamur/kum direncini düşürür"}],Vh={dirt_trail:{id:"dirt_trail",nameTr:"TOPRAK PATİKA",grip2WD:1,grip4WD:1.1,drag:.018,sinkDepthM:0,lockBoostPct:10,badgeColor:"#d97706"},deep_mud:{id:"deep_mud",nameTr:"DERİN ÇAMUR",grip2WD:.42,grip4WD:.86,drag:.085,sinkDepthM:.18,lockBoostPct:65,badgeColor:"#78350f"},soft_sand:{id:"soft_sand",nameTr:"YUMUŞAK ÇÖL KUMU",grip2WD:.5,grip4WD:.88,drag:.068,sinkDepthM:.14,lockBoostPct:55,badgeColor:"#eab308"},mountain_rock:{id:"mountain_rock",nameTr:"DİK DAĞ KAYASI",grip2WD:.72,grip4WD:.98,drag:.022,sinkDepthM:0,lockBoostPct:70,badgeColor:"#64748b"},alpine_ice:{id:"alpine_ice",nameTr:"ALP BUZULU & ÇAKIL",grip2WD:.36,grip4WD:.64,drag:.012,sinkDepthM:.02,lockBoostPct:45,badgeColor:"#38bdf8"},water_ford:{id:"water_ford",nameTr:"NEHİR & VAHA SUYU",grip2WD:.52,grip4WD:.76,drag:.11,sinkDepthM:.25,lockBoostPct:40,badgeColor:"#0284c7"}},Ft={forest:{id:"forest",nameTr:"ZÜMRÜT ORMAN VADİSİ",subtitleTr:"Çam Ormanları, Derin Çamur Bataklığı, Nehir Köprüleri & Gizli Şelale Mağarası",unlockWaypointsRequired:0,prerequisiteBiome:null,skyHex:13625591,fogHex:13625591,groundPrimaryHex:5999706,trailHex:9137998,secondarySurfaceHex:6045747,waterLevelY:-1.35,spawnX:0,spawnZ:45,spawnHeadingRad:Math.PI,landmarksTr:["Gizli Şelale Mağarası","Kütük Nehir Köprüleri","Derin Çamur Bataklığı","Eski Kereste Kampı"],watchtowers:[{id:"forest_wt_1",nameTr:"Kuzey Çam Gözetleme Kulesi",x:-240,z:-260,revealRadiusM:420},{id:"forest_wt_2",nameTr:"Doğu Şelale Sırtı Kulesi",x:290,z:-150,revealRadiusM:420},{id:"forest_wt_3",nameTr:"Güney Kereste Kampı Kulesi",x:-160,z:310,revealRadiusM:420}],collectibles:[{id:"f_crate_1",type:"crate",nameTr:"Altın Keşif Sandığı #1",locationHintTr:"Kuzey kütük köprüsünün altında",x:-120,z:-145,reward:180},{id:"f_crate_2",type:"crate",nameTr:"Altın Keşif Sandığı #2",locationHintTr:"Doğu çamur bataklığı adacığında",x:185,z:75,reward:180},{id:"f_crate_3",type:"crate",nameTr:"Altın Keşif Sandığı #3",locationHintTr:"Eski Kereste Kampı deposu arkasında",x:-265,z:180,reward:180},{id:"f_crate_4",type:"crate",nameTr:"Altın Keşif Sandığı #4",locationHintTr:"Güneybatı sık çam koruluğu içinde",x:-380,z:-70,reward:180},{id:"f_crate_5",type:"crate",nameTr:"Altın Keşif Sandığı #5",locationHintTr:"Kuzeydoğu nehir kıvrımı kıyısında",x:140,z:-340,reward:180},{id:"f_relic_1",type:"relic",nameTr:"Antik Orman Kalıntısı #1",locationHintTr:"Gizli Şelale Mağarası derinliğinde",x:355,z:-295,reward:320},{id:"f_relic_2",type:"relic",nameTr:"Antik Orman Kalıntısı #2",locationHintTr:"Kuzeybatı kayalık uçurum terasında",x:-410,z:-380,reward:320},{id:"f_relic_3",type:"relic",nameTr:"Antik Orman Kalıntısı #3",locationHintTr:"Güneybatı yüksek tepe zirvesinde",x:-330,z:390,reward:320},{id:"f_relic_4",type:"relic",nameTr:"Antik Orman Kalıntısı #4",locationHintTr:"Güneydoğu yosunlu taş sunak içinde",x:340,z:310,reward:320},{id:"f_relic_5",type:"relic",nameTr:"Antik Orman Kalıntısı #5",locationHintTr:"Merkez nehir deltası gizli geçidinde",x:45,z:-210,reward:320}],waypointNodes:[{nameTr:"Vadi Çam Geçidi",x:0,z:-130},{nameTr:"Kütük Köprü Geçişi",x:-140,z:-210},{nameTr:"Derin Çamur Bataklığı",x:165,z:-90},{nameTr:"Kereste Kampı İkmal Noktası",x:-230,z:155},{nameTr:"Şelale Mağarası Girişi",x:310,z:-260},{nameTr:"Güney Nehir Yatağı",x:95,z:265},{nameTr:"Batı Sırtı Tırmanışı",x:-350,z:-45},{nameTr:"Kuzeydoğu Gözetleme Yolu",x:245,z:210}],jumpRamps:[{nameTr:"Nehir Kütük Rampası",x:-45,z:-85,headingRad:.3,width:7,length:14,height:2.6},{nameTr:"Vadi Uçuş Tepesi",x:120,z:110,headingRad:-1.1,width:8,length:16,height:3.1},{nameTr:"Kereste Kampı Rampası",x:-195,z:40,headingRad:2.1,width:7,length:15,height:2.8}]},desert:{id:"desert",nameTr:"KIZIL KANYON & ÇÖL",subtitleTr:"Altın Kum Tepeleri, Kızıl Kumtaşı Kemerleri, Palmiye Vahası & Güneş Tapınağı",unlockWaypointsRequired:5,prerequisiteBiome:"forest",skyHex:14413565,fogHex:16115402,groundPrimaryHex:15123080,trailHex:13935475,secondarySurfaceHex:13135185,waterLevelY:-1.65,spawnX:0,spawnZ:50,spawnHeadingRad:Math.PI,landmarksTr:["Kızıl Kumtaşı Kemerleri","Palmiye Vaha Gölü","Antik Güneş Tapınağı","Dar Kanyon Uçuş Rampası"],watchtowers:[{id:"desert_wt_1",nameTr:"Kızıl Mesa Gözetleme Kulesi",x:-280,z:-230,revealRadiusM:430},{id:"desert_wt_2",nameTr:"Doğu Kum Tepesi Kulesi",x:310,z:-190,revealRadiusM:430},{id:"desert_wt_3",nameTr:"Güney Vaha Sırtı Kulesi",x:40,z:340,revealRadiusM:430}],collectibles:[{id:"d_crate_1",type:"crate",nameTr:"Altın Çöl Sandığı #1",locationHintTr:"Palmiye Vaha Gölü adacığında",x:-85,z:-165,reward:180},{id:"d_crate_2",type:"crate",nameTr:"Altın Çöl Sandığı #2",locationHintTr:"Büyük Kızıl Kemer ayağında",x:220,z:-95,reward:180},{id:"d_crate_3",type:"crate",nameTr:"Altın Çöl Sandığı #3",locationHintTr:"Batı Kumulları çukurunda",x:-340,z:95,reward:180},{id:"d_crate_4",type:"crate",nameTr:"Altın Çöl Sandığı #4",locationHintTr:"Dar Kanyon geçidi ortasında",x:145,z:230,reward:180},{id:"d_crate_5",type:"crate",nameTr:"Altın Çöl Sandığı #5",locationHintTr:"Kuzey Kaktüs Vadisi kayalığında",x:-60,z:-370,reward:180},{id:"d_relic_1",type:"relic",nameTr:"Antik Güneş Kalıntısı #1",locationHintTr:"Antik Güneş Tapınağı iç odasında",x:365,z:-320,reward:320},{id:"d_relic_2",type:"relic",nameTr:"Antik Güneş Kalıntısı #2",locationHintTr:"Kuzeybatı yüksek mesa platosunda",x:-420,z:-350,reward:320},{id:"d_relic_3",type:"relic",nameTr:"Antik Güneş Kalıntısı #3",locationHintTr:"Güneybatı gizli kanyon mağarasında",x:-310,z:360,reward:320},{id:"d_relic_4",type:"relic",nameTr:"Antik Güneş Kalıntısı #4",locationHintTr:"Güneydoğu ikiz kemer zirvesinde",x:380,z:290,reward:320},{id:"d_relic_5",type:"relic",nameTr:"Antik Güneş Kalıntısı #5",locationHintTr:"Merkez kum fırtınası dikili taşında",x:55,z:-45,reward:320}],waypointNodes:[{nameTr:"Altın Kumul Sırtı",x:35,z:-120},{nameTr:"Palmiye Vaha Kıyısı",x:-115,z:-185},{nameTr:"Kızıl Kemer Geçidi",x:235,z:-110},{nameTr:"Antik Güneş Tapınağı",x:335,z:-285},{nameTr:"Dar Kanyon Tabanı",x:155,z:215},{nameTr:"Batı Mesa Tırmanışı",x:-295,z:115},{nameTr:"Kuzey Kaktüs Düzlüğü",x:-95,z:-340},{nameTr:"Güney Kumul Çanağı",x:-120,z:320}],jumpRamps:[{nameTr:"Kızıl Kanyon Uçuş Rampası",x:85,z:-70,headingRad:-.5,width:8,length:16,height:3.4},{nameTr:"Vaha Kumul Sıçrayışı",x:-150,z:-60,headingRad:.9,width:8,length:15,height:3},{nameTr:"Tapınak Kemer Rampası",x:250,z:90,headingRad:2.5,width:7.5,length:16,height:3.2}]},mountain:{id:"mountain",nameTr:"YABAN DAĞ ZİRVELERİ",subtitleTr:"Uçurum Virajları, Dev Kaya Basamakları, Terk Edilmiş Maden Tüneli & Buzul Zirve",unlockWaypointsRequired:5,prerequisiteBiome:"desert",skyHex:13625591,fogHex:14412542,groundPrimaryHex:9741240,trailHex:6583435,secondarySurfaceHex:15857145,waterLevelY:-2.2,spawnX:0,spawnZ:55,spawnHeadingRad:Math.PI,landmarksTr:["Keskin Uçurum Virajları","Terk Edilmiş Maden Tüneli","Uçurum Asma Köprüsü","Buzul Zirve Platosu"],watchtowers:[{id:"mountain_wt_1",nameTr:"Kuzey Buzul Radyo Kulesi",x:-260,z:-290,revealRadiusM:440},{id:"mountain_wt_2",nameTr:"Doğu Granit Zirve Kulesi",x:320,z:-210,revealRadiusM:440},{id:"mountain_wt_3",nameTr:"Güney Uçurum Fener Kulesi",x:-190,z:330,revealRadiusM:440}],collectibles:[{id:"m_crate_1",type:"crate",nameTr:"Altın Zirve Sandığı #1",locationHintTr:"Uçurum Asma Köprüsü karşı yakasında",x:-155,z:-155,reward:180},{id:"m_crate_2",type:"crate",nameTr:"Altın Zirve Sandığı #2",locationHintTr:"Doğu kaya basamakları sahanlığında",x:210,z:-65,reward:180},{id:"m_crate_3",type:"crate",nameTr:"Altın Zirve Sandığı #3",locationHintTr:"Batı keskin viraj seyir terasında",x:-330,z:70,reward:180},{id:"m_crate_4",type:"crate",nameTr:"Altın Zirve Sandığı #4",locationHintTr:"Güney buzul gölü kıyısında",x:115,z:275,reward:180},{id:"m_crate_5",type:"crate",nameTr:"Altın Zirve Sandığı #5",locationHintTr:"Kuzey karlı geçit sığınağında",x:40,z:-365,reward:180},{id:"m_relic_1",type:"relic",nameTr:"Antik Zirve Kalıntısı #1",locationHintTr:"Terk Edilmiş Maden Tüneli galerisinde",x:345,z:-310,reward:320},{id:"m_relic_2",type:"relic",nameTr:"Antik Zirve Kalıntısı #2",locationHintTr:"Kuzeybatı en yüksek buzul zirvesinde",x:-395,z:-375,reward:320},{id:"m_relic_3",type:"relic",nameTr:"Antik Zirve Kalıntısı #3",locationHintTr:"Güneybatı granit uçurum kovuğunda",x:-360,z:350,reward:320},{id:"m_relic_4",type:"relic",nameTr:"Antik Zirve Kalıntısı #4",locationHintTr:"Güneydoğu bulut üstü kaya kulesinde",x:375,z:315,reward:320},{id:"m_relic_5",type:"relic",nameTr:"Antik Zirve Kalıntısı #5",locationHintTr:"Merkez Zirve Platosu anıtında",x:0,z:-225,reward:320}],waypointNodes:[{nameTr:"Granit Kaya Basamakları",x:20,z:-135},{nameTr:"Uçurum Asma Köprüsü",x:-165,z:-165},{nameTr:"Maden Tüneli Geçidi",x:295,z:-255},{nameTr:"Buzul Zirve Platosu",x:-45,z:-270},{nameTr:"Batı Uçurum Virajları",x:-310,z:85},{nameTr:"Güney Karlı Sırt",x:135,z:255},{nameTr:"Kuzeybatı Zirve Tırmanışı",x:-340,z:-310},{nameTr:"Doğu Kaya Duvarı",x:290,z:165}],jumpRamps:[{nameTr:"Uçurum Kanyon Sıçrayışı",x:-75,z:-95,headingRad:-.4,width:8,length:16,height:3.6},{nameTr:"Buzul Zirve Rampası",x:110,z:-180,headingRad:1.2,width:8,length:16,height:3.5},{nameTr:"Maden Sırtı Uçuşu",x:195,z:120,headingRad:-2.2,width:7.5,length:15,height:3.2}]}};function Pr(r){for(let e=0;e<pn.length;e++)if(pn[e].id===r)return pn[e];return pn[0]}const Kx=[3.6,2.35,1.58,1.14,.85],xs=[7.5,14,21.5,29.5,48];class Yx{vehicleId;spec;group;handles;pos=new L;vel=new L;headingRad=Math.PI;pitchRad=0;rollRad=0;dynPitchRad=0;dynRollRad=0;vertVel=0;speedMps=0;speedKmh=0;rpm=850;currentGear=1;diffLock4x4=!1;headlightsOn=!1;handbrakeActive=!1;currentSurface="dirt_trail";currentSinkM=0;wheelCompression=new Float32Array(6);wheelCompVel=new Float32Array(6);wheelWorldPos=new L;wheelSpinRad=0;currentSteerRad=0;isAirborne=!1;airtimeSec=0;boggedTimer=0;rolloverTimer=0;needsRescuePrompt=!1;megaTorqueTimer=0;rescueShieldTimer=0;particleEmitTimer=0;constructor(e,t,n,i){this.vehicleId=e,this.spec=Pr(e),this.group=xt.createVehiclePrefab(e,t,n,i),this.handles=xt.getVehicleHandles(this.group);for(let s=0;s<this.handles.wheels.length;s++)this.handles.wheels[s].rotation.order="YXZ"}spawnAt(e,t,n,i){this.pos.set(e,t,n),this.vel.set(0,0,0),this.headingRad=i,this.pitchRad=0,this.rollRad=0,this.dynPitchRad=0,this.dynRollRad=0,this.vertVel=0,this.speedMps=0,this.speedKmh=0,this.rpm=850,this.currentGear=1,this.isAirborne=!1,this.airtimeSec=0,this.boggedTimer=0,this.rolloverTimer=0,this.needsRescuePrompt=!1,this.syncTransform()}recoverToSafeGround(e){const t=e(this.pos.x,this.pos.z)+1.6;this.pos.y=t,this.vel.set(0,0,0),this.vertVel=0,this.speedMps=0,this.speedKmh=0,this.pitchRad=0,this.rollRad=0,this.dynPitchRad=0,this.dynRollRad=0,this.isAirborne=!1,this.airtimeSec=0,this.boggedTimer=0,this.rolloverTimer=0,this.needsRescuePrompt=!1,this.syncTransform()}toggleDiffLock(e){return this.diffLock4x4=!this.diffLock4x4,e.playDiffLockToggle(this.diffLock4x4),this.diffLock4x4}toggleHeadlights(e){return this.headlightsOn=!this.headlightsOn,this.handles.setHeadlights(this.headlightsOn),e.playHeadlightClick(),this.headlightsOn}updatePhysics(e,t,n,i,s,a,o,c,l,h,d,u){this.megaTorqueTimer>0&&(this.megaTorqueTimer=Math.max(0,this.megaTorqueTimer-e)),this.rescueShieldTimer>0&&(this.rescueShieldTimer=Math.max(0,this.rescueShieldTimer-e)),this.handbrakeActive=i;const f=-Math.sin(this.headingRad),x=-Math.cos(this.headingRad),g=Math.cos(this.headingRad),m=-Math.sin(this.headingRad),p=this.spec.wheelbaseM*.5,_=this.spec.trackWidthM*.5,S=o(this.pos.x,this.pos.z),M=o(this.pos.x+f*p,this.pos.z+x*p),E=o(this.pos.x-f*p,this.pos.z-x*p),T=o(this.pos.x+g*_,this.pos.z+m*_),R=o(this.pos.x-g*_,this.pos.z-m*_);this.currentSurface=c(this.pos.x,this.pos.z);const v=Vh[this.currentSurface],w=Math.atan2(M-E,this.spec.wheelbaseM),B=Math.atan2(R-T,this.spec.trackWidthM);let C=this.diffLock4x4?v.grip4WD:v.grip2WD,N=v.drag,F=v.sinkDepthM;s.hasSnorkel&&(this.currentSurface==="water_ford"||this.currentSurface==="deep_mud")&&(C*=1.15,N*=.78,F*=.65),a==="easy"?(C*=1.25,N*=.75):a==="hard"&&((this.currentSurface==="deep_mud"||this.currentSurface==="alpine_ice")&&(C*=.85),(this.currentSurface==="deep_mud"||this.currentSurface==="soft_sand")&&(N*=1.2));const z=this.megaTorqueTimer>0||this.rescueShieldTimer>0?1.5:1,k=C*s.tiresMultiplier*(this.diffLock4x4?s.drivetrainMultiplier:1)*z;this.currentSinkM=ft(this.currentSinkM,F,6,e);const O=this.diffLock4x4?.52:.62,H=1/(1+Math.abs(this.speedMps)*.032),J=t*O*(.45+.55*H);this.currentSteerRad=ft(this.currentSteerRad,J,11,e);const Q=s.maxSpeedKmh/3.6*(this.diffLock4x4?.86:1)*(z>1?1.12:1),he=i||n<-.1&&this.speedMps>.8||n>.1&&this.speedMps<-.8;this.handles.setBraking(he);const xe=-9.81*Math.sin(w)*(this.diffLock4x4?.58:.88),le=this.currentGear;if(this.speedMps<-.4||this.speedMps<=.2&&n<-.1)this.currentGear="R";else{const q=Math.abs(this.speedMps),W=w>.14?3.5:0;q<xs[0]-W?this.currentGear=1:q<xs[1]-W?this.currentGear=2:q<xs[2]-W?this.currentGear=3:q<xs[3]-W?this.currentGear=4:this.currentGear=5}le!==this.currentGear&&le!=="R"&&this.currentGear!=="R"&&h.playGearShift(this.currentGear>le);const Be=this.currentGear==="R"?0:this.currentGear-1,it=Kx[Be],tt=ut(Math.abs(this.speedMps)/Math.max(4,xs[Be]),0,1.15),$=Math.abs(n)*1450+Math.max(0,w)*900,se=ut(820+tt*4300+$,800,6500);this.rpm=ft(this.rpm,se,12,e);const ae=(11.5+this.spec.torqueStat/100*10.5)*s.engineMultiplier*z,ke=.72+it*.22;let Re=this.speedMps;if(i)this.speedMps=ft(this.speedMps,0,6.8,e);else if(he){const q=24*ut(k,.5,1.4);this.speedMps>0?this.speedMps=Math.max(0,this.speedMps-q*e):this.speedMps=Math.min(0,this.speedMps+q*e)}else if(Math.abs(n)>.04){const q=n>0?1:-.55,W=ut(k,.32,1.65),ue=Math.abs(n)*ae*ke*W*q;this.speedMps+=(ue+xe)*e}else this.speedMps=ft(this.speedMps,0,1.6+N*18,e),this.speedMps+=xe*.5*e,Math.abs(this.speedMps)<.18&&Math.abs(w)<.08&&(this.speedMps=0);const Z=N*this.speedMps*Math.abs(this.speedMps)*.42;if(this.speedMps-=Z*e,this.speedMps=ut(this.speedMps,-Q*.42,Q),this.speedKmh=Math.abs(this.speedMps)*3.6,Math.abs(this.speedMps)>.15){const q=this.speedMps>=0?1:-1,W=i?1.55:1,ue=ut(k,.45,1.25),re=this.currentSteerRad*Math.min(Math.abs(this.speedMps),16)/Math.max(2.2,this.spec.wheelbaseM)*q*W*ue;this.headingRad+=re*e}const Ue=-Math.sin(this.headingRad),De=-Math.cos(this.headingRad);this.vel.x=ft(this.vel.x,Ue*this.speedMps,k*8.5,e),this.vel.z=ft(this.vel.z,De*this.speedMps,k*8.5,e),this.pos.x=ut(this.pos.x+this.vel.x*e,-dr,dr),this.pos.z=ut(this.pos.z+this.vel.z*e,-dr,dr);const ce=o(this.pos.x,this.pos.z)-this.currentSinkM,Me=this.isAirborne;if(this.pos.y>ce+.35||this.vertVel>1.5){if(this.isAirborne=!0,this.airtimeSec+=e,this.vertVel-=18.5*e,this.pos.y+=this.vertVel*e,this.pos.y<=ce){this.pos.y=ce;const q=Math.abs(this.vertVel);if(this.vertVel=0,this.isAirborne=!1,q>3){const W=ut(q/16,.25,1);h.playSuspensionImpact(W),u?.(W*.55);for(let ue=0;ue<6;ue++)this.wheelCompVel[ue]=-q*.35}Me&&this.airtimeSec>=1.15&&d?.(this.airtimeSec),this.airtimeSec=0}}else{const q=S-this.currentSinkM,W=(ce-q)/Math.max(.001,e);this.speedKmh>42&&w>.18&&W>2.2?this.vertVel=Math.min(13.5,Math.abs(this.speedMps)*Math.sin(w)*1.15):this.vertVel=0,this.pos.y=ft(this.pos.y,ce,22,e),this.isAirborne=!1,this.airtimeSec=0}const me=(this.speedMps-Re)/Math.max(.001,e),ze=this.currentSteerRad*this.speedMps*.55,P=a==="easy"?.65:a==="hard"?1.18:.92,gt=ut(me*.0065*P,-.14,.14),Ze=ut(-ze*.014*P,-.22,.22);this.dynPitchRad=ft(this.dynPitchRad,gt,9,e),this.dynRollRad=ft(this.dynRollRad,Ze,9,e),this.pitchRad=ft(this.pitchRad,w+this.dynPitchRad,12,e),this.rollRad=ft(this.rollRad,B+this.dynRollRad,12,e);const st=this.spec.wheelRadiusM;this.wheelSpinRad+=this.speedMps/Math.max(.25,st)*e;const _e=this.spec.restSuspensionM*s.suspensionMultiplier,A=this.handles.wheels,y=this.handles.springs;for(let q=0;q<A.length;q++){const W=A[q],ue=W.userData.restX||0,re=W.userData.restY||.44,Ae=W.userData.restZ||0,Fe=!!W.userData.isFront,ee=this.pos.x+g*ue-f*Ae,ie=this.pos.z+m*ue-x*Ae,Se=o(ee,ie)-this.currentSinkM,be=this.pos.y+Ae*Math.sin(this.pitchRad)-ue*Math.sin(this.rollRad),ge=Se-be,I=((this.isAirborne?-_e*.45:ut(ge,-_e,_e))-this.wheelCompression[q])*65,oe=-this.wheelCompVel[q]*12.5;if(this.wheelCompVel[q]+=(I+oe)*e,this.wheelCompression[q]=ut(this.wheelCompression[q]+this.wheelCompVel[q]*e,-_e,_e),W.position.y=re+this.wheelCompression[q],W.rotation.y=Fe?this.currentSteerRad:0,W.rotation.x=this.wheelSpinRad,y[q]){const ne=ut(1-this.wheelCompression[q]/(_e+.1),.55,1.45);y[q].scale.y=ne,y[q].position.y=W.position.y+st*.62}if(!this.isAirborne&&Math.abs(this.speedMps)>2.2&&q>=A.length-2&&(this.particleEmitTimer+=e,this.particleEmitTimer>=.045)){this.particleEmitTimer=0,this.wheelWorldPos.set(ee,Se,ie);const ne=ut(Math.abs(this.speedMps)/14,.35,1.5)+(i?.5:0);l.emitTireSurfaceParticles(this.wheelWorldPos,this.currentSurface,ne),h.playTerrainSfx(this.currentSurface)}}const D=Math.abs(this.rollRad)>.78||Math.abs(this.pitchRad)>.78,j=(this.currentSurface==="deep_mud"||this.currentSurface==="water_ford"||this.currentSurface==="soft_sand")&&Math.abs(n)>.5&&this.speedKmh<7.5&&!this.diffLock4x4;D?this.rolloverTimer+=e:this.rolloverTimer=Math.max(0,this.rolloverTimer-e*2),j?this.boggedTimer+=e:this.boggedTimer=Math.max(0,this.boggedTimer-e*1.5),this.needsRescuePrompt=this.rolloverTimer>1.8||this.boggedTimer>2.8,this.syncTransform()}syncTransform(){this.group.position.copy(this.pos),this.group.rotation.order="YXZ",this.group.rotation.y=this.headingRad,this.group.rotation.x=this.pitchRad,this.group.rotation.z=this.rollRad}}class jx{group;handles;pos=new L;headingRad=0;routePoints;targetNodeIdx=0;cruiseSpeedMps=8.5;currentSpeedMps=8.5;wheelSpinRad=0;lightFlashTimer=0;constructor(e,t,n,i,s=9){this.group=xt.createVehiclePrefab(e,t,"gloss",["led_bar","roof_rack"]),this.handles=xt.getVehicleHandles(this.group);for(let c=0;c<this.handles.wheels.length;c++)this.handles.wheels[c].rotation.order="YXZ";this.routePoints=n,this.targetNodeIdx=(i+1)%n.length,this.cruiseSpeedMps=s,this.currentSpeedMps=s;const a=n[i%n.length],o=n[this.targetNodeIdx];this.pos.set(a.x,0,a.z),this.headingRad=Math.atan2(-(o.x-a.x),-(o.z-a.z))}triggerFriendlyHonkResponse(){this.lightFlashTimer=1.6,this.handles.setHeadlights(!0)}update(e,t,n){if(this.lightFlashTimer>0){this.lightFlashTimer=Math.max(0,this.lightFlashTimer-e);const S=Math.floor(this.lightFlashTimer*8)%2===0;this.handles.setHeadlights(S)}const i=this.routePoints[this.targetNodeIdx],s=i.x-this.pos.x,a=i.z-this.pos.z;Math.hypot(s,a)<14&&(this.targetNodeIdx=(this.targetNodeIdx+1)%this.routePoints.length);const c=Math.atan2(-s,-a),l=this.headingRad;this.headingRad=Ro(this.headingRad,c,3.2,e);const h=Math.max(-.45,Math.min(.45,(this.headingRad-l)*6)),d=(t.x-this.pos.x)*(t.x-this.pos.x)+(t.z-this.pos.z)*(t.z-this.pos.z);let u=this.cruiseSpeedMps;d<324?(u=1.5,this.handles.setBraking(!0)):this.handles.setBraking(!1),this.currentSpeedMps=ft(this.currentSpeedMps,u,4.5,e);const f=-Math.sin(this.headingRad),x=-Math.cos(this.headingRad);this.pos.x+=f*this.currentSpeedMps*e,this.pos.z+=x*this.currentSpeedMps*e;const g=n(this.pos.x,this.pos.z),m=n(this.pos.x+f*1.6,this.pos.z+x*1.6),p=Math.atan2(m-g,1.6);this.pos.y=g,this.group.position.copy(this.pos),this.group.rotation.order="YXZ",this.group.rotation.y=this.headingRad,this.group.rotation.x=p,this.wheelSpinRad+=this.currentSpeedMps/.48*e;const _=this.handles.wheels;for(let S=0;S<_.length;S++){const M=_[S];M.userData.isFront&&(M.rotation.y=h),M.rotation.x=this.wheelSpinRad}}}const Xc=7;class $x{scene;cameraRig;lighting;effects;audio;store;callbacks;viewMode="showroom";difficulty="normal";slowMotionActive=!1;gpsChevronsVisible=!0;showroomRoot=new nt;showroomTurntable;showroomVehicleGroup=null;showroomVehicleHandles=null;turntableYawRad=0;showroomTargetPos=new L(0,.2,0);worldRoot=new nt;activeBiomeId="forest";terrainMesh=null;player=null;patrolBots=[];collectibles=[];watchtowers=[];destructibles=[];waypointBeaconGroup;activeWaypointIdx=0;activeWaypointNameTr="";activeWaypointPos=new L;activeWaypointDistM=0;gpsChevronGroup=new nt;gpsChevronMeshes=[];secretRadarTimer=0;radarCompassArrow;radarSignalBars=0;nearestCollectibleDistM=999;nearestCollectiblePos=new L;nearestCollectibleHintTr="";sonarPingAccumulator=0;elapsedSec=0;getTerrainHeightBound=(e,t)=>this.getTerrainHeight(e,t);getSurfaceTypeBound=(e,t)=>this.getSurfaceType(e,t);handleAirtimeComplete=e=>{const t=this.difficulty==="hard"?Tt.waypointHardBonusMultiplier:1,n=Math.round(ut(e*Tt.airtimeBaseReward,25,65)*t);this.store.addCash(n),this.callbacks.onCallout(`🦅 HAVADA KALMA (${e.toFixed(1)}s)! +$${n}`,"#38bdf8"),this.callbacks.onHudRefresh()};handleLandingImpact=e=>{this.cameraRig.addTrauma(e)};constructor(e,t,n,i,s,a,o){this.scene=e,this.cameraRig=t,this.lighting=n,this.effects=i,this.audio=s,this.store=a,this.callbacks=o,this.scene.add(this.showroomRoot),this.scene.add(this.worldRoot),this.showroomTurntable=xt.createShowroomTurntable(),this.showroomRoot.add(this.showroomTurntable),this.waypointBeaconGroup=xt.createWaypointBeaconPrefab(16096779),this.worldRoot.add(this.waypointBeaconGroup),this.initGpsChevrons(),this.radarCompassArrow=this.createRadarCompassArrow(),this.worldRoot.add(this.radarCompassArrow),this.enterShowroomGarage()}initGpsChevrons(){const e=new Vn(.55,1.35,4);e.rotateX(Math.PI/2);const t=new Je({color:16436245,emissive:16096779,emissiveIntensity:.75,roughness:.45});for(let n=0;n<Xc;n++){const i=new Y(e,t);this.gpsChevronGroup.add(i),this.gpsChevronMeshes.push(i)}this.worldRoot.add(this.gpsChevronGroup)}createRadarCompassArrow(){const e=new nt,t=new Je({color:3718648,emissive:165063,emissiveIntensity:.85,roughness:.45}),n=new Y(new an(.28,.18,1.3),t);n.position.z=.25;const i=new Y(new Vn(.52,.9,6),t);return i.rotation.x=-Math.PI/2,i.position.z=-.65,e.add(n,i),e.visible=!1,e}enterShowroomGarage(){this.viewMode="showroom",this.slowMotionActive=!1,this.showroomRoot.visible=!0,this.worldRoot.visible=!1,this.effects.clear(),this.lighting.setBiomeAtmosphere("forest"),this.lighting.updateSunFollow(this.showroomTargetPos),this.rebuildShowroomVehicle(),this.callbacks.onHudRefresh()}rebuildShowroomVehicle(e=this.store.data.selectedVehicleId){this.showroomVehicleGroup&&(this.showroomRoot.remove(this.showroomVehicleGroup),this.showroomVehicleGroup=null,this.showroomVehicleHandles=null);const t=this.store.getCustomization(e),n=xt.createVehiclePrefab(e,t.bodyColorHex,t.paintFinish,t.equippedAccessories);n.position.set(0,.02,0),n.rotation.y=this.turntableYawRad,this.showroomRoot.add(n),this.showroomVehicleGroup=n,this.showroomVehicleHandles=xt.getVehicleHandles(n),this.showroomVehicleHandles.setHeadlights(!0)}refreshShowroomCustomization(e=this.store.data.selectedVehicleId){if(!this.showroomVehicleHandles){this.rebuildShowroomVehicle(e);return}const t=this.store.getCustomization(e);this.showroomVehicleHandles.setPaint(t.bodyColorHex,t.paintFinish),this.showroomVehicleHandles.setAccessories(t.equippedAccessories)}startDrivingInBiome(e=this.store.data.selectedBiomeId){this.activeBiomeId=e,this.store.selectBiome(e),this.viewMode="driving",this.slowMotionActive=!1,this.showroomRoot.visible=!1,this.worldRoot.visible=!0,this.effects.clear(),this.lighting.setBiomeAtmosphere(e),this.buildBiomeWorld(e);const t=Ft[e],n=this.store.data.selectedVehicleId,i=this.store.getCustomization(n);this.player&&this.worldRoot.remove(this.player.group),this.player=new Yx(n,i.bodyColorHex,i.paintFinish,i.equippedAccessories);const s=this.getTerrainHeight(t.spawnX,t.spawnZ)+.5;this.player.spawnAt(t.spawnX,s,t.spawnZ,t.spawnHeadingRad),this.worldRoot.add(this.player.group),this.cameraRig.setMode("tps_chase"),this.selectWaypointTarget(this.store.data.biomeWaypoints[e]%t.waypointNodes.length),this.callbacks.onCallout(`🌍 ${t.nameTr} KEŞFİ BAŞLADI!`,"#f59e0b"),this.callbacks.onHudRefresh()}clearBiomeChildren(){const e=new Set([this.waypointBeaconGroup,this.gpsChevronGroup,this.radarCompassArrow]);for(let t=this.worldRoot.children.length-1;t>=0;t--){const n=this.worldRoot.children[t];e.has(n)||this.worldRoot.remove(n)}this.patrolBots.length=0,this.collectibles.length=0,this.watchtowers.length=0,this.destructibles.length=0,this.terrainMesh=null}buildBiomeWorld(e){this.clearBiomeChildren();const t=Ft[e],n=xt.createBiomeEnvironment(e);this.worldRoot.add(n);const i=140,s=new $n(zc,zc,i,i);s.rotateX(-Math.PI/2);const a=s.attributes.position,o=a.count,c=new Float32Array(o*3),l=new Ne;for(let g=0;g<o;g++){const m=a.getX(g),p=a.getZ(g),_=this.getTerrainHeightWithoutRamps(m,p,e);a.setY(g,_);const S=this.getSurfaceType(m,p,e);S==="dirt_trail"?l.setHex(t.trailHex):S==="deep_mud"?l.setHex(6045747):S==="soft_sand"?l.setHex(15583624):S==="mountain_rock"?l.setHex(e==="desert"?13135185:6583435):S==="alpine_ice"?l.setHex(15857145):S==="water_ford"?l.setHex(e==="desert"?12759680:4674921):l.setHex(t.groundPrimaryHex);const M=.94+Math.sin(m*.03+p*.03)*.06;c[g*3]=ut(l.r*M,0,1),c[g*3+1]=ut(l.g*M,0,1),c[g*3+2]=ut(l.b*M,0,1)}s.setAttribute("color",new Gt(c,3)),s.computeVertexNormals();const h=new Je({vertexColors:!0,roughness:.54,metalness:.04}),d=new Y(s,h);d.receiveShadow=!0,d.matrixAutoUpdate=!1,d.updateMatrix(),this.worldRoot.add(d),this.terrainMesh=d;for(let g=0;g<t.jumpRamps.length;g++){const m=t.jumpRamps[g],p=xt.createBiomeDecorationProp(e,"ramp"),_=this.getTerrainHeightWithoutRamps(m.x,m.z,e);p.position.set(m.x,_,m.z),p.rotation.y=m.headingRad,this.worldRoot.add(p)}const u=xt.createBiomeDecorationProp(e,"bridge");u.position.set(-120,this.getTerrainHeightWithoutRamps(-120,-145,e)+.3,-145),this.worldRoot.add(u);const f=xt.createBiomeDecorationProp(e,"cave_arch");f.position.set(345,this.getTerrainHeightWithoutRamps(345,-300,e),-300),f.rotation.y=.6,this.worldRoot.add(f);for(let g=0;g<64;g++){const m=g*2.39996,p=55+g*37%480,_=Math.cos(m)*p,S=Math.sin(m)*p;if(this.getSurfaceType(_,S,e)==="dirt_trail")continue;const M=this.getTerrainHeightWithoutRamps(_,S,e);if(M<t.waterLevelY+.4)continue;const E=g%9===0?"rock_arch":g%4===0?"boulder":e==="desert"?"cactus":"tree",T=xt.createBiomeDecorationProp(e,E);T.position.set(_,M,S),T.rotation.y=g*1.17%(Math.PI*2);const R=.85+g%5*.14;T.scale.setScalar(R),this.worldRoot.add(T)}for(let g=0;g<20;g++){const m=t.waypointNodes[g%t.waypointNodes.length],p=g*1.7%(Math.PI*2),_=m.x+Math.cos(p)*(12+g%3*6),S=m.z+Math.sin(p)*(12+g%3*6),M=this.getTerrainHeight(_,S),E=g%2===0?"destructible_crate":"destructible_fence",T=xt.createBiomeDecorationProp(e,E);T.position.set(_,M,S),T.rotation.y=p,this.worldRoot.add(T),this.destructibles.push({group:T,x:_,y:M,z:S,vx:0,vy:0,vz:0,hit:!1,resetTimer:0})}for(let g=0;g<t.watchtowers.length;g++){const m=t.watchtowers[g],p=xt.createWatchtowerPrefab(e),_=this.getTerrainHeight(m.x,m.z);p.position.set(m.x,_,m.z),this.worldRoot.add(p),this.watchtowers.push({def:m,group:p,yBase:_,activated:this.store.isWatchtowerActivated(m.id)})}for(let g=0;g<t.collectibles.length;g++){const m=t.collectibles[g],p=this.store.isCollectibleDiscovered(m.id),_=xt.createCollectiblePrefab(m.type),S=this.getTerrainHeight(m.x,m.z);_.position.set(m.x,S,m.z),_.visible=!p,this.worldRoot.add(_),this.collectibles.push({def:m,group:_,yBase:S,discovered:p})}const x=[{id:"trail-scout",color:16347926,speed:8.8},{id:"dune-buggy",color:15381256,speed:10.5},{id:"canyon-pickup",color:15680580,speed:8.2},{id:"rally-raid",color:959977,speed:11},{id:"mammoth-6x6",color:2278750,speed:7.8}];for(let g=0;g<x.length;g++){const m=x[g],p=new jx(m.id,m.color,t.waypointNodes,g,m.speed);p.pos.y=this.getTerrainHeight(p.pos.x,p.pos.z),this.worldRoot.add(p.group),this.patrolBots.push(p)}}getTrailProximityFactor(e,t){const n=Math.hypot(e,t),i=Math.abs(n-215),s=Math.abs(e*.7-t*.7),a=Math.abs(e+t*.35),o=Math.min(i,s,a);return o<9.5?1:o<22?1-(o-9.5)/12.5:0}getTerrainHeightWithoutRamps(e,t,n=this.activeBiomeId){const i=Math.hypot(e-0,t-45),s=ut((i-18)/28,0,1);if(s<=.001)return 0;const a=this.getTrailProximityFactor(e,t);let o=0;if(n==="forest"){const c=Math.sin(e*.0065)*Math.cos(t*.0065)*18+Math.sin(e*.018+t*.014)*5.2,l=Math.abs(t+140+Math.sin(e*.008)*75),h=l<34?-2.9*Math.cos(l/34*(Math.PI/2)):0,d=Math.hypot(e,t),u=d>360?(d-360)/300*42:0;o=(c*(1-a*.65)+h+u)*s}else if(n==="desert"){const c=Math.sin(e*.008+Math.cos(t*.006)*1.5)*14.5+Math.cos(t*.015-e*.009)*6.5,l=Math.hypot(e+95,t+170),h=l<52?-3.4*(1-l/52):0,d=Math.hypot(e,t),u=d>320?Math.min(52,(d-320)/220*48):0;o=(c*(1-a*.6)+h+u)*s}else{const c=Math.sin(e*.007)*Math.cos(t*.007)*28+Math.sin(e*.021-t*.019)*8.5+Math.cos(e*.045+t*.045)*1.6*(1-a),l=Math.hypot(e,t),h=l>180?(l-180)/480*58:0;o=(c*(1-a*.55)+h)*s}return o}getTerrainHeight(e,t){let n=this.getTerrainHeightWithoutRamps(e,t,this.activeBiomeId);const i=Ft[this.activeBiomeId].jumpRamps;for(let s=0;s<i.length;s++){const a=i[s],o=e-a.x,c=t-a.z;if(o*o+c*c>a.length*a.length)continue;const l=Math.cos(-a.headingRad),h=Math.sin(-a.headingRad),d=o*l-c*h,u=o*h+c*l;if(Math.abs(d)<=a.width*.55&&Math.abs(u)<=a.length*.5){const f=ut((a.length*.5-u)/a.length,0,1);n+=f*a.height}}return n}getSurfaceType(e,t,n=this.activeBiomeId){const i=Ft[n],s=this.getTerrainHeightWithoutRamps(e,t,n);return s<i.waterLevelY+.25?"water_ford":this.getTrailProximityFactor(e,t)>.68?"dirt_trail":n==="forest"?s<1.8&&Math.sin(e*.015+t*.012)>.15?"deep_mud":s>22?"mountain_rock":"dirt_trail":n==="desert"?s>19?"mountain_rock":"soft_sand":s>26?"alpine_ice":Math.abs(Math.sin(e*.02+t*.02))>.45?"mountain_rock":"dirt_trail"}selectWaypointTarget(e){const t=Ft[this.activeBiomeId].waypointNodes;this.activeWaypointIdx=(e%t.length+t.length)%t.length;const n=t[this.activeWaypointIdx];this.activeWaypointNameTr=n.nameTr;const i=this.getTerrainHeight(n.x,n.z);this.activeWaypointPos.set(n.x,i,n.z),this.waypointBeaconGroup.position.copy(this.activeWaypointPos)}triggerPlayerHorn(){if(!this.player)return;const e=this.player.spec.wheels===6||this.player.vehicleId==="canyon-pickup";this.audio.playHorn(e);let t=!1;for(let n=0;n<this.patrolBots.length;n++){const i=this.patrolBots[n];this.player.pos.distanceToSquared(i.pos)<=9025&&(i.triggerFriendlyHonkResponse(),t=!0)}t&&(this.audio.playBotHorn(),this.callbacks.onCallout("📯 KEŞİF EKİBİ KORNAYLA SELAMLADI!","#38bdf8"))}activateSecretRadarBooster(){this.secretRadarTimer=60,this.callbacks.onCallout("📡 GİZLİ ÖĞE RADAR PUSULASI AKTİF (60s)!","#38bdf8"),this.callbacks.onHudRefresh()}activateMegaTorqueBooster(){this.player&&(this.player.megaTorqueTimer=45),this.callbacks.onCallout("⚡ SÜPER 6x6 TORK & +%50 ÇEKİŞ AKTİF (45s)!","#10b981"),this.callbacks.onHudRefresh()}applyCliffRescueAndCashDrop(){this.player&&(this.player.recoverToSafeGround(this.getTerrainHeightBound),this.player.rescueShieldTimer=30,this.effects.emitShockwaveRing(this.player.pos,1096065,9)),this.store.addCash(Tt.cliffRescueCashDrop),this.audio.playUpgradeSuccess(),this.callbacks.onCallout(`🚁 SAHA KURTARMA & +$${Tt.cliffRescueCashDrop} DESTEK ALINDI!`,"#10b981"),this.callbacks.onHudRefresh()}update(e,t,n,i,s,a){if(this.elapsedSec+=e,this.viewMode==="showroom"){this.turntableYawRad+=e*.38-s*1.4,this.showroomVehicleGroup&&(this.showroomVehicleGroup.rotation.y=this.turntableYawRad),this.cameraRig.updateShowroom(e,this.showroomTargetPos,0),this.audio.updateEngineSound(800,0,!1);return}if(!this.player)return;const o=this.slowMotionActive?e*.4:e,c=this.store.getEffectiveStats(this.player.vehicleId);(s!==0||a!==0)&&this.cameraRig.addOrbitDelta(s,a),this.player.updatePhysics(o,t,n,i,c,this.difficulty,this.getTerrainHeightBound,this.getSurfaceTypeBound,this.effects,this.audio,this.handleAirtimeComplete,this.handleLandingImpact),this.audio.updateEngineSound(this.player.rpm,Math.abs(n),!0),this.cameraRig.updateDriving(e,this.player.pos,this.player.headingRad,this.player.pitchRad,this.player.rollRad,this.player.speedMps,this.getTerrainHeightBound),this.lighting.updateSunFollow(this.player.pos);for(let x=0;x<this.patrolBots.length;x++)this.patrolBots[x].update(o,this.player.pos,this.getTerrainHeightBound);for(let x=0;x<this.destructibles.length;x++){const g=this.destructibles[x];if(g.hit)g.resetTimer-=o,g.vy-=16*o,g.group.position.x+=g.vx*o,g.group.position.y=Math.max(g.y,g.group.position.y+g.vy*o),g.group.position.z+=g.vz*o,g.group.rotation.x+=4.5*o,g.group.rotation.z+=3.2*o,g.resetTimer<=0&&(g.hit=!1,g.group.position.set(g.x,g.y,g.z),g.group.rotation.set(0,x*1.7,0));else{const m=this.player.pos.x-g.x,p=this.player.pos.z-g.z;m*m+p*p<2.8*2.8&&this.player.speedKmh>10&&(g.hit=!0,g.resetTimer=12,g.vx=this.player.vel.x*1.25+(x%2===0?3:-3),g.vy=5.5+Math.min(6,this.player.speedMps*.35),g.vz=this.player.vel.z*1.25,this.audio.playSuspensionImpact(.45))}}for(let x=0;x<this.watchtowers.length;x++){const g=this.watchtowers[x],m=g.group.userData.radarDish;if(m&&(m.rotation.y+=o*(g.activated?2.6:.8)),!g.activated){const p=this.player.pos.x-g.def.x,_=this.player.pos.z-g.def.z;p*p+_*_<=10.5*10.5&&(g.activated=!0,this.store.recordWatchtowerActivated(g.def.id),this.audio.playWatchtowerActivated(),this.effects.emitCelebrationBurst(g.group.position,959977),this.callbacks.onCallout(`🗼 ${g.def.nameTr} AKTİF! +$${Tt.watchtowerReward} (Minimap Gizli Bölgeleri Açıldı)`,"#0ea5e9"),this.callbacks.onHudRefresh())}}let l=999999,h=null;for(let x=0;x<this.collectibles.length;x++){const g=this.collectibles[x];if(g.discovered)continue;g.group.rotation.y+=o*1.6,g.group.position.y=g.yBase+Math.sin(this.elapsedSec*3.2+x)*.22;const m=this.player.pos.x-g.def.x,p=this.player.pos.z-g.def.z,_=m*m+p*p;if(_<l&&(l=_,h=g),_<=6.2*6.2){g.discovered=!0,g.group.visible=!1;const S=this.difficulty==="hard"?Tt.waypointHardBonusMultiplier:1,M=Math.round(g.def.reward*S),E=this.store.recordCollectibleDiscovered(this.activeBiomeId,g.def.id,M);this.audio.playCollectibleFound(g.def.type==="relic"),this.effects.emitCelebrationBurst(g.group.position,g.def.type==="relic"?3718648:16096779),this.callbacks.onCallout(`💎 ${g.def.nameTr} BULUNDU! +$${M} (${E.foundInBiome}/${E.totalInBiome})`,"#facc15"),E.jackpotBonus>0&&this.callbacks.onMilestoneVictory({titleTr:"🏆 BİYOM 10/10 GİZLİ ÖĞE USTASI!",subtitleTr:`${Ft[this.activeBiomeId].nameTr} içindeki tüm 10 gizli öğeyi keşfettin!`,baseReward:E.jackpotBonus,unlockedBiomeId:null}),this.callbacks.onHudRefresh()}}if(h)if(this.nearestCollectibleDistM=Math.sqrt(l),this.nearestCollectiblePos.set(h.def.x,h.yBase,h.def.z),this.nearestCollectibleHintTr=h.def.locationHintTr,this.nearestCollectibleDistM<=Hc){const x=1-this.nearestCollectibleDistM/Hc;this.radarSignalBars=Math.min(5,Math.max(1,Math.ceil(x*5)));const g=Math.max(.22,1.05-this.radarSignalBars*.16);this.sonarPingAccumulator+=e,this.sonarPingAccumulator>=g&&(this.sonarPingAccumulator=0,this.audio.playSonarPing(this.radarSignalBars))}else this.radarSignalBars=0,this.sonarPingAccumulator=0;else this.nearestCollectibleDistM=999,this.radarSignalBars=0;if(this.secretRadarTimer>0&&h){this.secretRadarTimer=Math.max(0,this.secretRadarTimer-e),this.radarCompassArrow.visible=!0,this.radarCompassArrow.position.set(this.player.pos.x,this.player.pos.y+2.85,this.player.pos.z);const x=Math.atan2(-(h.def.x-this.player.pos.x),-(h.def.z-this.player.pos.z));this.radarCompassArrow.rotation.y=x}else this.radarCompassArrow.visible=!1;const d=this.activeWaypointPos.x-this.player.pos.x,u=this.activeWaypointPos.z-this.player.pos.z;this.activeWaypointDistM=Math.hypot(d,u);const f=this.waypointBeaconGroup.userData.chevron;if(f&&(f.rotation.y+=e*2.2,f.position.y=3.6+Math.sin(this.elapsedSec*3.5)*.45),this.gpsChevronGroup.visible=this.gpsChevronsVisible,this.gpsChevronsVisible&&this.activeWaypointDistM>8){const x=d/this.activeWaypointDistM,g=u/this.activeWaypointDistM,m=Math.atan2(x,g),p=this.elapsedSec*4%1;for(let _=0;_<Xc;_++){const S=this.gpsChevronMeshes[_],M=6.5+(_+p)*4.2;if(M>=this.activeWaypointDistM-4){S.visible=!1;continue}S.visible=!0;const E=this.player.pos.x+x*M,T=this.player.pos.z+g*M,R=this.getTerrainHeight(E,T)+.35;S.position.set(E,R,T),S.rotation.set(0,m,0)}}if(this.activeWaypointDistM<=9.5){const x=this.difficulty==="hard"?Tt.waypointHardBonusMultiplier:1,g=Math.round((Tt.waypointBaseReward+35)*x),m=this.store.recordWaypointCompleted(this.activeBiomeId,g);this.audio.playWaypointReached(),this.effects.emitCelebrationBurst(this.activeWaypointPos,2278750);const p=(this.activeWaypointIdx+1+m.totalInBiome%2)%Ft[this.activeBiomeId].waypointNodes.length;if(this.selectWaypointTarget(p),m.unlockedNewBiome){const _=Ft[m.unlockedNewBiome].nameTr;this.callbacks.onMilestoneVictory({titleTr:`🔓 YENİ BİYOM AÇILDI: ${_}!`,subtitleTr:`${Ft[this.activeBiomeId].nameTr} içinde 5/5 hedef tamamlandı!`,baseReward:g+250,unlockedBiomeId:m.unlockedNewBiome})}else m.grandFrontierBonus>0?this.callbacks.onMilestoneVictory({titleTr:"👑 GRAND FRONTIER KAŞİFİ UNVANI!",subtitleTr:"Her 3 açık dünya biyomunda da tüm ana hedefleri fethettin!",baseReward:g+m.grandFrontierBonus,unlockedBiomeId:null}):m.isMilestone5?this.callbacks.onMilestoneVictory({titleTr:`🏁 KEŞİF DÖNÜM NOKTASI (${m.totalInBiome}. HEDEF)!`,subtitleTr:`${Ft[this.activeBiomeId].nameTr} sefer ödülü hazır!`,baseReward:g+150,unlockedBiomeId:null}):this.callbacks.onCallout(`✅ HEDEF TAMAMLANDI! +$${g} (Biyom Hedef: ${m.totalInBiome}/5)`,"#22c55e");this.callbacks.onHudRefresh()}}}function Gh(){const r={};for(let e=0;e<pn.length;e++){const t=pn[e];r[t.id]={bodyColorHex:t.defaultColorHex,paintFinish:"gloss",ownedAccessories:[],equippedAccessories:[],upgrades:{engine:1,suspension:1,tires:1,drivetrain:1}}}return r}const Zx={cash:150,selectedVehicleId:"trail-scout",ownedVehicles:["trail-scout"],selectedBiomeId:"forest",unlockedBiomes:["forest"],biomeWaypoints:{forest:0,desert:0,mountain:0},discoveredCollectibles:[],activatedWatchtowers:[],grandFrontierAwarded:!1,biome10JackpotAwarded:{forest:!1,desert:!1,mountain:!1},vehicleCustomizations:Gh()};class Jx{data;sdk;constructor(e,t){this.sdk=e,this.data=this.sanitize(t)}sanitize(e){const t=Gh(),n={...t};if(e.vehicleCustomizations&&typeof e.vehicleCustomizations=="object")for(let l=0;l<pn.length;l++){const h=pn[l].id,d=e.vehicleCustomizations[h];d&&(n[h]={bodyColorHex:typeof d.bodyColorHex=="number"?d.bodyColorHex:t[h].bodyColorHex,paintFinish:d.paintFinish==="matte"||d.paintFinish==="gloss"||d.paintFinish==="metallic"?d.paintFinish:"gloss",ownedAccessories:Array.isArray(d.ownedAccessories)?[...d.ownedAccessories]:[],equippedAccessories:Array.isArray(d.equippedAccessories)?[...d.equippedAccessories]:[],upgrades:{engine:Math.min(5,Math.max(1,Number(d.upgrades?.engine)||1)),suspension:Math.min(5,Math.max(1,Number(d.upgrades?.suspension)||1)),tires:Math.min(5,Math.max(1,Number(d.upgrades?.tires)||1)),drivetrain:Math.min(5,Math.max(1,Number(d.upgrades?.drivetrain)||1))}})}const i=Array.isArray(e.ownedVehicles)?e.ownedVehicles.filter(l=>pn.some(h=>h.id===l)):["trail-scout"];i.includes("trail-scout")||i.unshift("trail-scout");const s={forest:Math.max(0,Number(e.biomeWaypoints?.forest)||0),desert:Math.max(0,Number(e.biomeWaypoints?.desert)||0),mountain:Math.max(0,Number(e.biomeWaypoints?.mountain)||0)},a=["forest"];(s.forest>=5||Array.isArray(e.unlockedBiomes)&&e.unlockedBiomes.includes("desert"))&&a.push("desert"),(s.desert>=5||Array.isArray(e.unlockedBiomes)&&e.unlockedBiomes.includes("mountain"))&&a.push("mountain");const o=i.includes(e.selectedVehicleId)?e.selectedVehicleId:"trail-scout",c=a.includes(e.selectedBiomeId)?e.selectedBiomeId:"forest";return{cash:Math.max(0,Math.floor(Number(e.cash)??150)),selectedVehicleId:o,ownedVehicles:i,selectedBiomeId:c,unlockedBiomes:a,biomeWaypoints:s,discoveredCollectibles:Array.isArray(e.discoveredCollectibles)?[...e.discoveredCollectibles]:[],activatedWatchtowers:Array.isArray(e.activatedWatchtowers)?[...e.activatedWatchtowers]:[],grandFrontierAwarded:!!e.grandFrontierAwarded,biome10JackpotAwarded:{forest:!!e.biome10JackpotAwarded?.forest,desert:!!e.biome10JackpotAwarded?.desert,mountain:!!e.biome10JackpotAwarded?.mountain},vehicleCustomizations:n}}persist(){this.sdk.saveData(this.data)}addCash(e){const t=Math.max(0,Math.floor(e));return this.data.cash+=t,this.sdk.sendScore(this.data.cash),this.persist(),t}spendCash(e){const t=Math.max(0,Math.floor(e));return this.data.cash<t?!1:(this.data.cash=Math.max(0,this.data.cash-t),this.persist(),!0)}isVehicleOwned(e){return this.data.ownedVehicles.includes(e)}buyOrSelectVehicle(e){const t=Pr(e);return this.isVehicleOwned(e)?(this.data.selectedVehicleId=e,this.persist(),{success:!0,purchased:!1,messageTr:`${t.name} seçildi!`}):this.spendCash(t.cost)?(this.data.ownedVehicles.push(e),this.data.selectedVehicleId=e,this.persist(),{success:!0,purchased:!0,messageTr:`🎉 ${t.name} filoya katıldı!`}):{success:!1,purchased:!1,messageTr:`Yetersiz Bakiye! ($${t.cost.toLocaleString("tr-TR")} gerekli)`}}getCustomization(e=this.data.selectedVehicleId){return this.data.vehicleCustomizations[e]}setBodyColor(e,t){const n=this.getCustomization(e);n.bodyColorHex=t,this.persist()}setPaintFinish(e,t){const n=this.getCustomization(e);n.paintFinish=t,this.persist()}toggleOrBuyAccessory(e,t){const n=this.getCustomization(e),i=Io.find(s=>s.id===t);if(!i)return{success:!1,purchased:!1,equipped:!1,messageTr:"Geçersiz aksesuar"};if(n.ownedAccessories.includes(t)){const s=n.equippedAccessories.indexOf(t);return s>=0?(n.equippedAccessories.splice(s,1),this.persist(),{success:!0,purchased:!1,equipped:!1,messageTr:`${i.nameTr} çıkarıldı`}):(n.equippedAccessories.push(t),this.persist(),{success:!0,purchased:!1,equipped:!0,messageTr:`${i.nameTr} takıldı`})}return this.spendCash(i.cost)?(n.ownedAccessories.push(t),n.equippedAccessories.push(t),this.persist(),{success:!0,purchased:!0,equipped:!0,messageTr:`🛠️ ${i.nameTr} satın alındı ve takıldı!`}):{success:!1,purchased:!1,equipped:!1,messageTr:`Yetersiz Bakiye! ($${i.cost} gerekli)`}}getUpgradeCost(e,t){const i=this.getCustomization(e).upgrades[t]||1;return i>=Tt.maxUpgradeLevel?null:Tt.upgradeLevelCosts[i]}upgradeMechanicalStat(e,t){const n=this.getCustomization(e),i=n.upgrades[t]||1;if(i>=Tt.maxUpgradeLevel)return{success:!1,newLevel:i,messageTr:"Maksimum Seviye (SV 5)!"};const s=Tt.upgradeLevelCosts[i];return this.spendCash(s)?(n.upgrades[t]=i+1,this.persist(),{success:!0,newLevel:n.upgrades[t],messageTr:`⬆️ Yükseltildi: Seviye ${n.upgrades[t]}/5!`}):{success:!1,newLevel:i,messageTr:`Yetersiz Bakiye! ($${s.toLocaleString("tr-TR")} gerekli)`}}getEffectiveStats(e=this.data.selectedVehicleId){const t=Pr(e),n=this.getCustomization(e),i=(n.upgrades.engine-1)*Tt.statBonusPerLevel,s=(n.upgrades.suspension-1)*Tt.statBonusPerLevel,a=(n.upgrades.tires-1)*Tt.statBonusPerLevel,o=(n.upgrades.drivetrain-1)*Tt.statBonusPerLevel,c=1+i,l=1+s,h=1+a,d=1+o;return{maxSpeedKmh:Math.round(t.maxSpeedKmh*(1+i*.65)),speedPct:Math.min(100,Math.round(t.speedStat+(n.upgrades.engine-1)*4)),torquePct:Math.min(100,Math.round(t.torqueStat+(n.upgrades.engine-1)*3+(n.upgrades.drivetrain-1)*2)),gripPct:Math.min(100,Math.round(t.gripStat+(n.upgrades.tires-1)*4+(n.upgrades.drivetrain-1)*2)),suspensionPct:Math.min(100,Math.round(t.suspensionStat+(n.upgrades.suspension-1)*4)),engineMultiplier:c,suspensionMultiplier:l,tiresMultiplier:h,drivetrainMultiplier:d,hasSnorkel:n.equippedAccessories.includes("snorkel"),hasLedBar:n.equippedAccessories.includes("led_bar"),hasRoofRack:n.equippedAccessories.includes("roof_rack")}}isBiomeUnlocked(e){return this.data.unlockedBiomes.includes(e)}selectBiome(e){return this.isBiomeUnlocked(e)?(this.data.selectedBiomeId=e,this.persist(),!0):!1}recordWaypointCompleted(e,t){this.data.biomeWaypoints[e]=(this.data.biomeWaypoints[e]||0)+1;const n=this.data.biomeWaypoints[e];let i=null,s=0;return e==="forest"&&n>=5&&!this.data.unlockedBiomes.includes("desert")?(this.data.unlockedBiomes.push("desert"),i="desert"):e==="desert"&&n>=5&&!this.data.unlockedBiomes.includes("mountain")?(this.data.unlockedBiomes.push("mountain"),i="mountain"):e==="mountain"&&n>=5&&!this.data.grandFrontierAwarded&&(this.data.grandFrontierAwarded=!0,s=Tt.grandFrontierBonus),this.addCash(t+s),{totalInBiome:n,unlockedNewBiome:i,grandFrontierBonus:s,isMilestone5:n%5===0}}isCollectibleDiscovered(e){return this.data.discoveredCollectibles.includes(e)}getDiscoveredCountInBiome(e){const t=Ft[e].collectibles;let n=0;for(let i=0;i<t.length;i++)this.data.discoveredCollectibles.includes(t[i].id)&&n++;return n}recordCollectibleDiscovered(e,t,n){if(this.data.discoveredCollectibles.includes(t))return{alreadyFound:!0,foundInBiome:this.getDiscoveredCountInBiome(e),totalInBiome:Ft[e].collectibles.length,jackpotBonus:0};this.data.discoveredCollectibles.push(t);const i=this.getDiscoveredCountInBiome(e),s=Ft[e].collectibles.length;let a=0;return i>=s&&!this.data.biome10JackpotAwarded[e]&&(this.data.biome10JackpotAwarded[e]=!0,a=Tt.biome10CollectiblesJackpot),this.addCash(n+a),{alreadyFound:!1,foundInBiome:i,totalInBiome:s,jackpotBonus:a}}isWatchtowerActivated(e){return this.data.activatedWatchtowers.includes(e)}getActivatedWatchtowersInBiome(e){const t=Ft[e].watchtowers;let n=0;for(let i=0;i<t.length;i++)this.data.activatedWatchtowers.includes(t[i].id)&&n++;return n}recordWatchtowerActivated(e){return this.data.activatedWatchtowers.includes(e)?!1:(this.data.activatedWatchtowers.push(e),this.addCash(Tt.watchtowerReward),!0)}}const qc=new L,Ea=new Xe,Kc=new pf,Yc=new ai(new L(0,1,0),0);class Mr{static isHudElement(e){return e instanceof Element?!!e.closest('[data-hud-interactive="true"], [data-hud-interactive], button, a, input, select, textarea, label, [role="button"], .hud-btn, .booster-btn, .modal-card, .modal-overlay, .br-modal-overlay, .shell-sidebar, .shell-start-menu-overlay, .shell-stage-pause-btn'):!1}static screenToCameraWorldXZ(e,t,n,i){n.updateMatrixWorld();const s=n.matrixWorld.elements;let a=s[0],o=s[2];const c=Math.hypot(a,o);c>1e-4?(a/=c,o/=c):(a=1,o=0);let l=-s[8],h=-s[10];const d=Math.hypot(l,h);return d>1e-4?(l/=d,h/=d):(l=0,h=-1),i.x=e*a+t*l,i.z=e*o+t*h,i}static screenToGroundPlane(e,t,n,i,s,a){const o=n.getBoundingClientRect();return o.width<=0||o.height<=0?!1:(Ea.x=(e-o.left)/o.width*2-1,Ea.y=-((t-o.top)/o.height)*2+1,Kc.setFromCamera(Ea,i),Yc.constant=-s,Kc.ray.intersectPlane(Yc,a)!==null)}static updateDynamicJoystick(e,t,n,i=46,s=4){const a=e-n.anchorX,o=t-n.anchorY,c=Math.hypot(a,o);if(c<=s){n.normX=0,n.normY=0,n.offsetX=0,n.offsetY=0;return}const l=a/c,h=o/c;if(c>i){const f=c-i;n.anchorX+=l*f,n.anchorY+=h*f}const d=Math.min(c,i),u=d/i;n.normX=l*u,n.normY=h*u,n.offsetX=l*d,n.offsetY=h*d}static createFloatingJoystick(e,t="rgba(250, 204, 21, 0.94)"){const n=document.createElement("div");n.style.cssText="position:absolute;width:86px;height:86px;margin-left:-43px;margin-top:-43px;border-radius:50%;border:3px solid rgba(255,255,255,0.68);background:rgba(15,23,42,0.26);pointer-events:none;display:none;z-index:25;backdrop-filter:blur(2px);";const i=document.createElement("div");return i.style.cssText=`position:absolute;left:50%;top:50%;width:36px;height:36px;margin-left:-18px;margin-top:-18px;border-radius:50%;background:${t};box-shadow:0 4px 12px rgba(0,0,0,0.32);`,n.appendChild(i),e.appendChild(n),{baseEl:n,knobEl:i,show(s,a){n.style.display="block",n.style.left=`${s}px`,n.style.top=`${a}px`,i.style.transform="translate(0px, 0px)"},update(s,a,o,c){n.style.left=`${s}px`,n.style.top=`${a}px`,i.style.transform=`translate(${o}px, ${c}px)`},hide(){n.style.display="none"}}}static findMagneticRayTarget(e,t,n,i,s=.65){let a=null,o=s*s;for(let c=0;c<t.length;c++){const l=t[c];if(!i(l))continue;n(l,qc);const h=e.distanceSqToPoint(qc);h<o&&(o=h,a=l)}return a}}class Qx{heldCodes=new Set;justPressedCodes=new Set;onKeyDown=e=>{Mr.isHudElement(e.target)||(this.heldCodes.has(e.code)||this.justPressedCodes.add(e.code),this.heldCodes.add(e.code))};onKeyUp=e=>{this.heldCodes.delete(e.code)};onReset=()=>{this.heldCodes.clear(),this.justPressedCodes.clear()};constructor(){typeof window<"u"&&(window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onReset),document.addEventListener("visibilitychange",this.onReset))}isHeld(e){return this.heldCodes.has(e)}consumePress(e){return this.justPressedCodes.has(e)?(this.justPressedCodes.delete(e),!0):!1}readAxes(e){let t=0,n=0;return(this.heldCodes.has("KeyA")||this.heldCodes.has("ArrowLeft"))&&(t-=1),(this.heldCodes.has("KeyD")||this.heldCodes.has("ArrowRight"))&&(t+=1),(this.heldCodes.has("KeyS")||this.heldCodes.has("ArrowDown"))&&(n-=1),(this.heldCodes.has("KeyW")||this.heldCodes.has("ArrowUp"))&&(n+=1),e.x=t,e.y=n,e}clear(){this.onReset()}dispose(){typeof window<"u"&&(window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onReset),document.removeEventListener("visibilitychange",this.onReset))}}class e_{container;keyboard=new Qx;joystickUI;joyState={active:!1,pointerId:-1,anchorX:0,anchorY:0,normX:0,normY:0,offsetX:0,offsetY:0};orbitPointerId=-1;orbitStartX=0;orbitStartY=0;orbitLastX=0;orbitLastY=0;orbitExceededThreshold=!1;orbitDeltaYaw=0;orbitDeltaPitch=0;steerInput=0;screenSteerRight=0;throttleInput=0;handbrakeHeld=!1;touchGasHeld=!1;touchBrakeHeld=!1;touchHandbrakeHeld=!1;isShowroomMode=!0;pendingHudActions={toggleDiffLock:!1,recoverVehicle:!1,toggleHeadlights:!1,triggerHorn:!1,cycleCameraMode:!1,toggleSlowMotion:!1,toggleGpsChevrons:!1};actions={toggleDiffLock:!1,recoverVehicle:!1,toggleHeadlights:!1,triggerHorn:!1,cycleCameraMode:!1,toggleSlowMotion:!1,toggleGpsChevrons:!1};axesScratch={x:0,y:0};constructor(e){this.container=e,this.joystickUI=Mr.createFloatingJoystick(e,"rgba(245, 158, 11, 0.94)"),this.bindEvents()}queueHudAction(e){this.pendingHudActions[e]=!0}bindEvents(){this.container.addEventListener("pointerdown",t=>{if(Mr.isHudElement(t.target))return;const n=this.container.getBoundingClientRect(),i=t.clientX-n.left,s=t.clientY-n.top;if(this.isShowroomMode){this.orbitPointerId===-1&&(this.orbitPointerId=t.pointerId,this.orbitStartX=t.clientX,this.orbitStartY=t.clientY,this.orbitLastX=t.clientX,this.orbitLastY=t.clientY,this.orbitExceededThreshold=!1);return}i<=n.width*.55&&!this.joyState.active?(this.joyState.active=!0,this.joyState.pointerId=t.pointerId,this.joyState.anchorX=i,this.joyState.anchorY=s,this.joyState.normX=0,this.joyState.normY=0,this.joyState.offsetX=0,this.joyState.offsetY=0,this.joystickUI.show(i,s)):this.orbitPointerId===-1&&(this.orbitPointerId=t.pointerId,this.orbitStartX=t.clientX,this.orbitStartY=t.clientY,this.orbitLastX=t.clientX,this.orbitLastY=t.clientY,this.orbitExceededThreshold=!1)}),window.addEventListener("pointermove",t=>{if(this.joyState.active&&t.pointerId===this.joyState.pointerId){const n=this.container.getBoundingClientRect(),i=t.clientX-n.left,s=t.clientY-n.top;Mr.updateDynamicJoystick(i,s,this.joyState,46,4),this.joystickUI.update(this.joyState.anchorX,this.joyState.anchorY,this.joyState.offsetX,this.joyState.offsetY)}else if(this.orbitPointerId!==-1&&t.pointerId===this.orbitPointerId){if(Math.hypot(t.clientX-this.orbitStartX,t.clientY-this.orbitStartY)>=18&&(this.orbitExceededThreshold=!0),this.orbitExceededThreshold){const i=t.clientX-this.orbitLastX,s=t.clientY-this.orbitLastY;this.orbitDeltaYaw-=i*.0065,this.orbitDeltaPitch+=s*.005}this.orbitLastX=t.clientX,this.orbitLastY=t.clientY}});const e=t=>{this.joyState.active&&t.pointerId===this.joyState.pointerId&&(this.joyState.active=!1,this.joyState.pointerId=-1,this.joyState.normX=0,this.joyState.normY=0,this.joystickUI.hide()),this.orbitPointerId!==-1&&t.pointerId===this.orbitPointerId&&(this.orbitPointerId=-1,this.orbitExceededThreshold=!1)};window.addEventListener("pointerup",e),window.addEventListener("pointercancel",e),window.addEventListener("blur",()=>this.resetAll()),document.addEventListener("visibilitychange",()=>{document.hidden&&this.resetAll()})}resetAll(){this.keyboard.clear(),this.joyState.active=!1,this.joyState.pointerId=-1,this.joyState.normX=0,this.joyState.normY=0,this.joystickUI.hide(),this.orbitPointerId=-1,this.orbitExceededThreshold=!1,this.orbitDeltaYaw=0,this.orbitDeltaPitch=0,this.touchGasHeld=!1,this.touchBrakeHeld=!1,this.touchHandbrakeHeld=!1,this.steerInput=0,this.screenSteerRight=0,this.throttleInput=0,this.handbrakeHeld=!1}update(){this.keyboard.readAxes(this.axesScratch);let e=this.axesScratch.x;this.joyState.active&&Math.abs(this.joyState.normX)>.05&&(e=this.joyState.normX),this.screenSteerRight=Math.max(-1,Math.min(1,e)),this.steerInput=-this.screenSteerRight;let t=this.axesScratch.y;this.touchGasHeld&&(t+=1),this.touchBrakeHeld&&(t-=1),this.joyState.active&&!this.touchGasHeld&&!this.touchBrakeHeld&&Math.abs(this.joyState.normY)>.22&&(t=-this.joyState.normY),this.throttleInput=Math.max(-1,Math.min(1,t)),this.handbrakeHeld=this.keyboard.isHeld("Space")||this.touchHandbrakeHeld,this.actions.toggleDiffLock=this.keyboard.consumePress("KeyE")||this.pendingHudActions.toggleDiffLock,this.actions.recoverVehicle=this.keyboard.consumePress("KeyR")||this.pendingHudActions.recoverVehicle,this.actions.toggleHeadlights=this.keyboard.consumePress("KeyL")||this.pendingHudActions.toggleHeadlights,this.actions.triggerHorn=this.keyboard.consumePress("KeyH")||this.pendingHudActions.triggerHorn,this.actions.cycleCameraMode=this.keyboard.consumePress("KeyC")||this.pendingHudActions.cycleCameraMode,this.actions.toggleSlowMotion=this.keyboard.consumePress("KeyV")||this.pendingHudActions.toggleSlowMotion,this.actions.toggleGpsChevrons=this.keyboard.consumePress("KeyG")||this.pendingHudActions.toggleGpsChevrons,this.pendingHudActions.toggleDiffLock=!1,this.pendingHudActions.recoverVehicle=!1,this.pendingHudActions.toggleHeadlights=!1,this.pendingHudActions.triggerHorn=!1,this.pendingHudActions.cycleCameraMode=!1,this.pendingHudActions.toggleSlowMotion=!1,this.pendingHudActions.toggleGpsChevrons=!1}consumeOrbitDeltas(e){e.yaw=this.orbitDeltaYaw,e.pitch=this.orbitDeltaPitch,this.orbitDeltaYaw=0,this.orbitDeltaPitch=0}}class rl{static instance=null;lastInterstitialTime=0;minInterstitialIntervalMs=9e4;availabilityListeners=[];isShowingAd=!1;initialized=!1;static get(){return this.instance||(this.instance=new rl),this.instance}async initialize(){this.initialized||(this.initialized=!0,this.lastInterstitialTime=Date.now(),typeof window<"u"&&(window.addEventListener("online",()=>this.notifyAvailability(this.isRewardedReady())),window.addEventListener("offline",()=>this.notifyAvailability(!1)),this.syncDomAdState(this.isRewardedReady())))}onAvailabilityChange(e){this.availabilityListeners.push(e)}notifyAvailability(e){this.syncDomAdState(e);for(let t=0;t<this.availabilityListeners.length;t++)try{this.availabilityListeners[t](e)}catch{}}syncDomAdState(e=this.isRewardedReady()){if(typeof document>"u"||!document.body)return;document.body.classList.toggle("ads-unavailable",!e);const t=document.querySelectorAll(".booster-ad-badge, .hud-booster-badge");for(let n=0;n<t.length;n++){const i=t[n];i.textContent=e?"🎬 FREE":"🎬 REKLAM YOK"}}isRewardedReady(){if(typeof navigator<"u"&&!navigator.onLine)return!1;const e=window;return e.ytgame?.IN_PLAYABLES_ENV?!!e.ytgame?.ads?.requestRewardedAd:!0}async showInterstitial(e="level_transition"){if(this.isShowingAd||!this.isRewardedReady())return!1;const t=Date.now();if(t-this.lastInterstitialTime<this.minInterstitialIntervalMs)return!1;this.lastInterstitialTime=t,this.isShowingAd=!0;try{const n=window;if(n.ytgame?.IN_PLAYABLES_ENV&&n.ytgame?.ads?.requestInterstitialAd)try{return await n.ytgame.ads.requestInterstitialAd(),!0}catch{return!1}return n.CrazyGames?.SDK?.ad?.requestAd?await new Promise(i=>{n.CrazyGames.SDK.ad.requestAd("midgame",{adFinished:()=>i(!0),adError:()=>i(!1)})}):n.ysdk?.adv?.showFullscreenAdv?await new Promise(i=>{n.ysdk.adv.showFullscreenAdv({callbacks:{onClose:()=>i(!0),onError:()=>i(!1)}})}):n.PokiSDK?.commercialBreak?await new Promise(i=>{n.PokiSDK.commercialBreak().then(()=>i(!0)).catch(()=>i(!1))}):await this.showMockAdModal(`SPONSOR BREAK [${e.toUpperCase()}]`,2)}finally{this.isShowingAd=!1}}async showRewarded(e="rewarded_booster"){if(this.isShowingAd||!this.isRewardedReady())return!1;this.isShowingAd=!0;try{const t=window;if(t.ytgame?.IN_PLAYABLES_ENV&&t.ytgame?.ads?.requestRewardedAd)try{return await t.ytgame.ads.requestRewardedAd(),this.lastInterstitialTime=Date.now(),!0}catch{return!1}return t.CrazyGames?.SDK?.ad?.requestAd?await new Promise(n=>{t.CrazyGames.SDK.ad.requestAd("rewarded",{adFinished:()=>{this.lastInterstitialTime=Date.now(),n(!0)},adError:()=>n(!1)})}):t.ysdk?.adv?.showRewardedVideo?await new Promise(n=>{let i=!1;t.ysdk.adv.showRewardedVideo({callbacks:{onRewarded:()=>{i=!0,this.lastInterstitialTime=Date.now()},onClose:()=>n(i),onError:()=>n(!1)}})}):t.PokiSDK?.rewardedBreak?await new Promise(n=>{t.PokiSDK.rewardedBreak().then(i=>{i&&(this.lastInterstitialTime=Date.now()),n(!!i)}).catch(()=>n(!1))}):await this.showMockAdModal(`ÖDÜLLÜ REKLAM // ${e.toUpperCase()}`,2)}finally{this.isShowingAd=!1}}showMockAdModal(e,t){return new Promise(n=>{const i=document.createElement("div");i.className="mock-ad-modal modal-overlay",i.setAttribute("data-hud-interactive","true"),i.style.cssText=`
        position: absolute; inset: 0; background: rgba(3, 7, 18, 0.95);
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        z-index: 100000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #fff; backdrop-filter: blur(8px); pointer-events: auto;
      `;const s=d=>d.stopPropagation();i.addEventListener("pointerdown",s),i.addEventListener("mousedown",s),i.addEventListener("touchstart",s);let a=t;i.innerHTML=`
        <div class="modal-card" data-hud-interactive="true" style="background: #0f172a; border: 2px solid #0284c7; border-radius: 16px; padding: 28px; width: 90%; max-width: 380px; text-align: center; box-shadow: 0 0 40px rgba(2, 132, 199, 0.4);">
          <span style="font-size: 11px; letter-spacing: 2px; color: #38bdf8; font-weight: 800; display: block; margin-bottom: 8px;">YOUTUBE PLAYABLES REWARD REEL // SPONSOR</span>
          <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 700; color: #f8fafc;">${e}</h3>
          <div style="height: 120px; background: rgba(2, 132, 199, 0.1); border: 1px dashed #0284c7; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span id="mock-ad-countdown" style="font-size: 32px; font-weight: 800; color: #38bdf8;">${a}s</span>
          </div>
          <button id="mock-ad-claim-btn" class="hud-btn" data-hud-interactive="true" disabled style="width: 100%; height: auto; padding: 12px; border-radius: 10px; border: none; background: #334155; color: #94a3b8; font-weight: 800; font-size: 14px; cursor: not-allowed; transition: all 0.2s;">
            LÜTFEN BEKLEYİN...
          </button>
        </div>
      `,(document.getElementById("shell-stage")||document.body).appendChild(i);const c=i.querySelector("#mock-ad-countdown"),l=i.querySelector("#mock-ad-claim-btn"),h=setInterval(()=>{a--,a>0?c.textContent=`${a}s`:(clearInterval(h),c.textContent="TAMAMLANDI! ✓",c.style.color="#10b981",c.style.fontSize="22px",l.disabled=!1,l.style.background="linear-gradient(135deg, #10b981, #059669)",l.style.color="#ffffff",l.style.cursor="pointer",l.textContent="ÖDÜLÜ AL & DEVAM ET")},1e3);l.addEventListener("click",d=>{d.stopPropagation(),!(a>0)&&(clearInterval(h),i.remove(),this.lastInterstitialTime=Date.now(),n(!0))})})}}const jc="frontier_horizon_3d_save_v1";class $c{firstFrameSent=!1;gameReadySent=!1;dataLoaded=!1;static applyDualModeShell(){document.documentElement.classList.remove("yt-embed-mode"),document.body?.classList.remove("embed-fullscreen-mode")}firstFrameReady(){if(!this.firstFrameSent){this.firstFrameSent=!0;try{window.ytgame?.game?.firstFrameReady?.()}catch{}}}gameReady(){if(!this.gameReadySent){this.gameReadySent=!0;try{window.ytgame?.game?.gameReady?.(),window.PokiSDK?.gameLoadingFinished?.()}catch{}}}bindLifecycle(e,t,n){try{const i=window.ytgame?.system;i&&(typeof i.isAudioEnabled=="function"&&n(i.isAudioEnabled()),i.onAudioEnabledChange?.(n),i.onPause?.(e),i.onResume?.(t))}catch{}document.addEventListener("visibilitychange",()=>{document.hidden?e():t()})}async loadData(e){let t="";try{window.ytgame?.game?.loadData&&(t=await window.ytgame.game.loadData()||"")}catch{}if(!t)try{t=localStorage.getItem(jc)||""}catch{}if(this.dataLoaded=!0,!t)return Aa(e);try{const n=JSON.parse(t);return{...Aa(e),...n}}catch{return Aa(e)}}async saveData(e){if(!this.dataLoaded)return;const t=JSON.stringify(e);try{localStorage.setItem(jc,t)}catch{}try{await window.ytgame?.game?.saveData?.(t)}catch{}}sendScore(e){try{window.ytgame?.engagement?.sendScore?.({value:Math.round(e)})}catch{}}}function Aa(r){return JSON.parse(JSON.stringify(r))}const Ra=["tps_chase","free_orbit_360","hood_cockpit","tactical_far"];class t_{mode="tps_chase";camera;currentPos=new L(0,5.5,10.5);currentLookAt=new L(0,1,0);desiredPos=new L;desiredLookAt=new L;upVec=new L(0,1,0);baseFov=50;smoothHeadingRad=0;orbitYawOffsetRad=0;orbitPitchRad=.36;orbitIdleTimer=0;trauma=0;elapsedTime=0;initialized=!1;constructor(e){this.camera=e}cycleMode(){const t=(Ra.indexOf(this.mode)+1)%Ra.length;return this.setMode(Ra[t]),this.mode}setMode(e){this.mode=e,e==="tps_chase"||e==="tactical_far"?(this.orbitYawOffsetRad=0,this.orbitPitchRad=e==="tactical_far"?.52:.36):e==="free_orbit_360"&&(this.orbitPitchRad=ut(this.orbitPitchRad,.2,1.35)),e!=="hood_cockpit"&&this.camera.up.set(0,1,0)}addOrbitDelta(e,t){this.orbitYawOffsetRad-=e,this.orbitPitchRad=ut(this.orbitPitchRad+t,.175,1.396),this.orbitIdleTimer=2.5}addTrauma(e){this.trauma=ut(this.trauma+e,0,1)}updateResize(e){this.camera.aspect=Math.max(.1,e),this.baseFov=e<1?60:50,this.camera.fov=this.baseFov,this.camera.updateProjectionMatrix()}updateShowroom(e,t,n){this.elapsedTime+=e;const i=n+this.orbitYawOffsetRad+.55,s=ut(this.orbitPitchRad,.22,.85),a=6.35,o=Math.cos(s)*a,c=Math.sin(s)*a+.45;this.desiredPos.set(t.x+Math.sin(i)*o,t.y+c,t.z+Math.cos(i)*o),this.desiredLookAt.set(t.x,t.y+.85,t.z),this.initialized?(this.currentPos.x=ft(this.currentPos.x,this.desiredPos.x,10,e),this.currentPos.y=ft(this.currentPos.y,this.desiredPos.y,10,e),this.currentPos.z=ft(this.currentPos.z,this.desiredPos.z,10,e),this.currentLookAt.x=ft(this.currentLookAt.x,this.desiredLookAt.x,14,e),this.currentLookAt.y=ft(this.currentLookAt.y,this.desiredLookAt.y,14,e),this.currentLookAt.z=ft(this.currentLookAt.z,this.desiredLookAt.z,14,e)):(this.currentPos.copy(this.desiredPos),this.currentLookAt.copy(this.desiredLookAt),this.initialized=!0),Math.abs(this.camera.fov-this.baseFov)>.05&&(this.camera.fov=ft(this.camera.fov,this.baseFov,8,e),this.camera.updateProjectionMatrix()),this.camera.up.set(0,1,0),this.camera.position.copy(this.currentPos),this.camera.lookAt(this.currentLookAt)}updateDriving(e,t,n,i,s,a,o){if(this.elapsedTime+=e,this.trauma>0&&(this.trauma=Math.max(0,this.trauma-e*1.85)),!this.initialized)this.smoothHeadingRad=n;else{const u=Math.abs(a)>1?7.5:4.2;this.smoothHeadingRad=Ro(this.smoothHeadingRad,n,u,e)}this.mode!=="free_orbit_360"&&(this.orbitIdleTimer>0?this.orbitIdleTimer=Math.max(0,this.orbitIdleTimer-e):Math.abs(a)>1.2&&(this.orbitYawOffsetRad=Ro(this.orbitYawOffsetRad,0,3.2,e)));const c=-Math.sin(n),l=-Math.cos(n);if(this.mode==="hood_cockpit"){if(this.desiredPos.set(t.x+c*.8,t.y+1.45+Math.sin(i)*.8,t.z+l*.8),o){const S=o(this.desiredPos.x,this.desiredPos.z);this.desiredPos.y<S+.65&&(this.desiredPos.y=S+.65)}const x=18;this.desiredLookAt.set(this.desiredPos.x+c*x,this.desiredPos.y+Math.sin(i)*x-.35,this.desiredPos.z+l*x),this.currentPos.copy(this.desiredPos),this.currentLookAt.copy(this.desiredLookAt);const g=Math.cos(n),m=-Math.sin(n),p=Math.sin(-s*.85),_=Math.cos(-s*.85);this.upVec.set(g*p,_,m*p).normalize(),this.camera.up.copy(this.upVec)}else{this.camera.up.set(0,1,0);let u=9.5,f=4.2,x=3.5;this.mode==="tactical_far"?(u=18,f=11,x=5):this.mode==="free_orbit_360"?(u=Math.cos(this.orbitPitchRad)*10.5,f=Math.sin(this.orbitPitchRad)*10.5+.6,x=0):f=4.2+Math.abs(i)*2.8+(this.orbitPitchRad-.36)*3;const g=this.mode==="free_orbit_360"?n+this.orbitYawOffsetRad:this.smoothHeadingRad+this.orbitYawOffsetRad,m=Math.sin(g),p=Math.cos(g);if(this.desiredPos.set(t.x+m*u,t.y+f,t.z+p*u),o){const M=o(this.desiredPos.x,this.desiredPos.z),E=(t.x+this.desiredPos.x)*.5,T=(t.z+this.desiredPos.z)*.5,R=o(E,T),v=Math.max(M+1.45,R+1.1);this.desiredPos.y<v&&(this.desiredPos.y=v)}const _=ut(a/22,-.4,1.25),S=x*(.45+.55*Math.max(0,_));if(this.desiredLookAt.set(t.x+c*S,t.y+.8+Math.sin(i)*1.4,t.z+l*S),!this.initialized)this.currentPos.copy(this.desiredPos),this.currentLookAt.copy(this.desiredLookAt),this.initialized=!0;else{const M=this.mode==="free_orbit_360"?14:8.5;this.currentPos.x=ft(this.currentPos.x,this.desiredPos.x,M,e),this.currentPos.y=ft(this.currentPos.y,this.desiredPos.y,M,e),this.currentPos.z=ft(this.currentPos.z,this.desiredPos.z,M,e),this.currentLookAt.x=ft(this.currentLookAt.x,this.desiredLookAt.x,14,e),this.currentLookAt.y=ft(this.currentLookAt.y,this.desiredLookAt.y,12,e),this.currentLookAt.z=ft(this.currentLookAt.z,this.desiredLookAt.z,14,e)}}const h=ut((Math.abs(a)-8)*.22,0,5.5),d=this.baseFov+h;if(Math.abs(this.camera.fov-d)>.05&&(this.camera.fov=ft(this.camera.fov,d,6,e),this.camera.updateProjectionMatrix()),this.camera.position.copy(this.currentPos),this.trauma>.001){const u=this.trauma*this.trauma*.38;this.camera.position.x+=Math.sin(this.elapsedTime*43)*u,this.camera.position.y+=Math.cos(this.elapsedTime*51)*u,this.camera.position.z+=Math.sin(this.elapsedTime*37)*u}this.camera.lookAt(this.currentLookAt)}}const Nt=180,ur=8,Zc=[16096779,2278750,959977,16347926,16436245,11032055];class n_{instancedMesh;active=new Uint8Array(Nt);posX=new Float32Array(Nt);posY=new Float32Array(Nt);posZ=new Float32Array(Nt);velX=new Float32Array(Nt);velY=new Float32Array(Nt);velZ=new Float32Array(Nt);baseScale=new Float32Array(Nt);endScale=new Float32Array(Nt);age=new Float32Array(Nt);maxAge=new Float32Array(Nt);gravity=new Float32Array(Nt);rotSpeed=new Float32Array(Nt);shockwaves=[];dummyMatrix=new Ve;dummyPos=new L;dummyQuat=new In;dummyEuler=new on;dummyScale=new L;dummyColor=new Ne;cursor=0;rngSeed=1337;constructor(e){const t=new Ls(.22,0),n=new Je({color:16777215,roughness:.55,metalness:.05});this.instancedMesh=new Qo(t,n,Nt),this.instancedMesh.instanceMatrix.setUsage(Pd),this.instancedMesh.frustumCulled=!1,this.instancedMesh.castShadow=!1,this.instancedMesh.receiveShadow=!1,this.dummyScale.set(0,0,0),this.dummyMatrix.compose(this.dummyPos,this.dummyQuat,this.dummyScale),this.dummyColor.setHex(16777215);for(let s=0;s<Nt;s++)this.instancedMesh.setMatrixAt(s,this.dummyMatrix),this.instancedMesh.setColorAt(s,this.dummyColor);this.instancedMesh.instanceMatrix.needsUpdate=!0,this.instancedMesh.instanceColor&&(this.instancedMesh.instanceColor.needsUpdate=!0),e.add(this.instancedMesh);const i=new Gi(.78,1,28);i.rotateX(-Math.PI/2);for(let s=0;s<ur;s++){const a=new Kt({color:16096779,transparent:!0,opacity:0,side:Ht,depthWrite:!1}),o=new Y(i,a);o.visible=!1,e.add(o),this.shockwaves.push({mesh:o,mat:a,active:!1,age:0,maxAge:.75,maxRadius:8})}}nextRand(){return this.rngSeed=this.rngSeed*1664525+1013904223>>>0,(this.rngSeed&268435455)/268435456}spawnParticle(e,t,n,i,s,a,o,c,l,h,d){const u=this.cursor;this.cursor=(this.cursor+1)%Nt,this.active[u]=1,this.posX[u]=e,this.posY[u]=t,this.posZ[u]=n,this.velX[u]=i,this.velY[u]=s,this.velZ[u]=a,this.baseScale[u]=o,this.endScale[u]=c,this.age[u]=0,this.maxAge[u]=l,this.gravity[u]=h,this.rotSpeed[u]=(this.nextRand()-.5)*8,this.dummyColor.setHex(d),this.instancedMesh.setColorAt(u,this.dummyColor),this.instancedMesh.instanceColor&&(this.instancedMesh.instanceColor.needsUpdate=!0)}emitTireSurfaceParticles(e,t,n=1){const i=Math.min(2,Math.max(.2,n)),s=i>1.1?2:1;let a=12097394,o=3.5,c=.55,l=1.45,h=.55,d=1.8,u=1.6;t==="deep_mud"?(a=6045747,o=11.5,c=.65,l=.35,h=.48,d=3.2,u=2.2):t==="soft_sand"?(a=15123080,o=5.2,c=.65,l=1.75,h=.62,d=2.4,u=2.4):t==="mountain_rock"?(a=9741240,o=10.5,c=.42,l=.2,h=.4,d=2.5,u=2):t==="alpine_ice"?(a=15857145,o=4.2,c=.55,l=1.5,h=.55,d=2.1,u=2.1):t==="water_ford"&&(a=12248829,o=9,c=.72,l=1.35,h=.52,d=3.8,u=2.6);for(let f=0;f<s;f++){const x=(this.nextRand()-.5)*u*i,g=(this.nextRand()-.5)*u*i,m=(.5+this.nextRand()*.8)*d*i;this.spawnParticle(e.x+(this.nextRand()-.5)*.35,e.y+.12,e.z+(this.nextRand()-.5)*.35,x,m,g,c*i,l*i,h,o,a)}}emitCelebrationBurst(e,t){for(let i=0;i<26;i++){const s=i/26*Math.PI*2+this.nextRand()*.3,a=3.2+this.nextRand()*5.2,o=Math.cos(s)*a,c=Math.sin(s)*a,l=5.5+this.nextRand()*6.5,h=t!==void 0&&i%2===0?t:Zc[i%Zc.length];this.spawnParticle(e.x,e.y+1,e.z,o,l,c,.95,.15,.95+this.nextRand()*.35,9.8,h)}this.emitShockwaveRing(e,t??16096779,9.5)}emitShockwaveRing(e,t=16096779,n=8){let i=this.shockwaves[0];for(let s=0;s<ur;s++)if(!this.shockwaves[s].active){i=this.shockwaves[s];break}i.active=!0,i.age=0,i.maxAge=.75,i.maxRadius=n,i.mat.color.setHex(t),i.mat.opacity=.85,i.mesh.position.set(e.x,e.y+.18,e.z),i.mesh.scale.setScalar(.3),i.mesh.visible=!0}update(e){let t=!1;for(let n=0;n<Nt;n++){if(this.active[n]===0)continue;t=!0,this.age[n]+=e;const i=this.age[n]/this.maxAge[n];if(i>=1){this.active[n]=0,this.dummyScale.set(0,0,0),this.dummyMatrix.compose(this.dummyPos,this.dummyQuat,this.dummyScale),this.instancedMesh.setMatrixAt(n,this.dummyMatrix);continue}this.velY[n]-=this.gravity[n]*e,this.posX[n]+=this.velX[n]*e,this.posY[n]+=this.velY[n]*e,this.posZ[n]+=this.velZ[n]*e;const s=(this.baseScale[n]+(this.endScale[n]-this.baseScale[n])*i)*(1-i*.65);this.dummyPos.set(this.posX[n],this.posY[n],this.posZ[n]);const a=this.age[n]*this.rotSpeed[n];this.dummyEuler.set(a,a*.7,0),this.dummyQuat.setFromEuler(this.dummyEuler),this.dummyScale.set(s,s,s),this.dummyMatrix.compose(this.dummyPos,this.dummyQuat,this.dummyScale),this.instancedMesh.setMatrixAt(n,this.dummyMatrix)}t&&(this.instancedMesh.instanceMatrix.needsUpdate=!0);for(let n=0;n<ur;n++){const i=this.shockwaves[n];if(!i.active)continue;i.age+=e;const s=i.age/i.maxAge;if(s>=1){i.active=!1,i.mesh.visible=!1;continue}const a=1-(1-s)*(1-s),o=.4+(i.maxRadius-.4)*a;i.mesh.scale.setScalar(o),i.mat.opacity=(1-s)*.82}}clear(){this.dummyScale.set(0,0,0),this.dummyMatrix.compose(this.dummyPos,this.dummyQuat,this.dummyScale);for(let e=0;e<Nt;e++)this.active[e]=0,this.instancedMesh.setMatrixAt(e,this.dummyMatrix);this.instancedMesh.instanceMatrix.needsUpdate=!0;for(let e=0;e<ur;e++)this.shockwaves[e].active=!1,this.shockwaves[e].mesh.visible=!1}}const Jc=48,Qc=86,eh=42;function i_(r,e){Qt.enhanceScene(r),e&&(Qt.enhanceRendererAndIBL(e,r),e.toneMapping=Ds,e.toneMappingExposure=.9),"environmentIntensity"in r&&(r.environmentIntensity=.3);const t=new Ne(13625591);r.background=t;const n=new jo(13625591,.0013);r.fog=n;const i=Qt.createSkyDome(950);i.name="HorizonSkyDome",r.add(i);const s=new $u(14413565,16115402,.85);s.position.set(0,60,0),r.add(s);const a=new bo(16774885,1.25);a.position.set(Jc,Qc,eh),a.castShadow=!0,a.shadow.mapSize.set(2048,2048),a.shadow.camera.near=2,a.shadow.camera.far=220;const o=54;a.shadow.camera.left=-o,a.shadow.camera.right=o,a.shadow.camera.top=o,a.shadow.camera.bottom=-o,a.shadow.bias=-4e-4,a.shadow.normalBias=.025,a.shadow.camera.updateProjectionMatrix(),r.add(a),r.add(a.target);const c=new bo(12248829,.45);return c.position.set(-36,32,-36),r.add(c),{sunLight:a,hemiLight:s,setBiomeAtmosphere:d=>{d==="desert"?(t.setHex(14413565),n.color.setHex(14413565),n.density=.0011,a.color.setHex(16774102),a.intensity=1.25,s.color.setHex(14413565),s.groundColor.setHex(16115402),s.intensity=.85):d==="mountain"?(t.setHex(13625591),n.color.setHex(14412542),n.density=.0014,a.color.setHex(16775403),a.intensity=1.25,s.color.setHex(13625591),s.groundColor.setHex(16578798),s.intensity=.85):(t.setHex(13625591),n.color.setHex(13625591),n.density=.0013,a.color.setHex(16774885),a.intensity=1.25,s.color.setHex(14413565),s.groundColor.setHex(16115402),s.intensity=.85)},updateSunFollow:d=>{a.position.set(d.x+Jc,d.y+Qc,d.z+eh),a.target.position.copy(d),a.target.updateMatrixWorld(),i.position.set(d.x,0,d.z)}}}const Ca=[1.5,2,3,5,3,2,1.5];class s_{root;world;input;ads;audio;garageOverlay;drivingOverlay;calloutBanner;rescueBanner;victoryModal;elCashDriving;elBiomeTitle;elWaypointProg;elSecretProg;elTowerProg;elSurfaceBadge;elCompassBearing;elWaypointDist;elRadarContainer;elRadarBars=[];elRadarHint;minimapCanvas;minimapCtx;elSpeedVal;elGearVal;elRpmFill;elRpmText;elPitchVal;elRollVal;btnDiffLock;btnHandbrake;btnCameraMode;btnHeadlights;btnSlowMo;btnGpsToggle;btnBoosterRadar;btnBoosterTorque;elCashGarage;elGarageVehicleTitle;elGarageVehicleSub;elGarageStrength;elStatBars;elUpgradeList;elColorGrid;elFinishRow;elAccessoryList;elFleetRow;elGarageVehicleActionBtn;elBiomeSelectRow;isVictoryModalOpen=!1;victoryClaimedLatch=!1;victoryBaseReward=250;needlePhase=0;elVictoryTitle;elVictorySub;elNeedleCursor;btnVictoryMultiplier;btnVictoryStandard;calloutTimer=0;previewVehicleId="trail-scout";isAdBusy=!1;constructor(e,t,n,i,s){this.root=e,this.world=t,this.input=n,this.ads=i,this.audio=s,this.previewVehicleId=this.world.store.data.selectedVehicleId,this.injectStyles(),this.buildDom(),this.ads.onAvailabilityChange(()=>this.syncAdButtons()),this.syncAdButtons(),this.refreshHud()}injectStyles(){if(document.getElementById("frontier-hud-styles"))return;const e=document.createElement("style");e.id="frontier-hud-styles",e.textContent=`
      .fh-hud-wrap {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #0f172a;
        overflow: hidden;
      }
      .fh-glass-card {
        background: rgba(255, 255, 255, 0.92);
        border: 1.5px solid rgba(226, 232, 240, 0.95);
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: 16px;
        pointer-events: auto;
      }
      .fh-dark-card {
        background: rgba(15, 23, 42, 0.86);
        border: 1.5px solid rgba(148, 163, 184, 0.35);
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.28);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: #f8fafc;
        border-radius: 16px;
        pointer-events: auto;
      }
      .fh-btn {
        appearance: none;
        border: 1.5px solid #cbd5e1;
        background: #ffffff;
        color: #0f172a;
        font-weight: 800;
        font-size: 12px;
        border-radius: 11px;
        padding: 7px 11px;
        cursor: pointer;
        pointer-events: auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: transform 0.12s ease, background 0.12s ease, border-color 0.12s ease;
      }
      .fh-btn:hover {
        transform: translateY(-1px);
        border-color: #d97706;
      }
      .fh-btn:active {
        transform: translateY(1px);
      }
      .fh-btn-primary {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: #ffffff;
        border: none;
        box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35);
      }
      .fh-btn-emerald {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: #ffffff;
        border: none;
        box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
      }
      /* GARAGE STUDIO LAYOUT */
      .fh-garage-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 12px 58px 12px 12px;
        pointer-events: none;
        z-index: 25;
      }
      .fh-garage-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 10px 14px;
        flex-wrap: wrap;
      }
      .fh-garage-mid {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        gap: 12px;
        flex: 1 1 auto;
        min-height: 0;
        margin: 8px 0;
      }
      .fh-garage-panel {
        width: 285px;
        max-width: 44vw;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow-y: auto;
        max-height: 100%;
      }
      .fh-garage-bottom {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 10px 12px;
      }
      .fh-fleet-strip {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding-bottom: 4px;
      }
      .fh-fleet-card {
        min-width: 128px;
        padding: 8px 10px;
        border-radius: 12px;
        border: 2px solid #e2e8f0;
        background: #f8fafc;
        cursor: pointer;
        text-align: left;
        transition: all 0.14s ease;
        flex-shrink: 0;
      }
      .fh-fleet-card.is-selected {
        border-color: #d97706;
        background: #fffbeb;
        box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
      }
      .fh-stat-row {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }
      .fh-stat-bar-bg {
        height: 7px;
        border-radius: 999px;
        background: #e2e8f0;
        overflow: hidden;
      }
      .fh-stat-bar-fill {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, #f59e0b, #10b981);
        transition: width 0.2s ease;
      }
      .fh-color-swatch {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: 2.5px solid #ffffff;
        box-shadow: 0 2px 6px rgba(15, 23, 42, 0.25);
        cursor: pointer;
        transition: transform 0.12s ease;
      }
      .fh-color-swatch.is-active {
        transform: scale(1.18);
        outline: 2.5px solid #0f172a;
      }
      /* DRIVING HUD LAYOUT */
      .fh-driving-overlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 22;
      }
      .fh-top-left-card {
        position: absolute;
        top: 12px;
        left: 12px;
        padding: 10px 13px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 215px;
      }
      .fh-top-center-wrap {
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
      }
      .fh-top-right-wrap {
        position: absolute;
        top: 12px;
        right: 60px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
      }
      .fh-bottom-left-wrap {
        position: absolute;
        bottom: 14px;
        left: 12px;
        display: flex;
        flex-direction: column;
        gap: 7px;
      }
      .fh-bottom-right-wrap {
        position: absolute;
        bottom: 14px;
        right: 14px;
        display: flex;
        align-items: flex-end;
        gap: 10px;
      }
      .fh-pedal-btn {
        width: 58px;
        height: 76px;
        border-radius: 14px;
        font-weight: 900;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        cursor: pointer;
        pointer-events: auto;
        user-select: none;
      }
      @media (max-width: 900px) {
        .fh-garage-mid {
          flex-direction: column;
          overflow-y: auto;
        }
        .fh-garage-panel {
          width: 100%;
          max-width: 100%;
        }
        .fh-top-center-wrap {
          top: auto;
          bottom: 112px;
        }
      }
    `,document.head.appendChild(e)}buildDom(){this.root.innerHTML="";const e=document.createElement("div");e.className="fh-hud-wrap",this.garageOverlay=document.createElement("div"),this.garageOverlay.className="fh-garage-overlay",this.garageOverlay.innerHTML=`
      <div class="fh-glass-card fh-garage-top" data-hud-interactive="true">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:22px;">🚙</span>
          <div>
            <div style="font-size:15px;font-weight:900;letter-spacing:0.4px;color:#0f172a;">FRONTIER HORIZON // 3D GARAJ & MODİFİYE</div>
            <div style="font-size:11px;font-weight:700;color:#64748b;">Aracı 360° döndürmek için sahneyi sürükle • Özelleştir ve biyom seç</div>
          </div>
        </div>
        <div id="fh-biome-select-row" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;" data-hud-interactive="true"></div>
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="background:#fef3c7;border:1.5px solid #f59e0b;border-radius:12px;padding:6px 12px;font-weight:900;font-size:15px;color:#b45309;">
            💵 <span id="fh-cash-garage">$150</span>
          </div>
          <button id="hud-sound-btn" type="button" class="fh-btn" data-hud-interactive="true" title="Ses Aç/Kapat">${this.audio.isMuted()?"🔇":"🔊"}</button>
          <button id="fh-start-drive-btn" type="button" class="fh-btn fh-btn-emerald" style="font-size:14px;padding:10px 18px;" data-hud-interactive="true">
            🚀 SÜRÜŞE BAŞLA
          </button>
        </div>
      </div>

      <div class="fh-garage-mid">
        <!-- Left Panel: Vehicle Stats & 4 Mechanical Upgrades -->
        <div class="fh-glass-card fh-garage-panel" data-hud-interactive="true">
          <div>
            <div id="fh-garage-veh-title" style="font-size:17px;font-weight:900;color:#0f172a;">Trail Scout 4x4</div>
            <div id="fh-garage-veh-sub" style="font-size:11px;font-weight:800;color:#d97706;">Klasik Arazi Cip • 4x4 (4 Teker)</div>
            <div id="fh-garage-veh-strength" style="font-size:11px;color:#475569;margin-top:2px;">Dengeli başlangıç 4x4 arazi aracı</div>
          </div>
          <div id="fh-stat-bars" style="display:flex;flex-direction:column;gap:5px;margin-top:2px;"></div>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:4px 0;" />
          <div style="font-size:11px;font-weight:900;color:#334155;letter-spacing:0.5px;">⚙️ MEKANİK YÜKSELTMELER (SV 1–5)</div>
          <div id="fh-upgrade-list" style="display:flex;flex-direction:column;gap:6px;"></div>
        </div>

        <!-- Center Turntable Viewport Space (transparent for 360° drag) -->
        <div style="flex:1;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;pointer-events:none;">
          <div class="fh-dark-card" style="padding:7px 14px;font-size:11px;font-weight:800;display:flex;align-items:center;gap:10px;" data-hud-interactive="true">
            <span>🔄 360° Showroom Turntable</span>
            <button id="fh-garage-veh-action-btn" type="button" class="fh-btn fh-btn-primary" data-hud-interactive="true">SEÇİLİ ARAÇ</button>
          </div>
        </div>

        <!-- Right Panel: Paint Colors, Finishes & Roof Accessories -->
        <div class="fh-glass-card fh-garage-panel" data-hud-interactive="true">
          <div style="font-size:11px;font-weight:900;color:#334155;letter-spacing:0.5px;">🎨 GÖVDE BOYA RENKLERİ (12 RENK)</div>
          <div id="fh-color-grid" style="display:grid;grid-template-columns:repeat(6, 1fr);gap:7px;justify-items:center;padding:2px 0;"></div>

          <div style="font-size:11px;font-weight:900;color:#334155;letter-spacing:0.5px;margin-top:4px;">✨ BOYA YÜZEY DOKUSU (3 TİP)</div>
          <div id="fh-finish-row" style="display:grid;grid-template-columns:repeat(3, 1fr);gap:5px;"></div>

          <div style="font-size:11px;font-weight:900;color:#334155;letter-spacing:0.5px;margin-top:4px;">🛠️ TAVAN & KEŞİF AKSESUARLARI</div>
          <div id="fh-accessory-list" style="display:flex;flex-direction:column;gap:6px;"></div>
        </div>
      </div>

      <!-- Bottom Panel: 7-Vehicle Fleet Selector -->
      <div class="fh-glass-card fh-garage-bottom" data-hud-interactive="true">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:11px;font-weight:900;color:#334155;letter-spacing:0.6px;">🚘 7 ARAÇLIK ARAZİ FİLOSU (4x4 & 6x6)</span>
          <span style="font-size:11px;font-weight:700;color:#64748b;">Hedeflere ulaşarak ve gizli öğeleri bularak yeni araçlar satın al</span>
        </div>
        <div id="fh-fleet-row" class="fh-fleet-strip" data-hud-interactive="true"></div>
      </div>
    `,this.drivingOverlay=document.createElement("div"),this.drivingOverlay.className="fh-driving-overlay",this.drivingOverlay.innerHTML=`
      <!-- Top-Left Wallet & Expedition Card -->
      <div class="fh-glass-card fh-top-left-card" data-hud-interactive="true">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <div style="font-size:16px;font-weight:900;color:#b45309;">💵 <span id="fh-cash-driving">$150</span></div>
          <button id="fh-btn-return-garage" type="button" class="fh-btn fh-btn-primary" style="padding:5px 10px;font-size:11px;" data-hud-interactive="true">
            🏠 GARAJ
          </button>
        </div>
        <div id="fh-biome-title" style="font-size:11px;font-weight:900;color:#0f172a;letter-spacing:0.4px;">ZÜMRÜT ORMAN VADİSİ</div>
        <div style="display:flex;gap:8px;font-size:11px;font-weight:800;color:#334155;">
          <span id="fh-wp-prog">🎯 Hedef: 0/5</span>
          <span id="fh-secret-prog">💎 Gizli: 0/10</span>
          <span id="fh-tower-prog">🗼 Kule: 0/3</span>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:2px;">
          <span style="font-size:10px;font-weight:800;color:#64748b;">ZEMİN:</span>
          <span id="fh-surface-badge" style="font-size:10px;font-weight:900;color:#fff;background:#d97706;padding:2px 8px;border-radius:999px;">TOPRAK PATİKA</span>
        </div>
      </div>

      <!-- Top-Center Compass & 60m Secret Proximity Radar -->
      <div class="fh-top-center-wrap">
        <div class="fh-dark-card" style="padding:6px 16px;display:flex;align-items:center;gap:14px;" data-hud-interactive="true">
          <span id="fh-compass-bearing" style="font-size:12px;font-weight:900;color:#38bdf8;min-width:65px;">🧭 K (0°)</span>
          <span style="color:#64748b;">|</span>
          <span id="fh-waypoint-dist" style="font-size:12px;font-weight:800;color:#facc15;">📍 Vadi Çam Geçidi • 180m</span>
        </div>

        <div id="fh-radar-container" class="fh-dark-card" style="padding:6px 14px;display:none;align-items:center;gap:8px;border-color:#facc15;" data-hud-interactive="true">
          <span style="font-size:11px;font-weight:900;color:#facc15;">📡 GİZLİ ÖĞE SİNYALİ:</span>
          <div style="display:flex;align-items:flex-end;gap:3px;height:14px;">
            <div class="fh-radar-bar" style="width:5px;height:4px;background:#475569;border-radius:2px;"></div>
            <div class="fh-radar-bar" style="width:5px;height:7px;background:#475569;border-radius:2px;"></div>
            <div class="fh-radar-bar" style="width:5px;height:10px;background:#475569;border-radius:2px;"></div>
            <div class="fh-radar-bar" style="width:5px;height:12px;background:#475569;border-radius:2px;"></div>
            <div class="fh-radar-bar" style="width:5px;height:14px;background:#475569;border-radius:2px;"></div>
          </div>
          <span id="fh-radar-hint" style="font-size:10px;font-weight:700;color:#e2e8f0;">Yakında!</span>
        </div>
      </div>

      <!-- Top-Right Circular Minimap & Quick Action Controls -->
      <div class="fh-top-right-wrap">
        <div class="fh-dark-card" style="padding:6px;border-radius:50%;width:144px;height:144px;display:flex;align-items:center;justify-content:center;position:relative;" data-hud-interactive="true">
          <canvas id="fh-minimap-canvas" width="132" height="132" style="border-radius:50%;display:block;"></canvas>
          <span style="position:absolute;top:6px;left:50%;transform:translateX(-50%);font-size:9px;font-weight:900;color:#38bdf8;">K</span>
        </div>
        <div style="display:flex;gap:5px;flex-wrap:wrap;justify-content:flex-end;max-width:230px;" data-hud-interactive="true">
          <button id="fh-btn-cam" type="button" class="fh-btn" title="Kamera Modu (C)" data-hud-interactive="true">📷 TPS (C)</button>
          <button id="fh-btn-lights" type="button" class="fh-btn" title="Farlar (L)" data-hud-interactive="true">💡 Far (L)</button>
          <button id="fh-btn-horn" type="button" class="fh-btn" title="Korna (H)" data-hud-interactive="true">📯 (H)</button>
          <button id="fh-btn-recover" type="button" class="fh-btn" title="Aracı Kurtar (R)" data-hud-interactive="true">🔄 Kurtar (R)</button>
          <button id="fh-btn-slowmo" type="button" class="fh-btn" title="Ağır Çekim Süspansiyon (V)" data-hud-interactive="true">🎬 (V)</button>
          <button id="fh-btn-gps" type="button" class="fh-btn" title="GPS Okları (G)" data-hud-interactive="true">🧭 GPS (G)</button>
        </div>
      </div>

      <!-- Bottom-Left Rewarded Ad Hook 1: In-Level Exploration Boosters -->
      <div class="fh-bottom-left-wrap" data-hud-interactive="true">
        <button id="fh-booster-radar" type="button" class="fh-btn hud-booster-btn" data-ad-hook="booster" data-hud-interactive="true" style="justify-content:space-between;min-width:235px;padding:8px 12px;background:rgba(15,23,42,0.88);color:#fff;border-color:#38bdf8;">
          <span>📡 Gizli Öğe Radar Pusulası (60s)</span>
          <span class="hud-booster-badge" style="background:#0284c7;color:#fff;padding:2px 6px;border-radius:6px;font-size:10px;">🎬 FREE</span>
        </button>
        <button id="fh-booster-torque" type="button" class="fh-btn hud-booster-btn" data-ad-hook="booster" data-hud-interactive="true" style="justify-content:space-between;min-width:235px;padding:8px 12px;background:rgba(15,23,42,0.88);color:#fff;border-color:#10b981;">
          <span>⚡ Süper 6x6 Tork & Çekiş (45s)</span>
          <span class="hud-booster-badge" style="background:#059669;color:#fff;padding:2px 6px;border-radius:6px;font-size:10px;">🎬 FREE</span>
        </button>
      </div>

      <!-- Bottom-Right Offroad Telemetry Cluster & Touch Pedals -->
      <div class="fh-bottom-right-wrap" data-hud-interactive="true">
        <!-- Mobile Touch Brake/Gas Pedals -->
        <div style="display:flex;gap:6px;align-items:flex-end;" data-hud-interactive="true">
          <button id="fh-pedal-brake" type="button" class="fh-pedal-btn" style="background:rgba(239,68,68,0.88);color:#fff;border:2px solid #fca5a5;" data-hud-interactive="true">
            <span>🛑</span>
            <span>FREN</span>
          </button>
          <button id="fh-pedal-gas" type="button" class="fh-pedal-btn" style="height:92px;background:rgba(16,185,129,0.9);color:#fff;border:2px solid #6ee7b7;" data-hud-interactive="true">
            <span>⚡</span>
            <span>GAZ</span>
          </button>
        </div>

        <!-- Speed, RPM, Gear, 4x4 Lock & Pitch/Roll Inclinometer -->
        <div class="fh-dark-card" style="padding:11px 14px;min-width:210px;display:flex;flex-direction:column;gap:7px;" data-hud-interactive="true">
          <div style="display:flex;align-items:baseline;justify-content:space-between;">
            <div>
              <span id="fh-speed-val" style="font-size:28px;font-weight:900;color:#f8fafc;letter-spacing:-1px;">0</span>
              <span style="font-size:11px;font-weight:800;color:#94a3b8;">km/h</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:10px;font-weight:800;color:#94a3b8;">VİTES</span>
              <span id="fh-gear-val" style="background:#f59e0b;color:#0f172a;font-weight:900;font-size:14px;padding:2px 8px;border-radius:7px;">1</span>
            </div>
          </div>

          <!-- RPM Bar -->
          <div>
            <div style="display:flex;justify-content:space-between;font-size:9px;font-weight:800;color:#94a3b8;margin-bottom:2px;">
              <span>MOTOR DEVİR (RPM)</span>
              <span id="fh-rpm-text">850 RPM</span>
            </div>
            <div style="height:6px;background:#1e293b;border-radius:999px;overflow:hidden;">
              <div id="fh-rpm-fill" style="width:15%;height:100%;background:linear-gradient(90deg,#38bdf8,#f59e0b,#ef4444);transition:width 0.06s linear;"></div>
            </div>
          </div>

          <!-- Pitch & Roll Inclinometer -->
          <div style="display:flex;justify-content:space-between;font-size:10px;font-weight:800;color:#cbd5e1;background:rgba(30,41,59,0.75);padding:4px 8px;border-radius:8px;">
            <span id="fh-pitch-val">📐 Eğim: 0°</span>
            <span id="fh-roll-val">⚖️ Yanal: 0°</span>
          </div>

          <!-- 4x4 Diff-Lock & Handbrake Buttons -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            <button id="fh-btn-difflock" type="button" class="fh-btn" style="background:#1e293b;color:#94a3b8;border-color:#475569;font-size:11px;padding:6px;" data-hud-interactive="true">
              🔒 4x4 LOCK (E)
            </button>
            <button id="fh-btn-handbrake" type="button" class="fh-btn" style="background:#1e293b;color:#94a3b8;border-color:#475569;font-size:11px;padding:6px;" data-hud-interactive="true">
              🅿️ EL FRENİ
            </button>
          </div>
        </div>
      </div>
    `,this.calloutBanner=document.createElement("div"),this.calloutBanner.style.cssText="position:absolute;top:86px;left:50%;transform:translateX(-50%);padding:8px 18px;border-radius:999px;background:rgba(15,23,42,0.92);color:#fff;font-weight:900;font-size:13px;border:2px solid #f59e0b;box-shadow:0 8px 24px rgba(0,0,0,0.28);pointer-events:none;opacity:0;transition:opacity 0.2s ease;z-index:40;",this.rescueBanner=document.createElement("div"),this.rescueBanner.className="fh-dark-card",this.rescueBanner.setAttribute("data-hud-interactive","true"),this.rescueBanner.style.cssText="position:absolute;top:132px;left:50%;transform:translateX(-50%);padding:12px 16px;display:none;flex-direction:column;align-items:center;gap:8px;border:2px solid #10b981;z-index:45;min-width:290px;text-align:center;",this.rescueBanner.innerHTML=`
      <div style="font-size:12px;font-weight:900;color:#fca5a5;">⚠️ ARAÇ ZORLU YAMACA / ÇAMURA SAPLANDI!</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
        <button id="fh-btn-rescue-ad" type="button" class="fh-btn fh-btn-emerald btn-revive" data-ad-hook="revive" data-hud-interactive="true">
          🎬 KURTAR + SÜPER TUTUNMA & +$250 DESTEK
        </button>
        <button id="fh-btn-rescue-free" type="button" class="fh-btn" data-hud-interactive="true">
          🔄 Normal Kurtar (R)
        </button>
      </div>
    `,this.victoryModal=document.createElement("div"),this.victoryModal.className="modal-overlay",this.victoryModal.setAttribute("data-hud-interactive","true"),this.victoryModal.style.cssText="position:absolute;inset:0;background:rgba(15,23,42,0.72);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;z-index:90;pointer-events:auto;padding:16px;",this.victoryModal.innerHTML=`
      <div class="fh-glass-card modal-card" data-hud-interactive="true" style="max-width:410px;width:100%;padding:24px 20px;text-align:center;display:flex;flex-direction:column;gap:14px;border:2.5px solid #f59e0b;">
        <div id="fh-vic-title" style="font-size:20px;font-weight:900;color:#0f172a;">🔓 YENİ BİYOM AÇILDI!</div>
        <div id="fh-vic-sub" style="font-size:13px;font-weight:700;color:#475569;">5/5 Hedef Tamamlandı!</div>

        <!-- Oscillating Multiplier Needle Bar -->
        <div style="display:flex;flex-direction:column;gap:6px;margin:4px 0;" data-hud-interactive="true">
          <div style="display:grid;grid-template-columns:repeat(7,1fr);font-size:11px;font-weight:900;color:#0f172a;">
            <span>1.5x</span><span>2x</span><span>3x</span><span style="color:#d97706;font-size:13px;">5x</span><span>3x</span><span>2x</span><span>1.5x</span>
          </div>
          <div style="position:relative;height:16px;border-radius:999px;background:linear-gradient(90deg,#38bdf8 0%,#22c55e 28%,#f59e0b 50%,#22c55e 72%,#38bdf8 100%);overflow:hidden;border:1.5px solid #0f172a;">
            <div id="fh-needle-cursor" style="position:absolute;top:0;bottom:0;left:50%;width:6px;margin-left:-3px;background:#ffffff;box-shadow:0 0 8px #000;"></div>
          </div>
        </div>

        <button id="fh-btn-vic-mult" type="button" class="fh-btn fh-btn-primary btn-multiplier" data-ad-hook="multiplier" data-hud-interactive="true" style="width:100%;padding:13px;font-size:15px;">
          🎬 İZLE & 5x ÖDÜL AL ($1,250)
        </button>
        <button id="fh-btn-vic-std" type="button" class="fh-btn" data-hud-interactive="true" style="width:100%;padding:10px;font-size:13px;">
          Standart Ödülü Al & Devam Et
        </button>
      </div>
    `;const t=n=>n.stopPropagation();this.victoryModal.addEventListener("pointerdown",t),this.victoryModal.addEventListener("click",t),this.rescueBanner.addEventListener("pointerdown",t),e.appendChild(this.garageOverlay),e.appendChild(this.drivingOverlay),e.appendChild(this.calloutBanner),e.appendChild(this.rescueBanner),e.appendChild(this.victoryModal),this.root.appendChild(e),this.cacheReferencesAndBind()}cacheReferencesAndBind(){this.elCashGarage=this.root.querySelector("#fh-cash-garage"),this.elGarageVehicleTitle=this.root.querySelector("#fh-garage-veh-title"),this.elGarageVehicleSub=this.root.querySelector("#fh-garage-veh-sub"),this.elGarageStrength=this.root.querySelector("#fh-garage-veh-strength"),this.elStatBars=this.root.querySelector("#fh-stat-bars"),this.elUpgradeList=this.root.querySelector("#fh-upgrade-list"),this.elColorGrid=this.root.querySelector("#fh-color-grid"),this.elFinishRow=this.root.querySelector("#fh-finish-row"),this.elAccessoryList=this.root.querySelector("#fh-accessory-list"),this.elFleetRow=this.root.querySelector("#fh-fleet-row"),this.elGarageVehicleActionBtn=this.root.querySelector("#fh-garage-veh-action-btn"),this.elBiomeSelectRow=this.root.querySelector("#fh-biome-select-row"),this.elCashDriving=this.root.querySelector("#fh-cash-driving"),this.elBiomeTitle=this.root.querySelector("#fh-biome-title"),this.elWaypointProg=this.root.querySelector("#fh-wp-prog"),this.elSecretProg=this.root.querySelector("#fh-secret-prog"),this.elTowerProg=this.root.querySelector("#fh-tower-prog"),this.elSurfaceBadge=this.root.querySelector("#fh-surface-badge"),this.elCompassBearing=this.root.querySelector("#fh-compass-bearing"),this.elWaypointDist=this.root.querySelector("#fh-waypoint-dist"),this.elRadarContainer=this.root.querySelector("#fh-radar-container"),this.elRadarBars=Array.from(this.root.querySelectorAll(".fh-radar-bar")),this.elRadarHint=this.root.querySelector("#fh-radar-hint"),this.minimapCanvas=this.root.querySelector("#fh-minimap-canvas"),this.minimapCtx=this.minimapCanvas.getContext("2d"),this.elSpeedVal=this.root.querySelector("#fh-speed-val"),this.elGearVal=this.root.querySelector("#fh-gear-val"),this.elRpmFill=this.root.querySelector("#fh-rpm-fill"),this.elRpmText=this.root.querySelector("#fh-rpm-text"),this.elPitchVal=this.root.querySelector("#fh-pitch-val"),this.elRollVal=this.root.querySelector("#fh-roll-val"),this.btnDiffLock=this.root.querySelector("#fh-btn-difflock"),this.btnHandbrake=this.root.querySelector("#fh-btn-handbrake"),this.btnCameraMode=this.root.querySelector("#fh-btn-cam"),this.btnHeadlights=this.root.querySelector("#fh-btn-lights"),this.btnSlowMo=this.root.querySelector("#fh-btn-slowmo"),this.btnGpsToggle=this.root.querySelector("#fh-btn-gps"),this.btnBoosterRadar=this.root.querySelector("#fh-booster-radar"),this.btnBoosterTorque=this.root.querySelector("#fh-booster-torque"),this.elVictoryTitle=this.root.querySelector("#fh-vic-title"),this.elVictorySub=this.root.querySelector("#fh-vic-sub"),this.elNeedleCursor=this.root.querySelector("#fh-needle-cursor"),this.btnVictoryMultiplier=this.root.querySelector("#fh-btn-vic-mult"),this.btnVictoryStandard=this.root.querySelector("#fh-btn-vic-std");const e=this.root.querySelector("#hud-sound-btn");e.addEventListener("click",()=>{const i=this.audio.toggleMute();e.textContent=i?"🔇":"🔊"}),this.root.querySelector("#fh-start-drive-btn").addEventListener("click",()=>{this.audio.playGarageClick(),this.world.store.isVehicleOwned(this.previewVehicleId)&&this.world.store.buyOrSelectVehicle(this.previewVehicleId),this.input.isShowroomMode=!1,this.world.startDrivingInBiome(this.world.store.data.selectedBiomeId),this.refreshHud()}),this.elGarageVehicleActionBtn.addEventListener("click",()=>{const i=this.world.store.buyOrSelectVehicle(this.previewVehicleId);i.success?(this.audio.playUpgradeSuccess(),this.showCallout(i.messageTr,"#10b981")):(this.audio.playError(),this.showCallout(i.messageTr,"#ef4444")),this.refreshHud()}),this.root.querySelector("#fh-btn-return-garage").addEventListener("click",()=>{this.audio.playGarageClick(),this.previewVehicleId=this.world.store.data.selectedVehicleId,this.input.isShowroomMode=!0,this.world.enterShowroomGarage(),this.refreshHud()}),this.btnCameraMode.addEventListener("click",()=>this.input.queueHudAction("cycleCameraMode")),this.btnHeadlights.addEventListener("click",()=>this.input.queueHudAction("toggleHeadlights")),this.root.querySelector("#fh-btn-horn").addEventListener("click",()=>this.input.queueHudAction("triggerHorn")),this.root.querySelector("#fh-btn-recover").addEventListener("click",()=>this.input.queueHudAction("recoverVehicle")),this.btnSlowMo.addEventListener("click",()=>this.input.queueHudAction("toggleSlowMotion")),this.btnGpsToggle.addEventListener("click",()=>this.input.queueHudAction("toggleGpsChevrons")),this.btnDiffLock.addEventListener("click",()=>this.input.queueHudAction("toggleDiffLock"));const n=(i,s,a)=>{i.addEventListener("pointerdown",o=>{o.stopPropagation(),s()}),i.addEventListener("pointerup",o=>{o.stopPropagation(),a()}),i.addEventListener("pointerleave",a),i.addEventListener("pointercancel",a)};n(this.btnHandbrake,()=>{this.input.touchHandbrakeHeld=!0},()=>{this.input.touchHandbrakeHeld=!1}),n(this.root.querySelector("#fh-pedal-gas"),()=>{this.input.touchGasHeld=!0},()=>{this.input.touchGasHeld=!1}),n(this.root.querySelector("#fh-pedal-brake"),()=>{this.input.touchBrakeHeld=!0},()=>{this.input.touchBrakeHeld=!1}),this.btnBoosterRadar.addEventListener("click",async()=>{if(this.isAdBusy||!this.ads.isRewardedReady())return;this.isAdBusy=!0;const i=await this.ads.showRewarded("booster_secret_radar_compass");this.isAdBusy=!1,i&&this.world.activateSecretRadarBooster()}),this.btnBoosterTorque.addEventListener("click",async()=>{if(this.isAdBusy||!this.ads.isRewardedReady())return;this.isAdBusy=!0;const i=await this.ads.showRewarded("booster_mega_torque_grip");this.isAdBusy=!1,i&&this.world.activateMegaTorqueBooster()}),this.root.querySelector("#fh-btn-rescue-ad").addEventListener("click",async()=>{if(this.isAdBusy||!this.ads.isRewardedReady())return;this.isAdBusy=!0;const i=await this.ads.showRewarded("revive_cliff_rescue_cash");this.isAdBusy=!1,i&&(this.world.applyCliffRescueAndCashDrop(),this.rescueBanner.style.display="none")}),this.root.querySelector("#fh-btn-rescue-free").addEventListener("click",()=>{this.input.queueHudAction("recoverVehicle"),this.rescueBanner.style.display="none"}),this.btnVictoryMultiplier.addEventListener("click",async()=>{if(this.victoryClaimedLatch||this.isAdBusy||!this.ads.isRewardedReady())return;const i=this.getCurrentNeedleMultiplier();this.isAdBusy=!0;const s=await this.ads.showRewarded("victory_milestone_multiplier");if(this.isAdBusy=!1,!s||this.victoryClaimedLatch)return;this.victoryClaimedLatch=!0;const a=Math.floor(this.victoryBaseReward*i),o=Math.max(0,a-this.victoryBaseReward);o>0&&this.world.store.addCash(o),this.audio.playUpgradeSuccess(),this.closeVictoryModal(),this.showCallout(`🎉 ${i}x ÇARPAN ÖDÜLÜ ALINDI! (+$${a})`,"#f59e0b"),this.refreshHud()}),this.btnVictoryStandard.addEventListener("click",()=>{this.victoryClaimedLatch||(this.victoryClaimedLatch=!0,this.audio.playGarageClick(),this.closeVictoryModal(),this.refreshHud())})}syncAdButtons(){const e=this.ads.isRewardedReady();this.ads.syncDomAdState(e),this.btnVictoryMultiplier&&(this.btnVictoryMultiplier.style.display=e?"inline-flex":"none")}showCallout(e,t="#f59e0b"){this.calloutBanner.textContent=e,this.calloutBanner.style.borderColor=t,this.calloutBanner.style.opacity="1",this.calloutTimer=2.8}showMilestoneVictoryModal(e){this.isVictoryModalOpen||(this.isVictoryModalOpen=!0,this.victoryClaimedLatch=!1,this.victoryBaseReward=Math.max(100,e.baseReward),this.elVictoryTitle.textContent=e.titleTr,this.elVictorySub.textContent=e.subtitleTr,this.btnVictoryStandard.textContent=`Standart Ödülle Devam Et ($${this.victoryBaseReward})`,this.syncAdButtons(),this.victoryModal.style.display="flex")}closeVictoryModal(){this.isVictoryModalOpen=!1,this.victoryModal.style.display="none"}getCurrentNeedleMultiplier(){const e=(Math.sin(this.needlePhase)+1)*.5,t=Math.min(Ca.length-1,Math.floor(e*Ca.length));return Ca[t]}refreshHud(){const e=this.world.store,t=this.world.viewMode==="showroom";this.input.isShowroomMode=t,this.garageOverlay.style.display=t?"flex":"none",this.drivingOverlay.style.display=t?"none":"block";const n=`$${e.data.cash.toLocaleString("tr-TR")}`;this.elCashGarage.textContent=n,this.elCashDriving.textContent=n,t?this.renderGarageView():this.renderDrivingStaticInfo()}renderGarageView(){const e=this.world.store,t=Pr(this.previewVehicleId),n=e.isVehicleOwned(this.previewVehicleId),i=e.data.selectedVehicleId===this.previewVehicleId,s=e.getEffectiveStats(this.previewVehicleId),a=e.getCustomization(this.previewVehicleId);this.elGarageVehicleTitle.textContent=t.name,this.elGarageVehicleSub.textContent=`${t.classTr} • ${t.wheels===6?"6x6 (6 Teker)":"4x4 (4 Teker)"}`,this.elGarageStrength.textContent=t.signatureStrengthTr,n?(this.elGarageVehicleActionBtn.textContent=i?"✓ AKTİF ARAÇ":"🚙 BU ARACI SEÇ",this.elGarageVehicleActionBtn.className=i?"fh-btn fh-btn-emerald":"fh-btn fh-btn-primary"):(this.elGarageVehicleActionBtn.textContent=`🛒 SATIN AL ($${t.cost.toLocaleString("tr-TR")})`,this.elGarageVehicleActionBtn.className="fh-btn fh-btn-primary");const o=["forest","desert","mountain"];this.elBiomeSelectRow.innerHTML="";for(let l=0;l<o.length;l++){const h=o[l],d=Ft[h],u=e.isBiomeUnlocked(h),f=e.data.selectedBiomeId===h,x=document.createElement("button");if(x.type="button",x.setAttribute("data-hud-interactive","true"),x.className=f?"fh-btn fh-btn-primary":"fh-btn",u){const g=h==="forest"?"🌲":h==="desert"?"🏜️":"🏔️";x.textContent=`${g} ${d.nameTr}`}else{const g=d.prerequisiteBiome,m=e.data.biomeWaypoints[g]||0;x.style.opacity="0.65",x.textContent=`🔒 ${d.nameTr} (${m}/5 Hedef)`}x.addEventListener("click",()=>{if(!u){this.audio.playError();const g=Ft[d.prerequisiteBiome].nameTr;this.showCallout(`🔒 Açmak için ${g} içinde 5 hedef tamamla!`,"#f59e0b");return}this.audio.playGarageClick(),e.selectBiome(h),this.refreshHud()}),this.elBiomeSelectRow.appendChild(x)}const c=[{label:`Maks Hız (${s.maxSpeedKmh} km/h)`,pct:s.speedPct},{label:"Tırmanma Torku",pct:s.torquePct},{label:"Arazi Tutunması",pct:s.gripPct},{label:"Süspansiyon Esnemesi",pct:s.suspensionPct}];this.elStatBars.innerHTML=c.map(l=>`
      <div class="fh-stat-row">
        <div style="display:flex;justify-content:space-between;font-size:10px;font-weight:800;color:#334155;">
          <span>${l.label}</span>
          <span>${l.pct}/100</span>
        </div>
        <div class="fh-stat-bar-bg">
          <div class="fh-stat-bar-fill" style="width:${l.pct}%;"></div>
        </div>
      </div>
    `).join(""),this.elUpgradeList.innerHTML="";for(let l=0;l<Wc.length;l++){const h=Wc[l],d=a.upgrades[h.id]||1,u=e.getUpgradeCost(this.previewVehicleId,h.id),f=document.createElement("div");f.style.cssText="display:flex;align-items:center;justify-content:space-between;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:6px 8px;",f.innerHTML=`
        <div>
          <div style="font-size:11px;font-weight:900;color:#0f172a;">${h.icon} ${h.shortTr} <span style="color:#d97706;">SV ${d}/5</span></div>
          <div style="font-size:9px;color:#64748b;">Her seviye +%6 performans</div>
        </div>
      `;const x=document.createElement("button");x.type="button",x.setAttribute("data-hud-interactive","true"),x.className=u===null?"fh-btn":"fh-btn fh-btn-primary",x.style.padding="5px 9px",x.style.fontSize="11px",x.textContent=n?u===null?"✓ MAKS":`+$${u}`:"🔒 Araç Yok",x.disabled=!n||u===null,x.addEventListener("click",()=>{this.handleUpgradeStat(h.id)}),f.appendChild(x),this.elUpgradeList.appendChild(f)}this.elColorGrid.innerHTML="";for(let l=0;l<Vc.length;l++){const h=Vc[l],d=document.createElement("button");d.type="button",d.setAttribute("data-hud-interactive","true"),d.title=h.nameTr,d.className="fh-color-swatch"+(a.bodyColorHex===h.hex?" is-active":""),d.style.background=h.cssHex,d.addEventListener("click",()=>{this.audio.playGarageClick(),e.setBodyColor(this.previewVehicleId,h.hex),this.world.refreshShowroomCustomization(this.previewVehicleId),this.renderGarageView()}),this.elColorGrid.appendChild(d)}this.elFinishRow.innerHTML="";for(let l=0;l<Gc.length;l++){const h=Gc[l],d=document.createElement("button");d.type="button",d.setAttribute("data-hud-interactive","true"),d.className=a.paintFinish===h.id?"fh-btn fh-btn-primary":"fh-btn",d.style.fontSize="10px",d.style.padding="6px 4px",d.textContent=h.id==="matte"?"Mat":h.id==="gloss"?"Parlak":"Metalik",d.addEventListener("click",()=>{this.audio.playGarageClick(),e.setPaintFinish(this.previewVehicleId,h.id),this.world.refreshShowroomCustomization(this.previewVehicleId),this.renderGarageView()}),this.elFinishRow.appendChild(d)}this.elAccessoryList.innerHTML="";for(let l=0;l<Io.length;l++){const h=Io[l],d=a.ownedAccessories.includes(h.id),u=a.equippedAccessories.includes(h.id),f=document.createElement("div");f.style.cssText="display:flex;align-items:center;justify-content:space-between;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:6px 8px;",f.innerHTML=`
        <div style="padding-right:6px;">
          <div style="font-size:11px;font-weight:800;color:#0f172a;">${h.nameTr}</div>
          <div style="font-size:9px;color:#64748b;">${h.descTr}</div>
        </div>
      `;const x=document.createElement("button");x.type="button",x.setAttribute("data-hud-interactive","true"),x.className=u?"fh-btn fh-btn-emerald":d?"fh-btn":"fh-btn fh-btn-primary",x.style.padding="5px 8px",x.style.fontSize="10px",x.textContent=u?"✓ TAKILI":d?"TAK":`$${h.cost}`,x.addEventListener("click",()=>{this.handleToggleAccessory(h.id)}),f.appendChild(x),this.elAccessoryList.appendChild(f)}this.elFleetRow.innerHTML="";for(let l=0;l<pn.length;l++){const h=pn[l],d=e.isVehicleOwned(h.id),u=this.previewVehicleId===h.id,f=document.createElement("button");f.type="button",f.setAttribute("data-hud-interactive","true"),f.className="fh-fleet-card"+(u?" is-selected":""),f.innerHTML=`
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:10px;font-weight:900;color:#d97706;">${h.wheels===6?"6x6":"4x4"}</span>
          <span style="font-size:10px;font-weight:900;color:${d?"#16a34a":"#0f172a"};">
            ${d?"✓ SAHİP":"$"+h.cost.toLocaleString("tr-TR")}
          </span>
        </div>
        <div style="font-size:12px;font-weight:900;color:#0f172a;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${h.name}</div>
        <div style="font-size:10px;color:#64748b;font-weight:700;">Hız: ${h.maxSpeedKmh} km/h • Tork: ${h.torqueStat}</div>
      `,f.addEventListener("click",()=>{this.audio.playGarageClick(),this.previewVehicleId=h.id,d&&e.buyOrSelectVehicle(h.id),this.world.rebuildShowroomVehicle(h.id),this.renderGarageView()}),this.elFleetRow.appendChild(f)}}handleUpgradeStat(e){const t=this.world.store.upgradeMechanicalStat(this.previewVehicleId,e);t.success?(this.audio.playUpgradeSuccess(),this.showCallout(t.messageTr,"#10b981")):(this.audio.playError(),this.showCallout(t.messageTr,"#ef4444")),this.refreshHud()}handleToggleAccessory(e){const t=this.world.store.toggleOrBuyAccessory(this.previewVehicleId,e);t.success?(this.audio.playUpgradeSuccess(),this.world.refreshShowroomCustomization(this.previewVehicleId),this.showCallout(t.messageTr,"#10b981")):(this.audio.playError(),this.showCallout(t.messageTr,"#ef4444")),this.refreshHud()}renderDrivingStaticInfo(){const e=this.world.store,t=this.world.activeBiomeId,n=Ft[t];this.elBiomeTitle.textContent=n.nameTr;const i=e.data.biomeWaypoints[t]||0,s=e.getDiscoveredCountInBiome(t),a=e.getActivatedWatchtowersInBiome(t);this.elWaypointProg.textContent=`🎯 Hedef: ${i}/5`,this.elSecretProg.textContent=`💎 Gizli: ${s}/10`,this.elTowerProg.textContent=`🗼 Kule: ${a}/3`}update(e){if(this.calloutTimer>0&&(this.calloutTimer=Math.max(0,this.calloutTimer-e),this.calloutTimer<=0&&(this.calloutBanner.style.opacity="0")),this.isVictoryModalOpen){this.needlePhase+=e*3.6;const d=(Math.sin(this.needlePhase)+1)*.5*88+6;this.elNeedleCursor.style.left=`${d.toFixed(1)}%`;const u=this.getCurrentNeedleMultiplier(),f=Math.floor(this.victoryBaseReward*u);this.btnVictoryMultiplier.textContent=`🎬 İZLE & ${u}x ÖDÜL AL ($${f})`}if(this.world.viewMode!=="driving"||!this.world.player)return;const t=this.world.player;this.elSpeedVal.textContent=`${Math.round(t.speedKmh)}`,this.elGearVal.textContent=`${t.currentGear}`,this.elRpmText.textContent=`${Math.round(t.rpm)} RPM`;const n=Math.min(100,Math.max(8,(t.rpm-700)/5800*100));this.elRpmFill.style.width=`${n.toFixed(0)}%`;const i=Math.round(t.pitchRad*180/Math.PI),s=Math.round(t.rollRad*180/Math.PI);this.elPitchVal.textContent=`📐 Eğim: ${i>0?"+":""}${i}°`,this.elRollVal.textContent=`⚖️ Yanal: ${s>0?"+":""}${s}°`;const a=Vh[t.currentSurface];this.elSurfaceBadge.textContent=a.nameTr,this.elSurfaceBadge.style.background=a.badgeColor,this.btnDiffLock.style.background=t.diffLock4x4?"#f59e0b":"#1e293b",this.btnDiffLock.style.color=t.diffLock4x4?"#0f172a":"#94a3b8",this.btnHandbrake.style.background=t.handbrakeActive?"#ef4444":"#1e293b",this.btnHandbrake.style.color=t.handbrakeActive?"#ffffff":"#94a3b8",this.btnHeadlights.style.background=t.headlightsOn?"#fef08a":"#ffffff",this.btnSlowMo.style.background=this.world.slowMotionActive?"#38bdf8":"#ffffff",this.btnGpsToggle.style.background=this.world.gpsChevronsVisible?"#dcfce7":"#ffffff";let o=Math.round(-t.headingRad*180/Math.PI%360);o<0&&(o+=360);const l=["K","KD","D","GD","G","GB","B","KB"][Math.round(o/45)%8];this.elCompassBearing.textContent=`🧭 ${l} (${o}°)`,this.elWaypointDist.textContent=`📍 ${this.world.activeWaypointNameTr} • ${Math.round(this.world.activeWaypointDistM)}m`;const h=this.world.radarSignalBars;if(h>0){this.elRadarContainer.style.display="flex";for(let d=0;d<this.elRadarBars.length;d++)this.elRadarBars[d].style.background=d<h?"#facc15":"#475569";this.elRadarHint.textContent=`${Math.round(this.world.nearestCollectibleDistM)}m • ${this.world.nearestCollectibleHintTr}`}else this.elRadarContainer.style.display="none";this.rescueBanner.style.display=t.needsRescuePrompt?"flex":"none",this.drawMinimap()}drawMinimap(){const e=this.minimapCtx,t=this.world.player;if(!e||!t)return;const n=132,i=132,s=n*.5,a=i*.5,o=.13;e.clearRect(0,0,n,i),e.fillStyle="#0f172a",e.beginPath(),e.arc(s,a,s-2,0,Math.PI*2),e.fill(),e.strokeStyle="rgba(148, 163, 184, 0.22)",e.lineWidth=1,e.beginPath(),e.arc(s,a,28,0,Math.PI*2),e.arc(s,a,52,0,Math.PI*2),e.stroke();let c=!1;for(let u=0;u<this.world.watchtowers.length;u++)if(this.world.watchtowers[u].activated){c=!0;break}if(c){e.strokeStyle="rgba(250, 204, 21, 0.55)",e.fillStyle="rgba(250, 204, 21, 0.14)",e.lineWidth=1.2;for(let u=0;u<this.world.collectibles.length;u++){const f=this.world.collectibles[u];if(f.discovered)continue;const x=s+(f.def.x-t.pos.x)*o,g=a+(f.def.z-t.pos.z)*o;Math.hypot(x-s,g-a)<s-6&&(e.beginPath(),e.arc(x,g,7,0,Math.PI*2),e.fill(),e.stroke())}}for(let u=0;u<this.world.watchtowers.length;u++){const f=this.world.watchtowers[u],x=s+(f.def.x-t.pos.x)*o,g=a+(f.def.z-t.pos.z)*o;Math.hypot(x-s,g-a)<s-5&&(e.fillStyle=f.activated?"#38bdf8":"#94a3b8",e.beginPath(),e.arc(x,g,3.5,0,Math.PI*2),e.fill())}e.fillStyle="#4ade80";for(let u=0;u<this.world.patrolBots.length;u++){const f=this.world.patrolBots[u],x=s+(f.pos.x-t.pos.x)*o,g=a+(f.pos.z-t.pos.z)*o;Math.hypot(x-s,g-a)<s-5&&(e.beginPath(),e.arc(x,g,2.6,0,Math.PI*2),e.fill())}let l=(this.world.activeWaypointPos.x-t.pos.x)*o,h=(this.world.activeWaypointPos.z-t.pos.z)*o;const d=Math.hypot(l,h);d>s-8&&(l=l/d*(s-8),h=h/d*(s-8)),e.fillStyle="#f59e0b",e.beginPath(),e.arc(s+l,a+h,5,0,Math.PI*2),e.fill(),e.save(),e.translate(s,a),e.rotate(-t.headingRad),e.fillStyle="#ffffff",e.beginPath(),e.moveTo(0,-6),e.lineTo(4.5,5),e.lineTo(0,2.5),e.lineTo(-4.5,5),e.closePath(),e.fill(),e.restore()}}const r_={"frontier-horizon-3d":{themeColor:"#d97706",accentGradient:"linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",glowRgba:"rgba(217, 119, 6, 0.34)",tintBg:"rgba(254, 243, 199, 0.88)"},"offroad-expedition-3d":{themeColor:"#d97706",accentGradient:"linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",glowRgba:"rgba(217, 119, 6, 0.34)",tintBg:"rgba(254, 243, 199, 0.88)"},"rally-horizon-3d":{themeColor:"#0284c7",accentGradient:"linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)",glowRgba:"rgba(2, 132, 199, 0.34)",tintBg:"rgba(224, 242, 254, 0.88)"},"smash-karts-brawl-3d":{themeColor:"#ef4444",accentGradient:"linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)",glowRgba:"rgba(239, 68, 68, 0.34)",tintBg:"rgba(254, 226, 226, 0.88)"},"bridge-rush-io-3d":{themeColor:"#2563eb",accentGradient:"linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)",glowRgba:"rgba(37, 99, 235, 0.34)",tintBg:"rgba(224, 242, 254, 0.88)"},"stumble-knockout-royale-3d":{themeColor:"#ec4899",accentGradient:"linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",glowRgba:"rgba(236, 72, 153, 0.34)",tintBg:"rgba(252, 231, 243, 0.88)"},"bumper-smash-io-3d":{themeColor:"#f97316",accentGradient:"linear-gradient(135deg, #f97316 0%, #ea580c 100%)",glowRgba:"rgba(249, 115, 22, 0.34)",tintBg:"rgba(255, 237, 213, 0.88)"},"ragdoll-archers-duel-3d":{themeColor:"#2563eb",accentGradient:"linear-gradient(135deg, #2563eb 0%, #f59e0b 100%)",glowRgba:"rgba(37, 99, 235, 0.34)",tintBg:"rgba(219, 234, 254, 0.88)"},"physics-drop-merge-3d":{themeColor:"#22c55e",accentGradient:"linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",glowRgba:"rgba(34, 197, 94, 0.34)",tintBg:"rgba(220, 252, 231, 0.88)"},"voxel-craft-smash-3d":{themeColor:"#f97316",accentGradient:"linear-gradient(135deg, #f97316 0%, #eab308 100%)",glowRgba:"rgba(249, 115, 22, 0.34)",tintBg:"rgba(254, 243, 199, 0.88)"},"hole-city-io-3d":{themeColor:"#06b6d4",accentGradient:"linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",glowRgba:"rgba(6, 182, 212, 0.34)",tintBg:"rgba(207, 250, 254, 0.88)"},"hexa-sort-3d":{themeColor:"#f59e0b",accentGradient:"linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",glowRgba:"rgba(245, 158, 11, 0.34)",tintBg:"rgba(254, 243, 199, 0.88)"},"cyber-arrow-3d":{themeColor:"#6366f1",accentGradient:"linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)",glowRgba:"rgba(99, 102, 241, 0.34)",tintBg:"rgba(224, 231, 255, 0.88)"}},a_={themeColor:"#2563eb",accentGradient:"linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)",glowRgba:"rgba(37, 99, 235, 0.34)",tintBg:"rgba(224, 242, 254, 0.88)"};function o_(){return typeof document<"u"&&(document.documentElement.classList.remove("yt-embed-mode"),document.body?.classList.remove("embed-fullscreen-mode")),!1}class l_{options;isMenuOpen=!0;difficulty="normal";hasStartedOnce=!1;difficultyChangedWhileOpen=!1;stageEl=null;restartBtn=null;menuBtn=null;stagePauseBtn=null;startMenuEl=null;otherGamesList=null;resizeObserver=null;lastRestartTimestamp=0;lastObservedWidth=0;lastObservedHeight=0;onArcadeRestartBound=()=>this.triggerRestart();nativeRaf=null;nativeCancelRaf=null;parkedRafCallbacks=new Map;nextParkedRafId=9e5;bootFramesRemaining=2;onKeyDownBound=e=>{e.code==="Escape"&&(e.preventDefault(),this.isMenuOpen?this.hasStartedOnce&&this.hideStartMenuAndPlay():this.showStartMenu())};constructor(e){this.options=e,o_(),this.ensureCanonicalShellDom(),this.restartBtn=document.getElementById("shell-restart-btn"),this.menuBtn=document.getElementById("shell-menu-btn"),this.otherGamesList=document.getElementById("shell-other-games-list"),this.init()}getDifficultyMultiplier(){return this.difficulty==="easy"?.78:this.difficulty==="hard"?1.28:1}ensureCanonicalShellDom(){if(typeof document>"u")return;const e=document.getElementById("app")||document.getElementById("game-container"),t=document.getElementById("hud")||document.getElementById("hud-root");if(!e)return;e.classList.add("game-canvas-container"),t&&t.classList.add("game-hud-overlay");let n=document.getElementById("arcade-shell");n||(n=document.createElement("div"),n.id="arcade-shell",document.body.prepend(n)),n.className="arcade-shell";let i=document.getElementById("shell-stage")||n.querySelector(".shell-stage");i||(i=document.createElement("main"),i.appendChild(e),t&&i.appendChild(t)),i.id="shell-stage",i.className="shell-stage is-menu-locked",this.stageEl=i,this.applyThemePalette(r_[this.options.currentGameId]||a_),document.getElementById("shell-fullscreen-btn")?.remove(),document.getElementById("fullscreen-ad-banner")?.remove();let s=n.querySelector(".shell-sidebar-left");s||(s=document.createElement("aside"),n.prepend(s)),s.className="shell-sidebar shell-sidebar-left",s.innerHTML=`
      <div class="shell-brand">
        <a href="../" class="shell-brand-link">
          <span class="shell-brand-badge">ARCADE</span>
          <span class="shell-brand-title">3D GAMES</span>
        </a>
      </div>
      <nav class="shell-nav">
        <a href="../" class="shell-btn shell-btn-portal" title="Return to Central Arcade Portal">
          <span class="btn-icon">←</span> Portala Dön
        </a>
        <button id="shell-menu-btn" class="shell-btn shell-btn-menu" type="button">
          <span class="btn-icon">🏠</span> Başlangıç Menüsü
        </button>
        <button id="shell-restart-btn" class="shell-btn shell-btn-restart" type="button">
          <span class="btn-icon">🔄</span> Yeniden Başlat
        </button>
      </nav>
      <section class="shell-other-games">
        <h3 class="shell-section-title">Diğer Oyunlar</h3>
        <div id="shell-other-games-list" class="other-games-list"></div>
      </section>
    `,i.parentElement!==n&&n.appendChild(i);let a=document.getElementById("shell-stage-pause-btn");a||(a=document.createElement("button"),a.id="shell-stage-pause-btn",a.type="button",i.appendChild(a)),a.className="shell-stage-pause-btn",a.title="Menü / Duraklat (ESC)",a.setAttribute("data-hud-interactive","true"),a.textContent="⏸",a.addEventListener("pointerdown",l=>l.stopPropagation()),a.addEventListener("click",l=>{l.stopPropagation(),this.showStartMenu()}),this.stagePauseBtn=a,this.mountStartMenu(i);let o=n.querySelector(".shell-sidebar-right");o||(o=document.createElement("aside"),n.appendChild(o)),o.className="shell-sidebar shell-sidebar-right";const c=document.title.split("//")[0].trim()||"ARCADE 3D";o.innerHTML=`
      <div class="ad-rail-wrapper">
        <span class="ad-header-tag">SPONSOR // REKLAM</span>
        <div id="ad-banner-desktop" class="ad-banner-slot banner-300x600">
          <div class="ad-mock-creative">
            <div class="ad-mock-glow"></div>
            <p class="ad-mock-brand">${c}</p>
            <p class="ad-mock-desc">Zero-install 60 FPS WebGL 3D Arcade</p>
            <div class="ad-mock-cta">ŞİMDİ OYNA</div>
          </div>
        </div>
      </div>
    `}applyThemePalette(e){this.stageEl&&(this.stageEl.style.setProperty("--menu-theme-color",e.themeColor),this.stageEl.style.setProperty("--menu-accent-gradient",e.accentGradient),this.stageEl.style.setProperty("--menu-glow-rgba",e.glowRgba),this.stageEl.style.setProperty("--menu-tint-bg",e.tintBg))}findNativeSoundButton(){return typeof document>"u"?null:document.querySelector('#sk-mute-btn, #btn-sound, #sound-btn, #hud-sound-btn, [id*="mute"], [id*="sound"]')}mountStartMenu(e){let t=document.getElementById("shell-start-menu");t||(t=document.createElement("div"),t.id="shell-start-menu",e.appendChild(t)),t.className="shell-start-menu-overlay",t.setAttribute("data-hud-interactive","true");const i=(document.title.split("//")[0]||"3D ARCADE").trim();t.innerHTML=`
      <div class="shell-start-card" data-hud-interactive="true">
        <div class="shell-start-mini-tools" id="shell-start-mini-tools">
          <button id="shell-menu-sound-btn" class="shell-mini-icon-btn" type="button" title="Ses Aç/Kapat" style="display:none" data-hud-interactive="true">🔊</button>
          <button id="shell-menu-reset-btn" class="shell-mini-icon-btn" type="button" title="Sıfırdan Başlat" style="display:none" data-hud-interactive="true">🔄</button>
        </div>
        <div class="shell-start-icon-wrap">
          <img src="./icon.svg" alt="${i}" class="shell-start-icon" onerror="this.style.display='none'" />
        </div>
        <h1 class="shell-start-title" id="shell-start-title">${i}</h1>
        <div class="shell-difficulty-group" role="radiogroup" aria-label="Zorluk Seçimi" data-hud-interactive="true">
          <button type="button" class="shell-diff-btn" data-difficulty="easy" data-hud-interactive="true">Kolay</button>
          <button type="button" class="shell-diff-btn is-active" data-difficulty="normal" data-hud-interactive="true">Normal</button>
          <button type="button" class="shell-diff-btn" data-difficulty="hard" data-hud-interactive="true">Zor</button>
        </div>
        <button id="shell-start-play-btn" class="shell-start-play-btn" type="button" data-hud-interactive="true">
          <span>▶</span> <span id="shell-start-play-label">OYNA</span>
        </button>
      </div>
    `;const s=d=>{d.stopPropagation()};t.addEventListener("pointerdown",s),t.addEventListener("pointermove",s),t.addEventListener("pointerup",s),t.addEventListener("mousedown",s),t.addEventListener("touchstart",s,{passive:!0});const a=t.querySelectorAll(".shell-diff-btn");a.forEach(d=>{d.addEventListener("click",u=>{u.stopPropagation();const f=d.getAttribute("data-difficulty")||"normal";f!==this.difficulty&&(this.difficulty=f,this.difficultyChangedWhileOpen=!0),a.forEach(g=>g.classList.toggle("is-active",g===d));const x=this.getDifficultyMultiplier();this.options.onDifficultyChange?.(this.difficulty,x),window.dispatchEvent(new CustomEvent("arcade:difficulty",{detail:{difficulty:this.difficulty,multiplier:x}}))})});const o=t.querySelector("#shell-menu-sound-btn"),c=()=>{if(!o)return;const d=this.findNativeSoundButton();if(d){o.style.display="inline-flex";const u=d.textContent?.trim()||"";o.textContent=u.includes("🔇")?"🔇":"🔊"}else o.style.display="none"};setTimeout(c,60),o&&o.addEventListener("click",d=>{d.stopPropagation();const u=this.findNativeSoundButton();u&&(u.click(),c())});const l=t.querySelector("#shell-menu-reset-btn");l&&l.addEventListener("click",d=>{d.stopPropagation(),this.difficultyChangedWhileOpen=!0,this.hideStartMenuAndPlay()});const h=t.querySelector("#shell-start-play-btn");h&&h.addEventListener("click",d=>{d.stopPropagation(),this.hideStartMenuAndPlay()}),this.startMenuEl=t}showStartMenu(){if(!this.startMenuEl)return;this.isMenuOpen=!0,this.difficultyChangedWhileOpen=!1,this.stageEl?.classList.add("is-menu-locked"),this.startMenuEl.classList.remove("is-hidden");const e=this.startMenuEl.querySelector("#shell-menu-reset-btn");e&&(e.style.display=this.hasStartedOnce?"inline-flex":"none");const t=this.startMenuEl.querySelector("#shell-menu-sound-btn"),n=this.findNativeSoundButton();if(t&&n){t.style.display="inline-flex";const i=n.textContent?.trim()||"";t.textContent=i.includes("🔇")?"🔇":"🔊"}}hideStartMenuAndPlay(){if(!this.startMenuEl)return;const e=this.isMenuOpen||!this.startMenuEl.classList.contains("is-hidden");this.isMenuOpen=!1,this.stageEl?.classList.remove("is-menu-locked"),this.startMenuEl.classList.add("is-hidden"),e&&(!this.hasStartedOnce||this.difficultyChangedWhileOpen)&&(this.hasStartedOnce=!0,this.difficultyChangedWhileOpen=!1,this.triggerRestart()),this.flushParkedAnimationFrames()}installMenuRafGate(){typeof window>"u"||this.nativeRaf||(this.nativeRaf=window.requestAnimationFrame.bind(window),this.nativeCancelRaf=window.cancelAnimationFrame.bind(window),window.requestAnimationFrame=e=>{if(this.isMenuOpen){if(this.bootFramesRemaining>0)return this.bootFramesRemaining--,this.nativeRaf(e);const t=++this.nextParkedRafId;return this.parkedRafCallbacks.set(t,e),t}return this.nativeRaf(e)},window.cancelAnimationFrame=e=>{if(this.parkedRafCallbacks.has(e)){this.parkedRafCallbacks.delete(e);return}this.nativeCancelRaf?.(e)})}flushParkedAnimationFrames(){if(!this.nativeRaf||this.parkedRafCallbacks.size===0)return;const e=Array.from(this.parkedRafCallbacks.values());this.parkedRafCallbacks.clear();for(let t=0;t<e.length;t++)this.nativeRaf(e[t])}init(){this.installMenuRafGate(),window.addEventListener("arcade:restart",this.onArcadeRestartBound),window.addEventListener("keydown",this.onKeyDownBound),this.restartBtn&&this.restartBtn.addEventListener("click",()=>{this.isMenuOpen=!1,this.hasStartedOnce=!0,this.difficultyChangedWhileOpen=!1,this.stageEl?.classList.remove("is-menu-locked"),this.startMenuEl?.classList.add("is-hidden"),window.dispatchEvent(new CustomEvent("arcade:restart")),this.flushParkedAnimationFrames()}),this.menuBtn&&this.menuBtn.addEventListener("click",()=>{this.showStartMenu()}),this.setupResizeObserver(),this.loadOtherGames()}triggerRestart(){const e=performance.now();e-this.lastRestartTimestamp<80||(this.lastRestartTimestamp=e,this.options.onRestart())}setupResizeObserver(){const e=document.getElementById("app")||document.getElementById("game-container")||document.getElementById("shell-stage");!e||typeof ResizeObserver>"u"||(this.resizeObserver=new ResizeObserver(t=>{for(let n=0;n<t.length;n++){const i=t[n].contentRect,s=Math.round(i.width),a=Math.round(i.height);s>0&&a>0&&(s!==this.lastObservedWidth||a!==this.lastObservedHeight)&&(this.lastObservedWidth=s,this.lastObservedHeight=a,this.options.onResize&&this.options.onResize(s,a),window.dispatchEvent(new Event("resize")))}}),this.resizeObserver.observe(e))}async loadOtherGames(){if(this.otherGamesList)try{const e=await fetch("../games.json");if(!e.ok)return;const t=await e.json(),n=t.find(s=>s.id===this.options.currentGameId);n&&n.themeColor&&n.accentGradient&&this.stageEl&&(this.stageEl.style.setProperty("--menu-theme-color",n.themeColor),this.stageEl.style.setProperty("--menu-accent-gradient",n.accentGradient));const i=t.filter(s=>s.id!==this.options.currentGameId&&s.active!==!1);this.otherGamesList.innerHTML=i.map(s=>`
        <a href="../${s.id}/" class="other-game-item shell-game-card">
          <img src="../${s.id}/icon.svg" class="other-game-icon" alt="" onerror="this.style.display='none'" />
          <div class="other-game-meta game-info">
            <span class="other-game-title game-title">${s.title}</span>
            <span class="other-game-tag game-tag">${s.tags?.[0]||"3D HTML5"}</span>
          </div>
        </a>
      `).join("")}catch{}}dispose(){this.nativeRaf&&typeof window<"u"&&(window.requestAnimationFrame=this.nativeRaf,this.nativeCancelRaf&&(window.cancelAnimationFrame=this.nativeCancelRaf),this.parkedRafCallbacks.clear()),window.removeEventListener("arcade:restart",this.onArcadeRestartBound),window.removeEventListener("keydown",this.onKeyDownBound),this.resizeObserver?.disconnect(),this.stagePauseBtn}}const c_={tps_chase:"📷 TPS TAKİP KAMERASI",free_orbit_360:"📷 360° SERBEST ORBİT KAMERA",hood_cockpit:"📷 KAPUT ÜSTÜ KOKPİT KAMERA",tactical_far:"📷 TAKTİK UZAK PANORAMİK KAMERA"},Pa={yaw:0,pitch:0};function h_(r){return new l_(r)}async function d_(){$c.applyDualModeShell();const r=document.getElementById("game-container"),e=document.getElementById("game-canvas"),t=document.getElementById("hud-root"),n=new $c,i=new cx,s=rl.get();s.initialize();const a=await n.loadData(Zx),o=new Jx(n,a),c=new lx({canvas:e,antialias:!0,powerPreference:"high-performance"});c.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),c.setSize(Math.max(1,r.clientWidth),Math.max(1,r.clientHeight),!1),c.shadowMap.enabled=!0,c.shadowMap.type=No,c.toneMapping=Ds,c.toneMappingExposure=.9;const l=new vh,h=i_(l,c),d=Math.max(1,r.clientWidth)/Math.max(1,r.clientHeight),u=new qt(d<1?60:50,d,.4,1400),f=new t_(u);f.updateResize(d);const x=new n_(l),g=new e_(r);let m=null;const p=new $x(l,f,h,x,i,o,{onCallout:(R,v)=>m?.showCallout(R,v),onMilestoneVictory:R=>m?.showMilestoneVictoryModal(R),onHudRefresh:()=>m?.refreshHud()});m=new s_(t,p,g,s,i);const S=h_({currentGameId:"frontier-horizon-3d",gameTitle:"FRONTIER HORIZON 3D",gameSubtitle:"AÇIK DÜNYA 4x4 & 6x6 ARAZİ SİMÜLATÖRÜ",onRestart:()=>{p.difficulty=S.difficulty,g.resetAll(),p.viewMode==="driving"?p.startDrivingInBiome(o.data.selectedBiomeId):p.enterShowroomGarage(),m?.refreshHud()},onResize:(R,v)=>{R<=0||v<=0||(c.setSize(R,v,!1),f.updateResize(R/v))},onDifficultyChange:R=>{p.difficulty=R}});p.difficulty=S.difficulty;let M=!1;n.bindLifecycle(()=>{M=!0,i.setPlatformMuted(!0)},()=>{M=!1,i.setPlatformMuted(!1)},R=>{i.setPlatformMuted(!R)}),p.update(.016,0,0,!1,0,0),c.render(l,u),n.firstFrameReady(),n.gameReady();let E=performance.now();function T(R){requestAnimationFrame(T);const v=Math.min(.05,Math.max(.001,(R-E)*.001));if(E=R,!M&&!S.isMenuOpen){if(g.update(),g.consumeOrbitDeltas(Pa),p.viewMode==="driving"&&p.player){if(g.actions.toggleDiffLock){const w=p.player.toggleDiffLock(i);m?.showCallout(w?"🔒 4x4 DİFERANSİYEL KİLİDİ AKTİF (+Çekiş)":"🔓 2WD AÇIK DİFERANSİYEL (Yüksek Hız)",w?"#f59e0b":"#38bdf8")}if(g.actions.recoverVehicle&&(p.player.recoverToSafeGround(p.getTerrainHeightBound),i.playSuspensionImpact(.4),m?.showCallout("🔄 ARAÇ GÜVENLİ ZEMİNE KURTARILDI","#38bdf8")),g.actions.toggleHeadlights){const w=p.player.toggleHeadlights(i);m?.showCallout(w?"💡 ARAZİ PROJEKTÖRLERİ AÇIK":"💡 FARLAR KAPALI","#facc15")}if(g.actions.triggerHorn&&p.triggerPlayerHorn(),g.actions.cycleCameraMode){const w=f.cycleMode();i.playGarageClick(),m?.showCallout(c_[w],"#38bdf8")}g.actions.toggleSlowMotion&&(p.slowMotionActive=!p.slowMotionActive,i.playGarageClick(),m?.showCallout(p.slowMotionActive?"🎬 AĞIR ÇEKİM SÜSPANSİYON GÖRÜNÜMÜ (0.4x)":"▶ NORMAL SİMÜLASYON HIZI (1.0x)","#38bdf8")),g.actions.toggleGpsChevrons&&(p.gpsChevronsVisible=!p.gpsChevronsVisible,i.playGarageClick(),m?.showCallout(p.gpsChevronsVisible?"🧭 ZEMİN GPS OKLARI AÇIK":"🧭 ZEMİN GPS OKLARI GİZLENDİ","#22c55e"))}p.update(v,g.steerInput,g.throttleInput,g.handbrakeHeld,Pa.yaw,Pa.pitch),x.update(p.slowMotionActive?v*.4:v),m?.update(v),c.render(l,u)}}requestAnimationFrame(T)}d_();
