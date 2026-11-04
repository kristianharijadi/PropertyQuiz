import {NextRequest,NextResponse} from 'next/server';
import {Pool} from 'pg';
import {Answers,LeadForm,generateRecommendations,profileFor,validAnswers,validateLead} from '@/lib/matching';

export const runtime='nodejs';
let pool:Pool|undefined;
function db(){if(!process.env.DATABASE_URL)throw Error('DATABASE_URL is not configured');pool??=new Pool({connectionString:process.env.DATABASE_URL,max:2,ssl:process.env.DATABASE_URL.includes('localhost')?false:{rejectUnauthorized:true}});return pool;}

export async function POST(request:NextRequest){
 if(process.env.NEXT_PUBLIC_DEMO_MODE!=='false')return NextResponse.json({error:'Demo mode: no personal data is accepted by the server.'},{status:503});
 let body:{sessionId?:string;answers?:Answers;lead?:LeadForm};
 try{body=await request.json();}catch{return NextResponse.json({error:'Invalid request'},{status:400})}
 const a=body.answers,l=body.lead;
 if(!a||!l||!validAnswers(a))return NextResponse.json({error:'Jawaban kuesioner belum lengkap.'},{status:422});
 const errors=validateLead(l);if(Object.keys(errors).length)return NextResponse.json({error:'Data diri belum valid.',fields:errors},{status:422});
 if(!process.env.DATABASE_URL)return NextResponse.json({error:'Database belum dikonfigurasi. Lead tidak disimpan.'},{status:503});
 const sessionId=body.sessionId&&/^[0-9a-f-]{36}$/i.test(body.sessionId)?body.sessionId:crypto.randomUUID();
 const recommendations=generateRecommendations(a,l.budget);
 const profile=profileFor(a);
 const client=db().connect();
 try{
  const con=await client;try{
   await con.query('BEGIN');
   const res=await con.query(`INSERT INTO property_match_leads (session_id,full_name,whatsapp,email,purchase_timeline,budget_range,consent_at,consent_text_version,answers,profile,recommendations,config_version)
    VALUES ($1,$2,$3,$4,$5,$6,NOW(),'v1.0',$7::jsonb,$8::jsonb,$9::jsonb,'demo-scoring-v1') RETURNING id`,[
    sessionId,l.name.trim(),l.whatsapp.replace(/\s/g,''),l.email||null,l.timeline,l.budget||null,JSON.stringify(a),JSON.stringify(profile),JSON.stringify(recommendations.map(({property,score,percentage,position,breakdown})=>({propertyId:property.id,score,percentage,position,breakdown})))
   ]);
   await con.query('COMMIT');
   return NextResponse.json({saved:true,sessionId,leadId:res.rows[0].id,profile,recommendations:recommendations.map(({property,score,percentage,position,breakdown,reasons})=>({propertyId:property.id,score,percentage,position,breakdown,reasons}))});
  }catch(e){await con.query('ROLLBACK');throw e;}finally{con.release()}
 }catch(e){console.error('Lead save error',e);return NextResponse.json({error:'Gagal menyimpan lead. Silakan coba kembali.'},{status:500})}
}
