// Image viewer with auto-play slideshow
(function(){
  var timer = null;
  var index = -1;
  var images = [];
  var speed = 3000; // ms

  function collectImages(){
    images = [];
    document.querySelectorAll('#g img').forEach(function(img){
      images.push(img.getAttribute('src'));
    });
  }

  function showImage(idx){
    if(idx < 0 || idx >= images.length) return;
    index = idx;
    var v = document.getElementById('v');
    var vi = document.getElementById('vi');
    if(vi) vi.src = images[idx];
    if(v) v.classList.add('on');

    // Show toolbar when overlay opens
    var tb = document.getElementById('v-toolbar');
    if(tb) tb.style.display = 'flex';
  }

  // Override the global openViewer
  window.openViewer = function(src){
    collectImages();
    var idx = images.indexOf(src);
    if(idx < 0) idx = 0;
    showImage(idx);
    startAutoPlay();
  };

  function nextImage(){
    if(images.length === 0) return;
    var next = (index + 1) % images.length;
    showImage(next);
  }

  function prevImage(){
    if(images.length === 0) return;
    var prev = (index - 1 + images.length) % images.length;
    showImage(prev);
  }

  function startAutoPlay(){
    stopAutoPlay();
    timer = setInterval(nextImage, speed);
  }

  function stopAutoPlay(){
    if(timer){ clearInterval(timer); timer = null; }
  }

  function toggleAutoPlay(){
    if(timer){ stopAutoPlay(); }
    else{ startAutoPlay(); }
    updatePlayBtn();
  }

  function updatePlayBtn(){
    var btn = document.getElementById('v-play');
    if(!btn) return;
    btn.textContent = timer ? '⏸' : '▶';
  }

  // Build toolbar
  function buildToolbar(){
    var v = document.getElementById('v');
    if(!v || document.getElementById('v-toolbar')) return;

    var tb = document.createElement('div');
    tb.id = 'v-toolbar';
    tb.style.cssText = 'position:absolute;bottom:30px;left:50%;transform:translateX(-50%);display:none;gap:12px;z-index:1001;background:rgba(0,0,0,.6);padding:10px 20px;border-radius:30px;align-items:center';

    var prevBtn = document.createElement('button');
    prevBtn.textContent = '◀';
    prevBtn.onclick = function(e){ e.stopPropagation(); stopAutoPlay(); prevImage(); };
    prevBtn.style.cssText = 'background:none;border:none;color:#fff;font-size:22px;cursor:pointer;padding:4px 10px';

    var playBtn = document.createElement('button');
    playBtn.id = 'v-play';
    playBtn.textContent = '⏸';
    playBtn.onclick = function(e){ e.stopPropagation(); toggleAutoPlay(); };
    playBtn.style.cssText = 'background:none;border:none;color:#fff;font-size:22px;cursor:pointer;padding:4px 10px';

    var nextBtn = document.createElement('button');
    nextBtn.textContent = '▶';
    nextBtn.onclick = function(e){ e.stopPropagation(); stopAutoPlay(); nextImage(); };
    nextBtn.style.cssText = 'background:none;border:none;color:#fff;font-size:22px;cursor:pointer;padding:4px 10px';

    // Index counter
    var counter = document.createElement('span');
    counter.id = 'v-counter';
    counter.style.cssText = 'color:#fff;font-size:13px;min-width:60px;text-align:center';

    // Speed slider
    var speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.min = 1000;
    speedSlider.max = 8000;
    speedSlider.step = 500;
    speedSlider.value = speed;
    speedSlider.style.cssText = 'width:80px;cursor:pointer';
    speedSlider.oninput = function(e){
      e.stopPropagation();
      speed = parseInt(this.value);
      if(timer){ stopAutoPlay(); startAutoPlay(); }
    };

    tb.appendChild(prevBtn);
    tb.appendChild(playBtn);
    tb.appendChild(nextBtn);
    tb.appendChild(counter);
    tb.appendChild(speedSlider);
    v.appendChild(tb);

    // Update counter on each show
    var origShow = showImage;
    showImage = function(idx){
      origShow(idx);
      var c = document.getElementById('v-counter');
      if(c) c.textContent = (index+1) + ' / ' + images.length;
    };
  }

  // Keyboard navigation
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      stopAutoPlay();
      document.getElementById('v').classList.remove('on');
      var tb = document.getElementById('v-toolbar');
      if(tb) tb.style.display = 'none';
    }
    if(e.key === 'ArrowRight'){ stopAutoPlay(); nextImage(); }
    if(e.key === 'ArrowLeft'){ stopAutoPlay(); prevImage(); }
    if(e.key === ' '){ e.preventDefault(); toggleAutoPlay(); }
  });

  // Init after DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', buildToolbar);
  } else {
    buildToolbar();
  }
})();
