import {Criterion, DESTINATIONS, ENVIRONMENTS, LIFESTYLES, PRIORITIES, PROPERTIES, Property, TRAVEL, WEEKENDS} from './data';

export type PriorityGroup = 'must'|'nice'|'not';
export type Answers = {
 lifestyle:string;
 destinations:string[];
 priorities:Record<string,PriorityGroup>;
 weekend:string;
 travel:string;
 environment:string;
};
export type LeadForm = {name:string;whatsapp:string;email:string;timeline:string;budget:string;consent:boolean};
export type Recommendation = {
 property:Property; percentage:number; score:number;
 position:'Best Match'|'Alternative Match'|'Lifestyle Upgrade'|'Other Option';
 breakdown:{key:Criterion;weight:number;score:number;contribution:number}[];
 reasons:string[];
};
export const EMPTY_ANSWERS:Answers = {lifestyle:'',destinations:[],priorities:{},weekend:'',travel:'',environment:''};
export const EMPTY_LEAD:LeadForm = {name:'',whatsapp:'',email:'',timeline:'',budget:'',consent:false};
export const CRITERIA:Record<Criterion,string> = {
 workplace:'Akses pusat bisnis',education:'Pendidikan & keluarga',lifestyle:'Destinasi lifestyle',environment:'Karakter lingkungan',connectivity:'Konektivitas'
};
const BASE:Record<Criterion,number> = {workplace:25,education:20,lifestyle:20,environment:20,connectivity:15};
const PRIORITY_CRITERION:Record<string,Criterion> = {workplace:'workplace',school:'education',green:'environment',sports:'lifestyle',dining:'lifestyle'};
const LIFESTYLE_CRITERION:Record<string,Criterion> = {career:'workplace',family:'education',wellness:'lifestyle',dining:'lifestyle',nature:'environment',shopping:'lifestyle'};
const clamp = (n:number)=>Math.min(100,Math.max(0,n));

export function calculateWeights(a:Answers):Record<Criterion,number>{
 const m:Record<Criterion,number> = {workplace:1,education:1,lifestyle:1,environment:1,connectivity:1};
 const primary=LIFESTYLE_CRITERION[a.lifestyle]; if(primary)m[primary]*=1.25;
 if(a.environment)m.environment*=1.25;
 for(const [id,group] of Object.entries(a.priorities)){
  const c=PRIORITY_CRITERION[id];if(c)m[c]*=(group==='must'?1.5:group==='not'?0.5:1);
 }
 if(a.destinations.includes('office')) m.workplace*=1.14;
 if(a.destinations.includes('school') || a.destinations.includes('family'))m.education*=1.14;
 if(a.destinations.includes('transport'))m.connectivity*=1.16;
 if(a.weekend==='nature')m.environment*=1.1;
 if(a.weekend==='urban'||a.weekend==='social')m.lifestyle*=1.1;
 if(!a.destinations.includes('school') && a.lifestyle!=='family' && a.priorities.school!=='must')m.education*=0.68;
 if(a.travel==='notConcern'){m.connectivity*=0.35;m.workplace*=0.75;}
 const unnormalized=Object.fromEntries((Object.keys(BASE) as Criterion[]).map(k=>[k,BASE[k]*m[k]])) as Record<Criterion,number>;
 const total=Object.values(unnormalized).reduce((sum,v)=>sum+v,0);
 return Object.fromEntries((Object.keys(BASE) as Criterion[]).map(k=>[k,unnormalized[k]/total])) as Record<Criterion,number>;
}

function eligibleByBudget(p:Property,budget:string){
 const max = budget==='under2'?2:budget==='2to5'?5:budget==='5to10'?10:Infinity;
 return p.priceMinBillion <= max;
}

function reasonFor(c:Criterion,a:Answers,p:Property){
 const text:Record<Criterion,string>={
  workplace:'Menonjol pada preferensi mobilitas kerja Anda',
  education:'Selaras dengan kebutuhan keluarga dan pendidikan',
  lifestyle:'Mendukung aktivitas dan tujuan keseharian Anda',
  environment:'Karakter kawasan mendekati suasana pilihan Anda',
  connectivity:'Konektivitas kawasan sesuai fokus mobilitas Anda'
 };
 if(c==='environment'&&p.tags.includes(a.environment))return 'Karakter lingkungan sejalan dengan preferensi Anda';
 return text[c];
}
export function generateRecommendations(a:Answers,budget=''):Recommendation[]{
 const weights=calculateWeights(a);
 const scores=PROPERTIES.filter(p=>eligibleByBudget(p,budget)).map(property=>{
   const breakdown=(Object.keys(BASE) as Criterion[]).map(key=>{
      let score=property.scores[key];
      if(key==='environment')score=clamp(score+(property.tags.includes(a.environment)?5:-8));
      if(key==='lifestyle' && property.tags.includes(a.lifestyle))score=clamp(score+3);
      return {key,weight:weights[key],score,contribution:score*weights[key]};
   });
   const score=breakdown.reduce((s,b)=>s+b.contribution,0);
   const reasons=[...breakdown].sort((x,y)=>y.contribution-x.contribution).slice(0,3).map(b=>reasonFor(b.key,a,property));
   return {property,score,percentage:Math.round(score),position:'Other Option' as Recommendation['position'],breakdown,reasons};
 }).sort((x,y)=>y.score-x.score);
 if(!scores.length)return [];
 const chosen:Recommendation[]=[];
 const projectGroup=(p:Property)=>p.id.startsWith('monard')?'monard':p.id;
 const differs=(p:Property)=>chosen.every(c=>projectGroup(c.property)!==projectGroup(p));
 const take=(item:Recommendation|undefined,position:Recommendation['position'])=>{if(item){chosen.push({...item,position});scores.splice(scores.findIndex(v=>v.property.id===item.property.id),1)}};
 take(scores[0],'Best Match');
 // Prefer a genuinely different housing segment over near-duplicates.
 take(scores.find(x=>differs(x.property) && x.property.segment!==chosen[0].property.segment && !x.property.upgrade) || scores.find(x=>differs(x.property) && x.property.segment!==chosen[0].property.segment) || scores.find(x=>differs(x.property)) || scores[0],'Alternative Match');
 const upgrade=scores.find(x=>differs(x.property) && x.property.upgrade && x.score>=62);
 take(upgrade || scores.find(x=>differs(x.property)) || scores[0],upgrade?'Lifestyle Upgrade':'Other Option');
 return chosen;
}
export function profileFor(a:Answers){
 const lookup:Record<string,[string,string]>={
  family:['THE CONNECTED FAMILY','Membuat ruang bagi keluarga, tanpa menjauh dari hal-hal penting.'],
  career:['THE CITY CONNECTOR','Terus bergerak, tetapi selalu punya tempat untuk pulang.'],
  wellness:['THE BALANCED MOVER','Hari yang aktif, waktu istirahat yang berkualitas.'],
  dining:['THE SOCIAL SOUL','Hidup terasa lebih lengkap dengan pengalaman baru.'],
  nature:['THE PEACEFUL SEEKER','Ruang hijau dan ketenangan untuk hidup yang seimbang.'],
  shopping:['THE EVERYDAY EXPLORER','Kenyamanan dan inspirasi dalam satu ritme hidup.']
 };
 const [title,description]=lookup[a.lifestyle]||['THE LIFESTYLE EXPLORER','Menemukan tempat yang cocok dengan ritme hidup Anda.'];
 const top:string[] = [...PRIORITIES].filter(p=>a.priorities[p.id]==='must').map(p=>p.title);
 if(!top.length){const primary=LIFESTYLES.find(l=>l.id===a.lifestyle);if(primary)top.push(primary.title)}
 return {title,description,top,environment:ENVIRONMENTS.find(e=>e.id===a.environment)?.title||'',weekend:WEEKENDS.find(w=>w.id===a.weekend)?.title||'',travel:TRAVEL.find(t=>t.id===a.travel)?.title||'',destinations:a.destinations.map(id=>DESTINATIONS.find(d=>d.id===id)?.title).filter(Boolean)};
}
export function validateLead(f:LeadForm){
 const errors:Partial<Record<keyof LeadForm,string>>={};
 if(f.name.trim().length<2)errors.name='Masukkan nama lengkap (minimal 2 karakter).';
 const normalized=f.whatsapp.replace(/[\s()+-]/g,'');
 if(!/^(?:0|62)8\d{7,12}$/.test(normalized))errors.whatsapp='Masukkan nomor WhatsApp Indonesia yang valid.';
 if(f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))errors.email='Format email belum sesuai.';
 if(!['immediate','3months','6months','year','exploring'].includes(f.timeline))errors.timeline='Pilih rencana pembelian.';
 if(!f.consent)errors.consent='Persetujuan diperlukan.';
 return errors;
}
export function validAnswers(a:Answers){return !!(a.lifestyle&&a.destinations.length>=1&&a.destinations.length<=3&&PRIORITIES.every(p=>a.priorities[p.id])&&Object.values(a.priorities).filter(x=>x==='must').length<=2&&a.weekend&&a.travel&&a.environment)};
