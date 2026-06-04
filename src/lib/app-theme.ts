export type AppUiTokens = {
  dark: boolean;
  text: string;
  textMuted: string;
  heading: string;
  border: string;
  borderSubtle: string;
  surface: string;
  surfaceMuted: string;
  surfaceHover: string;
  chipActiveBg: string;
  chipActiveBorder: string;
  chipActiveText: string;
  chipIdleBg: string;
  chipIdleBorder: string;
  chipIdleText: string;
  buttonBg: string;
  buttonBorder: string;
  buttonText: string;
  buttonHover: string;
  buttonAccentBg: string;
  buttonAccentHover: string;
  iconSurface: string;
  badgeBg: string;
  badgeText: string;
  badgeDivider: string;
  statusReady: string;
  statusRendering: string;
  statusError: string;
  statusIdle: string;
  emptyBorder: string;
  emptyBg: string;
  emptyText: string;
  errorSurface: string;
  errorBorder: string;
  errorTitle: string;
  errorText: string;
  gridLine: string;
  sketchDot: string;
  shellWash: string;
  editorBg: string;
  editorHeader: string;
  editorMeta: string;
  editorText: string;
  editorCaret: string;
};

export const lightAppUi: AppUiTokens = {
  dark: false,
  text: "#2f2a24",
  textMuted: "#6f6255",
  heading: "#241f1a",
  border: "rgb(47 42 36 / 0.12)",
  borderSubtle: "rgb(47 42 36 / 0.08)",
  surface: "rgb(255 255 255 / 0.72)",
  surfaceMuted: "rgb(255 255 255 / 0.5)",
  surfaceHover: "rgb(255 255 255 / 0.88)",
  chipActiveBg: "#fff7db",
  chipActiveBorder: "rgb(47 42 36 / 0.8)",
  chipActiveText: "#2f2a24",
  chipIdleBg: "rgb(255 255 255 / 0.5)",
  chipIdleBorder: "rgb(47 42 36 / 0.1)",
  chipIdleText: "#5f5549",
  buttonBg: "rgb(255 255 255 / 0.72)",
  buttonBorder: "rgb(47 42 36 / 0.15)",
  buttonText: "#2f2a24",
  buttonHover: "#ffffff",
  buttonAccentBg: "#fff2b8",
  buttonAccentHover: "#fff7db",
  iconSurface: "rgb(255 255 255 / 0.72)",
  badgeBg: "rgb(255 255 255 / 0.5)",
  badgeText: "#6f6255",
  badgeDivider: "rgb(47 42 36 / 0.2)",
  statusReady: "border-emerald-200/80 bg-emerald-50 text-emerald-800",
  statusRendering: "border-amber-200/80 bg-amber-50 text-amber-800",
  statusError: "border-rose-200/80 bg-rose-50 text-rose-800",
  statusIdle: "border-[color:var(--ui-border)] bg-[color:var(--ui-surface-muted)] text-[color:var(--ui-text-muted)]",
  emptyBorder: "rgb(47 42 36 / 0.2)",
  emptyBg: "rgb(255 255 255 / 0.4)",
  emptyText: "#6f6255",
  errorSurface: "#fff1f2",
  errorBorder: "#fecdd3",
  errorTitle: "#e11d48",
  errorText: "#881337",
  gridLine: "rgb(47 42 36 / 0.04)",
  sketchDot: "rgb(47 42 36 / 0.1)",
  shellWash:
    "radial-gradient(circle at 12% 8%, rgba(255,255,255,0.72), transparent 24%), radial-gradient(circle at 88% 12%, rgba(139,92,246,0.08), transparent 28%), radial-gradient(circle at 72% 88%, rgba(245,158,11,0.08), transparent 30%)",
  editorBg: "#1a2332",
  editorHeader: "#111827",
  editorMeta: "#9ca3af",
  editorText: "#e2e8f0",
  editorCaret: "#fbbf24",
};

export const darkAppUi: AppUiTokens = {
  dark: true,
  text: "#fff7d6",
  textMuted: "rgb(255 247 214 / 0.62)",
  heading: "#fff7d6",
  border: "rgb(255 255 255 / 0.12)",
  borderSubtle: "rgb(255 255 255 / 0.08)",
  surface: "rgb(15 23 42 / 0.82)",
  surfaceMuted: "rgb(255 255 255 / 0.06)",
  surfaceHover: "rgb(255 255 255 / 0.1)",
  chipActiveBg: "rgb(251 191 36 / 0.18)",
  chipActiveBorder: "rgb(251 191 36 / 0.55)",
  chipActiveText: "#fff7d6",
  chipIdleBg: "rgb(255 255 255 / 0.05)",
  chipIdleBorder: "rgb(255 255 255 / 0.1)",
  chipIdleText: "rgb(255 247 214 / 0.72)",
  buttonBg: "rgb(255 255 255 / 0.07)",
  buttonBorder: "rgb(255 255 255 / 0.12)",
  buttonText: "#fff7d6",
  buttonHover: "rgb(255 255 255 / 0.12)",
  buttonAccentBg: "rgb(251 191 36 / 0.22)",
  buttonAccentHover: "rgb(251 191 36 / 0.32)",
  iconSurface: "rgb(255 255 255 / 0.08)",
  badgeBg: "rgb(255 255 255 / 0.06)",
  badgeText: "rgb(255 247 214 / 0.72)",
  badgeDivider: "rgb(255 255 255 / 0.16)",
  statusReady: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  statusRendering: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  statusError: "border-rose-400/25 bg-rose-400/10 text-rose-200",
  statusIdle: "border-[color:var(--ui-border)] bg-[color:var(--ui-surface-muted)] text-[color:var(--ui-text-muted)]",
  emptyBorder: "rgb(255 255 255 / 0.14)",
  emptyBg: "rgb(255 255 255 / 0.04)",
  emptyText: "rgb(255 247 214 / 0.62)",
  errorSurface: "rgb(127 29 29 / 0.35)",
  errorBorder: "rgb(248 113 113 / 0.35)",
  errorTitle: "#fecaca",
  errorText: "#fee2e2",
  gridLine: "rgb(255 255 255 / 0.05)",
  sketchDot: "rgb(255 255 255 / 0.08)",
  shellWash:
    "radial-gradient(circle at 14% 10%, rgba(251,191,36,0.08), transparent 28%), radial-gradient(circle at 86% 16%, rgba(255,255,255,0.04), transparent 24%), radial-gradient(circle at 70% 88%, rgba(96,165,250,0.06), transparent 30%)",
  editorBg: "#0b1220",
  editorHeader: "#070d18",
  editorMeta: "rgb(255 247 214 / 0.45)",
  editorText: "#e8edf5",
  editorCaret: "#fbbf24",
};

export function appUiToCssVars(ui: AppUiTokens): Record<string, string> {
  return {
    "--ui-text": ui.text,
    "--ui-text-muted": ui.textMuted,
    "--ui-heading": ui.heading,
    "--ui-border": ui.border,
    "--ui-border-subtle": ui.borderSubtle,
    "--ui-surface": ui.surface,
    "--ui-surface-muted": ui.surfaceMuted,
    "--ui-surface-hover": ui.surfaceHover,
    "--ui-chip-active-bg": ui.chipActiveBg,
    "--ui-chip-active-border": ui.chipActiveBorder,
    "--ui-chip-active-text": ui.chipActiveText,
    "--ui-chip-idle-bg": ui.chipIdleBg,
    "--ui-chip-idle-border": ui.chipIdleBorder,
    "--ui-chip-idle-text": ui.chipIdleText,
    "--ui-button-bg": ui.buttonBg,
    "--ui-button-border": ui.buttonBorder,
    "--ui-button-text": ui.buttonText,
    "--ui-button-hover": ui.buttonHover,
    "--ui-button-accent-bg": ui.buttonAccentBg,
    "--ui-button-accent-hover": ui.buttonAccentHover,
    "--ui-icon-surface": ui.iconSurface,
    "--ui-badge-bg": ui.badgeBg,
    "--ui-badge-text": ui.badgeText,
    "--ui-badge-divider": ui.badgeDivider,
    "--ui-empty-border": ui.emptyBorder,
    "--ui-empty-bg": ui.emptyBg,
    "--ui-empty-text": ui.emptyText,
    "--ui-error-surface": ui.errorSurface,
    "--ui-error-border": ui.errorBorder,
    "--ui-error-title": ui.errorTitle,
    "--ui-error-text": ui.errorText,
    "--ui-grid-line": ui.gridLine,
    "--ui-sketch-dot": ui.sketchDot,
    "--ui-shell-wash": ui.shellWash,
    "--ui-editor-bg": ui.editorBg,
    "--ui-editor-header": ui.editorHeader,
    "--ui-editor-meta": ui.editorMeta,
    "--ui-editor-text": ui.editorText,
    "--ui-editor-caret": ui.editorCaret,
  };
}
