import{V as f,P as U,S as N,B as w,M as R,a as K,b as _,c as h,d as k,C as B,A as j,e as H,f as Y,g as P,h as $,i as W,j as I,R as F,F as X,H as Z,D as O,G as E,k as V,l as J,m as Q,n as tt,o as et,O as st,I as it,p as at,W as nt}from"./three-BotRiH3K.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))e(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&e(n)}).observe(document,{childList:!0,subtree:!0});function s(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function e(a){if(a.ep)return;a.ep=!0;const i=s(a);fetch(a.href,i)}})();class ot{camera;basePos=new f(0,22,28);lookTarget=new f(0,4,-4);shakeIntensity=0;constructor(t){this.camera=new U(48,t,.5,200),this.updateFov(t),this.camera.position.copy(this.basePos),this.camera.lookAt(this.lookTarget)}resize(t,s){const e=t/s;this.camera.aspect=e,this.updateFov(e),this.camera.updateProjectionMatrix()}updateFov(t){t<1?(this.camera.fov=60,this.basePos.set(0,25,32)):(this.camera.fov=46,this.basePos.set(0,20,26)),this.camera.updateProjectionMatrix()}addShake(t=.5){this.shakeIntensity=Math.min(this.shakeIntensity+t,1.2)}update(t){if(this.shakeIntensity>0){this.shakeIntensity=Math.max(0,this.shakeIntensity-t*3.5);const s=(Math.random()-.5)*this.shakeIntensity*.8,e=(Math.random()-.5)*this.shakeIntensity*.6,a=(Math.random()-.5)*this.shakeIntensity*.8;this.camera.position.set(this.basePos.x+s,this.basePos.y+e,this.basePos.z+a)}else this.camera.position.copy(this.basePos);this.camera.lookAt(this.lookTarget)}}class rt extends N{constructor(){super();const t=new w;t.deleteAttribute("uv");const s=new R({side:K}),e=new R,a=new _(16777215,900,28,2);a.position.set(.418,16.199,.3),this.add(a);const i=new h(t,s);i.position.set(-.757,13.219,.717),i.scale.set(31.713,28.305,28.591),this.add(i);const n=new h(t,e);n.position.set(-10.906,2.009,1.846),n.rotation.set(0,-.195,0),n.scale.set(2.328,7.905,4.651),this.add(n);const o=new h(t,e);o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),this.add(o);const r=new h(t,e);r.position.set(6.167,.857,7.803),r.rotation.set(0,.561,0),r.scale.set(3.927,6.285,3.687),this.add(r);const l=new h(t,e);l.position.set(-2.017,.018,6.124),l.rotation.set(0,.333,0),l.scale.set(2.002,4.566,2.064),this.add(l);const d=new h(t,e);d.position.set(2.291,-.756,-2.621),d.rotation.set(0,-.286,0),d.scale.set(1.546,1.552,1.496),this.add(d);const c=new h(t,e);c.position.set(-2.193,-.369,-5.547),c.rotation.set(0,.516,0),c.scale.set(3.875,3.487,2.986),this.add(c);const m=new h(t,A(50));m.position.set(-16.116,14.37,8.208),m.scale.set(.1,2.428,2.739),this.add(m);const v=new h(t,A(50));v.position.set(-16.109,18.021,-8.207),v.scale.set(.1,2.425,2.751),this.add(v);const u=new h(t,A(17));u.position.set(14.904,12.198,-1.832),u.scale.set(.15,4.265,6.331),this.add(u);const M=new h(t,A(43));M.position.set(-.462,8.89,14.52),M.scale.set(4.38,5.441,.088),this.add(M);const b=new h(t,A(20));b.position.set(3.235,11.486,-12.541),b.scale.set(2.5,2,.1),this.add(b);const y=new h(t,A(100));y.position.set(0,20,0),y.scale.set(1,.1,1),this.add(y)}dispose(){const t=new Set;this.traverse(s=>{s.isMesh&&(t.add(s.geometry),t.add(s.material))});for(const s of t)s.dispose()}}function A(p){const t=new k;return t.color.setScalar(p),t}const C=new f;function x(p,t,s,e,a,i){const n=2*Math.PI*a/4,o=Math.max(i-2*a,0),r=Math.PI/4;C.copy(t),C[e]=0,C.normalize();const l=.5*n/(n+o),d=1-C.angleTo(p)/r;return Math.sign(C[s])===1?d*l:o/(n+o)+l+l*(1-d)}class lt extends w{constructor(t=1,s=1,e=1,a=2,i=.1){if(a=a*2+1,i=Math.min(t/2,s/2,e/2,i),super(1,1,1,a,a,a),a===1)return;const n=this.toNonIndexed();this.index=null,this.attributes.position=n.attributes.position,this.attributes.normal=n.attributes.normal,this.attributes.uv=n.attributes.uv;const o=new f,r=new f,l=new f(t,s,e).divideScalar(2).subScalar(i),d=this.attributes.position.array,c=this.attributes.normal.array,m=this.attributes.uv.array,v=d.length/6,u=new f,M=.5/a;for(let b=0,y=0;b<d.length;b+=3,y+=2)switch(o.fromArray(d,b),r.copy(o),r.x-=Math.sign(r.x)*M,r.y-=Math.sign(r.y)*M,r.z-=Math.sign(r.z)*M,r.normalize(),d[b+0]=l.x*Math.sign(o.x)+r.x*i,d[b+1]=l.y*Math.sign(o.y)+r.y*i,d[b+2]=l.z*Math.sign(o.z)+r.z*i,c[b+0]=r.x,c[b+1]=r.y,c[b+2]=r.z,Math.floor(b/v)){case 0:u.set(1,0,0),m[y+0]=x(u,r,"z","y",i,e),m[y+1]=1-x(u,r,"y","z",i,s);break;case 1:u.set(-1,0,0),m[y+0]=1-x(u,r,"z","y",i,e),m[y+1]=1-x(u,r,"y","z",i,s);break;case 2:u.set(0,1,0),m[y+0]=1-x(u,r,"x","z",i,t),m[y+1]=x(u,r,"z","x",i,e);break;case 3:u.set(0,-1,0),m[y+0]=1-x(u,r,"x","z",i,t),m[y+1]=1-x(u,r,"z","x",i,e);break;case 4:u.set(0,0,1),m[y+0]=1-x(u,r,"x","y",i,t),m[y+1]=1-x(u,r,"y","x",i,s);break;case 5:u.set(0,0,-1),m[y+0]=x(u,r,"x","y",i,t),m[y+1]=1-x(u,r,"y","x",i,s);break}}}class z{static contactShadowTexture=null;static skyGradientTexture=null;static microTextureCache=new Map;static enhancedScenes=new WeakSet;static cachedEnvMap=null;static cachedRendererRef=null;static enhanceScene(t){if(this.enhancedScenes.has(t))return;this.enhancedScenes.add(t),t.background||(t.background=new B(13625591));const s=t.onBeforeRender;let e=!1;t.onBeforeRender=function(a,i,n,...o){s&&s.call(this,a,i,n,...o),!e&&a&&(e=!0,z.enhanceRendererAndIBL(a,i),z.upgradeSceneMaterials(i))}}static enhanceRendererAndIBL(t,s){try{if(t.toneMapping=j,t.toneMappingExposure=.88,t.shadowMap&&(t.shadowMap.enabled=!0,t.shadowMap.type=H),!s.environment){if(this.cachedRendererRef!==t||!this.cachedEnvMap){const e=new Y(t);e.compileEquirectangularShader();const a=new rt,i=e.fromScene(a,.04);this.cachedEnvMap=i.texture,this.cachedRendererRef=t,a.dispose(),e.dispose()}s.environment=this.cachedEnvMap}"environmentIntensity"in s&&(s.environmentIntensity=.28)}catch{}}static upgradeSceneMaterials(t){t.traverse(s=>{const e=s;if(!e.isMesh||!e.material)return;const a=e.rotation.x<-1.2&&e.geometry?.boundingSphere&&e.geometry.boundingSphere.radius>18;if(Array.isArray(e.material))for(let i=0;i<e.material.length;i++)this.tuneMaterial(e.material[i],!a);else this.tuneMaterial(e.material,!a)})}static tuneMaterial(t,s){const e=t;!e||!e.isMeshStandardMaterial||((e.envMapIntensity===void 0||e.envMapIntensity===1)&&(e.envMapIntensity=.35),s&&!e.transparent&&this.applyRimLight(e,16775403,.14))}static applyRimLight(t,s=16775403,e=.26){if(t.userData?.hasVisualEnhancerRim)return t;t.userData=t.userData||{},t.userData.hasVisualEnhancerRim=!0;const a=new B(s),i=t.onBeforeCompile;return t.onBeforeCompile=(n,o)=>{i&&i(n,o),n.uniforms.uRimColor={value:a},n.uniforms.uRimStrength={value:e},n.fragmentShader=`uniform vec3 uRimColor;
uniform float uRimStrength;
`+n.fragmentShader,n.fragmentShader=n.fragmentShader.replace("#include <dithering_fragment>",`#include <dithering_fragment>
        vec3 veViewDir = normalize(vViewPosition);
        float veRim = 1.0 - max(dot(normalize(normal), veViewDir), 0.0);
        veRim = pow(veRim, 2.75) * uRimStrength;
        gl_FragColor.rgb += uRimColor * veRim;`)},t.customProgramCacheKey=()=>`ve-rim-${s}-${e.toFixed(2)}`,t}static createBeveledBox(t=1,s=1,e=1,a=.08,i=3){return new lt(t,s,e,i,a)}static createContactShadow(t=.8,s=.35){if(!this.contactShadowTexture&&typeof document<"u"){const n=document.createElement("canvas");n.width=128,n.height=128;const o=n.getContext("2d");if(o){const r=o.createRadialGradient(64,64,6,64,64,60);r.addColorStop(0,"rgba(15, 23, 42, 0.55)"),r.addColorStop(.55,"rgba(15, 23, 42, 0.22)"),r.addColorStop(1,"rgba(15, 23, 42, 0.0)"),o.fillStyle=r,o.fillRect(0,0,128,128)}this.contactShadowTexture=new P(n),this.contactShadowTexture.needsUpdate=!0}const e=new $(t*2,t*2),a=new k({map:this.contactShadowTexture,transparent:!0,opacity:s,depthWrite:!1}),i=new h(e,a);return i.rotation.x=-Math.PI/2,i.position.y=.015,i}static createSkyDome(t=120){if(!this.skyGradientTexture&&typeof document<"u"){const a=document.createElement("canvas");a.width=64,a.height=256;const i=a.getContext("2d");if(i){const n=i.createLinearGradient(0,0,0,256);n.addColorStop(0,"#a5d8f3"),n.addColorStop(.48,"#cfe8f7"),n.addColorStop(.85,"#f4f9fc"),n.addColorStop(1,"#fcf8ee"),i.fillStyle=n,i.fillRect(0,0,64,256)}this.skyGradientTexture=new P(a),this.skyGradientTexture.colorSpace=W,this.skyGradientTexture.needsUpdate=!0}const s=new I(t,24,16),e=new k({map:this.skyGradientTexture,side:K,depthWrite:!1,fog:!1});return new h(s,e)}static createMicroTexture(t){if(this.microTextureCache.has(t))return this.microTextureCache.get(t);if(typeof document>"u")return null;const s=document.createElement("canvas");s.width=256,s.height=256;const e=s.getContext("2d");if(e)if(t==="wood"){e.fillStyle="#f5ebe0",e.fillRect(0,0,256,256),e.strokeStyle="rgba(180, 140, 100, 0.14)",e.lineWidth=2;for(let i=0;i<256;i+=6)e.beginPath(),e.moveTo(0,i),e.bezierCurveTo(85,i+(i%12-6),170,i-(i%10-5),256,i),e.stroke()}else if(t==="stone"){e.fillStyle="#f1f5f9",e.fillRect(0,0,256,256);for(let i=0;i<420;i++){const n=i*73%256,o=i*137%256;e.fillStyle=i%2===0?"rgba(148, 163, 184, 0.12)":"rgba(255, 255, 255, 0.25)",e.fillRect(n,o,3,3)}}else if(t==="grid"){e.fillStyle="#fcf8ee",e.fillRect(0,0,256,256),e.strokeStyle="rgba(148, 163, 184, 0.22)",e.lineWidth=2;for(let i=0;i<=256;i+=32)e.beginPath(),e.moveTo(i,0),e.lineTo(i,256),e.moveTo(0,i),e.lineTo(256,i),e.stroke()}else{e.fillStyle="#ffffff",e.fillRect(0,0,256,256);const i=e.createLinearGradient(0,0,256,256);i.addColorStop(0,"rgba(255,255,255,0.12)"),i.addColorStop(1,"rgba(226,232,240,0.12)"),e.fillStyle=i,e.fillRect(0,0,256,256)}const a=new P(s);return a.wrapS=F,a.wrapT=F,a.colorSpace=W,a.needsUpdate=!0,this.microTextureCache.set(t,a),a}}class ct{hemisphere;sunLight;fillLight;constructor(t){z.enhanceScene(t),t.background=new B(13625591),t.fog=new X(13625591,.009),this.hemisphere=new Z(14676476,16051161,.85),t.add(this.hemisphere),this.sunLight=new O(16774885,1.25),this.sunLight.position.set(25,45,20),this.sunLight.castShadow=!0,this.sunLight.shadow.mapSize.width=2048,this.sunLight.shadow.mapSize.height=2048,this.sunLight.shadow.camera.near=5,this.sunLight.shadow.camera.far=120;const s=26;this.sunLight.shadow.camera.left=-s,this.sunLight.shadow.camera.right=s,this.sunLight.shadow.camera.top=s,this.sunLight.shadow.camera.bottom=-s,this.sunLight.shadow.bias=-4e-4,t.add(this.sunLight),this.fillLight=new O(12248829,.35),this.fillLight.position.set(-20,30,-25),t.add(this.fillLight)}}class dt{group=new E;pool=[];maxParticles=120;sharedGeo=new w(.3,.3,.3);sharedMat=new k({color:16096779});constructor(t){for(let s=0;s<this.maxParticles;s++){const e=new h(this.sharedGeo,this.sharedMat.clone());e.visible=!1,this.group.add(e),this.pool.push({mesh:e,velocity:new f,life:0,maxLife:.6,active:!1})}t.add(this.group)}spawnBlockFracture(t,s,e=8){let a=0;for(const i of this.pool)if(!i.active){i.active=!0,i.life=0,i.maxLife=.4+Math.random()*.3,i.mesh.position.set(t.x+(Math.random()-.5)*.5,t.y+(Math.random()-.5)*.5,t.z+(Math.random()-.5)*.5),i.mesh.scale.setScalar(.7+Math.random()*.5),i.mesh.material.color.setHex(s),i.mesh.visible=!0;const n=Math.random()*Math.PI*2,o=4+Math.random()*6;if(i.velocity.set(Math.cos(n)*o,3+Math.random()*5,Math.sin(n)*o),a++,a>=e)break}}update(t){for(const e of this.pool)if(e.active){if(e.life+=t,e.life>=e.maxLife){e.active=!1,e.mesh.visible=!1;continue}e.velocity.y+=-18*t,e.mesh.position.x+=e.velocity.x*t,e.mesh.position.y+=e.velocity.y*t,e.mesh.position.z+=e.velocity.z*t;const a=e.life/e.maxLife;e.mesh.scale.setScalar(Math.max(0,1-a))}}}class G{static matTurretBase=new R({color:988970,roughness:.5,metalness:.3});static matTurretChassis=new R({color:165063,roughness:.4,metalness:.2});static matTurretBarrel=new R({color:3718648,roughness:.3,metalness:.5});static matTurretCore=new k({color:3718648});static matGolemStone=new R({color:4674921,roughness:.7});static matGolemEye=new k({color:15680580});static matIslandGrass=new R({color:8843180,roughness:.8});static matIslandRock=new R({color:16117467,roughness:.85});static createIsland(t,s){const e=new E,a=new w(t,1.2,s),i=new h(a,this.matIslandGrass);i.position.y=-.6,i.receiveShadow=!0,e.add(i);const n=new w(t-2,4,s-2),o=new h(n,this.matIslandRock);return o.position.y=-3.2,o.receiveShadow=!0,e.add(o),e}static createTurret(){const t=new E,s=new V(2.4,2.8,.6,16),e=new h(s,this.matTurretBase);e.position.y=.3,e.castShadow=!0,t.add(e);const a=new E;a.position.y=.6;const i=new w(1.8,1.4,1.8),n=new h(i,this.matTurretChassis);n.position.y=.7,n.castShadow=!0,a.add(n);const o=new I(.35,12,12),r=new h(o,this.matTurretCore);r.position.set(0,.75,0),a.add(r);const l=new V(.18,.22,2.8,12);l.rotateX(Math.PI*.5);const d=new h(l,this.matTurretBarrel);d.position.set(-.55,.75,-1.2),d.castShadow=!0,a.add(d);const c=new h(l,this.matTurretBarrel);return c.position.set(.55,.75,-1.2),c.castShadow=!0,a.add(c),t.add(a),{group:t,swivel:a,barrelLeft:d,barrelRight:c}}static createGolem(){const t=new E,s=new w(1.8,2.2,1.2),e=new h(s,this.matGolemStone);e.position.y=2.4,e.castShadow=!0,t.add(e);const a=new w(1.2,1.2,1.2),i=new h(a,this.matGolemStone);i.position.set(0,3.8,.1),i.castShadow=!0,t.add(i);const n=new w(.25,.15,.1),o=new h(n,this.matGolemEye);o.position.set(-.35,3.8,.72),t.add(o);const r=new h(n,this.matGolemEye);r.position.set(.35,3.8,.72),t.add(r);const l=new w(.6,2,.6),d=new h(l,this.matGolemStone);d.position.set(-1.3,2.2,0),d.castShadow=!0,t.add(d);const c=new h(l,this.matGolemStone);c.position.set(1.3,2.2,0),c.castShadow=!0,t.add(c);const m=new w(.7,1.4,.7),v=new h(m,this.matGolemStone);v.position.set(-.55,.7,0),v.castShadow=!0,t.add(v);const u=new h(m,this.matGolemStone);return u.position.set(.55,.7,0),u.castShadow=!0,t.add(u),{group:t,leftArm:d,rightArm:c}}}class S{static isFirstFrameSent=!1;static isGameReadySent=!1;static isAudioMutedByPlatform=!1;static isYouTubePlayables(){return!!window.ytgame?.IN_PLAYABLES_ENV}static isEmbeddedMode(){const t=window;return!!(t.ytgame?.IN_PLAYABLES_ENV||t.YaGames||t.CrazyGames?.SDK||t.PokiSDK||new URLSearchParams(window.location.search).get("embed")==="1"||new URLSearchParams(window.location.search).get("yt")==="1")}static applyDualModeShell(){document.documentElement.classList.remove("yt-embed-mode"),document.body?.classList.remove("embed-fullscreen-mode")}static async initPlatform(){const t=window;if(t.ytgame?.IN_PLAYABLES_ENV)return;const s=window.location.hostname,e=window.location.search,a=s.includes("yandex")||e.includes("portal=yandex"),i=s.includes("crazygames")||e.includes("portal=crazygames");if(a&&!t.YaGames&&!document.getElementById("yandex-sdk-script")&&await new Promise(n=>{const o=document.createElement("script");o.id="yandex-sdk-script",o.src="https://yandex.ru/games/sdk/v2",o.onload=()=>n(),o.onerror=()=>n(),document.head.appendChild(o)}),i&&!t.CrazyGames&&!document.getElementById("crazygames-sdk-script")&&await new Promise(n=>{const o=document.createElement("script");o.id="crazygames-sdk-script",o.src="https://sdk.crazygames.com/crazygames-sdk-v3.js",o.onload=()=>n(),o.onerror=()=>n(),document.head.appendChild(o)}),t.YaGames&&!t.ysdk)try{const n=await t.YaGames.init();t.ysdk=n,n.features?.LoadingAPI?.ready?.()}catch{}}static gameplayStart(){const t=window;if(t.CrazyGames?.SDK?.game?.gameplayStart)try{t.CrazyGames.SDK.game.gameplayStart()}catch{}}static gameplayStop(){const t=window;if(t.CrazyGames?.SDK?.game?.gameplayStop)try{t.CrazyGames.SDK.game.gameplayStop()}catch{}}static signalFirstFrameReady(){if(this.isFirstFrameSent)return;this.isFirstFrameSent=!0;const t=window.ytgame;if(t?.game?.firstFrameReady)try{t.game.firstFrameReady()}catch{}}static signalGameReady(){if(this.isGameReadySent)return;this.isGameReadySent=!0;const t=window;if(t.ytgame?.game?.gameReady)try{t.ytgame.game.gameReady()}catch{}if(t.CrazyGames?.SDK?.game?.loadingStop)try{t.CrazyGames.SDK.game.loadingStop()}catch{}if(t.ysdk?.features?.LoadingAPI?.ready)try{t.ysdk.features.LoadingAPI.ready()}catch{}if(t.PokiSDK?.gameLoadingFinished)try{t.PokiSDK.gameLoadingFinished()}catch{}}static initLifecycle(t){const s=window;if(s.ytgame?.system)try{if(s.ytgame.system.onPause(()=>t.onPause()),s.ytgame.system.onResume(()=>t.onResume()),typeof s.ytgame.system.isAudioEnabled=="function"){const e=s.ytgame.system.isAudioEnabled();this.isAudioMutedByPlatform=!e,t.onAudioEnabledChange(e)}s.ytgame.system.onAudioEnabledChange(e=>{this.isAudioMutedByPlatform=!e,t.onAudioEnabledChange(e)})}catch{}document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"?t.onPause():t.onResume()})}static async loadData(t){const s=window;if(s.ytgame?.game?.loadData)try{const e=await s.ytgame.game.loadData();if(e)return{...t,...JSON.parse(e)}}catch{}try{const e=localStorage.getItem("voxel_smash_3d_save_data");if(e)return{...t,...JSON.parse(e)}}catch{}return t}static async saveData(t){const s=JSON.stringify(t),e=window;if(e.ytgame?.game?.saveData)try{await e.ytgame.game.saveData(s)}catch{}try{localStorage.setItem("voxel_smash_3d_save_data",s)}catch{}}static sendScore(t){const s=Math.floor(t),e=window;if(e.ytgame?.engagement?.sendScore)try{e.ytgame.engagement.sendScore({value:s})}catch{}}static isAudioMuted(){return this.isAudioMutedByPlatform}}class ht{ctx=null;isMuted=!1;isUnlocked=!1;constructor(){this.isMuted=S.isAudioMuted()}setMuted(t){this.isMuted=t}ensureContext(){if(this.isMuted)return null;if(!this.ctx){const t=window.AudioContext||window.webkitAudioContext;if(!t)return null;this.ctx=new t}return this.ctx.state==="suspended"&&this.isUnlocked&&this.ctx.resume().catch(()=>{}),this.ctx}unlock(){this.isUnlocked=!0,this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{})}playCannonShot(){const t=this.ensureContext();if(!t)return;const s=t.createOscillator(),e=t.createGain(),a=t.currentTime;s.type="triangle",s.frequency.setValueAtTime(280,a),s.frequency.exponentialRampToValueAtTime(70,a+.08),e.gain.setValueAtTime(.2,a),e.gain.exponentialRampToValueAtTime(.001,a+.09),s.connect(e),e.connect(t.destination),s.start(a),s.stop(a+.09)}playVoxelShatter(t=1){const s=this.ensureContext();if(!s)return;const e=s.createOscillator(),a=s.createGain(),i=s.currentTime;e.type="square";const n=420*t;e.frequency.setValueAtTime(n,i),e.frequency.exponentialRampToValueAtTime(140,i+.07),a.gain.setValueAtTime(.12,i),a.gain.exponentialRampToValueAtTime(.001,i+.08),e.connect(a),a.connect(s.destination),e.start(i),e.stop(i+.08)}playExplosion(){const t=this.ensureContext();if(!t)return;const s=t.createOscillator(),e=t.createGain(),a=t.currentTime;s.type="sawtooth",s.frequency.setValueAtTime(140,a),s.frequency.exponentialRampToValueAtTime(30,a+.35),e.gain.setValueAtTime(.35,a),e.gain.exponentialRampToValueAtTime(.001,a+.38),s.connect(e),e.connect(t.destination),s.start(a),s.stop(a+.38)}playLootCollect(){const t=this.ensureContext();if(!t)return;const s=t.createOscillator(),e=t.createGain(),a=t.currentTime;s.type="sine",s.frequency.setValueAtTime(680,a),s.frequency.exponentialRampToValueAtTime(1200,a+.06),e.gain.setValueAtTime(.15,a),e.gain.exponentialRampToValueAtTime(.001,a+.07),s.connect(e),e.connect(t.destination),s.start(a),s.stop(a+.07)}playWaveComplete(){const t=this.ensureContext();if(!t)return;const s=[440,554.37,659.25,880],e=t.currentTime;s.forEach((a,i)=>{const n=t.createOscillator(),o=t.createGain(),r=e+i*.08;n.type="triangle",n.frequency.setValueAtTime(a,r),o.gain.setValueAtTime(.2,r),o.gain.exponentialRampToValueAtTime(.001,r+.22),n.connect(o),o.connect(t.destination),n.start(r),n.stop(r+.22)})}}const L=1/60;class ut{isRunning=!1;animFrameId=0;accumulator=0;lastTime=0;onFixedUpdate=()=>{};onUpdate=()=>{};onRender=()=>{};constructor(t,s){t&&(this.onFixedUpdate=t),s&&(this.onRender=s)}setCallbacks(t,s,e){this.onFixedUpdate=t,this.onUpdate=s,this.onRender=()=>e()}start(){if(this.isRunning)return;this.isRunning=!0,this.lastTime=performance.now(),this.accumulator=0;const t=s=>{if(!this.isRunning)return;const e=(s-this.lastTime)*.001;this.lastTime=s;const a=Math.min(.05,Math.max(.001,e));for(this.accumulator=Math.min(this.accumulator+a,L*4);this.accumulator>=L;)this.onFixedUpdate(L),this.accumulator-=L;this.onUpdate(a);const i=this.accumulator/L;this.onRender(i,a),this.animFrameId=requestAnimationFrame(t)};this.animFrameId=requestAnimationFrame(t)}stop(){this.isRunning=!1,this.animFrameId&&(cancelAnimationFrame(this.animFrameId),this.animFrameId=0)}}const q=new f;class mt{isPointerDown=!1;isKeyFiring=!1;pointerPos=new J;raycaster=new Q;groundPlane=new tt(new f(0,1,0),0);aimWorldPos=new f(0,0,-10);constructor(t,s){this.setupEvents(t,s)}get isFiring(){return this.isPointerDown||this.isKeyFiring}get aimPosition(){return this.aimWorldPos}setupEvents(t,s){const e=(i,n)=>{const o=t.getBoundingClientRect();o.width<=0||o.height<=0||(this.pointerPos.x=(i-o.left)/o.width*2-1,this.pointerPos.y=-((n-o.top)/o.height)*2+1,this.raycaster.setFromCamera(this.pointerPos,s),this.raycaster.ray.intersectPlane(this.groundPlane,q)&&(this.aimWorldPos.copy(q),this.aimWorldPos.z>10&&(this.aimWorldPos.z=10)))};t.addEventListener("pointerdown",i=>{i.target.closest('button, .hud-interactive, .modal, .modal-overlay, .shell-sidebar, [data-hud-interactive="true"]')||(this.isPointerDown=!0,i.target.setPointerCapture?.(i.pointerId),e(i.clientX,i.clientY))}),window.addEventListener("pointermove",i=>{const n=t.getBoundingClientRect(),o=i.clientX>=n.left&&i.clientX<=n.right&&i.clientY>=n.top&&i.clientY<=n.bottom;(this.isPointerDown||i.pointerType==="mouse"&&o)&&e(i.clientX,i.clientY)});const a=()=>{this.isPointerDown=!1};window.addEventListener("pointerup",a),window.addEventListener("pointercancel",a),window.addEventListener("keydown",i=>{i.code==="ArrowLeft"||i.code==="KeyA"?(this.aimWorldPos.x=Math.max(-14,this.aimWorldPos.x-1.5),this.isKeyFiring=!0):i.code==="ArrowRight"||i.code==="KeyD"?(this.aimWorldPos.x=Math.min(14,this.aimWorldPos.x+1.5),this.isKeyFiring=!0):i.code==="Space"&&(this.isKeyFiring=!0)}),window.addEventListener("keyup",i=>{(i.code==="Space"||i.code==="ArrowLeft"||i.code==="KeyA"||i.code==="ArrowRight"||i.code==="KeyD")&&(this.isKeyFiring=!1)})}}class pt{container;hpFillEl;hpTextEl;waveEl;goldEl;blocksEl;modalContainer;needleAnimId=0;currentMultiplier=2;constructor(t){this.container=t,this.buildHudLayout()}buildHudLayout(){this.container.innerHTML=`
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
        .hud-pill {
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(56, 189, 248, 0.35);
          border-radius: 14px;
          padding: 8px 16px;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.3);
        }
        .hud-hp-bar {
          width: 120px;
          height: 12px;
          background: #334155;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .hud-hp-fill {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #10b981);
          transition: width 0.2s ease;
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
          border: 1.5px solid rgba(56, 189, 248, 0.4);
          border-radius: 16px;
          padding: 10px 14px;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          min-width: 86px;
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

        /* Modals */
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
          border: 2px solid #0284c7;
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
          background: linear-gradient(135deg, #0284c7, #38bdf8);
          color: #fff;
          border: none;
          padding: 14px 24px;
          border-radius: 30px;
          font-size: 15px;
          font-weight: 800;
          width: 100%;
          cursor: pointer;
          margin-bottom: 10px;
          box-shadow: 0 6px 20px rgba(2, 132, 199, 0.35);
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

        /* Multiplier Needle */
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
        .mult-zone.zone-2x { background: #0284c7; color: #fff; }
        .mult-zone.zone-3x { background: #f59e0b; color: #000; }
        .mult-zone.zone-5x { background: #ef4444; color: #fff; flex: 0.7; }
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
      </style>

      <div class="hud-wrapper">
        <!-- Top Stats -->
        <div class="hud-top-bar">
          <div class="hud-pill">
            <span style="font-size: 14px; font-weight: 800;">ÜS CANI</span>
            <div class="hud-hp-bar">
              <div id="hud-hp-fill" class="hud-hp-fill"></div>
            </div>
            <span id="hud-hp-text" style="font-size: 12px; font-weight: 800;">100/100</span>
          </div>

          <div class="hud-pill">
            <span style="color: #38bdf8; font-weight: 900; font-size: 15px;" id="hud-wave">DALGA 1</span>
          </div>

          <div class="hud-pill">
            <span style="font-size: 16px;">💰</span>
            <span id="hud-gold" style="font-size: 17px; font-weight: 900; color: #f59e0b;">0</span>
          </div>

          <div class="hud-pill">
            <span style="font-size: 15px;">🧱</span>
            <span id="hud-blocks" style="font-size: 15px; font-weight: 800;">0 Blok</span>
          </div>
        </div>

        <!-- Bottom Boosters -->
        <div class="hud-bottom-bar">
          <button id="btn-booster-tnt" class="hud-booster-btn" type="button" data-hud-interactive="true">
            <span class="hud-booster-icon">💣</span>
            <span class="hud-booster-name">TNT YAĞMURU</span>
            <span class="hud-booster-badge">REKLAM</span>
          </button>

          <button id="btn-booster-cannon" class="hud-booster-btn" type="button" data-hud-interactive="true">
            <span class="hud-booster-icon">⚡</span>
            <span class="hud-booster-name">ÇİFTE NAMLU</span>
            <span class="hud-booster-badge">REKLAM</span>
          </button>

          <button id="btn-booster-magnet" class="hud-booster-btn" type="button" data-hud-interactive="true">
            <span class="hud-booster-icon">🧲</span>
            <span class="hud-booster-name">ORE VAKUMU</span>
            <span class="hud-booster-badge">REKLAM</span>
          </button>
        </div>
      </div>

      <div id="hud-modal-container"></div>
    `,this.hpFillEl=this.container.querySelector("#hud-hp-fill"),this.hpTextEl=this.container.querySelector("#hud-hp-text"),this.waveEl=this.container.querySelector("#hud-wave"),this.goldEl=this.container.querySelector("#hud-gold"),this.blocksEl=this.container.querySelector("#hud-blocks"),this.modalContainer=this.container.querySelector("#hud-modal-container")}updateStats(t,s,e,a,i){const n=Math.max(0,Math.min(100,t/s*100));this.hpFillEl.style.width=`${n}%`,n<30?this.hpFillEl.style.background="#ef4444":n<60?this.hpFillEl.style.background="#f59e0b":this.hpFillEl.style.background="linear-gradient(90deg, #22c55e, #10b981)",this.hpTextEl.textContent=`${Math.floor(t)}/${s}`,this.waveEl.textContent=`DALGA ${e}`,this.goldEl.textContent=String(a),this.blocksEl.textContent=`${i} Blok`}setBoosterCallbacks(t){this.container.querySelector("#btn-booster-tnt").addEventListener("click",()=>t.onTnt()),this.container.querySelector("#btn-booster-cannon").addEventListener("click",()=>t.onDoubleCannon()),this.container.querySelector("#btn-booster-magnet").addEventListener("click",()=>t.onMagnet())}showReviveModal(t){this.modalContainer.innerHTML=`
      <div class="hud-modal-overlay">
        <div class="hud-modal-card">
          <div style="font-size: 38px; margin-bottom: 8px;">💥</div>
          <h2 class="hud-modal-title">ÜS KUŞATILDI!</h2>
          <p class="hud-modal-subtitle">Düşmanlar savunma hattını aştı! Reklam izleyerek nükleer TNT patlat, düşmanları geri püskürt ve canını doldur!</p>
          <button id="btn-modal-revive" class="hud-btn-primary" type="button" data-hud-interactive="true">
            🎬 REKLAM İZLE & SAVUNMAYI KURTAR
          </button>
          <button id="btn-modal-giveup" class="hud-btn-secondary" type="button" data-hud-interactive="true">
            Baştan Başla
          </button>
        </div>
      </div>
    `,this.container.querySelector("#btn-modal-revive").addEventListener("click",()=>{this.closeModal(),t.onRevive()}),this.container.querySelector("#btn-modal-giveup").addEventListener("click",()=>{this.closeModal(),t.onGiveUp()})}showVictoryModal(t,s,e){this.modalContainer.innerHTML=`
      <div class="hud-modal-overlay">
        <div class="hud-modal-card">
          <div style="font-size: 42px; margin-bottom: 4px;">🏆</div>
          <h2 class="hud-modal-title">DALGA ${t} TAMAMLANDI!</h2>
          <p class="hud-modal-subtitle">Voksel kalesi başarıyla yıkıldı ve ganimet toplandı!</p>

          <div style="font-size: 14px; color: #cbd5e1; margin-bottom: 6px;">
            Kazanılan Ödül: <strong style="color: #fbbf24; font-size: 18px;">+${s} Altın</strong>
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
            Normal Ödülü Al (${s} Altın)
          </button>
        </div>
      </div>
    `;const a=this.container.querySelector("#mult-needle"),i=this.container.querySelector("#mult-label");let n=0,o=1;const r=()=>{n+=o*1.8,n>=96?(n=96,o=-1):n<=2&&(n=2,o=1),a&&(a.style.left=`${n}%`),n>=40&&n<=60?this.currentMultiplier=5:n>=20&&n<40||n>60&&n<=80?this.currentMultiplier=3:this.currentMultiplier=2,i&&(i.textContent=`${this.currentMultiplier}x`),this.needleAnimId=requestAnimationFrame(r)};this.needleAnimId=requestAnimationFrame(r),this.container.querySelector("#btn-claim-multiplier").addEventListener("click",()=>{cancelAnimationFrame(this.needleAnimId),this.closeModal(),e.onClaimMultiplier(this.currentMultiplier)}),this.container.querySelector("#btn-claim-base").addEventListener("click",()=>{cancelAnimationFrame(this.needleAnimId),this.closeModal(),e.onClaimBase()})}closeModal(){this.needleAnimId&&cancelAnimationFrame(this.needleAnimId),this.modalContainer.innerHTML=""}}const ft={"offroad-expedition-3d":{themeColor:"#d97706",accentGradient:"linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",glowRgba:"rgba(217, 119, 6, 0.34)",tintBg:"rgba(254, 243, 199, 0.88)"},"rally-horizon-3d":{themeColor:"#0284c7",accentGradient:"linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)",glowRgba:"rgba(2, 132, 199, 0.34)",tintBg:"rgba(224, 242, 254, 0.88)"},"smash-karts-brawl-3d":{themeColor:"#ef4444",accentGradient:"linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)",glowRgba:"rgba(239, 68, 68, 0.34)",tintBg:"rgba(254, 226, 226, 0.88)"},"bridge-rush-io-3d":{themeColor:"#2563eb",accentGradient:"linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)",glowRgba:"rgba(37, 99, 235, 0.34)",tintBg:"rgba(224, 242, 254, 0.88)"},"stumble-knockout-royale-3d":{themeColor:"#ec4899",accentGradient:"linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",glowRgba:"rgba(236, 72, 153, 0.34)",tintBg:"rgba(252, 231, 243, 0.88)"},"bumper-smash-io-3d":{themeColor:"#f97316",accentGradient:"linear-gradient(135deg, #f97316 0%, #ea580c 100%)",glowRgba:"rgba(249, 115, 22, 0.34)",tintBg:"rgba(255, 237, 213, 0.88)"},"ragdoll-archers-duel-3d":{themeColor:"#2563eb",accentGradient:"linear-gradient(135deg, #2563eb 0%, #f59e0b 100%)",glowRgba:"rgba(37, 99, 235, 0.34)",tintBg:"rgba(219, 234, 254, 0.88)"},"physics-drop-merge-3d":{themeColor:"#22c55e",accentGradient:"linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",glowRgba:"rgba(34, 197, 94, 0.34)",tintBg:"rgba(220, 252, 231, 0.88)"},"voxel-craft-smash-3d":{themeColor:"#f97316",accentGradient:"linear-gradient(135deg, #f97316 0%, #eab308 100%)",glowRgba:"rgba(249, 115, 22, 0.34)",tintBg:"rgba(254, 243, 199, 0.88)"},"hole-city-io-3d":{themeColor:"#06b6d4",accentGradient:"linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",glowRgba:"rgba(6, 182, 212, 0.34)",tintBg:"rgba(207, 250, 254, 0.88)"},"hexa-sort-3d":{themeColor:"#f59e0b",accentGradient:"linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",glowRgba:"rgba(245, 158, 11, 0.34)",tintBg:"rgba(254, 243, 199, 0.88)"},"cyber-arrow-3d":{themeColor:"#6366f1",accentGradient:"linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)",glowRgba:"rgba(99, 102, 241, 0.34)",tintBg:"rgba(224, 231, 255, 0.88)"}},gt={themeColor:"#2563eb",accentGradient:"linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)",glowRgba:"rgba(37, 99, 235, 0.34)",tintBg:"rgba(224, 242, 254, 0.88)"};function yt(){return typeof document<"u"&&(document.documentElement.classList.remove("yt-embed-mode"),document.body?.classList.remove("embed-fullscreen-mode")),!1}class bt{options;isMenuOpen=!0;difficulty="normal";hasStartedOnce=!1;difficultyChangedWhileOpen=!1;stageEl=null;restartBtn=null;menuBtn=null;stagePauseBtn=null;startMenuEl=null;otherGamesList=null;resizeObserver=null;lastRestartTimestamp=0;lastObservedWidth=0;lastObservedHeight=0;onArcadeRestartBound=()=>this.triggerRestart();nativeRaf=null;nativeCancelRaf=null;parkedRafCallbacks=new Map;nextParkedRafId=9e5;bootFramesRemaining=2;onKeyDownBound=t=>{t.code==="Escape"&&(t.preventDefault(),this.isMenuOpen?this.hasStartedOnce&&this.hideStartMenuAndPlay():this.showStartMenu())};constructor(t){this.options=t,yt(),this.ensureCanonicalShellDom(),this.restartBtn=document.getElementById("shell-restart-btn"),this.menuBtn=document.getElementById("shell-menu-btn"),this.otherGamesList=document.getElementById("shell-other-games-list"),this.init()}getDifficultyMultiplier(){return this.difficulty==="easy"?.78:this.difficulty==="hard"?1.28:1}ensureCanonicalShellDom(){if(typeof document>"u")return;const t=document.getElementById("app")||document.getElementById("game-container"),s=document.getElementById("hud")||document.getElementById("hud-root");if(!t)return;t.classList.add("game-canvas-container"),s&&s.classList.add("game-hud-overlay");let e=document.getElementById("arcade-shell");e||(e=document.createElement("div"),e.id="arcade-shell",document.body.prepend(e)),e.className="arcade-shell";let a=document.getElementById("shell-stage")||e.querySelector(".shell-stage");a||(a=document.createElement("main"),a.appendChild(t),s&&a.appendChild(s)),a.id="shell-stage",a.className="shell-stage is-menu-locked",this.stageEl=a,this.applyThemePalette(ft[this.options.currentGameId]||gt),document.getElementById("shell-fullscreen-btn")?.remove(),document.getElementById("fullscreen-ad-banner")?.remove();let i=e.querySelector(".shell-sidebar-left");i||(i=document.createElement("aside"),e.prepend(i)),i.className="shell-sidebar shell-sidebar-left",i.innerHTML=`
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
    `;const i=c=>{c.stopPropagation()};s.addEventListener("pointerdown",i),s.addEventListener("pointermove",i),s.addEventListener("pointerup",i),s.addEventListener("mousedown",i),s.addEventListener("touchstart",i,{passive:!0});const n=s.querySelectorAll(".shell-diff-btn");n.forEach(c=>{c.addEventListener("click",m=>{m.stopPropagation();const v=c.getAttribute("data-difficulty")||"normal";v!==this.difficulty&&(this.difficulty=v,this.difficultyChangedWhileOpen=!0),n.forEach(M=>M.classList.toggle("is-active",M===c));const u=this.getDifficultyMultiplier();this.options.onDifficultyChange?.(this.difficulty,u),window.dispatchEvent(new CustomEvent("arcade:difficulty",{detail:{difficulty:this.difficulty,multiplier:u}}))})});const o=s.querySelector("#shell-menu-sound-btn"),r=()=>{if(!o)return;const c=this.findNativeSoundButton();if(c){o.style.display="inline-flex";const m=c.textContent?.trim()||"";o.textContent=m.includes("🔇")?"🔇":"🔊"}else o.style.display="none"};setTimeout(r,60),o&&o.addEventListener("click",c=>{c.stopPropagation();const m=this.findNativeSoundButton();m&&(m.click(),r())});const l=s.querySelector("#shell-menu-reset-btn");l&&l.addEventListener("click",c=>{c.stopPropagation(),this.difficultyChangedWhileOpen=!0,this.hideStartMenuAndPlay()});const d=s.querySelector("#shell-start-play-btn");d&&d.addEventListener("click",c=>{c.stopPropagation(),this.hideStartMenuAndPlay()}),this.startMenuEl=s}showStartMenu(){if(!this.startMenuEl)return;this.isMenuOpen=!0,this.difficultyChangedWhileOpen=!1,this.stageEl?.classList.add("is-menu-locked"),this.startMenuEl.classList.remove("is-hidden");const t=this.startMenuEl.querySelector("#shell-menu-reset-btn");t&&(t.style.display=this.hasStartedOnce?"inline-flex":"none");const s=this.startMenuEl.querySelector("#shell-menu-sound-btn"),e=this.findNativeSoundButton();if(s&&e){s.style.display="inline-flex";const a=e.textContent?.trim()||"";s.textContent=a.includes("🔇")?"🔇":"🔊"}}hideStartMenuAndPlay(){if(!this.startMenuEl)return;const t=this.isMenuOpen||!this.startMenuEl.classList.contains("is-hidden");this.isMenuOpen=!1,this.stageEl?.classList.remove("is-menu-locked"),this.startMenuEl.classList.add("is-hidden"),t&&(!this.hasStartedOnce||this.difficultyChangedWhileOpen)&&(this.hasStartedOnce=!0,this.difficultyChangedWhileOpen=!1,this.triggerRestart()),this.flushParkedAnimationFrames()}installMenuRafGate(){typeof window>"u"||this.nativeRaf||(this.nativeRaf=window.requestAnimationFrame.bind(window),this.nativeCancelRaf=window.cancelAnimationFrame.bind(window),window.requestAnimationFrame=t=>{if(this.isMenuOpen){if(this.bootFramesRemaining>0)return this.bootFramesRemaining--,this.nativeRaf(t);const s=++this.nextParkedRafId;return this.parkedRafCallbacks.set(s,t),s}return this.nativeRaf(t)},window.cancelAnimationFrame=t=>{if(this.parkedRafCallbacks.has(t)){this.parkedRafCallbacks.delete(t);return}this.nativeCancelRaf?.(t)})}flushParkedAnimationFrames(){if(!this.nativeRaf||this.parkedRafCallbacks.size===0)return;const t=Array.from(this.parkedRafCallbacks.values());this.parkedRafCallbacks.clear();for(let s=0;s<t.length;s++)this.nativeRaf(t[s])}init(){this.installMenuRafGate(),window.addEventListener("arcade:restart",this.onArcadeRestartBound),window.addEventListener("keydown",this.onKeyDownBound),this.restartBtn&&this.restartBtn.addEventListener("click",()=>{this.isMenuOpen=!1,this.hasStartedOnce=!0,this.difficultyChangedWhileOpen=!1,this.stageEl?.classList.remove("is-menu-locked"),this.startMenuEl?.classList.add("is-hidden"),window.dispatchEvent(new CustomEvent("arcade:restart")),this.flushParkedAnimationFrames()}),this.menuBtn&&this.menuBtn.addEventListener("click",()=>{this.showStartMenu()}),this.setupResizeObserver(),this.loadOtherGames()}triggerRestart(){const t=performance.now();t-this.lastRestartTimestamp<80||(this.lastRestartTimestamp=t,this.options.onRestart())}setupResizeObserver(){const t=document.getElementById("app")||document.getElementById("game-container")||document.getElementById("shell-stage");!t||typeof ResizeObserver>"u"||(this.resizeObserver=new ResizeObserver(s=>{for(let e=0;e<s.length;e++){const a=s[e].contentRect,i=Math.round(a.width),n=Math.round(a.height);i>0&&n>0&&(i!==this.lastObservedWidth||n!==this.lastObservedHeight)&&(this.lastObservedWidth=i,this.lastObservedHeight=n,this.options.onResize&&this.options.onResize(i,n),window.dispatchEvent(new Event("resize")))}}),this.resizeObserver.observe(t))}async loadOtherGames(){if(this.otherGamesList)try{const t=await fetch("../games.json");if(!t.ok)return;const s=await t.json(),e=s.find(i=>i.id===this.options.currentGameId);e&&e.themeColor&&e.accentGradient&&this.stageEl&&(this.stageEl.style.setProperty("--menu-theme-color",e.themeColor),this.stageEl.style.setProperty("--menu-accent-gradient",e.accentGradient));const a=s.filter(i=>i.id!==this.options.currentGameId&&i.active!==!1);this.otherGamesList.innerHTML=a.map(i=>`
        <a href="../${i.id}/" class="other-game-item shell-game-card">
          <img src="../${i.id}/icon.svg" class="other-game-icon" alt="" onerror="this.style.display='none'" />
          <div class="other-game-meta game-info">
            <span class="other-game-title game-title">${i.title}</span>
            <span class="other-game-tag game-tag">${i.tags?.[0]||"3D HTML5"}</span>
          </div>
        </a>
      `).join("")}catch{}}dispose(){this.nativeRaf&&typeof window<"u"&&(window.requestAnimationFrame=this.nativeRaf,this.nativeCancelRaf&&(window.cancelAnimationFrame=this.nativeCancelRaf),this.parkedRafCallbacks.clear()),window.removeEventListener("arcade:restart",this.onArcadeRestartBound),window.removeEventListener("keydown",this.onKeyDownBound),this.resizeObserver?.disconnect(),this.stagePauseBtn}}class D{static instance=null;lastInterstitialTime=0;minInterstitialIntervalMs=9e4;availabilityListeners=[];isShowingAd=!1;initialized=!1;static get(){return this.instance||(this.instance=new D),this.instance}async initialize(){this.initialized||(this.initialized=!0,this.lastInterstitialTime=Date.now(),typeof window<"u"&&(window.addEventListener("online",()=>this.notifyAvailability(this.isRewardedReady())),window.addEventListener("offline",()=>this.notifyAvailability(!1)),this.syncDomAdState(this.isRewardedReady())))}onAvailabilityChange(t){this.availabilityListeners.push(t)}notifyAvailability(t){this.syncDomAdState(t);for(let s=0;s<this.availabilityListeners.length;s++)try{this.availabilityListeners[s](t)}catch{}}syncDomAdState(t=this.isRewardedReady()){if(typeof document>"u"||!document.body)return;document.body.classList.toggle("ads-unavailable",!t);const s=document.querySelectorAll(".booster-ad-badge, .hud-booster-badge");for(let e=0;e<s.length;e++){const a=s[e];a.textContent=t?"🎬 FREE":"🎬 REKLAM YOK"}}isRewardedReady(){if(typeof navigator<"u"&&!navigator.onLine)return!1;const t=window;return t.ytgame?.IN_PLAYABLES_ENV?!!t.ytgame?.ads?.requestRewardedAd:!0}async showInterstitial(t="level_transition"){if(this.isShowingAd||!this.isRewardedReady())return!1;const s=Date.now();if(s-this.lastInterstitialTime<this.minInterstitialIntervalMs)return!1;this.lastInterstitialTime=s,this.isShowingAd=!0;try{const e=window;if(e.ytgame?.IN_PLAYABLES_ENV&&e.ytgame?.ads?.requestInterstitialAd)try{return await e.ytgame.ads.requestInterstitialAd(),!0}catch{return!1}return e.CrazyGames?.SDK?.ad?.requestAd?await new Promise(a=>{e.CrazyGames.SDK.ad.requestAd("midgame",{adFinished:()=>a(!0),adError:()=>a(!1)})}):e.ysdk?.adv?.showFullscreenAdv?await new Promise(a=>{e.ysdk.adv.showFullscreenAdv({callbacks:{onClose:()=>a(!0),onError:()=>a(!1)}})}):e.PokiSDK?.commercialBreak?await new Promise(a=>{e.PokiSDK.commercialBreak().then(()=>a(!0)).catch(()=>a(!1))}):await this.showMockAdModal(`SPONSOR BREAK [${t.toUpperCase()}]`,2)}finally{this.isShowingAd=!1}}async showRewarded(t="rewarded_booster"){if(this.isShowingAd||!this.isRewardedReady())return!1;this.isShowingAd=!0;try{const s=window;if(s.ytgame?.IN_PLAYABLES_ENV&&s.ytgame?.ads?.requestRewardedAd)try{return await s.ytgame.ads.requestRewardedAd(),this.lastInterstitialTime=Date.now(),!0}catch{return!1}return s.CrazyGames?.SDK?.ad?.requestAd?await new Promise(e=>{s.CrazyGames.SDK.ad.requestAd("rewarded",{adFinished:()=>{this.lastInterstitialTime=Date.now(),e(!0)},adError:()=>e(!1)})}):s.ysdk?.adv?.showRewardedVideo?await new Promise(e=>{let a=!1;s.ysdk.adv.showRewardedVideo({callbacks:{onRewarded:()=>{a=!0,this.lastInterstitialTime=Date.now()},onClose:()=>e(a),onError:()=>e(!1)}})}):s.PokiSDK?.rewardedBreak?await new Promise(e=>{s.PokiSDK.rewardedBreak().then(a=>{a&&(this.lastInterstitialTime=Date.now()),e(!!a)}).catch(()=>e(!1))}):await this.showMockAdModal(`ÖDÜLLÜ REKLAM // ${t.toUpperCase()}`,2)}finally{this.isShowingAd=!1}}showMockAdModal(t,s){return new Promise(e=>{const a=document.createElement("div");a.className="mock-ad-modal modal-overlay",a.setAttribute("data-hud-interactive","true"),a.style.cssText=`
        position: absolute; inset: 0; background: rgba(3, 7, 18, 0.95);
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        z-index: 100000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #fff; backdrop-filter: blur(8px); pointer-events: auto;
      `;const i=c=>c.stopPropagation();a.addEventListener("pointerdown",i),a.addEventListener("mousedown",i),a.addEventListener("touchstart",i);let n=s;a.innerHTML=`
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
      `,(document.getElementById("shell-stage")||document.body).appendChild(a);const r=a.querySelector("#mock-ad-countdown"),l=a.querySelector("#mock-ad-claim-btn"),d=setInterval(()=>{n--,n>0?r.textContent=`${n}s`:(clearInterval(d),r.textContent="TAMAMLANDI! ✓",r.style.color="#10b981",r.style.fontSize="22px",l.disabled=!1,l.style.background="linear-gradient(135deg, #10b981, #059669)",l.style.color="#ffffff",l.style.cursor="pointer",l.textContent="ÖDÜLÜ AL & DEVAM ET")},1e3);l.addEventListener("click",c=>{c.stopPropagation(),!(n>0)&&(clearInterval(d),a.remove(),this.lastInterstitialTime=Date.now(),e(!0))})})}}const g={arenaWidth:32,arenaDepth:56,turretBaseHp:100,baseFireIntervalSec:.22,projectileSpeed:48,projectileRadius:.28,boosterDoubleCannonSec:20,tntBarrageCount:5,tntExplosionRadius:3.8,blockTypes:{wood:{type:"wood",maxHp:1,color:"#92400e",goldReward:5},stone:{type:"stone",maxHp:2,color:"#64748b",goldReward:10},ore:{type:"ore",maxHp:3,color:"#f59e0b",goldReward:30},tnt:{type:"tnt",maxHp:1,color:"#ef4444",goldReward:15,isTnt:!0}},totalWaves:5,coinsPerWaveBase:60};class wt{group;swivel;barrelLeft;barrelRight;hp=g.turretBaseHp;maxHp=g.turretBaseHp;doubleCannonTimer=0;fireCooldown=0;alternateBarrel=!1;recoilLeft=0;recoilRight=0;constructor(t=0,s=16){const e=G.createTurret();this.group=e.group,this.swivel=e.swivel,this.barrelLeft=e.barrelLeft,this.barrelRight=e.barrelRight,this.group.position.set(t,0,s)}get position(){return this.group.position}aimAt(t){const s=t.x-this.group.position.x,e=t.z-this.group.position.z,a=Math.atan2(s,-e);this.swivel.rotation.y=et.lerp(this.swivel.rotation.y,a,.25)}canFire(){return this.fireCooldown<=0}fire(){let t=g.baseFireIntervalSec;this.doubleCannonTimer>0&&(t*=.5),this.fireCooldown=t;const s=this.swivel.rotation.y,e=new f(Math.sin(s),0,-Math.cos(s)).normalize(),a=[];if(this.doubleCannonTimer>0)a.push({origin:this.getBarrelTipWorldPos(-.55),direction:e.clone()}),a.push({origin:this.getBarrelTipWorldPos(.55),direction:e.clone()}),this.recoilLeft=.4,this.recoilRight=.4;else{this.alternateBarrel=!this.alternateBarrel;const i=this.alternateBarrel?.55:-.55;a.push({origin:this.getBarrelTipWorldPos(i),direction:e}),this.alternateBarrel?this.recoilRight=.4:this.recoilLeft=.4}return a}getBarrelTipWorldPos(t){const s=new f(t,1.35,-2.4);return s.applyAxisAngle(new f(0,1,0),this.swivel.rotation.y),s.add(this.group.position),s}update(t){this.fireCooldown>0&&(this.fireCooldown=Math.max(0,this.fireCooldown-t)),this.doubleCannonTimer>0&&(this.doubleCannonTimer=Math.max(0,this.doubleCannonTimer-t)),this.recoilLeft>0&&(this.recoilLeft=Math.max(0,this.recoilLeft-t*2.5),this.barrelLeft.position.z=-1.2+this.recoilLeft),this.recoilRight>0&&(this.recoilRight=Math.max(0,this.recoilRight-t*2.5),this.barrelRight.position.z=-1.2+this.recoilRight)}takeDamage(t){this.hp=Math.max(0,this.hp-t)}reset(){this.hp=this.maxHp,this.doubleCannonTimer=0,this.fireCooldown=0,this.swivel.rotation.y=0}}class vt{group=new E;instancedMesh;maxBlocks=1200;blocks=[];dummy=new st;onBlockShattered=null;onTntDetonated=null;constructor(){const t=new w(1,1,1),s=new R({roughness:.6,metalness:.1});this.instancedMesh=new it(t,s,this.maxBlocks),this.instancedMesh.castShadow=!0,this.instancedMesh.receiveShadow=!0,this.instancedMesh.instanceMatrix.setUsage(at),this.group.add(this.instancedMesh)}get activeBlockCount(){return this.blocks.filter(t=>t.active).length}generateWaveFortress(t){this.blocks=[];let s=0;for(let a=0;a<this.maxBlocks;a++)this.dummy.position.set(0,-999,0),this.dummy.scale.set(0,0,0),this.dummy.updateMatrix(),this.instancedMesh.setMatrixAt(a,this.dummy.matrix);const e=-12;if(t===1)for(let a=0;a<6;a++)for(let i=-3;i<=3;i++)for(let n=-3;n<=3;n++){if(Math.abs(i)<2&&Math.abs(n)<2&&a<5)continue;const l=i===0&&n===0&&a===1||i===2&&n===-2&&a===2?"tnt":a===3&&(i===-2||n===2)?"ore":a<2?"stone":"wood",d=g.blockTypes[l];if(this.createBlock(s++,i,a+.5,e+n,d),s>=this.maxBlocks)break}else if(t===2)for(let a=0;a<7;a++){for(let i=-8;i<=-4;i++)for(let n=-2;n<=2;n++){const r=a===2&&i===-6&&n===0?"tnt":a<3?"stone":"wood";this.createBlock(s++,i,a+.5,e+n,g.blockTypes[r])}for(let i=4;i<=8;i++)for(let n=-2;n<=2;n++){const r=a===2&&i===6&&n===0?"tnt":a<3?"stone":"wood";this.createBlock(s++,i,a+.5,e+n,g.blockTypes[r])}if(a===4||a===5)for(let i=-3;i<=3;i++)for(let n=-1;n<=1;n++){const r=i===0?"ore":"stone";this.createBlock(s++,i,a+.5,e+n,g.blockTypes[r])}}else for(let a=0;a<8;a++){const i=Math.max(2,6-Math.floor(a/2));for(let n=-i;n<=i;n++)for(let o=-i;o<=i;o++){if(Math.abs(n)<i-1&&Math.abs(o)<i-1&&a<7)continue;const r=n%3===0&&o%3===0&&a===2,l=(n+o+a)%5===0,d=r?"tnt":l?"ore":a<3?"stone":"wood";if(this.createBlock(s++,n,a+.5,e+o,g.blockTypes[d]),s>=this.maxBlocks)break}}this.instancedMesh.instanceMatrix.needsUpdate=!0,this.instancedMesh.instanceColor&&(this.instancedMesh.instanceColor.needsUpdate=!0)}createBlock(t,s,e,a,i){t>=this.maxBlocks||(this.dummy.position.set(s,e,a),this.dummy.scale.set(1,1,1),this.dummy.updateMatrix(),this.instancedMesh.setMatrixAt(t,this.dummy.matrix),this.instancedMesh.setColorAt(t,new B(i.color)),this.blocks.push({id:t,x:s,y:e,z:a,hp:i.maxHp,config:i,active:!0}))}checkProjectileHit(t,s,e){for(const a of this.blocks){if(!a.active)continue;const i=Math.abs(t.x-a.x),n=Math.abs(t.y-a.y),o=Math.abs(t.z-a.z);if(i<.5+s&&n<.5+s&&o<.5+s)return this.damageBlock(a,e),!0}return!1}damageBlock(t,s){if(t.hp-=s,t.hp<=0){t.active=!1,this.dummy.position.set(t.x,-999,t.z),this.dummy.scale.set(0,0,0),this.dummy.updateMatrix(),this.instancedMesh.setMatrixAt(t.id,this.dummy.matrix),this.instancedMesh.instanceMatrix.needsUpdate=!0;const e=new f(t.x,t.y,t.z);this.onBlockShattered&&this.onBlockShattered(t,e),t.config.isTnt&&this.triggerTntExplosion(e)}}triggerTntExplosion(t){this.onTntDetonated&&this.onTntDetonated(t);const s=g.tntExplosionRadius;for(const e of this.blocks){if(!e.active)continue;Math.hypot(e.x-t.x,e.y-t.y,e.z-t.z)<=s&&this.damageBlock(e,5)}}}class xt{group=new E;pool=[];maxProjectiles=60;constructor(t){const s=new I(g.projectileRadius,8,8),e=new k({color:3718648});for(let a=0;a<this.maxProjectiles;a++){const i=new h(s,e);i.visible=!1,this.group.add(i),this.pool.push({mesh:i,velocity:new f,active:!1,life:0,bounces:0})}t.add(this.group)}spawn(t,s,e=!1){for(const a of this.pool)if(!a.active){a.active=!0,a.life=0,a.bounces=0,a.mesh.position.copy(t),a.mesh.scale.setScalar(e?1.6:1),a.mesh.material.color.setHex(e?16096779:3718648),a.velocity.copy(s).multiplyScalar(g.projectileSpeed),a.mesh.visible=!0;break}}update(t,s){for(const e of this.pool){if(!e.active)continue;if(e.life+=t,e.life>1.8){e.active=!1,e.mesh.visible=!1;continue}e.mesh.position.x+=e.velocity.x*t,e.mesh.position.y+=e.velocity.y*t,e.mesh.position.z+=e.velocity.z*t,s(e.mesh.position,g.projectileRadius)&&(e.bounces<2?(e.bounces++,e.velocity.x*=-.75,e.velocity.z*=-.75,e.mesh.position.x+=e.velocity.x*t*2):(e.active=!1,e.mesh.visible=!1))}}clearAll(){for(const t of this.pool)t.active=!1,t.mesh.visible=!1}}const St=new f(1,1,1);class Mt{group;leftArm;rightArm;hp;maxHp;isAlive=!0;speed;freezeTimer=0;walkTime=0;constructor(t,s,e=10,a=2.2){const i=G.createGolem();this.group=i.group,this.leftArm=i.leftArm,this.rightArm=i.rightArm,this.group.position.set(t,0,s),this.hp=e,this.maxHp=e,this.speed=a}get position(){return this.group.position}takeDamage(t){return this.hp-=t,this.group.scale.set(1.15,.9,1.15),this.hp<=0?(this.isAlive=!1,this.group.visible=!1,!0):!1}freeze(t=3){this.freezeTimer=t}update(t,s){return this.isAlive?this.freezeTimer>0?(this.freezeTimer=Math.max(0,this.freezeTimer-t),!1):(this.group.position.z+=this.speed*t,this.walkTime+=t*5,this.leftArm.rotation.x=Math.sin(this.walkTime)*.45,this.rightArm.rotation.x=-Math.sin(this.walkTime)*.45,this.group.scale.lerp(St,t*8),this.group.position.z>=s-1.5):!1}reset(t,s,e){this.group.position.set(t,0,s),this.hp=e,this.maxHp=e,this.isAlive=!0,this.group.visible=!0,this.group.scale.set(1,1,1)}}const T=new f;class Rt{group=new E;pool=[];maxCubes=100;constructor(t){const s=new w(.45,.45,.45),e=new R({color:16096779,metalness:.6,roughness:.3});for(let a=0;a<this.maxCubes;a++){const i=new h(s,e);i.visible=!1,this.group.add(i),this.pool.push({mesh:i,velocity:new f,goldValue:10,active:!1,isVacuuming:!1,vacuumSpeed:14})}t.add(this.group)}spawn(t,s,e=2){let a=0;for(const i of this.pool)if(!i.active){i.active=!0,i.isVacuuming=!1,i.goldValue=s,i.mesh.position.set(t.x+(Math.random()-.5)*.4,t.y+.2+Math.random()*.4,t.z+(Math.random()-.5)*.4),i.mesh.visible=!0;const n=Math.random()*Math.PI*2,o=2.5+Math.random()*3.5;if(i.velocity.set(Math.cos(n)*o,4+Math.random()*4,Math.sin(n)*o),setTimeout(()=>{i.active&&(i.isVacuuming=!0)},450+Math.random()*200),a++,a>=e)break}}triggerGlobalVacuum(){for(const t of this.pool)t.active&&(t.isVacuuming=!0,t.vacuumSpeed=28,t.goldValue*=2)}update(t,s,e){for(const i of this.pool)if(i.active)if(i.isVacuuming){if(T.subVectors(s,i.mesh.position),T.length()<1.4){i.active=!1,i.mesh.visible=!1,e(i.goldValue);continue}T.normalize().multiplyScalar(i.vacuumSpeed*t),i.mesh.position.add(T),i.mesh.rotation.x+=t*10,i.mesh.rotation.y+=t*8}else i.velocity.y+=-16*t,i.mesh.position.addScaledVector(i.velocity,t),i.mesh.position.y<.25&&(i.mesh.position.y=.25,i.velocity.y=-i.velocity.y*.4,i.velocity.x*=.8,i.velocity.z*=.8),i.mesh.rotation.x+=t*4}clearAll(){for(const t of this.pool)t.active=!1,t.mesh.visible=!1}}class Et{coins=0;highScore=0;highestWave=1;turretLevel=1;async init(){const t=await S.loadData({coins:0,highScore:0,highestWave:1,turretLevel:1,unlockedSkins:["default"]});this.coins=t.coins,this.highScore=t.highScore,this.highestWave=t.highestWave||1,this.turretLevel=t.turretLevel||1}addCoins(t){this.coins+=t,this.persist()}recordWaveComplete(t,s){t>this.highestWave&&(this.highestWave=t),s>this.highScore&&(this.highScore=s),this.persist(),S.sendScore(s)}persist(){S.saveData({coins:this.coins,highScore:this.highScore,highestWave:this.highestWave,turretLevel:this.turretLevel,unlockedSkins:["default"]})}}class kt{appEl;hudEl;renderer;scene;cameraRig;lighting;particles;sound;loop;ads;economy;input;hud;shell;turret;voxelWorld;projectiles;lootCubes;golems=[];currentWave=1;currentScore=0;waveGoldEarned=0;isWaveRunning=!1;hasRevivedThisWave=!1;lastTime=0;constructor(){this.appEl=document.getElementById("app"),this.hudEl=document.getElementById("hud"),S.applyDualModeShell(),this.scene=new N;const t=this.appEl.clientWidth||window.innerWidth,s=this.appEl.clientHeight||window.innerHeight;this.renderer=new nt({powerPreference:"high-performance",antialias:!0,stencil:!1,depth:!0}),this.renderer.setSize(t,s),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=H,this.appEl.appendChild(this.renderer.domElement),this.cameraRig=new ot(t/s),this.lighting=new ct(this.scene),this.lighting,this.particles=new dt(this.scene),this.sound=new ht,this.ads=D.get(),this.economy=new Et,this.input=new mt(this.appEl,this.cameraRig.camera),this.hud=new pt(this.hudEl),this.shell=new bt({currentGameId:"voxel-craft-smash-3d",onRestart:()=>this.startWave(1)}),this.shell,this.loop=new ut(e=>this.onFrame(e)),this.init()}async init(){await S.initPlatform(),await this.ads.initialize(),await this.economy.init();const t=()=>{this.sound.unlock(),window.removeEventListener("pointerdown",t),window.removeEventListener("keydown",t)};window.addEventListener("pointerdown",t),window.addEventListener("keydown",t),S.initLifecycle({onPause:()=>{this.isWaveRunning=!1,this.sound.setMuted(!0)},onResume:()=>{this.isWaveRunning=!0,this.sound.setMuted(S.isAudioMuted())},onAudioEnabledChange:s=>{this.sound.setMuted(!s)}}),window.addEventListener("resize",()=>this.onWindowResize()),this.buildWorld(),this.setupBoosterHooks(),this.startWave(1),S.signalFirstFrameReady(),S.signalGameReady(),S.gameplayStart(),this.loop.start()}buildWorld(){const t=G.createIsland(g.arenaWidth,g.arenaDepth);this.scene.add(t),this.turret=new wt(0,16),this.scene.add(this.turret.group),this.voxelWorld=new vt,this.scene.add(this.voxelWorld.group),this.voxelWorld.onBlockShattered=(s,e)=>{this.currentScore+=s.config.goldReward*2,this.sound.playVoxelShatter(1+s.y/8*.3),this.particles.spawnBlockFracture(e,parseInt(s.config.color.replace("#","0x"),16),8),this.lootCubes.spawn(e,s.config.goldReward,2)},this.voxelWorld.onTntDetonated=s=>{this.sound.playExplosion(),this.cameraRig.addShake(.8),this.particles.spawnBlockFracture(s,15680580,28)},this.projectiles=new xt(this.scene),this.lootCubes=new Rt(this.scene)}startWave(t){this.currentWave=t,this.waveGoldEarned=0,this.isWaveRunning=!0,this.hasRevivedThisWave=!1,this.hud.closeModal(),this.turret.reset(),this.projectiles.clearAll(),this.lootCubes.clearAll();for(const s of this.golems)this.scene.remove(s.group);if(this.golems=[],this.voxelWorld.generateWaveFortress(t),t>=2){const s=t===2?2:t===3?3:5;for(let e=0;e<s;e++){const a=(e-(s-1)/2)*6.5,i=-18-e*4,n=new Mt(a,i,10+t*4,1.8+t*.2);this.scene.add(n.group),this.golems.push(n)}}this.hud.updateStats(this.turret.hp,this.turret.maxHp,this.currentWave,this.economy.coins,this.voxelWorld.activeBlockCount)}setupBoosterHooks(){this.hud.setBoosterCallbacks({onTnt:async()=>{if(await this.ads.showRewarded("booster_tnt")){this.sound.playExplosion(),this.cameraRig.addShake(.9);for(let s=0;s<g.tntBarrageCount;s++){const e=(Math.random()-.5)*8,a=-12+(Math.random()-.5)*6;this.voxelWorld.triggerTntExplosion(new f(e,2,a))}}},onDoubleCannon:async()=>{await this.ads.showRewarded("booster_cannon")&&(this.turret.doubleCannonTimer=g.boosterDoubleCannonSec,this.sound.playCannonShot())},onMagnet:async()=>{await this.ads.showRewarded("booster_magnet")&&(this.lootCubes.triggerGlobalVacuum(),this.golems.forEach(s=>s.freeze(3)),this.sound.playLootCollect())}})}onFrame(t){if(this.lastTime===0){this.lastTime=t,this.renderer.render(this.scene,this.cameraRig.camera);return}const s=Math.min((t-this.lastTime)/1e3,.1);if(this.lastTime=t,!this.shell.isMenuOpen){if(this.isWaveRunning&&!this.shell.isMenuOpen){const e=s*this.shell.getDifficultyMultiplier();if(this.turret.aimAt(this.input.aimPosition),this.turret.update(e),this.input.isFiring&&this.turret.canFire()){const o=this.turret.fire();for(const r of o)this.projectiles.spawn(r.origin,r.direction,this.turret.doubleCannonTimer>0);this.sound.playCannonShot()}this.projectiles.update(e,(o,r)=>{if(this.voxelWorld.checkProjectileHit(o,r,1))return!0;for(const l of this.golems)if(l.isAlive&&o.distanceTo(l.position)<1.6){const d=l.takeDamage(1);return this.turret.doubleCannonTimer>0&&l.freeze(3),this.sound.playVoxelShatter(.85),this.particles.spawnBlockFracture(l.position,4674921,12),d&&(this.currentScore+=150,this.lootCubes.spawn(l.position,25,4),this.sound.playLootCollect()),!0}return!1});const a=this.turret.position.z;for(const o of this.golems){if(!o.isAlive)continue;if(o.update(e,a)&&(this.turret.takeDamage(25),o.takeDamage(999),this.sound.playExplosion(),this.cameraRig.addShake(.6),this.turret.hp<=0)){this.handleBaseBreached();break}}this.lootCubes.update(s,this.turret.position,o=>{this.economy.addCoins(o),this.waveGoldEarned+=o,this.sound.playLootCollect()});const i=this.voxelWorld.activeBlockCount;let n=0;for(let o=0;o<this.golems.length;o++)this.golems[o].isAlive&&n++;this.hud.updateStats(this.turret.hp,this.turret.maxHp,this.currentWave,this.economy.coins,i),i===0&&n===0&&this.handleWaveVictory()}this.cameraRig.update(s),this.particles.update(s),this.renderer.render(this.scene,this.cameraRig.camera)}}handleBaseBreached(){this.isWaveRunning=!1,this.hasRevivedThisWave?this.startWave(1):this.hud.showReviveModal({onRevive:async()=>{if(await this.ads.showRewarded("near_miss_revive")){this.hasRevivedThisWave=!0,this.turret.hp=this.turret.maxHp;for(const s of this.golems)s.isAlive&&(s.group.position.z-=14,s.takeDamage(4));this.sound.playExplosion(),this.cameraRig.addShake(1),this.isWaveRunning=!0}else this.startWave(this.currentWave)},onGiveUp:()=>{this.startWave(1)}})}handleWaveVictory(){this.isWaveRunning=!1,this.sound.playWaveComplete();const t=g.coinsPerWaveBase+this.currentWave*20;this.economy.recordWaveComplete(this.currentWave,this.currentScore),this.hud.showVictoryModal(this.currentWave,t,{onClaimMultiplier:async s=>{const a=await this.ads.showRewarded("victory_multiplier")?Math.floor(t*s):t;this.economy.addCoins(a),this.advanceNextWave()},onClaimBase:()=>{this.economy.addCoins(t),this.advanceNextWave()}})}advanceNextWave(){const t=this.currentWave%g.totalWaves+1;this.startWave(t)}onWindowResize(){const t=this.appEl.clientWidth||window.innerWidth,s=this.appEl.clientHeight||window.innerHeight;this.renderer.setSize(t,s),this.cameraRig.resize(t,s)}}window.addEventListener("DOMContentLoaded",()=>{new kt});
