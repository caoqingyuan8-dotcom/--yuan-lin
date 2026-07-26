// 防盗保护：右键禁用 + 快捷键拦截 + 控制台版权声明
(function(){
  document.addEventListener('contextmenu',function(e){e.preventDefault()});
  document.addEventListener('keydown',function(e){
    if(e.ctrlKey&&(e.key==='s'||e.key==='S'||e.key==='u'||e.key==='U')){e.preventDefault()}
    if(e.key==='F12'){e.preventDefault()}
  });
  console.log('%c© 2026 园林全景 · 禁止商用转载', 'font-size:18px;color:#b38c3c;font-weight:bold');
})();
