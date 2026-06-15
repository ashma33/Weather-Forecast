function toggleTheme() {
  const toggle = document.getElementById('themeToggle');
  const isDark = toggle.checked;
  const mode = isDark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', mode);
  localStorage.setItem('theme', mode);
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.checked = (saved === 'dark');
  }
});