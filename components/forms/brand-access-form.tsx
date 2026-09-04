"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { cloneElement, isValidElement, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { brandAccessSchema, countries } from "@/lib/schemas";
import { postJson } from "@/lib/client-http";

type BrandAccessFormInput = z.input<typeof brandAccessSchema>;
type BrandAccessOutput = z.output<typeof brandAccessSchema>;

export function BrandAccessForm() {
  const [message, setMessage] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BrandAccessFormInput, unknown, BrandAccessOutput>({ resolver: zodResolver(brandAccessSchema) });
  const submit = async (values: BrandAccessOutput) => {
    const result = await postJson("/api/brand-access", values);
    setMessage(result.message ?? result.error ?? "Unable to submit request.");
  };
  const error = (key: keyof typeof errors) => errors[key]?.message as string | undefined;
  return <form className="form-panel form-grid" onSubmit={handleSubmit(submit)} noValidate>
    <Label text="Contact name" error={error("contactName")}><input className="input" autoComplete="name" {...register("contactName")} /></Label>
    <Label text="Job title" error={error("jobTitle")}><input className="input" {...register("jobTitle")} /></Label>
    <Label text="Company name" error={error("companyName")}><input className="input" autoComplete="organization" {...register("companyName")} /></Label>
    <Label text="Company website" error={error("companyWebsite")}><input className="input" type="url" {...register("companyWebsite")} /></Label>
    <Label text="Work email" error={error("workEmail")}><input className="input" type="email" autoComplete="email" {...register("workEmail")} /></Label>
    <Label text="Phone" error={error("phone")}><input className="input" type="tel" placeholder="+14155552671" {...register("phone")} /></Label>
    <Label text="Country" error={error("country")}><select className="input" {...register("country")}><option value="">Select country</option>{countries.map(v => <option key={v}>{v}</option>)}</select></Label>
    <Label text="Estimated campaign budget" error={error("estimatedBudget")}><select className="input" {...register("estimatedBudget")}><option value="">Select range</option><option value="under-5k">Under $5k</option><option value="5k-25k">$5k–$25k</option><option value="25k-100k">$25k–$100k</option><option value="100k-plus">$100k+</option></select></Label>
    <Label full text="Campaign objective" error={error("campaignObjective")}><textarea className="input" {...register("campaignObjective")} /></Label>
    <Label full text="Additional context" error={error("message")}><textarea className="input" {...register("message")} /></Label>
    {Object.keys(errors).length > 0 && <p className="error field full" role="alert">Review the highlighted fields.</p>}
    {message && <div className="form-status field full" role="status">{message}</div>}
    <div className="field full"><button className="button" disabled={isSubmitting}>{isSubmitting ? "Submitting…" : "Request brand access"}</button></div>
  </form>;
}

function Label({ text, error, full, children }: { text: string; error?: string; full?: boolean; children: React.ReactNode }) {
  const id = useId();
  const control = isValidElement<{ id?: string }>(children) ? cloneElement(children, { id }) : children;
  return <div className={`field ${full ? "full" : ""}`}><label htmlFor={id}>{text}</label>{control}{error && <span className="error">{error}</span>}</div>;
}
