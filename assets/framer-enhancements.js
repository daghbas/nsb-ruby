(()=>{
  const q=(s,c=document)=>c.querySelector(s);
  const qa=(s,c=document)=>[...c.querySelectorAll(s)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  const progress=document.createElement('div');
  progress.className='motion-progress';
  progress.setAttribute('aria-hidden','true');
  progress.innerHTML='<i></i>';
  document.body.appendChild(progress);
  const progressBar=q('i',progress);
  const updateProgress=()=>{
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    progressBar.style.transform=`scaleY(${Math.min(1,Math.max(0,scrollY/max))})`;
  };
  addEventListener('scroll',updateProgress,{passive:true});
  addEventListener('resize',updateProgress,{passive:true});
  updateProgress();

  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add('motion-visible');
    observer.unobserve(entry.target);
  }),{threshold:.14,rootMargin:'0px 0px -7%'});

  qa('.centered-head').forEach(head=>{
    head.classList.add('motion-heading');
    if(reduced)head.classList.add('motion-visible'); else observer.observe(head);
  });

  qa('.metrics article').forEach((item,index)=>{
    item.dataset.seq=String(index+1).padStart(2,'0');
    item.classList.add('motion-item');
    item.style.transitionDelay=`${Math.min(index%5,4)*55}ms`;
    if(reduced)item.classList.add('motion-visible'); else observer.observe(item);
  });

  qa('.project-card').forEach((card,index)=>{
    card.style.transitionDelay=`${Math.min(index%3,2)*75}ms`;
    if(reduced)card.classList.add('motion-visible'); else observer.observe(card);
  });

  const format=new Intl.NumberFormat('en-US');
  const counters=qa('.reach-highlight strong,.metrics strong');
  const counterData=counters.map(el=>{
    const raw=el.textContent.trim().replace(/\s+/g,'');
    const match=raw.match(/^([^0-9]*)([\d,]+)(.*)$/);
    if(!match)return null;
    return {el,prefix:match[1],target:Number(match[2].replace(/,/g,'')),suffix:match[3]};
  }).filter(Boolean);
  let countersRan=false;
  const renderCounter=(item,value)=>{
    const suffix=item.suffix?`<span class="counter-suffix">${item.suffix}</span>`:'';
    item.el.innerHTML=`${item.prefix}${format.format(value)}${suffix}`;
  };
  const runCounters=()=>{
    if(countersRan)return;
    countersRan=true;
    if(reduced){counterData.forEach(item=>renderCounter(item,item.target));return;}
    const start=performance.now();
    const duration=1550;
    const tick=now=>{
      const p=Math.min(1,(now-start)/duration);
      const eased=1-Math.pow(1-p,4);
      counterData.forEach(item=>renderCounter(item,Math.round(item.target*eased)));
      if(p<1)requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const reach=q('.reach');
  if(reach){
    const counterObserver=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){
        runCounters();
        counterObserver.disconnect();
      }
    },{threshold:.22});
    counterObserver.observe(reach);
  }

  const navLinks=qa('.nav a[href^="#"],.mobile-nav a[href^="#"]');
  const sections=navLinks.map(link=>q(link.getAttribute('href'))).filter(Boolean);
  if(sections.length){
    const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      navLinks.forEach(link=>{
        const active=link.getAttribute('href')===`#${entry.target.id}`;
        link.classList.toggle('active',active);
        if(active)link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
      });
    }),{rootMargin:'-38% 0px -54%',threshold:0});
    sections.forEach(section=>navObserver.observe(section));
  }

  if(!reduced&&matchMedia('(pointer:fine)').matches){
    qa('.project-card').forEach(card=>{
      const image=q('img',card);
      card.addEventListener('pointermove',event=>{
        const rect=card.getBoundingClientRect();
        const x=(event.clientX-rect.left)/rect.width-.5;
        const y=(event.clientY-rect.top)/rect.height-.5;
        image.style.transform=`translate3d(${x*7}px,${y*7}px,0) scale(1.065)`;
      });
      card.addEventListener('pointerleave',()=>{image.style.transform='';});
    });
  }
})();
