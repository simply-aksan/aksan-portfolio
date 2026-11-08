import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  SELECTED_PROJECTS,
  CREDENTIALS_ARCHIVE,
  JOURNEY_MILESTONES,
  type ProjectItem,
  type CredentialItem,
  type JourneyMilestone,
} from '../data/portfolioData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kzrgduqqgblfprfbxcok.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_7TNyKcUdTw2HDs-A37iNQQ_LFdY-F97';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Keys for offline/fallback local storage cache
const STORAGE_KEYS = {
  PROJECTS: 'aksanlab_projects_v3',
  CREDENTIALS: 'aksanlab_credentials_v3',
  MILESTONES: 'aksanlab_milestones_v3',
};

// ---------------------------------------------------------------------------
// PROJECT MAPPERS
// ---------------------------------------------------------------------------
function mapProjectFromDb(row: any): ProjectItem {
  return {
    id: row.id,
    index: row.index || '01',
    title: row.title,
    accentWord: row.accent_word || '',
    category: row.category,
    year: row.year,
    status: row.status,
    summary: row.summary,
    editorialThesis: row.editorial_thesis || '',
    architectureNotes: Array.isArray(row.architecture_notes) ? row.architecture_notes : [],
    technologies: Array.isArray(row.technologies) ? row.technologies : [],
    visualArchetype: row.visual_archetype || 'spatial-ai',
    videoUrl: row.video_url || row.extended_case_study?.videoUrl || undefined,
    coverImageUrl: row.cover_image_url || undefined,
    role: row.role || undefined,
    metrics: Array.isArray(row.metrics) ? row.metrics : undefined,
    extendedCaseStudy: row.extended_case_study || undefined,
    liveDemoUrl: row.live_demo_url || undefined,
    repositoryUrl: row.repository_url || undefined,
    isPlaceholderSlot: Boolean(row.is_placeholder_slot),
  };
}

function mapProjectToDb(p: ProjectItem, sortOrder = 0) {
  // Safe sanitize arrays
  const archNotes = Array.isArray(p.architectureNotes)
    ? p.architectureNotes.filter(Boolean)
    : [];
  const techList = Array.isArray(p.technologies)
    ? p.technologies.filter(Boolean)
    : [];
  const metricsList = Array.isArray(p.metrics) ? p.metrics : [];

  // Extended case study narrative
  const caseStudy = p.extendedCaseStudy || null;
  if (caseStudy && p.videoUrl) {
    (caseStudy as any).videoUrl = p.videoUrl;
  }

  // Note: Only columns declared in public.projects are sent to prevent PostgREST PGRST204 errors
  return {
    id: p.id,
    index: p.index || '01',
    title: p.title || 'Untitled Project',
    accent_word: p.accentWord || '',
    category: p.category || 'Software Development',
    year: p.year || new Date().getFullYear().toString(),
    status: p.status || 'Active System',
    summary: p.summary || '',
    editorial_thesis: p.editorialThesis || '',
    architecture_notes: archNotes,
    technologies: techList,
    visual_archetype: p.visualArchetype || 'spatial-ai',
    cover_image_url: p.coverImageUrl || null,
    role: p.role || null,
    metrics: metricsList,
    extended_case_study: caseStudy,
    live_demo_url: p.liveDemoUrl || null,
    repository_url: p.repositoryUrl || null,
    is_placeholder_slot: Boolean(p.isPlaceholderSlot),
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// CREDENTIAL MAPPERS
// ---------------------------------------------------------------------------
function mapCredentialFromDb(row: any): CredentialItem {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    issuer: row.issuer,
    issueDate: row.issue_date,
    credentialId: row.credential_id || '',
    credentialUrl: row.credential_url || undefined,
    pdfAvailable: Boolean(row.pdf_available),
    categoryId: row.category_id || 'core-dev',
    connectedSkillIds: Array.isArray(row.connected_skill_ids) ? row.connected_skill_ids : [],
    verificationState: row.verification_state || 'Verified Record',
    badgeImageUrl: row.badge_image_url || undefined,
    summary: row.summary || '',
    documentSpec: row.document_spec || {
      format: 'Digital Verified Record',
      scope: 'Professional Certification',
      archiveNote: 'Official Record',
    },
  };
}

function mapCredentialToDb(c: CredentialItem, sortOrder = 0) {
  return {
    id: c.id,
    code: c.code || 'ARCHIVE · 01',
    title: c.title || 'Professional Credential',
    issuer: c.issuer || 'Verifying Authority',
    issue_date: c.issueDate || new Date().getFullYear().toString(),
    credential_id: c.credentialId || '',
    credential_url: c.credentialUrl || null,
    pdf_available: Boolean(c.pdfAvailable),
    category_id: c.categoryId || 'core-dev',
    connected_skill_ids: Array.isArray(c.connectedSkillIds) ? c.connectedSkillIds : [],
    verification_state: c.verificationState || 'Verified Record',
    badge_image_url: c.badgeImageUrl || null,
    summary: c.summary || '',
    document_spec: c.documentSpec || null,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// JOURNEY MILESTONE MAPPERS
// ---------------------------------------------------------------------------
function mapMilestoneFromDb(row: any): JourneyMilestone {
  return {
    id: row.id,
    period: row.period,
    category: row.category,
    title: row.title,
    organization: row.organization,
    summary: row.summary,
    focusPoints: Array.isArray(row.focus_points) ? row.focus_points : [],
    isEditablePlaceholder: Boolean(row.is_editable_placeholder),
    year: row.year || undefined,
    passportCode: row.passport_code || undefined,
    location: row.location || undefined,
    roleBadge: row.role_badge || undefined,
    coordinates: row.coordinates || undefined,
    elevation: row.elevation || undefined,
    sectorName: row.sector_name || undefined,
    heading: row.heading || undefined,
    terrainType: row.terrain_type || undefined,
  };
}

function mapMilestoneToDb(m: JourneyMilestone, sortOrder = 0) {
  // Only send columns declared in public.journey_milestones table to prevent PGRST204 errors
  return {
    id: m.id,
    period: m.period || '2026',
    category: m.category || 'Education',
    title: m.title || 'Milestone Title',
    organization: m.organization || 'Organization',
    summary: m.summary || '',
    focus_points: Array.isArray(m.focusPoints) ? m.focusPoints.filter(Boolean) : [],
    is_editable_placeholder: Boolean(m.isEditablePlaceholder),
    year: m.year || null,
    passport_code: m.passportCode || null,
    location: m.location || null,
    role_badge: m.roleBadge || null,
    coordinates: m.coordinates || null,
    elevation: m.elevation || null,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export const contentService = {
  isConfigured(): boolean {
    return isSupabaseConfigured;
  },

  getStorageMode(): string {
    return isSupabaseConfigured ? 'Supabase Cloud (Live)' : 'Local Storage (Offline Preview)';
  },

  // ---------------------------------------------------------------------------
  // PASSCODE AUTHENTICATION VIA SUPABASE
  // ---------------------------------------------------------------------------
  async verifyPasscode(enteredPasscode: string): Promise<boolean> {
    const trimmed = (enteredPasscode || '').trim();
    if (!trimmed) return false;

    // 1. Try checking Supabase admin_config table
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('admin_config')
          .select('value')
          .eq('key', 'cms_passcode')
          .maybeSingle();

        if (!error && data?.value) {
          return data.value.trim() === trimmed;
        }
      } catch (err) {
        console.warn('Supabase admin_config check, fallback to env:', err);
      }
    }

    // 2. Fallback to env variable or secure default
    const expectedPass = import.meta.env.VITE_ADMIN_PASSCODE || 'aksan2026';
    return trimmed === expectedPass.trim();
  },

  async updatePasscode(newPasscode: string): Promise<{ success: boolean; message: string }> {
    const trimmed = (newPasscode || '').trim();
    if (!trimmed || trimmed.length < 6) {
      return { success: false, message: 'Passcode minimal harus 6 karakter.' };
    }

    if (!supabase) {
      return { success: false, message: 'Supabase tidak terhubung.' };
    }

    try {
      const { error } = await supabase
        .from('admin_config')
        .upsert(
          { key: 'cms_passcode', value: trimmed, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, message: 'Passcode CMS berhasil disimpan ke Supabase cloud!' };
    } catch (err: any) {
      console.error('Update passcode error:', err);
      return {
        success: false,
        message:
          'Gagal menyimpan ke Supabase: ' +
          (err?.message || 'Pastikan tabel admin_config sudah dibuat di Supabase SQL Editor.'),
      };
    }
  },

  // ---------------------------------------------------------------------------
  // PROJECTS CRUD
  // ---------------------------------------------------------------------------
  async fetchProjects(): Promise<ProjectItem[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped = data.map(mapProjectFromDb);
          localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(mapped));
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase fetch projects error, using cache:', err);
      }
    }
    return this.getProjectsSync();
  },

  getProjectsSync(): ProjectItem[] {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (cached) return JSON.parse(cached);
    } catch {}
    return SELECTED_PROJECTS;
  },

  async saveProject(project: ProjectItem): Promise<ProjectItem[]> {
    const existing = await this.fetchProjects();
    const index = existing.findIndex((p) => p.id === project.id);
    let updated: ProjectItem[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = project;
    } else {
      updated = [...existing, project];
    }

    if (supabase) {
      const payload = mapProjectToDb(project, index >= 0 ? index : existing.length);
      const { error } = await supabase
        .from('projects')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.error('Supabase save project error:', error);
        throw new Error(`Supabase error (${error.code}): ${error.message}`);
      }
    }

    // Update local cache and notify listeners
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('portfolio-data-updated'));
    return updated;
  },

  async deleteProject(id: string): Promise<ProjectItem[]> {
    const existing = await this.fetchProjects();
    const updated = existing.filter((p) => p.id !== id);

    if (supabase) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        console.error('Supabase delete project error:', error);
        throw new Error(`Supabase error (${error.code}): ${error.message}`);
      }
    }

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('portfolio-data-updated'));
    return updated;
  },

  // ---------------------------------------------------------------------------
  // CREDENTIALS CRUD
  // ---------------------------------------------------------------------------
  async fetchCredentials(): Promise<CredentialItem[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('credentials')
          .select('*')
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped = data.map(mapCredentialFromDb);
          localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(mapped));
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase fetch credentials error, using cache:', err);
      }
    }
    return this.getCredentialsSync();
  },

  getCredentialsSync(): CredentialItem[] {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      if (cached) return JSON.parse(cached);
    } catch {}
    return CREDENTIALS_ARCHIVE;
  },

  async saveCredential(cred: CredentialItem): Promise<CredentialItem[]> {
    const existing = await this.fetchCredentials();
    const index = existing.findIndex((c) => c.id === cred.id);
    let updated: CredentialItem[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = cred;
    } else {
      updated = [...existing, cred];
    }

    if (supabase) {
      const payload = mapCredentialToDb(cred, index >= 0 ? index : existing.length);
      const { error } = await supabase
        .from('credentials')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.error('Supabase save credential error:', error);
        throw new Error(`Supabase error (${error.code}): ${error.message}`);
      }
    }

    localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('portfolio-data-updated'));
    return updated;
  },

  async deleteCredential(id: string): Promise<CredentialItem[]> {
    const existing = await this.fetchCredentials();
    const updated = existing.filter((c) => c.id !== id);

    if (supabase) {
      const { error } = await supabase.from('credentials').delete().eq('id', id);
      if (error) {
        console.error('Supabase delete credential error:', error);
        throw new Error(`Supabase error (${error.code}): ${error.message}`);
      }
    }

    localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('portfolio-data-updated'));
    return updated;
  },

  // ---------------------------------------------------------------------------
  // JOURNEY MILESTONES CRUD
  // ---------------------------------------------------------------------------
  async fetchMilestones(): Promise<JourneyMilestone[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('journey_milestones')
          .select('*')
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped = data.map(mapMilestoneFromDb);
          localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(mapped));
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase fetch milestones error, using cache:', err);
      }
    }
    return this.getMilestonesSync();
  },

  getMilestonesSync(): JourneyMilestone[] {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.MILESTONES);
      if (cached) return JSON.parse(cached);
    } catch {}
    return JOURNEY_MILESTONES;
  },

  async saveMilestone(milestone: JourneyMilestone): Promise<JourneyMilestone[]> {
    const existing = await this.fetchMilestones();
    const index = existing.findIndex((m) => m.id === milestone.id);
    let updated: JourneyMilestone[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = milestone;
    } else {
      updated = [...existing, milestone];
    }

    if (supabase) {
      const payload = mapMilestoneToDb(milestone, index >= 0 ? index : existing.length);
      const { error } = await supabase
        .from('journey_milestones')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.error('Supabase save milestone error:', error);
        throw new Error(`Supabase error (${error.code}): ${error.message}`);
      }
    }

    localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('portfolio-data-updated'));
    return updated;
  },

  async deleteMilestone(id: string): Promise<JourneyMilestone[]> {
    const existing = await this.fetchMilestones();
    const updated = existing.filter((m) => m.id !== id);

    if (supabase) {
      const { error } = await supabase.from('journey_milestones').delete().eq('id', id);
      if (error) {
        console.error('Supabase delete milestone error:', error);
        throw new Error(`Supabase error (${error.code}): ${error.message}`);
      }
    }

    localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('portfolio-data-updated'));
    return updated;
  },

  // ---------------------------------------------------------------------------
  // SEED INITIAL DATA (SAFE MERGE)
  // ---------------------------------------------------------------------------
  async seedInitialData(): Promise<{ success: boolean; message: string }> {
    if (!supabase) {
      return { success: false, message: 'Supabase client is not connected.' };
    }

    try {
      // 1. Seed Projects
      const projectsPayload = SELECTED_PROJECTS.map((p, idx) => mapProjectToDb(p, idx));
      const { error: pErr } = await supabase.from('projects').upsert(projectsPayload, { onConflict: 'id' });
      if (pErr) throw pErr;

      // 2. Seed Credentials
      const credsPayload = CREDENTIALS_ARCHIVE.map((c, idx) => mapCredentialToDb(c, idx));
      const { error: cErr } = await supabase.from('credentials').upsert(credsPayload, { onConflict: 'id' });
      if (cErr) throw cErr;

      // 3. Seed Journey Milestones
      const milesPayload = JOURNEY_MILESTONES.map((m, idx) => mapMilestoneToDb(m, idx));
      const { error: mErr } = await supabase.from('journey_milestones').upsert(milesPayload, { onConflict: 'id' });
      if (mErr) throw mErr;

      window.dispatchEvent(new CustomEvent('portfolio-data-updated'));

      return {
        success: true,
        message: `Successfully synchronized to Supabase!`,
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Seeding failed. Please check table schema.' };
    }
  },

  // ---------------------------------------------------------------------------
  // STORAGE UPLOAD
  // ---------------------------------------------------------------------------
  async uploadAsset(file: File, folder = 'covers'): Promise<string | null> {
    if (!supabase) return null;
    try {
      const ext = file.name.split('.').pop() || 'png';
      const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const path = `${folder}/${cleanName}`;

      const { data, error } = await supabase.storage
        .from('portfolio-assets')
        .upload(path, file, { cacheControl: '3600', upsert: true });

      if (error) {
        console.error('Upload failed:', error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Asset upload exception:', err);
      return null;
    }
  },
};
