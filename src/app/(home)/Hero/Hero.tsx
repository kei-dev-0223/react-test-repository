"use client";

//ライブラリ
import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

//スタイル
import styles from "./Hero.module.scss";

type HeroProps = {
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  accentText?: React.ReactNode;
};

export default function Hero({ title,subTitle,accentText }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 10, damping: 45 });
  const springY = useSpring(mouseY, { stiffness: 10, damping: 45 });

  const textX = useTransform(springX, (val) => val * -0.3);
  const textY = useTransform(springY, (val) => val * -0.3);

  useEffect(() => {
    setMounted(true);

    const handleMove = (x: number, y: number) => {
      mouseX.set((x - window.innerWidth / 2) * 0.06);
      mouseY.set((y - window.innerHeight / 2) * 0.06);
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div className={styles["hero"]}>
      <div className={styles["hero__in"]}>

        {/* 円のレイヤー */}
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            className={styles["hero__circle"]}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              rotate: i % 2 === 0 ? 360 : -360,
              scale: [1, 1.05, 0.95, 1],
            }}
            transition={{
              opacity: { duration: 2.5, delay: i * 0.15, ease: "easeOut" },
              rotate: { duration: 20 + i * 5, repeat: Infinity, ease: "linear" },
              scale: { duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{
              border: `${0.6 - i * 0.05}px solid rgba(0,0,0,0.1)`,
              borderRadius:
                i % 2 === 0
                  ? "48% 52% 46% 54% / 54% 46% 52% 48%"
                  : "52% 48% 54% 46% / 46% 54% 48% 52%",
              x: springX,
              y: springY,
              z: 0,
            }}
          />
        ))}

        {/* 文字のレイヤー */}
        <motion.div
          className={styles["hero__text-container"]}
          style={{
            x: textX,
            y: textY,
            translateX: "-50%",
            translateY: "-50%",
            left: "50%",
            top: "50%",
          }}
        >
          <motion.div
            className={styles["hero__title"]}
            initial={{ opacity: 0, letterSpacing: "1.5em", filter: "blur(10px)", y: 10 }}
            animate={{
              opacity: 1,
              letterSpacing: "2.5em",
              filter: "blur(0px)",
              y: 0,
            }}
            transition={{
              duration: 1.45,
              delay: 0.8,
              ease: "easeOut",
            }}
          >
            <div className={styles["hero__title-main"]}>{title}</div>
            <div className={styles["hero__title-sub"]}>
              {subTitle}
              {accentText &&(
                <span className={styles["hero__title-cursor"]}>_</span>
              )}
              {accentText}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}