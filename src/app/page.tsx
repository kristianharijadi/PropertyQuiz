'use client';

import {useCallback,useEffect,useRef,useState} from 'react';
import type * as React from 'react';
import {AnimatePresence,motion} from 'framer-motion';
import {
 ArrowRight,ArrowLeft,ArrowUpRight,Check,ChevronLeft,ChevronRight,
 RotateCcw,X,MousePointer2,MoveHorizontal,Clock3,ShieldCheck,House,
 MapPin,Phone,Heart,Info,Maximize2, Sparkles, BriefcaseBusiness,
 GraduationCap,Activity,Coffee,Trees,ShoppingBag,Dumbbell,HeartPulse,
 Users,TrainFront,Ticket,Building2, CircleCheck, ArrowDown, Compass,
 LockKeyhole,Send,Eye, CircleHelp
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {ASSETS,DESTINATIONS,ENVIRONMENTS,LIFESTYLES,PRIORITIES,TRAVEL,WEEKENDS,PROPERTIES} from '@/lib/data';
import type {Property} from '@/lib/data';
import {Answers,EMPTY_ANSWERS,EMPTY_LEAD,LeadForm,Recommendation,PriorityGroup,generateRecommendations,profileFor,validateLead} from '@/lib/matching';

const DEMO=process.env.NEXT_PUBLIC_DEMO_MODE!=='false';
const INACTIVITY_MS=120_000;
const WARNING_MS=20_000;
const ICONS:Record<string,LucideIcon>={
 'briefcase-business':BriefcaseBusiness,'graduation-cap':GraduationCap,'activity':Activity,
 'coffee':Coffee,'trees':Trees,'shopping-bag':ShoppingBag,'dumbbell':Dumbbell,
 'heart-pulse':HeartPulse,'users':Users,'train-front':TrainFront,'ticket':Ticket,
 'building-2':Building2
};
const BUDGETS=[{value:'',label:'Prefer not to say'},{value:'under2',label:'Up to Rp2 M'},{value:'2to5',label:'Up to Rp5 M'},{value:'5to10',label:'Up to Rp10 M'},{value:'above10',label:'Rp10 M+'}];
const TIMELINES=[{value:'immediate',label:'Immediately'},{value:'3months',label:'Within 3 months'},{value:'6months',label:'Within 6 months'},{value:'year',label:'Within 1 year'},{value:'exploring',label:'Just exploring'}];
const GROUPS:{id:PriorityGroup;title:string;description:string}[]=[
 {id:'must',title:'MUST HAVE',description:'My non-negotiables · max 2'},
 {id:'nice',title:'NICE TO HAVE',description:'Important, but flexible'},
 {id:'not',title:'NOT A PRIORITY',description:'I can live without it'}
];
const STEP_TITLES=['','What matters most in your everyday life?','Which places shape your everyday routine?','Let’s prioritize your ideal lifestyle.','Your ideal weekend looks like…','How far is comfortable for you?','Which environment feels right for you?'];
const STEP_SUB=['','Choose the one thing that matters most.','Select up to three places you visit most often.','Place each priority where it belongs.','Pick the scene that feels most like you.','Set your preferred everyday travel time.','Find the atmosphere you would love to come home to.'];

function TinyIcon({name,size=22}:{name:string;size?:number}){const Icon=ICONS[name]||Sparkles;return <Icon size={size} strokeWidth={1.7}/>}
function RemoteImage({src,alt='',className='',style}:{src:string;alt?:string;className?:string;style?:React.CSSProperties}){
 const [failed,setFailed]=useState(false);
 return <div className={`photo ${className}`} style={style} aria-label={alt} role="img">
 {!failed&&<img src={src} alt={alt} draggable={false} loading="lazy" onError={()=>setFailed(true)}/>}
 <span className="photo-grain" aria-hidden="true"/>
 </div>;
}
function Brand({inverse=false}:{inverse?:boolean}){
 const [logoFailed,setLogoFailed]=useState(false);
 return <div className={`brand ${inverse?'inverse':''}`} aria-label="Sinar Mas Land Property Match">
  {!logoFailed?<img src={inverse?'/sinar-mas-land-white.png':ASSETS.logo} alt="Sinar Mas Land" onError={()=>setLogoFailed(true)} className="brand-logo"/>:
   <span className="brand-fallback"><span className="brand-mark">S</span><span>sinarmas<span className="brand-land">land</span></span></span>}
  <span className="brand-divider"/><span className="brand-product">THE PROPERTY MATCH</span>
 </div>;
}
function DemoLabel(){return <div className="demo-pill"><span className="demo-dot"/> INTERACTIVE CONCEPT {DEMO?'· DEMO':'· LIVE'}</div>}
function BigButton({children,onClick,disabled=false,light=false,type='button'}:{children:React.ReactNode;onClick?:()=>void;disabled?:boolean;light?:boolean;type?:'button'|'submit'}){
 return <button type={type} onClick={onClick} disabled={disabled} className={`big-button ${light?'light':''}`}>
  <span>{children}</span><span className="button-circle"><ArrowUpRight size={24}/></span>
 </button>;
}
function StageFrame({children,step,onBack,onNext,canNext,helper}:{children:React.ReactNode;step:number;onBack:()=>void;onNext:()=>void;canNext:boolean;helper?:React.ReactNode}){
 return <div className="stage-shell">
  <header className="stage-header"><Brand/><div className="header-right"><span className="header-index">THE LIFESTYLE EDITION</span><span className="header-help"><Clock3 size={16}/> ABOUT 60 SECONDS</span></div></header>
  <div className="stage-progress"><div className="progress-caption"><span>YOUR DISCOVERY JOURNEY</span><span>LEVEL {String(step).padStart(2,'0')} <i>/</i> 06</span></div><div className="progress-rail">{Array.from({length:6},(_,i)=><div key={i} className={`progress-piece ${i<step?'filled':''}`}/>)}</div></div>
  <div className="question-heading"><div className="eyebrow"><Sparkles size={15}/> MISSION {String(step).padStart(2,'0')} · YOUR LIFESTYLE, YOUR WAY</div><h1>{STEP_TITLES[step]}</h1><p>{STEP_SUB[step]}</p></div>
  <div className="question-content">{children}</div>
  <footer className="stage-footer"><button className="back-button" onClick={onBack}><ArrowLeft size={21}/> Back</button><div className="footer-hint">{helper||<><MousePointer2 size={17}/> Tap an option to select</>}</div><BigButton onClick={onNext} disabled={!canNext}>Continue <span className="btn-subtext">{String(step).padStart(2,'0')}/06</span></BigButton></footer>
 </div>;
}

function LifestyleScreen({value,onSelect}:{value:string;onSelect:(v:string)=>void}){
 return <div className="lifestyle-grid">{LIFESTYLES.map((item,i)=><button key={item.id} className={`lifestyle-card ${value===item.id?'selected':''}`} onClick={()=>onSelect(item.id)}>
 <RemoteImage src={item.image} alt={item.title}/><div className="lifestyle-shade"/>
 <span className="card-number">0{i+1}</span><span className="lifestyle-check"><Check size={19}/></span>
 <span className="lifestyle-text"><span className="lifestyle-icon"><TinyIcon name={item.icon} size={21}/></span><strong>{item.title}</strong><small>{item.description}</small></span>
 </button>)}</div>;
}
function DestinationScreen({value,onToggle,notify}:{value:string[];onToggle:(v:string)=>void;notify:(v:string)=>void}){
 return <><div className="destination-top"><div className="selected-count"><strong>{value.length}</strong><span> / 3 SELECTED</span></div><p>We&apos;re discovering what your daily world looks like.</p></div>
 <div className="destination-grid">{DESTINATIONS.map((item,i)=><button key={item.id} className={`destination-card ${value.includes(item.id)?'selected':''}`} onClick={()=>{if(value.length>=3&&!value.includes(item.id))notify('Pilih maksimal 3 destinasi. Hapus satu pilihan terlebih dahulu.');else onToggle(item.id)}}>
 <span className="destination-number">0{i+1}</span><span className="destination-icon"><TinyIcon name={item.icon} size={31}/></span><span className="destination-name">{item.title}</span><span className="destination-check"><Check size={18}/></span>
 </button>)}</div></>;
}
function PriorityScreen({value,onAssign,notify}:{value:Record<string,PriorityGroup>;onAssign:(id:string,group:PriorityGroup)=>void;notify:(v:string)=>void}){
 const [pending,setPending]=useState<string|null>(null);
 const [dragging,setDragging]=useState<{id:string;x:number;y:number}|null>(null);
 const dragStart=useRef<{id:string;x:number;y:number}|null>(null);
 const used=Object.keys(value).length;
 function assign(id:string,group:PriorityGroup){
  if(group==='must'&&value[id]!=='must'&&Object.values(value).filter(v=>v==='must').length>=2){notify('Maksimal 2 prioritas dalam MUST HAVE.');return}
  onAssign(id,group);setPending(null);setDragging(null);
 }
 function pointerDown(e:React.PointerEvent,id:string){if(e.button!==0)return;dragStart.current={id,x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId)}
 function pointerMove(e:React.PointerEvent,id:string){if(!dragStart.current||dragStart.current.id!==id)return;const dx=e.clientX-dragStart.current.x,dy=e.clientY-dragStart.current.y;if(Math.abs(dx)+Math.abs(dy)>8)setDragging({id,x:dx,y:dy});}
 function pointerUp(e:React.PointerEvent,id:string){const start=dragStart.current;if(!start||start.id!==id)return;const moved=Math.hypot(e.clientX-start.x,e.clientY-start.y)>18;dragStart.current=null;
  if(moved){const node=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-zone]');const zone=node?.getAttribute('data-zone') as PriorityGroup|null;if(zone)assign(id,zone);else setDragging(null)}
  else setPending(id);
  setDragging(null);
 }
 const card=(id:string)=>{
  const item=PRIORITIES.find(p=>p.id===id)!;
  return <button key={id} type="button" className={`priority-pill ${dragging?.id===id?'dragging':''} ${pending===id?'pending':''}`} style={dragging?.id===id?{transform:`translate(${dragging.x}px,${dragging.y}px)`}:undefined} onPointerDown={e=>pointerDown(e,id)} onPointerMove={e=>pointerMove(e,id)} onPointerUp={e=>pointerUp(e,id)} onPointerCancel={()=>{dragStart.current=null;setDragging(null)}} aria-label={`Move ${item.title}`}>
  <span className="priority-grip"><MoveHorizontal size={18}/></span><TinyIcon name={item.icon} size={23}/><span>{item.title}</span><span className="priority-more"><ArrowUpRight size={16}/></span>
  </button>;
 };
 return <div className="priority-layout">
  <div className="priority-left"><div className="priority-label"><span>YOUR PRIORITIES</span><span>{used} OF 5 PLACED</span></div>
   <div className="priority-unassigned">{PRIORITIES.filter(p=>!value[p.id]).map(p=>card(p.id))}{used===5&&<div className="all-placed"><CircleCheck size={22}/> All five priorities placed. You&apos;re good to go.</div>}</div>
   <div className="priority-instructions"><MoveHorizontal size={20}/><span>Drag a priority into a column, or tap it to choose a category.</span></div>
  </div>
  <div className="priority-zones">{GROUPS.map((group,index)=><div className={`priority-zone zone-${group.id}`} key={group.id} data-zone={group.id}>
    <div className="zone-heading"><span className="zone-index">0{index+1}</span><div><h3>{group.title}</h3><p>{group.description}</p></div><span className="zone-count">{Object.values(value).filter(v=>v===group.id).length}</span></div>
    <div className="zone-items">{PRIORITIES.filter(p=>value[p.id]===group.id).map(p=>card(p.id))}{!PRIORITIES.some(p=>value[p.id]===group.id)&&<span className="zone-placeholder">Drop your priorities here <ArrowDown size={16}/></span>}</div>
   </div>)}</div>
  <AnimatePresence>{pending&&<motion.div className="sort-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setPending(null)}>
    <motion.div className="sort-panel" initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:30,opacity:0}} onClick={e=>e.stopPropagation()}>
     <span className="eyebrow">WHERE DOES THIS BELONG?</span><h2>{PRIORITIES.find(p=>p.id===pending)?.title}</h2><div className="sort-options">{GROUPS.map(g=><button key={g.id} onClick={()=>assign(pending,g.id)}><span>{g.title}</span><ArrowRight size={22}/></button>)}</div><button className="sort-close" onClick={()=>setPending(null)}><X size={19}/> Cancel</button>
    </motion.div></motion.div>}</AnimatePresence>
 </div>;
}
function WeekendScreen({value,onSelect}:{value:string;onSelect:(v:string)=>void}){
 const slider=useRef<HTMLDivElement>(null);
 const shift=(dir:number)=>slider.current?.scrollBy({left:dir*350,behavior:'smooth'});
 return <div className="weekend-wrap"><div className="weekend-slider" ref={slider}>
  {WEEKENDS.map((w,i)=><button key={w.id} className={`weekend-slide ${value===w.id?'selected':''}`} onClick={()=>onSelect(w.id)}><RemoteImage src={w.image} alt={w.title}/><div className="weekend-shade"/><span className="weekend-number">0{i+1}/05</span><div className="weekend-copy"><span>YOUR WEEKEND PERSONALITY</span><h3>{w.title}</h3><p>{w.subtitle}</p></div><div className="weekend-selected"><Check size={22}/></div></button>)}
 </div><div className="weekend-actions"><span><MoveHorizontal size={19}/> Swipe or tap to explore your weekend</span><div><button onClick={()=>shift(-1)} aria-label="Previous"><ChevronLeft size={24}/></button><button onClick={()=>shift(1)} aria-label="Next"><ChevronRight size={24}/></button></div></div></div>;
}
function TravelScreen({value,onSelect}:{value:string;onSelect:(v:string)=>void}){
 const index=TRAVEL.findIndex(x=>x.id===value);
 const current=index>=0?index:1;
 return <div className="travel-layout"><div className="travel-emphasis"><span className="micro-label">YOUR IDEAL DAILY COMMUTE</span><div className="travel-visual"><Clock3 size={47} strokeWidth={1.3}/><strong>{value?TRAVEL[current].short:'—'}</strong></div><p>{value?TRAVEL[current].title:'Slide or tap to set your preferred travel time.'}</p></div>
 <div className="travel-chooser"><span className="micro-label">A LITTLE LESS TRAVEL. A LOT MORE LIFE.</span><div className="travel-rule"><input type="range" min="0" max="4" value={current} onChange={e=>onSelect(TRAVEL[Number(e.target.value)].id)} style={{'--fill':`${current*25}%`} as React.CSSProperties} aria-label="Preferred travel time"/>
 <div className="travel-ticks">{TRAVEL.map((t,i)=><button type="button" className={value===t.id?'active':''} onClick={()=>onSelect(t.id)} key={t.id}><span className="tick-mark"/><span>{t.short}</span></button>)}</div></div>
 <div className="travel-notice"><Info size={19}/><span>Actual route estimates are not shown until verified routing data is connected.</span></div></div></div>;
}
function EnvironmentScreen({value,onSelect}:{value:string;onSelect:(v:string)=>void}){
 const [current,setCurrent]=useState(Math.max(0,ENVIRONMENTS.findIndex(e=>e.id===value)));
 const touch=useRef<number|null>(null);
 const item=ENVIRONMENTS[current];
 const move=(offset:number)=>setCurrent(c=>(c+offset+ENVIRONMENTS.length)%ENVIRONMENTS.length);
 return <div className="environment-layout">
  <div className="environment-stack" onTouchStart={e=>{touch.current=e.changedTouches[0].clientX}} onTouchEnd={e=>{if(touch.current===null)return;const diff=e.changedTouches[0].clientX-touch.current;if(Math.abs(diff)>60){if(diff>0)onSelect(item.id);else move(1)}touch.current=null}}>
   <div className="environment-ghost ghost-two"/><div className="environment-ghost ghost-one"/><RemoteImage src={item.image} alt={item.title} className="environment-image"/><div className="environment-shade"/><div className="environment-overlay"><span>ATMOSPHERE 0{current+1} / 04</span><h3>{item.title}</h3><p>{item.description}</p></div>{value===item.id&&<div className="environment-chosen"><Check size={25}/></div>}
  </div><div className="environment-side"><span className="micro-label">FIND YOUR FEELING</span><h2>Where you live shapes how you live.</h2><p>Explore four different characters, then choose the one that feels like home.</p><div className="environment-list">{ENVIRONMENTS.map((env,i)=><button key={env.id} onClick={()=>setCurrent(i)} className={i===current?'active':''}><span>0{i+1}</span><strong>{env.title}</strong><ArrowUpRight size={19}/></button>)}</div><button onClick={()=>onSelect(item.id)} className={`select-environment ${value===item.id?'picked':''}`}>{value===item.id?<><Check size={20}/> Selected as my ideal setting</>:<>This feels like home <ArrowRight size={21}/></>}</button><div className="environment-swipe"><MoveHorizontal size={18}/> Swipe left to explore; right to select</div></div>
 </div>;
}
function LeadScreen({lead,setLead,submit,errors,onBack,busy,error}:{lead:LeadForm;setLead:(v:LeadForm)=>void;submit:()=>void;errors:Partial<Record<keyof LeadForm,string>>;onBack:()=>void;busy:boolean;error:string}){
 const update=(key:keyof LeadForm,val:string|boolean)=>setLead({...lead,[key]:val});
 const [activeField,setActiveField]=useState<'name'|'whatsapp'|'email'|null>(null);
 const [shift,setShift]=useState(false);
 const [symbols,setSymbols]=useState(false);
 const inputRefs=useRef<Partial<Record<'name'|'whatsapp'|'email',HTMLInputElement|null>>>({});
 const fieldNames={name:'Full Name',whatsapp:'WhatsApp Number',email:'Email'};
 function keyboardInput(key:string){
  if(!activeField)return;
  const input=inputRefs.current[activeField];
  const value=lead[activeField];
  let start=input?.selectionStart??value.length,end=input?.selectionEnd??value.length;
  if(key==='backspace'&&start===end&&start>0)start--;
  const inserted=key==='backspace'?'':key;
  update(activeField,value.slice(0,start)+inserted+value.slice(end));
  requestAnimationFrame(()=>{input?.focus();input?.setSelectionRange(start+inserted.length,start+inserted.length)});
 }
 const rows=activeField==='whatsapp'?['123','456','789','+0-']:symbols?['1234567890','@#$%&*()-','_+=/!?']:['qwertyuiop','asdfghjkl','zxcvbnm'];
 return <div className="lead-shell"><header className="stage-header"><Brand/><DemoLabel/></header><div className="lead-content"><div className="lead-story"><div className="eyebrow light-eyebrow"><span className="eyebrow-line"/> YOUR MATCH IS ALMOST READY</div><h1>Your lifestyle match <em>is ready.</em></h1><p>We&apos;ve discovered what matters to you. One last step to unlock your personalized property selection.</p><div className="lead-preview"><span>01 — 06</span><div className="lead-preview-bar">{Array.from({length:6},(_,i)=><span key={i}/>)}</div><strong>YOUR LIFESTYLE DISCOVERED <Check size={19}/></strong></div><RemoteImage src={ASSETS.navapark} alt="NavaPark BSD City" className="lead-photo"/></div>
  <div className="lead-form-panel"><div className="lead-form-heading"><span className="micro-label">UNLOCK YOUR RESULTS / 01</span><h2>Let&apos;s make it personal.</h2><p>Tell us how we can help you find the right place.</p></div>
   <form onSubmit={e=>{e.preventDefault();submit()}} noValidate>
    <div className="form-row"><div className="form-group"><label htmlFor="full-name">Full Name <b>*</b></label><input ref={el=>{inputRefs.current.name=el}} id="full-name" autoComplete="name" inputMode="none" onFocus={()=>setActiveField('name')} placeholder="Your full name" value={lead.name} onChange={e=>update('name',e.target.value)}/>{errors.name&&<span className="field-error">{errors.name}</span>}</div>
    <div className="form-group"><label htmlFor="whatsapp">WhatsApp Number <b>*</b></label><input ref={el=>{inputRefs.current.whatsapp=el}} id="whatsapp" type="tel" inputMode="none" onFocus={()=>setActiveField('whatsapp')} placeholder="08xx xxxx xxxx" value={lead.whatsapp} onChange={e=>update('whatsapp',e.target.value)}/>{errors.whatsapp&&<span className="field-error">{errors.whatsapp}</span>}</div></div>
    <div className="form-row"><div className="form-group"><label htmlFor="email">Email <span>(Optional)</span></label><input ref={el=>{inputRefs.current.email=el}} id="email" type="text" inputMode="none" autoComplete="email" onFocus={()=>setActiveField('email')} placeholder="you@email.com" value={lead.email} onChange={e=>update('email',e.target.value)}/>{errors.email&&<span className="field-error">{errors.email}</span>}</div>
    <div className="form-group"><label htmlFor="budget">Budget Range <span>(Optional)</span></label><select id="budget" value={lead.budget} onChange={e=>update('budget',e.target.value)}>{BUDGETS.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}</select></div></div>
    <div className="form-group timeline"><label>When are you planning to buy? <b>*</b></label><div className="timeline-options">{TIMELINES.map(t=><button key={t.value} type="button" onClick={()=>update('timeline',t.value)} className={lead.timeline===t.value?'active':''}>{t.label}</button>)}</div>{errors.timeline&&<span className="field-error">{errors.timeline}</span>}</div>
    <label className="consent-row"><input type="checkbox" checked={lead.consent} onChange={e=>update('consent',e.target.checked)}/><span>I agree to the collection and use of my information for personalized property recommendations and follow-up by the sales team. <a href="https://www.sinarmasland.com/id/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy <ArrowUpRight size={12}/></a></span></label>{errors.consent&&<span className="field-error">{errors.consent}</span>}
    {DEMO&&<p className="demo-notice"><Info size={17}/> Demo preview: data entered is not transmitted or saved. Use sample contact details when testing.</p>}
    {error&&<div role="alert" className="submit-error">{error}</div>}
    <div className="lead-form-footer"><button className="back-button" type="button" onClick={onBack}><ArrowLeft size={19}/> Back</button><button type="submit" disabled={busy} className="reveal-button">{busy?'Saving…':'Reveal My Results'} <ArrowUpRight size={22}/></button></div>
   </form></div></div>{activeField&&<div className="keyboard-dock" role="group" aria-label={`On-screen keyboard for ${fieldNames[activeField]}`} onPointerDown={e=>e.preventDefault()}>
    <div className="keyboard-heading"><span><Sparkles size={16}/> ENTER YOUR {fieldNames[activeField].toUpperCase()}</span><button type="button" onClick={()=>{inputRefs.current[activeField]?.blur();setActiveField(null)}}>Done <Check size={17}/></button></div><div className="keyboard-preview" aria-live="polite">{lead[activeField]||`Tap the keys to enter your ${fieldNames[activeField].toLowerCase()}`}</div>
    <div className={`keyboard-keys ${activeField==='whatsapp'?'numeric':''}`}>{rows.map((row,i)=><div className="keyboard-row" key={i}>{Array.from(row).map((character,j)=><button type="button" key={`${character}-${j}`} onClick={()=>keyboardInput(shift?character.toUpperCase():character)}>{shift?character.toUpperCase():character}</button>)}</div>)}
     <div className="keyboard-row keyboard-actions">{activeField!=='whatsapp'&&<><button type="button" onClick={()=>setShift(!shift)} aria-pressed={shift}>⇧</button><button type="button" onClick={()=>setSymbols(!symbols)}>{symbols?'ABC':'?123'}</button><button type="button" onClick={()=>keyboardInput('@')}>@</button><button type="button" className="keyboard-space" onClick={()=>keyboardInput(' ')}>Space</button><button type="button" onClick={()=>keyboardInput('.')}>.</button></>}<button type="button" onClick={()=>keyboardInput('backspace')} aria-label="Backspace">⌫</button></div>
    </div></div>}</div>;
}
function MatchCard({rec,rank,onExplore}:{rec:Recommendation;rank:number;onExplore:()=>void}){
 const {property}=rec;
 return <button className={`match-card rank-${rank}`} onClick={onExplore}><div className="match-image-area"><RemoteImage src={property.image} alt={property.name}/><div className="match-image-shade"/><div className="match-badge">{rec.position}</div><div className="match-circle"><strong>{rec.percentage}<sup>%</sup></strong><span>MATCH*</span></div></div>
 <div className="match-body"><div className="match-tag"><MapPin size={14}/> {property.township} <span>•</span> RESIDENTIAL</div><h3>{property.name}</h3><p>{property.description}</p><div className="match-divider"/><div className="match-why"><span>WHY IT MATCHES</span><strong>{rec.reasons[0]}</strong></div><div className="match-bottom"><span>{property.priceLabel}</span><span>Explore Property <ArrowUpRight size={21}/></span></div></div></button>;
}
function ResultsScreen({answers,recommendations,onBack,onExplore,onReset,onContact}:{answers:Answers;recommendations:Recommendation[];onBack:()=>void;onExplore:(p:Property)=>void;onReset:()=>void;onContact:()=>void}){
 const profile=profileFor(answers);
 return <div className="result-shell"><header className="stage-header"><Brand/><div className="result-actions"><button onClick={onReset}><RotateCcw size={18}/> Start Again</button><button className="result-contact" onClick={onContact}><Phone size={18}/> Talk to Our Team</button></div></header>
  <div className="result-intro"><div><div className="eyebrow"><span className="eyebrow-line"/> YOUR LIFESTYLE PROFILE</div><p className="result-kicker">WE FOUND YOUR SWEET SPOT.</p><h1>{profile.title}</h1><p className="result-description">{profile.description}</p></div><div className="profile-pillbox"><div><span>YOUR TOP PRIORITIES</span><strong>{profile.top.slice(0,2).join(' · ')}</strong></div><div><span>YOUR IDEAL ENVIRONMENT</span><strong>{profile.environment}</strong></div><div><span>WEEKEND PERSONALITY</span><strong>{profile.weekend}</strong></div></div></div>
  <div className="result-divider"><div><Sparkles size={21}/><h2>Three places to call yours.</h2></div><span>CURATED AROUND YOUR LIFESTYLE / DEMO MATCHING</span></div>
  {recommendations.length>0?<div className="match-grid">{recommendations.map((rec,i)=><MatchCard key={rec.property.id} rec={rec} rank={i} onExplore={()=>onExplore(rec.property)}/>)}</div>:<div className="no-results"><CircleHelp size={34}/><h2>Let's find another way forward.</h2><p>No sample properties fit the selected budget. A sales advisor can help with more options.</p><button onClick={onContact}>Talk to sales <ArrowRight size={20}/></button></div>}
  {recommendations.length>0&&recommendations.length<3&&<p className="result-warning">Only {recommendations.length} demo properties fit your budget filter. A sales advisor can suggest more alternatives.</p>}
  <footer className="result-footer"><span><Info size={16}/> *Persentase adalah simulasi dari data contoh, BUKAN penilaian properti aktual. Harga dan ketersediaan perlu dikonfirmasi.</span><button onClick={onBack}><ArrowLeft size={17}/> Edit Preferences</button></footer>
 </div>;
}
function PropertyModal({property,rec,onClose,onSelect,onContact,selected}:{property:Property;rec:Recommendation|undefined;onClose:()=>void;onSelect:()=>void;onContact:()=>void;selected:boolean}){
 return <motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}>
 <motion.div className="property-modal" initial={{x:90,opacity:0}} animate={{x:0,opacity:1}} exit={{x:90,opacity:0}} transition={{type:'spring',damping:26,stiffness:250}} onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label={property.name}>
 <div className="modal-photo"><RemoteImage src={property.image} alt={property.name}/><button className="modal-close" onClick={onClose} aria-label="Close"><X size={24}/></button><span className="modal-position">{rec?.position||'PROPERTY DETAILS'}</span></div>
 <div className="modal-copy"><span className="micro-label"><MapPin size={15}/> {property.township} · RESIDENTIAL</span><h2>{property.name}</h2><p>{property.description}</p><div className="modal-price"><span>INDICATIVE STARTING PRICE</span><strong>{property.priceLabel}</strong><small>Refer to official page for latest pricing.</small></div>
 <div className="modal-columns"><div><span className="micro-label">PROJECT HIGHLIGHTS</span>{property.amenities.map(x=><div className="modal-amenity" key={x}><Check size={16}/>{x}</div>)}</div><div><span className="micro-label">AREA REFERENCE</span>{property.nearby.map(x=><div className="modal-amenity" key={x}><MapPin size={16}/>{x}</div>)}</div></div>
 {rec&&<div className="modal-breakdown"><span className="micro-label">WHY IT MATCHES · DEMO SCORE</span>{rec.reasons.map((r,i)=><div key={r}><span>0{i+1}</span>{r}</div>)}</div>}
 <div className="modal-buttons"><button onClick={onSelect} className={`interest-button ${selected?'done':''}`}>{selected?<><Check size={19}/> Added to your interest</>:<><Heart size={19}/> I'm Interested</>}</button><a target="_blank" rel="noreferrer" href={property.sourceUrl} className="official-link">Official Project Page <ArrowUpRight size={18}/></a></div><button className="modal-contact" onClick={onContact}><Phone size={18}/> Talk to our sales team <ArrowRight size={17}/></button>
 </div></motion.div></motion.div>;
}
function ContactModal({onClose}:{onClose:()=>void}){return <motion.div className="modal-backdrop contact-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}><motion.div className="contact-panel" initial={{scale:.95,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.95,opacity:0}} onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Talk to a Sinar Mas Land sales advisor"><button onClick={onClose} className="contact-close"><X size={24}/></button><div className="contact-icon"><Phone size={28}/></div><div className="eyebrow">TAKE THE NEXT STEP</div><h2>Let&apos;s find your place, together.</h2><p>For current availability, price confirmation, and a property tour, speak with the official BSD City marketing office.</p><div className="contact-info"><span>BSD CITY MARKETING OFFICE</span><strong>+62 21 5315 9000</strong><small>Jl. Grand Boulevard BSD City, Sampora, Tangerang, Banten</small></div><div className="contact-links"><a href="tel:+622153159000"><Phone size={18}/> Call Marketing Office <ArrowUpRight size={17}/></a><a target="_blank" rel="noreferrer" href="https://www.sinarmasland.com/development/residential/bsd-city">Explore Official Website <ArrowUpRight size={17}/></a></div></motion.div></motion.div>}

export default function Home(){
 const [step,setStep]=useState(0);
 const [answers,setAnswers]=useState<Answers>(EMPTY_ANSWERS);
 const [lead,setLead]=useState<LeadForm>(EMPTY_LEAD);
 const [errors,setErrors]=useState<Partial<Record<keyof LeadForm,string>>>({});
 const [leadError,setLeadError]=useState('');
 const [recommendations,setRecommendations]=useState<Recommendation[]>([]);
 const [busy,setBusy]=useState(false);
 const [sessionId,setSessionId]=useState('');
 const [selectedProperty,setSelectedProperty]=useState<Property|null>(null);
 const [interested,setInterested]=useState<string[]>([]);
 const [contactVisible,setContactVisible]=useState(false);
 const [message,setMessage]=useState('');
 const [secondsRemaining,setSecondsRemaining]=useState(0);
 const lastInteraction=useRef(Date.now());
 const submission=useRef(0);
 const notify=(text:string)=>{setMessage(text);setTimeout(()=>setMessage(''),3600)};
 const updateAnswers=(patch:Partial<Answers>)=>setAnswers(a=>({...a,...patch}));
 const reset=useCallback(()=>{submission.current++;setBusy(false);setStep(0);setAnswers({...EMPTY_ANSWERS,priorities:{},destinations:[]});setLead({...EMPTY_LEAD});setRecommendations([]);setErrors({});setLeadError('');setSelectedProperty(null);setContactVisible(false);setSessionId('');setInterested([]);setSecondsRemaining(0);lastInteraction.current=Date.now()},[]);
 useEffect(()=>{
  const id=setInterval(()=>{if(step===0||contactVisible||selectedProperty)return;const elapsed=Date.now()-lastInteraction.current;setSecondsRemaining(elapsed>=INACTIVITY_MS-WARNING_MS?Math.max(0,Math.ceil((INACTIVITY_MS-elapsed)/1000)):0);if(elapsed>=INACTIVITY_MS)reset()},1000);
  return ()=>clearInterval(id);
 },[step,contactVisible,selectedProperty,reset]);
 function activity(){lastInteraction.current=Date.now();if(secondsRemaining)setSecondsRemaining(0)}
 function start(){setSessionId(crypto.randomUUID());setStep(1);activity()}
 const canContinue=step===1?!!answers.lifestyle:step===2?answers.destinations.length>=1:step===3?PRIORITIES.every(x=>!!answers.priorities[x.id]):step===4?!!answers.weekend:step===5?!!answers.travel:step===6?!!answers.environment:false;
 function back(){setStep(s=>Math.max(0,s-1));activity()}
 function next(){if(!canContinue)return;setStep(s=>Math.min(7,s+1));activity()}
 function toggleDest(id:string){setAnswers(a=>({...a,destinations:a.destinations.includes(id)?a.destinations.filter(v=>v!==id):[...a.destinations,id]}))}
 async function submitLead(){
  const validation=validateLead(lead);setErrors(validation);if(Object.keys(validation).length){notify('Mohon lengkapi data yang diperlukan.');return}
  const requestId=++submission.current;setBusy(true);setLeadError('');setStep(9);activity();
  const bumper=new Promise<void>(resolve=>setTimeout(resolve,3200));
  try{if(DEMO){const results=generateRecommendations(answers,lead.budget);await bumper;if(requestId!==submission.current)return;setRecommendations(results);setStep(8);activity();return}
   const res=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId,answers,lead})});const payload=await res.json();if(!res.ok||!payload.saved)throw Error(payload.error||'Gagal menyimpan lead.');
   const mapped:Recommendation[]=payload.recommendations.map((r:{propertyId:string;score:number;percentage:number;position:Recommendation['position'];breakdown:Recommendation['breakdown'];reasons:string[]})=>({...r,property:PROPERTIES.find(p=>p.id===r.propertyId)!})).filter((r:Recommendation)=>!!r.property);
   await bumper;if(requestId!==submission.current)return;setRecommendations(mapped);setStep(8);activity();
  }catch(e){if(requestId===submission.current){setLeadError(e instanceof Error?e.message:'Network error. Please try again.');setStep(7);activity()}}finally{if(requestId===submission.current)setBusy(false)}
 }
 async function trackEvent(kind:'explored'|'selected'|'contact_sales',propertyId?:string){if(DEMO)return;try{await fetch('/api/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId,kind,propertyId})})}catch{/* nonblocking */}}
 function explore(p:Property){setSelectedProperty(p);trackEvent('explored',p.id)}
 function choose(p:Property){setInterested(s=>s.includes(p.id)?s:[...s,p.id]);trackEvent('selected',p.id);notify(`${p.name} saved to your interests.`)}
 function contact(){setContactVisible(true);trackEvent('contact_sales',selectedProperty?.id)}
 return <main className="kiosk-app" onPointerDown={activity} onKeyDown={activity}>
  <AnimatePresence mode="wait" initial={false}>
   {step===0&&<motion.div key="welcome" className="welcome-screen" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.42}}>
    <RemoteImage src={ASSETS.hero} alt="NavaPark township by Sinar Mas Land" className="welcome-image"/><div className="welcome-gradient"/><div className="welcome-ornament"/>
    <header className="welcome-header"><Brand inverse/><DemoLabel/></header>
    <div className="welcome-main"><div className="welcome-text"><div className="welcome-line"><span/> THE LIFESTYLE DISCOVERY EXPERIENCE</div><h1>Your next home<br/>is closer than<br/><em>you think.</em></h1><p>Don&apos;t just find a house. Find a place that fits your life.</p><div className="welcome-cta"><BigButton onClick={start}>Start Your Journey</BigButton><span className="welcome-duration"><Clock3 size={21}/> ONLY 60 SECONDS</span></div></div><div className="welcome-sidecard"><span>01 / A NEW WAY TO DISCOVER HOME</span><div className="sidecard-art"><House size={55} strokeWidth={1}/><Sparkles size={28} strokeWidth={1}/></div><p>Six simple questions.<br/>One personal discovery.<br/><strong>A place that feels yours.</strong></p><div className="sidecard-bottom"><span>DISCOVER <ArrowUpRight size={15}/></span><span>2026 EDITION</span></div></div></div>
    <footer className="welcome-footer"><span>AN IMMERSIVE PROPERTY DISCOVERY</span><span>POWERED BY YOUR LIFESTYLE <span className="footer-sun">✳</span></span></footer>
   </motion.div>}
   {step>=1&&step<=6&&<motion.div className="step-wrapper" key={`question-${step}`} initial={{opacity:0,x:28}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-25}} transition={{duration:.25}}>
     <StageFrame step={step} onBack={back} onNext={next} canNext={canContinue} helper={step===2?<><Check size={17}/> {answers.destinations.length} of 3 destinations selected</>:step===3?<><MoveHorizontal size={18}/> Drag or tap to categorize all 5</>:step===4?<><MoveHorizontal size={18}/> Swipe to discover more</>:undefined}>
      {step===1&&<LifestyleScreen value={answers.lifestyle} onSelect={v=>updateAnswers({lifestyle:v})}/>}
      {step===2&&<DestinationScreen value={answers.destinations} onToggle={toggleDest} notify={notify}/>}
      {step===3&&<PriorityScreen value={answers.priorities} notify={notify} onAssign={(id,group)=>setAnswers(a=>({...a,priorities:{...a.priorities,[id]:group}}))}/>}
      {step===4&&<WeekendScreen value={answers.weekend} onSelect={v=>updateAnswers({weekend:v})}/>}
      {step===5&&<TravelScreen value={answers.travel} onSelect={v=>updateAnswers({travel:v})}/>}
      {step===6&&<EnvironmentScreen value={answers.environment} onSelect={v=>updateAnswers({environment:v})}/>}
     </StageFrame>
   </motion.div>}
   {step===7&&<motion.div key="lead" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:.25}}><LeadScreen lead={lead} setLead={setLead} errors={errors} error={leadError} submit={submitLead} busy={busy} onBack={back}/></motion.div>}
   {step===9&&<motion.div key="matching" className="matching-screen" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,scale:1.03}} transition={{duration:.4}} role="status" aria-live="polite"><header className="matching-header"><Brand inverse/><span>YOUR DISCOVERY JOURNEY</span></header><div className="matching-content"><div className="matching-orbit" aria-hidden="true"><span className="orbit-ring orbit-ring-one"/><span className="orbit-ring orbit-ring-two"/><span className="orbit-dot orbit-dot-one"/><span className="orbit-dot orbit-dot-two"/><div className="matching-core"><Sparkles size={42}/></div></div><span className="matching-label">YOUR ANSWERS ARE IN</span><h1>Finding your<br/><em>perfect fit.</em></h1><p>We’re bringing your lifestyle and preferences together.</p><div className="matching-loader" aria-hidden="true"><span/></div><div className="matching-caption">CURATING YOUR PERSONAL MATCH <span>✦</span></div></div></motion.div>}
   {step===8&&<motion.div key="results" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-15}} transition={{duration:.42}}><ResultsScreen answers={answers} recommendations={recommendations} onBack={()=>setStep(7)} onExplore={explore} onReset={reset} onContact={contact}/></motion.div>}
  </AnimatePresence>
  <AnimatePresence>{selectedProperty&&<PropertyModal property={selectedProperty} rec={recommendations.find(r=>r.property.id===selectedProperty.id)} onClose={()=>setSelectedProperty(null)} onSelect={()=>{if(selectedProperty)choose(selectedProperty)}} onContact={contact} selected={interested.includes(selectedProperty.id)}/>}</AnimatePresence>
  <AnimatePresence>{contactVisible&&<ContactModal onClose={()=>setContactVisible(false)}/>}</AnimatePresence>
  <AnimatePresence>{secondsRemaining>0&&step!==0&&<motion.div className="timeout-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={activity}><div><Clock3 size={34}/><h2>Still there?</h2><p>This experience will reset in <strong>{secondsRemaining} seconds</strong> to keep your information private.</p><button onClick={activity}>Continue Exploring <ArrowRight size={20}/></button></div></motion.div>}</AnimatePresence>
  <AnimatePresence>{message&&<motion.div className="toast" key={message} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}} role="status"><Info size={20}/>{message}</motion.div>}</AnimatePresence>
 </main>;
}
