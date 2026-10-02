'use client';

//ライブラリ
import { usePathname } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import clsx from 'clsx';

//スタイル
import styles from "./BackgroundLayer.module.scss";

export default function BackgroundLayer() {
  const path = usePathname().replace(/\/$/, '') || '/';
  const isHome = path === '/';
  const isWeather = path === '/weather';
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // マス目のパララックス（TOPでも下層でもマウスに連動）
  const gridX = useTransform(smoothX, [0, 2000], [15, -15]);
  const gridY = useTransform(smoothY, [0, 2000], [15, -15]);

  // 動きを減らす設定の場合、グリッドをマウスに追従させない
  const reduced = useReducedMotion();

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      // 座標の計算（マス目のパララックス用）
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // スポットライト用の変数更新（コンテナにセット）
      if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
        containerRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
      }
    };

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className={styles["background-wrapper"]}>
      {/* 背景のマス目：マウスに連動して若干動く */}
      <motion.div className={styles["grid-layer"]} style={reduced ? undefined : { x: gridX, y: gridY }} />

      {/* ① 中央固定スポットライト（TOP・weatherページで使用） */}
      <div className={clsx(
        styles["spotlight-fixed"],
        (isHome || isWeather) && styles["--active"],
      )} />

      {/* ② マウス追従スポットライト（TOP・weatherページ以外の、下層ページで使用） */}
      <div className={clsx(
        styles["spotlight-follower"],
        !isHome && !isWeather && styles["--active"],
      )} />
      
      <div className={styles["noise-layer"]} /></div>
  );
}