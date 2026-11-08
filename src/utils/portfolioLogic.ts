import type {
  CapabilityCategoryId,
  CredentialItem,
  JourneyMilestone,
  SkillNode,
} from '../data/portfolioData';

export interface FriezeTransform {
  offset: number;
  absOffset: number;
  translateXPercent: number;
  translateZPx: number;
  rotateYDeg: number;
  scale: number;
  opacity: number;
  zIndex: number;
  isCenter: boolean;
}

/**
 * Wraps an arbitrary index into valid bounds [0, total - 1].
 */
export function wrapGalleryIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

/**
 * Computes the continuous 3D transform for the Frieze Cover-Flow exhibition stage.
 * Uses infinitely differentiable (C-infinity) hyperbolic & quadratic curves for velvety, flutter-free motion.
 */
export function calculateFriezeTransform(
  itemIndex: number,
  activeIndex: number,
  _totalItems?: number
): FriezeTransform {
  const diff = itemIndex - activeIndex;
  const absOffset = Math.abs(diff);
  const isCenter = absOffset < 0.5;

  const sign = diff === 0 ? 0 : diff > 0 ? 1 : -1;

  // 1. Continuous Organic Horizontal Spread:
  // Smoothly accelerates near center and maintains natural perspective spacing
  const translateXPercent = sign * (42 * absOffset + 24 * Math.tanh(absOffset * 1.6));

  // 2. Continuous Depth (Z-Translation):
  // Center card pushes forward to +50px Z; side cards smoothly recede into deep 3D space
  const translateZPx = 50 - 150 * Math.tanh(absOffset * 1.1) - 25 * absOffset;

  // 3. Continuous Organic Y-Rotation:
  // Eases into maximum tilt (-29° to +29°) without abrupt piecewise angle corners
  const rotateYDeg = -Math.tanh(diff * 1.35) * 29;

  // 4. Continuous Scale:
  // Smooth natural perspective foreshortening
  const scale = 0.74 + 0.26 / (1 + 0.55 * absOffset * absOffset);

  // 5. Continuous Opacity:
  // Highly visible at center, graceful fade-out when receding beyond 1.8 units
  const opacity = Math.max(0, Math.min(1, 1 - 0.26 * absOffset * absOffset));

  // 6. Stacking Index:
  const zIndex = Math.max(1, Math.round(100 - absOffset * 10));

  return {
    offset: diff,
    absOffset,
    translateXPercent,
    translateZPx,
    rotateYDeg,
    scale,
    opacity,
    zIndex,
    isCenter,
  };
}

/**
 * Filters skills by capability category.
 */
export function getSkillsByCategory(
  skills: SkillNode[],
  categoryId: CapabilityCategoryId
): SkillNode[] {
  return skills.filter((skill) => skill.categoryId === categoryId);
}

/**
 * Returns credentials connected to a given skill ID.
 */
export function getLinkedCredentialsForSkill(
  skill: SkillNode,
  credentials: CredentialItem[]
): CredentialItem[] {
  const set = new Set(skill.linkedCredentialIds);
  return credentials.filter(
    (cred) => set.has(cred.id) || cred.connectedSkillIds.includes(skill.id)
  );
}

/**
 * Returns skills connected to a given credential item.
 */
export function getLinkedSkillsForCredential(
  credential: CredentialItem,
  skills: SkillNode[]
): SkillNode[] {
  const set = new Set(credential.connectedSkillIds);
  return skills.filter(
    (skill) => set.has(skill.id) || skill.linkedCredentialIds.includes(credential.id)
  );
}

/**
 * Filters credentials by category or 'all'.
 */
export function filterCredentialsByCategory(
  credentials: CredentialItem[],
  categoryFilter: CapabilityCategoryId | 'all'
): CredentialItem[] {
  if (categoryFilter === 'all') return credentials;
  return credentials.filter((c) => c.categoryId === categoryFilter);
}

/**
 * Filters journey milestones by category or 'All'.
 */
export function filterJourneyMilestones(
  milestones: JourneyMilestone[],
  category: JourneyMilestone['category'] | 'All'
): JourneyMilestone[] {
  if (category === 'All') return milestones;
  return milestones.filter((m) => m.category === category);
}

export interface ContactFormInput {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormInput, string>>;
}

/**
 * Validates the contact inquiry form without silently substituting fallback values.
 */
export function validateContactSubmission(
  input: ContactFormInput
): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormInput, string>> = {};
  const trimmedName = input.name.trim();
  const trimmedEmail = input.email.trim();
  const trimmedMessage = input.message.trim();

  if (!trimmedName) {
    errors.name = 'Please enter your name.';
  }
  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!trimmedMessage || trimmedMessage.length < 10) {
    errors.message = 'Please include a brief message (at least 10 characters).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Builds a structured mailto URI for honest client-side email dispatch.
 */
export function buildMailtoHref(
  recipientEmail: string,
  input: ContactFormInput
): string {
  const subject = `[AksanLab Inquiry] ${input.inquiryType || 'Collaboration'} — from ${input.name.trim()}`;
  const body = [
    `Hello Aksan,`,
    ``,
    input.message.trim(),
    ``,
    `---`,
    `Sender: ${input.name.trim()}`,
    `Email: ${input.email.trim()}`,
    `Topic: ${input.inquiryType || 'General Collaboration'}`,
  ].join('\n');

  return `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export interface ScrollProgressState {
  progress: number;
  percentage: number;
  isVisible: boolean;
}

/**
 * Computes normalized page scroll progress [0, 1] and visibility threshold
 * so the glass-nav progress hairline appears only after scrolling away from the top.
 */
export function calculateScrollProgress(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
  visibilityThresholdPx = 24
): ScrollProgressState {
  const safeTop = Math.max(0, scrollTop);
  const maxScrollable = Math.max(0, scrollHeight - clientHeight);
  const rawProgress = maxScrollable > 0 ? safeTop / maxScrollable : 0;
  const progress = Math.min(1, Math.max(0, rawProgress));
  const isVisible = safeTop > visibilityThresholdPx;

  return {
    progress,
    percentage: Math.round(progress * 100),
    isVisible,
  };
}

