import {NextResponse} from 'next/server';
export function GET(){return NextResponse.json({ok:true,mode:process.env.NEXT_PUBLIC_DEMO_MODE==='false'?'database':'demo'});}
