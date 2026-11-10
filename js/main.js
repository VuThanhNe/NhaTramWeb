(function(){
  var d=document, root=d.documentElement; root.classList.add('js');
  var C=window.NHATRAM||{};
  var zaloUrl=C.zalo?('https://zalo.me/'+String(C.zalo).replace(/\D/g,'')):'';
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

  var mb=d.querySelector('.menu-btn'), nav=d.getElementById('nav');
  if(mb&&nav){
    mb.addEventListener('click',function(){
      var o=nav.classList.toggle('open'); mb.setAttribute('aria-expanded',o);
    });
    nav.addEventListener('click',function(e){if(e.target.closest('a')){nav.classList.remove('open');mb.setAttribute('aria-expanded','false');}});
    d.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');mb.setAttribute('aria-expanded','false');mb.focus();}});
  }

  var rv=d.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px'});
    rv.forEach(function(el){io.observe(el);});
  }else{rv.forEach(function(el){el.classList.add('in');});}

  var y=d.getElementById('year'); if(y)y.textContent=new Date().getFullYear();

  /* gallery */
  var fb=d.querySelectorAll('.filters button');
  if(fb.length){
    fb.forEach(function(b){b.addEventListener('click',function(){
      fb.forEach(function(x){x.setAttribute('aria-pressed','false');});
      b.setAttribute('aria-pressed','true');
      var k=b.getAttribute('data-f');
      d.querySelectorAll('.gallery figure').forEach(function(f){f.hidden=!(k==='all'||f.getAttribute('data-c')===k);});
    });});
    var lb=d.getElementById('lb');
    if(lb&&lb.showModal){
      d.querySelectorAll('.gallery figure').forEach(function(f){
        f.addEventListener('click',function(){
          var img=f.querySelector('img'); if(!img)return;
          lb.querySelector('img').src=img.src; lb.querySelector('img').alt=img.alt;
          lb.querySelector('p').textContent=f.querySelector('figcaption').textContent; lb.showModal();
        });
      });
      lb.addEventListener('click',function(e){if(e.target===lb||e.target.tagName==='BUTTON')lb.close();});
    }
  }

  /* compose message */
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
      out.classList.add('show'); out.scrollIntoView({behavior:'smooth',block:'nearest'});
      var z=out.querySelector('[data-zalo]'); if(z&&zaloUrl){z.hidden=false;}
    });
    var cp=d.getElementById('copy');
    if(cp)cp.addEventListener('click',function(){
      var t=pre.textContent;
      (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){cp.textContent='Đã sao chép';},function(){var r=d.createRange();r.selectNodeContents(pre);var s=getSelection();s.removeAllRanges();s.addRange(r);cp.textContent='Hãy nhấn Ctrl+C';});
    });
  }
})();
