import{V as P,P as ut,S as ct,B as x,M as f,a as j,b as pt,c,d as G,C as _,A as mt,e as gt,f as ft,g as K,h as B,i as nt,j as dt,R as U,F as wt,H as yt,D as ot,G as E,k as R,T as $,l as bt,m as vt,n as rt,o as xt,p as X,q as St,r as Mt,O as kt,W as Rt}from"./three-D9lKHAQf.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))e(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&e(n)}).observe(document,{childList:!0,subtree:!0});function s(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function e(a){if(a.ep)return;a.ep=!0;const i=s(a);fetch(a.href,i)}})();class Et{camera;currentLookAt=new P(0,0,0);targetLookAt=new P(0,0,0);baseElevation=21;baseDistance=15;currentElevation=21;currentDistance=15;stageZoomKick=0;constructor(t){this.camera=new ut(50,t,.5,320),this.updateFov(t),this.camera.position.set(0,this.baseElevation,this.baseDistance),this.camera.lookAt(0,0,0)}triggerStageZoomKick(){this.stageZoomKick=5.5}resize(t,s){const e=t/s;this.camera.aspect=e,this.updateFov(e),this.camera.updateProjectionMatrix()}updateFov(t){t<1?this.camera.fov=62:this.camera.fov=48}update(t,s,e){this.targetLookAt.copy(t),this.stageZoomKick>0&&(this.stageZoomKick=Math.max(0,this.stageZoomKick-e*6.5));const a=Math.max(0,s-1.15),i=this.baseElevation+a*6.4+this.stageZoomKick,n=this.baseDistance+a*5.2+this.stageZoomKick*.7,o=Math.min(e*4.5,1);this.currentElevation+=(i-this.currentElevation)*o,this.currentDistance+=(n-this.currentDistance)*o,this.currentLookAt.lerp(this.targetLookAt,Math.min(e*8,1)),this.camera.position.set(this.currentLookAt.x,this.currentLookAt.y+this.currentElevation,this.currentLookAt.z+this.currentDistance),this.camera.lookAt(this.currentLookAt)}}class Ct extends ct{constructor(){super();const t=new x;t.deleteAttribute("uv");const s=new f({side:j}),e=new f,a=new pt(16777215,900,28,2);a.position.set(.418,16.199,.3),this.add(a);const i=new c(t,s);i.position.set(-.757,13.219,.717),i.scale.set(31.713,28.305,28.591),this.add(i);const n=new c(t,e);n.position.set(-10.906,2.009,1.846),n.rotation.set(0,-.195,0),n.scale.set(2.328,7.905,4.651),this.add(n);const o=new c(t,e);o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),this.add(o);const r=new c(t,e);r.position.set(6.167,.857,7.803),r.rotation.set(0,.561,0),r.scale.set(3.927,6.285,3.687),this.add(r);const l=new c(t,e);l.position.set(-2.017,.018,6.124),l.rotation.set(0,.333,0),l.scale.set(2.002,4.566,2.064),this.add(l);const h=new c(t,e);h.position.set(2.291,-.756,-2.621),h.rotation.set(0,-.286,0),h.scale.set(1.546,1.552,1.496),this.add(h);const d=new c(t,e);d.position.set(-2.193,-.369,-5.547),d.rotation.set(0,.516,0),d.scale.set(3.875,3.487,2.986),this.add(d);const u=new c(t,F(50));u.position.set(-16.116,14.37,8.208),u.scale.set(.1,2.428,2.739),this.add(u);const m=new c(t,F(50));m.position.set(-16.109,18.021,-8.207),m.scale.set(.1,2.425,2.751),this.add(m);const p=new c(t,F(17));p.position.set(14.904,12.198,-1.832),p.scale.set(.15,4.265,6.331),this.add(p);const g=new c(t,F(43));g.position.set(-.462,8.89,14.52),g.scale.set(4.38,5.441,.088),this.add(g);const y=new c(t,F(20));y.position.set(3.235,11.486,-12.541),y.scale.set(2.5,2,.1),this.add(y);const w=new c(t,F(100));w.position.set(0,20,0),w.scale.set(1,.1,1),this.add(w)}dispose(){const t=new Set;this.traverse(s=>{s.isMesh&&(t.add(s.geometry),t.add(s.material))});for(const s of t)s.dispose()}}function F(v){const t=new G;return t.color.setScalar(v),t}const q=new P;function T(v,t,s,e,a,i){const n=2*Math.PI*a/4,o=Math.max(i-2*a,0),r=Math.PI/4;q.copy(t),q[e]=0,q.normalize();const l=.5*n/(n+o),h=1-q.angleTo(v)/r;return Math.sign(q[s])===1?h*l:o/(n+o)+l+l*(1-h)}class H extends x{constructor(t=1,s=1,e=1,a=2,i=.1){if(a=a*2+1,i=Math.min(t/2,s/2,e/2,i),super(1,1,1,a,a,a),a===1)return;const n=this.toNonIndexed();this.index=null,this.attributes.position=n.attributes.position,this.attributes.normal=n.attributes.normal,this.attributes.uv=n.attributes.uv;const o=new P,r=new P,l=new P(t,s,e).divideScalar(2).subScalar(i),h=this.attributes.position.array,d=this.attributes.normal.array,u=this.attributes.uv.array,m=h.length/6,p=new P,g=.5/a;for(let y=0,w=0;y<h.length;y+=3,w+=2)switch(o.fromArray(h,y),r.copy(o),r.x-=Math.sign(r.x)*g,r.y-=Math.sign(r.y)*g,r.z-=Math.sign(r.z)*g,r.normalize(),h[y+0]=l.x*Math.sign(o.x)+r.x*i,h[y+1]=l.y*Math.sign(o.y)+r.y*i,h[y+2]=l.z*Math.sign(o.z)+r.z*i,d[y+0]=r.x,d[y+1]=r.y,d[y+2]=r.z,Math.floor(y/m)){case 0:p.set(1,0,0),u[w+0]=T(p,r,"z","y",i,e),u[w+1]=1-T(p,r,"y","z",i,s);break;case 1:p.set(-1,0,0),u[w+0]=1-T(p,r,"z","y",i,e),u[w+1]=1-T(p,r,"y","z",i,s);break;case 2:p.set(0,1,0),u[w+0]=1-T(p,r,"x","z",i,t),u[w+1]=T(p,r,"z","x",i,e);break;case 3:p.set(0,-1,0),u[w+0]=1-T(p,r,"x","z",i,t),u[w+1]=1-T(p,r,"z","x",i,e);break;case 4:p.set(0,0,1),u[w+0]=1-T(p,r,"x","y",i,t),u[w+1]=1-T(p,r,"y","x",i,s);break;case 5:p.set(0,0,-1),u[w+0]=T(p,r,"x","y",i,t),u[w+1]=1-T(p,r,"y","x",i,s);break}}}class D{static contactShadowTexture=null;static skyGradientTexture=null;static microTextureCache=new Map;static enhancedScenes=new WeakSet;static cachedEnvMap=null;static cachedRendererRef=null;static enhanceScene(t){if(this.enhancedScenes.has(t))return;this.enhancedScenes.add(t),t.background||(t.background=new _(13625591));const s=t.onBeforeRender;let e=!1;t.onBeforeRender=function(a,i,n,...o){s&&s.call(this,a,i,n,...o),!e&&a&&(e=!0,D.enhanceRendererAndIBL(a,i),D.upgradeSceneMaterials(i))}}static enhanceRendererAndIBL(t,s){try{if(t.toneMapping=mt,t.toneMappingExposure=.88,t.shadowMap&&(t.shadowMap.enabled=!0,t.shadowMap.type=gt),!s.environment){if(this.cachedRendererRef!==t||!this.cachedEnvMap){const e=new ft(t);e.compileEquirectangularShader();const a=new Ct,i=e.fromScene(a,.04);this.cachedEnvMap=i.texture,this.cachedRendererRef=t,a.dispose(),e.dispose()}s.environment=this.cachedEnvMap}"environmentIntensity"in s&&(s.environmentIntensity=.28)}catch{}}static upgradeSceneMaterials(t){t.traverse(s=>{const e=s;if(!e.isMesh||!e.material)return;const a=e.rotation.x<-1.2&&e.geometry?.boundingSphere&&e.geometry.boundingSphere.radius>18;if(Array.isArray(e.material))for(let i=0;i<e.material.length;i++)this.tuneMaterial(e.material[i],!a);else this.tuneMaterial(e.material,!a)})}static tuneMaterial(t,s){const e=t;!e||!e.isMeshStandardMaterial||((e.envMapIntensity===void 0||e.envMapIntensity===1)&&(e.envMapIntensity=.35),s&&!e.transparent&&this.applyRimLight(e,16775403,.14))}static applyRimLight(t,s=16775403,e=.26){if(t.userData?.hasVisualEnhancerRim)return t;t.userData=t.userData||{},t.userData.hasVisualEnhancerRim=!0;const a=new _(s),i=t.onBeforeCompile;return t.onBeforeCompile=(n,o)=>{i&&i(n,o),n.uniforms.uRimColor={value:a},n.uniforms.uRimStrength={value:e},n.fragmentShader=`uniform vec3 uRimColor;
uniform float uRimStrength;
`+n.fragmentShader,n.fragmentShader=n.fragmentShader.replace("#include <dithering_fragment>",`#include <dithering_fragment>
        vec3 veViewDir = normalize(vViewPosition);
        float veRim = 1.0 - max(dot(normalize(normal), veViewDir), 0.0);
        veRim = pow(veRim, 2.75) * uRimStrength;
        gl_FragColor.rgb += uRimColor * veRim;`)},t.customProgramCacheKey=()=>`ve-rim-${s}-${e.toFixed(2)}`,t}static createBeveledBox(t=1,s=1,e=1,a=.08,i=3){return new H(t,s,e,i,a)}static createContactShadow(t=.8,s=.35){if(!this.contactShadowTexture&&typeof document<"u"){const n=document.createElement("canvas");n.width=128,n.height=128;const o=n.getContext("2d");if(o){const r=o.createRadialGradient(64,64,6,64,64,60);r.addColorStop(0,"rgba(15, 23, 42, 0.55)"),r.addColorStop(.55,"rgba(15, 23, 42, 0.22)"),r.addColorStop(1,"rgba(15, 23, 42, 0.0)"),o.fillStyle=r,o.fillRect(0,0,128,128)}this.contactShadowTexture=new K(n),this.contactShadowTexture.needsUpdate=!0}const e=new B(t*2,t*2),a=new G({map:this.contactShadowTexture,transparent:!0,opacity:s,depthWrite:!1}),i=new c(e,a);return i.rotation.x=-Math.PI/2,i.position.y=.015,i}static createSkyDome(t=120){if(!this.skyGradientTexture&&typeof document<"u"){const a=document.createElement("canvas");a.width=64,a.height=256;const i=a.getContext("2d");if(i){const n=i.createLinearGradient(0,0,0,256);n.addColorStop(0,"#a5d8f3"),n.addColorStop(.48,"#cfe8f7"),n.addColorStop(.85,"#f4f9fc"),n.addColorStop(1,"#fcf8ee"),i.fillStyle=n,i.fillRect(0,0,64,256)}this.skyGradientTexture=new K(a),this.skyGradientTexture.colorSpace=nt,this.skyGradientTexture.needsUpdate=!0}const s=new dt(t,24,16),e=new G({map:this.skyGradientTexture,side:j,depthWrite:!1,fog:!1});return new c(s,e)}static createMicroTexture(t){if(this.microTextureCache.has(t))return this.microTextureCache.get(t);if(typeof document>"u")return null;const s=document.createElement("canvas");s.width=256,s.height=256;const e=s.getContext("2d");if(e)if(t==="wood"){e.fillStyle="#f5ebe0",e.fillRect(0,0,256,256),e.strokeStyle="rgba(180, 140, 100, 0.14)",e.lineWidth=2;for(let i=0;i<256;i+=6)e.beginPath(),e.moveTo(0,i),e.bezierCurveTo(85,i+(i%12-6),170,i-(i%10-5),256,i),e.stroke()}else if(t==="stone"){e.fillStyle="#f1f5f9",e.fillRect(0,0,256,256);for(let i=0;i<420;i++){const n=i*73%256,o=i*137%256;e.fillStyle=i%2===0?"rgba(148, 163, 184, 0.12)":"rgba(255, 255, 255, 0.25)",e.fillRect(n,o,3,3)}}else if(t==="grid"){e.fillStyle="#fcf8ee",e.fillRect(0,0,256,256),e.strokeStyle="rgba(148, 163, 184, 0.22)",e.lineWidth=2;for(let i=0;i<=256;i+=32)e.beginPath(),e.moveTo(i,0),e.lineTo(i,256),e.moveTo(0,i),e.lineTo(256,i),e.stroke()}else{e.fillStyle="#ffffff",e.fillRect(0,0,256,256);const i=e.createLinearGradient(0,0,256,256);i.addColorStop(0,"rgba(255,255,255,0.12)"),i.addColorStop(1,"rgba(226,232,240,0.12)"),e.fillStyle=i,e.fillRect(0,0,256,256)}const a=new K(s);return a.wrapS=U,a.wrapT=U,a.colorSpace=nt,a.needsUpdate=!0,this.microTextureCache.set(t,a),a}}class Tt{hemisphere;sunLight;fillLight;constructor(t){D.enhanceScene(t),t.background=new _(13625591),t.fog=new wt(13625591,.0075),this.hemisphere=new yt(14676476,16051161,.85),t.add(this.hemisphere),this.sunLight=new ot(16774885,1.25),this.sunLight.position.set(45,80,40),this.sunLight.castShadow=!0,this.sunLight.shadow.mapSize.width=2048,this.sunLight.shadow.mapSize.height=2048,this.sunLight.shadow.camera.near=10,this.sunLight.shadow.camera.far=180;const s=50;this.sunLight.shadow.camera.left=-s,this.sunLight.shadow.camera.right=s,this.sunLight.shadow.camera.top=s,this.sunLight.shadow.camera.bottom=-s,this.sunLight.shadow.bias=-5e-4,t.add(this.sunLight),this.fillLight=new ot(12248829,.35),this.fillLight.position.set(-40,50,-35),t.add(this.fillLight)}update(t){this.sunLight.position.set(t.x+45,80,t.z+40),this.sunLight.target.position.copy(t),this.sunLight.target.updateMatrixWorld()}}class At{group=new E;pool=[];maxParticles=120;sharedGeo;sharedMat;constructor(t){this.sharedGeo=new x(.22,.22,.22),this.sharedMat=new G({color:16096779});for(let s=0;s<this.maxParticles;s++){const e=new c(this.sharedGeo,this.sharedMat.clone());e.visible=!1,this.group.add(e),this.pool.push({mesh:e,velocity:new P,life:0,maxLife:1,active:!1})}t.add(this.group)}spawnBurst(t,s,e=12){let a=0;for(const i of this.pool)if(!i.active){i.active=!0,i.life=0,i.maxLife=.45+Math.random()*.3,i.mesh.position.set(t.x+(Math.random()-.5)*.4,t.y+.2+Math.random()*.3,t.z+(Math.random()-.5)*.4),i.mesh.scale.setScalar(1+Math.random()*.5),i.mesh.material.color.setHex(s),i.mesh.visible=!0;const n=Math.random()*Math.PI*2,o=3.5+Math.random()*5.5;if(i.velocity.set(Math.cos(n)*o,4+Math.random()*4,Math.sin(n)*o),a++,a>=e)break}}update(t){for(const e of this.pool)if(e.active){if(e.life+=t,e.life>=e.maxLife){e.active=!1,e.mesh.visible=!1;continue}e.velocity.y+=-18*t,e.mesh.position.x+=e.velocity.x*t,e.mesh.position.y+=e.velocity.y*t,e.mesh.position.z+=e.velocity.z*t;const i=1-e.life/e.maxLife;e.mesh.scale.setScalar(i),e.mesh.position.y<0&&(e.mesh.position.y=0,e.velocity.y=-e.velocity.y*.3)}}}class A{static isFirstFrameSent=!1;static isGameReadySent=!1;static isAudioMutedByPlatform=!1;static isYouTubePlayables(){return!!window.ytgame?.IN_PLAYABLES_ENV}static isEmbeddedMode(){const t=window;return!!(t.ytgame?.IN_PLAYABLES_ENV||t.YaGames||t.CrazyGames?.SDK||t.PokiSDK||new URLSearchParams(window.location.search).get("embed")==="1"||new URLSearchParams(window.location.search).get("yt")==="1")}static applyDualModeShell(){document.documentElement.classList.remove("yt-embed-mode"),document.body?.classList.remove("embed-fullscreen-mode")}static async initPlatform(){const t=window;if(t.ytgame?.IN_PLAYABLES_ENV)return;const s=window.location.hostname,e=window.location.search,a=s.includes("yandex")||e.includes("portal=yandex"),i=s.includes("crazygames")||e.includes("portal=crazygames");if(a&&!t.YaGames&&!document.getElementById("yandex-sdk-script")&&await new Promise(n=>{const o=document.createElement("script");o.id="yandex-sdk-script",o.src="https://yandex.ru/games/sdk/v2",o.onload=()=>n(),o.onerror=()=>n(),document.head.appendChild(o)}),i&&!t.CrazyGames&&!document.getElementById("crazygames-sdk-script")&&await new Promise(n=>{const o=document.createElement("script");o.id="crazygames-sdk-script",o.src="https://sdk.crazygames.com/crazygames-sdk-v3.js",o.onload=()=>n(),o.onerror=()=>n(),document.head.appendChild(o)}),t.YaGames&&!t.ysdk)try{const n=await t.YaGames.init();t.ysdk=n,n.features?.LoadingAPI?.ready?.()}catch{}}static gameplayStart(){const t=window;if(t.CrazyGames?.SDK?.game?.gameplayStart)try{t.CrazyGames.SDK.game.gameplayStart()}catch{}}static gameplayStop(){const t=window;if(t.CrazyGames?.SDK?.game?.gameplayStop)try{t.CrazyGames.SDK.game.gameplayStop()}catch{}}static signalFirstFrameReady(){if(this.isFirstFrameSent)return;this.isFirstFrameSent=!0;const t=window.ytgame;if(t?.game?.firstFrameReady)try{t.game.firstFrameReady()}catch{}}static signalGameReady(){if(this.isGameReadySent)return;this.isGameReadySent=!0;const t=window;if(t.ytgame?.game?.gameReady)try{t.ytgame.game.gameReady()}catch{}if(t.CrazyGames?.SDK?.game?.loadingStop)try{t.CrazyGames.SDK.game.loadingStop()}catch{}if(t.ysdk?.features?.LoadingAPI?.ready)try{t.ysdk.features.LoadingAPI.ready()}catch{}if(t.PokiSDK?.gameLoadingFinished)try{t.PokiSDK.gameLoadingFinished()}catch{}}static initLifecycle(t){const s=window;if(s.ytgame?.system)try{if(s.ytgame.system.onPause(()=>t.onPause()),s.ytgame.system.onResume(()=>t.onResume()),typeof s.ytgame.system.isAudioEnabled=="function"){const e=s.ytgame.system.isAudioEnabled();this.isAudioMutedByPlatform=!e,t.onAudioEnabledChange(e)}s.ytgame.system.onAudioEnabledChange(e=>{this.isAudioMutedByPlatform=!e,t.onAudioEnabledChange(e)})}catch{}document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"?t.onPause():t.onResume()})}static async loadData(t){const s=window;if(s.ytgame?.game?.loadData)try{const e=await s.ytgame.game.loadData();if(e)return{...t,...JSON.parse(e)}}catch{}try{const e=localStorage.getItem("hole_city_io_3d_save_data");if(e)return{...t,...JSON.parse(e)}}catch{}return t}static async saveData(t){const s=JSON.stringify(t),e=window;if(e.ytgame?.game?.saveData)try{await e.ytgame.game.saveData(s)}catch{}try{localStorage.setItem("hole_city_io_3d_save_data",s)}catch{}}static sendScore(t){const s=Math.floor(t),e=window;if(e.ytgame?.engagement?.sendScore)try{e.ytgame.engagement.sendScore({value:s})}catch{}}static isAudioMuted(){return this.isAudioMutedByPlatform}}class Pt{ctx=null;isMuted=!1;isUnlocked=!1;constructor(){this.isMuted=A.isAudioMuted()}setMuted(t){this.isMuted=t}ensureContext(){if(this.isMuted)return null;if(!this.ctx){const t=window.AudioContext||window.webkitAudioContext;if(!t)return null;this.ctx=new t}return this.ctx.state==="suspended"&&this.isUnlocked&&this.ctx.resume().catch(()=>{}),this.ctx}unlock(){this.isUnlocked=!0,this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{})}playPop(t=1){const s=this.ensureContext();if(!s)return;const e=s.createOscillator(),a=s.createGain(),i=s.currentTime;e.type="sine";const n=540*t;e.frequency.setValueAtTime(n,i),e.frequency.exponentialRampToValueAtTime(n*1.8,i+.06),a.gain.setValueAtTime(.18,i),a.gain.exponentialRampToValueAtTime(.001,i+.08),e.connect(a),a.connect(s.destination),e.start(i),e.stop(i+.08)}playCrunch(){const t=this.ensureContext();if(!t)return;const s=t.createOscillator(),e=t.createGain(),a=t.currentTime;s.type="triangle",s.frequency.setValueAtTime(260,a),s.frequency.exponentialRampToValueAtTime(80,a+.14),e.gain.setValueAtTime(.25,a),e.gain.exponentialRampToValueAtTime(.001,a+.15),s.connect(e),e.connect(t.destination),s.start(a),s.stop(a+.15)}playRumble(){const t=this.ensureContext();if(!t)return;const s=t.createOscillator(),e=t.createGain(),a=t.currentTime;s.type="sawtooth",s.frequency.setValueAtTime(110,a),s.frequency.exponentialRampToValueAtTime(35,a+.32),e.gain.setValueAtTime(.3,a),e.gain.exponentialRampToValueAtTime(.001,a+.35),s.connect(e),e.connect(t.destination),s.start(a),s.stop(a+.35)}playGrow(){const t=this.ensureContext();if(!t)return;const s=[392,523.25,659.25,783.99],e=t.currentTime;s.forEach((a,i)=>{const n=t.createOscillator(),o=t.createGain(),r=e+i*.05;n.type="sine",n.frequency.setValueAtTime(a,r),o.gain.setValueAtTime(.15,r),o.gain.exponentialRampToValueAtTime(.001,r+.12),n.connect(o),o.connect(t.destination),n.start(r),n.stop(r+.12)})}playEliminate(){const t=this.ensureContext();if(!t)return;const s=t.currentTime;[440,554.37,659.25,880].forEach(e=>{const a=t.createOscillator(),i=t.createGain();a.type="triangle",a.frequency.setValueAtTime(e,s),i.gain.setValueAtTime(.18,s),i.gain.exponentialRampToValueAtTime(.001,s+.3),a.connect(i),i.connect(t.destination),a.start(s),a.stop(s+.3)})}playBooster(){const t=this.ensureContext();if(!t)return;const s=t.createOscillator(),e=t.createGain(),a=t.currentTime;s.type="sine",s.frequency.setValueAtTime(300,a),s.frequency.exponentialRampToValueAtTime(900,a+.2),e.gain.setValueAtTime(.2,a),e.gain.exponentialRampToValueAtTime(.001,a+.22),s.connect(e),e.connect(t.destination),s.start(a),s.stop(a+.22)}playVictory(){const t=this.ensureContext();if(!t)return;const s=[523.25,659.25,783.99,1046.5],e=t.currentTime;s.forEach((a,i)=>{const n=t.createOscillator(),o=t.createGain(),r=e+i*.1;n.type="triangle",n.frequency.setValueAtTime(a,r),o.gain.setValueAtTime(.22,r),o.gain.exponentialRampToValueAtTime(.001,r+.28),n.connect(o),o.connect(t.destination),n.start(r),n.stop(r+.28)})}}const V=1/60;class Lt{isRunning=!1;animFrameId=0;accumulator=0;lastTime=0;onFixedUpdate=()=>{};onUpdate=()=>{};onRender=()=>{};constructor(t,s){t&&(this.onFixedUpdate=t),s&&(this.onRender=s)}setCallbacks(t,s,e){this.onFixedUpdate=t,this.onUpdate=s,this.onRender=()=>e()}start(){if(this.isRunning)return;this.isRunning=!0,this.lastTime=performance.now(),this.accumulator=0;const t=s=>{if(!this.isRunning)return;const e=(s-this.lastTime)*.001;this.lastTime=s;const a=Math.min(.05,Math.max(.001,e));for(this.accumulator=Math.min(this.accumulator+a,V*4);this.accumulator>=V;)this.onFixedUpdate(V),this.accumulator-=V;this.onUpdate(a);const i=this.accumulator/V;this.onRender(i,a),this.animFrameId=requestAnimationFrame(t)};this.animFrameId=requestAnimationFrame(t)}stop(){this.isRunning=!1,this.animFrameId&&(cancelAnimationFrame(this.animFrameId),this.animFrameId=0)}}class Bt{constructor(t){this.targetEl=t,this.joyBase=document.createElement("div"),this.joyBase.style.cssText="position:absolute;width:88px;height:88px;margin-left:-44px;margin-top:-44px;border-radius:50%;border:3px solid rgba(255,255,255,0.68);background:rgba(15,23,42,0.26);pointer-events:none;display:none;z-index:25;",this.joyKnob=document.createElement("div"),this.joyKnob.style.cssText="position:absolute;left:50%;top:50%;width:38px;height:38px;margin-left:-19px;margin-top:-19px;border-radius:50%;background:rgba(56,189,248,0.95);box-shadow:0 4px 10px rgba(0,0,0,0.3);",this.joyBase.appendChild(this.joyKnob),(this.targetEl.parentElement||document.body).appendChild(this.joyBase),this.setupPointerEvents(t),this.setupKeyboardEvents()}moveX=0;moveZ=0;isPointerDown=!1;pointerStartX=0;pointerStartY=0;keysDown=new Set;joyBase;joyKnob;getMoveVector(){let t=this.moveX,s=this.moveZ,e=0,a=0;if((this.keysDown.has("KeyW")||this.keysDown.has("ArrowUp"))&&(a-=1),(this.keysDown.has("KeyS")||this.keysDown.has("ArrowDown"))&&(a+=1),(this.keysDown.has("KeyA")||this.keysDown.has("ArrowLeft"))&&(e-=1),(this.keysDown.has("KeyD")||this.keysDown.has("ArrowRight"))&&(e+=1),e!==0||a!==0){const i=Math.hypot(e,a);t=e/i,s=a/i}return{x:t,z:s}}setupPointerEvents(t){t.addEventListener("pointerdown",e=>{if(e.target.closest('button, .hud-interactive, .modal, [data-hud-interactive="true"]'))return;this.isPointerDown=!0,this.pointerStartX=e.clientX,this.pointerStartY=e.clientY,e.target.setPointerCapture?.(e.pointerId);const a=t.getBoundingClientRect();this.joyBase.style.display="block",this.joyBase.style.left=`${this.pointerStartX-a.left}px`,this.joyBase.style.top=`${this.pointerStartY-a.top}px`,this.joyKnob.style.transform="translate(0px, 0px)";const i=a.left+a.width*.5,n=a.top+a.height*.52,o=e.clientX-i,r=e.clientY-n,l=Math.hypot(o,r);l>10&&(this.moveX=o/l,this.moveZ=r/l)}),window.addEventListener("pointermove",e=>{if(!this.isPointerDown)return;const a=e.clientX-this.pointerStartX,i=e.clientY-this.pointerStartY,n=Math.hypot(a,i),o=46;if(n>4){if(this.moveX=a/n,this.moveZ=i/n,n>o){this.pointerStartX+=a/n*(n-o),this.pointerStartY+=i/n*(n-o);const l=t.getBoundingClientRect();this.joyBase.style.left=`${this.pointerStartX-l.left}px`,this.joyBase.style.top=`${this.pointerStartY-l.top}px`}const r=Math.min(n,o);this.joyKnob.style.transform=`translate(${a/n*r}px, ${i/n*r}px)`}});const s=()=>{this.isPointerDown=!1,this.moveX=0,this.moveZ=0,this.joyBase.style.display="none"};window.addEventListener("pointerup",s),window.addEventListener("pointercancel",s)}setupKeyboardEvents(){window.addEventListener("keydown",t=>{this.keysDown.add(t.code)}),window.addEventListener("keyup",t=>{this.keysDown.delete(t.code)}),window.addEventListener("blur",()=>{this.keysDown.clear(),this.isPointerDown=!1,this.moveX=0,this.moveZ=0,this.joyBase.style.display="none"})}}class zt{container;timerEl;scoreEl;rankBadgeEl;leaderboardListEl;evoStageLabelEl;evoSizeValEl;evoFillEl;evoNextHintEl;stageBannerEl;floatingLayerEl;boosterMagnetBtn;boosterTurboBtn;boosterSizeBtn;modalContainer;bannerTimeoutId=0;needleAnimId=0;needleMultiplier=2;constructor(t){this.container=t,this.buildHudLayout()}buildHudLayout(){this.container.innerHTML=`
      <style>
        .hud-wrapper {
          position: absolute;
          inset: 0;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .hud-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
          gap: 12px;
        }
        .hud-stat-pill {
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(6, 182, 212, 0.35);
          border-radius: 14px;
          padding: 8px 16px;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.25);
        }
        .hud-timer-val {
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 1px;
          color: #f8fafc;
        }
        .hud-rank-pill {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #fff;
          font-weight: 900;
          font-size: 16px;
          padding: 6px 14px;
          border-radius: 20px;
          box-shadow: 0 4px 10px rgba(245, 158, 11, 0.4);
        }
        .hud-score-val {
          font-size: 20px;
          font-weight: 800;
          color: #38bdf8;
        }
        /* Top Right Mini Leaderboard */
        .hud-leaderboard {
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 14px;
          padding: 8px 12px;
          color: #fff;
          min-width: 170px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.25);
        }
        .hud-lb-title {
          font-size: 10px;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .hud-lb-row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 0;
          color: #cbd5e1;
        }
        .hud-lb-row.player {
          color: #38bdf8;
          font-weight: 900;
        }

        /* Bottom Boosters */
        .hud-bottom-bar {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .hud-booster-btn {
          pointer-events: auto;
          background: rgba(15, 23, 42, 0.92);
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(6, 182, 212, 0.4);
          border-radius: 16px;
          padding: 10px 14px;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          min-width: 82px;
          transition: transform 0.1s ease, border-color 0.15s ease;
          box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }
        .hud-booster-btn:active {
          transform: scale(0.95);
        }
        .hud-booster-icon {
          font-size: 22px;
        }
        .hud-booster-name {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .hud-booster-badge {
          font-size: 9px;
          background: #f59e0b;
          color: #000;
          font-weight: 900;
          padding: 2px 6px;
          border-radius: 6px;
        }
        .hud-booster-btn:disabled {
          opacity: 0.45;
          pointer-events: none;
        }

        /* Modal Overlays */
        .hud-modal-overlay {
          position: absolute;
          inset: 0;
          background: rgba(11, 15, 25, 0.88);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
          z-index: 50;
        }
        .hud-modal-card {
          background: rgba(30, 41, 59, 0.95);
          border: 2px solid #06b6d4;
          border-radius: 20px;
          padding: 28px 24px;
          max-width: 380px;
          width: 90%;
          text-align: center;
          color: #fff;
          box-shadow: 0 20px 45px rgba(0,0,0,0.6);
        }
        .hud-modal-title {
          font-size: 24px;
          font-weight: 900;
          margin: 0 0 6px 0;
          color: #f8fafc;
        }
        .hud-modal-subtitle {
          font-size: 13px;
          color: #94a3b8;
          margin: 0 0 20px 0;
        }
        .hud-btn-primary {
          background: linear-gradient(135deg, #06b6d4, #8b5cf6);
          color: #fff;
          border: none;
          padding: 14px 24px;
          border-radius: 30px;
          font-size: 15px;
          font-weight: 800;
          width: 100%;
          cursor: pointer;
          margin-bottom: 10px;
          box-shadow: 0 6px 20px rgba(6, 182, 212, 0.35);
        }
        .hud-btn-secondary {
          background: transparent;
          color: #94a3b8;
          border: 1px solid rgba(148, 163, 184, 0.3);
          padding: 10px 18px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          width: 100%;
          cursor: pointer;
        }

        /* Victory Multiplier Needle Bar */
        .multiplier-bar-container {
          position: relative;
          width: 100%;
          height: 38px;
          background: #0f172a;
          border-radius: 19px;
          border: 1.5px solid rgba(245, 158, 11, 0.4);
          overflow: hidden;
          margin: 16px 0 20px 0;
          display: flex;
        }
        .mult-zone {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 13px;
        }
        .mult-zone.zone-2x { background: #3b82f6; color: #fff; }
        .mult-zone.zone-3x { background: #f59e0b; color: #000; }
        .mult-zone.zone-5x { background: #ec4899; color: #fff; flex: 0.7; }
        .multiplier-needle {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 6px;
          background: #ffffff;
          box-shadow: 0 0 10px #ffffff;
          border-radius: 3px;
          transition: left 0.05s linear;
        }
        /* Live Evolution & Size Progress Panel */
        .hud-evo-panel {
          align-self: center;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(8px);
          border: 1.5px solid rgba(56, 189, 248, 0.45);
          border-radius: 16px;
          padding: 7px 14px;
          min-width: 240px;
          max-width: 320px;
          color: #fff;
          box-shadow: 0 6px 18px rgba(0,0,0,0.3);
          margin-top: -6px;
        }
        .hud-evo-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.6px;
          margin-bottom: 4px;
        }
        .hud-evo-stage {
          color: #38bdf8;
        }
        .hud-evo-size {
          color: #fbbf24;
          font-weight: 900;
        }
        .hud-evo-track {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.14);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 4px;
        }
        .hud-evo-fill {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, #06b6d4, #10b981, #f59e0b);
          border-radius: 6px;
          transition: width 0.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .hud-evo-next {
          font-size: 10px;
          font-weight: 700;
          color: #cbd5e1;
          text-align: center;
        }
        .hud-stage-banner {
          position: absolute;
          top: 128px;
          left: 50%;
          transform: translateX(-50%) scale(0.9);
          background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
          border: 2px solid #ffffff;
          color: #ffffff;
          padding: 10px 22px;
          border-radius: 24px;
          font-weight: 900;
          font-size: 14px;
          letter-spacing: 0.8px;
          box-shadow: 0 10px 28px rgba(139, 92, 246, 0.55);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 40;
          text-align: center;
          white-space: nowrap;
        }
        .hud-stage-banner.active {
          opacity: 1;
          transform: translateX(-50%) scale(1.0);
        }
        .hud-eat-popup {
          position: absolute;
          left: 50%;
          top: 52%;
          transform: translate(-50%, -50%);
          color: #fde047;
          font-weight: 900;
          font-size: 15px;
          text-shadow: 0 2px 6px rgba(0,0,0,0.75);
          pointer-events: none;
          animation: hudFloatUp 0.75s ease-out forwards;
        }
        @keyframes hudFloatUp {
          0% { opacity: 1; transform: translate(-50%, 0) scale(0.85); }
          40% { opacity: 1; transform: translate(-50%, -22px) scale(1.1); }
          100% { opacity: 0; transform: translate(-50%, -44px) scale(0.95); }
        }
      </style>

      <div class="hud-wrapper">
        <!-- Top Stats -->
        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
          <div class="hud-top-bar">
            <div class="hud-stat-pill">
              <span style="font-size: 18px;">⏱️</span>
              <span id="hud-timer" class="hud-timer-val">01:30</span>
            </div>

            <div style="display: flex; gap: 8px; align-items: center;">
              <div id="hud-rank" class="hud-rank-pill">#8</div>
              <div class="hud-stat-pill">
                <span style="font-size: 16px;">🏆</span>
                <span id="hud-score" class="hud-score-val">0</span>
              </div>
            </div>

            <div class="hud-leaderboard">
              <div class="hud-lb-title">LİDERLİK TABLOSU</div>
              <div id="hud-lb-list"></div>
            </div>
          </div>

          <!-- Evolution & Size Progress Bar -->
          <div class="hud-evo-panel">
            <div class="hud-evo-header">
              <span id="hud-evo-stage" class="hud-evo-stage">SEVİYE 1 • SOKAK YUTUCU</span>
              <span id="hud-evo-size" class="hud-evo-size">Ø 2.3m</span>
            </div>
            <div class="hud-evo-track">
              <div id="hud-evo-fill" class="hud-evo-fill"></div>
            </div>
            <div id="hud-evo-next" class="hud-evo-next">Hedef: Otomobiller & Ağaçlar</div>
          </div>
        </div>

        <div id="hud-stage-banner" class="hud-stage-banner"></div>
        <div id="hud-floating-layer" style="position:absolute;inset:0;pointer-events:none;overflow:hidden;"></div>

        <!-- Bottom Tactical Boosters (3 Mandatory Revenue Hooks) -->
        <div class="hud-bottom-bar">
          <button id="btn-booster-magnet" class="hud-booster-btn" type="button" data-hud-interactive="true">
            <span class="hud-booster-icon">🧲</span>
            <span class="hud-booster-name">MAGNET</span>
            <span class="hud-booster-badge">REKLAM</span>
          </button>

          <button id="btn-booster-turbo" class="hud-booster-btn" type="button" data-hud-interactive="true">
            <span class="hud-booster-icon">⚡</span>
            <span class="hud-booster-name">TURBO</span>
            <span class="hud-booster-badge">REKLAM</span>
          </button>

          <button id="btn-booster-size" class="hud-booster-btn" type="button" data-hud-interactive="true">
            <span class="hud-booster-icon">✨</span>
            <span class="hud-booster-name">+25% BOYUT</span>
            <span class="hud-booster-badge">REKLAM</span>
          </button>
        </div>
      </div>

      <div id="hud-modal-container"></div>
    `,this.timerEl=this.container.querySelector("#hud-timer"),this.scoreEl=this.container.querySelector("#hud-score"),this.rankBadgeEl=this.container.querySelector("#hud-rank"),this.leaderboardListEl=this.container.querySelector("#hud-lb-list"),this.evoStageLabelEl=this.container.querySelector("#hud-evo-stage"),this.evoSizeValEl=this.container.querySelector("#hud-evo-size"),this.evoFillEl=this.container.querySelector("#hud-evo-fill"),this.evoNextHintEl=this.container.querySelector("#hud-evo-next"),this.stageBannerEl=this.container.querySelector("#hud-stage-banner"),this.floatingLayerEl=this.container.querySelector("#hud-floating-layer"),this.boosterMagnetBtn=this.container.querySelector("#btn-booster-magnet"),this.boosterTurboBtn=this.container.querySelector("#btn-booster-turbo"),this.boosterSizeBtn=this.container.querySelector("#btn-booster-size"),this.modalContainer=this.container.querySelector("#hud-modal-container")}updateEvolutionProgress(t,s,e,a){this.evoStageLabelEl.textContent=`SEVİYE ${s.stage} • ${s.title}`,this.evoStageLabelEl.style.color=s.accentColor,this.evoSizeValEl.textContent=`Ø ${(t*2).toFixed(1)}m`,this.evoFillEl.style.width=`${Math.round(a*100)}%`,e?this.evoNextHintEl.textContent=`Sonraki Seviye (%${Math.round(a*100)}): ${e.unlockLabel}`:this.evoNextHintEl.textContent="MAKSİMUM EVRİM: Tüm Şehri Yutabilirsin!"}showStageUpBanner(t){this.bannerTimeoutId&&window.clearTimeout(this.bannerTimeoutId),this.stageBannerEl.innerHTML=`🚀 SEVİYE ${t.stage}: ${t.title}!<br/><span style="font-size:11px;font-weight:700;opacity:0.92;">Açıldı: ${t.unlockLabel}</span>`,this.stageBannerEl.classList.add("active"),this.bannerTimeoutId=window.setTimeout(()=>{this.stageBannerEl.classList.remove("active")},2600)}spawnEatPopup(t,s){if(s<2&&Math.random()>.35)return;const e=document.createElement("div");e.className="hud-eat-popup";const a=(Math.random()-.5)*70;e.style.marginLeft=`${a}px`,e.textContent=s>=3?`+${t} 🔥 BÜYÜDÜN!`:`+${t}`,this.floatingLayerEl.appendChild(e),window.setTimeout(()=>{e.remove()},750)}updateTimer(t){const s=Math.floor(t/60),e=Math.floor(t%60);this.timerEl.textContent=`${String(s).padStart(2,"0")}:${String(e).padStart(2,"0")}`}updateScore(t){this.scoreEl.textContent=String(Math.floor(t))}showTornadoAlert(t){let s=document.getElementById("tornado-alert");s||(s=document.createElement("div"),s.id="tornado-alert",s.style.cssText="position:absolute;top:75px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#0284c7,#38bdf8);color:#ffffff;font-weight:800;font-size:13px;padding:6px 18px;border-radius:20px;box-shadow:0 4px 14px rgba(2,132,199,0.5);pointer-events:none;z-index:30;display:none;letter-spacing:1px;",s.textContent="🌪️ MEGA-TORNADO WARNING!",this.container.appendChild(s)),s.style.display=t?"block":"none"}updateLeaderboard(t){const s=t.slice(0,5),e=t.find(a=>a.isPlayer);e&&(this.rankBadgeEl.textContent=`#${e.rank}`,e.rank===1?this.rankBadgeEl.style.background="linear-gradient(135deg, #f59e0b, #ef4444)":this.rankBadgeEl.style.background="linear-gradient(135deg, #0ea5e9, #6366f1)"),this.leaderboardListEl.innerHTML=s.map(a=>`
        <div class="hud-lb-row ${a.isPlayer?"player":""}">
          <span>#${a.rank} ${a.name}</span>
          <span>${Math.floor(a.score)}</span>
        </div>
      `).join("")}setBoosterCallbacks(t){this.boosterMagnetBtn.onclick=()=>t.onMagnet(),this.boosterTurboBtn.onclick=()=>t.onTurbo(),this.boosterSizeBtn.onclick=()=>t.onSize()}showReviveModal(t){this.modalContainer.innerHTML=`
      <div class="hud-modal-overlay">
        <div class="hud-modal-card">
          <div style="font-size: 38px; margin-bottom: 8px;">💥</div>
          <h2 class="hud-modal-title">ÇOK YAKLAŞTIN!</h2>
          <p class="hud-modal-subtitle">Liderliği kapmak üzereydin! Reklam izleyerek +25s ek süre ve 5s yenilmez dev kalkan ile savaşa dön!</p>
          <button id="btn-modal-revive" class="hud-btn-primary" type="button" data-hud-interactive="true">
            🎬 REKLAM İZLE & CANLAN (+25s)
          </button>
          <button id="btn-modal-giveup" class="hud-btn-secondary" type="button" data-hud-interactive="true">
            Maçı Bitir
          </button>
        </div>
      </div>
    `,this.container.querySelector("#btn-modal-revive").addEventListener("click",()=>{this.closeModal(),t.onRevive()}),this.container.querySelector("#btn-modal-giveup").addEventListener("click",()=>{this.closeModal(),t.onGiveUp()})}showVictoryModal(t,s,e,a){const i=t===1;this.modalContainer.innerHTML=`
      <div class="hud-modal-overlay">
        <div class="hud-modal-card">
          <div style="font-size: 42px; margin-bottom: 4px;">${i?"👑":"🏁"}</div>
          <h2 class="hud-modal-title">${i?"ARENA ŞAMPİYONU!":"MAÇ TAMAMLANDI"}</h2>
          <p class="hud-modal-subtitle">Sıralama: <strong>#${t}</strong> • Skor: <strong>${s}</strong></p>

          <div style="font-size: 14px; color: #cbd5e1; margin-bottom: 6px;">
            Kazanılan Ödül: <strong style="color: #fbbf24; font-size: 18px;">+${e} Altın</strong>
          </div>

          <!-- Moving Multiplier Needle Bar -->
          <div class="multiplier-bar-container">
            <div class="mult-zone zone-2x">2x</div>
            <div class="mult-zone zone-3x">3x</div>
            <div class="mult-zone zone-5x">5x MEGA</div>
            <div class="mult-zone zone-3x">3x</div>
            <div class="mult-zone zone-2x">2x</div>
            <div id="mult-needle" class="multiplier-needle" style="left: 0%;"></div>
          </div>

          <button id="btn-claim-multiplier" class="hud-btn-primary" type="button" data-hud-interactive="true">
            🎬 ÇARPANI AL (<span id="mult-label">3x</span> ÖDÜL)
          </button>
          <button id="btn-claim-base" class="hud-btn-secondary" type="button" data-hud-interactive="true">
            Normal Ödülü Al (${e} Altın)
          </button>
        </div>
      </div>
    `;const n=this.container.querySelector("#mult-needle"),o=this.container.querySelector("#mult-label");let r=0,l=1;const h=()=>{r+=l*1.8,r>=96?(r=96,l=-1):r<=2&&(r=2,l=1),n&&(n.style.left=`${r}%`),r>=40&&r<=60?this.needleMultiplier=5:r>=20&&r<40||r>60&&r<=80?this.needleMultiplier=3:this.needleMultiplier=2,o&&(o.textContent=`${this.needleMultiplier}x`),this.needleAnimId=requestAnimationFrame(h)};this.needleAnimId=requestAnimationFrame(h),this.container.querySelector("#btn-claim-multiplier").addEventListener("click",()=>{cancelAnimationFrame(this.needleAnimId),this.closeModal(),a.onClaimMultiplier(this.needleMultiplier)}),this.container.querySelector("#btn-claim-base").addEventListener("click",()=>{cancelAnimationFrame(this.needleAnimId),this.closeModal(),a.onClaimBase()})}closeModal(){this.needleAnimId&&cancelAnimationFrame(this.needleAnimId),this.modalContainer.innerHTML=""}}const Gt={"offroad-expedition-3d":{themeColor:"#d97706",accentGradient:"linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",glowRgba:"rgba(217, 119, 6, 0.34)",tintBg:"rgba(254, 243, 199, 0.88)"},"rally-horizon-3d":{themeColor:"#0284c7",accentGradient:"linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)",glowRgba:"rgba(2, 132, 199, 0.34)",tintBg:"rgba(224, 242, 254, 0.88)"},"smash-karts-brawl-3d":{themeColor:"#ef4444",accentGradient:"linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)",glowRgba:"rgba(239, 68, 68, 0.34)",tintBg:"rgba(254, 226, 226, 0.88)"},"bridge-rush-io-3d":{themeColor:"#2563eb",accentGradient:"linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)",glowRgba:"rgba(37, 99, 235, 0.34)",tintBg:"rgba(224, 242, 254, 0.88)"},"stumble-knockout-royale-3d":{themeColor:"#ec4899",accentGradient:"linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",glowRgba:"rgba(236, 72, 153, 0.34)",tintBg:"rgba(252, 231, 243, 0.88)"},"bumper-smash-io-3d":{themeColor:"#f97316",accentGradient:"linear-gradient(135deg, #f97316 0%, #ea580c 100%)",glowRgba:"rgba(249, 115, 22, 0.34)",tintBg:"rgba(255, 237, 213, 0.88)"},"ragdoll-archers-duel-3d":{themeColor:"#2563eb",accentGradient:"linear-gradient(135deg, #2563eb 0%, #f59e0b 100%)",glowRgba:"rgba(37, 99, 235, 0.34)",tintBg:"rgba(219, 234, 254, 0.88)"},"physics-drop-merge-3d":{themeColor:"#22c55e",accentGradient:"linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",glowRgba:"rgba(34, 197, 94, 0.34)",tintBg:"rgba(220, 252, 231, 0.88)"},"voxel-craft-smash-3d":{themeColor:"#f97316",accentGradient:"linear-gradient(135deg, #f97316 0%, #eab308 100%)",glowRgba:"rgba(249, 115, 22, 0.34)",tintBg:"rgba(254, 243, 199, 0.88)"},"hole-city-io-3d":{themeColor:"#06b6d4",accentGradient:"linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",glowRgba:"rgba(6, 182, 212, 0.34)",tintBg:"rgba(207, 250, 254, 0.88)"},"hexa-sort-3d":{themeColor:"#f59e0b",accentGradient:"linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",glowRgba:"rgba(245, 158, 11, 0.34)",tintBg:"rgba(254, 243, 199, 0.88)"},"cyber-arrow-3d":{themeColor:"#6366f1",accentGradient:"linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)",glowRgba:"rgba(99, 102, 241, 0.34)",tintBg:"rgba(224, 231, 255, 0.88)"}},Dt={themeColor:"#2563eb",accentGradient:"linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)",glowRgba:"rgba(37, 99, 235, 0.34)",tintBg:"rgba(224, 242, 254, 0.88)"};function Ht(){return typeof document<"u"&&(document.documentElement.classList.remove("yt-embed-mode"),document.body?.classList.remove("embed-fullscreen-mode")),!1}class It{options;isMenuOpen=!0;difficulty="normal";hasStartedOnce=!1;difficultyChangedWhileOpen=!1;stageEl=null;restartBtn=null;menuBtn=null;stagePauseBtn=null;startMenuEl=null;otherGamesList=null;resizeObserver=null;lastRestartTimestamp=0;lastObservedWidth=0;lastObservedHeight=0;onArcadeRestartBound=()=>this.triggerRestart();nativeRaf=null;nativeCancelRaf=null;parkedRafCallbacks=new Map;nextParkedRafId=9e5;bootFramesRemaining=2;onKeyDownBound=t=>{t.code==="Escape"&&(t.preventDefault(),this.isMenuOpen?this.hasStartedOnce&&this.hideStartMenuAndPlay():this.showStartMenu())};constructor(t){this.options=t,Ht(),this.ensureCanonicalShellDom(),this.restartBtn=document.getElementById("shell-restart-btn"),this.menuBtn=document.getElementById("shell-menu-btn"),this.otherGamesList=document.getElementById("shell-other-games-list"),this.init()}getDifficultyMultiplier(){return this.difficulty==="easy"?.78:this.difficulty==="hard"?1.28:1}ensureCanonicalShellDom(){if(typeof document>"u")return;const t=document.getElementById("app")||document.getElementById("game-container"),s=document.getElementById("hud")||document.getElementById("hud-root");if(!t)return;t.classList.add("game-canvas-container"),s&&s.classList.add("game-hud-overlay");let e=document.getElementById("arcade-shell");e||(e=document.createElement("div"),e.id="arcade-shell",document.body.prepend(e)),e.className="arcade-shell";let a=document.getElementById("shell-stage")||e.querySelector(".shell-stage");a||(a=document.createElement("main"),a.appendChild(t),s&&a.appendChild(s)),a.id="shell-stage",a.className="shell-stage is-menu-locked",this.stageEl=a,this.applyThemePalette(Gt[this.options.currentGameId]||Dt),document.getElementById("shell-fullscreen-btn")?.remove(),document.getElementById("fullscreen-ad-banner")?.remove();let i=e.querySelector(".shell-sidebar-left");i||(i=document.createElement("aside"),e.prepend(i)),i.className="shell-sidebar shell-sidebar-left",i.innerHTML=`
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
    `,a.parentElement!==e&&e.appendChild(a);let n=document.getElementById("shell-stage-pause-btn");n||(n=document.createElement("button"),n.id="shell-stage-pause-btn",n.type="button",a.appendChild(n)),n.className="shell-stage-pause-btn",n.title="Menü / Duraklat (ESC)",n.setAttribute("data-hud-interactive","true"),n.textContent="⏸",n.addEventListener("pointerdown",l=>l.stopPropagation()),n.addEventListener("click",l=>{l.stopPropagation(),this.showStartMenu()}),this.stagePauseBtn=n,this.mountStartMenu(a);let o=e.querySelector(".shell-sidebar-right");o||(o=document.createElement("aside"),e.appendChild(o)),o.className="shell-sidebar shell-sidebar-right";const r=document.title.split("//")[0].trim()||"ARCADE 3D";o.innerHTML=`
      <div class="ad-rail-wrapper">
        <span class="ad-header-tag">SPONSOR // REKLAM</span>
        <div id="ad-banner-desktop" class="ad-banner-slot banner-300x600">
          <div class="ad-mock-creative">
            <div class="ad-mock-glow"></div>
            <p class="ad-mock-brand">${r}</p>
            <p class="ad-mock-desc">Zero-install 60 FPS WebGL 3D Arcade</p>
            <div class="ad-mock-cta">ŞİMDİ OYNA</div>
          </div>
        </div>
      </div>
    `}applyThemePalette(t){this.stageEl&&(this.stageEl.style.setProperty("--menu-theme-color",t.themeColor),this.stageEl.style.setProperty("--menu-accent-gradient",t.accentGradient),this.stageEl.style.setProperty("--menu-glow-rgba",t.glowRgba),this.stageEl.style.setProperty("--menu-tint-bg",t.tintBg))}findNativeSoundButton(){return typeof document>"u"?null:document.querySelector('#sk-mute-btn, #btn-sound, #sound-btn, #hud-sound-btn, [id*="mute"], [id*="sound"]')}mountStartMenu(t){let s=document.getElementById("shell-start-menu");s||(s=document.createElement("div"),s.id="shell-start-menu",t.appendChild(s)),s.className="shell-start-menu-overlay",s.setAttribute("data-hud-interactive","true");const a=(document.title.split("//")[0]||"3D ARCADE").trim();s.innerHTML=`
      <div class="shell-start-card" data-hud-interactive="true">
        <div class="shell-start-mini-tools" id="shell-start-mini-tools">
          <button id="shell-menu-sound-btn" class="shell-mini-icon-btn" type="button" title="Ses Aç/Kapat" style="display:none" data-hud-interactive="true">🔊</button>
          <button id="shell-menu-reset-btn" class="shell-mini-icon-btn" type="button" title="Sıfırdan Başlat" style="display:none" data-hud-interactive="true">🔄</button>
        </div>
        <div class="shell-start-icon-wrap">
          <img src="./icon.svg" alt="${a}" class="shell-start-icon" onerror="this.style.display='none'" />
        </div>
        <h1 class="shell-start-title" id="shell-start-title">${a}</h1>
        <div class="shell-difficulty-group" role="radiogroup" aria-label="Zorluk Seçimi" data-hud-interactive="true">
          <button type="button" class="shell-diff-btn" data-difficulty="easy" data-hud-interactive="true">Kolay</button>
          <button type="button" class="shell-diff-btn is-active" data-difficulty="normal" data-hud-interactive="true">Normal</button>
          <button type="button" class="shell-diff-btn" data-difficulty="hard" data-hud-interactive="true">Zor</button>
        </div>
        <button id="shell-start-play-btn" class="shell-start-play-btn" type="button" data-hud-interactive="true">
          <span>▶</span> <span id="shell-start-play-label">OYNA</span>
        </button>
      </div>
    `;const i=d=>{d.stopPropagation()};s.addEventListener("pointerdown",i),s.addEventListener("pointermove",i),s.addEventListener("pointerup",i),s.addEventListener("mousedown",i),s.addEventListener("touchstart",i,{passive:!0});const n=s.querySelectorAll(".shell-diff-btn");n.forEach(d=>{d.addEventListener("click",u=>{u.stopPropagation();const m=d.getAttribute("data-difficulty")||"normal";m!==this.difficulty&&(this.difficulty=m,this.difficultyChangedWhileOpen=!0),n.forEach(g=>g.classList.toggle("is-active",g===d));const p=this.getDifficultyMultiplier();this.options.onDifficultyChange?.(this.difficulty,p),window.dispatchEvent(new CustomEvent("arcade:difficulty",{detail:{difficulty:this.difficulty,multiplier:p}}))})});const o=s.querySelector("#shell-menu-sound-btn"),r=()=>{if(!o)return;const d=this.findNativeSoundButton();if(d){o.style.display="inline-flex";const u=d.textContent?.trim()||"";o.textContent=u.includes("🔇")?"🔇":"🔊"}else o.style.display="none"};setTimeout(r,60),o&&o.addEventListener("click",d=>{d.stopPropagation();const u=this.findNativeSoundButton();u&&(u.click(),r())});const l=s.querySelector("#shell-menu-reset-btn");l&&l.addEventListener("click",d=>{d.stopPropagation(),this.difficultyChangedWhileOpen=!0,this.hideStartMenuAndPlay()});const h=s.querySelector("#shell-start-play-btn");h&&h.addEventListener("click",d=>{d.stopPropagation(),this.hideStartMenuAndPlay()}),this.startMenuEl=s}showStartMenu(){if(!this.startMenuEl)return;this.isMenuOpen=!0,this.difficultyChangedWhileOpen=!1,this.stageEl?.classList.add("is-menu-locked"),this.startMenuEl.classList.remove("is-hidden");const t=this.startMenuEl.querySelector("#shell-menu-reset-btn");t&&(t.style.display=this.hasStartedOnce?"inline-flex":"none");const s=this.startMenuEl.querySelector("#shell-menu-sound-btn"),e=this.findNativeSoundButton();if(s&&e){s.style.display="inline-flex";const a=e.textContent?.trim()||"";s.textContent=a.includes("🔇")?"🔇":"🔊"}}hideStartMenuAndPlay(){if(!this.startMenuEl)return;const t=this.isMenuOpen||!this.startMenuEl.classList.contains("is-hidden");this.isMenuOpen=!1,this.stageEl?.classList.remove("is-menu-locked"),this.startMenuEl.classList.add("is-hidden"),t&&(!this.hasStartedOnce||this.difficultyChangedWhileOpen)&&(this.hasStartedOnce=!0,this.difficultyChangedWhileOpen=!1,this.triggerRestart()),this.flushParkedAnimationFrames()}installMenuRafGate(){typeof window>"u"||this.nativeRaf||(this.nativeRaf=window.requestAnimationFrame.bind(window),this.nativeCancelRaf=window.cancelAnimationFrame.bind(window),window.requestAnimationFrame=t=>{if(this.isMenuOpen){if(this.bootFramesRemaining>0)return this.bootFramesRemaining--,this.nativeRaf(t);const s=++this.nextParkedRafId;return this.parkedRafCallbacks.set(s,t),s}return this.nativeRaf(t)},window.cancelAnimationFrame=t=>{if(this.parkedRafCallbacks.has(t)){this.parkedRafCallbacks.delete(t);return}this.nativeCancelRaf?.(t)})}flushParkedAnimationFrames(){if(!this.nativeRaf||this.parkedRafCallbacks.size===0)return;const t=Array.from(this.parkedRafCallbacks.values());this.parkedRafCallbacks.clear();for(let s=0;s<t.length;s++)this.nativeRaf(t[s])}init(){this.installMenuRafGate(),window.addEventListener("arcade:restart",this.onArcadeRestartBound),window.addEventListener("keydown",this.onKeyDownBound),this.restartBtn&&this.restartBtn.addEventListener("click",()=>{this.isMenuOpen=!1,this.hasStartedOnce=!0,this.difficultyChangedWhileOpen=!1,this.stageEl?.classList.remove("is-menu-locked"),this.startMenuEl?.classList.add("is-hidden"),window.dispatchEvent(new CustomEvent("arcade:restart")),this.flushParkedAnimationFrames()}),this.menuBtn&&this.menuBtn.addEventListener("click",()=>{this.showStartMenu()}),this.setupResizeObserver(),this.loadOtherGames()}triggerRestart(){const t=performance.now();t-this.lastRestartTimestamp<80||(this.lastRestartTimestamp=t,this.options.onRestart())}setupResizeObserver(){const t=document.getElementById("app")||document.getElementById("game-container")||document.getElementById("shell-stage");!t||typeof ResizeObserver>"u"||(this.resizeObserver=new ResizeObserver(s=>{for(let e=0;e<s.length;e++){const a=s[e].contentRect,i=Math.round(a.width),n=Math.round(a.height);i>0&&n>0&&(i!==this.lastObservedWidth||n!==this.lastObservedHeight)&&(this.lastObservedWidth=i,this.lastObservedHeight=n,this.options.onResize&&this.options.onResize(i,n),window.dispatchEvent(new Event("resize")))}}),this.resizeObserver.observe(t))}async loadOtherGames(){if(this.otherGamesList)try{const t=await fetch("../games.json");if(!t.ok)return;const s=await t.json(),e=s.find(i=>i.id===this.options.currentGameId);e&&e.themeColor&&e.accentGradient&&this.stageEl&&(this.stageEl.style.setProperty("--menu-theme-color",e.themeColor),this.stageEl.style.setProperty("--menu-accent-gradient",e.accentGradient));const a=s.filter(i=>i.id!==this.options.currentGameId&&i.active!==!1);this.otherGamesList.innerHTML=a.map(i=>`
        <a href="../${i.id}/" class="other-game-item shell-game-card">
          <img src="../${i.id}/icon.svg" class="other-game-icon" alt="" onerror="this.style.display='none'" />
          <div class="other-game-meta game-info">
            <span class="other-game-title game-title">${i.title}</span>
            <span class="other-game-tag game-tag">${i.tags?.[0]||"3D HTML5"}</span>
          </div>
        </a>
      `).join("")}catch{}}dispose(){this.nativeRaf&&typeof window<"u"&&(window.requestAnimationFrame=this.nativeRaf,this.nativeCancelRaf&&(window.cancelAnimationFrame=this.nativeCancelRaf),this.parkedRafCallbacks.clear()),window.removeEventListener("arcade:restart",this.onArcadeRestartBound),window.removeEventListener("keydown",this.onKeyDownBound),this.resizeObserver?.disconnect(),this.stagePauseBtn}}class Z{static instance=null;lastInterstitialTime=0;minInterstitialIntervalMs=9e4;availabilityListeners=[];isShowingAd=!1;initialized=!1;static get(){return this.instance||(this.instance=new Z),this.instance}async initialize(){this.initialized||(this.initialized=!0,this.lastInterstitialTime=Date.now(),typeof window<"u"&&(window.addEventListener("online",()=>this.notifyAvailability(this.isRewardedReady())),window.addEventListener("offline",()=>this.notifyAvailability(!1)),this.syncDomAdState(this.isRewardedReady())))}onAvailabilityChange(t){this.availabilityListeners.push(t)}notifyAvailability(t){this.syncDomAdState(t);for(let s=0;s<this.availabilityListeners.length;s++)try{this.availabilityListeners[s](t)}catch{}}syncDomAdState(t=this.isRewardedReady()){if(typeof document>"u"||!document.body)return;document.body.classList.toggle("ads-unavailable",!t);const s=document.querySelectorAll(".booster-ad-badge, .hud-booster-badge");for(let e=0;e<s.length;e++){const a=s[e];a.textContent=t?"🎬 FREE":"🎬 REKLAM YOK"}}isRewardedReady(){if(typeof navigator<"u"&&!navigator.onLine)return!1;const t=window;return t.ytgame?.IN_PLAYABLES_ENV?!!t.ytgame?.ads?.requestRewardedAd:!0}async showInterstitial(t="level_transition"){if(this.isShowingAd||!this.isRewardedReady())return!1;const s=Date.now();if(s-this.lastInterstitialTime<this.minInterstitialIntervalMs)return!1;this.lastInterstitialTime=s,this.isShowingAd=!0;try{const e=window;if(e.ytgame?.IN_PLAYABLES_ENV&&e.ytgame?.ads?.requestInterstitialAd)try{return await e.ytgame.ads.requestInterstitialAd(),!0}catch{return!1}return e.CrazyGames?.SDK?.ad?.requestAd?await new Promise(a=>{e.CrazyGames.SDK.ad.requestAd("midgame",{adFinished:()=>a(!0),adError:()=>a(!1)})}):e.ysdk?.adv?.showFullscreenAdv?await new Promise(a=>{e.ysdk.adv.showFullscreenAdv({callbacks:{onClose:()=>a(!0),onError:()=>a(!1)}})}):e.PokiSDK?.commercialBreak?await new Promise(a=>{e.PokiSDK.commercialBreak().then(()=>a(!0)).catch(()=>a(!1))}):await this.showMockAdModal(`SPONSOR BREAK [${t.toUpperCase()}]`,2)}finally{this.isShowingAd=!1}}async showRewarded(t="rewarded_booster"){if(this.isShowingAd||!this.isRewardedReady())return!1;this.isShowingAd=!0;try{const s=window;if(s.ytgame?.IN_PLAYABLES_ENV&&s.ytgame?.ads?.requestRewardedAd)try{return await s.ytgame.ads.requestRewardedAd(),this.lastInterstitialTime=Date.now(),!0}catch{return!1}return s.CrazyGames?.SDK?.ad?.requestAd?await new Promise(e=>{s.CrazyGames.SDK.ad.requestAd("rewarded",{adFinished:()=>{this.lastInterstitialTime=Date.now(),e(!0)},adError:()=>e(!1)})}):s.ysdk?.adv?.showRewardedVideo?await new Promise(e=>{let a=!1;s.ysdk.adv.showRewardedVideo({callbacks:{onRewarded:()=>{a=!0,this.lastInterstitialTime=Date.now()},onClose:()=>e(a),onError:()=>e(!1)}})}):s.PokiSDK?.rewardedBreak?await new Promise(e=>{s.PokiSDK.rewardedBreak().then(a=>{a&&(this.lastInterstitialTime=Date.now()),e(!!a)}).catch(()=>e(!1))}):await this.showMockAdModal(`ÖDÜLLÜ REKLAM // ${t.toUpperCase()}`,2)}finally{this.isShowingAd=!1}}showMockAdModal(t,s){return new Promise(e=>{const a=document.createElement("div");a.className="mock-ad-modal modal-overlay",a.setAttribute("data-hud-interactive","true"),a.style.cssText=`
        position: absolute; inset: 0; background: rgba(3, 7, 18, 0.95);
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        z-index: 100000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #fff; backdrop-filter: blur(8px); pointer-events: auto;
      `;const i=d=>d.stopPropagation();a.addEventListener("pointerdown",i),a.addEventListener("mousedown",i),a.addEventListener("touchstart",i);let n=s;a.innerHTML=`
        <div class="modal-card" data-hud-interactive="true" style="background: #0f172a; border: 2px solid #0284c7; border-radius: 16px; padding: 28px; width: 90%; max-width: 380px; text-align: center; box-shadow: 0 0 40px rgba(2, 132, 199, 0.4);">
          <span style="font-size: 11px; letter-spacing: 2px; color: #38bdf8; font-weight: 800; display: block; margin-bottom: 8px;">YOUTUBE PLAYABLES REWARD REEL // SPONSOR</span>
          <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 700; color: #f8fafc;">${t}</h3>
          <div style="height: 120px; background: rgba(2, 132, 199, 0.1); border: 1px dashed #0284c7; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span id="mock-ad-countdown" style="font-size: 32px; font-weight: 800; color: #38bdf8;">${n}s</span>
          </div>
          <button id="mock-ad-claim-btn" class="hud-btn" data-hud-interactive="true" disabled style="width: 100%; height: auto; padding: 12px; border-radius: 10px; border: none; background: #334155; color: #94a3b8; font-weight: 800; font-size: 14px; cursor: not-allowed; transition: all 0.2s;">
            LÜTFEN BEKLEYİN...
          </button>
        </div>
      `,(document.getElementById("shell-stage")||document.body).appendChild(a);const r=a.querySelector("#mock-ad-countdown"),l=a.querySelector("#mock-ad-claim-btn"),h=setInterval(()=>{n--,n>0?r.textContent=`${n}s`:(clearInterval(h),r.textContent="TAMAMLANDI! ✓",r.style.color="#10b981",r.style.fontSize="22px",l.disabled=!1,l.style.background="linear-gradient(135deg, #10b981, #059669)",l.style.color="#ffffff",l.style.cursor="pointer",l.textContent="ÖDÜLÜ AL & DEVAM ET")},1e3);l.addEventListener("click",d=>{d.stopPropagation(),!(n>0)&&(clearInterval(h),a.remove(),this.lastInterstitialTime=Date.now(),e(!0))})})}}const b={arenaSize:140,matchDurationSec:90,baseHoleRadius:1.15,maxHoleRadius:7.8,baseSpeed:8.2,botSpeedMultiplier:.88,turboSpeedMultiplier:1.38,magnetRangeMultiplier:2.8,evolutionStages:[{stage:1,title:"SOKAK YUTUCU",minRadius:1.15,unlockLabel:"Koniler & Hidrantlar",accentColor:"#06b6d4",accentHex:440020},{stage:2,title:"ARAÇ AVCISI",minRadius:1.65,unlockLabel:"Otomobiller & Ağaçlar",accentColor:"#10b981",accentHex:1096065},{stage:3,title:"BULVAR DEVİ",minRadius:2.45,unlockLabel:"Şehir Otobüsleri",accentColor:"#f59e0b",accentHex:16096779},{stage:4,title:"BLOK YIKICI",minRadius:3.6,unlockLabel:"Binalar & Mağazalar",accentColor:"#ec4899",accentHex:15485081},{stage:5,title:"MEGA TEKİLLİK",minRadius:4.9,unlockLabel:"Dev Gökdelenler!",accentColor:"#8b5cf6",accentHex:9133302}],boosterMagnetDurationSec:12,boosterTurboDurationSec:15,boosterSizeSurgeBonus:.65,reviveOvertimeSec:25,coinsPerFirstPlace:100,coinsPerSecondPlace:60,coinsPerThirdPlace:40,coinsPerParticipation:20,bots:[{id:"bot-1",name:"ApexNomad",color:"#ef4444",ringColor:"#fca5a5"},{id:"bot-2",name:"VortexQueen",color:"#a855f7",ringColor:"#d8b4fe"},{id:"bot-3",name:"CityChomp_99",color:"#f59e0b",ringColor:"#fde68a"},{id:"bot-4",name:"NeonByte",color:"#10b981",ringColor:"#6ee7b7"},{id:"bot-5",name:"TurboSink",color:"#3b82f6",ringColor:"#93c5fd"},{id:"bot-6",name:"PixelPulse",color:"#ec4899",ringColor:"#fbcfe8"},{id:"bot-7",name:"TitanCrush",color:"#6366f1",ringColor:"#c7d2fe"}],skins:[{id:"skin_default",name:"Neon Abyss",color:"#06b6d4",ringColor:"#22d3ee",price:0},{id:"skin_magma",name:"Magma Core",color:"#ea580c",ringColor:"#fb923c",price:150},{id:"skin_amethyst",name:"Cyber Violet",color:"#9333ea",ringColor:"#c084fc",price:250},{id:"skin_gold",name:"Golden Singularity",color:"#d97706",ringColor:"#fbbf24",price:400}]};class Ot{static textureCache=new Map;static createCarChassis(t=2.4,s=1.25,e=.65,a={baseColorHex:2450411}){const i=new E,n=new H(s,e*.55,t,4,.12),o=this.createRacingLiveryTexture(a),r=new f({map:o,roughness:.38,metalness:.18});D.applyRimLight(r,16774885,.25);const l=new c(n,r);l.position.set(0,e*.38,0),l.castShadow=!0,l.receiveShadow=!0,i.add(l);const h=t*.52,d=s*.82,u=e*.55,m=new H(d,u,h,3,.1),p=new f({color:988970,roughness:.15,metalness:.85}),g=new c(m,p);g.position.set(0,e*.76,-t*.04),g.castShadow=!0,i.add(g);const y=new B(d*.9,u*.7),w=new f({color:3718648,roughness:.1,metalness:.4,transparent:!0,opacity:.45}),S=new c(y,w);S.position.set(0,e*.78,h*.5+.01),S.rotation.x=-.32,i.add(S);const M=new f({color:1976635,roughness:.6,metalness:.25}),C=new c(new H(s*1.05,.12,.42,2,.04),M);C.position.set(0,.18,t*.52),C.castShadow=!0,i.add(C);const N=new f({color:16707722,emissive:16638023,emissiveIntensity:.65,roughness:.2}),I=new H(.24,.12,.12,2,.03),O=new c(I,N);O.position.set(-s*.36,e*.46,t*.5);const J=new c(I,N);J.position.set(s*.36,e*.46,t*.5),i.add(O,J);const W=new c(new H(s*1.08,.08,.32,2,.03),M);W.position.set(0,e*1.08,-t*.46),W.castShadow=!0;const Q=new c(new x(.06,.36,.12),M);Q.position.set(-s*.35,e*.88,-t*.44);const tt=new c(new x(.06,.36,.12),M);tt.position.set(s*.35,e*.88,-t*.44),i.add(W,Q,tt);const ht=new f({color:15680580,emissive:14427686,emissiveIntensity:.75,roughness:.2}),et=new c(new H(s*.72,.08,.1,2,.02),ht);et.position.set(0,e*.48,-t*.51),i.add(et);const Y=new R(.08,.09,.22,10);Y.rotateX(Math.PI/2);const st=new f({color:9741240,metalness:.9,roughness:.2}),it=new c(Y,st);it.position.set(-s*.22,.22,-t*.52);const at=new c(Y,st);return at.position.set(s*.22,.22,-t*.52),i.add(it,at),i}static createDetailedWheel(t=.32,s=.26,e=16436245,a=988970){const i=new E,n=new R(t,t,s,18);n.rotateZ(Math.PI/2);const o=new f({color:a,roughness:.65,metalness:.08}),r=new c(n,o);r.castShadow=!0,i.add(r);const l=new E,h=new $(t*.68,.04,8,18);h.rotateY(Math.PI/2);const d=new f({color:e,metalness:.78,roughness:.25}),u=new c(h,d);u.position.x=s*.48,l.add(u);const m=new R(t*.25,t*.25,.06,12);m.rotateZ(Math.PI/2);const p=new c(m,d);p.position.x=s*.48,l.add(p);const g=new x(.04,t*.56,.06);for(let I=0;I<5;I++){const O=new c(g,d);O.position.x=s*.48,O.rotation.x=I*Math.PI*2/5,l.add(O)}i.add(l);const y=new R(t*.52,t*.52,.03,16);y.rotateZ(Math.PI/2);const w=new f({color:9741240,metalness:.92,roughness:.28}),S=new c(y,w);S.position.x=s*.15,i.add(S);const M=new x(.06,t*.28,t*.28),C=new f({color:15680580,roughness:.4,metalness:.3}),N=new c(M,C);return N.position.set(s*.16,t*.32,0),i.add(N),{group:i,tireMesh:r,rimGroup:l}}static createRacingLiveryTexture(t){const s=`livery_${t.baseColorHex}_${t.stripeColorHex??16777215}_${t.numberText??"7"}`,e=this.textureCache.get(s);if(e)return e;const a=document.createElement("canvas");a.width=512,a.height=512;const i=a.getContext("2d"),n=`#${t.baseColorHex.toString(16).padStart(6,"0")}`;if(i.fillStyle=n,i.fillRect(0,0,512,512),t.hasCarbonHood!==!1){i.fillStyle="rgba(15, 23, 42, 0.18)";for(let h=300;h<512;h+=8)for(let d=60;d<452;d+=8)(d+h)%16===0&&i.fillRect(d,h,4,4)}const o=t.stripeColorHex!==void 0?`#${t.stripeColorHex.toString(16).padStart(6,"0")}`:"#ffffff";i.fillStyle=o,i.fillRect(206,0,36,512),i.fillRect(270,0,36,512);const r=t.accentColorHex!==void 0?`#${t.accentColorHex.toString(16).padStart(6,"0")}`:"#facc15";i.fillStyle=r,i.fillRect(198,0,6,512),i.fillRect(308,0,6,512),i.fillStyle="#ffffff",i.beginPath(),i.arc(256,170,56,0,Math.PI*2),i.fill(),i.lineWidth=6,i.strokeStyle="#0f172a",i.stroke(),i.font='900 64px "Outfit", system-ui, sans-serif',i.fillStyle="#0f172a",i.textAlign="center",i.textBaseline="middle",i.fillText(t.numberText??"7",256,172);const l=new K(a);return l.wrapS=U,l.wrapT=U,l.needsUpdate=!0,this.textureCache.set(s,l),l}static createContactShadowMesh(t=1.4,s=.55){return D.createContactShadow(t,s)}}class L{static matOrangeCone=new f({color:16347926,roughness:.45});static matWhiteStripe=new f({color:16317180,roughness:.4});static matDarkRubber=new f({color:3359061,roughness:.8});static matRedHydrant=new f({color:15680580,roughness:.45});static matGoldMetal=new f({color:16096779,roughness:.35,metalness:.4});static matDarkMetal=new f({color:1976635,roughness:.6,metalness:.3});static matTreeTrunk=new f({color:7877903,roughness:.8});static matFoliage1=new f({color:2278750,roughness:.5});static matFoliage2=new f({color:1483594,roughness:.5});static matCarGlass=new f({color:988970,roughness:.2,metalness:.5});static matTire=new f({color:1976635,roughness:.9});static matBusBody=new f({color:3900150,roughness:.45});static matBuildingCream=new f({color:16708551,roughness:.6});static matBuildingPastelBlue=new f({color:12248829,roughness:.55});static matBuildingMint=new f({color:11006928,roughness:.55});static matBuildingCoral=new f({color:16698835,roughness:.55});static matRoofTile=new f({color:10033947,roughness:.6});static matSkyscraperGlass=new f({color:3718648,roughness:.25,metalness:.3});static createTornadoMesh(){const t=new E,s=new f({color:9684477,roughness:.3,transparent:!0,opacity:.65});for(let e=0;e<4;e++){const a=1.2+e*.9,i=new c(new $(a,.22,8,24),s);i.position.y=.5+e*1.5,i.rotation.x=Math.PI/2,t.add(i)}return t}static createTauntSprite(t){const s=document.createElement("canvas");s.width=128,s.height=64;const e=s.getContext("2d");e.fillStyle="#ffffff",e.beginPath(),e.roundRect(4,4,120,56,16),e.fill(),e.strokeStyle="#3b82f6",e.lineWidth=4,e.stroke(),e.font="28px system-ui, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillStyle="#1e293b",e.fillText(t,64,34);const a=new K(s),i=new bt({map:a,transparent:!0}),n=new vt(i);return n.scale.set(3.5,1.8,1),n}static createTrafficCone(){const t=new E,s=new x(.7,.08,.7),e=new c(s,this.matOrangeCone);e.position.y=.04,e.castShadow=!0,t.add(e);const a=new R(.08,.28,.85,12),i=new c(a,this.matOrangeCone);i.position.y=.46,i.castShadow=!0,t.add(i);const n=new R(.18,.22,.2,12),o=new c(n,this.matWhiteStripe);return o.position.y=.45,t.add(o),{group:t,type:"traffic_cone",tier:1,radius:.5,height:.9,points:5}}static createFireHydrant(){const t=new E,s=new R(.26,.3,.15,12),e=new c(s,this.matDarkRubber);e.position.y=.075,t.add(e);const a=new R(.22,.22,.7,12),i=new c(a,this.matRedHydrant);i.position.y=.45,i.castShadow=!0,t.add(i);const n=new dt(.22,12,8,0,Math.PI*2,0,Math.PI*.5),o=new c(n,this.matRedHydrant);o.position.y=.8,t.add(o);const r=new R(.09,.09,.6,8);r.rotateZ(Math.PI*.5);const l=new c(r,this.matGoldMetal);return l.position.y=.5,t.add(l),{group:t,type:"fire_hydrant",tier:1,radius:.55,height:.95,points:8}}static createParkTree(){const t=new E,s=new R(.25,.38,1.8,8),e=new c(s,this.matTreeTrunk);e.position.y=.9,e.castShadow=!0,t.add(e);const a=new rt(1.2,1),i=new c(a,this.matFoliage1);i.position.y=2.4,i.scale.set(1.1,1,1.1),i.castShadow=!0,t.add(i);const n=new rt(.9,1),o=new c(n,this.matFoliage2);return o.position.set(.2,3.1,-.1),o.castShadow=!0,t.add(o),{group:t,type:"park_tree",tier:2,radius:1.25,height:3.8,points:18}}static createStreetLamp(){const t=new E,s=new R(.08,.12,3,8),e=new c(s,this.matDarkMetal);e.position.y=1.5,e.castShadow=!0,t.add(e);const a=new x(.7,.08,.1),i=new c(a,this.matDarkMetal);i.position.set(.3,3,0),t.add(i);const n=new x(.25,.2,.25),o=new c(n,this.matGoldMetal);return o.position.set(.6,2.9,0),t.add(o),{group:t,type:"street_lamp",tier:2,radius:1.1,height:3.2,points:15}}static createSedanCar(t=0){const s=t===0?16436245:t===1?16007006:440020,e=t===0?14251782:t===1?12456508:165063,a=Ot.createCarChassis(2.8,1.45,.72,{baseColorHex:s,stripeColorHex:16777215,accentColorHex:e,numberText:String((t+1)*11),hasCarbonHood:!1}),i=new R(.28,.28,.24,12);return i.rotateZ(Math.PI*.5),[[-.78,.28,.9],[.78,.28,.9],[-.78,.28,-.9],[.78,.28,-.9]].forEach(([o,r,l])=>{const h=new c(i,this.matTire);h.position.set(o,r,l),h.castShadow=!0,a.add(h)}),{group:a,type:"sedan_car",tier:2,radius:1.5,height:1.3,points:25}}static createCityBus(){const t=new E,s=new x(2.3,1.6,5.8),e=new c(s,this.matBusBody);e.position.y=1.1,e.castShadow=!0,t.add(e);const a=new x(2.34,.5,5.2),i=new c(a,this.matCarGlass);i.position.set(0,1.35,0),t.add(i);const n=new x(1.2,.25,1.8),o=new c(n,this.matWhiteStripe);o.position.set(0,1.95,.2),t.add(o);const r=new R(.38,.38,.3,12);return r.rotateZ(Math.PI*.5),[[-1.2,.38,2],[1.2,.38,2],[-1.2,.38,-1.2],[1.2,.38,-1.2],[-1.2,.38,-2.1],[1.2,.38,-2.1]].forEach(([h,d,u])=>{const m=new c(r,this.matTire);m.position.set(h,d,u),t.add(m)}),{group:t,type:"city_bus",tier:3,radius:2.3,height:2.2,points:55}}static createTownhouse(t=0){const s=new E,e=t===0?this.matBuildingCream:t===1?this.matBuildingPastelBlue:this.matBuildingMint,a=new x(4.2,4.8,4.2),i=new c(a,e);i.position.y=2.4,i.castShadow=!0,s.add(i);const n=new x(1.1,.85,4.28);for(let m=0;m<2;m++)for(let p=-1;p<=1;p+=2){const g=new c(n,this.matSkyscraperGlass);g.position.set(p*1.05,2.6+m*1.35,0),s.add(g)}const o=new xt(3.6,1.6,4);o.rotateY(Math.PI*.25);const r=new c(o,this.matRoofTile);r.position.y=5.6,r.castShadow=!0,s.add(r);const l=new x(3.6,.32,1.1);l.rotateX(.22);const h=new c(l,t===1?this.matRedHydrant:this.matOrangeCone);h.position.set(0,1.85,2.35),s.add(h);const d=new x(1.2,1.5,.15),u=new c(d,this.matDarkMetal);return u.position.set(0,.75,2.12),s.add(u),{group:s,type:"townhouse",tier:4,radius:3.2,height:6.4,points:130}}static createSkyscraper(){const t=new E,s=new x(5.4,9,5.4),e=new c(s,this.matBuildingCoral);e.position.y=4.5,e.castShadow=!0,t.add(e);const a=new x(5.52,.9,5.52);for(let d=0;d<4;d++){const u=new c(a,this.matSkyscraperGlass);u.position.y=2+d*2,t.add(u)}const i=new x(4.1,7,4.1),n=new c(i,this.matSkyscraperGlass);n.position.y=12.5,n.castShadow=!0,t.add(n);const o=new x(4.35,.65,4.35),r=new c(o,this.matWhiteStripe);r.position.y=16,t.add(r);const l=new R(.1,.35,3.5,8),h=new c(l,this.matGoldMetal);return h.position.y=17.8,t.add(h),{group:t,type:"skyscraper",tier:5,radius:4.5,height:19.5,points:380}}}class lt{id;name;isPlayer;group=new E;radius=b.baseHoleRadius;score=0;kills=0;isAlive=!0;currentStage=1;turboTimer=0;magnetTimer=0;invulnerableTimer=0;tauntSprite=null;tauntTimer=0;velocity=new P;targetVelocity=new P;vortexDisc;borderRing;outerRing;shockwaveRing;innerWell;particlesGroup=new E;ringMat;outerRingMat;shockwaveMat;pulseScale=1;shockwaveProgress=0;constructor(t,s,e,a,i){this.id=t,this.name=s,this.isPlayer=e;const n=new _(a),o=new _(i),r=new X(.97,36);r.rotateX(-Math.PI*.5);const l=new G({color:593174,depthWrite:!0});this.vortexDisc=new c(r,l),this.vortexDisc.position.y=.035,this.group.add(this.vortexDisc);const h=new R(.96,.45,.55,32,1,!0),d=new G({color:988970,side:j});this.innerWell=new c(h,d),this.innerWell.position.y=-.24,this.group.add(this.innerWell);const u=new $(1,.095,14,42);u.rotateX(Math.PI*.5),this.ringMat=new f({color:o,emissive:n,emissiveIntensity:.75,roughness:.25}),this.borderRing=new c(u,this.ringMat),this.borderRing.position.y=.055,this.group.add(this.borderRing);const m=new $(1.13,.038,10,42);m.rotateX(Math.PI*.5),this.outerRingMat=new f({color:16777215,emissive:o,emissiveIntensity:.55,roughness:.3,transparent:!0,opacity:.85}),this.outerRing=new c(m,this.outerRingMat),this.outerRing.position.y=.045,this.group.add(this.outerRing);const p=new St(1.05,1.28,36);p.rotateX(-Math.PI*.5),this.shockwaveMat=new G({color:o,side:Mt,transparent:!0,opacity:0}),this.shockwaveRing=new c(p,this.shockwaveMat),this.shockwaveRing.position.y=.06,this.shockwaveRing.visible=!1,this.group.add(this.shockwaveRing);const g=new kt(.065,0),y=new G({color:o});for(let w=0;w<12;w++){const S=new c(g,y),M=w/12*Math.PI*2,C=w%2===0?.72:.45;S.position.set(Math.cos(M)*C,.04+w%3*.03,Math.sin(M)*C),this.particlesGroup.add(S)}this.group.add(this.particlesGroup),this.updateVisualScale()}get position(){return this.group.position}setMoveDirection(t,s){let e=b.baseSpeed;this.isPlayer||(e*=b.botSpeedMultiplier),this.turboTimer>0&&(e*=b.turboSpeedMultiplier);const a=Math.max(.82,1-(this.radius-1.15)*.028);e*=a,this.targetVelocity.set(t*e,0,s*e)}addScore(t,s){this.score+=t;const e=this.radius,a=this.currentStage;this.radius=Math.min(b.maxHoleRadius,this.radius+s),this.radius>e&&(this.pulseScale=Math.min(1.32,1.16+s*.4));const i=this.getEvolutionStage();return this.currentStage=i.stage,this.currentStage>a?(this.triggerStageUpEffect(i),!0):!1}getEvolutionStage(){const t=b.evolutionStages;let s=t[0];for(let e=0;e<t.length;e++)this.radius>=t[e].minRadius&&(s=t[e]);return s}getStageProgress(){const t=b.evolutionStages;let s=0;for(let o=0;o<t.length;o++)this.radius>=t[o].minRadius&&(s=o);const e=t[s],a=s+1<t.length?t[s+1]:null;if(!a)return{current:e,next:null,progress01:1};const i=Math.max(.01,a.minRadius-e.minRadius),n=Math.max(0,Math.min(1,(this.radius-e.minRadius)/i));return{current:e,next:a,progress01:n}}triggerStageUpEffect(t){this.pulseScale=1.36,this.shockwaveProgress=.01,this.shockwaveRing.visible=!0,this.shockwaveRing.scale.setScalar(1),this.shockwaveMat.color.setHex(t.accentHex),this.shockwaveMat.opacity=.95,this.isPlayer&&(this.ringMat.emissive.setHex(t.accentHex),this.ringMat.emissiveIntensity=.8+t.stage*.12,this.outerRingMat.emissive.setHex(t.accentHex))}activateTurbo(){this.turboTimer=b.boosterTurboDurationSec}activateMagnet(){this.magnetTimer=b.boosterMagnetDurationSec}activateSizeSurge(){this.addScore(100,b.boosterSizeSurgeBonus)}activateShield(t){this.invulnerableTimer=t}showTaunt(t,s=2){this.tauntSprite&&(this.group.remove(this.tauntSprite),this.tauntSprite=null),this.tauntSprite=L.createTauntSprite(t),this.tauntSprite.position.set(0,3.8,0),this.group.add(this.tauntSprite),this.tauntTimer=s}update(t){if(!this.isAlive){this.tauntSprite&&(this.group.remove(this.tauntSprite),this.tauntSprite=null);return}this.tauntTimer>0&&(this.tauntTimer-=t,this.tauntTimer<=0&&this.tauntSprite&&(this.group.remove(this.tauntSprite),this.tauntSprite=null)),this.turboTimer>0&&(this.turboTimer=Math.max(0,this.turboTimer-t)),this.magnetTimer>0&&(this.magnetTimer=Math.max(0,this.magnetTimer-t)),this.invulnerableTimer>0&&(this.invulnerableTimer=Math.max(0,this.invulnerableTimer-t)),this.velocity.lerp(this.targetVelocity,Math.min(t*7.8,1)),this.group.position.x+=this.velocity.x*t,this.group.position.z+=this.velocity.z*t;const s=b.arenaSize/2-this.radius;if(this.group.position.x=Math.max(-s,Math.min(s,this.group.position.x)),this.group.position.z=Math.max(-s,Math.min(s,this.group.position.z)),this.particlesGroup.rotation.y+=t*(3.5+this.currentStage*.8),this.shockwaveProgress>0)if(this.shockwaveProgress+=t*1.8,this.shockwaveProgress>=1)this.shockwaveProgress=0,this.shockwaveRing.visible=!1;else{const e=1+this.shockwaveProgress*1.4;this.shockwaveRing.scale.setScalar(e),this.shockwaveMat.opacity=Math.max(0,(1-this.shockwaveProgress)*.9)}this.pulseScale>1&&(this.pulseScale=Math.max(1,this.pulseScale-t*2.5)),this.updateVisualScale()}updateVisualScale(){const t=this.radius*this.pulseScale;this.group.scale.set(t,1,t)}canSwallowProp(t){return t<=this.radius*.96}canSwallowHole(t){return this.isAlive&&t.isAlive&&t.invulnerableTimer<=0&&this.radius>t.radius*1.15}reset(t,s){this.radius=b.baseHoleRadius,this.score=0,this.kills=0,this.isAlive=!0,this.currentStage=1,this.turboTimer=0,this.magnetTimer=0,this.invulnerableTimer=0,this.shockwaveProgress=0,this.shockwaveRing.visible=!1,this.group.position.set(t,0,s),this.velocity.set(0,0,0),this.targetVelocity.set(0,0,0),this.pulseScale=1,this.group.visible=!0,this.updateVisualScale()}}class Ft{group=new E;tornadoMesh=null;tornadoAngle=0;constructor(){this.buildCityGround(),this.buildRoadNetwork(),this.buildPerimeterBounds()}buildCityGround(){const t=b.arenaSize,s=new B(t,t);s.rotateX(-Math.PI*.5);const e=new f({color:15654334,roughness:.72,metalness:.04}),a=new c(s,e);a.receiveShadow=!0,a.position.y=-.01,this.group.add(a);const i=new B(30,30);i.rotateX(-Math.PI*.5);const n=new f({color:4906624,roughness:.75}),o=new X(6.8,24);o.rotateX(-Math.PI*.5);const r=new f({color:16639626,roughness:.65}),l=new X(5.6,24);l.rotateX(-Math.PI*.5);const h=new f({color:3718648,roughness:.25,metalness:.15});[[-24,.01,-24],[24,.01,24],[-24,.01,24],[24,.01,-24]].forEach(([u,m,p],g)=>{const y=new c(i,n);if(y.position.set(u,m,p),y.receiveShadow=!0,this.group.add(y),g<2){const w=new c(o,r);w.position.set(u,.015,p),this.group.add(w);const S=new c(l,h);S.position.set(u,.02,p),this.group.add(S)}})}buildRoadNetwork(){const t=b.arenaSize,s=new f({color:6583435,roughness:.62}),e=new f({color:16317180,roughness:.4}),a=new f({color:16436245,roughness:.45}),i=14,n=new B(t,i);n.rotateX(-Math.PI*.5);const o=new c(n,s);o.position.y=.02,o.receiveShadow=!0,this.group.add(o);const r=new B(i,t);r.rotateX(-Math.PI*.5);const l=new c(r,s);l.position.y=.02,l.receiveShadow=!0,this.group.add(l);const h=10,d=42;[{w:t,h,x:0,z:d},{w:t,h,x:0,z:-d},{w:h,h:t,x:d,z:0},{w:h,h:t,x:-d,z:0}].forEach(({w:g,h:y,x:w,z:S})=>{const M=new B(g,y);M.rotateX(-Math.PI*.5);const C=new c(M,s);C.position.set(w,.02,S),C.receiveShadow=!0,this.group.add(C)});const m=new B(2.6,.45);m.rotateX(-Math.PI*.5);for(let g=-t/2+5;g<t/2;g+=7)if(Math.abs(g)>9&&Math.abs(Math.abs(g)-d)>6){const y=new c(m,a);y.position.set(g,.032,0),this.group.add(y);const w=new c(m,a);w.rotation.y=Math.PI*.5,w.position.set(0,.032,g),this.group.add(w)}const p=new B(2.2,.7);p.rotateX(-Math.PI*.5);for(let g=-4.5;g<=4.5;g+=1.8){const y=new c(p,e);y.rotation.y=Math.PI*.5,y.position.set(g,.034,-8.5),this.group.add(y);const w=new c(p,e);w.rotation.y=Math.PI*.5,w.position.set(g,.034,8.5),this.group.add(w);const S=new c(p,e);S.position.set(8.5,.034,g),this.group.add(S);const M=new c(p,e);M.position.set(-8.5,.034,g),this.group.add(M)}}buildPerimeterBounds(){const t=b.arenaSize,s=t/2,e=new f({color:9741240,roughness:.5}),a=new x(t,1.2,1.2);[{x:0,y:.6,z:s,rotY:0},{x:0,y:.6,z:-s,rotY:0},{x:s,y:.6,z:0,rotY:Math.PI*.5},{x:-s,y:.6,z:0,rotY:Math.PI*.5}].forEach(({x:n,y:o,z:r,rotY:l})=>{const h=new c(a,e);h.position.set(n,o,r),h.rotation.y=l,h.castShadow=!0,h.receiveShadow=!0,this.group.add(h)})}activateTornado(){this.tornadoMesh||(this.tornadoMesh=L.createTornadoMesh(),this.tornadoMesh.position.set(0,0,0),this.group.add(this.tornadoMesh))}updateTornado(t){if(!this.tornadoMesh)return null;this.tornadoAngle+=t*.8,this.tornadoMesh.rotation.y+=t*6;const s=Math.sin(this.tornadoAngle)*24,e=Math.sin(this.tornadoAngle*2)*16;return this.tornadoMesh.position.set(s,0,e),this.tornadoMesh.position}}class z{group;type;tier;radius;points;initialX;initialZ;initialRotY;state="idle";targetHolePos=new P;swallowProgress=0;swallowDuration=.22;initialScale=1;onSwallowedCallback=null;constructor(t,s,e,a=0){this.group=t.group,this.type=t.type,this.tier=t.tier,this.radius=t.radius,this.points=t.points,this.initialX=s,this.initialZ=e,this.initialRotY=a,this.group.position.set(s,0,e),this.group.rotation.y=a,this.initialScale=this.group.scale.x}get position(){return this.group.position}startSwallow(t,s){this.state==="idle"&&(this.state="swallowing",this.targetHolePos.copy(t),this.onSwallowedCallback=s,this.swallowProgress=0)}update(t){if(this.state==="swallowing"){this.swallowProgress+=t/this.swallowDuration;const s=Math.min(this.swallowProgress,1),e=s*s;this.group.position.x+=(this.targetHolePos.x-this.group.position.x)*(t*14),this.group.position.z+=(this.targetHolePos.z-this.group.position.z)*(t*14),this.group.position.y=-e*1.6,this.group.rotation.x+=t*8,this.group.rotation.z+=t*6;const a=Math.max(0,this.initialScale*(1-s));this.group.scale.setScalar(a),s>=1&&(this.state="consumed",this.group.visible=!1,this.onSwallowedCallback&&(this.onSwallowedCallback(),this.onSwallowedCallback=null))}}reset(t=this.initialX,s=this.initialZ){this.state="idle",this.group.position.set(t,0,s),this.group.rotation.set(0,this.initialRotY,0),this.group.scale.setScalar(this.initialScale),this.group.visible=!0}}const k=new P;class Nt{bots=[];playerHole=null;props=[];nextDecisionTimes=new Map;chaseStartTimes=new Map;chaseCooldownUntil=new Map;setEntities(t,s,e){this.bots=t,this.playerHole=s,this.props=e,this.nextDecisionTimes.clear(),this.chaseStartTimes.clear(),this.chaseCooldownUntil.clear()}resetState(){this.nextDecisionTimes.clear(),this.chaseStartTimes.clear(),this.chaseCooldownUntil.clear()}update(t,s){if(this.playerHole)for(let e=0;e<this.bots.length;e++){const a=this.bots[e];if(!a.isAlive)continue;const i=this.nextDecisionTimes.get(a.id)||0;s>=i&&(this.makeDecision(a,s),this.nextDecisionTimes.set(a.id,s+.35+Math.random()*.3)),a.update(t)}}makeDecision(t,s){const e=t.position,a=this.playerHole,i=b.arenaSize*.5-12;let n=null,o=11.5;if(a.isAlive&&a.radius>t.radius*1.15){const d=e.distanceTo(a.position);d<o&&(o=d,n=a)}for(let d=0;d<this.bots.length;d++){const u=this.bots[d];if(u!==t&&u.isAlive&&u.radius>t.radius*1.15){const m=e.distanceTo(u.position);m<o&&(o=m,n=u)}}if(n){this.chaseStartTimes.delete(t.id),k.subVectors(e,n.position).normalize(),Math.abs(e.x)>i&&(k.x=-Math.sign(e.x)*.85),Math.abs(e.z)>i&&(k.z=-Math.sign(e.z)*.85),k.normalize(),t.setMoveDirection(k.x,k.z);return}const r=this.chaseCooldownUntil.get(t.id)||0;if(s>=r){let d=null,u=9.2;if(a.isAlive&&a.invulnerableTimer<=0&&t.radius>a.radius*1.18){const m=e.distanceTo(a.position);m<u&&(u=m,d=a)}for(let m=0;m<this.bots.length;m++){const p=this.bots[m];if(p!==t&&p.isAlive&&p.invulnerableTimer<=0&&t.radius>p.radius*1.18){const g=e.distanceTo(p.position);g<u&&(u=g,d=p)}}if(d){let m=this.chaseStartTimes.get(t.id);if(m===void 0&&(m=s,this.chaseStartTimes.set(t.id,m)),s-m<=2.5){k.subVectors(d.position,e).normalize(),t.setMoveDirection(k.x,k.z);return}else this.chaseStartTimes.delete(t.id),this.chaseCooldownUntil.set(t.id,s+6.5)}else this.chaseStartTimes.delete(t.id)}let l=null,h=-1;for(let d=0;d<this.props.length;d++){const u=this.props[d];if(u.state==="idle"&&t.canSwallowProp(u.radius)){const m=e.distanceTo(u.position);if(m<38){const p=u.points/(m+3);p>h&&(h=p,l=u)}}}if(l){k.subVectors(l.position,e).normalize(),t.setMoveDirection(k.x,k.z);return}k.set(-e.x+(Math.random()-.5)*24,0,-e.z+(Math.random()-.5)*24).normalize(),t.setMoveDirection(k.x,k.z)}}class qt{holes=[];setHoles(t){this.holes=t}getRankings(){return[...this.holes].sort((s,e)=>e.score-s.score).map((s,e)=>({id:s.id,name:s.name,score:s.score,isPlayer:s.isPlayer,rank:e+1}))}getPlayerRank(){const s=this.getRankings().find(e=>e.isPlayer);return s?s.rank:8}}class Vt{coins=0;highScore=0;bestRank=8;unlockedSkins=["skin_default"];equippedSkin="skin_default";async init(){const t=await A.loadData({coins:0,highScore:0,bestRank:8,unlockedSkins:["skin_default"],equippedSkin:"skin_default"});this.coins=t.coins,this.highScore=t.highScore,this.bestRank=t.bestRank,this.unlockedSkins=t.unlockedSkins||["skin_default"],this.equippedSkin=t.equippedSkin||"skin_default"}addCoins(t){this.coins+=t,this.persist()}recordMatchResult(t,s){let e=b.coinsPerParticipation;return s===1?e=b.coinsPerFirstPlace:s===2?e=b.coinsPerSecondPlace:s===3&&(e=b.coinsPerThirdPlace),this.coins+=e,t>this.highScore&&(this.highScore=t),s<this.bestRank&&(this.bestRank=s),this.persist(),A.sendScore(t),e}unlockSkin(t,s){return this.unlockedSkins.includes(t)?!0:this.coins>=s?(this.coins-=s,this.unlockedSkins.push(t),this.equippedSkin=t,this.persist(),!0):!1}equipSkin(t){this.unlockedSkins.includes(t)&&(this.equippedSkin=t,this.persist())}persist(){A.saveData({coins:this.coins,highScore:this.highScore,bestRank:this.bestRank,unlockedSkins:this.unlockedSkins,equippedSkin:this.equippedSkin})}}class Kt{appEl;hudEl;renderer;scene;cameraRig;lighting;particles;sound;loop;ads;economy;input;hud;shell;arena;playerHole;bots=[];props=[];allHolesBuffer=[];botAi=new Nt;leaderboard=new qt;matchTimeRemaining=b.matchDurationSec;isMatchRunning=!1;hasRevivedThisMatch=!1;baseCoinsEarned=0;lastTime=0;constructor(){this.appEl=document.getElementById("app"),this.hudEl=document.getElementById("hud"),A.applyDualModeShell(),this.scene=new ct;const t=this.appEl.clientWidth||window.innerWidth,s=this.appEl.clientHeight||window.innerHeight;this.renderer=new Rt({powerPreference:"high-performance",antialias:!0,stencil:!1,depth:!0}),this.renderer.setSize(t,s),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),D.enhanceRendererAndIBL(this.renderer,this.scene),this.appEl.appendChild(this.renderer.domElement),this.cameraRig=new Et(t/s),this.lighting=new Tt(this.scene),this.particles=new At(this.scene),this.sound=new Pt,this.ads=Z.get(),this.economy=new Vt,this.input=new Bt(this.appEl),this.hud=new zt(this.hudEl),this.shell=new It({currentGameId:"hole-city-io-3d",onRestart:()=>this.startNewMatch()}),this.shell,this.loop=new Lt(e=>this.onFrame(e)),this.init()}async init(){await A.initPlatform(),await this.ads.initialize(),await this.economy.init();const t=()=>{this.sound.unlock(),window.removeEventListener("pointerdown",t),window.removeEventListener("keydown",t)};window.addEventListener("pointerdown",t),window.addEventListener("keydown",t),A.initLifecycle({onPause:()=>{this.isMatchRunning=!1,this.sound.setMuted(!0)},onResume:()=>{this.isMatchRunning=!0,this.sound.setMuted(A.isAudioMuted())},onAudioEnabledChange:s=>{this.sound.setMuted(!s)}}),window.addEventListener("resize",()=>this.onWindowResize()),this.buildCityWorld(),this.setupHudBoosters(),this.startNewMatch(),A.signalFirstFrameReady(),A.signalGameReady(),A.gameplayStart(),this.loop.start()}buildCityWorld(){this.arena=new Ft,this.scene.add(this.arena.group);const t=b.skins[0];this.playerHole=new lt("player","You",!0,t.color,t.ringColor),this.scene.add(this.playerHole.group),this.bots=b.bots.map(s=>{const e=new lt(s.id,s.name,!1,s.color,s.ringColor);return this.scene.add(e.group),e}),this.spawnCityProps(),D.upgradeSceneMaterials(this.scene),this.leaderboard.setHoles([this.playerHole,...this.bots]),this.botAi.setEntities(this.bots,this.playerHole,this.props)}spawnCityProps(){const s=b.arenaSize/2-8,e=(i,n)=>i+Math.random()*(n-i);for(let i=0;i<110;i++){const n=new z(L.createTrafficCone(),e(-s,s),e(-s,s));this.scene.add(n.group),this.props.push(n);const o=new z(L.createFireHydrant(),e(-s,s),e(-s,s));this.scene.add(o.group),this.props.push(o)}for(let i=0;i<70;i++){const n=new z(L.createParkTree(),e(-s,s),e(-s,s));this.scene.add(n.group),this.props.push(n);const o=new z(L.createStreetLamp(),e(-s,s),e(-s,s),Math.PI*.5);this.scene.add(o.group),this.props.push(o);const r=new z(L.createSedanCar(i%3),e(-s+4,s-4),e(-s+4,s-4),e(0,Math.PI));this.scene.add(r.group),this.props.push(r)}for(let i=0;i<24;i++){const n=new z(L.createCityBus(),e(-s+8,s-8),e(-s+8,s-8),i%2*Math.PI*.5);this.scene.add(n.group),this.props.push(n)}for(let i=0;i<20;i++){const n=new z(L.createTownhouse(i%3),e(-s+12,s-12),e(-s+12,s-12));this.scene.add(n.group),this.props.push(n)}[[-36,-36],[36,-36],[-36,36],[36,36],[-18,-18],[18,18],[-18,18],[18,-18]].forEach(([i,n])=>{const o=new z(L.createSkyscraper(),i,n);this.scene.add(o.group),this.props.push(o)})}startNewMatch(){this.matchTimeRemaining=b.matchDurationSec,this.isMatchRunning=!0,this.hasRevivedThisMatch=!1,this.hud.closeModal(),this.playerHole.reset(0,0);const t=this.bots.length;this.bots.forEach((s,e)=>{const a=e/t*Math.PI*2,i=32+e%2*14;s.reset(Math.cos(a)*i,Math.sin(a)*i)});for(let s=0;s<this.props.length;s++)this.props[s].reset();this.botAi.resetState(),this.hud.updateTimer(this.matchTimeRemaining),this.hud.updateScore(0),this.syncPlayerEvolutionHud()}syncPlayerEvolutionHud(){const t=this.playerHole.getStageProgress();this.hud.updateEvolutionProgress(this.playerHole.radius,t.current,t.next,t.progress01)}setupHudBoosters(){this.hud.setBoosterCallbacks({onMagnet:async()=>{await this.ads.showRewarded("booster_magnet")&&(this.playerHole.activateMagnet(),this.sound.playBooster(),this.particles.spawnBurst(this.playerHole.position,440020,18))},onTurbo:async()=>{await this.ads.showRewarded("booster_turbo")&&(this.playerHole.activateTurbo(),this.sound.playBooster(),this.particles.spawnBurst(this.playerHole.position,16096779,18))},onSize:async()=>{if(await this.ads.showRewarded("booster_size")){const s=this.playerHole.currentStage;this.playerHole.activateSizeSurge(),this.sound.playGrow(),this.particles.spawnBurst(this.playerHole.position,11032055,28),this.syncPlayerEvolutionHud(),this.playerHole.currentStage>s&&(this.cameraRig.triggerStageZoomKick(),this.hud.showStageUpBanner(this.playerHole.getEvolutionStage()))}}})}onFrame(t){if(this.lastTime===0){this.lastTime=t,this.renderer.render(this.scene,this.cameraRig.camera);return}const s=Math.min((t-this.lastTime)/1e3,.1);if(this.lastTime=t,!this.shell.isMenuOpen){if(this.isMatchRunning&&!this.shell.isMenuOpen){const e=s*this.shell.getDifficultyMultiplier();this.matchTimeRemaining-=s,this.matchTimeRemaining<=0&&(this.matchTimeRemaining=0,this.handleMatchComplete()),this.hud.updateTimer(this.matchTimeRemaining),this.matchTimeRemaining<=30?(this.arena.activateTornado(),this.hud.showTornadoAlert(!0),this.arena.updateTornado(e)):this.hud.showTornadoAlert(!1);const a=this.input.getMoveVector();this.playerHole.setMoveDirection(a.x,a.z),this.playerHole.update(s),this.botAi.update(e,t/1e3),this.updateSuctionPhysics(s),this.updateHoleCollisions();const i=this.leaderboard.getRankings();this.hud.updateLeaderboard(i),this.hud.updateScore(this.playerHole.score)}this.cameraRig.update(this.playerHole.position,this.playerHole.radius,s),this.lighting.update(this.playerHole.position),this.particles.update(s),this.renderer.render(this.scene,this.cameraRig.camera)}}updateSuctionPhysics(t){this.allHolesBuffer.length=0,this.playerHole.isAlive&&this.allHolesBuffer.push(this.playerHole);for(let e=0;e<this.bots.length;e++)this.bots[e].isAlive&&this.allHolesBuffer.push(this.bots[e]);const s=this.allHolesBuffer;for(const e of this.props){if(e.state==="swallowing"){e.update(t);continue}if(e.state==="consumed")continue;const a=e.position;for(const i of s){let n=i.radius;if(i.isPlayer&&i.magnetTimer>0&&(n*=b.magnetRangeMultiplier),Math.hypot(a.x-i.position.x,a.z-i.position.z)<=n&&i.canSwallowProp(e.radius)){e.startSwallow(i.position,()=>{const r=i.addScore(e.points,e.radius*.042);if(i.isPlayer&&(e.tier===1?this.sound.playPop():e.tier<=3?this.sound.playCrunch():this.sound.playRumble(),this.hud.spawnEatPopup(e.points,e.tier),this.syncPlayerEvolutionHud(),this.particles.spawnBurst(i.position,3718648,8+e.tier*4),r)){const l=i.getEvolutionStage();this.sound.playGrow(),this.cameraRig.triggerStageZoomKick(),this.hud.showStageUpBanner(l),this.particles.spawnBurst(i.position,l.accentHex,34)}});break}}}}updateHoleCollisions(){this.allHolesBuffer.length=0,this.playerHole.isAlive&&this.allHolesBuffer.push(this.playerHole);for(let s=0;s<this.bots.length;s++)this.bots[s].isAlive&&this.allHolesBuffer.push(this.bots[s]);const t=this.allHolesBuffer;for(let s=0;s<t.length;s++){const e=t[s];if(e.isAlive)for(let a=s+1;a<t.length;a++){const i=t[a];if(!i.isAlive)continue;const n=e.position.distanceTo(i.position),o=Math.max(e.radius,i.radius);n<o*.85&&(e.canSwallowHole(i)?this.eliminateHole(e,i):i.canSwallowHole(e)&&this.eliminateHole(i,e))}}}eliminateHole(t,s){s.isAlive=!1,s.group.visible=!1,t.kills++;const e=t.addScore(250,.48);if(t.showTaunt("😈 NOM NOM!"),s.showTaunt("😱 NOOO!"),this.particles.spawnBurst(s.position,15485081,32),t.isPlayer&&(this.sound.playEliminate(),this.syncPlayerEvolutionHud(),e)){const a=t.getEvolutionStage();this.cameraRig.triggerStageZoomKick(),this.hud.showStageUpBanner(a)}s.isPlayer&&!this.hasRevivedThisMatch&&(this.isMatchRunning=!1,this.hud.showReviveModal({onRevive:async()=>{await this.ads.showRewarded("near_miss_revive")?(this.hasRevivedThisMatch=!0,this.playerHole.isAlive=!0,this.playerHole.group.visible=!0,this.playerHole.activateShield(5),this.playerHole.addScore(150,.35),this.matchTimeRemaining+=b.reviveOvertimeSec,this.isMatchRunning=!0,this.sound.playGrow(),this.particles.spawnBurst(this.playerHole.position,1096065,28)):this.handleMatchComplete()},onGiveUp:()=>{this.handleMatchComplete()}}))}handleMatchComplete(){this.isMatchRunning=!1,A.gameplayStop();const t=this.leaderboard.getPlayerRank();this.baseCoinsEarned=this.economy.recordMatchResult(this.playerHole.score,t),(t===2||t===3)&&!this.hasRevivedThisMatch?this.hud.showReviveModal({onRevive:async()=>{await this.ads.showRewarded("near_miss_revive")?(this.hasRevivedThisMatch=!0,this.matchTimeRemaining+=b.reviveOvertimeSec,this.isMatchRunning=!0,this.playerHole.activateShield(4),this.sound.playBooster()):this.showVictoryPodium(t)},onGiveUp:()=>{this.showVictoryPodium(t)}}):this.showVictoryPodium(t)}showVictoryPodium(t){t===1&&this.sound.playVictory(),this.hud.showVictoryModal(t,this.playerHole.score,this.baseCoinsEarned,{onClaimMultiplier:async s=>{if(await this.ads.showRewarded("victory_multiplier")){const a=Math.floor(this.baseCoinsEarned*(s-1));this.economy.addCoins(a)}this.startNewMatch()},onClaimBase:()=>{this.startNewMatch()}})}onWindowResize(){const t=this.appEl.clientWidth||window.innerWidth,s=this.appEl.clientHeight||window.innerHeight;this.renderer.setSize(t,s),this.cameraRig.resize(t,s)}}window.addEventListener("DOMContentLoaded",()=>{new Kt});
