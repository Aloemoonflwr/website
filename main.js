// main.js

// Show/hide window with animation when clicking desktop icon or start menu
function toggleWindow(targetId) {
  const win = document.getElementById(targetId);
  if (!win) return;

  // Show with animation
  if (win.style.display === 'none' || getComputedStyle(win).display === 'none') {
    win.style.display = 'block';
    win.style.opacity = 0;
    win.style.transform = 'scale(0.9)';
    win.style.zIndex = ++window.maxZ;
    setTimeout(() => {
      win.style.opacity = 1;
      win.style.transform = 'scale(1)';
    }, 10);
  } else {
    // Hide with animation
    win.style.opacity = 0;
    win.style.transform = 'scale(0.9)';
    setTimeout(() => {
      win.style.display = 'none';
    }, 200);
  }
}

// Desktop icon click
const icons = document.querySelectorAll('.desktop-icon');
icons.forEach(icon => {
  icon.addEventListener('dblclick', () => {
    const targetId = icon.getAttribute('data-target');
    toggleWindow(targetId);
  });
});

// Start menu toggle
const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');
startBtn.addEventListener('click', () => {
  startMenu.classList.toggle('visible');
});

// Start menu item click
const startItems = startMenu.querySelectorAll('li');
startItems.forEach(item => {
  item.addEventListener('click', () => {
    const targetId = item.getAttribute('data-target');
    toggleWindow(targetId);
    startMenu.classList.remove('visible');
  });
});

// Close button
const closeBtns = document.querySelectorAll('.close-btn');
closeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const win = btn.closest('.window');
    win.style.opacity = 0;
    win.style.transform = 'scale(0.9)';
    setTimeout(() => {
      win.style.display = 'none';
    }, 200);
  });
});

// Make windows draggable and resizable
const windows = document.querySelectorAll('.window');
let offsetX, offsetY, activeWin;

windows.forEach(win => {
  const titleBar = win.querySelector('.window-title-bar');
  titleBar.addEventListener('mousedown', e => {
    activeWin = win;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = ++window.maxZ;
    document.addEventListener('mousemove', dragWindow);
    document.addEventListener('mouseup', stopDrag);
  });

  // Enable resizable corners
  const resizer = document.createElement('div');
  resizer.classList.add('resizer');
  win.appendChild(resizer);

  let isResizing = false;
  resizer.addEventListener('mousedown', e => {
    isResizing = true;
    activeWin = win;
    win.style.zIndex = ++window.maxZ;
    offsetX = e.clientX;
    offsetY = e.clientY;
    document.addEventListener('mousemove', resizeWindow);
    document.addEventListener('mouseup', stopResize);
    e.preventDefault();
  });

  function resizeWindow(e) {
    if (!isResizing || !activeWin) return;
    const dx = e.clientX - offsetX;
    const dy = e.clientY - offsetY;
    offsetX = e.clientX;
    offsetY = e.clientY;
    activeWin.style.width = activeWin.offsetWidth + dx + 'px';
    activeWin.style.height = activeWin.offsetHeight + dy + 'px';
  }

  function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', resizeWindow);
    document.removeEventListener('mouseup', stopResize);
  }
});

// Initialize z-index tracking
window.maxZ = 10;
