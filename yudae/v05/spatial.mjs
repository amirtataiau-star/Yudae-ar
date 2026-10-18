import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {buildWorld} from './world.mjs';
import {objects} from './engine.mjs';
export async function startSpatial({onInspect,onStatus}){
 const $=id=>document.getElementById(id),host=$('viewport');
 const renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'default'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setSize(host.clientWidth,host.clientHeight);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;host.prepend(renderer.domElement);renderer.xr.enabled=true;renderer.xr.setReferenceSpaceType('local');
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(42,host.clientWidth/host.clientHeight,.01,50);camera.position.set(3.4,3.2,4.7);
 scene.add(new T.HemisphereLight('#fff7db','#727e69',2.5));const sun=new T.DirectionalLight('#fff4de',3.1);sun.position.set(-2,5,3);scene.add(sun);const fill=new T.DirectionalLight('#c6dbe0',1.0);fill.position.set(3,2,-2);scene.add(fill);
 const world=buildWorld();scene.add(world.root);const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.4,0);controls.minDistance=.45;controls.maxDistance=8;controls.maxPolarAngle=Math.PI*.49;controls.enableDamping=true;
 const raycaster=new T.Raycaster(),pointer=new T.Vector2();let down=null,session=null,hitSource=null,placed=false,active=false,ending=false;
 const reticle=new T.Mesh(new T.RingGeometry(.065,.085,32).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:'#b9f3c6',side:T.DoubleSide}));reticle.matrixAutoUpdate=false;reticle.visible=false;scene.add(reticle);
 const wide=()=>{if(active)return;camera.position.set(3.4,3.2,4.7);controls.target.set(0,.4,0);controls.update();};
 const focus=k=>{if(active)return;const o=objects[k];camera.position.set(...o.view);controls.target.set(...o.position);controls.update();};
 function pick(){world.root.updateMatrixWorld(true);const hits=raycaster.intersectObjects(world.pickables,false);if(hits.length)onInspect(hits[0].object.userData.key);else if(active)$('arStatus').textContent='Aim the centre dot at a numbered marker, or choose its number below.';}
 renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});renderer.domElement.addEventListener('pointerup',e=>{if(active||!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>8)return;down=null;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);pick();});
 const resize=()=>{if(active)return;camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight);};new ResizeObserver(resize).observe(host);
 const capability=$('arCapability'),enter=$('enterAR');let supported=false;
 try{supported=!!navigator.xr&&await navigator.xr.isSessionSupported('immersive-ar');}catch{}
 enter.disabled=!supported;enter.textContent=supported?'Enter interactive AR':'Phone AR unavailable here';capability.textContent=supported?'This device reports immersive AR support. On entry, surface detection and in-camera controls must also be available. Place the courtyard on a clear surface, then inspect and decide without leaving the camera view.':'This browser does not report interactive camera AR support. The complete on-screen experience is available. The earlier prototype offers a separate native model viewer where supported.';
 function restoreScreen(){active=false;session=null;hitSource?.cancel();hitSource=null;placed=false;reticle.visible=false;world.root.visible=true;world.root.position.set(0,0,0);world.root.quaternion.identity();world.root.scale.setScalar(1);controls.enabled=true;document.body.classList.remove('xr');enter.disabled=!supported;ending=false;wide();resize();}
 function place(){if(!active||!reticle.visible){$('arStatus').textContent='No surface found yet. Move slowly over a well-lit, textured surface.';return;}world.root.position.setFromMatrixPosition(reticle.matrix);world.root.quaternion.setFromRotationMatrix(reticle.matrix);world.root.scale.setScalar(.20);world.root.visible=true;placed=true;reticle.visible=false;$('placeAR').hidden=true;$('arStatus').textContent='Courtyard placed. Walk around it; use the numbers to investigate. Choices change this scene.';}
 $('placeAR').onclick=place;$('replaceAR').onclick=()=>{if(!active)return;placed=false;world.root.visible=false;$('placeAR').hidden=false;$('arStatus').textContent='Find another surface and select Place on surface.';};
 $('inspectAR').onclick=()=>{if(!placed){$('arStatus').textContent='Place the courtyard first.';return;}const cam=renderer.xr.getCamera();const origin=new T.Vector3(),direction=new T.Vector3();cam.getWorldPosition(origin);cam.getWorldDirection(direction);raycaster.set(origin,direction);pick();};
 $('exitAR').onclick=async()=>{if(session&&!ending){ending=true;try{await session.end();}catch{ending=false;}}};
 $('arHUD').addEventListener('beforexrselect',e=>e.preventDefault());
 enter.onclick=async()=>{
  if(session)return;enter.disabled=true;let pending=null;
  try{
   // Requiring overlay support prevents entering an AR mode that cannot expose the scenario controls.
   pending=await navigator.xr.requestSession('immersive-ar',{requiredFeatures:['hit-test','dom-overlay'],domOverlay:{root:$('arHUD')}});session=pending;active=true;controls.enabled=false;world.root.visible=false;placed=false;document.body.classList.add('xr');$('placeAR').hidden=false;
   pending.addEventListener('end',restoreScreen,{once:true});await renderer.xr.setSession(pending);
   const viewerSpace=await pending.requestReferenceSpace('viewer');hitSource=await pending.requestHitTestSource({space:viewerSpace});$('arStatus').textContent='Move slowly to find a surface. Place the courtyard when the ring appears.';
  }catch(error){if(pending){try{await pending.end();}catch{}}restoreScreen();capability.textContent='Interactive AR could not start ('+(error.name||'unavailable')+'). Surface detection and camera-view controls are required. Your on-screen path is preserved; no AR placement is claimed.';}
 };
 renderer.setAnimationLoop((time,frame)=>{
  if(active&&frame&&hitSource&&!placed){const hits=frame.getHitTestResults(hitSource);reticle.visible=hits.length>0;if(hits.length){const pose=hits[0].getPose(renderer.xr.getReferenceSpace());if(pose)reticle.matrix.fromArray(pose.transform.matrix);else reticle.visible=false;}}
  if(!active)controls.update();world.animate(time,active?renderer.xr.getCamera():camera);renderer.render(scene,camera);
 });
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();onStatus('Graphics rendering was interrupted. Your path is saved. Reload to restart 3D, or use the object map.');if(session)session.end().catch(()=>{});});
 onStatus('');return {update:world.update,focus,wide};
}
