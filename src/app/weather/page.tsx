"use client";

//ライブラリ
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { Search, Loader2, MapPin } from "lucide-react";

//コンポーネント
import WeatherAnimation from "./WeatherAnimation/WeatherAnimation";

//関数
import { useWeather } from "./_lib/useWeather";
import { getWeatherLabel, getWeatherType, getWeatherIcon } from "./_lib/weatherUtils";

//スタイル
import layout from "@/styles/layout.module.scss";
import styles from "./page.module.scss";

//検索窓に天候名を入れるとアニメーションだけを切り替える。通信は行わない
const WEATHER_KEYWORDS : { [key : string] : string } = {
  "雨": "rainy",
  "雪": "snowy",
  "晴れ": "sunny",
  "曇り": "cloudy",
  "雷": "stormy",
};

function formatDate(dateStr : string) { // この関数は「2026-09-25」のような値を受け取り、ブラウザ表示用「9/25（金）」に変換する。
  const date = new Date(dateStr);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${date.getMonth() + 1}/${date.getDate()}(${days[date.getDay()]})`;
}

export default function WeatherPage() {
  const { current, daily, displayName, isLoading, error, searchByCity, searchByCurrentLocation } = useWeather();

  const [city, setCity] = useState("");
  const [keywordWeatherType, setKeywordWeatherType] = useState<string | null>(null);

  async function handleSearch() {
    const keyword = city.trim();

    if (WEATHER_KEYWORDS[keyword]) {
      setKeywordWeatherType(WEATHER_KEYWORDS[keyword]);
      return;
    }

    setKeywordWeatherType(null);
    if (!keyword) return;

    await searchByCity(keyword);
  }

  async function handleCurrentLocation() {
    setKeywordWeatherType(null);

    const result = await searchByCurrentLocation();
    if (result?.displayName) setCity(result.displayName);
  }

  return (
    <main className={layout["container-sub"]}>
      <div className={clsx(styles["weather"], current && styles["weather--searched"])}>

        <div className={styles["weather__search"]}>
          <label className="u-sr-only" htmlFor="weather-city">都市名</label>
          <input
            id="weather-city"
            className={styles["weather__search-input"]}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="都市名を入力"
          />
          <button
            className={styles["weather__search-button"]}
            onClick={handleSearch}
            disabled={isLoading}
            aria-label="検索"
          >
            {isLoading ? <Loader2 className={styles["weather__search-icon-loading"]} /> : <Search className={styles["weather__search-icon"]} />}
          </button>
          <button
            className={styles["weather__location-button"]}
            onClick={handleCurrentLocation}
            disabled={isLoading}
          >
            <MapPin className={styles["weather__location-button-icon"]} />
            <span className={styles["weather__location-button-txt"]}>現在地</span>
          </button>
        </div>

        {error && (
          <div className={styles["weather__error"]} role="alert">
            <p className={styles["weather__error-en"]}>NOT FOUND</p>
            <p className={styles["weather__error-jp"]}>{error}</p>
          </div>
        )}

        <div className={styles["weather__today"]}>
          {displayName && (
            <p className={styles["weather__display-name"]}>{displayName}</p>
          )}

          {current && (
            <div className={styles["weather__result"]}>
              <p className={styles["weather__result-temp"]}>{current.temperature}°</p>
              <p className={styles["weather__result-status"]}>{getWeatherLabel(current.weathercode)}</p>
              <p className={styles["weather__result-wind"]}>風速: {current.windspeed}km/h</p>
            </div>
          )}
        </div>

        <AnimatePresence>
          {daily && (
            <motion.div
              className={styles["weather__weekly"]}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {daily.time.map((date, i) => (
                <motion.div
                  key={date}
                  className={styles["weather__weekly-item"]}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 2 + i * 0.3 }}
                >
                  <div className={styles["weather__weekly-item-in"]}>
                    <p className={styles["weather__weekly-date"]}>{formatDate(date)}</p>
                    <p className={styles["weather__weekly-label"]}>
                      {getWeatherIcon(daily.weathercode[i])}
                      <span className="u-d-none-sp">{getWeatherLabel(daily.weathercode[i])}</span>
                    </p>
                    <p className={styles["weather__weekly-temp"]}>
                      <span className={styles["weather__weekly-max"]}>{daily.temperature_2m_max[i]}°</span><span className="u-d-none-sp"> / </span><span className={styles["weather__weekly-min"]}>{daily.temperature_2m_min[i]}°</span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles["weather__animate-img"]}>
          <div className={styles["weather__animate-img-in"]}>
            <WeatherAnimation
              type={keywordWeatherType ?? (current ? getWeatherType(current.weathercode) : "default")} //雲や雨などの天候アニメーション制御用
              windspeed={current ? current.windspeed : 0} //葉っぱのアニメーション用
              isLoading={isLoading} //読み込み中のアニメーションマスク用
            />
          </div>
        </div>

        {/* 外部APIの出典表記。Open-Meteo は CC BY 4.0、OpenStreetMap は ODbL のため表示が必須 */}
        <p className={styles["weather__credit"]}>
          天気データ：<a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a>（CC BY 4.0）<br />
          地名データ：<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a>
        </p>

      </div>
    </main>
  );
}
