'use client';

import { useState } from "react";
import Image from "next/image";

const packages = [
  {
    id: "pulsemarket",
    name: "PulseMarket",
    tier: "Entry Tier",
    tagline: "Your Digital Foundation",
    color: "#2272C3",
    landingPages: 3,
    features: ["3 Landing Pages", "30 Social Posts/mo"],
  },
  {
    id: "pulseflow",
    name: "PulseFlow",
    tier: "Growth Tier",
    tagline: "Scale Your Content Engine",
    color: "#0D6E6E",
    landingPages: 5,
    features: ["5 Landing Pages", "60 Social Posts/mo", "4 Emails/mo", "2 Blog Articles/mo"],
  },
  {
    id: "pulsedrive",
    name: "PulseDrive",
    tier: "Professional Tier",
    tagline: "Out-Brand Every Competitor",
    color: "#7C3AED",
    landingPages: 10,
    popular: true,
    features: ["10 Landing Pages", "100+ Social Posts/mo", "8 Emails/mo", "4 Blog Articles/mo"],
  },
  {
    id: "pulsecommand",
    name: "PulseCommand",
    tier: "Elite Tier",
    tagline: "The Content Empire",
    color: "#C9A040",
    landingPages: null,
    features: ["Unlimited Landing Pages", "150 Social Posts/mo", "12 Emails/mo", "4 Blog Articles/mo"],
  },
];

const industries = [
  "Insurance Agent", "Law Firm", "Real Estate Agent", "Financial Advisor",
  "HVAC Specialist", "Roofing Contractor", "Salon / Med Spa", "Photography Studio",
  "Dental Practice", "Plumbing Service", "Personal Trainer", "Pilates Studio",
  "Lawn Care Service", "Other",
];

const ctaOptions = [
  "Book a call / consultation", "Request a free quote", "Fill out a contact form",
  "Call me directly", "Download a free resource", "Sign up / register",
];

const getBaseQuestions = () => [
  { id: "website", label: "Do you have an existing website?", type: "radio", options: ["Yes — and I love it", "Yes — but it needs work", "No website yet"] },
  { id: "website_url", label: "What is your website URL?", type: "text", placeholder: "https://yourwebsite.com", conditional: (a: Record<string, string>) => a.website && a.website !== "No website yet" },
  { id: "social_existing", label: "Which social media platforms do you currently use?", type: "checkbox", options: ["Facebook", "Instagram", "LinkedIn", "TikTok", "X / Twitter", "YouTube", "None yet"] },
  { id: "social_active", label: "How active are you on social media today?", type: "radio", options: ["I post regularly", "I post occasionally", "I barely post", "Not at all"] },
  { id: "target_audience", label: "Who is your ideal customer? Describe them briefly.", type: "textarea", placeholder: "e.g. Texas teachers ages 30–55 who need help understanding their retirement options..." },
  { id: "top_services", label: "What are your top 2–3 services or products you want to promote?", type: "textarea", placeholder: "e.g. Retirement planning, health insurance reviews, life insurance..." },
  { id: "tone", label: "How would you describe your brand personality?", type: "radio", options: ["Professional & formal", "Friendly & conversational", "Bold & energetic", "Educational & informative", "Luxury & premium"] },
  { id: "goals", label: "What is your #1 goal for the next 90 days?", type: "textarea", placeholder: "e.g. Generate 10 new leads per month, build my brand online, grow my referral network..." },
  { id: "past_marketing", label: "Have you tried digital marketing before?", type: "radio", options: ["Yes — and it worked well", "Yes — but it didn't work", "No — this is my first time"] },
  { id: "colors", label: "Do you have existing brand colors and/or a logo?", type: "radio", options: ["Yes — I'll send them over", "I have a logo but no defined colors", "No — I need branding help"] },
  { id: "competitors", label: "Who are your main competitors? (Optional)", type: "text", placeholder: "e.g. Other local agents, national firms..." },
];

const getEmailQuestions = () => [
  { id: "email_list", label: "Do you have an existing email list?", type: "radio", options: ["Yes — over 1,000 contacts", "Yes — under 1,000 contacts", "No email list yet"] },
  { id: "email_list_size", label: "Roughly how many contacts are on your list?", type: "text", placeholder: "e.g. 500, 5,000, 100,000...", conditional: (a: Record<string, string>) => a.email_list && a.email_list !== "No email list yet" },
  { id: "email_goal", label: "What should your email campaigns accomplish?", type: "checkbox", options: ["Nurture leads", "Promote services", "Share educational content", "Drive traffic to landing pages", "Re-engage cold contacts"] },
];

const getBlogQuestions = () => [
  { id: "blog_topics", label: "What topics should your blog articles cover?", type: "textarea", placeholder: "e.g. Retirement tips, health insurance myths, life insurance explainers..." },
  { id: "seo_keywords", label: "Any keywords you want to rank for in Google? (Optional)", type: "text", placeholder: "e.g. teacher retirement Texas, health insurance for educators..." },
];

const getAvatarQuestions = () => [
  { id: "avatar_style", label: "For AI avatar videos, what style do you prefer?", type: "radio", options: ["Realistic avatar that looks like me", "Professional generic avatar", "Faceless / animated style", "Not sure yet — show me options"] },
  { id: "avatar_topics", label: "What should your first video series cover?", type: "textarea", placeholder: "e.g. 5-part series on understanding teacher pensions, life insurance myths for families..." },
];

const getPodcastQuestions = () => [
  { id: "podcast_name", label: "Do you have a name in mind for your podcast?", type: "text", placeholder: "e.g. The Teachers Financial Wellness Show..." },
  { id: "podcast_topics", label: "What topics would your podcast cover?", type: "textarea", placeholder: "e.g. Financial wellness for teachers, insurance myths, retirement planning tips..." },
  { id: "podcast_audience", label: "Who is your podcast for?", type: "text", placeholder: "e.g. Texas educators, small business owners..." },
];

interface Package {
  id: string;
  name: string;
  tier: string;
  tagline: string;
  color: string;
  landingPages: number | null;
  popular?: boolean;
  features: string[];
}

const getLandingPageQuestions = (pkg: Package) => {
  const count = pkg.landingPages;
  return [{
    id: "landing_pages",
    label: count === null
      ? "Tell us about the landing pages you want. Add as many as you need."
      : `You get ${count} landing pages with your plan. Tell us what each one should focus on.`,
    type: "landing_pages",
    count,
  }];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getPackageQuestions = (packageId: string, pkg: Package): any[] => {
  const base = getBaseQuestions();
  const lp = getLandingPageQuestions(pkg);
  const email = getEmailQuestions();
  const blog = getBlogQuestions();
  const avatar = getAvatarQuestions();
  const podcast = getPodcastQuestions();
  switch (packageId) {
    case "pulsemarket": return [...base, ...lp];
    case "pulseflow": return [...base, ...lp, ...email, ...blog];
    case "pulsedrive": return [...base, ...lp, ...email, ...blog, ...avatar];
    case "pulsecommand": return [...base, ...lp, ...email, ...blog, ...avatar, ...podcast];
    default: return base;
  }
};

interface LandingPage { topic: string; audience: string; goal: string; services: string; }
const emptyPage = (): LandingPage => ({ topic: "", audience: "", goal: "", services: "" });
const STEPS = { INTRO: "intro", PACKAGE: "package", INTERVIEW: "interview", DONE: "done" };

export default function ApexOnboardingForm() {
  const [step, setStep] = useState(STEPS.INTRO);
  const [formData, setFormData] = useState({ name: "", businessName: "", email: "", phone: "", industry: "", otherIndustry: "", package: "" });
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [landingPages, setLandingPages] = useState<LandingPage[]>([emptyPage()]);
  const [currentQ, setCurrentQ] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedPackage = packages.find(p => p.id === formData.package);
  const allQuestions = formData.package ? getPackageQuestions(formData.package, selectedPackage!) : [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const visibleQuestions = allQuestions.filter((q: any) => !q.conditional || q.conditional(answers));
  const currentQuestion = visibleQuestions[currentQ];
  const isLastQuestion = currentQ === visibleQuestions.length - 1;
  const progress = visibleQuestions.length ? Math.round((currentQ / visibleQuestions.length) * 100) : 0;
  const accentColor = selectedPackage?.color || "#102A5E";
  const displayIndustry = formData.industry === "Other" ? formData.otherIndustry || "Other" : formData.industry;

  const updateAnswer = (id: string, value: string | string[]) => setAnswers(prev => ({ ...prev, [id]: value }));
  const toggleCheckbox = (id: string, option: string) => {
    const current = (answers[id] as string[]) || [];
    const updated = current.includes(option) ? current.filter(o => o !== option) : [...current, option];
    updateAnswer(id, updated);
  };
  const updatePage = (index: number, field: keyof LandingPage, value: string) =>
    setLandingPages(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  const addPage = () => setLandingPages(prev => [...prev, emptyPage()]);
  const removePage = (index: number) => setLandingPages(prev => prev.filter((_, i) => i !== index));

  const canProceedIntro = formData.name.trim() && formData.businessName.trim() && formData.email.trim() &&
    formData.industry && (formData.industry !== "Other" || formData.otherIndustry.trim());

  const buildSummary = () => {
    const lpSummary = landingPages.map((p, i) =>
      `  Page ${i + 1}: ${p.topic || "Untitled"}\n  Audience: ${p.audience || "N/A"}\n  Goal: ${p.goal || "N/A"}\n  Services: ${p.services || "N/A"}`
    ).join("\n\n");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const qaSummary = visibleQuestions.filter((q: any) => q.type !== "landing_pages").map((q: any) => {
      const ans = answers[q.id];
      if (!ans) return null;
      const val = Array.isArray(ans) ? ans.join(", ") : ans;
      return `  ${q.label}\n  → ${val}`;
    }).filter(Boolean).join("\n\n");
    return `APEX ONBOARDING SUBMISSION\n==========================\nName: ${formData.name}\nBusiness: ${formData.businessName}\nEmail: ${formData.email}\nPhone: ${formData.phone || "N/A"}\nIndustry: ${displayIndustry}\nPackage: ${selectedPackage?.name} — ${selectedPackage?.tier}\n\nLANDING PAGES (${landingPages.length})\n------------------------------\n${lpSummary}\n\nINTERVIEW ANSWERS\n------------------------------\n${qaSummary}`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch("https://formspree.io/f/mzdykygl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _replyto: formData.email,
          _subject: `APEX Onboarding — ${formData.name} | ${selectedPackage?.name}`,
          name: formData.name,
          business: formData.businessName,
          email: formData.email,
          phone: formData.phone,
          industry: displayIndustry,
          package: `${selectedPackage?.name} — ${selectedPackage?.tier}`,
          landing_pages: landingPages,
          answers,
          full_summary: buildSummary(),
        }),
      });
    } catch (e) { console.error(e); }
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #081D3A 0%, #102A5E 50%, #1A3F7A 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "700px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "14px", background: "rgba(255,255,255,0.10)", borderRadius: "14px", padding: "12px 28px", marginBottom: "8px" }}>
            <Image src="/apex-logo.png" alt="APEX Affinity Group" width={160} height={48} style={{ height: "42px", width: "auto" }} priority />
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "1.2rem", fontWeight: "300" }}>|</span>
            <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: "500", fontSize: "0.875rem" }}>Client Onboarding</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem" }}>Powered by BotMakers.ai</p>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: "24px", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
          {step === STEPS.INTERVIEW && (
            <div style={{ height: "5px", background: "#F1F5F9" }}>
              <div style={{ height: "100%", background: accentColor, width: `${progress}%`, transition: "width 0.4s ease", borderRadius: "0 4px 4px 0" }} />
            </div>
          )}

          <div style={{ padding: "40px 44px" }}>

            {step === STEPS.INTRO && (
              <div>
                <p style={stepLabelStyle}>Step 1 of 3</p>
                <h1 style={{ fontSize: "1.7rem", fontWeight: "800", color: "#102A5E", marginBottom: "8px" }}>Let&apos;s get you set up! 👋</h1>
                <p style={{ color: "#64748B", fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "28px" }}>Fill this out before your onboarding call so our team can hit the ground running from day one. Takes about 5 minutes.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input style={inputStyle} placeholder="e.g. Rigo Cuellar" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>Business Name *</label>
                      <input style={inputStyle} placeholder="e.g. New Horizons Benefits" value={formData.businessName} onChange={e => setFormData(p => ({ ...p, businessName: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={labelStyle}>Email Address *</label>
                      <input style={inputStyle} type="email" placeholder="you@yourbusiness.com" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone Number</label>
                      <input style={inputStyle} placeholder="(555) 000-0000" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Your Industry *</label>
                    <select style={inputStyle} value={formData.industry} onChange={e => setFormData(p => ({ ...p, industry: e.target.value, otherIndustry: "" }))}>
                      <option value="">Select your industry...</option>
                      {industries.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                    {formData.industry === "Other" && (
                      <div style={{ marginTop: "12px", padding: "16px", background: "#EBF3FC", borderRadius: "12px", border: "1.5px solid rgba(34,114,195,0.2)" }}>
                        <label style={{ ...labelStyle, color: "#2272C3" }}>Please describe your industry *</label>
                        <input style={{ ...inputStyle, background: "white" }} placeholder="e.g. Mortgage Broker, Chiropractor, Event Planner..." value={formData.otherIndustry} onChange={e => setFormData(p => ({ ...p, otherIndustry: e.target.value }))} autoFocus />
                        <p style={{ color: "#64748B", fontSize: "0.75rem", marginTop: "6px" }}>Don&apos;t worry — we work with all industries. This helps us customize your content.</p>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => setStep(STEPS.PACKAGE)} disabled={!canProceedIntro} style={btnStyle(!!canProceedIntro, "#102A5E")}>Continue → Choose Your Package</button>
              </div>
            )}

            {step === STEPS.PACKAGE && (
              <div>
                <p style={stepLabelStyle}>Step 2 of 3</p>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#102A5E", marginBottom: "6px" }}>Which package did you sign up for?</h2>
                <p style={{ color: "#64748B", fontSize: "0.875rem", marginBottom: "24px" }}>Hi {formData.name}! Select your package and we&apos;ll tailor the rest of the form to match.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
                  {packages.map(pkg => (
                    <div key={pkg.id} onClick={() => setFormData(p => ({ ...p, package: pkg.id }))}
                      style={{ border: `2px solid ${formData.package === pkg.id ? pkg.color : "#E2E8F0"}`, borderRadius: "14px", padding: "16px 20px", cursor: "pointer", background: formData.package === pkg.id ? `${pkg.color}0D` : "#FAFAFA", transition: "all 0.2s", position: "relative" }}>
                      {pkg.popular && <span style={{ position: "absolute", top: "-10px", right: "16px", background: pkg.color, color: "white", fontSize: "0.68rem", fontWeight: "700", padding: "2px 10px", borderRadius: "999px" }}>Most Popular</span>}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "3px" }}>
                            <span style={{ fontWeight: "800", color: pkg.color, fontSize: "1rem" }}>{pkg.name}</span>
                            <span style={{ fontSize: "0.72rem", color: "#94A3B8", background: "#F1F5F9", padding: "1px 8px", borderRadius: "999px" }}>{pkg.tier}</span>
                          </div>
                          <p style={{ fontSize: "0.78rem", color: "#64748B", marginBottom: "8px" }}>{pkg.tagline}</p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                            {pkg.features.map(f => <span key={f} style={{ fontSize: "0.7rem", background: `${pkg.color}15`, color: pkg.color, padding: "2px 8px", borderRadius: "999px", fontWeight: "600" }}>{f}</span>)}
                          </div>
                        </div>
                        <div style={{ width: "22px", height: "22px", borderRadius: "50%", border: `2px solid ${formData.package === pkg.id ? pkg.color : "#CBD5E1"}`, background: formData.package === pkg.id ? pkg.color : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "16px" }}>
                          {formData.package === pkg.id && <span style={{ color: "white", fontSize: "0.7rem" }}>✓</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setStep(STEPS.INTRO)} style={backBtnStyle}>← Back</button>
                  <button onClick={() => { setCurrentQ(0); setLandingPages(selectedPackage?.landingPages ? Array(selectedPackage.landingPages).fill(null).map(() => emptyPage()) : [emptyPage()]); setStep(STEPS.INTERVIEW); }} disabled={!formData.package} style={{ ...btnStyle(!!formData.package, accentColor), flex: 2, margin: 0 }}>
                    Start My Interview →
                  </button>
                </div>
              </div>
            )}

            {step === STEPS.INTERVIEW && currentQuestion && !submitted && (
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: `${accentColor}12`, border: `1px solid ${accentColor}35`, borderRadius: "999px", padding: "4px 14px", marginBottom: "20px" }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: accentColor, display: "inline-block" }} />
                  <span style={{ color: accentColor, fontSize: "0.73rem", fontWeight: "700" }}>{selectedPackage?.name} · {formData.businessName}</span>
                </div>
                <p style={{ color: "#94A3B8", fontSize: "0.78rem", fontWeight: "600", marginBottom: "6px" }}>Question {currentQ + 1} of {visibleQuestions.length}</p>
                <h2 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#102A5E", marginBottom: "22px", lineHeight: "1.45" }}>{currentQuestion.label}</h2>

                {currentQuestion.type === "landing_pages" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {landingPages.map((page, i) => (
                      <div key={i} style={{ border: `1.5px solid ${accentColor}30`, borderRadius: "16px", padding: "20px", background: `${accentColor}05` }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                          <span style={{ fontWeight: "700", color: accentColor, fontSize: "0.85rem" }}>Landing Page {i + 1}</span>
                          {currentQuestion.count === null && landingPages.length > 1 && (
                            <button onClick={() => removePage(i)} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "0.8rem" }}>✕ Remove</button>
                          )}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          <div>
                            <label style={subLabelStyle}>Page Topic / Name *</label>
                            <input style={inputStyle} placeholder="e.g. Teacher Retirement Planning" value={page.topic} onChange={e => updatePage(i, "topic", e.target.value)} />
                          </div>
                          <div>
                            <label style={subLabelStyle}>Target Audience for This Page</label>
                            <input style={inputStyle} placeholder="e.g. Texas teachers ages 30–55 nearing retirement" value={page.audience} onChange={e => updatePage(i, "audience", e.target.value)} />
                          </div>
                          <div>
                            <label style={subLabelStyle}>Main Goal / Call to Action</label>
                            <select style={inputStyle} value={page.goal} onChange={e => updatePage(i, "goal", e.target.value)}>
                              <option value="">Select the main action for visitors...</option>
                              {ctaOptions.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={subLabelStyle}>Specific Services to Highlight on This Page</label>
                            <textarea style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }} placeholder="e.g. TRS pension review, supplemental coverage, retirement income planning..." value={page.services} onChange={e => updatePage(i, "services", e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                    {currentQuestion.count === null && (
                      <button onClick={addPage} style={{ border: `2px dashed ${accentColor}50`, borderRadius: "14px", padding: "14px", background: "transparent", color: accentColor, fontWeight: "700", fontSize: "0.875rem", cursor: "pointer" }}>
                        + Add Another Landing Page
                      </button>
                    )}
                  </div>
                )}

                {currentQuestion.type === "radio" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {currentQuestion.options.map((opt: string) => (
                      <div key={opt} onClick={() => updateAnswer(currentQuestion.id, opt)}
                        style={{ border: `2px solid ${answers[currentQuestion.id] === opt ? accentColor : "#E2E8F0"}`, borderRadius: "12px", padding: "13px 16px", cursor: "pointer", background: answers[currentQuestion.id] === opt ? `${accentColor}0D` : "#FAFAFA", display: "flex", alignItems: "center", gap: "12px", transition: "all 0.15s" }}>
                        <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${answers[currentQuestion.id] === opt ? accentColor : "#CBD5E1"}`, background: answers[currentQuestion.id] === opt ? accentColor : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {answers[currentQuestion.id] === opt && <span style={{ color: "white", fontSize: "0.6rem" }}>✓</span>}
                        </div>
                        <span style={{ color: "#334155", fontWeight: "500", fontSize: "0.9rem" }}>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {currentQuestion.type === "checkbox" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {currentQuestion.options.map((opt: string) => {
                      const checked = ((answers[currentQuestion.id] as string[]) || []).includes(opt);
                      return (
                        <div key={opt} onClick={() => toggleCheckbox(currentQuestion.id, opt)}
                          style={{ border: `2px solid ${checked ? accentColor : "#E2E8F0"}`, borderRadius: "12px", padding: "13px 16px", cursor: "pointer", background: checked ? `${accentColor}0D` : "#FAFAFA", display: "flex", alignItems: "center", gap: "12px", transition: "all 0.15s" }}>
                          <div style={{ width: "18px", height: "18px", borderRadius: "4px", border: `2px solid ${checked ? accentColor : "#CBD5E1"}`, background: checked ? accentColor : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {checked && <span style={{ color: "white", fontSize: "0.65rem" }}>✓</span>}
                          </div>
                          <span style={{ color: "#334155", fontWeight: "500", fontSize: "0.9rem" }}>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {currentQuestion.type === "text" && (
                  <input style={inputStyle} placeholder={currentQuestion.placeholder} value={(answers[currentQuestion.id] as string) || ""} onChange={e => updateAnswer(currentQuestion.id, e.target.value)} />
                )}
                {currentQuestion.type === "textarea" && (
                  <textarea style={{ ...inputStyle, minHeight: "110px", resize: "vertical" }} placeholder={currentQuestion.placeholder} value={(answers[currentQuestion.id] as string) || ""} onChange={e => updateAnswer(currentQuestion.id, e.target.value)} />
                )}

                <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
                  <button onClick={() => currentQ === 0 ? setStep(STEPS.PACKAGE) : setCurrentQ(q => q - 1)} style={backBtnStyle}>← Back</button>
                  {!isLastQuestion
                    ? <button onClick={() => setCurrentQ(q => q + 1)} style={{ ...btnStyle(true, accentColor), flex: 2, margin: 0 }}>Next →</button>
                    : <button onClick={handleSubmit} disabled={isSubmitting} style={{ ...btnStyle(true, "#16A34A"), flex: 2, margin: 0 }}>{isSubmitting ? "Submitting..." : "Submit My Onboarding ✓"}</button>
                  }
                </div>
                <p onClick={() => !isLastQuestion ? setCurrentQ(q => q + 1) : handleSubmit()} style={{ textAlign: "center", color: "#94A3B8", fontSize: "0.78rem", marginTop: "12px", cursor: "pointer", textDecoration: "underline" }}>
                  Skip this question
                </p>
              </div>
            )}

            {submitted && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "3.5rem", marginBottom: "14px" }}>🎉</div>
                <h2 style={{ fontSize: "1.65rem", fontWeight: "800", color: "#102A5E", marginBottom: "10px" }}>You&apos;re all set, {formData.name}!</h2>
                <p style={{ color: "#64748B", fontSize: "0.925rem", lineHeight: "1.65", maxWidth: "440px", margin: "0 auto 28px" }}>
                  Your onboarding form has been submitted. Our team will review everything before your call so we can hit the ground running.
                </p>
                <div style={{ background: "#F8FAFD", borderRadius: "16px", padding: "20px 24px", border: "1px solid #E2E8F0", marginBottom: "16px", textAlign: "left" }}>
                  <p style={{ fontSize: "0.73rem", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>Your Submission Summary</p>
                  {([["Name", formData.name], ["Business", formData.businessName], ["Email", formData.email], ["Industry", displayIndustry], ["Package", `${selectedPackage?.name} — ${selectedPackage?.tier}`]] as [string, string][]).map(([label, val]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", paddingBottom: "8px", marginBottom: "8px", borderBottom: "1px solid #F1F5F9" }}>
                      <span style={{ color: "#64748B" }}>{label}</span>
                      <span style={{ color: "#102A5E", fontWeight: "700" }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: "0.8rem", color: "#64748B", marginTop: "4px" }}>
                    {landingPages.length} landing page{landingPages.length !== 1 ? "s" : ""} configured · {visibleQuestions.filter((q: { type: string }) => q.type !== "landing_pages").length} interview questions answered
                  </div>
                </div>
                <button onClick={handleCopy} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: `2px solid ${accentColor}`, background: copied ? accentColor : "white", color: copied ? "white" : accentColor, fontWeight: "700", fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s", marginBottom: "12px" }}>
                  {copied ? "✓ Copied to Clipboard!" : "📋 Copy Full Summary"}
                </button>
                <div style={{ background: `${accentColor}10`, borderRadius: "14px", padding: "16px 20px", border: `1px solid ${accentColor}25`, textAlign: "left" }}>
                  <p style={{ color: accentColor, fontWeight: "700", fontSize: "0.875rem", marginBottom: "6px" }}>What happens next?</p>
                  <p style={{ color: "#334155", fontSize: "0.85rem", lineHeight: "1.55" }}>Our team will reach out within 1 business day to confirm your kickoff call. We&apos;ll have your {selectedPackage?.name} campaign ready to launch.</p>
                </div>
              </div>
            )}

          </div>
        </div>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.73rem", marginTop: "18px" }}>© 2026 BotMakers.ai · APEX Affinity Group</p>
      </div>
    </div>
  );
}

const stepLabelStyle: React.CSSProperties = { color: "#C5242F", fontWeight: "700", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.07em", color: "#102A5E", marginBottom: "7px" };
const subLabelStyle: React.CSSProperties = { display: "block", fontSize: "0.72rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748B", marginBottom: "5px" };
const inputStyle: React.CSSProperties = { width: "100%", border: "1.5px solid #E2E8F0", borderRadius: "10px", padding: "12px 14px", fontSize: "0.9rem", color: "#334155", background: "#FAFAFA", outline: "none", fontFamily: "inherit", boxSizing: "border-box", display: "block" };
const btnStyle = (enabled: boolean, color: string): React.CSSProperties => ({ display: "block", width: "100%", marginTop: "24px", padding: "15px", borderRadius: "12px", border: "none", background: enabled ? color : "#E2E8F0", color: enabled ? "white" : "#94A3B8", fontWeight: "700", fontSize: "0.95rem", cursor: enabled ? "pointer" : "not-allowed", transition: "all 0.2s", boxShadow: enabled ? `0 4px 16px ${color}35` : "none" });
const backBtnStyle: React.CSSProperties = { flex: 1, padding: "14px", borderRadius: "12px", border: "2px solid #E2E8F0", background: "white", color: "#64748B", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem" };
