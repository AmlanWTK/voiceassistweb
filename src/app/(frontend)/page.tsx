import React from 'react'

/**
 * Temporary landing placeholder — proves the design tokens, fonts, and
 * Tailwind pipeline work end-to-end. Replaced by the real Home page at CP-4.1.
 */
export default function HomePage() {
  const swatches = [
    'bg-sky-bg border-sky-border',
    'bg-mint-bg border-mint-border',
    'bg-peach-bg border-peach-border',
    'bg-lilac-bg border-lilac-border',
    'bg-butter-bg border-butter-border',
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-6 py-16">
      <div className="text-center max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-mist-green mb-4">
          MIST · Department of Biomedical Engineering
        </p>
        <h1 className="text-5xl font-bold mb-3">Voice Assistant</h1>
        <p className="text-2xl text-navy-700 mb-2">Giving every child a voice.</p>
        <p className="text-2xl text-navy-700 mb-6" lang="bn">
          প্রতিটি শিশুর কণ্ঠে ভাষা।
        </p>
        <p className="text-ink-soft leading-relaxed">
          The official website for the Voice Assistant AAC app is under construction. News,
          device-handover updates, and stories are coming soon.
        </p>
      </div>

      <div className="flex gap-4">
        {swatches.map((s) => (
          <div key={s} className={`h-14 w-14 rounded-2xl border-2 shadow-soft ${s}`} />
        ))}
      </div>

      <a
        href="https://mist.ac.bd"
        className="rounded-btn bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3 transition-colors"
      >
        Visit MIST
      </a>
    </div>
  )
}
