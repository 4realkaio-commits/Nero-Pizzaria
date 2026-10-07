"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 192;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function range(value: number, start: number, end: number) {
  return clamp((value - start) / (end - start));
}

function MenuSlide({
  visible,
  exit,
  number,
  name,
  description,
  price,
  side,
}: {
  visible: number;
  exit: number;
  number: string;
  name: string;
  description: string;
  price: string;
  side: "left" | "right";
}) {
  const opacity = visible * (1 - exit);

  const movement =
    side === "left"
      ? 40 - visible * 40
      : -40 + visible * 40;

  return (
    <div
      className="absolute inset-0 flex items-center px-7 md:px-16"
      style={{
        opacity,
        transform: `translateX(${movement}px)`,
      }}
    >
      <div
        className={`w-full ${
          side === "right" ? "text-right" : "text-left"
        }`}
      >
        <div
          className={`mx-auto max-w-6xl ${
            side === "right" ? "flex justify-end" : ""
          }`}
        >
          <div className="max-w-4xl">
            <p className="mb-5 text-[9px] uppercase tracking-[0.55em] text-orange-400">
              {number} — Menu
            </p>

            <h2 className="text-[13vw] font-semibold leading-[0.78] tracking-[-0.09em] md:text-[9vw]">
              {name}
            </h2>

            <div
              className={`mt-8 flex items-center gap-6 ${
                side === "right"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <p className="max-w-sm text-xs leading-6 text-white/45">
                {description}
              </p>

              <span className="text-sm text-white/70">
                {price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const cinematicRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const menuFireRef = useRef<HTMLVideoElement | null>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const mobileFireStartedRef = useRef(false);
  const mobileVideoUnlockedRef = useRef(false);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const image = new Image();

      image.src = `/frames/fire/frame-${String(i).padStart(
        4,
        "0"
      )}.jpg`;

      images.push(image);
    }

    imagesRef.current = images;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawFrame = (frameIndex: number) => {
      const image = imagesRef.current[frameIndex];

      if (!image || !image.complete) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      context.fillStyle = "#000";
      context.fillRect(0, 0, width, height);

      const imageRatio = image.width / image.height;
      const canvasRatio = width / height;

      let drawWidth = width;
      let drawHeight = height;

      if (imageRatio > canvasRatio) {
        drawHeight = height;
        drawWidth = height * imageRatio;
      } else {
        drawWidth = width;
        drawHeight = width / imageRatio;
      }

      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;

      context.drawImage(
        image,
        x,
        y,
        drawWidth,
        drawHeight
      );
    };

    const animate = () => {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;

      const next =
        current + (target - current) * 0.12;

      currentFrameRef.current = next;

      drawFrame(Math.round(next));

      animationFrameRef.current =
        requestAnimationFrame(animate);
    };

    resizeCanvas();

    if (images[0]) {
      images[0].onload = () => drawFrame(0);
    }

    animationFrameRef.current =
      requestAnimationFrame(animate);

    const handleResize = () => {
      resizeCanvas();
      drawFrame(Math.round(currentFrameRef.current));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const video = menuFireRef.current;

    if (!video) return;

    const unlockMobileVideo = () => {
      if (mobileVideoUnlockedRef.current) return;

      mobileVideoUnlockedRef.current = true;
      video.muted = true;

      // Usa o primeiro toque real do usuário para liberar o playback.
      // O vídeo pode ficar tocando enquanto o usuário ainda está no começo;
      // quando a transição chegar, o scroll reinicia o vídeo do zero.
      video.play().catch(() => {});
    };

    window.addEventListener("touchstart", unlockMobileVideo, {
      passive: true,
    });

    window.addEventListener("pointerdown", unlockMobileVideo, {
      passive: true,
    });

    return () => {
      window.removeEventListener("touchstart", unlockMobileVideo);
      window.removeEventListener("pointerdown", unlockMobileVideo);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const section = cinematicRef.current;

      if (!section) return;

      const rect = section.getBoundingClientRect();

      const scrollable =
        section.offsetHeight - window.innerHeight;

      const value = clamp(-rect.top / scrollable);

      setProgress(value);

      /*
       * O primeiro fogo ocupa o começo da experiência.
       */
      const fireProgress = range(
        value,
        0,
        0.70
      );

      targetFrameRef.current =
        fireProgress * (TOTAL_FRAMES - 1);

      /*
       * Transição do fogo para o menu.
       */
      const transitionProgress = range(
        value,
        0.64,
        0.82
      );

      const video = menuFireRef.current;

      if (!video) return;

      /*
       * MOBILE
       *
       * No celular não controlamos currentTime
       * a cada scroll, porque alguns navegadores
       * mobile bloqueiam esse comportamento.
       *
       * O vídeo começa quando chegamos na transição
       * e toca normalmente.
       */
      const isMobile = window.matchMedia(
        "(max-width: 767px)"
      ).matches;

      if (isMobile) {
        if (value < 0.58) {
          mobileFireStartedRef.current = false;

          video.pause();
          video.currentTime = 0;

          return;
        }

        if (
          value >= 0.60 &&
          !mobileFireStartedRef.current
        ) {
          mobileFireStartedRef.current = true;

          video.currentTime = 0;
          video.play().catch(() => {});
        }

        return;
      }

      /*
       * DESKTOP
       *
       * Continua sincronizado com o scroll.
       */
      if (video.duration) {
        const maxTime = Math.max(
          video.duration - 0.05,
          0
        );

        video.currentTime =
          transitionProgress * maxTime;
      }
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);


  const scrollToMenu = () => {
    const section = cinematicRef.current;

    if (!section) return;

    const target =
      section.offsetTop +
      section.offsetHeight * 0.78;

    window.scrollTo({
      top: target,
      behavior: "smooth",
    });
  };

  /*
   * =========================
   * INTRO
   * =========================
   */

  const phrase01 = range(
    progress,
    0.02,
    0.12
  );

  const phrase02 = range(
    progress,
    0.16,
    0.27
  );

  const phrase03 = range(
    progress,
    0.32,
    0.43
  );

  const phrase04 = range(
    progress,
    0.48,
    0.60
  );

  /*
   * =========================
   * TRANSIÇÃO
   * =========================
   */

  const transitionIn = range(
    progress,
    0.60,
    0.68
  );

  const transitionOut = range(
    progress,
    0.76,
    0.84
  );

  const fireOpacity =
    transitionIn * (1 - transitionOut);

  const fireScale =
    1 + transitionIn * 0.08;

  /*
   * =========================
   * MENU
   * =========================
   */

  const menuIntro = range(
    progress,
    0.79,
    0.88
  );

  const pizza01 = range(
    progress,
    0.86,
    0.91
  );

  const pizza02 = range(
    progress,
    0.91,
    0.945
  );

  const pizza03 = range(
    progress,
    0.945,
    0.97
  );

  const pizza04 = range(
    progress,
    0.97,
    0.992
  );

  return (
    <main className="bg-black text-white">
      {/* HEADER */}

      <header className="fixed left-0 top-0 z-[100] flex w-full items-center justify-between px-6 py-6 mix-blend-difference md:px-10">
        <div className="text-xs font-semibold tracking-[0.45em]">
          NERO
        </div>

        <button
          type="button"
          onClick={scrollToMenu}
          className="text-[10px] uppercase tracking-[0.35em] text-white/70 transition hover:text-white"
        >
          Menu
        </button>
      </header>

      {/* ================================================= */}
      {/* UMA ÚNICA EXPERIÊNCIA CINEMÁTICA */}
      {/* ================================================= */}

      <section
        ref={cinematicRef}
        className="relative h-[1000vh] bg-black"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* ============================================= */}
          {/* FOGO PRINCIPAL */}
          {/* ============================================= */}

          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 h-full w-full"
            style={{
              opacity:
                1 -
                range(
                  progress,
                  0.58,
                  0.70
                ),
            }}
          />

          {/* ============================================= */}
          {/* TEXTOS DO PRIMEIRO FOGO */}
          {/* ============================================= */}

          <div
            className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center"
            style={{
              opacity:
                1 -
                range(
                  progress,
                  0.57,
                  0.68
                ),
            }}
          >
            {/* FRASE 01 */}

            <div
              className="absolute left-0 w-full px-7 text-left md:px-16"
              style={{
                opacity:
                  phrase01 *
                  (1 - phrase02),

                transform: `translateX(${
                  -120 + phrase01 * 120
                }px)`,
              }}
            >
              <div className="max-w-5xl">
                <p className="text-[11px] uppercase tracking-[0.65em] text-white/50">
                  NERO PIZZERIA
                </p>

                <h1 className="mt-7 text-[13vw] font-semibold leading-[0.78] tracking-[-0.09em] md:text-[9vw]">
                  FEITO
                  <br />
                  NO FOGO.
                </h1>
              </div>
            </div>

            {/* FRASE 02 */}

            <div
              className="absolute right-0 w-full px-7 text-right md:px-16"
              style={{
                opacity:
                  phrase02 *
                  (1 - phrase03),

                transform: `translateX(${
                  120 - phrase02 * 120
                }px)`,
              }}
            >
              <div className="ml-auto max-w-4xl">
                <h2 className="text-[11vw] font-semibold leading-[0.8] tracking-[-0.08em] md:text-[8vw]">
                  CALOR.
                  <br />
                  TEMPO.
                  <br />
                  SABOR.
                </h2>
              </div>
            </div>

            {/* FRASE 03 */}

            <div
              className="absolute left-0 w-full px-7 text-left md:px-16"
              style={{
                opacity:
                  phrase03 *
                  (1 - phrase04),

                transform: `translateX(${
                  -120 + phrase03 * 120
                }px)`,
              }}
            >
              <div className="max-w-4xl">
                <h2 className="text-[11vw] font-semibold leading-[0.8] tracking-[-0.08em] md:text-[8vw]">
                  SIMPLES.
                  <br />
                  ARTESANAL.
                  <br />
                  INTENSA.
                </h2>
              </div>
            </div>

            {/* FRASE 04 */}

            <div
              className="absolute right-0 w-full px-7 text-right md:px-16"
              style={{
                opacity:
                  phrase04 *
                  (1 -
                    range(
                      progress,
                      0.57,
                      0.64
                    )),

                transform: `translateX(${
                  120 - phrase04 * 120
                }px)`,
              }}
            >
              <div className="ml-auto max-w-4xl">
                <h2 className="text-[10vw] font-semibold leading-[0.82] tracking-[-0.08em] md:text-[7vw]">
                  AQUI,
                  <br />
                  O FOGO
                  <br />
                  FAZ PARTE.
                </h2>
              </div>
            </div>
          </div>

          {/* ============================================= */}
          {/* CHAMA DO MENU */}
          {/* ============================================= */}

          <div
            className="pointer-events-none absolute inset-0 z-40 overflow-hidden"
            style={{
              opacity: fireOpacity,
            }}
          >
            <video
              ref={menuFireRef}
              src="/videos/menu-fire.mp4"
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                transform: `scale(${fireScale})`,
              }}
            />

            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* ============================================= */}
          {/* MENU */}
          {/* ============================================= */}

          <div
            className="absolute inset-0 z-50"
            style={{
              opacity: menuIntro,
            }}
          >
            {/* INTRO MENU */}

            <div
              className="absolute inset-0 flex items-center justify-center px-6 text-center"
              style={{
                opacity:
                  menuIntro *
                  (1 - pizza01),

                transform: `translateY(${
                  35 -
                  menuIntro * 35
                }px)`,
              }}
            >
              <div>
                <p className="mb-6 text-[9px] uppercase tracking-[0.6em] text-orange-400">
                  NERO — MENU
                </p>

                <h2 className="text-[13vw] font-semibold leading-[0.78] tracking-[-0.09em] md:text-[9vw]">
                  AGORA,
                  <br />
                  ESCOLHA.
                </h2>
              </div>
            </div>

            {/* MARGHERITA */}

            <MenuSlide
              visible={pizza01}
              exit={range(
                progress,
                0.91,
                0.925
              )}
              number="01"
              name="MARGHERITA"
              description="Molho de tomate, fior di latte, manjericão fresco e azeite."
              price="R$ 48"
              side="left"
            />

            {/* DIAVOLA */}

            <MenuSlide
              visible={pizza02}
              exit={range(
                progress,
                0.945,
                0.955
              )}
              number="02"
              name="DIAVOLA"
              description="Tomate, mozzarella, salame picante e um toque de pimenta."
              price="R$ 56"
              side="right"
            />

            {/* BURRATA */}

            <MenuSlide
              visible={pizza03}
              exit={range(
                progress,
                0.97,
                0.978
              )}
              number="03"
              name="BURRATA"
              description="Burrata cremosa, tomate confit, manjericão e azeite extravirgem."
              price="R$ 62"
              side="left"
            />

            {/* PROSCIUTTO */}

            <MenuSlide
              visible={pizza04}
              exit={range(
                progress,
                0.992,
                1
              )}
              number="04"
              name="PROSCIUTTO"
              description="Mozzarella, presunto cru, rúcula fresca e parmesão."
              price="R$ 64"
              side="right"
            />
          </div>

          {/* SCROLL */}

          <div
            className="absolute bottom-8 left-1/2 z-[80] -translate-x-1/2 text-[8px] uppercase tracking-[0.5em] text-white/30"
            style={{
              opacity:
                1 -
                range(
                  progress,
                  0.60,
                  0.72
                ),
            }}
          >
            Scroll
          </div>
        </div>
      </section>

      {/* FINAL */}

      <section className="relative flex min-h-screen items-center justify-center bg-black px-6 text-center">
        <div>
          <p className="mb-6 text-[9px] uppercase tracking-[0.6em] text-orange-400">
            NERO PIZZERIA
          </p>

          <h2 className="text-[13vw] font-semibold leading-[0.78] tracking-[-0.09em] md:text-[9vw]">
            VEM
            <br />
            EXPERIMENTAR.
          </h2>

          <button
            type="button"
            className="mt-12 border border-white/20 px-8 py-4 text-[9px] uppercase tracking-[0.45em] text-white/70 transition hover:border-white/50 hover:text-white"
          >
            Conhecer a Nero
          </button>
        </div>
      </section>
    </main>
  );
}