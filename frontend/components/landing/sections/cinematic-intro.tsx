'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
// @ts-ignore
import * as random from 'maath/random/dist/maath-random.esm';
import { Scene1 } from './scene-1';
import { Scene2 } from './scene-2';
import { useState } from 'react';
import { useFrame } from '@react-three/fiber';

gsap.registerPlugin(ScrollTrigger);

function Particles(props: any) {
  const ref = useRef<any>();
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 10 }));
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#ffffff" size={0.02} sizeAttenuation={true} depthWrite={false} opacity={0.3} />
      </Points>
    </group>
  );
}

export function CinematicIntro() {
  const containerRef = useRef<HTMLElement>(null);
  const scene1Ref = useRef<HTMLDivElement>(null);
  const scene2Ref = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Set initial states explicitly to guarantee stability on refresh
      gsap.set(scene1Ref.current, {
        opacity: 1,
        scale: 1,
        z: 0,
        zIndex: 2,
        pointerEvents: 'auto',
      });
      gsap.set(scene2Ref.current, {
        opacity: 0,
        scale: 0.2,
        z: 1200,
        zIndex: 1,
        pointerEvents: 'none',
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=1800',
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          snap: {
            snapTo: [0, 1],
            duration: { min: 0.25, max: 0.7 },
            ease: "power2.inOut"
          },
          onUpdate: (self) => {
            if (scene1Ref.current && scene2Ref.current) {
              if (self.progress > 0.4) {
                scene1Ref.current.style.pointerEvents = 'none';
                scene2Ref.current.style.pointerEvents = 'auto';
                scene2Ref.current.style.zIndex = '3';
                scene1Ref.current.style.zIndex = '1';
              } else {
                scene1Ref.current.style.pointerEvents = 'auto';
                scene2Ref.current.style.pointerEvents = 'none';
                scene1Ref.current.style.zIndex = '2';
                scene2Ref.current.style.zIndex = '1';
              }
            }
          }
        }
      });

      if (isReduced) {
        // Simple crossfade
        tl.to(scene1Ref.current, { opacity: 0, ease: 'none' }, 0);
        tl.fromTo(scene2Ref.current, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0);
      } else {
        // True 3D zoom transition
        tl.to(scene1Ref.current, {
          scale: 0.35,
          z: -800,
          opacity: 0,
          ease: 'power1.inOut'
        }, 0);

        tl.fromTo(scene2Ref.current, 
          { scale: 0.2, z: 1200, opacity: 0 },
          { scale: 1, z: 0, opacity: 1, ease: 'power1.inOut' },
          0
        );

        // Fly the camera through the particles
        tl.to(canvasWrapperRef.current, {
          scale: 3,
          opacity: 0,
          ease: 'power2.in'
        }, 0.3); // Fade out WebGL as Scene 2 takes over
        
        // Scene 2 Arrival staggered animation
        tl.from('.landing-flow-node', {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          ease: 'power2.out',
          duration: 0.5
        }, 0.8);
      }

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="docs" ref={containerRef} className="landing-cinematic-container">
      <div ref={canvasWrapperRef} className="landing-cinematic-webgl">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Particles />
        </Canvas>
      </div>

      <div className="landing-cinematic-perspective">
        <div ref={scene1Ref} className="landing-scene-layer landing-scene-1">
          <Scene1 />
        </div>
        
        <div
          ref={scene2Ref}
          className="landing-scene-layer landing-scene-2"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <Scene2 />
        </div>
      </div>
    </section>
  );
}
