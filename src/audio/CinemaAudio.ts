// Original synthesized sound design. No remote audio or autoplay.
export class CinemaAudio {
 ctx:AudioContext;master:GainNode;last=-10;
 constructor(){this.ctx=new AudioContext();this.master=this.ctx.createGain();const limiter=this.ctx.createDynamicsCompressor();limiter.threshold.value=-18;limiter.ratio.value=8;this.master.gain.value=.65;this.master.connect(limiter);limiter.connect(this.ctx.destination);}
 enable(on:boolean){this.ctx.resume();this.master.gain.cancelScheduledValues(this.ctx.currentTime);this.master.gain.setTargetAtTime(on?.65:0,this.ctx.currentTime,.035);}
 play(chapter:number,reveal=false){const c=this.ctx,t=c.currentTime;if(t-this.last<.9)return;this.last=t;
 const out=this.master;const delay=c.createDelay(.8),feedback=c.createGain(),wet=c.createGain();delay.delayTime.value=.19;feedback.gain.value=.24;wet.gain.value=.18;delay.connect(feedback);feedback.connect(delay);delay.connect(wet);wet.connect(out);
 const tone=(start:number,f:number,end:number,duration:number,vol:number,type:OscillatorType='sine',pan=0)=>{const o=c.createOscillator(),g=c.createGain(),p=c.createStereoPanner();o.type=type;o.frequency.setValueAtTime(f,t+start);o.frequency.exponentialRampToValueAtTime(end,t+start+duration);g.gain.setValueAtTime(0,t+start);g.gain.linearRampToValueAtTime(vol,t+start+.025);g.gain.exponentialRampToValueAtTime(.0001,t+start+duration);p.pan.value=pan;o.connect(g);g.connect(p);p.connect(out);g.connect(delay);o.start(t+start);o.stop(t+start+duration+.02);};
 const sweep=(start:number,duration:number,from:number,to:number,vol:number)=>{const b=c.createBuffer(2,Math.ceil(c.sampleRate*duration),c.sampleRate);for(let ch=0;ch<2;ch++){const a=b.getChannelData(ch);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;}const src=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();src.buffer=b;f.type='bandpass';f.Q.value=1.2;f.frequency.setValueAtTime(from,t+start);f.frequency.exponentialRampToValueAtTime(to,t+start+duration);g.gain.setValueAtTime(.0001,t+start);g.gain.exponentialRampToValueAtTime(vol,t+start+duration*.62);g.gain.exponentialRampToValueAtTime(.0001,t+start+duration);src.connect(f);f.connect(g);g.connect(out);g.connect(delay);src.start(t+start);};
 const hit=(at:number,vol=.13)=>{tone(at,110,38,.65,vol);tone(at,220,70,.24,vol*.3,'triangle');};
 if(reveal){hit(0,.08);tone(.02,523.25,523.25,.6,.025,'sine',-.3);tone(.09,783.99,783.99,.7,.025,'sine',.3);}
 else if(chapter===1){sweep(0,.95,180,4400,.09);tone(0,110,330,.9,.025,'triangle',-.6);hit(.67);tone(.7,392,392,.7,.03,'sine',.5);}
 else if(chapter===2){sweep(0,.65,700,2600,.035);[261.63,392,523.25,783.99].forEach((f,i)=>tone(i*.105,f,f*1.002,.75,.042,'sine',(i-1.5)*.45));hit(.4,.075);}
 else if(chapter===3){sweep(0,.75,200,6500,.09);[0,.17,.29,.38].forEach((at,i)=>tone(at,90+i*45,65+i*50,.16,.055,'triangle',i%2? .6:-.6));hit(.52,.16);tone(.55,659.25,659.25,.65,.024);}
 else if(chapter===4){sweep(0,.8,500,1800,.03);[196,246.94,293.66,392].forEach((f,i)=>tone(i*.075,f,f,1.3,.04,'sine',(i-1.5)*.4));hit(.22,.06);}
 else {sweep(0,.8,250,3000,.06);hit(.5,.1);[196,293.66,392].forEach((f,i)=>tone(.48+i*.08,f,f,.9,.035,'sine',(i-1)*.4));}
 setTimeout(()=>{delay.disconnect();feedback.disconnect();wet.disconnect();},3500);
 }
}
