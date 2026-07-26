(function(){
  var kwDiv = document.getElementById('related-ebooks');
  if(!kwDiv) return;
  var keywords = (kwDiv.getAttribute('data-keywords') || '').split(',').map(function(k){return k.trim().toLowerCase()});
  if(!keywords.length) return;
  
  fetch('../电子书/ebooks.json').then(function(r){return r.json()}).then(function(ebooks){
    var matched = [];
    ebooks.forEach(function(eb){
      var ebkw = (eb.kw||[]).map(function(k){return k.toLowerCase()});
      var match = keywords.some(function(kw){
        return ebkw.some(function(ek){return ek.indexOf(kw)>=0 || kw.indexOf(ek)>=0});
      });
      if(match) matched.push(eb);
    });
    
    if(!matched.length) return;
    
    var html = '<h2 style="margin-top:36px;padding-bottom:8px;border-bottom:2px solid #c9a959;color:#2e7d32">📚 延伸阅读 · 电子书</h2>';
    html += '<p style="color:#888;font-size:.85rem;margin:8px 0 12px">点击即可在线全文阅读：</p>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px">';
    matched.forEach(function(eb){
      html += '<a href="../电子书/reader.html?file='+encodeURIComponent(eb.file)+'" style="display:block;padding:10px 14px;background:#f0f8f0;border:1px solid #d4e8d4;border-radius:8px;text-decoration:none;color:#2e7d32;font-size:.85rem;transition:.15s" onmouseover="this.style.background=\'#e0f0e0\'" onmouseout="this.style.background=\'#f0f8f0\'">📖 '+eb.name+'</a>';
    });
    html += '</div>';
    
    kwDiv.innerHTML = html;
  }).catch(function(e){console.log('ebooks.json not loaded:', e)});
})();
