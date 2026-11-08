import React, { useEffect } from 'react';
import { X, BookOpen, Layers, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { type SkillNode, SELECTED_PROJECTS } from '../data/portfolioData';
import { sound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

interface SkillDetailModalProps {
  skill: SkillNode | null;
  onClose: () => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({ skill, onClose }) => {
  const { lang } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.playClick(500);
        onClose();
      }
    };
    if (skill) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [skill, onClose]);

  if (!skill) return null;

  // Find projects that use this skill
  const relatedProjects = SELECTED_PROJECTS.filter((p) =>
    p.technologies.some((t) =>
      skill.name.toLowerCase().includes(t.toLowerCase()) ||
      t.toLowerCase().includes(skill.name.toLowerCase()) ||
      skill.practicalScope.toLowerCase().includes(t.toLowerCase())
    )
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#141312] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-[#D6B89A]" />
            <span className="font-ui text-xs uppercase tracking-wider text-[#D6B89A]">
              {lang === 'id' ? 'Spesimen Disiplin' : 'Discipline Specimen'} // {skill.domainLabel}
            </span>
          </div>
          <button
            onClick={() => {
              sound.playClick(500);
              onClose();
            }}
            className="p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[#A8A29E] hover:text-white transition-all cursor-pointer"
            aria-label={lang === 'id' ? 'Tutup Spesimen' : 'Close Specimen'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-editorial text-2xl sm:text-3xl text-[#F6F4EF] font-normal">
            {skill.name}
          </h3>
          <p className="mt-3 font-sans text-sm text-[#A8A29E] leading-relaxed">
            {skill.summary}
          </p>
        </div>

        {/* Practical Scope */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center gap-2 font-ui text-xs text-[#D6B89A] uppercase tracking-wider mb-2">
            <CheckCircle2 size={13} />
            <span>
              {lang === 'id' ? 'Cakupan Praktis & Aplikasi Arsitektur' : 'Practical Scope & Architectural Application'}
            </span>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#D6D3D1] leading-relaxed">
            {skill.practicalScope}
          </p>
        </div>

        {/* Connected Projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-6 pt-5 border-t border-white/[0.08]">
            <span className="font-ui text-xs text-[#A8A29E] uppercase tracking-wider block mb-3">
              {lang === 'id' ? 'Diterapkan dalam Proyek Produksi' : 'Applied in Production Work'}
            </span>
            <div className="flex flex-wrap gap-2">
              {relatedProjects.map((p) => (
                <span
                  key={p.id}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-ui text-[#F6F4EF]"
                >
                  {p.title}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 flex justify-end">
          <button
            onClick={() => {
              sound.playClick(500);
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-[#F6F4EF] hover:bg-[#D6B89A] text-[#09090b] font-ui text-xs font-semibold tracking-wider transition-colors cursor-pointer"
          >
            {lang === 'id' ? 'Tutup Spesimen' : 'Close Specimen'}
          </button>
        </div>
      </div>
    </div>
  );
};

