import { redirect } from "next/navigation";
import Link from "next/link";
import { getActiveProfileId } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import Logo, { LogoMark } from "@/components/Logo";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) {
    const profileId = await getActiveProfileId();
    redirect(profileId ? "/select" : "/profiles");
  }

  return <LandingPage />;
}

function LandingPage() {
  return (
    <div className="grid gap-20 pb-16">
      <nav className="flex items-center justify-between pt-2">
        <Logo textClassName="text-xl" />
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy-dark"
          >
            Get started free
          </Link>
        </div>
      </nav>

      <header className="grid gap-6 pt-4 text-center">
        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Homework help that actually checks if it clicked.
        </h1>
        <p className="mx-auto max-w-xl text-lg text-slate-600">
          StudyEzy is a voice-led tutor built from your kid&apos;s own textbook. It pauses to make sure
          they understood, adapts to what they already know, and never turns practice into pressure.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="rounded-lg bg-brand-navy px-6 py-3 text-base font-medium text-white hover:bg-brand-navy-dark"
          >
            Get started free
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Sign in
          </Link>
        </div>
      </header>

      <section className="grid gap-8">
        <h2 className="text-center text-2xl font-bold text-slate-900">What makes it different</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <DifferentiatorCard
            title="Pauses to check understanding"
            body="Ezy teaches in short chunks and stops to ask if it made sense before moving on - not a wall of narration read straight through."
          />
          <DifferentiatorCard
            title="Adapts to your kid, not a calendar"
            body="A quick diagnostic finds what they already know. Retesting happens concept by concept, only when it's actually due - not on a fixed schedule."
          />
          <DifferentiatorCard
            title="Built from their real textbook"
            body="Upload the pages your kid's class is using and StudyEzy teaches to exactly what's being covered - not generic worksheets."
          />
          <DifferentiatorCard
            title="Practice and tests feel different, on purpose"
            body="A wrong answer in practice mode gets 'let's look at this together,' never a red X. Test mode looks different so your kid always knows which one they're in."
          />
        </div>
      </section>

      <section className="grid gap-8">
        <h2 className="text-center text-2xl font-bold text-slate-900">How it works</h2>
        <div className="grid gap-6 sm:grid-cols-4">
          <StepCard number={1} body="Add a subject and unit, and upload a few pages from the textbook." />
          <StepCard number={2} body="Ezy reads them and builds the lesson - checkpoints, examples, and practice questions." />
          <StepCard number={3} body="Your kid learns at their own pace, pausing anytime to ask something." />
          <StepCard number={4} body="A short test adapts what to revisit next, tracked on a simple dashboard." />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <h2 className="text-2xl font-bold text-slate-900">What&apos;s coming</h2>
        <p className="mt-1 text-slate-600">Still being built - here&apos;s what&apos;s next on the roadmap.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <RoadmapItem
            title="Reasoning Interview"
            body="A quick voice chat after each test to find out why an answer was wrong - not just that it was."
          />
          <RoadmapItem
            title="Written Exam Coaching"
            body="Photograph a real handwritten paper and get feedback on exam technique before the marks."
          />
          <RoadmapItem
            title="Prep Planner"
            body="A simple weekly view of what's worth revisiting before the next test."
          />
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Plans</h2>
        <p className="mx-auto mt-2 max-w-md text-slate-600">
          Free while we&apos;re in pilot. Paid plans arrive as we grow - nothing changes for families
          already on the platform without fair notice.
        </p>
        <Link
          href="/register"
          className="mt-6 inline-block rounded-lg bg-brand-navy px-6 py-3 text-base font-medium text-white hover:bg-brand-navy-dark"
        >
          Get started free
        </Link>
      </section>

      <footer className="flex flex-col items-center gap-2 border-t border-slate-200 pt-8 text-center">
        <LogoMark className="h-8 w-8" />
        <p className="text-sm text-slate-500">
          Original teaching content aligned to your family&apos;s own textbook - never copied from it.
        </p>
      </footer>
    </div>
  );
}

function DifferentiatorCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-600">{body}</p>
    </div>
  );
}

function StepCard({ number, body }: { number: number; body: string }) {
  return (
    <div className="grid gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
        {number}
      </span>
      <p className="text-sm text-slate-600">{body}</p>
    </div>
  );
}

function RoadmapItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-xs text-slate-500">{body}</p>
    </div>
  );
}
