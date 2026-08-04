import React from 'react'
import { setRequestLocale } from 'next-intl/server'

import { Badge } from '@/components/ui/Badge'
import { Button, ButtonAnchor, ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { QuoteBlock } from '@/components/ui/QuoteBlock'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatTile } from '@/components/ui/StatTile'
import { TimelineItem } from '@/components/ui/TimelineItem'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'

/**
 * Design-system demo page (CP-3.2 verification surface).
 * Not linked from navigation — visit /en/design or /bn/design directly.
 */
export default async function DesignPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)

  return (
    <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Design System"
        title="Component library"
        lede="Every building block of the site, in both themes and both languages. Internal page — not linked from navigation."
      />

      <section className="space-y-4">
        <h3 className="text-xl font-bold">Buttons</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="lg">Large primary</Button>
          <ButtonLink href="/" variant="secondary">
            Internal link
          </ButtonLink>
          <ButtonAnchor href="https://mist.ac.bd" variant="ghost">
            External link
          </ButtonAnchor>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold">Badges (news categories)</h3>
        <div className="flex flex-wrap gap-2">
          <Badge tone="mint">Handover Event</Badge>
          <Badge tone="sky">App Update</Badge>
          <Badge tone="butter">Milestone</Badge>
          <Badge tone="peach">Outreach</Badge>
          <Badge tone="lilac">Research</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold">Stat tiles (animated counters)</h3>
        <Card className="grid grid-cols-2 gap-8 p-10 md:grid-cols-4">
          <StatTile value={120} suffix="+" label="Devices handed over" />
          <StatTile value={340} label="Children reached" />
          <StatTile value={16} label="Word categories" />
          <StatTile value={2} label="Languages" />
        </Card>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold">Quote block</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <QuoteBlock
            quote="আমার ছেলে এই অ্যাপের মাধ্যমে প্রথমবার নিজের কথা বোঝাতে পেরেছে। সেই মুহূর্তটা আমি কোনোদিন ভুলব না।"
            name="একজন কৃতজ্ঞ মা"
            role="অভিভাবক"
          />
          <QuoteBlock
            quote="The picture boards changed how my students participate in class. They ask for things now — on their own."
            name="A special educator"
            role="Teacher"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold">Timeline</h3>
        <Card className="p-8">
          <ol>
            <TimelineItem date="Sep 2025" type="research" typeLabel="Research" title="Project research begins" description="Needs assessment with special-education teachers and families." />
            <TimelineItem date="Jun 2026" type="release" typeLabel="Release" title="Voice Assist 1.0" description="First stable release with 16 communication categories in Bangla and English." />
            <TimelineItem date="Jul 2026" type="outreach" typeLabel="Outreach" title="First device handover" description="Devices delivered to the first partner school in Dhaka." isLast />
          </ol>
        </Card>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold">Lazy YouTube embed</h3>
        <div className="max-w-2xl">
          <YouTubeEmbed url="https://youtu.be/dQw4w9WgXcQ" title="Demo video" />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold">Reveal on scroll</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {[0, 100, 200].map((delay) => (
            <Reveal key={delay} delay={delay}>
              <Card className="p-8 text-center">
                <p className="font-semibold">Fades in ({delay}ms delay)</p>
                <p className="mt-2 text-sm text-ink-soft">Disabled under reduced motion.</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
