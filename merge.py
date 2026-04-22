import re

with open('frontend/src/index_original_utf8.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Swap root variables
css = css.replace('--bg-page:        #F8F9FB;', '--bg-page:        #FAFAF9;')
css = css.replace('--primary:        #FF6B00;', '--primary:        #DC2626;')
css = css.replace('--primary-hover:  #E85F00;', '--primary-hover:  #B91C1C;')
css = css.replace('--nav-active-bg:  #FF6B00;', '--nav-active-bg:  #DC2626;')
css = css.replace('--text-brand:     #FF6B00;', '--text-brand:     #DC2626;')

# Swap dark theme variables
css = css.replace('--bg-page:        #0D1117;', '--bg-page:        #0C0A09;')
css = css.replace('--bg-surface:     #161B22;', '--bg-surface:     #1C1917;')
css = css.replace('--primary:        #FF8C42;', '--primary:        #EF4444;')
css = css.replace('--primary-hover:  #FF9D5C;', '--primary-hover:  #F87171;')
css = css.replace('--nav-active-bg:  #FF8C42;', '--nav-active-bg:  #EF4444;')
css = css.replace('--text-brand:     #FF8C42;', '--text-brand:     #EF4444;')
css = css.replace('--border:         #30363D;', '--border:         #44403C;')

# Swap typography
css = css.replace('--font-sans: "Inter", "Poppins", sans-serif;', '--font-sans: "IBM Plex Sans", system-ui, sans-serif;')
css = css.replace("font-family: 'Inter', 'Poppins', system-ui, sans-serif;", "font-family: 'IBM Plex Sans', system-ui, sans-serif;")
css = css.replace("font-family: 'Poppins', 'Inter', sans-serif;", "font-family: 'DM Serif Display', serif;")

# Clean up any leftover gradient text from Orange
css = css.replace('radial-gradient(ellipse at 20% 10%, rgba(255,140,66,0.05) 0%, transparent 55%),', 'radial-gradient(ellipse at 20% 10%, rgba(239,68,68,0.05) 0%, transparent 55%),')
css = css.replace('rgba(255,107,0,0.03)', 'rgba(220,38,38,0.03)')
css = css.replace('rgba(255,140,66,0.025)', 'rgba(239,68,68,0.025)')

# Prototype UI Components
prototype_css = """
/* ═══════════════════════════════════════════════════════
   PROTOTYPE COMPONENT CSS INJECTIONS
   ═══════════════════════════════════════════════════════ */
.container { max-width: 1400px; margin: 0 auto; padding: 0 24px; }
.search-section {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 48px;
  margin-bottom: 60px;
  box-shadow: var(--shadow-sm);
  animation: slideInDown 0.6s ease forwards;
}
.search-tabs {
  display: flex; gap: 12px; margin-bottom: 32px;
  border-bottom: 1px solid var(--border); padding-bottom: 2px;
}
.search-tab {
  padding: 12px 24px; background: none; border: none;
  color: var(--text-secondary); font-size: 15px; font-weight: 500;
  cursor: pointer; position: relative; transition: color 0.2s ease;
}
.search-tab.active { color: var(--primary); }
.search-tab.active::after {
  content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
  height: 2px; background: var(--primary);
}
.search-form { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-group { display: flex; flex-direction: column; }
.form-group.full-width { grid-column: 1 / -1; }
.form-group label { font-size: 14px; font-weight: 500; margin-bottom: 8px; color: var(--text-secondary); }

.hero { padding: 60px 0 40px; text-align: left; }
.hero-h1 {
  font-family: 'DM Serif Display', serif;
  font-size: 40px;
  font-weight: 400;
  margin-bottom: 16px;
  letter-spacing: -1px;
  color: var(--text-heading);
}

.train-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 16px; padding: 28px; margin-bottom: 16px;
  transition: all 0.3s ease;
}
.train-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.train-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 24px; }
.train-info h3 { font-size: 20px; font-weight: 600; margin-bottom: 4px; font-family: 'DM Serif Display', serif; }
.train-number { color: var(--text-secondary); font-size: 14px; font-weight: 500; }
.train-route { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
.route-line { flex: 2; height: 2px; background: var(--border); position: relative; }
.route-line::before, .route-line::after {
  content: ''; position: absolute; width: 8px; height: 8px;
  background: var(--primary); border-radius: 50%; top: 50%; transform: translateY(-50%);
}
.route-line::before { left: 0; }
.route-line::after { right: 0; }
.btn-primary {
  background: var(--primary); color: white; border: none; padding: 16px 32px;
  border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease; grid-column: 1 / -1; display: flex; justify-content: center; align-items: center; gap: 8px;
}
.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover); transform: translateY(-2px); box-shadow: var(--shadow-md);
}
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

@media (max-width: 768px) {
  .search-form { grid-template-columns: 1fr; }
  .train-route { flex-direction: column; align-items: start; gap: 12px; }
  .route-line { width: 2px; height: 40px; }
  .route-line::before, .route-line::after { left: 50%; transform: translateX(-50%); }
  .route-line::before { top: 0; }
  .route-line::after { bottom: 0; top: auto; }
}
"""
css += prototype_css

with open('frontend/src/index.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Successfully restored and merged CSS')
