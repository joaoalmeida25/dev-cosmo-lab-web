export const LauncherSymbol = () => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient
        id="chat-symbol-face"
        x1="9"
        y1="6"
        x2="25"
        y2="25"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--primary-foreground)" />
        <stop offset="1" stopColor="var(--primary-foreground)" stopOpacity=".78" />
      </linearGradient>
    </defs>
    <path
      d="M6 10h16a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5h-3l-5 3v-3H9a5 5 0 0 1-5-5V15a5 5 0 0 1 2-5Z"
      fill="currentColor"
      opacity=".2"
    />
    <path
      d="M10 4h12a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6h-7l-6 4v-5a6 6 0 0 1-5-6v-7a6 6 0 0 1 6-6Z"
      fill="url(#chat-symbol-face)"
    />
    <path
      d="M10 6h12a4 4 0 0 1 4 4"
      stroke="var(--primary-foreground)"
      strokeOpacity=".85"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path d="M10 12h12M10 17h8" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
