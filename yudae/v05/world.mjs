import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {objects} from './engine.mjs';
export function buildWorld(){
 const root=new T.Group(),staticRoot=new T.Group(),dynamic=new T.Group();root.add(staticRoot,dynamic);
 const mats={};const mat=(name,color,metalness=0)=>mats[name]||(mats[name]=new T.MeshStandardMaterial({color,roughness:.88,metalness}));
 const plaster=mat('plaster','#b9b6a4'),roof=mat('roof','#566965',.3),timber=mat('wood','#86725a'),metal=mat('metal','#3d4c4a',.35),paper=mat('paper','#f4e8c8'),dark=mat('dark','#182c31'),red=mat('red','#b45b45'),gold=mat('gold','#d6b668'),green=mat('green','#88b39c'),glass=mat('glass','#758e91',.15);
 function box(w,h,d,x,y,z,m,parent=staticRoot){const a=new T.Mesh(new T.BoxGeometry(w,h,d),m);a.position.set(x,y,z);parent.add(a);return a;}
 function cyl(r,h,x,y,z,m,parent=staticRoot){const a=new T.Mesh(new T.CylinderGeometry(r,r,h,12),m);a.position.set(x,y,z);parent.add(a);return a;}
 const signs=[];
 function sign(lines,x,y,z,w=.48,h=.24,parent=staticRoot,fg='#243a3c',bg='#eee3c8'){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;const ctx=canvas.getContext('2d');
  const tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;
  const m=new T.MeshBasicMaterial({map:tex,side:T.DoubleSide});const plane=new T.Mesh(new T.PlaneGeometry(w,h),m);plane.position.set(x,y,z);parent.add(plane);
  const draw=text=>{ctx.fillStyle=bg;ctx.fillRect(0,0,512,256);ctx.strokeStyle='#b5ad96';ctx.lineWidth=5;ctx.strokeRect(10,10,492,236);ctx.fillStyle=fg;ctx.textAlign='center';const ls=Array.isArray(text)?text:[text];ctx.font='bold '+(ls.length>2?35:46)+'px Arial';ls.forEach((l,i)=>ctx.fillText(l,256,128+(i-(ls.length-1)/2)*59+12));tex.needsUpdate=true;};draw(lines);signs.push(plane);return {plane,draw};
 }
 // Textured ground: a reproducible surface, with repairs and water marks rather than visual noise.
 const cv=document.createElement('canvas');cv.width=cv.height=512;const cx=cv.getContext('2d');cx.fillStyle='#afa995';cx.fillRect(0,0,512,512);let seed=21;const rand=()=>((seed=(seed*16807)%2147483647)-1)/2147483646;for(let i=0;i<1600;i++){cx.fillStyle=i%3?'#9e9c8b':'#c1bba5';cx.fillRect(rand()*512,rand()*512,rand()*4+1,rand()*3+1);}cx.strokeStyle='#7d8175';cx.lineWidth=2;for(let i=0;i<5;i++){cx.beginPath();cx.moveTo(i*115,0);cx.lineTo(i*115+18,230);cx.lineTo(i*115-10,512);cx.stroke();}const groundTex=new T.CanvasTexture(cv);groundTex.colorSpace=T.SRGBColorSpace;const groundMat=new T.MeshStandardMaterial({map:groundTex,roughness:1});
 box(3.7,.12,2.8,0,-.09,0,groundMat);box(3.76,.05,2.86,0,-.165,0,metal);
 // Three open-front spaces keep equipment visible and preserve the same spatial relationships in AR.
 function room(x,z,w,name,color){box(w,.09,.94,x,.01,z,mat(name+'floor',color));box(w,.99,.07,x,.55,z-.44,plaster);box(.07,.99,.94,x-w/2,.55,z,plaster);box(.07,.99,.94,x+w/2,.55,z,plaster);box(w+.12,.07,.43,x,1.08,z-.29,roof);for(let i=0;i<13;i++)box(.018,.023,.43,x-w/2+i*w/12,1.13,z-.29,metal);box(w,.045,.035,x,.17,z+.45,timber);for(let i=0;i<5;i++)box(w,.015,.018,x,.32+i*.12,z-.395,timber);sign([name],x,.96,z-.39,w*.85,.14);}
 room(-1.22,-.82,1.05,'CLINIC','#b7b2a4');room(0,-1.0,1.05,'COMMONS','#a1ad9b');room(1.22,-.82,1.05,'DISPATCH','#b5a582');
 // Weathering, accessible ramp, door frame and an incomplete repair.
 box(.38,.04,.65,-1.42,.005,.05,plaster).rotation.x=.1;for(let i=0;i<7;i++)box(.012,.015,.61,-1.59+i*.055,.045,.05,metal);box(.05,.72,.05,-1.65,.38,.23,timber);box(.05,.72,.05,-1.65,.38,-.18,timber);box(.05,.04,.44,-1.65,.73,.03,timber);
 for(const x of [-1.66,-.78,.78,1.66]){box(.025,.85,.025,x,.5,-.33,metal);box(.12,.06,.025,x,.11,-.33,red);}
 // Fridge: hinges, gasket, handle, logger and an explicitly incomplete paper trace.
 box(.34,.57,.31,-1.23,.35,-.7,mat('fridge','#d5d7c7'));box(.30,.49,.025,-1.23,.36,-.53,dark);box(.275,.465,.026,-1.23,.36,-.51,paper);box(.018,.16,.04,-1.11,.4,-.48,metal);
 for(const yy of [.17,.53])box(.035,.04,.035,-1.37,yy,-.49,metal);
 const logger=box(.18,.105,.05,-1.23,.70,-.5,dark,dynamic);const loggerSign=sign(['17:58 / SAFE','18:10 / --'], -1.23,.55,-.488,.245,.12,dynamic);const loggerLamp=cyl(.018,.015,-1.11,.77,-.55,red,dynamic);
 box(.32,.10,.20,-.94,.11,-.20,metal);box(.33,.02,.2,-.94,.20,-.25,metal).rotation.x=-.6;sign(['TRANSFER CASE','Awaiting transport'], -1.0,.26,-.13,.4,.15);
 // Dispatch desk, radio handset, speaker slats and pencilled detour slate.
 box(.70,.055,.32,1.21,.40,-.66,timber);for(const xx of [.94,1.48])for(const zz of [-.78,-.53])box(.035,.37,.035,xx,.20,zz,metal);
 box(.22,.16,.12,1.09,.51,-.66,dark);for(let i=0;i<4;i++)box(.08,.008,.008,1.06,.46+i*.022,-.594,glass);cyl(.009,.23,1.0,.68,-.67,metal);const radioLamp=box(.045,.025,.008,1.16,.54,-.593,red,dynamic);box(.045,.12,.06,1.3,.5,-.63,dark);
 const routeSign=sign(['BRIDGE: UNKNOWN','DETOUR ?','DRIVER: NO CONTACT'],1.22,.77,-1.20,.72,.29,dynamic);
 // Commons board with layered paper, pinned corners, and retained earlier information.
 box(.75,.45,.04,0,.67,-1.38,timber);const board=sign(['SHUTTLE 18:00','still?'],0,.68,-1.35,.65,.32,dynamic);for(const x of [-.29,.29])for(const y of [.54,.81]){const pin=cyl(.013,.016,x,y,-1.32,red);pin.rotation.x=Math.PI/2;}
 box(.62,.035,.36,.55,.37,.25,timber);for(const x of [.3,.8])for(const z of [.10,.40])box(.025,.35,.025,x,.18,z,metal);box(.30,.012,.23,.54,.40,.25,paper);const folder=sign(['CONTACTS','2 ACKNOWLEDGEMENTS','PENDING'],.55,.55,.29,.40,.19,dynamic);box(.025,.016,.20,.75,.41,.22,gold);
 sign(['WALK-UP DESK','Ask here'],.53,.24,.445,.46,.17);const deskStaff=box(.08,.08,.08,.78,.44,.14,green,dynamic);
 // Battery and physically traceable leads. One working socket, three destinations.
 box(.31,.23,.22,0,.13,.65,dark);box(.23,.025,.05,0,.28,.65,metal);for(let i=0;i<3;i++)box(.035,.04,.012,-.08+i*.07,.18,.769,i<2?green:metal);sign(['ONE LOAD','25 MIN EST.'],0,.10,.774,.26,.10);
 const connections={clinic:[[-.1,.04,.66],[-.48,.04,.55],[-.8,.04,.05],[-1.2,.04,-.45]],shuttle:[[.1,.04,.66],[.94,.04,.55],[1.5,.04,.0],[1.35,.04,-.45]],commons:[[0,.04,.56],[.21,.04,.32],[.12,.04,-.12],[0,.04,-.7]]};const powered={};
 for(const [key,points] of Object.entries(connections)){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));const cable=new T.Mesh(new T.TubeGeometry(curve,24,.013,6,false),metal);staticRoot.add(cable);const m=new T.MeshStandardMaterial({color:'#678179',emissive:'#82d9bb',emissiveIntensity:0,roughness:.5});const pulse=new T.Mesh(new T.SphereGeometry(.026,8,6),m);dynamic.add(pulse);powered[key]={curve,pulse,m};}
 box(.06,.045,.09,-.7,.04,.18,red).rotation.y=.65;
 // Roof panel, disconnected controller, replacement connector and test tag.
 box(.48,.026,.30,-1.44,1.17,-1.04,mat('solar','#293f54',.45));for(let i=0;i<5;i++)box(.006,.008,.29,-1.66+i*.11,1.188,-1.04,glass);for(let i=0;i<3;i++)box(.47,.008,.005,-1.44,1.19,-1.18+i*.14,glass);box(.12,.09,.09,-.94,1.16,-1.08,dark);const solarTag=sign(['TEST FIRST'], -1.22,1.25,-.83,.42,.14,dynamic);box(.20,.035,.13,-.72,.03,.48,metal);box(.055,.03,.03,-.72,.06,.48,gold);
 // Bench and water container support a lived place without hiding the six evidence objects.
 box(.60,.05,.18,-1.1,.25,.92,timber);for(const x of [-1.32,-.88])box(.04,.24,.15,x,.10,.92,metal);cyl(.10,.30,1.5,.15,.9,mat('water','#7e9592'));box(.04,.03,.06,1.5,.30,.9,paper);
 const markers=[],pickables=[];Object.entries(objects).forEach(([key,o])=>{const [x,y,z]=o.position;const marker=sign([String(o.n)],x,y+.19,z+.06,.12,.12,dynamic,'#f8edce','#31554d').plane;marker.userData.key=key;markers.push(marker);const hit=new T.Mesh(new T.SphereGeometry(.115,10,8),new T.MeshBasicMaterial({visible:false}));hit.position.copy(marker.position);hit.userData.key=key;dynamic.add(hit);pickables.push(hit);});
 // Merge static meshes by material: hundreds of construction details become a small set of draw calls.
 staticRoot.updateMatrixWorld(true);const buckets=new Map();staticRoot.traverse(o=>{if(!o.isMesh)return;const g=o.geometry.clone().applyMatrix4(o.matrixWorld);const key=o.material.uuid;if(!buckets.has(key))buckets.set(key,{m:o.material,gs:[]});buckets.get(key).gs.push(g);});staticRoot.clear();for(const {m,gs} of buckets.values()){const g=mergeGeometries(gs,false);if(g)staticRoot.add(new T.Mesh(g,m));gs.forEach(g=>g.dispose());}
 let state={};return {root,pickables,markers,update(s){state=s;logger.material=s.priority==='clinic'?green:dark;loggerSign.draw(s.priority==='clinic'?['17:58 / SAFE','GAP / MONITOR ON']:['17:58 / SAFE','18:10 / --']);loggerLamp.material=s.priority==='clinic'?green:red;radioLamp.material=s.priority==='shuttle'?green:red;routeSign.draw(s.priority==='shuttle'?['DRIVER REACHED','DETOUR UNCONFIRMED','TRANSFER '+(s.transfer?'REQUESTED':'NOT REQUESTED')]:['BRIDGE: UNKNOWN','DETOUR ?','DRIVER: NO CONTACT']);board.draw(s.coordination==='public'?['CORRECTION POSTED','ALLOCATION: '+s.priority.toUpperCase(),'RECEIPT UNCONFIRMED']:s.coordination==='targeted'?['SHUTTLE 18:00','OLD PUBLIC NOTICE','TARGETED CONTACTS ONLY']:['SHUTTLE 18:00','still?']);folder.draw(s.followup==='reach'&&s.coordination?['CONTACTS','1 ROUTE CORRECTED','1 STILL UNRESOLVED']:['CONTACTS','2 ACKNOWLEDGEMENTS','PENDING']);solarTag.draw(s.followup==='solar'?['ASSESSMENT REQUESTED','OUTPUT UNVERIFIED']:['TEST FIRST']);deskStaff.material=s.followup==='reach'?red:green;},animate(t,camera){for(const [key,p] of Object.entries(powered)){p.pulse.visible=state.priority===key;p.m.emissiveIntensity=state.priority===key?1:0;p.pulse.position.copy(p.curve.getPoint((t*.00015)%1));}for(const m of markers)m.quaternion.copy(root.getWorldQuaternion(new T.Quaternion()).invert().multiply(camera.getWorldQuaternion(new T.Quaternion())));}};
}
