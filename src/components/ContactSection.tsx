import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Copy, ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio-data';
import { ScrollHeadlineReveal } from './ScrollTextReveal';
import { motion } from 'motion/react';

export const ContactSection: React.FC = () => {
  const { identity } = PORTFOLIO_DATA;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('Full-Stack Engineering');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot trap field

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    // Client-side quick checks
    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'Please enter your name.' });
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFeedback({ type: 'error', message: 'Please provide a valid email address.' });
      return;
    }
    if (!message.trim() || message.length < 10) {
      setFeedback({ type: 'error', message: 'Message must be at least 10 characters.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          projectType,
          message: message.trim(),
          honeypot,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFeedback({
          type: 'success',
          message: data.message || 'Inquiry successfully transmitted. Rohit will respond shortly.',
        });
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Unable to submit inquiry. Please email directly at rohitbora535@gmail.com.',
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Network connection error. Please send an email directly to rohitbora535@gmail.com.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(identity.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const mailtoHref = `mailto:${identity.email}?subject=${encodeURIComponent(
    `[Portfolio Inquiry] ${projectType} from ${name || 'Prospective Partner'}`
  )}&body=${encodeURIComponent(message || 'Hello Rohit,\n\nI would like to discuss...')}`;

  return (
    <section id="contact" className="py-24 sm:py-32 bg-[var(--bg-secondary)] text-[var(--text-primary)] border-t border-[var(--border-subtle)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Invitation & Direct Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.12, delayChildren: 0.05 },
                },
              }}
              className="space-y-4"
            >
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
                }}
                className="text-xs uppercase tracking-widest text-[var(--accent-champagne)] font-mono-code font-semibold block"
              >
                06. Direct Engagement
              </motion.span>
              <motion.h2
                variants={{
                  hidden: { opacity: 0, y: 22 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
                }}
                className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] [text-wrap:balance]"
              >
                Let us build something of consequence.
              </motion.h2>
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
                }}
                className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed"
              >
                Available for full-time software engineering roles, enterprise contract architecture, 
                and legitimate freelance digital product builds.
              </motion.p>
            </motion.div>

            <div className="pt-6 space-y-4">
              <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-sm">
                <p className="text-[11px] font-mono-code text-[var(--accent-champagne)] font-semibold uppercase tracking-wider mb-2">
                  Direct Inquiries & Response SLA
                </p>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <a
                    href={`mailto:${identity.email}`}
                    className="text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--accent-champagne)] transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-4 h-4 text-[var(--accent-champagne)]" />
                    <span>{identity.email}</span>
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="p-1.5 rounded bg-[var(--bg-elevated)] hover:bg-[var(--bg-input)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 cursor-pointer border border-[var(--border-card)]"
                    title="Copy email to clipboard"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-2 font-mono-code">
                  Expected reply time: &lt; 24 business hours
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-sm">
                <p className="text-[11px] font-mono-code text-[var(--accent-champagne)] font-semibold uppercase tracking-wider mb-1">
                  Availability & Location
                </p>
                <p className="text-sm text-[var(--text-primary)] font-medium">Almora, Uttarakhand · Remote Global</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">Open to relocation for qualified software engineering teams.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Server-Validated Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-sm">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">
                Initiate Project Discussion
              </h3>
              <p className="text-xs text-[var(--text-muted)] mb-8 font-mono-code">
                Server-validated submission with instant mailto alternative
              </p>

              {feedback && (
                <div
                  className={`p-4 rounded-xl mb-6 text-xs flex items-start gap-3 border ${
                    feedback.type === 'success'
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                      : 'bg-red-950/20 border-red-800/40 text-red-300'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p>{feedback.message}</p>
                    {feedback.type === 'error' && (
                      <a
                        href={mailtoHref}
                        className="underline inline-flex items-center gap-1 font-semibold hover:text-[var(--accent-champagne)]"
                      >
                        Click here to send directly via your mail client <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field hidden from users for spam protection */}
                <input
                  type="text"
                  name="company_website_url"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono-code text-[var(--accent-champagne)] font-semibold mb-2 uppercase tracking-wider">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full px-4 py-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-card)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-champagne)] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-code text-[var(--accent-champagne)] font-semibold mb-2 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. elena@company.com"
                      className="w-full px-4 py-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-card)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-champagne)] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-[var(--accent-champagne)] font-semibold mb-2 uppercase tracking-wider">
                    Inquiry Vector
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-card)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-champagne)] transition-colors cursor-pointer"
                  >
                    <option value="Full-Stack Engineering">Full-Stack Engineering Opportunity</option>
                    <option value="Freelance Web Application">Freelance Web Application / Store</option>
                    <option value="Enterprise ERP / Dashboard">Enterprise ERP or Operations Dashboard</option>
                    <option value="Technical Collaboration">Technical Collaboration / Advisory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-[var(--accent-champagne)] font-semibold mb-2 uppercase tracking-wider">
                    Project Scope or Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide a concise summary of the engineering challenge, timeline, or scope..."
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-card)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-champagne)] transition-colors"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[var(--text-primary)] hover:bg-[var(--accent-champagne)] text-[var(--bg-primary)] hover:text-black text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                  >
                    <span>{isSubmitting ? 'Transmitting...' : 'Send Message'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={mailtoHref}
                    className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent-champagne)] transition-colors flex items-center gap-1 font-mono-code"
                  >
                    <span>Open Mail Client Direct</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
