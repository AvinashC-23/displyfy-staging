"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { cloneElement, isValidElement, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { creatorApplicationSchema, countries, contentCategories } from "@/lib/schemas";
import { postJson } from "@/lib/client-http";

type CreatorApplicationFormInput = z.input<typeof creatorApplicationSchema>;
type CreatorApplicationOutput = z.output<typeof creatorApplicationSchema>;

export function CreatorApplicationForm() {
  const [message, setMessage] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreatorApplicationFormInput, unknown, CreatorApplicationOutput>({ resolver: zodResolver(creatorApplicationSchema), defaultValues: { secondaryCategories: [] } });
  const submit = async (values: CreatorApplicationOutput) => {
    setMessage("");
    const result = await postJson("/api/creator-applications", values);
    setMessage(result.message ?? result.error ?? "Unable to submit application.");
  };
  return <form className="form-panel form-grid" onSubmit={handleSubmit(submit)} noValidate>
    <Field label="Full legal name" error={errors.legalName?.message}><input className="input" autoComplete="name" {...register("legalName")} /></Field>
    <Field label="Display name" error={errors.displayName?.message}><input className="input" {...register("displayName")} /></Field>
    <Field label="Instagram username" error={errors.instagramUsername?.message}><input className="input" placeholder="@yourhandle" {...register("instagramUsername")} /></Field>
    <Field label="Instagram profile URL" error={errors.instagramProfileUrl?.message}><input className="input" type="url" placeholder="https://instagram.com/yourhandle" {...register("instagramProfileUrl")} /></Field>
    <Field label="Email" error={errors.email?.message}><input className="input" type="email" autoComplete="email" {...register("email")} /></Field>
    <Field label="Phone with country code" error={errors.phone?.message}><input className="input" type="tel" autoComplete="tel" placeholder="+14155552671" {...register("phone")} /></Field>
    <Field label="Country" error={errors.country?.message}><select className="input" {...register("country")}><option value="">Select country</option>{countries.map(v => <option key={v}>{v}</option>)}</select></Field>
    <Field label="Primary category" error={errors.primaryCategory?.message}><select className="input" {...register("primaryCategory")}><option value="">Select category</option>{contentCategories.map(v => <option key={v}>{v}</option>)}</select></Field>
    <Field label="Preferred language" error={errors.preferredLanguage?.message}><input className="input" {...register("preferredLanguage")} /></Field>
    <Field label="Follower range" error={errors.followerRange?.message}><select className="input" {...register("followerRange")}><option value="">Select range</option>{["1k-10k","10k-50k","50k-250k","250k-1m","1m+"].map(v => <option key={v}>{v}</option>)}</select></Field>
    <Field label="Average Reel views" error={errors.averageReelViews?.message}><input className="input" type="number" min="0" {...register("averageReelViews", { valueAsNumber: true })} /></Field>
    <Field label="Password" error={errors.password?.message}><input className="input" type="password" autoComplete="new-password" {...register("password")} /></Field>
    <Field label="Confirm password" error={errors.passwordConfirmation?.message}><input className="input" type="password" autoComplete="new-password" {...register("passwordConfirmation")} /></Field>
    <Field full label="Describe your content" error={errors.contentDescription?.message}><textarea className="input" {...register("contentDescription")} /></Field>
    <div className="field full">
      <label className="check"><input type="checkbox" {...register("acceptTerms")} /> I accept the Terms of Service.</label>
      <label className="check"><input type="checkbox" {...register("acceptPrivacy")} /> I accept the Privacy Policy.</label>
      <label className="check"><input type="checkbox" {...register("acceptDisclosure")} /> I agree to follow advertising disclosure requirements.</label>
      <label className="check"><input type="checkbox" {...register("consentNotifications")} /> I consent to application-related email and SMS updates.</label>
      {Object.keys(errors).length > 0 && <p className="error" role="alert">Review the highlighted fields and required agreements.</p>}
    </div>
    {message && <div className="form-status field full" role="status">{message}</div>}
    <div className="field full"><button className="button" disabled={isSubmitting} type="submit">{isSubmitting ? "Submitting…" : "Submit application"}</button></div>
  </form>;
}

function Field({ label, error, full, children }: { label: string; error?: string; full?: boolean; children: React.ReactNode }) {
  const id = useId();
  const control = isValidElement<{ id?: string }>(children) ? cloneElement(children, { id }) : children;
  return <div className={`field ${full ? "full" : ""}`}><label htmlFor={id}>{label}</label>{control}{error && <span className="error">{error}</span>}</div>;
}
