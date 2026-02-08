import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";

const C = {
  black:"#000",red:"#E21F26",redGlow:"rgba(226,31,38,.55)",redGlowS:"rgba(226,31,38,.85)",
  cream:"#e8d5b7",grey:"#1a1a1a",green:"#4ade80",greenG:"rgba(74,222,128,0.5)",amber:"#f59e0b",
};

const Styles = () => <style>{`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Special+Elite&family=Source+Code+Pro:wght@400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}body{background:#000;overflow-x:hidden}
::selection{background:rgba(226,31,38,0.4);color:#fff}
@keyframes flicker{0%,19%,21%,23%,25%,54%,56%,100%{opacity:1}20%,24%,55%{opacity:.6}}
@keyframes tb{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes scanM{0%{top:-5%}100%{top:105%}}
@keyframes grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-5%,-10%)}50%{transform:translate(-15%,5%)}90%{transform:translate(-8%,8%)}}
`}</style>;

const Particles = () => {
  const ps = useRef(Array.from({length:45},(_,i)=>({
    id:i,x:Math.random()*100,y:Math.random()*100,s:Math.random()*3+1,
    d:Math.random()*20+15,dl:Math.random()*-20,o:Math.random()*0.3+0.08
  }))).current;
  return <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:1,overflow:"hidden"}}>
    {ps.map(p=><motion.div key={p.id} style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,
      width:p.s,height:p.s,borderRadius:"50%",background:`radial-gradient(circle,${C.redGlow},transparent)`,opacity:p.o}}
      animate={{y:[0,-120,-60,-180,0],x:[0,30,-20,15,0],opacity:[p.o,p.o*1.5,p.o*.5,p.o*1.2,p.o]}}
      transition={{duration:p.d,repeat:Infinity,ease:"linear",delay:p.dl}}/>)}
  </div>;
};

const Overlays = () => <>
  <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9998,
    background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.05) 2px,rgba(0,0,0,.05) 4px)"}}/>
  <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9997,overflow:"hidden"}}>
    <div style={{position:"absolute",left:0,right:0,height:"8%",
      background:"linear-gradient(180deg,transparent,rgba(226,31,38,.03),transparent)",animation:"scanM 6s linear infinite"}}/>
  </div>
  <div style={{position:"fixed",inset:"-50%",width:"200%",height:"200%",pointerEvents:"none",zIndex:9996,opacity:.035,
    background:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    animation:"grain .5s steps(1) infinite"}}/>
</>;

const VHSGlitch = ({children,style={}}) => {
  const [g,setG]=useState(false);
  useEffect(()=>{const iv=setInterval(()=>{if(Math.random()>.85){setG(true);setTimeout(()=>setG(false),80+Math.random()*150)}},2500);return()=>clearInterval(iv)},[]);
  return <div style={{position:"relative",...style}}>{children}
    {g&&<div style={{position:"absolute",inset:0,background:`repeating-linear-gradient(0deg,transparent 0%,rgba(226,31,38,.1) ${Math.random()*5}%,transparent ${Math.random()*10}%)`,
      transform:`translateX(${(Math.random()-.5)*10}px) skewX(${(Math.random()-.5)*2}deg)`,mixBlendMode:"screen",pointerEvents:"none"}}/>}
  </div>;
};

const GlitchText = ({text}) => {
  const [o,setO]=useState({x:0,y:0});const [a,setA]=useState(false);
  useEffect(()=>{const iv=setInterval(()=>{if(Math.random()>.88){setA(true);setO({x:(Math.random()-.5)*6,y:(Math.random()-.5)*4});setTimeout(()=>setA(false),60+Math.random()*100)}},1800);return()=>clearInterval(iv)},[]);
  return <span style={{position:"relative",display:"inline-block"}}>
    {a&&<><span aria-hidden style={{position:"absolute",left:o.x,top:o.y,color:"cyan",opacity:.6,clipPath:`inset(${Math.random()*40}% 0 ${Math.random()*40}% 0)`,pointerEvents:"none"}}>{text}</span>
    <span aria-hidden style={{position:"absolute",left:-o.x,top:-o.y,color:C.red,opacity:.6,clipPath:`inset(${Math.random()*40}% 0 ${Math.random()*40}% 0)`,pointerEvents:"none"}}>{text}</span></>}
    <span>{text}</span></span>;
};

const Reveal = ({children,delay=0}) => {
  const ref=useRef(null);const iv=useInView(ref,{once:true,margin:"-60px"});
  return <motion.div ref={ref} initial={{opacity:0,y:50,filter:"blur(8px)"}}
    animate={iv?{opacity:1,y:0,filter:"blur(0px)"}:{}} transition={{duration:.9,delay,ease:[.25,.46,.45,.94]}}>{children}</motion.div>;
};

const NeonDiv = ({color=C.red})=><div style={{width:"80%",maxWidth:500,height:2,margin:"2.5rem auto",
  background:color,boxShadow:`0 0 8px ${color}80,0 0 20px ${color}60,0 0 40px ${color}30`,borderRadius:1}}/>;

const SHead = ({pretitle,title,delay=0})=><Reveal delay={delay}>
  {pretitle&&<p style={{fontFamily:"'Source Code Pro',monospace",fontSize:".7rem",letterSpacing:".3em",
    color:C.red,textTransform:"uppercase",textAlign:"center",marginBottom:"1rem",textShadow:`0 0 10px ${C.redGlow}`}}>{pretitle}</p>}
  <h2 style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:"clamp(2rem,5vw,3.5rem)",
    color:C.red,textAlign:"center",letterSpacing:".06em",marginBottom:".5rem",
    textShadow:`0 0 30px ${C.redGlowS},0 0 60px ${C.redGlow}`}}><GlitchText text={title}/></h2>
  <NeonDiv/></Reveal>;

const Corners = ({color=C.red})=><>{[{top:0,left:0},{top:0,right:0},{bottom:0,left:0},{bottom:0,right:0}].map((p,i)=>
  <div key={i} style={{position:"absolute",...p,width:18,height:18,
    borderTop:p.top!==undefined?`2px solid ${color}`:"none",borderBottom:p.bottom!==undefined?`2px solid ${color}`:"none",
    borderLeft:p.left!==undefined?`2px solid ${color}`:"none",borderRight:p.right!==undefined?`2px solid ${color}`:"none",
    boxShadow:`0 0 6px ${color}60`}}/>)}</>;

const Gap = ()=><div style={{height:120,background:"linear-gradient(180deg,transparent,rgba(226,31,38,.025) 50%,transparent)",position:"relative",zIndex:2}}/>;

/* ═══ HERO ═══ */
const Hero = () => {
  const {scrollY}=useScroll();
  const op=useTransform(scrollY,[0,600],[1,0]);
  const sc=useTransform(scrollY,[0,600],[1,1.12]);
  const ty=useTransform(scrollY,[0,400],[0,-60]);
  const L="ELIZABETH".split("");
  const W="The Science of Aromas and the Secrets of Wellness.".split(" ");
  return <motion.section style={{position:"relative",height:"100vh",display:"flex",flexDirection:"column",
    alignItems:"center",justifyContent:"center",overflow:"hidden",opacity:op,scale:sc}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,transparent 30%,#000 80%)",zIndex:2}}/>
    <motion.div style={{position:"absolute",inset:"-20%",background:"radial-gradient(ellipse at 50% 60%,rgba(226,31,38,.08),transparent 60%)",zIndex:1}}
      animate={{scale:[1,1.05,1],opacity:[.6,1,.6]}} transition={{duration:8,repeat:Infinity,ease:"easeInOut"}}/>
    <motion.div style={{y:ty,zIndex:3,textAlign:"center",padding:"0 1.5rem"}}>
      <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3,duration:1.5}}
        style={{fontFamily:"'Source Code Pro',monospace",fontSize:".7rem",letterSpacing:".4em",
          color:C.red,textTransform:"uppercase",marginBottom:"1.5rem",textShadow:`0 0 10px ${C.redGlow}`}}>
        @aroma_with_elizabeth presents</motion.p>
      <h1 style={{margin:0,lineHeight:1}}>
        {L.map((l,i)=><motion.span key={i} initial={{opacity:0,y:40,rotateX:-90}} animate={{opacity:1,y:0,rotateX:0}}
          transition={{delay:.8+i*.08,duration:.6,ease:[.16,1,.3,1]}}
          style={{display:"inline-block",fontFamily:"'Playfair Display',serif",fontWeight:900,
            fontSize:"clamp(3rem,10vw,8rem)",color:C.red,letterSpacing:".08em",
            textShadow:`0 0 20px ${C.redGlowS},0 0 60px ${C.redGlow},0 0 120px rgba(226,31,38,.3)`}}>
          <GlitchText text={l}/></motion.span>)}
      </h1>
      <div style={{marginTop:"2rem",display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"0 .45em",maxWidth:700,margin:"2rem auto 0"}}>
        {W.map((w,i)=><motion.span key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
          transition={{delay:2+i*.1,duration:.6}}
          style={{fontFamily:"'Special Elite',cursive",fontSize:"clamp(.85rem,2vw,1.15rem)",
            color:C.cream,letterSpacing:".05em",textShadow:"0 0 15px rgba(232,213,183,.3)"}}>{w}</motion.span>)}
      </div>
      <motion.p initial={{opacity:0}} animate={{opacity:.5}} transition={{delay:3.5,duration:1.5}}
        style={{fontFamily:"sans-serif",fontSize:".8rem",color:C.cream,letterSpacing:".3em",marginTop:".8rem"}}>
        アロマの科学とウェルネスの秘密</motion.p>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:4,duration:1}} style={{marginTop:"3rem"}}>
        <motion.div animate={{y:[0,12,0]}} transition={{duration:2,repeat:Infinity,ease:"easeInOut"}}
          style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
          <span style={{fontFamily:"'Source Code Pro',monospace",fontSize:".6rem",letterSpacing:".3em",
            color:C.red,opacity:.6,textTransform:"uppercase"}}>Enter the Upside Down</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 7L10 13L16 7" stroke={C.red} strokeWidth="2" strokeLinecap="round"/></svg>
        </motion.div>
      </motion.div>
    </motion.div>
  </motion.section>;
};

/* ═══ ABOUT ═══ */
const About = () => {
  const [ti,setTi]=useState(0);const txt="CLASSIFIED PERSONNEL FILE — CLEARANCE LEVEL: OMEGA";
  const ref=useRef(null);const iv=useInView(ref,{once:true,margin:"-100px"});
  useEffect(()=>{if(iv&&ti<txt.length){const t=setTimeout(()=>setTi(p=>p+1),35);return()=>clearTimeout(t)}},[iv,ti]);
  const stats=[{l:"SPECIALIZATION",v:"Aromatherapy & Wellness"},{l:"AFFILIATION",v:"doTERRA / Team ELIGO"},{l:"CODENAME",v:"Elizabeth"},{l:"STATUS",v:"ACTIVE",g:true}];
  return <section ref={ref} id="about" style={{position:"relative",zIndex:3,padding:"6rem 1.5rem",maxWidth:900,margin:"0 auto"}}>
    <Reveal><div style={{fontFamily:"'Source Code Pro',monospace",fontSize:".7rem",color:C.red,
      letterSpacing:".15em",marginBottom:".5rem",textShadow:`0 0 8px ${C.redGlow}`,minHeight:"1.2em"}}>
      {`> ${txt.slice(0,ti)}`}{ti<txt.length&&<span style={{borderRight:`2px solid ${C.red}`,marginLeft:2,animation:"tb 1s infinite"}}/>}
    </div></Reveal>
    <SHead title="About Elizabeth" delay={.1}/>
    <Reveal delay={.2}><VHSGlitch>
      <div style={{position:"relative",border:`1px solid ${C.red}`,borderRadius:2,padding:"2.5rem 2rem",
        background:"linear-gradient(180deg,rgba(26,26,26,.9),rgba(0,0,0,.95))",
        boxShadow:`0 0 30px rgba(226,31,38,.1),inset 0 0 60px rgba(0,0,0,.5)`,overflow:"hidden"}}>
        <Corners/>
        <div style={{position:"absolute",top:16,right:20,fontFamily:"'Source Code Pro',monospace",fontSize:".6rem",
          color:C.red,opacity:.5,letterSpacing:".15em",transform:"rotate(3deg)",border:`1px solid ${C.red}`,padding:"2px 8px"}}>TOP SECRET</div>
        <div style={{display:"flex",gap:"2rem",flexWrap:"wrap",alignItems:"flex-start"}}>
          <motion.div whileHover={{boxShadow:`0 0 30px ${C.redGlowS}`}}
            style={{width:140,height:170,flexShrink:0,border:`1px solid ${C.red}`,
              background:`linear-gradient(135deg,${C.grey},${C.black})`,display:"flex",alignItems:"center",justifyContent:"center",
              position:"relative",overflow:"hidden",boxShadow:`0 0 15px rgba(226,31,38,.15)`}}>
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
              <circle cx="25" cy="18" r="10" stroke={C.red} strokeWidth="1.5" opacity=".5"/>
              <path d="M8 45C8 33 17 27 25 27C33 27 42 33 42 45" stroke={C.red} strokeWidth="1.5" opacity=".5"/>
            </svg>
            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"4px",background:"rgba(226,31,38,.15)",
              fontFamily:"'Source Code Pro',monospace",fontSize:".5rem",color:C.red,textAlign:"center",letterSpacing:".1em"}}>PHOTO REDACTED</div>
          </motion.div>
          <div style={{flex:1,minWidth:240}}>
            <p style={{fontFamily:"'Special Elite',cursive",fontSize:"1rem",lineHeight:1.85,color:C.cream,margin:0}}>
              彼女は「エリザベス」— アロマの奥深い世界へと導く案内人。doTERRA のエッセンシャルオイルを通じて、自然の力とウェルネスの融合を探求し続けている。彼女の知識は、まるで「裏側の世界」から届く光のように、日常に新たな気づきをもたらす。</p>
            <p style={{fontFamily:"'Special Elite',cursive",fontSize:".95rem",lineHeight:1.85,color:C.cream,marginTop:"1rem",opacity:.8}}>
              Instagramでは、アロマの科学的なアプローチと、心身のバランスを整えるためのヒントを日々発信中。Team ELIGOのメンバーとして、仲間と共にウェルネスの新しい形を創り出している。</p>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"1rem",marginTop:"2rem",paddingTop:"1.5rem",borderTop:"1px solid rgba(226,31,38,.2)"}}>
          {stats.map((s,i)=><Reveal key={i} delay={.3+i*.08}><div>
            <div style={{fontFamily:"'Source Code Pro',monospace",fontSize:".6rem",letterSpacing:".2em",color:C.red,opacity:.7,marginBottom:4,textShadow:`0 0 6px ${C.redGlow}`}}>{s.l}</div>
            <div style={{fontFamily:"'Special Elite',cursive",fontSize:".9rem",color:s.g?C.green:C.cream,textShadow:s.g?`0 0 10px ${C.greenG}`:"none"}}>{s.v}</div>
          </div></Reveal>)}
        </div>
      </div>
    </VHSGlitch></Reveal>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:"1.5rem",marginTop:"3rem"}}>
      {[{i:"🧪",t:"Aroma Science",d:"エッセンシャルオイルの化学成分を読み解き、科学的根拠に基づいたウェルネス提案を行う。"},
        {i:"🌿",t:"Natural Wellness",d:"自然由来の力を活かし、心と身体のバランスを整えるホリスティックなアプローチ。"},
        {i:"✨",t:"Team ELIGO",d:"志を同じくする仲間と共に、新しいウェルネスの形を発信し、コミュニティを育てている。"}
      ].map((c,idx)=><Reveal key={idx} delay={.15+idx*.12}>
        <motion.div whileHover={{borderColor:C.red,boxShadow:`0 0 20px ${C.redGlow}`,y:-4}} transition={{duration:.3}}
          style={{border:"1px solid rgba(226,31,38,.25)",borderRadius:2,padding:"1.8rem 1.5rem",cursor:"default",
            background:"linear-gradient(180deg,rgba(26,26,26,.7),rgba(0,0,0,.9))"}}>
          <div style={{fontSize:"1.5rem",marginBottom:".8rem"}}>{c.i}</div>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"1.1rem",color:C.red,
            margin:"0 0 .6rem 0",textShadow:`0 0 15px ${C.redGlow}`}}>{c.t}</h3>
          <p style={{fontFamily:"'Special Elite',cursive",fontSize:".85rem",lineHeight:1.7,color:C.cream,opacity:.8,margin:0}}>{c.d}</p>
        </motion.div>
      </Reveal>)}
    </div>
  </section>;
};

/* ═══ TEAM ELIGO ═══ */
const Eligo = () => {
  const oils=[
    {n:"Lavender",c:"LVD-001",d:"リラックスと安眠のための最も信頼されるオイル。心身の緊張を解きほぐす。",p:"LOW",cl:"#9b7dd4"},
    {n:"Peppermint",c:"PPM-002",d:"集中力と爽快感を高めるクールなエッセンス。頭脳明晰に。",p:"MED",cl:"#6dd4a0"},
    {n:"Frankincense",c:"FRK-003",d:"「オイルの王」と称される神聖な香り。瞑想と深い癒しに。",p:"HIGH",cl:"#d4a06d"},
    {n:"Lemon",c:"LMN-004",d:"気分を明るくし、浄化作用をもたらす爽やかなシトラス。",p:"LOW",cl:"#d4d46d"},
    {n:"On Guard",c:"ONG-005",d:"免疫サポートのためのプロテクティブブレンド。身体の防御力を高める。",p:"CRIT",cl:"#d46d6d"},
    {n:"Deep Blue",c:"DPB-006",d:"筋肉や関節の不快感をケアするスージングブレンド。",p:"HIGH",cl:"#6d8fd4"},
  ];
  const pc={LOW:C.green,MED:C.amber,HIGH:"#f97316",CRIT:C.red};
  return <section id="eligo" style={{position:"relative",zIndex:3,padding:"6rem 1.5rem",maxWidth:1000,margin:"0 auto"}}>
    <SHead pretitle="▸ PROJECT FILE: CLASSIFIED" title="doTERRA: Team ELIGO"/>
    <Reveal delay={.1}><div style={{textAlign:"center",margin:"1rem 0 3rem"}}>
      <motion.div animate={{textShadow:[
        `0 0 10px ${C.redGlowS},0 0 40px ${C.redGlow},0 0 80px rgba(226,31,38,.3)`,
        `0 0 20px ${C.redGlowS},0 0 60px ${C.redGlow},0 0 120px rgba(226,31,38,.4)`,
        `0 0 10px ${C.redGlowS},0 0 40px ${C.redGlow},0 0 80px rgba(226,31,38,.3)`]}}
        transition={{duration:3,repeat:Infinity,ease:"easeInOut"}}
        style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:"clamp(2.5rem,7vw,5rem)",
          color:C.red,letterSpacing:".2em",animation:"flicker 4s infinite"}}>ELIGO</motion.div>
      <p style={{fontFamily:"'Source Code Pro',monospace",fontSize:".65rem",letterSpacing:".25em",
        color:C.cream,opacity:.5,marginTop:".5rem"}}>WELLNESS DEFENSE INITIATIVE</p>
    </div></Reveal>
    <Reveal delay={.2}><VHSGlitch>
      <div style={{border:"1px solid rgba(226,31,38,.3)",borderRadius:2,padding:"2rem",marginBottom:"2.5rem",
        position:"relative",background:"linear-gradient(180deg,rgba(26,26,26,.8),rgba(0,0,0,.95))"}}>
        <Corners/>
        <div style={{fontFamily:"'Source Code Pro',monospace",fontSize:".6rem",letterSpacing:".2em",
          color:C.red,marginBottom:"1rem",textShadow:`0 0 6px ${C.redGlow}`}}>MISSION BRIEF — TEAM ELIGO</div>
        <p style={{fontFamily:"'Special Elite',cursive",fontSize:"1rem",lineHeight:1.85,color:C.cream,margin:0}}>
          Team ELIGOは、doTERRAのエッセンシャルオイルを通じて「本物のウェルネス」を追求するチーム。科学的な知見と自然の叡智を融合させ、一人ひとりの健康と豊かさをサポートする。私たちの使命は、アロマの力で日常を変革し、より良い未来を共に創ること。</p>
        <p style={{fontFamily:"'Special Elite',cursive",fontSize:".95rem",lineHeight:1.85,color:C.cream,marginTop:"1rem",opacity:.7}}>
          「ELIGO」はラテン語で「選ぶ」を意味する。自分自身のウェルネスを、自らの手で選び取る——それが私たちの哲学。</p>
      </div>
    </VHSGlitch></Reveal>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"1.5rem"}}>
      {oils.map((o,i)=><Reveal key={i} delay={.1+i*.08}>
        <motion.div whileHover={{borderColor:o.cl,boxShadow:`0 0 25px ${o.cl}40`,y:-3,scale:1.01}} transition={{duration:.3}}
          style={{border:"1px solid rgba(226,31,38,.2)",borderRadius:2,overflow:"hidden",cursor:"default",
            background:"linear-gradient(180deg,rgba(20,20,20,.9),rgba(0,0,0,.95))"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:".8rem 1.2rem",
            borderBottom:"1px solid rgba(226,31,38,.15)",background:"rgba(226,31,38,.03)"}}>
            <span style={{fontFamily:"'Source Code Pro',monospace",fontSize:".6rem",letterSpacing:".15em",color:C.red,opacity:.7}}>SPECIMEN: {o.c}</span>
            <span style={{fontFamily:"'Source Code Pro',monospace",fontSize:".55rem",letterSpacing:".1em",padding:"2px 8px",
              borderRadius:1,color:pc[o.p],border:`1px solid ${pc[o.p]}50`,background:`${pc[o.p]}10`,
              textShadow:`0 0 6px ${pc[o.p]}60`}}>POTENCY: {o.p}</span>
          </div>
          <div style={{padding:"1.2rem 1.2rem 1.4rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:".8rem",marginBottom:".8rem"}}>
              <motion.div animate={{boxShadow:[`0 0 8px ${o.cl}60`,`0 0 16px ${o.cl}80`,`0 0 8px ${o.cl}60`]}}
                transition={{duration:2,repeat:Infinity}}
                style={{width:32,height:32,borderRadius:"50%",flexShrink:0,
                  background:`radial-gradient(circle at 35% 35%,${o.cl},${o.cl}60)`,border:`1px solid ${o.cl}80`}}/>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"1.2rem",color:C.cream,margin:0}}>{o.n}</h3>
            </div>
            <p style={{fontFamily:"'Special Elite',cursive",fontSize:".85rem",lineHeight:1.7,color:C.cream,opacity:.75,margin:0}}>{o.d}</p>
          </div>
        </motion.div>
      </Reveal>)}
    </div>
  </section>;
};

/* ═══ CONTACT ═══ */
const Contact = () => {
  const [lines,setLines]=useState([]);
  const ref=useRef(null);const iv=useInView(ref,{once:true,margin:"-80px"});
  const fl=[
    {t:"HAWKINS NATIONAL LABORATORY",tp:"h"},{t:"SECURE COMMUNICATIONS TERMINAL v3.14",tp:"s"},
    {t:"————————————————————————————",tp:"d"},{t:"> Establishing secure connection...",tp:"c"},
    {t:"> Connection established.",tp:"g"},{t:"> Loading contact protocols...",tp:"c"},
    {t:"",tp:"b"},{t:"AVAILABLE CHANNELS:",tp:"h"},
  ];
  useEffect(()=>{if(!iv)return;let i=0;const intv=setInterval(()=>{if(i<fl.length){setLines(p=>[...p,fl[i]]);i++}else clearInterval(intv)},200);return()=>clearInterval(intv)},[iv]);
  const tc={h:C.red,s:C.cream,d:"rgba(226,31,38,.3)",c:C.amber,g:C.green,b:"transparent"};

  return <section id="contact" ref={ref} style={{position:"relative",zIndex:3,padding:"6rem 1.5rem 4rem",maxWidth:800,margin:"0 auto"}}>
    <SHead pretitle="▸ COMMUNICATIONS" title="Connect"/>
    <Reveal delay={.15}>
      <div style={{border:"1px solid rgba(226,31,38,.4)",borderRadius:3,overflow:"hidden",
        background:"rgba(0,0,0,.95)",boxShadow:`0 0 40px rgba(226,31,38,.08),inset 0 0 80px rgba(0,0,0,.6)`}}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",
          background:"linear-gradient(90deg,rgba(226,31,38,.12),rgba(226,31,38,.04))",borderBottom:"1px solid rgba(226,31,38,.2)"}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:C.red,boxShadow:`0 0 6px ${C.redGlow}`}}/>
          <div style={{width:10,height:10,borderRadius:"50%",background:C.amber,opacity:.6}}/>
          <div style={{width:10,height:10,borderRadius:"50%",background:C.green,opacity:.6}}/>
          <span style={{fontFamily:"'Source Code Pro',monospace",fontSize:".6rem",letterSpacing:".15em",
            color:C.red,opacity:.6,marginLeft:12}}>TERMINAL — SECURE CHANNEL</span>
        </div>
        <div style={{padding:"1.5rem",fontFamily:"'Source Code Pro',monospace",fontSize:".75rem",lineHeight:1.8,minHeight:280}}>
          {lines.map((l,i)=><motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{duration:.2}}
            style={{color:tc[l.tp]||C.cream,textShadow:l.tp==="h"?`0 0 8px ${C.redGlow}`:"none",
              letterSpacing:l.tp==="h"?".15em":".05em",fontWeight:l.tp==="h"?700:400,
              minHeight:l.tp==="b"?"1em":"auto"}}>{l.t}</motion.div>)}
          {lines.length>=fl.length&&<motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3,duration:.6}} style={{marginTop:".5rem"}}>
            <motion.a href="https://instagram.com/aroma_with_elizabeth" target="_blank" rel="noopener noreferrer"
              whileHover={{x:6,color:C.red}}
              style={{display:"flex",alignItems:"center",gap:".8rem",padding:".6rem 0",color:C.green,
                textDecoration:"none",cursor:"pointer",borderBottom:"1px solid rgba(226,31,38,.08)"}}>
              <span style={{fontSize:"1rem"}}>📷</span>
              <span style={{letterSpacing:".08em"}}>[INSTAGRAM]</span>
              <span style={{opacity:.7}}>@aroma_with_elizabeth</span>
            </motion.a>
            <div style={{marginTop:"1.5rem",display:"flex",alignItems:"center"}}>
              <span style={{color:C.green,marginRight:8}}>{">"}</span>
              <span style={{color:C.cream,opacity:.5}}>DM on Instagram to connect...</span>
              <span style={{display:"inline-block",width:8,height:14,background:C.green,marginLeft:4,animation:"tb 1s step-end infinite"}}/>
            </div>
          </motion.div>}
        </div>
      </div>
    </Reveal>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"1.2rem",marginTop:"2.5rem"}}>
      {[{l:"PLATFORM",v:"Instagram",s:"@aroma_with_elizabeth"},{l:"TEAM",v:"Team ELIGO",s:"doTERRA Wellness Advocate"},{l:"LOCATION",v:"Japan",s:"Spreading wellness nationwide"}
      ].map((it,i)=><Reveal key={i} delay={.1+i*.1}>
        <motion.div whileHover={{borderColor:C.red,boxShadow:"0 0 15px rgba(226,31,38,.15)"}}
          style={{border:"1px solid rgba(226,31,38,.15)",borderRadius:2,padding:"1.3rem 1.2rem",
            background:"linear-gradient(180deg,rgba(20,20,20,.8),rgba(0,0,0,.95))"}}>
          <div style={{fontFamily:"'Source Code Pro',monospace",fontSize:".55rem",letterSpacing:".2em",
            color:C.red,opacity:.6,marginBottom:6,textShadow:`0 0 4px ${C.redGlow}`}}>{it.l}</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"1.1rem",color:C.cream}}>{it.v}</div>
          <div style={{fontFamily:"'Special Elite',cursive",fontSize:".75rem",color:C.cream,opacity:.5,marginTop:4}}>{it.s}</div>
        </motion.div>
      </Reveal>)}
    </div>
  </section>;
};

/* ═══ NAV ═══ */
const Nav = () => {
  const [s,setS]=useState(false);
  useEffect(()=>{const h=()=>setS(window.scrollY>100);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h)},[]);
  return <AnimatePresence>{s&&<motion.nav initial={{y:-60,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-60,opacity:0}} transition={{duration:.35}}
    style={{position:"fixed",top:0,left:0,right:0,zIndex:9999,display:"flex",justifyContent:"center",alignItems:"center",gap:"2rem",
      padding:".8rem 1rem",background:"rgba(0,0,0,.85)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(226,31,38,.15)"}}>
    <span style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:".9rem",color:C.red,
      letterSpacing:".15em",textShadow:`0 0 10px ${C.redGlow}`,marginRight:"1rem"}}>E</span>
    {[{l:"About",h:"#about"},{l:"Team ELIGO",h:"#eligo"},{l:"Connect",h:"#contact"}].map((lk,i)=>
      <motion.a key={i} href={lk.h} whileHover={{color:C.red,textShadow:`0 0 8px ${C.redGlow}`}}
        style={{fontFamily:"'Source Code Pro',monospace",fontSize:".65rem",letterSpacing:".15em",
          color:C.cream,opacity:.7,textDecoration:"none",textTransform:"uppercase"}}>{lk.l}</motion.a>)}
  </motion.nav>}</AnimatePresence>;
};

/* ═══ FOOTER ═══ */
const Footer = () => <footer style={{position:"relative",zIndex:3,textAlign:"center",padding:"3rem 1rem 2rem",borderTop:"1px solid rgba(226,31,38,.1)"}}>
  <motion.div animate={{opacity:[.3,.6,.3]}} transition={{duration:5,repeat:Infinity}}>
    <p style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"1.2rem",color:C.red,
      letterSpacing:".15em",textShadow:`0 0 15px ${C.redGlow}`,marginBottom:".8rem"}}>ELIZABETH</p>
  </motion.div>
  <p style={{fontFamily:"'Source Code Pro',monospace",fontSize:".6rem",letterSpacing:".15em",color:C.cream,opacity:.3}}>
    © {new Date().getFullYear()} — AROMA WITH ELIZABETH — ALL RIGHTS RESERVED</p>
  <p style={{fontFamily:"'Source Code Pro',monospace",fontSize:".55rem",letterSpacing:".1em",color:C.red,opacity:.2,marginTop:".5rem"}}>
    THE UPSIDE DOWN AWAITS</p>
</footer>;

/* ═══ APP ═══ */
export default function App() {
  const [ld,setLd]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLd(true),300);return()=>clearTimeout(t)},[]);
  return <div style={{background:C.black,minHeight:"100vh",color:C.cream,overflowX:"hidden",position:"relative"}}>
    <Styles/><Overlays/><Particles/><Nav/>
    <AnimatePresence>{!ld&&<motion.div key="ld" initial={{opacity:1}} exit={{opacity:0}} transition={{duration:.8}}
      style={{position:"fixed",inset:0,background:C.black,zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center"}}/>}</AnimatePresence>
    <Hero/><Gap/><About/><Gap/><Eligo/><Gap/><Contact/><Footer/>
  </div>;
}
