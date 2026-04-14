"use client";

import React, { useState, FormEvent, useRef } from "react";
import emailjs from "@emailjs/browser";

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setError("Email service is not properly configured. Please check environment variables.");
      setLoading(false);
      return;
    }

    try {
      if (formRef.current) {
        await emailjs.sendForm(
          serviceId,
          templateId,
          formRef.current,
          publicKey
        );
        setSuccess("Your message has been sent successfully!");
        formRef.current.reset();
      }
    } catch (err) {
      console.error("EmailJS Error:", err);
      setError("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-2xl font-semibold">Message us</h3>
      <p className="mt-2 text-sm text-ink/70">
        Share your hospital details or partnership idea. We will respond
        within 24 hours.
      </p>

      {success && (
        <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700 border border-emerald-100">
          {success}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700 border border-red-100">
          {error}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Your name"
          required
          className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
        />
        <input
          type="text"
          name="title"
          placeholder="Subject"
          required
          className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
        />
        <textarea
          rows={4}
          name="message"
          placeholder="Message"
          required
          className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
        />
        <button 
          type="submit" 
          className="btn btn-primary w-full md:w-auto" 
          disabled={loading}
        >
          {loading ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
  );
}
