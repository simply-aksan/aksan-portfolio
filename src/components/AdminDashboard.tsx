import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Edit3,
  Trash2,
  Shield,
  Download,
  Layers,
  Award,
  UploadCloud,
  CheckCircle2,
  Database,
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
  Link2,
  Key,
  Loader2,
} from 'lucide-react';
import {
  type ProjectItem,
  type CredentialItem,
  type JourneyMilestone,
} from '../data/portfolioData';
import { contentService } from '../services/contentService';
import { sound } from '../utils/audio';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [projects, setProjects] = useState<ProjectItem[]>(() => contentService.getProjectsSync());
  const [credentials, setCredentials] = useState<CredentialItem[]>(() => contentService.getCredentialsSync());
  const [milestones, setMilestones] = useState<JourneyMilestone[]>(() => contentService.getMilestonesSync());

  const [activeTab, setActiveTab] = useState<'projects' | 'credentials' | 'milestones'>('projects');
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [editingCredential, setEditingCredential] = useState<CredentialItem | null>(null);
  const [editingMilestone, setEditingMilestone] = useState<JourneyMilestone | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [newPasscode, setNewPasscode] = useState('');
  const [passcodeUpdating, setPasscodeUpdating] = useState(false);

  const storageMode = contentService.getStorageMode();

  // Load latest data from Supabase on mount
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const [pData, cData, mData] = await Promise.all([
          contentService.fetchProjects(),
          contentService.fetchCredentials(),
          contentService.fetchMilestones(),
        ]);
        if (mounted) {
          setProjects(pData);
          setCredentials(cData);
          setMilestones(mData);
        }
      } catch (err) {
        console.warn('Initial CMS load warning:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const showNotification = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 4000);
  };

  // 1-Click Seed Button
  const handleSeedData = async () => {
    if (!confirm('Sync & push all default portfolio items into your Supabase database?')) return;
    sound.playClick(700);
    setIsLoading(true);
    const res = await contentService.seedInitialData();
    setIsLoading(false);
    if (res.success) {
      sound.playChirp(920, 0.15);
      showNotification(res.message);
      const [pData, cData, mData] = await Promise.all([
        contentService.fetchProjects(),
        contentService.fetchCredentials(),
        contentService.fetchMilestones(),
      ]);
      setProjects(pData);
      setCredentials(cData);
      setMilestones(mData);
    } else {
      sound.playClick(300);
      alert(res.message);
    }
  };

  const handleExportBackup = () => {
    sound.playClick(800);
    const bundle = {
      exportedAt: new Date().toISOString(),
      projects,
      credentials,
      milestones,
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aksanlab-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Image Upload Handler
  const handleUploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'projectCover' | 'credentialBadge'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    sound.playClick(600);
    const publicUrl = await contentService.uploadAsset(file, type === 'projectCover' ? 'covers' : 'badges');
    setIsUploading(false);
    if (publicUrl) {
      sound.playChirp(880, 0.1);
      if (type === 'projectCover' && editingProject) {
        setEditingProject({ ...editingProject, coverImageUrl: publicUrl });
      } else if (type === 'credentialBadge' && editingCredential) {
        setEditingCredential({ ...editingCredential, badgeImageUrl: publicUrl });
      }
      showNotification('Image uploaded successfully to Supabase Storage!');
    } else {
      alert('Upload failed. Please ensure the "portfolio-assets" storage bucket is public.');
    }
  };

  // Project Actions
  const handleDeleteProject = async (id: string) => {
    if (confirm('Delete this project from active exhibition?')) {
      sound.playClick(400);
      try {
        const updated = await contentService.deleteProject(id);
        setProjects(updated);
        showNotification('Project removed.');
      } catch (err: any) {
        alert('Gagal menghapus project: ' + (err?.message || err));
      }
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || isSaving) return;
    sound.playChirp(880, 0.1);
    setIsSaving(true);
    try {
      const updated = await contentService.saveProject(editingProject);
      setProjects(updated);
      setEditingProject(null);
      showNotification('Project saved successfully to Supabase!');
    } catch (err: any) {
      sound.playClick(300);
      alert('Gagal menyimpan project ke Supabase: ' + (err?.message || err));
    } finally {
      setIsSaving(false);
    }
  };

  // Credential Actions
  const handleDeleteCredential = async (id: string) => {
    if (confirm('Delete this credential record?')) {
      sound.playClick(400);
      try {
        const updated = await contentService.deleteCredential(id);
        setCredentials(updated);
        showNotification('Credential deleted.');
      } catch (err: any) {
        alert('Gagal menghapus credential: ' + (err?.message || err));
      }
    }
  };

  const handleSaveCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCredential || isSaving) return;
    sound.playChirp(880, 0.1);
    setIsSaving(true);
    try {
      const updated = await contentService.saveCredential(editingCredential);
      setCredentials(updated);
      setEditingCredential(null);
      showNotification('Credential saved successfully to Supabase!');
    } catch (err: any) {
      sound.playClick(300);
      alert('Gagal menyimpan credential ke Supabase: ' + (err?.message || err));
    } finally {
      setIsSaving(false);
    }
  };

  // Milestone Actions
  const handleDeleteMilestone = async (id: string) => {
    if (confirm('Delete this journey milestone?')) {
      sound.playClick(400);
      try {
        const updated = await contentService.deleteMilestone(id);
        setMilestones(updated);
        showNotification('Milestone deleted.');
      } catch (err: any) {
        alert('Gagal menghapus milestone: ' + (err?.message || err));
      }
    }
  };

  const handleSaveMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone || isSaving) return;
    sound.playChirp(880, 0.1);
    setIsSaving(true);
    try {
      const updated = await contentService.saveMilestone(editingMilestone);
      setMilestones(updated);
      setEditingMilestone(null);
      showNotification('Milestone saved successfully to Supabase!');
    } catch (err: any) {
      sound.playClick(300);
      alert('Gagal menyimpan milestone ke Supabase: ' + (err?.message || err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscode.trim() || passcodeUpdating) return;
    setPasscodeUpdating(true);
    const res = await contentService.updatePasscode(newPasscode);
    setPasscodeUpdating(false);
    if (res.success) {
      sound.playChirp(900, 0.15);
      showNotification(res.message);
      setShowPasscodeModal(false);
      setNewPasscode('');
    } else {
      sound.playClick(300);
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] text-[#F6F4EF] overflow-y-auto flex flex-col animate-in fade-in duration-200">
      {/* Admin Header */}
      <header className="sticky top-0 z-30 bg-[#121110]/95 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D6B89A]/15 border border-[#D6B89A]/30 flex items-center justify-center text-[#D6B89A]">
              <Shield size={16} />
            </div>
            <div>
              <span className="font-editorial text-xl font-normal text-[#F6F4EF]">
                AksanLab CMS Administration
              </span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-ui text-[10px] text-[#A8A29E]">
                  {storageMode}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick(600);
              setShowPasscodeModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D6B89A]/40 bg-[#D6B89A]/10 hover:bg-[#D6B89A]/20 text-xs font-ui text-[#D6B89A] transition-all cursor-pointer"
            title="Kelola passcode keamanan CMS di Supabase"
          >
            <Key size={13} />
            <span>Passcode Cloud</span>
          </button>

          <button
            onClick={handleSeedData}
            disabled={isLoading || isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D6B89A]/40 bg-[#D6B89A]/10 hover:bg-[#D6B89A]/20 text-xs font-ui text-[#D6B89A] transition-all cursor-pointer disabled:opacity-50"
            title="Sync all default items into Supabase tables"
          >
            <Database size={13} />
            <span>Sync / Seed Data</span>
          </button>

          <button
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-ui text-[#F6F4EF] transition-all cursor-pointer"
          >
            <Download size={13} />
            <span>Export Backup</span>
          </button>

          <button
            onClick={() => {
              sound.playClick(500);
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-ui text-[#F6F4EF] transition-all cursor-pointer"
          >
            <span>Exit CMS</span>
            <X size={15} />
          </button>
        </div>
      </header>

      {/* Status Notice Toast */}
      {statusNotice && (
        <div className="bg-[#D6B89A] text-[#09090b] px-6 py-2 text-xs font-mono font-semibold flex items-center justify-between">
          <span>{statusNotice}</span>
          <button onClick={() => setStatusNotice(null)} className="cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-[#121110] border-b border-white/10 px-6">
        <div className="max-w-[1360px] mx-auto flex items-center gap-2 py-2">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-lg font-ui text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-[#D6B89A]/20 text-[#D6B89A] border border-[#D6B89A]/40'
                : 'text-[#A8A29E] hover:text-[#F6F4EF]'
            }`}
          >
            <Layers size={14} />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-4 py-2 rounded-lg font-ui text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'credentials'
                ? 'bg-[#D6B89A]/20 text-[#D6B89A] border border-[#D6B89A]/40'
                : 'text-[#A8A29E] hover:text-[#F6F4EF]'
            }`}
          >
            <Award size={14} />
            <span>Credentials ({credentials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('milestones')}
            className={`px-4 py-2 rounded-lg font-ui text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'milestones'
                ? 'bg-[#D6B89A]/20 text-[#D6B89A] border border-[#D6B89A]/40'
                : 'text-[#A8A29E] hover:text-[#F6F4EF]'
            }`}
          >
            <MapPin size={14} />
            <span>Milestones ({milestones.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1360px] mx-auto w-full p-6 sm:p-10">
        {/* ================================================================= */}
        {/* TAB 1: PROJECTS                                                   */}
        {/* ================================================================= */}
        {activeTab === 'projects' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-editorial text-3xl font-normal text-[#F6F4EF]">
                  Exhibition Projects (Section 02)
                </h2>
                <p className="font-ui text-xs text-[#A8A29E]">
                  Showcased in the Frieze 3D Cover-Flow reel (stored live in Supabase)
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playClick(750);
                  setEditingProject({
                    id: `proj-${Date.now()}`,
                    index: `0${projects.length + 1}`,
                    title: 'New Innovative System',
                    accentWord: 'Specimen',
                    category: 'Software Development',
                    year: '2026',
                    status: 'Production System',
                    summary: 'High-performance digital system architecture.',
                    editorialThesis: 'Focused on clarity, scalability, and robust typing.',
                    architectureNotes: ['Modular system architecture.', 'Strict TypeScript contracts.'],
                    technologies: ['React 19', 'TypeScript', 'Tailwind CSS'],
                    visualArchetype: 'spatial-ai',
                    role: 'Lead Architect',
                    metrics: [{ label: 'Performance', value: '99.9%' }],
                    extendedCaseStudy: {
                      overview: 'Comprehensive architectural overview.',
                      challenge: 'Key engineering challenges addressed.',
                      solution: 'Technical solution implemented.',
                      impact: 'Measurable system impact.',
                    },
                    isPlaceholderSlot: false,
                  });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F6F4EF] hover:bg-[#D6B89A] text-[#09090b] font-ui text-xs font-semibold cursor-pointer transition-all"
              >
                <Plus size={14} />
                <span>Add Project</span>
              </button>
            </div>

            {/* Project List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col justify-between hover:border-[#D6B89A]/40 transition-all group"
                >
                  <div>
                    {proj.coverImageUrl && (
                      <div className="w-full h-36 rounded-xl overflow-hidden mb-3 bg-black/50 border border-white/10">
                        <img
                          src={proj.coverImageUrl}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs font-mono text-[#D6B89A] mb-2">
                      <span>{proj.index} // {proj.category}</span>
                      <span>{proj.year}</span>
                    </div>
                    <h3 className="font-editorial text-xl text-[#F6F4EF]">
                      {proj.title}
                    </h3>
                    <p className="font-sans text-xs text-[#A8A29E] mt-2 line-clamp-2">
                      {proj.summary}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {proj.technologies.slice(0, 4).map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-[#A8A29E]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-white/10">
                    <button
                      onClick={() => {
                        sound.playClick(600);
                        setEditingProject({
                          ...proj,
                          extendedCaseStudy: proj.extendedCaseStudy || {
                            overview: '',
                            challenge: '',
                            solution: '',
                            impact: '',
                          },
                          metrics: proj.metrics || [],
                          architectureNotes: proj.architectureNotes || [],
                          technologies: proj.technologies || [],
                        });
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#F6F4EF] transition-all cursor-pointer"
                      title="Edit Project"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: CREDENTIALS                                                */}
        {/* ================================================================= */}
        {activeTab === 'credentials' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-editorial text-3xl font-normal text-[#F6F4EF]">
                  Credentials Vault (Section 03)
                </h2>
                <p className="font-ui text-xs text-[#A8A29E]">
                  Certifications archived in the 3D Vasari Shelf (stored live in Supabase)
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playClick(750);
                  setEditingCredential({
                    id: `cred-${Date.now()}`,
                    code: `CERT-0${credentials.length + 1}`,
                    title: 'New Professional Credential',
                    issuer: 'Issuing Organization',
                    issueDate: '2026',
                    credentialId: 'VERIFIED-ID-001',
                    credentialUrl: '',
                    badgeImageUrl: '',
                    pdfAvailable: false,
                    categoryId: 'core-dev',
                    connectedSkillIds: [],
                    verificationState: 'Verified Record',
                    summary: 'Professional credential certification summary and competencies.',
                    documentSpec: {
                      format: 'Official Digital Record',
                      scope: 'Professional Certification',
                      archiveNote: 'Verified Archive',
                    },
                  });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F6F4EF] hover:bg-[#D6B89A] text-[#09090b] font-ui text-xs font-semibold cursor-pointer transition-all"
              >
                <Plus size={14} />
                <span>Add Credential</span>
              </button>
            </div>

            {/* Credentials List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {credentials.map((cred) => (
                <div
                  key={cred.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col justify-between hover:border-[#D6B89A]/40 transition-all group"
                >
                  <div>
                    {cred.badgeImageUrl && (
                      <div className="w-full h-32 rounded-xl overflow-hidden mb-3 bg-black/50 border border-white/10">
                        <img
                          src={cred.badgeImageUrl}
                          alt={cred.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs font-mono text-[#D6B89A] mb-2">
                      <span>{cred.code}</span>
                      <span>{cred.issueDate}</span>
                    </div>
                    <h3 className="font-editorial text-xl text-[#F6F4EF]">
                      {cred.title}
                    </h3>
                    <p className="font-mono text-xs text-[#D6B89A]/80 mt-1">
                      {cred.issuer}
                    </p>
                    <p className="font-sans text-xs text-[#A8A29E] mt-2 line-clamp-2">
                      {cred.summary}
                    </p>
                    {cred.credentialUrl && (
                      <a
                        href={cred.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#34d399] mt-3 hover:underline"
                      >
                        <CheckCircle2 size={12} />
                        <span>Issuer Verification Link</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-white/10">
                    <button
                      onClick={() => {
                        sound.playClick(600);
                        setEditingCredential({ ...cred });
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#F6F4EF] transition-all cursor-pointer"
                      title="Edit Credential"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCredential(cred.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                      title="Delete Credential"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: JOURNEY MILESTONES                                         */}
        {/* ================================================================= */}
        {activeTab === 'milestones' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-editorial text-3xl font-normal text-[#F6F4EF]">
                  Journey Milestones & Overworld (Section 04)
                </h2>
                <p className="font-ui text-xs text-[#A8A29E]">
                  Waypoints and career odyssey displayed on the Overworld map (Supabase live)
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playClick(750);
                  setEditingMilestone({
                    id: `milestone-${Date.now()}`,
                    period: '2026 — Present',
                    category: 'Experience',
                    title: 'New Milestone Position',
                    organization: 'Organization Name',
                    summary: 'Key achievements, architectural milestones, and competencies built.',
                    focusPoints: ['Core Focus 1', 'Core Focus 2'],
                    isEditablePlaceholder: false,
                    year: '2026',
                    location: 'Jakarta, Indonesia',
                    roleBadge: 'Software Engineer',
                    coordinates: '06°12S 106°49E',
                    elevation: '45m',
                  });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F6F4EF] hover:bg-[#D6B89A] text-[#09090b] font-ui text-xs font-semibold cursor-pointer transition-all"
              >
                <Plus size={14} />
                <span>Add Milestone</span>
              </button>
            </div>

            {/* Milestones List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {milestones.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col justify-between hover:border-[#D6B89A]/40 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#D6B89A] mb-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#D6B89A]/10 border border-[#D6B89A]/20">
                        {m.category}
                      </span>
                      <span>{m.period}</span>
                    </div>
                    <h3 className="font-editorial text-2xl text-[#F6F4EF] mt-2">
                      {m.title}
                    </h3>
                    <p className="font-ui text-sm text-[#D6B89A] mt-1 font-medium">
                      {m.organization} · {m.location}
                    </p>
                    <p className="font-sans text-xs text-[#A8A29E] mt-3 leading-relaxed">
                      {m.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {m.focusPoints.map((fp, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-md bg-white/5 text-[11px] text-[#D6D3CD]">
                          ✦ {fp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10 text-xs font-mono text-[#78716C]">
                    <span>{m.coordinates} · {m.elevation}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          sound.playClick(600);
                          setEditingMilestone({ ...m });
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#F6F4EF] transition-all cursor-pointer"
                        title="Edit Milestone"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteMilestone(m.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                        title="Delete Milestone"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ================================================================= */}
      {/* MODAL: EDIT PROJECT (FULL DEEP SPECIFICATION)                     */}
      {/* ================================================================= */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-[#141312] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h3 className="font-editorial text-2xl text-[#F6F4EF]">
                  Edit Project Deep Specification
                </h3>
                <p className="font-ui text-xs text-[#A8A29E]">
                  Update project metadata, media, architecture notes, and case study
                </p>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#A8A29E] hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="flex flex-col gap-6 text-xs font-ui">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Project Title</label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-sm focus:border-[#D6B89A] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Year</label>
                  <input
                    type="text"
                    value={editingProject.year}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-sm focus:border-[#D6B89A] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1b1a] border border-white/10 text-white font-sans text-xs focus:border-[#D6B89A] focus:outline-none"
                  >
                    <option value="Software Development">Software Development</option>
                    <option value="Experimental Web Systems">Experimental Web Systems</option>
                    <option value="AI-Native Architecture">AI-Native Architecture</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Role / Title</label>
                  <input
                    type="text"
                    value={editingProject.role || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                    placeholder="e.g. Lead Technologist"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-xs focus:border-[#D6B89A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Image Upload & Direct URL */}
              <div>
                <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Cover Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingProject.coverImageUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, coverImageUrl: e.target.value })}
                    placeholder="https://... or upload from your computer"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-mono text-xs focus:border-[#D6B89A] focus:outline-none"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-[#D6B89A]/15 border border-[#D6B89A]/40 text-[#D6B89A] flex items-center gap-2 cursor-pointer hover:bg-[#D6B89A]/25 transition-all">
                    <UploadCloud size={14} />
                    <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadFile(e, 'projectCover')}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Live Demo URL</label>
                  <input
                    type="url"
                    value={editingProject.liveDemoUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, liveDemoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-mono text-xs focus:border-[#D6B89A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Repository URL</label>
                  <input
                    type="url"
                    value={editingProject.repositoryUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, repositoryUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-mono text-xs focus:border-[#D6B89A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Summaries */}
              <div>
                <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Summary (Short card description)</label>
                <textarea
                  rows={2}
                  value={editingProject.summary}
                  onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-xs focus:border-[#D6B89A] focus:outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Editorial Thesis</label>
                <textarea
                  rows={2}
                  value={editingProject.editorialThesis || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, editorialThesis: e.target.value })}
                  placeholder="The design philosophy and core technical premise..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-xs focus:border-[#D6B89A] focus:outline-none resize-none"
                />
              </div>

              {/* Technologies (Comma Separated) */}
              <div>
                <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">
                  Technologies (Comma separated)
                </label>
                <input
                  type="text"
                  value={editingProject.technologies.join(', ')}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  placeholder="React 19, TypeScript, Laravel, Three.js, PostgreSQL"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-xs focus:border-[#D6B89A] focus:outline-none"
                />
              </div>

              {/* Extended Case Study Section */}
              <div className="border-t border-white/10 pt-4">
                <h4 className="font-editorial text-lg text-[#D6B89A] mb-3">
                  Extended Case Study Narrative
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">01 // Overview</label>
                    <textarea
                      rows={3}
                      value={editingProject.extendedCaseStudy?.overview || ''}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          extendedCaseStudy: {
                            ...(editingProject.extendedCaseStudy || { challenge: '', solution: '', impact: '' }),
                            overview: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-xs focus:border-[#D6B89A] focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">02 // The Challenge</label>
                    <textarea
                      rows={3}
                      value={editingProject.extendedCaseStudy?.challenge || ''}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          extendedCaseStudy: {
                            ...(editingProject.extendedCaseStudy || { overview: '', solution: '', impact: '' }),
                            challenge: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-xs focus:border-[#D6B89A] focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">03 // Architectural Solution</label>
                    <textarea
                      rows={3}
                      value={editingProject.extendedCaseStudy?.solution || ''}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          extendedCaseStudy: {
                            ...(editingProject.extendedCaseStudy || { overview: '', challenge: '', impact: '' }),
                            solution: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-xs focus:border-[#D6B89A] focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">04 // Measurable Impact</label>
                    <textarea
                      rows={3}
                      value={editingProject.extendedCaseStudy?.impact || ''}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          extendedCaseStudy: {
                            ...(editingProject.extendedCaseStudy || { overview: '', challenge: '', solution: '' }),
                            impact: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-xs focus:border-[#D6B89A] focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 text-[#A8A29E] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#F6F4EF] hover:bg-[#D6B89A] text-[#09090b] font-semibold cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving to Supabase...</span>
                    </>
                  ) : (
                    <span>Save Project to Supabase</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: EDIT CREDENTIAL (FULL VERIFICATION & BADGE UPLOAD)          */}
      {/* ================================================================= */}
      {editingCredential && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#141312] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h3 className="font-editorial text-2xl text-[#F6F4EF]">
                  Edit Credential Record
                </h3>
                <p className="font-ui text-xs text-[#A8A29E]">
                  Update certification details, badge image, and verification link
                </p>
              </div>
              <button
                onClick={() => setEditingCredential(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#A8A29E] hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCredential} className="flex flex-col gap-5 text-xs font-ui">
              <div>
                <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Certification Title</label>
                <input
                  type="text"
                  value={editingCredential.title}
                  onChange={(e) => setEditingCredential({ ...editingCredential, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-sm focus:border-[#D6B89A] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Issuer (e.g. AWS, Meta, Dicoding)</label>
                  <input
                    type="text"
                    value={editingCredential.issuer}
                    onChange={(e) => setEditingCredential({ ...editingCredential, issuer: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-sm focus:border-[#D6B89A] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Issue Date / Year</label>
                  <input
                    type="text"
                    value={editingCredential.issueDate}
                    onChange={(e) => setEditingCredential({ ...editingCredential, issueDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-sm focus:border-[#D6B89A] focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Certificate Badge Image Upload */}
              <div>
                <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Certificate Badge Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingCredential.badgeImageUrl || ''}
                    onChange={(e) => setEditingCredential({ ...editingCredential, badgeImageUrl: e.target.value })}
                    placeholder="https://... or upload from your computer"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-mono text-xs focus:border-[#D6B89A] focus:outline-none"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-[#D6B89A]/15 border border-[#D6B89A]/40 text-[#D6B89A] flex items-center gap-2 cursor-pointer hover:bg-[#D6B89A]/25 transition-all">
                    <UploadCloud size={14} />
                    <span>{isUploading ? 'Uploading...' : 'Upload Badge'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadFile(e, 'credentialBadge')}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              {/* Verification URL & Credential ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Issuer Verification URL</label>
                  <input
                    type="url"
                    value={editingCredential.credentialUrl || ''}
                    onChange={(e) => setEditingCredential({ ...editingCredential, credentialUrl: e.target.value })}
                    placeholder="https://credly.com/badges/... or official verify link"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-mono text-xs focus:border-[#D6B89A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Credential ID / Code</label>
                  <input
                    type="text"
                    value={editingCredential.credentialId}
                    onChange={(e) => setEditingCredential({ ...editingCredential, credentialId: e.target.value })}
                    placeholder="e.g. AWS-CCP-10294"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-mono text-xs focus:border-[#D6B89A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Summary & Competencies</label>
                <textarea
                  rows={3}
                  value={editingCredential.summary}
                  onChange={(e) => setEditingCredential({ ...editingCredential, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-xs focus:border-[#D6B89A] focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingCredential(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 text-[#A8A29E] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#F6F4EF] hover:bg-[#D6B89A] text-[#09090b] font-semibold cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving to Supabase...</span>
                    </>
                  ) : (
                    <span>Save Credential to Supabase</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: EDIT JOURNEY MILESTONE                                     */}
      {/* ================================================================= */}
      {editingMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#141312] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h3 className="font-editorial text-2xl text-[#F6F4EF]">
                  Edit Journey Milestone
                </h3>
                <p className="font-ui text-xs text-[#A8A29E]">
                  Update checkpoint title, organization, dates, and focus points
                </p>
              </div>
              <button
                onClick={() => setEditingMilestone(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#A8A29E] hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveMilestone} className="flex flex-col gap-5 text-xs font-ui">
              <div>
                <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Milestone Title</label>
                <input
                  type="text"
                  value={editingMilestone.title}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-sm focus:border-[#D6B89A] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Organization / Base</label>
                  <input
                    type="text"
                    value={editingMilestone.organization}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, organization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-sm focus:border-[#D6B89A] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Period / Years</label>
                  <input
                    type="text"
                    value={editingMilestone.period}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, period: e.target.value })}
                    placeholder="e.g. 2024 — 2025"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-sm focus:border-[#D6B89A] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Category</label>
                  <select
                    value={editingMilestone.category}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1b1a] border border-white/10 text-white font-sans text-xs focus:border-[#D6B89A] focus:outline-none"
                  >
                    <option value="Education">Education</option>
                    <option value="Experience">Experience</option>
                    <option value="Development">Development</option>
                    <option value="Milestone">Milestone</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Location</label>
                  <input
                    type="text"
                    value={editingMilestone.location || ''}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, location: e.target.value })}
                    placeholder="e.g. Jakarta, Indonesia"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-xs focus:border-[#D6B89A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">Summary</label>
                <textarea
                  rows={3}
                  value={editingMilestone.summary}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-xs focus:border-[#D6B89A] focus:outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="text-[#A8A29E] uppercase block mb-1 font-semibold">
                  Focus Points (Comma separated)
                </label>
                <input
                  type="text"
                  value={editingMilestone.focusPoints.join(', ')}
                  onChange={(e) =>
                    setEditingMilestone({
                      ...editingMilestone,
                      focusPoints: e.target.value.split(',').map((p) => p.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Algorithms, High Concurrency, Microservices"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans text-xs focus:border-[#D6B89A] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingMilestone(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 text-[#A8A29E] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#F6F4EF] hover:bg-[#D6B89A] text-[#09090b] font-semibold cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving to Supabase...</span>
                    </>
                  ) : (
                    <span>Save Milestone to Supabase</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: CHANGE CMS PASSCODE                                        */}
      {/* ================================================================= */}
      {showPasscodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#141312] border border-white/15 rounded-3xl p-8 shadow-2xl">
            <button
              onClick={() => setShowPasscodeModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#A8A29E] hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#D6B89A]/15 border border-[#D6B89A]/30 flex items-center justify-center text-[#D6B89A]">
                <Key size={18} />
              </div>
              <div>
                <h3 className="font-editorial text-2xl text-[#F6F4EF]">
                  Ganti Passcode CMS
                </h3>
                <p className="font-ui text-xs text-[#A8A29E]">
                  Simpan passcode baru langsung ke Supabase Cloud
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdatePasscode} className="flex flex-col gap-4 mt-2">
              <div>
                <label className="text-xs font-ui text-[#A8A29E] uppercase block mb-1.5 font-semibold">
                  Passcode Baru (Minimal 6 karakter)
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={newPasscode}
                  disabled={passcodeUpdating}
                  onChange={(e) => setNewPasscode(e.target.value)}
                  placeholder="Masukkan passcode baru..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 focus:border-[#D6B89A] focus:outline-none text-[#F6F4EF] font-mono text-sm tracking-wider"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowPasscodeModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-[#A8A29E] hover:text-white font-ui text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={passcodeUpdating || !newPasscode.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#F6F4EF] hover:bg-[#D6B89A] text-[#09090b] font-ui text-xs font-semibold cursor-pointer disabled:opacity-40 flex items-center gap-2"
                >
                  {passcodeUpdating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Menyimpan ke Supabase...</span>
                    </>
                  ) : (
                    <span>Simpan Passcode Baru</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
