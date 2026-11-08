import test from 'node:test';
import assert from 'node:assert/strict';
import {
  wrapGalleryIndex,
  calculateFriezeTransform,
  getSkillsByCategory,
  getLinkedCredentialsForSkill,
  getLinkedSkillsForCredential,
  filterCredentialsByCategory,
  filterJourneyMilestones,
  validateContactSubmission,
  buildMailtoHref,
  calculateScrollProgress,
} from './portfolioLogic';
import {
  SKILL_NODES,
  CREDENTIALS_ARCHIVE,
  JOURNEY_MILESTONES,
} from '../data/portfolioData';

test('wrapGalleryIndex wraps positive and negative indices cleanly', () => {
  assert.equal(wrapGalleryIndex(0, 5), 0);
  assert.equal(wrapGalleryIndex(5, 5), 0);
  assert.equal(wrapGalleryIndex(-1, 5), 4);
  assert.equal(wrapGalleryIndex(-6, 5), 4);
});

test('calculateFriezeTransform sets center panel prominent and side panels angled', () => {
  const center = calculateFriezeTransform(2, 2, 5);
  assert.equal(center.isCenter, true);
  assert.equal(center.rotateYDeg, 0);
  assert.equal(center.scale, 1);
  assert.equal(center.opacity, 1);

  const rightPanel = calculateFriezeTransform(3, 2, 5);
  assert.equal(rightPanel.isCenter, false);
  assert.equal(rightPanel.offset, 1);
  assert.equal(rightPanel.rotateYDeg, -28);
  assert.ok(rightPanel.scale < 1);

  const leftPanel = calculateFriezeTransform(1, 2, 5);
  assert.equal(leftPanel.offset, -1);
  assert.equal(leftPanel.rotateYDeg, 28);
});

test('capability and credential relational mapping returns accurate connected items', () => {
  const coreSkills = getSkillsByCategory(SKILL_NODES, 'core-dev');
  assert.ok(coreSkills.length >= 3);

  const tsSkill = SKILL_NODES.find((s) => s.id === 'ts-js-core')!;
  const linkedCreds = getLinkedCredentialsForSkill(tsSkill, CREDENTIALS_ARCHIVE);
  assert.ok(linkedCreds.length >= 1);

  const firstCred = CREDENTIALS_ARCHIVE[0];
  const linkedSkills = getLinkedSkillsForCredential(firstCred, SKILL_NODES);
  assert.ok(linkedSkills.some((s) => s.id === 'ts-js-core'));

  const webCreds = filterCredentialsByCategory(CREDENTIALS_ARCHIVE, 'web-systems');
  assert.ok(webCreds.every((c) => c.categoryId === 'web-systems'));
});

test('filterJourneyMilestones filters by category and returns all for All', () => {
  const all = filterJourneyMilestones(JOURNEY_MILESTONES, 'All');
  assert.equal(all.length, JOURNEY_MILESTONES.length);

  const edu = filterJourneyMilestones(JOURNEY_MILESTONES, 'Education');
  assert.equal(edu.length, 1);
  assert.equal(edu[0].category, 'Education');
});

test('validateContactSubmission enforces required fields and formats mailto URI', () => {
  const invalid = validateContactSubmission({
    name: '',
    email: 'invalid-email',
    inquiryType: 'Software Engineering',
    message: 'short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.message);

  const validInput = {
    name: 'Clara Vance',
    email: 'clara@example.com',
    inquiryType: 'AI-Native Product Collaboration',
    message: 'We would love to discuss an experimental web and AI-native product prototype.',
  };
  const valid = validateContactSubmission(validInput);
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});

  const mailto = buildMailtoHref('aksan.zulkarnain@gmail.com', validInput);
  assert.ok(mailto.startsWith('mailto:aksan.zulkarnain@gmail.com?subject='));
  assert.ok(mailto.includes('Clara%20Vance'));
});

test('calculateScrollProgress hides indicator at top and tracks normalized progress when scrolled', () => {
  const atTop = calculateScrollProgress(0, 3000, 1000);
  assert.equal(atTop.isVisible, false);
  assert.equal(atTop.progress, 0);
  assert.equal(atTop.percentage, 0);

  const nearTop = calculateScrollProgress(12, 3000, 1000);
  assert.equal(nearTop.isVisible, false);

  const halfway = calculateScrollProgress(1000, 3000, 1000);
  assert.equal(halfway.isVisible, true);
  assert.equal(halfway.progress, 0.5);
  assert.equal(halfway.percentage, 50);

  const atBottom = calculateScrollProgress(2000, 3000, 1000);
  assert.equal(atBottom.isVisible, true);
  assert.equal(atBottom.progress, 1);
  assert.equal(atBottom.percentage, 100);
});

