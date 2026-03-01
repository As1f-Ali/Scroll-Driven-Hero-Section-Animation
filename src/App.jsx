import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const carRef = useRef(null);
  const revealTextRef = useRef(null);
  const textContentRef = useRef(null); 
  const boxRefs = useRef([]);

  const welcomeText = "WELCOME ITZFIZZ";
  
  const stats = [
    { id: 1, num: '58%', text: 'Increase in use', color: 'bg-[#def54f]', pos: 'top-[5%] right-[35%]' },
    { id: 2, num: '23%', text: 'Call reduction', color: 'bg-[#6ac9ff]', pos: 'bottom-[5%] right-[35%]' },
    { id: 3, num: '27%', text: 'Efficiency', color: 'bg-[#333] text-white', pos: 'top-[5%] right-[10%]' },
    { id: 4, num: '40%', text: 'Satisfaction', color: 'bg-[#fa7328]', pos: 'bottom-[5%] right-[10%]' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const car = carRef.current;
      const revealText = revealTextRef.current;
      const textContent = textContentRef.current;

      // 1. INITIAL LOAD (Headline Only - Requirement #2)
      gsap.from(textContent, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power2.out"
      });
      
      // 2. SCROLL TIMELINE
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          pin: trackRef.current,
          invalidateOnRefresh: true,
        }
      });

      tl.to(car, {
        x: () => {
          const textRect = textContent.getBoundingClientRect();
          const trackRect = trackRef.current.getBoundingClientRect();
          const textEndPos = (textRect.left - trackRect.left) + textRect.width;
          return textEndPos - (car.offsetWidth * 0.2); 
        },
        ease: "none"
      }, 0);

      tl.to(revealText, {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none"
      }, 0);

      // 3. STATS REVEAL (Controlled strictly by scroll)
      [0, 1].forEach((i) => {
        gsap.to(boxRefs.current[i], {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top+=300 top",
            end: "top+=600 top",
            scrub: true,
          },
          opacity: 1,
          scale: 1,
        });
      });

      [2, 3].forEach((i) => {
        gsap.to(boxRefs.current[i], {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top+=700 top",
            end: "top+=1000 top",
            scrub: true,
          },
          opacity: 1,
          scale: 1,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative h-[250vh] bg-[#121212]">
      <div ref={trackRef} className="sticky top-0 h-screen w-full flex items-center justify-center bg-[#d1d1d1] overflow-hidden">
        
        {/* Road Strip */}
        <div className="relative w-full h-[200px] bg-[#1e1e1e] flex items-center overflow-hidden shadow-2xl">
          
          <div 
            ref={revealTextRef}
            className="absolute left-[8%] z-10 whitespace-nowrap"
            style={{ clipPath: 'inset(0% 100% 0% 0%)' }} 
          >
            {/* Space utilization: Using clamp to ensure text fits screen */}
            <h1 
              ref={textContentRef} 
              className="text-[clamp(4rem,10vw,7.5rem)] font-black text-white leading-none uppercase select-none tracking-tighter inline-block"
            >
              {welcomeText}
            </h1>
          </div>

          <div ref={carRef} className="absolute left-0 z-20 h-full flex items-center px-4">
            <img 
              src="car.png" 
              alt="car" 
              className="h-[170px] w-auto drop-shadow-[20px_0_25px_rgba(0,0,0,0.8)]"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Stats Boxes */}
        {stats.map((stat, i) => (
          <div
            key={stat.id}
            ref={(el) => (boxRefs.current[i] = el)}
            className={`
              absolute z-30 flex flex-col items-center justify-center text-center 
              p-4 rounded-lg opacity-0 scale-90 transition-all shadow-lg
              ${stat.color} ${stat.pos} w-[240px] h-[130px]
            `}
          >
            <span className="text-4xl font-black leading-none mb-1 tracking-tighter text-[#111]">
              {stat.num}
            </span>
            <span className="text-[11px] uppercase tracking-wider font-bold opacity-90 leading-tight text-[#111]">
              {stat.text}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
};

export default App;
