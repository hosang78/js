const menuList = document.getElementById('menuList');
const content = document.getElementById('content');
const descText = document.getElementById('descText');
const logoutBtn = document.getElementById('logoutBtn');

async function loadPages() {
  const res = await fetch('/api/pages');
  if (res.status === 401) {
    window.location.href = '/login';
    return;
  }
  const pages = await res.json();

  menuList.innerHTML = '';

  if (pages.length === 0) {
    menuList.innerHTML = '<div class="menu-empty">등록된 페이지가 없습니다</div>';
    return;
  }

  pages.forEach((page) => {
    const item = document.createElement('div');
    item.className = 'menu-item';
    item.textContent = page.name;
    item.addEventListener('click', () => selectPage(page, item));
    menuList.appendChild(item);
  });
}

function selectPage(page, itemEl) {
  document.querySelectorAll('.menu-item').forEach((el) => el.classList.remove('active'));
  itemEl.classList.add('active');

  content.innerHTML = '';
  const iframe = document.createElement('iframe');
  iframe.src = `/pages/${page.slug}/${page.entry}`;
  content.appendChild(iframe);

  descText.textContent = page.description || '설명이 없습니다.';
}

logoutBtn.addEventListener('click', async () => {
  await fetch('/logout', { method: 'POST' });
  window.location.href = '/login';
});

loadPages();
