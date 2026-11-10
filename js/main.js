(function(){
  var d=document, root=d.documentElement; root.classList.add('js');
  var C=window.NHATRAM||{};
  var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var zaloUrl=C.zalo?('https://zalo.me/'+String(C.zalo).replace(/\D/g,'')):'';

  /* liên hệ */
  d.querySelectorAll('[data-zalo]').forEach(function(a){
    if(zaloUrl){a.href=zaloUrl;a.target='_blank';a.rel='noopener';}
    else{a.href=(a.getAttribute('data-fallback')||'lien-he.html')+'#soan-tin';}
  });
  d.querySelectorAll('[data-messenger]').forEach(function(a){
    if(C.messenger){a.href='https://m.me/'+C.messenger;a.target='_blank';a.rel='noopener';}
    else{var li=a.closest('li');if(li)li.hidden=true;else a.hidden=true;}
  });
  d.querySelectorAll('[data-phone]').forEach(function(a){
    if(C.phone){a.href='tel:'+C.phone.replace(/\s/g,'');a.textContent=C.phone;}else{var li=a.closest('li');if(li)li.hidden=true;}
  });
  d.querySelectorAll('[data-email]').forEach(function(a){
    if(C.email){a.href='mailto:'+C.email;a.textContent=C.email;}else{var li=a.closest('li');if(li)li.hidden=true;}
  });

  /* menu */
  var mb=d.querySelector('.menu-btn'), nav=d.getElementById('nav');
  if(nav){nav.querySelectorAll('a').forEach(function(a,i){a.style.setProperty('--i',i);});}
  function closeMenu(){if(!nav)return;nav.classList.remove('open');mb.setAttribute('aria-expanded','false');}
  if(mb&&nav){
    mb.addEventListener('click',function(){var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o);});
    nav.addEventListener('click',function(e){if(e.target.closest('a'))closeMenu();});
    d.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();mb.focus();}});
  }

  /* header: bóng khi cuộn và thanh tiến độ */
  var hd=d.querySelector('.site-header'), tick=false;
  function onScroll(){
    tick=false;
    var y=window.scrollY, h=root.scrollHeight-window.innerHeight;
    if(hd){hd.classList.toggle('scrolled',y>8);hd.style.setProperty('--p',h>0?Math.min(1,y/h).toFixed(4):0);}
  }
  window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(onScroll);}},{passive:true});
  onScroll();

  /* tách từ cho tiêu đề (chỉ khi cho phép chuyển động) */
  function splitWords(el){
    var i=0;
    (function walk(node){
      Array.prototype.slice.call(node.childNodes).forEach(function(n){
        if(n.nodeType===3){
          var parts=n.nodeValue.split(/(\s+)/), frag=d.createDocumentFragment();
          parts.forEach(function(p){
            if(!p)return;
            if(/^\s+$/.test(p)){frag.appendChild(d.createTextNode(' '));return;}
            var w=d.createElement('span');w.className='w';
            var s=d.createElement('span');s.textContent=p;s.style.setProperty('--i',i++);
            w.appendChild(s);frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag,n);
        }else if(n.nodeType===1){walk(n);}
      });
    })(el);
    el.setAttribute('aria-label',el.textContent.replace(/\s+/g,' ').trim());
    el.querySelectorAll('.w').forEach(function(w){w.setAttribute('aria-hidden','true');});
  }
  if(!calm){d.querySelectorAll('.hero h1,.page-head h1').forEach(splitWords);}

  /* xuất hiện khi cuộn */
  d.querySelectorAll('.rows,.steps,.ticks,.principles,.channels,.soon,dl.facts').forEach(function(el){
    el.classList.remove('reveal');el.classList.add('stagger');
    Array.prototype.forEach.call(el.children,function(c,i){c.style.setProperty('--i',i);});
  });
  var targets=d.querySelectorAll('.reveal,.stagger,.panels,.frame,.draw-on');
  if('IntersectionObserver' in window&&!calm){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target._for||e.target).classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -10% 0px',threshold:.05});
    targets.forEach(function(el){
      /* ảnh bị cắt bằng clip-path nên quan sát phần tử cha */
      if(el.classList.contains('frame')&&el.parentElement){var pr=el.parentElement;pr._for=el;io.observe(pr);}
      else io.observe(el);
    });
  }else{targets.forEach(function(el){el.classList.add('in');});}

  /* dừng vòng lặp khi ra khỏi màn hình */
  ['.hero','.band'].forEach(function(sel){
    var el=d.querySelector(sel); if(!el||!('IntersectionObserver' in window))return;
    new IntersectionObserver(function(es){es.forEach(function(e){el.classList.toggle('paused',!e.isIntersecting);});}).observe(el);
  });

  /* con dấu: hai vòng tròn áp lại khi con trỏ đến gần */
  var hero=d.querySelector('.hero'), stamp=d.querySelector('.stamp');
  if(hero&&stamp&&!calm&&window.matchMedia('(pointer:fine)').matches){
    var raf=0,px=0,py=0;
    hero.addEventListener('pointermove',function(e){px=e.clientX;py=e.clientY;if(!raf)raf=requestAnimationFrame(function(){
      raf=0;var r=stamp.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
      var dx=(px-cx)/r.width,dy=(py-cy)/r.height,dist=Math.sqrt(dx*dx+dy*dy);
      stamp.style.setProperty('--n',Math.max(0,1-dist/1.1).toFixed(3));
      stamp.style.setProperty('--tx',Math.max(-1,Math.min(1,dx)).toFixed(3));
      stamp.style.setProperty('--ty',Math.max(-1,Math.min(1,dy)).toFixed(3));
    });});
    hero.addEventListener('pointerleave',function(){stamp.style.setProperty('--n',0);stamp.style.setProperty('--tx',0);stamp.style.setProperty('--ty',0);});
  }

  var y=d.getElementById('year'); if(y)y.textContent=new Date().getFullYear();

  /* thư viện ảnh: lọc có chuyển động, giữ trạng thái trên đường dẫn */
  var fb=d.querySelectorAll('.filters button');
  if(fb.length){
    var figs=d.querySelectorAll('.gallery figure');
    function apply(k,animate){
      fb.forEach(function(x){x.setAttribute('aria-pressed',String(x.getAttribute('data-f')===k));});
      var n=0;
      figs.forEach(function(f){
        var show=(k==='all'||f.getAttribute('data-c')===k);
        if(!animate||calm){f.hidden=!show;return;}
        if(show){
          f.hidden=false;f.classList.remove('out','pop');void f.offsetWidth;
          f.style.setProperty('--d',(n++*55)+'ms');f.classList.add('pop');
        }else if(!f.hidden){
          f.classList.remove('pop');f.classList.add('out');
          setTimeout(function(){if(f.classList.contains('out'))f.hidden=true;},220);
        }
      });
    }
    fb.forEach(function(b){b.addEventListener('click',function(){
      var k=b.getAttribute('data-f');apply(k,true);
      try{history.replaceState(null,'',k==='all'?location.pathname:'#'+k);}catch(e){}
    });});
    var h=location.hash.replace('#','');
    if(h&&d.querySelector('.filters [data-f="'+h+'"]'))apply(h,false);

    var lb=d.getElementById('lb');
    if(lb&&lb.showModal){
      figs.forEach(function(f){
        f.addEventListener('click',function(){
          var img=f.querySelector('img'); if(!img)return;
          lb.querySelector('img').src=img.src; lb.querySelector('img').alt=img.alt;
          lb.querySelector('p').textContent=f.querySelector('figcaption').textContent; lb.showModal();
        });
      });
      lb.addEventListener('click',function(e){if(e.target===lb||e.target.tagName==='BUTTON')lb.close();});
    }
  }

  /* soạn tin nhắn */
  var f=d.querySelector('form.compose');
  if(f){
    var out=d.getElementById('result'), pre=out.querySelector('pre');
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var v=function(n){var el=f.elements[n];return el&&el.value.trim();};
      var lines=['Xin chào Nhã Trạm,'];
      if(f.dataset.kind==='corp'){
        lines.push('Mình muốn đặt quà tặng doanh nghiệp.');
        if(v('company'))lines.push('Công ty: '+v('company'));
        if(v('qty'))lines.push('Số lượng dự kiến: '+v('qty'));
        if(v('occasion'))lines.push('Dịp tặng: '+v('occasion'));
        if(v('date'))lines.push('Cần nhận quà trước: '+v('date'));
      }else{
        lines.push('Mình muốn đặt quà.');
        if(v('product'))lines.push('Sản phẩm quan tâm: '+v('product'));
        if(v('qty'))lines.push('Số lượng: '+v('qty'));
      }
      if(v('note'))lines.push('Lời nhắn: '+v('note'));
      lines.push('Tên: '+v('name'));
      if(v('contact'))lines.push('Liên hệ: '+v('contact'));
      pre.textContent=lines.join('\n');
      out.classList.remove('show');void out.offsetWidth;out.classList.add('show');
      out.scrollIntoView({behavior:calm?'auto':'smooth',block:'nearest'});
      var z=out.querySelector('[data-zalo]'); if(z&&zaloUrl){z.hidden=false;}
    });
    var cp=d.getElementById('copy');
    if(cp)cp.addEventListener('click',function(){
      var t=pre.textContent;
      (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){cp.textContent='Đã sao chép';},function(){var r=d.createRange();r.selectNodeContents(pre);var s=getSelection();s.removeAllRanges();s.addRange(r);cp.textContent='Hãy nhấn Ctrl+C';});
    });
  }
})();
