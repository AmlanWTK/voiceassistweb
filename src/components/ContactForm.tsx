'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'

type RequestType = 'contact' | 'device-request'
type Status = 'idle' | 'submitting' | 'success' | 'error'

const inputClass =
  'w-full rounded-btn border border-line bg-surface px-4 py-2.5 text-ink placeholder:text-ink-soft/60 transition-colors focus:border-primary focus:outline-none'

/** Localized contact / device-request form. Submits directly to Payload's
 *  public REST create endpoint for the Contact Requests collection — the
 *  honeypot field, rate limiting, and forced "new" status are all enforced
 *  server-side in that collection's beforeValidate hook (Phase 2). */
export function ContactForm({ defaultType = 'contact' }: { defaultType?: RequestType }) {
  const t = useTranslations('contactPage')
  const [requestType, setRequestType] = useState<RequestType>(defaultType)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFieldError(null)

    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const message = String(data.get('message') || '').trim()
    const organization = String(data.get('organization') || '').trim()
    const phone = String(data.get('phone') || '').trim()
    const website = String(data.get('website') || '') // honeypot

    if (!name || !email || !message) {
      setFieldError(t('errors.required'))
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError(t('errors.invalidEmail'))
      return
    }

    setStatus('submitting')
    try {
      const res = await fetch('/api/contact-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          organization: organization || undefined,
          phone: phone || undefined,
          requestType,
          website: website || undefined,
        }),
      })

      if (res.ok) {
        setStatus('success')
        form.reset()
        setRequestType(defaultType)
        return
      }

      if (res.status === 429) {
        setErrorMessage(t('errors.rateLimited'))
      } else {
        setErrorMessage(t('errors.generic'))
      }
      setStatus('error')
    } catch {
      setErrorMessage(t('errors.network'))
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-card border border-line bg-mint-bg p-8 text-center">
        <p className="text-xl font-bold text-navy-900">{t('success.title')}</p>
        <p className="mt-3 text-ink-soft">{t('success.body')}</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm font-semibold text-primary hover:underline"
        >
          {t('success.sendAnother')}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Request type selector */}
      <div>
        <span className="mb-2 block text-sm font-semibold text-navy-900">{t('form.typeLabel')}</span>
        <div className="flex flex-wrap gap-3">
          {(['contact', 'device-request'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setRequestType(type)}
              aria-pressed={requestType === type}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                requestType === type
                  ? 'border-primary-btn bg-primary-btn text-white'
                  : 'border-line bg-surface text-navy-700 hover:border-primary hover:text-primary'
              }`}
            >
              {type === 'contact' ? t('form.typeContact') : t('form.typeDevice')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-navy-900">
            {t('form.name')} <span className="text-primary">*</span>
          </label>
          <input id="name" name="name" type="text" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="organization" className="mb-1.5 block text-sm font-semibold text-navy-900">
            {t('form.organization')}
          </label>
          <input id="organization" name="organization" type="text" className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-navy-900">
            {t('form.email')} <span className="text-primary">*</span>
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-navy-900">
            {t('form.phone')}
          </label>
          <input id="phone" name="phone" type="tel" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-navy-900">
          {t('form.message')} <span className="text-primary">*</span>
        </label>
        <textarea id="message" name="message" required rows={5} className={inputClass} />
      </div>

      {/* Honeypot — hidden from real visitors, bots tend to fill every field */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {(fieldError || status === 'error') && (
        <p role="alert" className="text-sm font-medium text-error">
          {fieldError || errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center justify-center gap-2 rounded-btn bg-primary-btn px-7 py-3.5 text-base font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-primary-btn-hover disabled:pointer-events-none disabled:opacity-50"
      >
        {status === 'submitting' ? t('form.submitting') : t('form.submit')}
      </button>
    </form>
  )
}
