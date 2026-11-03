import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function Page() {
  const { data: leads } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(20);
  const { data: logs } = await supabase.from('agent_logs').select('*').order('created_at', { ascending: false }).limit(10);
  
  return (
    <div style={{padding:'20px', fontFamily:'system-ui', background:'#0a0a0a', color:'white', minHeight:'100vh'}}>
      <h1 style={{fontSize:'28px'}}>🚀 Nova Mini CRM</h1>
      <p>Supabase: dunievanwwendykrseir.supabase.co | RLS: leads + agent_logs ✅</p>
      <h2>Leads ({leads?.length || 0})</h2>
      <div style={{overflowX:'auto'}}>
        <table border="1" cellPadding="8" style={{borderCollapse:'collapse', width:'100%'}}>
          <tr><th>Name</th><th>Email</th><th>Status</th><th>Score</th></tr>
          {leads?.map(l => <tr key={l.id}><td>{l.name}</td><td>{l.email}</td><td>{l.status}</td><td>{l.score || '-'}</td></tr>)}
        </table>
      </div>
      <h2 style={{marginTop:'20px'}}>Agent Logs ({logs?.length || 0})</h2>
      <ul>{logs?.map(log => <li key={log.id}>{log.action} - {new Date(log.created_at).toLocaleString()}</li>)}</ul>
      <p style={{marginTop:'30px', opacity:0.6}}>Built on Infinix Smart 7 HD by Nsikak-hubstori | For Nova</p>
    </div>
  );
}
