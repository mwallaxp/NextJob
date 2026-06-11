import { theme } from "./theme";

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: ${theme.bg};
    color: ${theme.text};
    font-family: 'DM Sans', sans-serif;
    font-size: 16px;
    line-height: 1.6;
    overflow-x: hidden;
  }

  :root {
    --bg: ${theme.bg};
    --text: ${theme.text};
    --accent: ${theme.accent};
    --card-bg: ${theme.card};
    --border: ${theme.border};
    --muted: ${theme.muted};
  }

  /* Override common Tailwind utilities to enforce dark theme colors */
  .bg-white, .bg-gray-50, .bg-gray-100, .bg-gray-200 { background: var(--card-bg) !important; }
  .bg-blue-600, .bg-blue-700, .bg-blue-500 { background: var(--accent) !important; }
  .bg-blue-50 { background: var(--card-bg) !important; }

  .text-white, .text-gray-800, .text-gray-700, .text-gray-600, .text-gray-500, .text-black-900, .text-black-700 { color: var(--text) !important; }
  .text-gray-400, .text-gray-500 { color: var(--muted) !important; }

  .border-gray-200, .border-gray-300, .border-black-100 { border-color: var(--border) !important; }

  /* Buttons and links */
  .hover\:bg-blue-700:hover, .hover\:bg-blue-600:hover, .hover\:bg-orange-600:hover, .hover\:bg-orange-700:hover { opacity: 0.95 !important; }
  .hover\:text-blue-600:hover, .hover\:text-orange-600:hover { color: var(--accent) !important; }

  /* Ensure form controls use dark theme */
  input, textarea, select, button {
    background: transparent !important;
    color: var(--text) !important;
    border-color: var(--border) !important;
  }

  /* Links and buttons */
  a, button { color: var(--text) !important; }
  a:hover, button:hover { opacity: 0.95 !important; }

  /* Cards, panels */
  .card, .panel, .modal, .shadow-xl { background: var(--card-bg) !important; color: var(--text) !important; }

  /* Utility fallbacks for remaining Tailwind color classes */
  .text-blue-600, .text-orange-600, .text-red-600, .text-green-500 { color: var(--text) !important; }
  .bg-orange-500, .bg-orange-600, .bg-red-50, .bg-white { background: var(--card-bg) !important; }

  /* Force body-level inheritance for any direct color styles */
  *[class*="text-"] { color: inherit !important; }
  *[class*="bg-"] { background: inherit !important; }


  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes marqueeScroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: none;
  }

  .fade-anim { animation: fadeUp 0.6s ease both; }
  .fade-anim-1 { animation: fadeUp 0.7s ease both 0.1s; }
  .fade-anim-2 { animation: fadeUp 0.7s ease both 0.2s; }
  .fade-anim-3 { animation: fadeUp 0.8s ease both 0.3s; }
  .fade-anim-4 { animation: fadeUp 0.8s ease both 0.4s; }
  .fade-anim-5 { animation: fadeUp 0.8s ease both 0.5s; }

  .marquee-track { animation: marqueeScroll 18s linear infinite; }

  .btn-primary:hover  { transform: translateY(-2px); opacity: 0.9; }
  .btn-secondary:hover { border-color: ${theme.accent} !important; color: ${theme.accent} !important; }
  .nav-link:hover  { color: ${theme.accent} !important; }
  .nav-cta:hover   { opacity: 0.85; }
  .project-card:hover { transform: translateY(-6px); border-color: #333 !important; }
  .service-item:hover { background: #161616 !important; border-color: #2a2a2a !important; }
  .service-item:hover .service-arrow { background: ${theme.accent} !important; color: #000 !important; border-color: ${theme.accent} !important; }
  .skill-card:hover { border-color: ${theme.accent} !important; }
  .benefit-card:hover { background: #1a1a1a !important; }
  .brand-pill:hover { border-color: ${theme.accent} !important; color: ${theme.text} !important; }
  .t-fade { transition: opacity 0.25s ease, transform 0.25s ease; }
`;

export default globalStyles;
