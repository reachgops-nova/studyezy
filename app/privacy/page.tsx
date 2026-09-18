import Link from "next/link";

const sections = [
  ["What we store", "We store account and child-profile details needed to provide the service, learning progress, assessment results, cached answers, and any textbook or practice material a family chooses to upload."],
  ["Why we use it", "We use this information to authenticate families, show the right curriculum, remember progress, personalise the learning sequence, answer questions, and improve reliability. Cached answers help reduce repeated AI processing."],
  ["AI and third parties", "When a family asks a question or requests speech, relevant text may be sent to configured AI or voice providers so StudyEzy can respond. API keys stay server-side. Provider retention and processing are also governed by their policies."],
  ["Family control", "Parents should avoid uploading unnecessary personal information. Use the account controls where available and contact the StudyEzy administrator managing your family account if information needs review or removal."],
  ["Children and safety", "StudyEzy is intended to be used with an adult’s awareness. It is not an emergency, medical, mental-health, or safeguarding service. If a child is in danger or distress, contact an appropriate trusted adult or local service."],
];

export default function PrivacyPage() {
  return <main className="mx-auto min-h-screen max-w-3xl py-4"><Link href="/" className="text-sm font-bold text-brand-ink hover:underline">← Back to StudyEzy</Link><article className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-10"><h1 className="font-display text-4xl font-bold text-slate-900">Privacy</h1><p className="mt-3 leading-7 text-slate-600">StudyEzy is designed to keep family learning focused and understandable.</p><p className="mt-2 text-xs text-slate-400">Last updated: September 2026</p><div className="mt-10 grid gap-7">{sections.map(([heading, body]) => <section key={heading}><h2 className="text-lg font-bold text-slate-900">{heading}</h2><p className="mt-2 leading-7 text-slate-600">{body}</p></section>)}</div></article></main>;
}
