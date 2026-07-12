const menuList = document.getElementById('menuList');
const content = document.getElementById('content');
const logoutBtn = document.getElementById('logoutBtn');
const dashboard = document.querySelector('.dashboard');
const hideSidebarBtn = document.getElementById('hideSidebarBtn');
const showSidebarBtn = document.getElementById('showSidebarBtn');

const SIDEBAR_COLLAPSED_KEY = 'sidebarCollapsed';

function setSidebarCollapsed(collapsed) {
  dashboard.classList.toggle('sidebar-collapsed', collapsed);
  localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0');
}

hideSidebarBtn.addEventListener('click', () => setSidebarCollapsed(true));
showSidebarBtn.addEventListener('click', () => setSidebarCollapsed(false));

setSidebarCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1');

async function loadPages() {
  const res = await fetch('/api/pages');
  if (res.status === 401) {
    window.location.href = '/login';
    return;
  }
  const groups = await res.json();

  menuList.innerHTML = '';

  const totalPages = groups.reduce((sum, g) => sum + g.pages.length, 0);
  if (totalPages === 0) {
    menuList.innerHTML = '<div class="menu-empty">등록된 페이지가 없습니다</div>';
    return;
  }

  groups.forEach((group) => {
    const groupLabel = document.createElement('div');
    groupLabel.className = 'menu-group-label';
    groupLabel.textContent = group.label;
    menuList.appendChild(groupLabel);

    group.pages.forEach((page) => {
      const item = document.createElement('div');
      item.className = 'menu-item';
      item.textContent = page.name;
      item.addEventListener('click', () => selectPage(page, item));
      menuList.appendChild(item);
    });
  });
}

function selectPage(page, itemEl) {
  document.querySelectorAll('.menu-item').forEach((el) => el.classList.remove('active'));
  itemEl.classList.add('active');

  content.innerHTML = '';
  const iframe = document.createElement('iframe');
  iframe.src = `/pages/${page.slug}/${page.entry}`;
  content.appendChild(iframe);
}

logoutBtn.addEventListener('click', async () => {
  await fetch('/logout', { method: 'POST' });
  window.location.href = '/login';
});

loadPages();
