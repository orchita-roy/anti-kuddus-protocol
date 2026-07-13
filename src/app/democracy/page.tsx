"use client";
import { useCallback,useEffect,useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { apiRequest } from "@/lib/api/client";
import { ProposalCard,ProposalForm,DecisionActionTracker } from "@/components/democracy/DemocracyComponents";

export default function Page(){
  const[proposals,setProposals]=useState<any[]>([]),[actions,setActions]=useState<any[]>([]),[error,setError]=useState("");
  const load=useCallback(()=>{void Promise.all([apiRequest<any[]>("/api/democracy/proposals"),apiRequest<any[]>("/api/democracy/actions")]).then(([p,a])=>{setProposals(p);setActions(a)}).catch(e=>setError(e.message))},[]);
  useEffect(load,[load]);
  return <AppShell title="Democracy or Nothing">
    <div className="eyebrow">Proposal · vote · action · verification</div>
    <h1>Decisions need accountability.</h1>
    <p>Eligible students vote through cryptographic pseudonymization and identity separation. This is not formal zero-knowledge voting; individual choices are never shown.</p>
    <div className="actions"><Link className="btn ai" href="/democracy/elections">Elections</Link><Link className="btn ghost" href="/democracy/impeachment">Warning & impeachment</Link></div>
    {error&&<div className="error">{error}</div>}
    <div className="grid" style={{marginTop:18}}>
      <div style={{gridColumn:"span 5",minWidth:0}}><ProposalForm onCreated={load}/></div>
      <section style={{gridColumn:"span 7",minWidth:0}}>
        <h2>Active proposals</h2>
        <div className="grid">{proposals.length?proposals.map(x=><div style={{gridColumn:"span 6",minWidth:0}} key={x._id}><ProposalCard proposal={x}/></div>):<div className="card empty" style={{gridColumn:"span 12"}}>No proposals yet.</div>}</div>
      </section>
    </div>
    <h2 style={{marginTop:28}}>Implementation tracker</h2>
    <div className="grid">{actions.length?actions.map(x=><div style={{gridColumn:"span 4",minWidth:0}} key={x._id}><DecisionActionTracker item={x}/></div>):<div className="card empty" style={{gridColumn:"span 12"}}>No assigned actions.</div>}</div>
  </AppShell>
}
