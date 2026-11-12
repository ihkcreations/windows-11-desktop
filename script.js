const windows = document.querySelectorAll('.window');
const icons = document.querySelectorAll('.desktop-icon');
const taskbarApps = document.querySelectorAll('.taskbar-app');
let highestZ = 10;
let currentActiveApp = null;
function bringToFront(win) {
  highestZ++;
  win.style.zIndex = highestZ;
}
function openApp(appId) {
  const win = document.getElementById(appId + '-window');
  win.classList.add('active');
  bringToFront(win);
  updateTaskbarState(appId, true);
}
function closeApp(appId) {
  const win = document.getElementById(appId + '-window');
  win.classList.remove('active');
  win.classList.remove('maximized');
  updateTaskbarState(appId, false);
}
function updateTaskbarState(appId, isOpen) {
  const tApp = document.querySelector(`.taskbar-app[data-app-target="${appId}"]`);
  if (isOpen) {
    tApp.classList.add('active');
  } else {
    tApp.classList.remove('active');
  }
}
icons.forEach(icon => {
  icon.addEventListener('click', () => {
    const appId = icon.getAttribute('data-app');
    openApp(appId);
  });
});
taskbarApps.forEach(tApp => {
  tApp.addEventListener('click', () => {
    const appId = tApp.getAttribute('data-app-target');
    const win = document.getElementById(appId + '-window');
    if (win.classList.contains('active')) {
      win.classList.remove('active');
      updateTaskbarState(appId, false);
    } else {
      openApp(appId);
    }
  });
});
windows.forEach(win => {
  const header = win.querySelector('.window-header');
  const closeBtn = win.querySelector('.close-btn');
  const maxBtn = win.querySelector('.maximize-btn');
  const minBtn = win.querySelector('.minimize-btn');
  const appId = win.getAttribute('data-app-id');
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  header.addEventListener('mousedown', (e) => {
    if (win.classList.contains('maximized')) return;
    isDragging = true;
    startX = e.clientX - win.offsetLeft;
    startY = e.clientY - win.offsetTop;
    bringToFront(win);
  });
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    win.style.left = (e.clientX - startX) + 'px';
    win.style.top = (e.clientY - startY) + 'px';
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
  win.addEventListener('mousedown', () => {
    bringToFront(win);
  });
  closeBtn.addEventListener('click', () => {
    closeApp(appId);
  });
  maxBtn.addEventListener('click', () => {
    win.classList.toggle('maximized');
  });
  minBtn.addEventListener('click', () => {
    win.classList.remove('active');
    updateTaskbarState(appId, false);
  });
});
const paintCanvas = document.querySelector('.paint-canvas');
const ctx = paintCanvas.getContext('2d');
let isDrawing = false;
let currentTool = 'brush';
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
paintCanvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});
paintCanvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;
  if (currentTool === 'brush') {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (currentTool === 'eraser') {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 10;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
});
paintCanvas.addEventListener('mouseup', () => {
  isDrawing = false;
});
const paintTools = document.querySelectorAll('.paint-tool');
paintTools.forEach(tool => {
  tool.addEventListener('click', () => {
    paintTools.forEach(t => t.classList.remove('active'));
    tool.classList.add('active');
    currentTool = tool.getAttribute('data-tool');
  });
});
const paintClear = document.querySelector('.paint-clear');
paintClear.addEventListener('click', () => {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
});
