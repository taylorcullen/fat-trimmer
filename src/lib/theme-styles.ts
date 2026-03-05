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
  card: "bg-slate-800 rounded-xl border border-slate-700 shadow-lg",
  cardHeader: "p-4 border-b border-slate-700",
  cardTitle: "text-lg font-semibold text-white",
  input: "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-primary-500",
  inputLabel: "text-slate-300",
  btnPrimary: "bg-gradient-primary hover:opacity-90 text-white shadow-md hover:shadow-lg",
  btnSecondary: "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600",
  modal: "bg-slate-800 border-slate-700",
  modalHeader: "border-slate-700",
  heading: "text-white",
  subtext: "text-slate-400",
  text: "text-white",
  mutedText: "text-slate-400",
  accentText: "text-primary-400",
  successText: "text-green-400",
  dangerText: "text-red-400",
  divider: "border-slate-700",
  listItem: "bg-slate-700/50",
  focusRing: "focus:ring-primary-500",
};

const v1Styles: ThemeStyles = {
  card: "bg-[#16213e] rounded-md border border-[#2a2a4a] shadow-lg",
  cardHeader: "p-4 border-b border-[#2a2a4a] bg-[#0f1a2e]",
  cardTitle: "text-sm font-semibold text-[#f0a500] uppercase tracking-wider",
  input: "bg-[#0f1a2e] border-[#2a2a4a] text-white placeholder-slate-500 focus:ring-[#f0a500]",
  inputLabel: "text-slate-300",
  btnPrimary: "bg-[#f0a500] hover:bg-[#cf9f00] text-[#16213e] font-medium shadow-md",
  btnSecondary: "bg-[#16213e] hover:bg-[#2a2a4a] text-slate-300 border border-[#2a2a4a]",
  modal: "bg-[#16213e] border-[#2a2a4a]",
  modalHeader: "border-[#2a2a4a]",
  heading: "text-[#f0a500]",
  subtext: "text-slate-400",
  text: "text-white",
  mutedText: "text-slate-400",
  accentText: "text-[#f0a500]",
  successText: "text-green-400",
  dangerText: "text-red-400",
  divider: "border-[#2a2a4a]",
  listItem: "bg-[#0f1a2e]",
  focusRing: "focus:ring-[#f0a500]",
};

const v2Styles: ThemeStyles = {
  card: "bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-lg",
  cardHeader: "p-4 border-b border-white/10",
  cardTitle: "text-lg font-semibold text-white",
  input: "bg-white/5 border-white/10 text-white placeholder-white/30 focus:ring-teal-500",
  inputLabel: "text-white/50",
  btnPrimary: "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white shadow-md shadow-teal-500/20",
  btnSecondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
  modal: "bg-[#111827]/90 backdrop-blur-xl border-white/10",
  modalHeader: "border-white/10",
  heading: "text-white",
  subtext: "text-white/40",
  text: "text-white",
  mutedText: "text-white/40",
  accentText: "text-teal-400",
  successText: "text-emerald-400",
  dangerText: "text-rose-400",
  divider: "border-white/10",
  listItem: "bg-white/[0.03]",
  focusRing: "focus:ring-teal-500",
};

const v3Styles: ThemeStyles = {
  card: "bg-transparent rounded-none border-0 shadow-none",
  cardHeader: "pb-4 border-b border-white/5",
  cardTitle: "text-sm font-normal text-white/20 uppercase tracking-widest",
  input: "bg-transparent border-white/10 text-white placeholder-white/20 focus:ring-[#f43f5e] rounded-none border-0 border-b",
  inputLabel: "text-white/20",
  btnPrimary: "bg-transparent text-[#f43f5e] hover:underline underline-offset-4 shadow-none px-0",
  btnSecondary: "bg-transparent text-white/30 hover:text-white/60 hover:underline underline-offset-4 shadow-none px-0",
  modal: "bg-[#09090b] border-white/5",
  modalHeader: "border-white/5",
  heading: "text-white",
  subtext: "text-white/20",
  text: "text-white",
  mutedText: "text-white/20",
  accentText: "text-[#f43f5e]",
  successText: "text-emerald-500",
  dangerText: "text-[#f43f5e]",
  divider: "border-white/5",
  listItem: "bg-transparent border-b border-white/5",
  focusRing: "focus:ring-[#f43f5e]",
};

const themeMap: Record<ThemeVersion, ThemeStyles> = {
  default: defaultStyles,
  v1: v1Styles,
  v2: v2Styles,
  v3: v3Styles,
};

export function getThemeStyles(theme: ThemeVersion): ThemeStyles {
  return themeMap[theme];
}
