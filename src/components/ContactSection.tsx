import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Copy,
  Check,
  ArrowUpRight,
  Mail,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  Github,
  Linkedin,
  Instagram,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BRAND_IDENTITY } from '../data/portfolioData';
import {
  validateContactSubmission,
  buildMailtoHref,
  type ContactFormInput,
} from '../utils/portfolioLogic';
import { sound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export const ContactSection: React.FC = () => {
  const { t, lang } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formInput, setFormInput] = useState<ContactFormInput>({
    name: '',
    email: '',
    inquiryType: 'Software Development & Engineering',
    message: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormInput, string>>
  >({});
  const [preparedMailto, setPreparedMailto] = useState<string | null>(null);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCopyEmail = async () => {
    sound.playChirp(840, 0.08);
    try {
      await navigator.clipboard.writeText(BRAND_IDENTITY.contact.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      setCopiedEmail(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick(800);
    const validation = validateContactSubmission(formInput);
    if (!validation.valid) {
      setErrors(validation.errors);
      setPreparedMailto(null);
      return;
    }
    setErrors({});
    const href = buildMailtoHref(BRAND_IDENTITY.contact.email, formInput);
    setPreparedMailto(href);
    setIsSuccess(true);
    sound.playChirp(920, 0.2);

    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#D6B89A', '#F6F4EF', '#34d399', '#854D27']
    });
  };

  const handleCopyBrief = async () => {
    sound.playClick(750);
    const brief = `Sender: ${formInput.name}\nEmail: ${formInput.email}\nTopic: ${formInput.inquiryType}\n\n${formInput.message}`;
    try {
      await navigator.clipboard.writeText(brief);
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 2500);
    } catch {
      setCopiedBrief(true);
    }
  };

  return (
    <footer
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-[#07080a] text-[#F6F4EF]"
    >
      <div className="mx-auto max-w-[1360px] px-6 py-20 md:px-12 md:py-28">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Left 6 Columns: Editorial Contact Statement & Channels */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between lg:col-span-6"
          >
            <div>
              <p className="font-ui text-xs tracking-[0.18em] text-[#D6B89A] uppercase mb-3 flex items-center gap-2">
                <Sparkles size={13} />
                <span>{t.contact.badge}</span>
              </p>

              <h2
                id="contact-heading"
                className="font-editorial text-3xl sm:text-5xl font-normal leading-[1.08] tracking-[-0.02em] text-[#F6F4EF] [text-wrap:balance]"
              >
                {t.contact.headingPrefix}{' '}
                <span className="font-accent italic text-[#D6B89A]">
                  {t.contact.headingName}
                </span>
                .
              </h2>

              <p className="mt-6 max-w-md font-sans text-sm sm:text-base leading-relaxed text-[#A8A29E]">
                {t.contact.note}
              </p>

              {/* Direct Email Action */}
              <div
                data-cursor="terminal"
                className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 glass-panel hover:border-[#D6B89A]/40 transition-colors"
              >
                <p className="font-ui text-xs text-[#D6B89A] uppercase tracking-wider font-medium">
                  {t.contact.emailTransmission}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-4">
                  <a
                    href={`mailto:${BRAND_IDENTITY.contact.email}`}
                    className="font-editorial text-xl sm:text-2xl text-[#F6F4EF] hover:text-[#D6B89A] transition-colors break-all"
                  >
                    {BRAND_IDENTITY.contact.email}
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 hover:border-[#D6B89A]/50 px-3.5 py-1.5 font-ui text-xs text-[#F6F4EF] transition-all cursor-pointer"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#34d399]" />
                        <span className="text-[#34d399] font-medium">{t.contact.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-[#A8A29E]" />
                        <span>{t.contact.copy}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Branded Social Channels Grid */}
              <div className="mt-8">
                <p className="font-ui text-[11px] text-[#A8A29E] uppercase tracking-wider font-semibold mb-3">
                  {t.contact.socialChannels}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* GitHub */}
                  <a
                    href={BRAND_IDENTITY.contact.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#D6B89A]/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#F6F4EF] group-hover:text-[#D6B89A] group-hover:border-[#D6B89A]/40 transition-colors">
                        <Github size={16} />
                      </div>
                      <div className="text-left">
                        <span className="block font-ui text-xs font-medium text-[#F6F4EF] group-hover:text-[#D6B89A] transition-colors">
                          GitHub
                        </span>
                        <span className="block font-mono text-[10px] text-[#78716C]">
                          {BRAND_IDENTITY.contact.githubHandle}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight size={14} className="text-[#A8A29E] group-hover:text-[#D6B89A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={BRAND_IDENTITY.contact.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#D6B89A]/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#F6F4EF] group-hover:text-[#D6B89A] group-hover:border-[#D6B89A]/40 transition-colors">
                        <Linkedin size={16} />
                      </div>
                      <div className="text-left">
                        <span className="block font-ui text-xs font-medium text-[#F6F4EF] group-hover:text-[#D6B89A] transition-colors">
                          LinkedIn
                        </span>
                        <span className="block font-mono text-[10px] text-[#78716C]">
                          {BRAND_IDENTITY.contact.linkedinHandle}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight size={14} className="text-[#A8A29E] group-hover:text-[#D6B89A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>

                  {/* Instagram */}
                  <a
                    href={BRAND_IDENTITY.contact.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#D6B89A]/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#F6F4EF] group-hover:text-[#D6B89A] group-hover:border-[#D6B89A]/40 transition-colors">
                        <Instagram size={16} />
                      </div>
                      <div className="text-left">
                        <span className="block font-ui text-xs font-medium text-[#F6F4EF] group-hover:text-[#D6B89A] transition-colors">
                          Instagram
                        </span>
                        <span className="block font-mono text-[10px] text-[#78716C]">
                          {BRAND_IDENTITY.contact.instagramHandle}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight size={14} className="text-[#A8A29E] group-hover:text-[#D6B89A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                </div>
              </div>
            </div>

            {/* Colophon & Metadata Footnote */}
            <div className="mt-12 pt-8 border-t border-white/10 font-ui text-xs text-[#78716C] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span>{BRAND_IDENTITY.brandName} © {new Date().getFullYear()}</span>
                <span className="mx-2">·</span>
                <span>{t.contact.colophon}</span>
              </div>
            </div>
          </motion.div>

          {/* Right 6 Columns: Interactive Collaboration Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10">
              {isSuccess ? (
                <div className="py-10 flex flex-col items-center text-center gap-4 animate-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 rounded-full bg-[#34d399]/20 border border-[#34d399]/40 flex items-center justify-center text-[#34d399]">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl text-[#F6F4EF]">
                    {t.contact.successTitle}
                  </h3>
                  <p className="text-sm font-sans text-[#A8A29E] max-w-md">
                    {t.contact.successDesc}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                    {preparedMailto && (
                      <a
                        href={preparedMailto}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F6F4EF] hover:bg-[#D6B89A] text-[#09090b] font-ui text-xs font-semibold tracking-wider transition-colors no-underline"
                      >
                        <Mail size={15} />
                        <span>{t.contact.openMailClient}</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={handleCopyBrief}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-[#F6F4EF] font-ui text-xs cursor-pointer"
                    >
                      {copiedBrief ? <Check size={14} className="text-[#34d399]" /> : <Copy size={14} />}
                      <span>{copiedBrief ? (lang === 'id' ? 'Tersalin' : 'Copied Brief') : t.contact.copyBrief}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setFormInput({
                        name: '',
                        email: '',
                        inquiryType: 'Software Development & Engineering',
                        message: '',
                      });
                    }}
                    className="mt-4 font-ui text-xs text-[#78716C] hover:text-[#A8A29E] underline cursor-pointer"
                  >
                    {t.contact.sendAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <span className="font-ui text-xs text-[#D6B89A] uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare size={13} />
                      <span>{t.contact.inquiryTerminal}</span>
                    </span>
                    <span className="font-ui text-[11px] text-[#78716C]">
                      {t.contact.directDispatch}
                    </span>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="font-ui text-xs text-[#A8A29E] uppercase tracking-wider block mb-1.5">
                      {t.contact.nameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={formInput.name}
                      onChange={(e) => setFormInput({ ...formInput, name: e.target.value })}
                      placeholder={t.contact.namePlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-[#D6B89A] focus:outline-none text-[#F6F4EF] text-sm font-sans"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1 font-ui">{errors.name}</p>}
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="font-ui text-xs text-[#A8A29E] uppercase tracking-wider block mb-1.5">
                      {t.contact.emailLabel}
                    </label>
                    <input
                      type="email"
                      required
                      value={formInput.email}
                      onChange={(e) => setFormInput({ ...formInput, email: e.target.value })}
                      placeholder={t.contact.emailPlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-[#D6B89A] focus:outline-none text-[#F6F4EF] text-sm font-sans"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1 font-ui">{errors.email}</p>}
                  </div>

                  {/* Inquiry Topic */}
                  <div>
                    <label className="font-ui text-xs text-[#A8A29E] uppercase tracking-wider block mb-1.5">
                      {t.contact.domainLabel}
                    </label>
                    <select
                      value={formInput.inquiryType}
                      onChange={(e) => setFormInput({ ...formInput, inquiryType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#141312] border border-white/10 focus:border-[#D6B89A] focus:outline-none text-[#F6F4EF] text-sm font-ui cursor-pointer"
                    >
                      <option value="Software Development & Engineering">
                        {t.contact.domainOptions.software}
                      </option>
                      <option value="Web Systems & Full-Stack Applications">
                        {t.contact.domainOptions.web}
                      </option>
                      <option value="General Conversation & Mentorship">
                        {t.contact.domainOptions.general}
                      </option>
                    </select>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="font-ui text-xs text-[#A8A29E] uppercase tracking-wider block mb-1.5">
                      {t.contact.scopeLabel}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formInput.message}
                      onChange={(e) => setFormInput({ ...formInput, message: e.target.value })}
                      placeholder={t.contact.scopePlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-[#D6B89A] focus:outline-none text-[#F6F4EF] text-sm font-sans resize-none"
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1 font-ui">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="mt-2 w-full py-4 rounded-xl bg-[#F6F4EF] hover:bg-[#D6B89A] text-[#09090b] font-ui text-xs font-semibold tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(214,184,154,0.35)]"
                  >
                    <span>{t.contact.submitBtn}</span>
                    <Send size={14} />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};
