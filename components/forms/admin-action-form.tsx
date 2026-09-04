"use client";

import { useState } from "react";
import { postJson } from "@/lib/client-http";

export function AdminActionForm({ creators, missions, submissions }: { creators: {id:string;label:string}[]; missions:{id:string;label:string}[]; submissions:{id:string;label:string}[] }) {
  const [type,setType]=useState<"creator"|"mission"|"submission">("creator"); const [message,setMessage]=useState("");
  const entities={creator:creators,mission:missions,submission:submissions}[type];
  const actions={creator:["approve","reject","request_information","suspend","restore"],mission:["approve","reject","publish","pause"],submission:["approve","reject","mark_payout_eligible","mark_paid"]}[type];
  async function submit(formData:FormData){const result=await postJson("/api/admin/actions",{...Object.fromEntries(formData),entityType:type,views:Number(formData.get("views")||0)});setMessage(String(result.message??result.error??"Action could not be completed."));}
  return <form className="form-grid" action={submit}>
    <div className="field"><label htmlFor="entityType">Record type</label><select className="input" id="entityType" value={type} onChange={event=>setType(event.target.value as typeof type)}><option value="creator">Creator</option><option value="mission">Mission</option><option value="submission">Submission</option></select></div>
    <div className="field"><label htmlFor="entityId">Record</label><select className="input" id="entityId" name="entityId">{entities.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
    <div className="field"><label htmlFor="action">Action</label><select className="input" id="action" name="action">{actions.map(action=><option key={action}>{action}</option>)}</select></div>
    <div className="field"><label htmlFor="views">Verified views</label><input className="input" id="views" name="views" type="number" min="0" defaultValue="0" /></div>
    <div className="field full"><label htmlFor="reason">Review notes or reason</label><textarea className="input" id="reason" name="reason" /></div>
    <div className="field full"><label htmlFor="externalReference">External payment reference (mark paid only)</label><input className="input" id="externalReference" name="externalReference" /></div>
    {message&&<div className="form-status field full" role="status">{message}</div>}<button className="button field full">Apply reviewed action</button>
  </form>;
}
