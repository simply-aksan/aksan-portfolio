import React, { useState } from 'react';
import { Lock, ArrowRight, AlertCircle, X, Loader2, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';
import { contentService } from '../services/contentService';

interface AdminLoginProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onClose }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = (
      passcode ||
      (document.querySelector('input[type=password]') as HTMLInputElement)?.value ||
      ''
    ).trim();

    if (!entered || isVerifying) return;

    sound.playClick(700);
    setIsVerifying(true);
    setError(false);

    try {
      const isValid = await contentService.verifyPasscode(entered);
      if (isValid) {
        sound.playChirp(900, 0.15);
        onSuccess();
      } else {
        sound.playClick(300);
        setError(true);
      }
    } catch {
      sound.playClick(300);
      setError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#141312] border border-white/15 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[#A8A29E] hover:text-white transition-all cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D6B89A]/10 border border-[#D6B89A]/30 flex items-center justify-center text-[#D6B89A]">
            <Lock size={22} />
          </div>

          <div>
            <h3 className="font-editorial font-normal text-2xl text-[#F6F4EF]">
              AksanLab CMS Authentication
            </h3>
            <p className="font-ui text-xs text-[#A8A29E] mt-1">
              Enter administrative security passcode
            </p>
          </div>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4 mt-2">
            <div>
              <input
                type="password"
                required
                autoFocus
                autoComplete="current-password"
                value={passcode}
                disabled={isVerifying}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(false);
                }}
                placeholder="Enter security passcode"
                className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/15 focus:border-[#D6B89A] focus:outline-none text-[#F6F4EF] text-center font-mono text-sm tracking-widest transition-colors disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="flex items-center justify-center gap-1.5 text-xs font-ui text-red-400 animate-in fade-in">
                <AlertCircle size={13} />
                <span>Invalid authentication passcode. Please try again.</span>
              </div>
            )}

            <button
              type="submit"
              data-testid="admin-login-submit"
              disabled={isVerifying}
              className="w-full py-3.5 rounded-xl bg-[#F6F4EF] hover:bg-[#D6B89A] text-[#09090b] font-ui text-xs font-semibold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Unlock Admin Terminal</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 font-mono text-[10px] text-[#78716C] pt-1">
              <ShieldCheck size={11} className="text-[#D6B89A]" />
              <span>SUPABASE ENCRYPTED CLOUD VERIFICATION</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
