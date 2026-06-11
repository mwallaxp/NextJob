import { theme } from "./theme";

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background:
      radial-gradient(circle at top left, rgba(249, 115, 22, 0.10), transparent 34rem),
      linear-gradient(180deg, #fffaf5 0%, #fff7ed 42%, #ffffff 100%);
    color: ${theme.text};
    font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    overflow-x: hidden;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  :root {
    --bg: ${theme.bg};
    --text: ${theme.text};
    --accent: ${theme.accent};
    --accent-hover: ${theme.accentHover};
    --complement: ${theme.complement};
    --complement-hover: ${theme.complementHover};
    --card-bg: ${theme.card};
    --border: ${theme.border};
    --muted: ${theme.muted};
    --ring: rgba(249, 115, 22, 0.24);
  }

  h1, h2, h3, h4, h5, h6 {
    color: #241611;
    font-family: 'Manrope', 'Inter', ui-sans-serif, system-ui, sans-serif;
    letter-spacing: 0;
  }

  p, li, label, span {
    letter-spacing: 0;
  }

  a {
    color: inherit;
    text-decoration-thickness: 0.08em;
    text-underline-offset: 0.18em;
  }

  ::selection {
    background: rgba(249, 115, 22, 0.22);
    color: #241611;
  }

  input, textarea, select {
    color: #241611;
    background-color: #ffffff;
    border-color: #fed7aa;
  }

  input::placeholder, textarea::placeholder {
    color: #9a8174;
  }

  input:focus, textarea:focus, select:focus {
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 4px var(--ring) !important;
  }

  button, a {
    transition:
      color 0.2s ease,
      background-color 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.2s ease,
      opacity 0.2s ease;
  }

  .bg-blue-500, .bg-blue-600, .bg-blue-700,
  .bg-slate-950, .bg-black-900 {
    background-color: var(--accent) !important;
  }

  .hover\\:bg-blue-700:hover,
  .hover\\:bg-blue-600:hover,
  .hover\\:bg-slate-800:hover,
  .hover\\:bg-orange-600:hover,
  .hover\\:bg-orange-700:hover {
    background-color: var(--accent-hover) !important;
  }

  .text-blue-500, .text-blue-600, .text-blue-700,
  .text-orange-500, .text-orange-600, .text-orange-700 {
    color: var(--accent) !important;
  }

  .hover\\:text-blue-500:hover,
  .hover\\:text-blue-600:hover,
  .hover\\:text-blue-700:hover,
  .hover\\:text-orange-600:hover,
  .hover\\:text-orange-700:hover {
    color: var(--accent-hover) !important;
  }

  .border-blue-500, .border-blue-600,
  .border-orange-500, .border-orange-600 {
    border-color: var(--accent) !important;
  }

  .focus\\:ring-blue-500:focus,
  .focus\\:ring-orange-500:focus,
  .focus\\:border-blue-500:focus,
  .focus\\:border-orange-500:focus {
    --tw-ring-color: var(--ring) !important;
    border-color: var(--accent) !important;
  }

  .bg-blue-50, .bg-orange-50 {
    background-color: #fff7ed !important;
  }

  .text-black-900, .text-slate-950, .text-gray-900 {
    color: #241611 !important;
  }

  .text-black-700, .text-slate-700, .text-gray-700 {
    color: #4b342a !important;
  }

  .text-black-600, .text-slate-600, .text-gray-600,
  .text-black-500, .text-slate-500, .text-gray-500 {
    color: var(--muted) !important;
  }

  .border-gray-200, .border-gray-300, .border-black-100, .border-slate-200 {
    border-color: #fed7aa !important;
  }

  .shadow-xl, .shadow-lg, .shadow-medium, .shadow-soft {
    box-shadow: 0 18px 45px rgba(124, 45, 18, 0.10) !important;
  }

  .bg-gradient-to-br.from-orange-50.to-white,
  .bg-gradient-to-b.from-orange-50.to-white,
  .bg-gradient-to-r.from-orange-50.to-white {
    background-image: linear-gradient(135deg, #fff7ed 0%, #ffffff 58%, rgba(15, 118, 110, 0.08) 100%) !important;
  }

  .text-teal-600, .text-teal-700 {
    color: var(--complement) !important;
  }

  .bg-teal-600, .bg-teal-700 {
    background-color: var(--complement) !important;
  }

  .hover\\:bg-teal-700:hover {
    background-color: var(--complement-hover) !important;
  }


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

  .btn-primary:hover  { transform: translateY(-2px); opacity: 0.96; }
  .btn-secondary:hover { border-color: ${theme.accent} !important; color: ${theme.accent} !important; }
  .nav-link:hover  { color: ${theme.accent} !important; }
  .nav-cta:hover   { opacity: 0.85; }
  .project-card:hover { transform: translateY(-6px); border-color: ${theme.accent} !important; }
  .service-item:hover { background: #fff7ed !important; border-color: ${theme.border} !important; }
  .service-item:hover .service-arrow { background: ${theme.accent} !important; color: #fff !important; border-color: ${theme.accent} !important; }
  .skill-card:hover { border-color: ${theme.accent} !important; }
  .benefit-card:hover { background: #fff7ed !important; }
  .brand-pill:hover { border-color: ${theme.accent} !important; color: ${theme.text} !important; }
  .t-fade { transition: opacity 0.25s ease, transform 0.25s ease; }
`;

export default globalStyles;
