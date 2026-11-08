import React, { useEffect } from 'react';
import { X, ExternalLink, TrendingUp, Layers, CheckCircle2, Calendar, UserCheck } from 'lucide-react';
import { ProjectItem } from '../data/portfolioData';
import { sound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const { t, lang } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.playClick(500);
        onClose();
      }
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
      {/* Frosted Dark Backdrop */}
      <div
        className="fixed inset-0 bg-[#09090b]/85 backdrop-blur-xl transition-opacity"
        onClick={() => {
          sound.playClick(500);
          onClose();
        }}
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-4xl bg-[#121110] border border-white/15 rounded-3xl shadow-2xl shadow-black overflow-hidden my-auto z-10 animate-in zoom-in-95 duration-300 max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.08] bg-[#161514]/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="font-ui text-xs uppercase tracking-widest text-[#D6B89A] px-2.5 py-1 rounded bg-[#D6B89A]/10 border border-[#D6B89A]/20">
              {project.category}
            </span>
            <span className="font-ui text-xs text-[#A8A29E] flex items-center gap-1.5">
              <Calendar size={13} />
              <span>{project.year}</span>
            </span>
          </div>

          <button
            onClick={() => {
              sound.playClick(500);
              onClose();
            }}
            className="p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[#A8A29E] hover:text-[#F6F4EF] border border-white/10 transition-all cursor-pointer"
            aria-label={t.works.modal.close}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex flex-col gap-8">
          {/* Title & Editorial Thesis */}
          <div>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#F6F4EF] tracking-tight mb-3">
              {project.title}
            </h2>
            <p className="font-sans text-base sm:text-lg text-[#A8A29E] leading-relaxed">
              {project.editorialThesis}
            </p>
          </div>

          {/* Media Feature Container */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black">
            {project.videoUrl ? (
              <video
                src={project.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : project.coverImageUrl ? (
              <img
                src={project.coverImageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#1c1b19] font-ui text-xs text-[#78716C]">
                Visual Specimen Active
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-ui text-white/80">
              {project.role && (
                <span className="flex items-center gap-1.5">
                  <UserCheck size={14} className="text-[#D6B89A]" />
                  <span>{project.role}</span>
                </span>
              )}
              <span className="px-2.5 py-1 rounded bg-black/70 border border-white/15 text-[10px] tracking-widest text-[#D6B89A]">
                {project.videoUrl ? 'MOTION VIDEO REEL' : 'SPECIMEN CAPTURE'}
              </span>
            </div>
          </div>

          {/* Key Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.metrics.map((metric, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3"
                >
                  <TrendingUp size={20} className="text-[#D6B89A] shrink-0" />
                  <div>
                    <span className="font-editorial text-2xl font-normal text-[#F6F4EF] block">
                      {metric.value}
                    </span>
                    <span className="font-ui text-xs text-[#A8A29E]">
                      {metric.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Extended Case Study Narrative */}
          {project.extendedCaseStudy && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2">
                <span className="font-ui text-xs uppercase tracking-wider text-[#D6B89A] flex items-center gap-2">
                  <Layers size={14} />
                  <span>{t.works.modal.overview}</span>
                </span>
                <p className="font-sans text-sm text-[#D6D3D1] leading-relaxed">
                  {project.extendedCaseStudy.overview}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2">
                <span className="font-ui text-xs uppercase tracking-wider text-[#A8A29E] flex items-center gap-2">
                  <Layers size={14} />
                  <span>{t.works.modal.challenge}</span>
                </span>
                <p className="font-sans text-sm text-[#D6D3D1] leading-relaxed">
                  {project.extendedCaseStudy.challenge}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2">
                <span className="font-ui text-xs uppercase tracking-wider text-[#D6B89A] flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  <span>{t.works.modal.solution}</span>
                </span>
                <p className="font-sans text-sm text-[#D6D3D1] leading-relaxed">
                  {project.extendedCaseStudy.solution}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2">
                <span className="font-ui text-xs uppercase tracking-wider text-[#34d399] flex items-center gap-2">
                  <TrendingUp size={14} />
                  <span>{t.works.modal.impact}</span>
                </span>
                <p className="font-sans text-sm text-[#D6D3D1] leading-relaxed">
                  {project.extendedCaseStudy.impact}
                </p>
              </div>
            </div>
          )}

          {/* Technologies */}
          <div>
            <span className="font-ui text-xs uppercase text-[#A8A29E] tracking-wider block mb-3">
              {t.works.modal.technologies}
            </span>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.1] font-ui text-xs text-[#F6F4EF]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/[0.08]">
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F6F4EF] hover:bg-[#D6B89A] text-[#09090b] font-ui text-xs font-medium tracking-wide transition-colors no-underline"
              >
                <span>{t.works.modal.liveSite}</span>
                <ExternalLink size={14} />
              </a>
            )}

            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-[#F6F4EF] font-ui text-xs font-medium tracking-wide transition-colors no-underline"
              >
                <span>{t.works.modal.repo}</span>
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

