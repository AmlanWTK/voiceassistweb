# Design Guidelines — Official Project Website

> **Status: BINDING.** Adopted 2026-07-30. Every design and content decision in this project is checked against this document. Where earlier documents (design-tokens.md) conflict in spirit, this document wins; tokens are the implementation vocabulary for these principles.

## Vision

This website is not a web version of the mobile application. It is the official digital identity of a research-driven educational initiative developed for children with special needs under the Military Institute of Science and Technology (MIST), Bangladesh.

The website should communicate trust, innovation, compassion, academic excellence, and real-world impact — a long-term national initiative with the potential for international recognition. The experience should feel comparable to Google for Education, Apple Accessibility, UNICEF, Microsoft Education, and leading global research initiatives — not a typical university project website.

## Overall Design Philosophy

**The children are the heroes, not the application.** The app is a tool that enables learning and inclusion; the website focuses on the people whose lives are improved.

Visitors should leave understanding: why this project exists, who it helps, what impact it has created, why they should trust it, and how they can follow or support its journey. The website tells a compelling story rather than simply presenting information.

## Design Principles

### 1. Emotional Storytelling
Every page communicates purpose before functionality. No feature lists — a narrative instead: the challenge faced by special children → the motivation behind the research → the development of the solution → real-world implementation → measurable impact → future vision.

### 2. Premium Simplicity
Clean, spacious, confident. Generous whitespace. No visual clutter. Content breathes. Every section has a clear purpose.

### 3. Professional, Not Childish
The primary audience is parents, teachers, therapists, researchers, universities, government organizations, NGOs, sponsors, and media. The design must feel professional, modern, approachable, and trustworthy — not cartoonish or overly playful.

### 4. Human-Centered Visuals
Authentic photography over stock: children learning, classrooms, teachers interacting, workshops, device handover ceremonies, community engagement, research activities. Emotional connection with dignity and respect.

### 5. Elegant Visual Language
Large confident typography, consistent spacing, thoughtful rounded corners, soft shadows, minimal color palette, calm gradients where appropriate, high-quality illustrations only when they enhance understanding. No decoration without purpose.

## Homepage Story Structure

The homepage unfolds like a story, each section leading to the next:

1. Hero with a powerful mission statement
2. Impact statistics
3. Why this project matters
4. Our solution
5. Interactive application showcase
6. Research and innovation
7. Success stories
8. Latest news and announcements
9. Device distribution and outreach activities
10. Partners and collaborators
11. Call to action

## Content Presentation

No long paragraphs. Use strong headlines, short supporting descriptions, visual storytelling, timelines, statistics, cards, infographics, quotes, images, and videos. Easy to scan; rewarding to explore.

## Motion Design

Enhance, never distract: smooth scrolling, fade-in sections, gentle image reveals, animated statistics, subtle hover effects, elegant page transitions, micro-interactions on buttons and cards. No flashy animation. **All motion respects `prefers-reduced-motion`.**

## Visual Consistency

Typography, spacing, iconography, illustration, photography, buttons, cards, shadows, and color all belong to one design system. Every page immediately feels like the same product.

## Accessibility by Design

Because the project serves children with special needs, accessibility is a core design principle: clear visual hierarchy, high contrast, large readable typography, keyboard-friendly navigation, screen-reader compatibility, reduced-motion support, clear focus indicators, accessible forms, meaningful alt text, simple predictable navigation. **The website itself demonstrates inclusive design.**

## Trust and Credibility

Reinforce authenticity through research milestones, a project timeline, publications, institutional affiliations, partner organizations, awards, testimonials, real statistics, project updates, and team profiles. No unsupported claims. Clarity and transparency.

## News and Community

The website feels alive: releases, workshops, training sessions, school visits, device distributions, success stories, parent and teacher experiences, research updates, events, media coverage. Visitors feel the project continuously growing.

## Tone

Hopeful · Professional · Innovative · Compassionate · Research-driven · Inclusive · Calm · Trustworthy · Inspirational · Future-focused.
Not overly corporate, overly academic, or overly playful.

## Overall Objective

Visitors immediately recognize the official digital presence of a world-class educational research initiative — confidence, meaningful impact, emotional connection, and the highest standards of modern web design, accessibility, and visual storytelling.

---

## Implementation notes (how this maps to our system)

- **Pastels are accents, not the theme.** The app's pastel swatches appear in small, purposeful doses (category chips, stat accents, illustration touches) on calm, spacious light/dark surfaces. Navy remains the voice of the site.
- **Photography-first sections.** Layouts for hero, success stories, and outreach are designed around real photographs (with consent, per the child-safety policy); until real photos arrive, structural placeholders are used — never generic stock of unrelated children.
- **Feature page becomes a story.** "The App" page follows challenge → solution → showcase, not a feature grid.
- **Motion budget:** fade/slide reveals ≤ 400ms, ease-out, once per element; counters animate only on first view; everything gated behind `prefers-reduced-motion`.
- **New content types** this adds to the CMS: Partners, Success Stories/Testimonials, Milestones (timeline), Publications.
