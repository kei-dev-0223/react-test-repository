"use client";

// ============================================================================
// 天気イラストは、CSS変数（トークン）から独立して設計
// ============================================================================

//ライブラリ
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

//スタイル
import styles from "./WeatherAnimation.module.scss";

type Props = {
  type: string;
  windspeed?: number;
  isLoading?: boolean;
};

// 表示範囲。PC基準で固定し、SPとの差は WeatherAnimation.module.scss の translate で吸収する。
// 画面幅をJSで見て切り替えると、静的HTMLの初回描画が必ずPC基準になり、マウント後に切り替わってズレが見えるため。
const VIEW = { x: 0, y: -190, w: 680, h: 370 };
const VIEW_BOX = `${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`;
const SCAN_COUNT = Math.ceil(VIEW.h / 3); // スキャンラインの本数

export default function WeatherAnimation({type, windspeed = 0, isLoading = false}: Props) {
  const windDuration = windspeed > 30 ? 0.8 : windspeed > 15 ? 1.5 : windspeed > 5 ? 2.5 : 4; //葉っぱの速度を自動で変更用

  const [showNoise, setShowNoise] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShowNoise(true);
    }
    else {
      const timer = setTimeout(() => setShowNoise(false), 2000);
      return () => clearTimeout(timer); //関数の結果ではなく、関数の状態で返す。
    }
  }, [isLoading]);

  const hour = new Date().getHours(); //現在日時を取得
  const overlayColor =
    hour >= 6 && hour < 9   ? "rgba(255,180,100,0.5)" :
    hour >= 9 && hour < 17  ? "rgba(180,220,255,0.5)" :
    hour >= 17 && hour < 20 ? "rgba(255,100,60,0.5)" :
    "rgba(20,20,60,0.5)";

  const cloudColor = type === "cloudy"
    ? hour >= 6 && hour < 9   ? "#c8b8a0"
    : hour >= 9 && hour < 17  ? "#b0bec5"
    : hour >= 17 && hour < 20 ? "#b09888"
    : "#505870"
    : hour >= 6 && hour < 9   ? "#f0e0c8"
    : hour >= 9 && hour < 17  ? "#ffffff"
    : hour >= 17 && hour < 20 ? "#e8c8b8"
    : "#6878a0";

  const sunnyCloudList = [
    { y: -50, type: 'Heavy', d: 80,  scale: 1.2, flipX: false },
    { y: -30, type: 'Slim',  d: 110, scale: 0.9, flipX: true  },
    { y: -10, type: 'Heavy', d: 65,  scale: 1.5, flipX: false },
    { y: -45, type: 'Slim',  d: 95,  scale: 0.7, flipX: true  },
    { y: -20, type: 'Heavy', d: 75,  scale: 1.3, flipX: false },
    { y: -35, type: 'Slim',  d: 120, scale: 1.0, flipX: true  },
    { y: -55, type: 'Heavy', d: 90,  scale: 0.8, flipX: true  },
    { y: -15, type: 'Slim',  d: 70,  scale: 1.4, flipX: false },
    { y: -40, type: 'Heavy', d: 105, scale: 1.1, flipX: true  },
    { y: -25, type: 'Slim',  d: 85,  scale: 0.6, flipX: false },
    { y: -5,  type: 'Heavy', d: 60,  scale: 1.6, flipX: false },
    { y: -48, type: 'Slim',  d: 130, scale: 0.8, flipX: true  },
    { y: -18, type: 'Heavy', d: 72,  scale: 1.2, flipX: false },
    { y: -38, type: 'Slim',  d: 100, scale: 1.0, flipX: true  },
    { y: -28, type: 'Heavy', d: 55,  scale: 1.4, flipX: false },
    { y: -52, type: 'Slim',  d: 115, scale: 0.7, flipX: true  },
    { y: -8,  type: 'Heavy', d: 88,  scale: 1.1, flipX: true  },
    { y: -42, type: 'Slim',  d: 78,  scale: 0.9, flipX: false },
  ];

  const cloudyCloudList = [
    ...sunnyCloudList,
    { y: -58, type: 'Heavy', d: 60,  scale: 1.5, flipX: false },
    { y: -33, type: 'Slim',  d: 68,  scale: 1.3, flipX: true  },
    { y: -12, type: 'Heavy', d: 72,  scale: 1.6, flipX: false },
    { y: -47, type: 'Slim',  d: 55,  scale: 1.2, flipX: true  },
    { y: -22, type: 'Heavy', d: 80,  scale: 1.4, flipX: false },
    { y: -3,  type: 'Slim',  d: 65,  scale: 1.5, flipX: true  },
  ];

  const cloudList = type === "cloudy" ? cloudyCloudList : sunnyCloudList;

  return (
    <div className={styles["weather-animation"]}>
      <svg width="100%" viewBox={VIEW_BOX} preserveAspectRatio="xMidYMax slice" fill="none" xmlns="http://www.w3.org/2000/svg">

        <defs>
          <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={overlayColor}/>
            <stop offset="100%" stopColor={overlayColor} stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="skyGradientL" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={overlayColor}/>
            <stop offset="40%" stopColor={overlayColor} stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="skyGradientR" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={overlayColor}/>
            <stop offset="40%" stopColor={overlayColor} stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="cloudMask" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="white" stopOpacity="0"/>
            <stop offset="8%"   stopColor="white" stopOpacity="1"/>
            <stop offset="92%"  stopColor="white" stopOpacity="1"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </linearGradient>
          <mask id="cloudFade">
            <rect x="0" y="-200" width="680" height="400" fill="url(#cloudMask)"/>
          </mask>
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
          </filter>
          <mask id="moonMask">
            <circle cx="460" cy="-20" r="22" fill="white"/>
            <circle cx="472" cy="-26" r="18" fill="black"/>
          </mask>
        </defs>

        <g className={styles["weather-animation__scene"]}>
          {/* 空の描画 時間帯で色を変える */}
          <rect className={styles["weather-animation__sky"]} x="0" width="680" fill="url(#skyGradient)"/>
          <rect className={styles["weather-animation__sky"]} x="0" width="680" fill="url(#skyGradientL)"/>
          <rect className={styles["weather-animation__sky"]} x="0" width="680" fill="url(#skyGradientR)"/>

          {type === "sunny" && (
            <>
              {/* 朝・昼：太陽 */}
              {hour >= 6 && hour < 17 && (
                <g>
                  {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle) => (
                    <motion.line
                      key={angle}
                      x1="460" y1="-18"
                      x2="460" y2="-24"
                      stroke="#e8a840"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      transform={`rotate(${angle} 460 2)`}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: angle / 360 * 2.5 }}
                    />
                  ))}
                  <motion.circle
                    cx="460" cy="2" r="16"
                    fill="#e8a840"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </g>
              )}

              {/* 夕・夜：月 */}
              {(hour >= 17 || hour < 6) && (
                <circle cx="460" cy="-20" r="22" fill="#c8d0e0" opacity="0.9" mask="url(#moonMask)"/>
              )}
            </>
          )}

          {type === "rainy" && (
            <g>
              <g transform="translate(0, -120)">
                {/* 雲(奥) */}
                {[
                  { cx: 0, cy: 120, rx: 20, ry: 10 },
                  { cx: 30, cy: 110, rx: 20, ry: 20 },
                  { cx: 70, cy: 115, rx: 25, ry: 20 },
                  { cx: 100, cy: 100, rx: 23, ry: 20 },
                  { cx: 127, cy: 105, rx: 14, ry: 10 },
                  { cx: 160, cy: 100, rx: 25, ry: 23 },
                  { cx: 190, cy: 94, rx: 15, ry: 15 },
                  { cx: 224, cy: 95, rx: 23, ry: 18 },
                  { cx: 265, cy: 105, rx: 28, ry: 18 },
                  { cx: 300, cy: 105, rx: 14, ry: 10 },
                  { cx: 330, cy: 90, rx: 30, ry: 18 },
                  { cx: 360, cy: 80, rx: 20, ry: 18 },
                  { cx: 390, cy: 90, rx: 22, ry: 18 },
                  { cx: 425, cy: 80, rx: 30, ry: 18 },
                  { cx: 460, cy: 80, rx: 12, ry: 10 },
                  { cx: 490, cy: 80, rx: 30, ry: 28 },
                  { cx: 520, cy: 70, rx: 25, ry: 28 },
                  { cx: 555, cy: 70, rx: 35, ry: 28 },
                  { cx: 585, cy: 90, rx: 15, ry: 15 },
                  { cx: 625, cy: 82, rx: 35, ry: 30 },
                  { cx: 670, cy: 100, rx: 25, ry: 22 },
                  { cx: 30, cy: 90, rx: 50, ry: 28 },
                  { cx: 400, cy: 60, rx: 80, ry: 28 },
                  { cx: 640, cy: 50, rx: 80, ry: 40 },
                ].map((part, j) => (
                  <motion.ellipse
                    key={j}
                    cx={part.cx} cy={part.cy} rx={part.rx} ry={part.ry}
                    fill={hour >= 9 && hour < 17 ? "#505868" : "#2a2d3a"}
                    animate={{ ry: [part.ry, part.ry * 1.1, part.ry] }}
                    transition={{ duration: 4 + j, repeat: Infinity, ease: "easeInOut", delay: j * 0.5 }}
                  />
                ))}

                {/* 雲(中間) */}
                {[
                  { cx: 140, cy: 74, rx: 30, ry: 30 },
                  { cx: 180, cy: 70, rx: 20, ry: 20 },
                  { cx: 288, cy: 74, rx: 32, ry: 25 },
                  { cx: 325, cy: 55, rx: 20, ry: 24 },
                  { cx: 347, cy: 51, rx: 20, ry: 20 },
                  { cx: 370, cy: 40, rx: 30, ry: 24 },
                  { cx: 420, cy: 40, rx: 30, ry: 24 },
                  { cx: 450, cy: 50, rx: 10, ry: 10 },
                  { cx: 464, cy: 60, rx: 12, ry: 10 },
                  { cx: 495, cy: 60, rx: 30, ry: 25 },
                  { cx: 530, cy: 50, rx: 20, ry: 25 },
                  { cx: 560, cy: 50, rx: 30, ry: 25 },
                  { cx: 600, cy: 20, rx: 30, ry: 35 },
                  { cx: 580, cy: 10, rx: 30, ry: 35 },
                  { cx: 610, cy: 10, rx: 30, ry: 30 },
                  { cx: 640, cy: 24, rx: 30, ry: 30 },
                  { cx: 300, cy: -30, rx: 140, ry: 80 },
                  { cx: 490, cy: 0, rx: 90, ry: 60 },
                  { cx: 670, cy: 20, rx: 20, ry: 20 },
                ].map((part, j) => (
                  <motion.ellipse
                    key={j}
                    cx={part.cx} cy={part.cy} rx={part.rx} ry={part.ry}
                    fill={hour >= 9 && hour < 17 ? "#8090a0" : "#505868"}
                    animate={{ ry: [part.ry, part.ry * 1.13, part.ry] }}
                    transition={{ duration: 4 + j, repeat: Infinity, ease: "easeInOut", delay: j * 0.4 }}
                  />
                ))}

                {/* 雲(手前) */}
                {[
                  { cx: 0, cy: 60, rx: 60, ry: 42 },
                  { cx: 60, cy: 80, rx: 20, ry: 20 },
                  { cx: 100, cy: 70, rx: 30, ry: 30 },
                  { cx: 140, cy: 70, rx: 25, ry: 20 },
                  { cx: 182, cy: 60, rx: 28, ry: 20 },
                  { cx: 235, cy: 55, rx: 48, ry: 45 },
                  { cx: 282, cy: 30, rx: 30, ry: 32 },
                  { cx: 285, cy: 55, rx: 20, ry: 22 },
                  { cx: 310, cy: 44, rx: 20, ry: 18 },
                  { cx: 100, cy: 15, rx: 110, ry: 70 },
                  { cx: 200, cy: 0, rx: 40, ry: 30 },
                  { cx: 305, cy: 30, rx: 20, ry: 20 },
                  { cx: 248, cy: 12, rx: 35, ry: 30 },
                  { cx: 10, cy: -20, rx: 35, ry: 30 },
                ].map((part, j) => (
                  <motion.ellipse
                    key={j}
                    cx={part.cx} cy={part.cy} rx={part.rx} ry={part.ry}
                    fill={hour >= 9 && hour < 17 ? "#9aaabb" : "#656878"}
                    animate={{ ry: [part.ry, part.ry * 1.1, part.ry] }}
                    transition={{ duration: 4 + j, repeat: Infinity, ease: "easeInOut", delay: j * 0.5 }}
                  />
                ))}
              </g>

              {/* 雨粒 */}
              {[60, 80, 100, 120, 140, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520, 560, 600, 640].map((x, i) => (
                <motion.line
                  key={x}
                  x1={x} y1="0"
                  x2={x - 6} y2="18"
                  stroke="#6888a8"
                  strokeWidth="1"
                  strokeLinecap="round"
                  opacity={0.6}
                  animate={{ y: [-20, 180], opacity: [0, 0.6, 0] }}
                  transition={{ duration: 0.8 + (i % 4) * 0.15, repeat: Infinity, delay: (i * 0.17) % 1.2, ease: "easeIn" }}
                />
              ))}
            </g>
          )}

          {type === "snowy" && (
            <g>
              {Array.from({ length: 40 }, (_, i) => {
                const x = (i * 207) % 680;
                const size = 2.5 + (i % 4) * 0.8;
                const duration = 3 + (i % 5) * 0.8;
                const delay = -(i * duration / 40) % duration;
                const sway = (i % 2 === 0 ? 1 : -1) * (10 + (i % 3) * 8);
                return (
                  <motion.ellipse
                    key={i}
                    cx={x}
                    cy={-200}
                    rx={size}
                    ry={size}
                    fill="#ffffff"
                    opacity={0.5 + (i % 3) * 0.15}
                    animate={{
                      cy: [-200, 180],
                      cx: [x, x + sway, x],
                    }}
                    transition={{
                      duration,
                      repeat: Infinity,
                      delay,
                      ease: "linear",
                      cx: { duration, repeat: Infinity, ease: "easeInOut", delay },
                    }}
                  />
                );
              })}
            </g>
          )}

          {type === "stormy" && (
            <g>
              <g transform="translate(0, -120)">
                {/* 雲(奥) */}
                {[
                  { cx: 0, cy: 120, rx: 20, ry: 10 },
                  { cx: 30, cy: 110, rx: 20, ry: 20 },
                  { cx: 70, cy: 115, rx: 25, ry: 20 },
                  { cx: 100, cy: 100, rx: 23, ry: 20 },
                  { cx: 127, cy: 105, rx: 14, ry: 10 },
                  { cx: 160, cy: 100, rx: 25, ry: 23 },
                  { cx: 190, cy: 94, rx: 15, ry: 15 },
                  { cx: 224, cy: 95, rx: 23, ry: 18 },
                  { cx: 265, cy: 105, rx: 28, ry: 18 },
                  { cx: 300, cy: 105, rx: 14, ry: 10 },
                  { cx: 330, cy: 90, rx: 30, ry: 18 },
                  { cx: 360, cy: 80, rx: 20, ry: 18 },
                  { cx: 390, cy: 90, rx: 22, ry: 18 },
                  { cx: 425, cy: 80, rx: 30, ry: 18 },
                  { cx: 460, cy: 80, rx: 12, ry: 10 },
                  { cx: 490, cy: 80, rx: 30, ry: 28 },
                  { cx: 520, cy: 70, rx: 25, ry: 28 },
                  { cx: 555, cy: 70, rx: 35, ry: 28 },
                  { cx: 585, cy: 90, rx: 15, ry: 15 },
                  { cx: 625, cy: 82, rx: 35, ry: 30 },
                  { cx: 670, cy: 100, rx: 25, ry: 22 },
                  { cx: 30, cy: 90, rx: 50, ry: 28 },
                  { cx: 400, cy: 60, rx: 80, ry: 28 },
                  { cx: 640, cy: 50, rx: 80, ry: 40 },
                ].map((part, j) => (
                  <motion.ellipse
                    key={j}
                    cx={part.cx} cy={part.cy} rx={part.rx} ry={part.ry}
                    fill="#303540"
                    animate={{ ry: [part.ry, part.ry * 1.1, part.ry] }}
                    transition={{ duration: 4 + j, repeat: Infinity, ease: "easeInOut", delay: j * 0.5 }}
                  />
                ))}

                {/* 雲(中間) */}
                {[
                  { cx: 140, cy: 74, rx: 30, ry: 30 },
                  { cx: 180, cy: 70, rx: 20, ry: 20 },
                  { cx: 288, cy: 74, rx: 32, ry: 25 },
                  { cx: 325, cy: 55, rx: 20, ry: 24 },
                  { cx: 347, cy: 51, rx: 20, ry: 20 },
                  { cx: 370, cy: 40, rx: 30, ry: 24 },
                  { cx: 420, cy: 40, rx: 30, ry: 24 },
                  { cx: 450, cy: 50, rx: 10, ry: 10 },
                  { cx: 464, cy: 60, rx: 12, ry: 10 },
                  { cx: 495, cy: 60, rx: 30, ry: 25 },
                  { cx: 530, cy: 50, rx: 20, ry: 25 },
                  { cx: 560, cy: 50, rx: 30, ry: 25 },
                  { cx: 600, cy: 20, rx: 30, ry: 35 },
                  { cx: 580, cy: 10, rx: 30, ry: 35 },
                  { cx: 610, cy: 10, rx: 30, ry: 30 },
                  { cx: 640, cy: 24, rx: 30, ry: 30 },
                  { cx: 300, cy: -30, rx: 140, ry: 80 },
                  { cx: 490, cy: 0, rx: 90, ry: 60 },
                  { cx: 670, cy: 20, rx: 20, ry: 20 },
                ].map((part, j) => (
                  <motion.ellipse
                    key={j}
                    cx={part.cx} cy={part.cy} rx={part.rx} ry={part.ry}
                    fill="#404550"
                    animate={{ ry: [part.ry, part.ry * 1.13, part.ry] }}
                    transition={{ duration: 4 + j, repeat: Infinity, ease: "easeInOut", delay: j * 0.4 }}
                  />
                ))}

                {/* 雲(手前) */}
                {[
                  { cx: 0, cy: 60, rx: 60, ry: 42 },
                  { cx: 60, cy: 80, rx: 20, ry: 20 },
                  { cx: 100, cy: 70, rx: 30, ry: 30 },
                  { cx: 140, cy: 70, rx: 25, ry: 20 },
                  { cx: 182, cy: 60, rx: 28, ry: 20 },
                  { cx: 235, cy: 55, rx: 48, ry: 45 },
                  { cx: 282, cy: 30, rx: 30, ry: 32 },
                  { cx: 285, cy: 55, rx: 20, ry: 22 },
                  { cx: 310, cy: 44, rx: 20, ry: 18 },
                  { cx: 100, cy: 15, rx: 110, ry: 70 },
                  { cx: 200, cy: 0, rx: 40, ry: 30 },
                  { cx: 305, cy: 30, rx: 20, ry: 20 },
                  { cx: 248, cy: 12, rx: 35, ry: 30 },
                  { cx: 10, cy: -20, rx: 35, ry: 30 },
                ].map((part, j) => (
                  <motion.ellipse
                    key={j}
                    cx={part.cx} cy={part.cy} rx={part.rx} ry={part.ry}
                    fill="#505560"
                    animate={{ ry: [part.ry, part.ry * 1.1, part.ry] }}
                    transition={{ duration: 4 + j, repeat: Infinity, ease: "easeInOut", delay: j * 0.5 }}
                  />
                ))}
              </g>

              {/* 雨粒（rainyより激しく・斜め強め） */}
              {[60, 80, 100, 120, 140, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520, 560, 600, 640, 50, 150, 250, 350, 450, 550].map((x, i) => (
                <motion.line
                  key={x}
                  x1={x} y1="0"
                  x2={x - 12} y2="22"
                  stroke="#4a6888"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity={0.7}
                  animate={{ y: [-20, 180], opacity: [0, 0.7, 0] }}
                  transition={{ duration: 0.6 + (i % 4) * 0.1, repeat: Infinity, delay: (i * 0.13) % 1.0, ease: "easeIn" }}
                />
              ))}

              {/* 雷 */}
              {[
                { x: 160, delay: 0,   duration: 4.0 },
                { x: 340, delay: 1.5, duration: 5.5 },
                { x: 520, delay: 3.0, duration: 3.8 },
              ].map((bolt, i) => (
                <motion.g key={i}>
                  <motion.rect
                    x="0" y="-200" width="680" height="400"
                    fill="rgba(220,230,255,0.15)"
                    animate={{ opacity: [0, 0.8, 0, 0.4, 0] }}
                    transition={{ duration: 0.3, repeat: Infinity, delay: bolt.delay, repeatDelay: bolt.duration, ease: "easeOut" }}
                  />
                  <motion.path
                    d={`M${bolt.x} -30 L${bolt.x - 10} 0 L${bolt.x - 4} 0 L${bolt.x - 14} 30`}
                    stroke="#d0d8ff"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ opacity: [0, 1, 0, 0.6, 0] }}
                    transition={{ duration: 0.3, repeat: Infinity, delay: bolt.delay, repeatDelay: bolt.duration, ease: "easeOut" }}
                  />
                </motion.g>
              ))}
            </g>
          )}

          {/* 雲アニメーション（晴れ・曇り） */}
          {(type === "sunny" || type === "cloudy") && (
            <g mask="url(#cloudFade)">
              {cloudList.map((c, i) => {
                const total = cloudList.length;
                const duration = c.d * (windspeed > 0 ? 10 / windspeed : 1.5);
                const adjustedDelay = -((i * duration) / total) % duration;
                return (
                  <motion.g
                    key={i}
                    animate={{ x: 900 }}
                    initial={{ x: -400 }}
                    transition={{ duration, repeat: Infinity, ease: "linear", delay: adjustedDelay }}
                  >
                    <motion.g
                      animate={{ opacity: [0, 0.9, 0.9, 0] }}
                      initial={{ opacity: 0 }}
                      transition={{ duration, repeat: Infinity, ease: "linear", delay: adjustedDelay, times: [0, 0.08, 0.92, 1] }}
                    >
                      <g transform={`translate(0, ${c.y}) scale(${c.scale})`}>
                        <g style={c.flipX ? { transform: 'scaleX(-1)', transformOrigin: 'center center' } : {}}>
                          {(c.type === 'Heavy' ? [
                            { cx: 50, cy: 5,  rx: 15, ry: 15, speed: 8.5  },
                            { cx: 20, cy: 15, rx: 12, ry: 12, speed: 10.2 },
                            { cx: 80, cy: 20, rx: 14, ry: 14, speed: 9.0  },
                            { cx: 70, cy: 5,  rx: 12, ry: 12, speed: 12.0 },
                            { cx: 35, cy: 26, rx: 10, ry: 10, speed: 11.5 },
                            { cx: 60, cy: 26, rx: 14, ry: 14, speed: 13.0 },
                            { cx: 44, cy: 16, rx: 14, ry: 14, speed: 13.0 },
                            { cx: 34, cy: 13, rx: 16, ry: 16, speed: 9.8  },
                          ] : [
                            { cx: 50, cy: 15, rx: 16, ry: 16, speed: 8.8  },
                            { cx: 20, cy: 25, rx: 13, ry: 13, speed: 10.5 },
                            { cx: 80, cy: 30, rx: 15, ry: 15, speed: 9.3  },
                            { cx: 70, cy: 10, rx: 11, ry: 11, speed: 12.5 },
                            { cx: 35, cy: 35, rx: 9,  ry: 9,  speed: 11.8 },
                            { cx: 60, cy: 35, rx: 13, ry: 13, speed: 13.5 },
                            { cx: 44, cy: 26, rx: 13, ry: 13, speed: 13.5 },
                            { cx: 34, cy: 23, rx: 15, ry: 15, speed: 10.1 },
                          ]).map((part, j) => (
                            <motion.ellipse
                              key={j}
                              cx={part.cx}
                              cy={part.cy}
                              rx={part.rx}
                              ry={part.ry}
                              fill={cloudColor}
                              animate={{
                                rx: [part.rx, part.rx * 1.2, part.rx],
                                ry: [part.ry, part.ry * 1.35, part.ry],
                                opacity: [0.9, 1, 0.9]
                              }}
                              transition={{ duration: part.speed, repeat: Infinity, ease: "easeInOut", delay: j * 0.5 }}
                            />
                          ))}
                        </g>
                      </g>
                    </motion.g>
                  </motion.g>
                );
              })}
            </g>
          )}

          {/* 葉っぱアニメーション */}
          {windspeed > 8 && (
            <g>
              {[
                { y: 60, delay: 0,   size: 16 },
                { y: 90, delay: 1.2, size: 12 },
                { y: 40, delay: 2.0, size: 20 },
                { y: 110,delay: 0.6, size: 14 },
              ].map((leaf, i) => (
                <motion.g key={i}>
                  <motion.g
                    animate={{ x: [-60, 780], y: [leaf.y, leaf.y - 10, leaf.y + 5, leaf.y] }}
                    transition={{ duration: windDuration, repeat: Infinity, delay: leaf.delay, ease: "linear" }}
                  >
                    <motion.path
                      d={`M0 0 Q${leaf.size / 2} -${leaf.size * 0.7} ${leaf.size} 0 Q${leaf.size / 2} ${leaf.size * 0.7} 0 0 Z`}
                      fill="#1a1c20"
                      opacity={0.5}
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: windDuration, repeat: Infinity, delay: leaf.delay, ease: "linear" }}
                      style={{ transformOrigin: `${leaf.size / 2}px 0px` }}
                    />
                  </motion.g>
                </motion.g>
              ))}
            </g>
          )}

          {/* 後景左側のビル群 */}
          <g fill="#1a1c20" fillOpacity="0.4">
            <rect x="0" y="136" width="25" height="16"/>
            <polygon points="0,136 12.5,128 25,136"/>
            <rect x="28" y="101" width="20" height="51"/>
            <rect x="34" y="96" width="8" height="5"/>
            <rect x="52" y="121" width="26" height="31"/>
            <rect x="58" y="111" width="14" height="10"/>
            <rect x="82" y="81" width="18" height="71"/>
            <rect x="89" y="74" width="4" height="7"/>
            <rect x="104" y="106" width="20" height="46"/>
            <rect x="128" y="91" width="28" height="61"/>
            <rect x="135" y="81" width="14" height="10"/>
            <rect x="160" y="124" width="20" height="28"/>
            <rect x="185" y="96" width="22" height="56"/>
            <rect x="192" y="88" width="8" height="8"/>
            <rect x="212" y="116" width="18" height="36"/>
            <rect x="235" y="101" width="24" height="51"/>
            <rect x="240" y="91" width="14" height="10"/>
            <rect x="263" y="131" width="18" height="21"/>
            <rect x="285" y="121" width="22" height="31"/>
          </g>

          {/* 後景右側のビル群 */}
          <g fill="#1a1c20" fillOpacity="0.4">
            <rect x="370" y="131" width="24" height="21"/>
            <rect x="377" y="124" width="10" height="7"/>
            <rect x="398" y="96" width="16" height="56"/>
            <rect x="420" y="111" width="28" height="41"/>
            <rect x="428" y="104" width="12" height="7"/>
            <rect x="452" y="76" width="18" height="76"/>
            <rect x="460" y="68" width="2" height="8"/>
            <rect x="475" y="106" width="22" height="46"/>
            <rect x="500" y="116" width="30" height="36"/>
            <rect x="508" y="108" width="14" height="8"/>
            <rect x="535" y="101" width="18" height="51"/>
            <rect x="558" y="121" width="24" height="31"/>
            <polygon points="558,121 570,111 582,121"/>
            <rect x="585" y="91" width="22" height="61"/>
            <rect x="592" y="84" width="8" height="7"/>
            <rect x="612" y="116" width="20" height="36"/>
            <rect x="635" y="138" width="25" height="14"/>
            <rect x="642" y="131" width="11" height="7"/>
          </g>

          {/* 後景の地面 */}
          <rect fill="#1a1c20" fillOpacity="0.4" x="0" y="152" width="680" height="10"/>

          {/* 前景左側ビル群 */}
          <g fill="#1a1c20">
            <rect x="8" y="145" width="22" height="25"/>
            <polygon points="8,145 19,135 30,145"/>
            <rect x="33" y="130" width="18" height="40"/>
            <rect x="35" y="126" width="4" height="4"/>
            <rect x="54" y="140" width="14" height="30"/>
            <rect x="71" y="118" width="20" height="52"/>
            <rect x="74" y="112" width="14" height="6"/>
            <rect x="77" y="108" width="8" height="4"/>
            <rect x="94" y="128" width="34" height="42"/>
            <rect x="98" y="123" width="8" height="5"/>
            <rect x="116" y="123" width="8" height="5"/>
            <rect x="131" y="115" width="10" height="55"/>
            <rect x="133" y="110" width="6" height="5"/>
            <rect x="135" y="105" width="2" height="5"/>
            <rect x="144" y="133" width="22" height="37"/>
            <rect x="169" y="143" width="16" height="27"/>
            <rect x="188" y="135" width="30" height="35"/>
            <rect x="192" y="128" width="6" height="7"/>
            <rect x="206" y="130" width="6" height="5"/>
          </g>

          {/* 前景右側ビル群 */}
          <g fill="#1a1c20">
            <rect x="368" y="145" width="18" height="25"/>
            <rect x="389" y="132" width="16" height="38"/>
            <rect x="392" y="127" width="10" height="5"/>
            <rect x="408" y="115" width="22" height="55"/>
            <rect x="411" y="109" width="16" height="6"/>
            <rect x="414" y="104" width="10" height="5"/>
            <rect x="433" y="125" width="38" height="45"/>
            <rect x="437" y="120" width="10" height="5"/>
            <rect x="455" y="120" width="10" height="5"/>
            <rect x="474" y="130" width="12" height="40"/>
            <rect x="476" y="125" width="8" height="5"/>
            <rect x="489" y="118" width="24" height="52"/>
            <rect x="492" y="112" width="18" height="6"/>
            <rect x="495" y="107" width="12" height="5"/>
            <rect x="516" y="140" width="16" height="30"/>
            <rect x="535" y="128" width="20" height="42"/>
            <rect x="538" y="123" width="14" height="5"/>
            <rect x="558" y="135" width="22" height="35"/>
            <ellipse cx="569" cy="135" rx="11" ry="6"/>
            <rect x="583" y="120" width="18" height="50"/>
            <rect x="586" y="114" width="12" height="6"/>
            <rect x="604" y="140" width="20" height="30"/>
            <rect x="627" y="133" width="28" height="37"/>
            <rect x="631" y="128" width="8" height="5"/>
            <rect x="643" y="128" width="8" height="5"/>
          </g>

          {/* スカイツリー アンテナ部分 */}
          <rect fill="#1a1c20" x="337.5" y="-25" width="4.5" height="3"/>
          <rect fill="#1a1c20" x="337.5" y="-21" width="4.5" height="1"/>
          <rect fill="#1a1c20" x="337.5" y="-19" width="4.5" height="1"/>
          <rect fill="#1a1c20" x="339" y="-24" width="1.5" height="50"/>

          {/* スカイツリー 450mの展望台まで */}
          <g transform="translate(0,-36)">
            <polygon fill="#1a1c20" points="333,49 347,49 344,59 336,59"/>
            <polygon fill="#1a1c20" points="332,52 348,52 345,62 335,62"/>
          </g>
          <path fill="#1a1c20" d="M337 25 L343 25 L345.5 60 L334.5 60 Z"/>

          {/* スカイツリー 350mの展望台まで */}
          <rect fill="#1a1c20" x="333.5" y="44" width="13" height="5"/>
          <g transform="translate(0,-22)">
            <path fill="#1a1c20" d="M330 71 L350 71 L345 88 L335 88 Z"/>
            <path fill="#1a1c20" d="M330 75 L350 75 L347 88 L333 88 Z"/>
          </g>
          <path fill="#1a1c20" d="M335 60 L345 60 L351 170 L329 170 Z"/>

          {/* 前景の地面 */}
          <rect fill="#1a1c20" x="0" y="160" width="680" height="20"/>
        </g>


        {/* Loading中に発火 読み込みアニメーション */}
        <AnimatePresence>
          {showNoise && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={isLoading ? { opacity: 1 } : { opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* 砂嵐ノイズ */}
              <motion.rect
                x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h}
                filter="url(#noise)"
                animate={isLoading ? { opacity: [0.3, 0.5, 0.3] } : { opacity: 0 }}
                transition={isLoading
                  ? { duration: 0.15, repeat: Infinity, ease: "linear" }
                  : { duration: 1.5, ease: "easeOut" }
                }
              />

              {/* スキャンライン */}
              {Array.from({ length: SCAN_COUNT }, (_, i) => (
                <motion.rect
                  key={i}
                  x={VIEW.x}
                  y={VIEW.y + i * 3}
                  width={VIEW.w}
                  height="1"
                  fill="rgba(160,200,255,0.15)"
                />
              ))}

              <motion.rect
                x={VIEW.x}
                y={VIEW.y}
                width={VIEW.w}
                height="4"
                fill="rgba(220,240,255,0.7)"
                animate={isLoading ? { y: [VIEW.y, VIEW.y + VIEW.h] } : { opacity: 0 }}
                transition={isLoading
                  ? { duration: 1.2, repeat: Infinity, ease: "linear" }
                  : { duration: 0.5 }
                }
              />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}