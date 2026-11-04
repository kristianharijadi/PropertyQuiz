import {NextRequest,NextResponse} from 'next/server';
import {Pool} from 'pg';
import {PROPERTIES} from '@/lib/data';
export const runtime='nodejs';
let pool:Pool|undefined;
function db(){if(!process.env.DATABASE_URL)throw Error('No database');pool??=new Pool({connectionString:process.env.DATABASE_URL,max:2,ssl:process.env.DATABASE_URL.includes('localhost')?false:{rejectUnauthorized:true}});return pool;}
export async function POST(request:NextRequest){
 if(process.env.NEXT_PUBLIC_DEMO_MODE!=='false')return NextResponse.json({saved:false,demo:true});
 try{
  const body=await request.json() as {sessionId?:string;kind?:string;propertyId?:string};
  if(!body.sessionId||!/^[0-9a-f-]{36}$/i.test(body.sessionId)||!['explored','selected','contact_sales'].includes(body.kind||'')||!!body.propertyId&&!PROPERTIES.some(p=>p.id===body.propertyId))return NextResponse.json({error:'Invalid event'},{status:422});
  const sql=db();
  const result=await sql.query(`INSERT INTO property_match_events (session_id,event_name,property_id)
     SELECT $1::uuid,$2,$3 WHERE EXISTS(SELECT 1 FROM property_match_leads WHERE session_id=$1::uuid) RETURNING id`,[body.sessionId,body.kind,body.propertyId||null]);
  if(!result.rowCount)return NextResponse.json({error:'Unknown session'},{status:404});
  if(body.kind==='selected'&&body.propertyId)await sql.query('UPDATE property_match_leads SET selected_property=$2 WHERE session_id=$1::uuid',[body.sessionId,body.propertyId]);
  return NextResponse.json({saved:true});
 }catch(e){console.error('Event tracking error',e);return NextResponse.json({error:'Unable to track event'},{status:500})}
}
