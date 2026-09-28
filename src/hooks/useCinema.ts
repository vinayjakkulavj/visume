'use client';
import {useEffect,useRef} from 'react';
export function useCinema(dependency:unknown,onChapter:(n:number)=>void,onReveal:(n:number)=>void){
 const cb=useRef(onChapter);cb.current=onChapter;const revealCb=useRef(onReveal);revealCb.current=onReveal;
 useEffect(()=>{
 const mq=matchMedia('(prefers-reduced-motion: reduce)');let reduced=mq.matches,frame=0,previous=-1,visible=true,enteredAt=performance.now();
 const chapters=Array.from(document.querySelectorAll<HTMLElement>('.chapter'));
 const visualIndexes=chapters.map((el,i)=>Number(el.dataset.visualIndex??i));
 const canvases=chapters.map(el=>el.querySelector('canvas')!);
 const revealed=new Set<number>();
 const progress=chapters.map(()=>0), images=chapters.map(el=>el.querySelector<HTMLElement>('.scene'));
 images.forEach((img,i)=>{if(img&&!reduced)img.style.transform=`translate3d(0,0,0) scale(${visualIndexes[i]===1?1.16:1.06})`;});
 let geometry=chapters.map(el=>({top:el.parentElement!.getBoundingClientRect().top+scrollY,height:el.parentElement!.offsetHeight})),lastTick=performance.now(),lastPaint=0;
 let navigationFrame=0,locked=false,lastWheel=0,total=0,consumed=false,touchY=0,touchHandled=false;
 const blocked=(target:EventTarget|null)=>!!document.querySelector('[role="dialog"]') || (target instanceof Element && !!target.closest('input,textarea,select,[contenteditable="true"]'));
 const nearest=()=>{const y=scrollY;return geometry.reduce((best,g,i)=>Math.abs(g.top-y)<Math.abs(geometry[best].top-y)?i:best,0);};
 function navigate(n:number){if(n<0||n>=chapters.length)return;cancelAnimationFrame(navigationFrame);const from=scrollY,to=geometry[n].top,start=performance.now();locked=true;document.documentElement.classList.add('slide-gliding');const duration=reduced?0:1100;function move(now:number){const p=duration?clamp((now-start)/duration):1;const ease=(1-Math.cos(Math.PI*p))/2;window.scrollTo({top:from+(to-from)*ease,behavior:"instant"});if(p<1)navigationFrame=requestAnimationFrame(move);else{locked=false;document.documentElement.classList.remove('slide-gliding');}}navigationFrame=requestAnimationFrame(move);}
 function canReadInside(index:number,dir:number){const r=chapters[index].parentElement!.getBoundingClientRect();return r.height>innerHeight+8 && (dir>0?r.bottom>innerHeight+3:r.top< -3);}
 function wheel(e:WheelEvent){if(e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)||blocked(e.target))return;const now=performance.now(),gap=now-lastWheel;lastWheel=now;if(gap>190){total=0;consumed=false;}const dir=Math.sign(e.deltaY),i=nearest();if(!locked&&canReadInside(i,dir))return;e.preventDefault();if(locked||consumed)return;total+=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);if(Math.abs(total)<18)return;consumed=true;navigate(i+Math.sign(total));}
 function key(e:KeyboardEvent){if(blocked(e.target)||(e.target instanceof Element&&e.target.closest("button,a")))return;const dir=["ArrowDown","PageDown"," "].includes(e.key)?1:["ArrowUp","PageUp"].includes(e.key)?-1:0;if(!dir)return;const i=nearest();if(canReadInside(i,dir))return;e.preventDefault();if(!locked)navigate(i+dir);}
 const direct=(e:Event)=>navigate((e as CustomEvent<number>).detail);
 const touchStart=(e:TouchEvent)=>{touchY=e.touches[0].clientY;touchHandled=false;};
 const touchMove=(e:TouchEvent)=>{if(blocked(e.target)||e.touches.length!==1)return;const delta=touchY-e.touches[0].clientY;if(canReadInside(nearest(),Math.sign(delta)))return;if(e.cancelable)e.preventDefault();if(!locked&&!touchHandled&&Math.abs(delta)>45){touchHandled=true;navigate(nearest()+Math.sign(delta));}};
 window.addEventListener("wheel",wheel,{passive:false});window.addEventListener("keydown",key);window.addEventListener("visume:navigate",direct);window.addEventListener("touchstart",touchStart,{passive:true});window.addEventListener("touchmove",touchMove,{passive:false});
 const clamp=(n:number)=>Math.max(0,Math.min(1,n));
 const resize=()=>{geometry=chapters.map(el=>({top:el.parentElement!.getBoundingClientRect().top+scrollY,height:el.parentElement!.offsetHeight}));canvases.forEach(c=>{c.width=Math.round(c.clientWidth);c.height=Math.round(c.clientHeight);});};resize();
 function paint(c:HTMLCanvasElement,index:number,t:number,p:number){const ctx=c.getContext('2d');if(!ctx)return;const w=c.width,h=c.height;ctx.clearRect(0,0,w,h);if(reduced)return;
 const count=index===2?38:26;ctx.lineWidth=.8;for(let i=0;i<count;i++){const seed=(i*137.508)%100/100;const phase=((t*(index===3?.00018:.000035)+p*.12+i/count)%1);let x,y;
 if(index===2){x=w*(.57+Math.sin(i*2.4+phase*1.7)*.3);y=h*(.12+seed*.73);ctx.strokeStyle=`rgba(157,195,255,${.05+p*.06})`;ctx.beginPath();ctx.moveTo(w*.74,h*.48);ctx.lineTo(x,y);ctx.stroke();}
 else{x=w*(.35+phase*.85);y=h*(.15+seed*.7);const trail=index===3?120:25;const grad=ctx.createLinearGradient(x-trail,y,x,y);grad.addColorStop(0,'rgba(156,201,255,0)');grad.addColorStop(1,`rgba(171,215,255,${.18+phase*.25})`);ctx.strokeStyle=grad;ctx.beginPath();ctx.moveTo(x-trail,y+(index===1?trail*.12:0));ctx.lineTo(x,y);ctx.stroke();}
 ctx.fillStyle=`rgba(198,225,255,${.12+Math.sin(phase*Math.PI)*.45})`;ctx.beginPath();ctx.arc(x,y,index===2?1.8:1,0,Math.PI*2);ctx.fill();}}
 function tick(t:number){frame=requestAnimationFrame(tick);const dt=Math.min(40,t-lastTick);lastTick=t;if(!visible)return;const vh=innerHeight,y=scrollY;let current=nearest();const draw=!locked&&t-lastPaint>40;if(draw)lastPaint=t;
 if(current!==previous){previous=current;enteredAt=t;revealed.delete(current);cb.current(current);chapters.forEach((el,i)=>el.classList.toggle("cinema-active",i===current));}
 chapters.forEach((el,i)=>{const top=geometry[i].top-y;if(top+geometry[i].height<0||top>vh)return;
 // Preserve outgoing camera/reveal state. Never reset it at the midpoint.
 // Defer new reveals until the slide is nearly settled.
 if(reduced)progress[i]=1;else if(i===current&&!locked&&Math.abs(top)<vh*.12)progress[i]=clamp(progress[i]+dt/1900);
 const p=progress[i];const enter=1;const rise=reduced?1:clamp((p-.08)/.5);const exit=0;
 el.style.setProperty('--progress',String(p));el.style.setProperty('--rise',String(rise));el.style.setProperty('--enter',String(enter));el.style.setProperty('--exit',String(exit));el.classList.add('seen');if(p>.36&&p<.8&&!revealed.has(i)){revealed.add(i);revealCb.current(i);}if(p<.08)revealed.delete(i);
 const img=images[i];if(img&&!reduced&&!locked){const eased=p*p*(3-2*p);const zoom=visualIndexes[i]===1?1.16-eased*.1:visualIndexes[i]===2?1.06+eased*.08:1.06+eased*.06;img.style.transform=`translate3d(${-eased}%,${-eased*.7}%,0) scale(${zoom})`;}
 if(draw)paint(canvases[i],visualIndexes[i],t,p);
 });
 }
 frame=requestAnimationFrame(tick);const motion=()=>{reduced=mq.matches;chapters.forEach(el=>{const img=el.querySelector<HTMLElement>('.scene');if(img)img.style.transform='';});};const visibility=()=>{visible=!document.hidden;};mq.addEventListener('change',motion);window.addEventListener('resize',resize);document.addEventListener('visibilitychange',visibility);
 return()=>{cancelAnimationFrame(frame);cancelAnimationFrame(navigationFrame);document.documentElement.classList.remove('slide-gliding');window.removeEventListener("wheel",wheel);window.removeEventListener("keydown",key);window.removeEventListener("visume:navigate",direct);window.removeEventListener("touchstart",touchStart);window.removeEventListener("touchmove",touchMove);window.removeEventListener('resize',resize);mq.removeEventListener('change',motion);document.removeEventListener('visibilitychange',visibility);};
 },[dependency]);
}
