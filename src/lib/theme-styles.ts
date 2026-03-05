import { ThemeVersion } from "./theme-context";

export interface ThemeStyles {
  card: string;
  cardHeader: string;
  cardTitle: string;
  input: string;
  inputLabel: string;
  btnPrimary: string;
  btnSecondary: string;
  modal: string;
  modalHeader: string;
  heading: string;
  subtext: string;
  text: string;
  mutedText: string;
  accentText: string;
  successText: string;
  dangerText: string;
  divider: string;
  listItem: string;
  focusRing: string;
}

const defaultStyles: ThemeStyles = {
  card: "bg-[#0c1425]/80 backdrop-blur-sm rounded-2xl border border-[#1e3054]/60 shadow-xl shadow-[#0a1628]/50",
  cardHeader: "p-5 border-b border-[#1e3054]/50",
  cardTitle: "text-base font-medium text-[#94a3c4] tracking-wide",
  input: "bg-[#0a1220] border-[#1e3054] text-[#e2e8f4] placeholder-[#3d5278] focus:ring-[#3b82f6] focus:border-[#3b82f6] rounded-xl",
  inputLabel: "text-[#7b8fb5]",
  btnPrimary: "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#3b82f6] hover:to-[#2563eb] text-white font-medium shadow-lg shadow-[#2563eb]/25 tracking-wide",
  btnSecondary: "bg-[#0f1d33] hover:bg-[#162844] text-[#94a3c4] border border-[#1e3054] tracking-wide",
  modal: "bg-[#0c1425] border-[#1e3054]",
  modalHeader: "border-[#1e3054]",
  heading: "text-[#e2e8f4]",
  subtext: "text-[#5a7299]",
  text: "text-[#e2e8f4]",
  mutedText: "text-[#5a7299]",
  accentText: "text-[#60a5fa]",
  successText: "text-[#34d399]",
  dangerText: "text-[#f87171]",
  divider: "border-[#1e3054]/50",
  listItem: "bg-[#0f1d33]/60",
  focusRing: "focus:ring-[#3b82f6]",
};

const v1Styles: ThemeStyles = {
  card: "bg-[#0f1420] border-2 border-[#f0a500]/20 shadow-lg shadow-[#f0a500]/5",
  cardHeader: "p-4 border-b-2 border-[#f0a500]/20 bg-[#0b0e1a]",
  cardTitle: "text-[10px] font-bold text-[#f0a500] uppercase tracking-[0.3em] font-mono",
  input: "bg-[#0b0e1a] border-2 border-[#f0a500]/20 text-white placeholder-[#6b7394] focus:ring-[#f0a500] focus:border-[#f0a500] font-mono",
  inputLabel: "text-[#6b7394] font-mono text-xs uppercase tracking-[0.15em]",
  btnPrimary: "bg-[#f0a500] hover:bg-[#c4985a] text-[#0b0e1a] font-mono font-bold uppercase tracking-[0.15em] shadow-md",
  btnSecondary: "bg-[#0f1420] hover:border-[#f0a500] text-[#c4985a] border-2 border-[#f0a500]/30 font-mono uppercase tracking-[0.15em]",
  modal: "bg-[#0f1420] border-2 border-[#f0a500]/20",
  modalHeader: "border-b-2 border-[#f0a500]/20",
  heading: "text-[#f0a500] font-mono uppercase tracking-[0.15em]",
  subtext: "text-[#6b7394]",
  text: "text-white",
  mutedText: "text-[#6b7394]",
  accentText: "text-[#f0a500]",
  successText: "text-emerald-400",
  dangerText: "text-red-400",
  divider: "border-[#f0a500]/20",
  listItem: "bg-[#0b0e1a] border border-[#f0a500]/10",
  focusRing: "focus:ring-[#f0a500]",
};

const v2Styles: ThemeStyles = {
  card: "bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.06] transition-all duration-500",
  cardHeader: "p-4 border-b border-white/[0.06]",
  cardTitle: "text-base font-semibold text-white/80 tracking-tight",
  input: "bg-white/[0.04] border-white/[0.08] text-white/90 placeholder-white/20 focus:ring-teal-400/50 backdrop-blur-xl rounded-xl",
  inputLabel: "text-white/30 text-[11px] uppercase tracking-[0.15em] font-medium",
  btnPrimary: "bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 hover:from-teal-400 hover:via-cyan-400 hover:to-emerald-400 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all duration-500",
  btnSecondary: "bg-white/[0.04] hover:bg-white/[0.08] text-white/60 border border-white/[0.08] hover:border-white/[0.12] backdrop-blur-xl transition-all duration-500",
  modal: "bg-[#0a0a0f]/95 backdrop-blur-2xl border-white/[0.08] shadow-[0_0_60px_-10px_rgba(20,184,166,0.1)]",
  modalHeader: "border-white/[0.06]",
  heading: "text-white/90",
  subtext: "text-white/25",
  text: "text-white/90",
  mutedText: "text-white/30",
  accentText: "text-teal-300",
  successText: "text-emerald-400",
  dangerText: "text-rose-400",
  divider: "border-white/[0.06]",
  listItem: "bg-white/[0.03] hover:bg-white/[0.05] transition-colors duration-300",
  focusRing: "focus:ring-teal-400/50",
};

const v3Styles: ThemeStyles = {
  card: "bg-transparent rounded-none border-0 shadow-none",
  cardHeader: "pb-6 border-0",
  cardTitle: "text-[11px] font-light text-white/15 uppercase tracking-[0.3em]",
  input: "bg-transparent border-0 border-b border-white/[0.04] text-white font-extralight placeholder-white/10 focus:ring-0 focus:border-[#f43f5e] rounded-none text-lg tracking-tight",
  inputLabel: "text-white/15 text-[11px] tracking-[0.3em] uppercase font-light",
  btnPrimary: "bg-transparent text-[11px] tracking-[0.3em] uppercase text-[#f43f5e] hover:text-[#f43f5e]/70 transition-colors shadow-none px-0 rounded-none",
  btnSecondary: "bg-transparent text-[11px] tracking-[0.3em] uppercase text-white/20 hover:text-white/40 transition-colors shadow-none px-0 rounded-none",
  modal: "bg-[#09090b] border-white/[0.04] rounded-none",
  modalHeader: "border-white/[0.04]",
  heading: "text-white font-extralight tracking-tight",
  subtext: "text-white/15 font-light",
  text: "text-white font-light",
  mutedText: "text-white/15",
  accentText: "text-[#f43f5e]",
  successText: "text-white/40",
  dangerText: "text-[#f43f5e]",
  divider: "border-white/[0.04]",
  listItem: "bg-transparent border-b border-white/[0.04]",
  focusRing: "focus:ring-0 focus:border-[#f43f5e]",
};

const v4Styles: ThemeStyles = {
  card: "bg-[#16213e]/80 rounded-md border border-[#533483]/70 shadow-[0_0_16px_rgba(83,52,131,0.15)]",
  cardHeader: "p-4 border-b border-[#533483]/50",
  cardTitle: "text-sm font-black text-[#e94560] uppercase tracking-[0.2em] drop-shadow-[0_0_6px_rgba(233,69,96,0.4)]",
  input: "bg-[#0f3460]/60 border-[#533483] text-[#e8e8e8] placeholder-[#e8e8e8]/20 focus:ring-[#e94560] focus:border-[#e94560] rounded-md font-bold",
  inputLabel: "text-[#533483] font-bold uppercase tracking-wider text-xs",
  btnPrimary: "bg-gradient-to-r from-[#e94560] to-[#c73852] hover:from-[#ff5a7a] hover:to-[#e94560] text-white font-black uppercase tracking-wider shadow-[0_0_16px_rgba(233,69,96,0.3)] hover:shadow-[0_0_24px_rgba(233,69,96,0.5)]",
  btnSecondary: "bg-[#16213e] hover:bg-[#533483]/30 text-[#e8e8e8]/60 border border-[#533483] hover:border-[#e94560]/50 font-bold uppercase tracking-wider",
  modal: "bg-[#1a1a2e] border-[#533483] shadow-[0_0_40px_rgba(83,52,131,0.3)]",
  modalHeader: "border-[#533483]/50",
  heading: "text-[#e94560] drop-shadow-[0_0_8px_rgba(233,69,96,0.4)]",
  subtext: "text-[#533483]",
  text: "text-[#e8e8e8]",
  mutedText: "text-[#e8e8e8]/40",
  accentText: "text-[#e94560] drop-shadow-[0_0_6px_rgba(233,69,96,0.4)]",
  successText: "text-[#0cca4a] drop-shadow-[0_0_6px_rgba(12,202,74,0.4)]",
  dangerText: "text-[#e94560] drop-shadow-[0_0_6px_rgba(233,69,96,0.4)]",
  divider: "border-[#533483]/50",
  listItem: "bg-[#16213e]/60 border border-[#533483]/30 hover:border-[#e94560]/30 transition-colors",
  focusRing: "focus:ring-[#e94560] focus:ring-offset-[#1a1a2e]",
};

const v5Styles: ThemeStyles = {
  card: "bg-[#2d2a24] rounded-3xl border border-[#3a3630] shadow-md shadow-[#1a1815]/40",
  cardHeader: "p-6 border-b border-[#3a3630]/60",
  cardTitle: "text-xs font-medium text-[#7a7264] uppercase tracking-widest",
  input: "bg-[#33302a] border-[#4a463e] text-[#e8dcc8] placeholder-[#7a7264] focus:ring-[#a8c686] focus:border-[#a8c686] rounded-2xl",
  inputLabel: "text-[#9b9285] tracking-wide",
  btnPrimary: "bg-gradient-to-r from-[#a8c686] to-[#8aad64] hover:from-[#b5d293] hover:to-[#96b474] text-[#2d2a24] font-medium shadow-md shadow-[#a8c686]/20 rounded-2xl tracking-wide",
  btnSecondary: "bg-[#33302a] hover:bg-[#3a3630] text-[#e8dcc8] border border-[#4a463e] rounded-2xl tracking-wide",
  modal: "bg-[#2d2a24] border-[#3a3630] rounded-3xl",
  modalHeader: "border-[#3a3630]/60",
  heading: "text-[#e8dcc8]",
  subtext: "text-[#7a7264]",
  text: "text-[#e8dcc8]",
  mutedText: "text-[#7a7264]",
  accentText: "text-[#a8c686]",
  successText: "text-[#a8c686]",
  dangerText: "text-[#d4726a]",
  divider: "border-[#3a3630]/60",
  listItem: "bg-[#33302a]/60 rounded-2xl",
  focusRing: "focus:ring-[#a8c686]",
};

const v6Styles: ThemeStyles = {
  card: "bg-[#f5f5f0] rounded-none border-2 border-black shadow-[4px_4px_0_0_black]",
  cardHeader: "p-4 border-b-2 border-black bg-[#ffdb58]",
  cardTitle: "text-sm font-black text-black uppercase tracking-widest",
  input: "bg-white border-2 border-black text-black placeholder-black/30 focus:ring-0 focus:border-black rounded-none",
  inputLabel: "text-black font-bold",
  btnPrimary: "bg-black hover:bg-[#333] text-white font-black uppercase tracking-wider shadow-[3px_3px_0_0_#ffdb58]",
  btnSecondary: "bg-white hover:bg-[#f0f0e8] text-black border-2 border-black font-bold shadow-[2px_2px_0_0_black]",
  modal: "bg-[#f5f5f0] border-2 border-black",
  modalHeader: "border-b-2 border-black bg-[#ffdb58]",
  heading: "text-black",
  subtext: "text-black/50",
  text: "text-black",
  mutedText: "text-black/50",
  accentText: "text-[#ff3864]",
  successText: "text-[#00a86b]",
  dangerText: "text-[#ff3864]",
  divider: "border-black",
  listItem: "bg-white border-2 border-black",
  focusRing: "focus:ring-0 focus:border-black",
};

const themeMap: Record<ThemeVersion, ThemeStyles> = {
  default: defaultStyles,
  v1: v1Styles,
  v2: v2Styles,
  v3: v3Styles,
  v4: v4Styles,
  v5: v5Styles,
  v6: v6Styles,
};

export function getThemeStyles(theme: ThemeVersion): ThemeStyles {
  return themeMap[theme];
}
