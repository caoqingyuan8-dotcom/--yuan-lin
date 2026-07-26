// Global switchTab for ebook index page (standalone tab-bar + tab-content)
window.switchTab = function(cat){
  document.querySelectorAll('.tab-btn').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('onclick')?.includes("'"+cat+"'"));
  });
  document.querySelectorAll('.tab-content').forEach(function(c){
    c.classList.toggle('active', c.id === 'tab-'+cat);
  });
};

(function(){
  // Auto-init all tab systems
  document.querySelectorAll('.course-tabs').forEach(function(tabs){
    var nav = tabs.querySelector('.tab-nav');
    var panels = tabs.querySelectorAll('.tab-panel');
    var btns = nav.querySelectorAll('.tab-btn');
    if(!btns.length || !panels.length) return;

    function activate(idx){
      btns.forEach(function(b,i){
        b.classList.toggle('active', i===idx);
      });
      panels.forEach(function(p,i){
        p.classList.toggle('active', i===idx);
      });
      // Save to URL hash
      if(btns[idx]){
        var slug = btns[idx].getAttribute('data-tab') || '';
        if(slug) history.replaceState(null, '', '#' + slug);
      }
    }

    btns.forEach(function(btn,i){
      btn.addEventListener('click', function(e){
        activate(i);
      });
    });

    // Restore from hash on load
    var hash = location.hash.replace('#','');
    if(hash){
      var found = -1;
      btns.forEach(function(b,i){
        if(b.getAttribute('data-tab') === hash) found = i;
      });
      if(found >= 0) activate(found);
      else activate(0);
    } else {
      activate(0);
    }
  });
})();