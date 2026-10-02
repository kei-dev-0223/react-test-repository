"use client";

// React
import {useCallback, useEffect, useRef, useState,} from "react";

// 天気API関連の関数
import {fetchWeather, geocodeCity, getCurrentPosition, reverseGeocode,} from "./weatherApi";

// 天気データの型
import type {CurrentWeather, DailyWeather,} from "./weatherApi";


/*==============================================================================
このファイルの役割

「天気を取得する一連の処理」と「画面に必要な状態」をまとめています。

画面側では、

・現在の天気
・数日分の天気
・地名
・読み込み中か
・エラーメッセージ

を受け取って表示するだけにします。


このファイルでは、

① 都市名から天気を取得する
② 現在地から天気を取得する
③ 読み込み状態を管理する
④ エラーを管理する
⑤ 前の検索が残っていたらキャンセルする

といった処理を担当します。
==============================================================================*/


/*==============================================================================
画面に表示するエラーメッセージ
==============================================================================*/

const MESSAGE_NOT_FOUND ="都市が見つかりませんでした。別の都市名を試してください。";
const MESSAGE_FETCH_FAILED ="天気情報の取得に失敗しました。時間をおいて再試行してください。";
const MESSAGE_LOCATION_FAILED ="位置情報の取得に失敗しました。ブラウザの設定を確認してください。";


/*==============================================================================
天気データの型

今日の天気・数日分の天気・表示する地名を、1つのデータとしてまとめます。
1つの型「WeatherData」としてまとめ、定数「EMPTY_WEATHER」に型を反映。そして初期値として、3つともnullにしてます。
==============================================================================*/

type WeatherData = {
  current: CurrentWeather | null;
  daily: DailyWeather | null;
  displayName: string | null;
};

// 最初は天気データが何もない状態
const EMPTY_WEATHER: WeatherData = {current: null, daily: null, displayName: null,};


/*==============================================================================
「天気データ」「読み込み状態」「エラー」「都市検索」「現在地検索」を返す、処理内容すべてを収束した関数。
==============================================================================*/

export function useWeather() {

  //天気データ
  const [data, setData] = useState<WeatherData>(EMPTY_WEATHER); //WeatherData型を指定しつつ、初期値は3つともnull

  //読み込み状態
  const [isLoading, setIsLoading] = useState(false);

  //エラーメッセージ
  const [error, setError] = useState<string | null>(null);

  //通信をキャンセルするためのAbortControllerを入れておく箱。最初はnullで、検索開始時に作成したAbortControllerを保存する。
  const controllerRef = useRef<AbortController | null>(null);


  /*============================================================================
  ページを離れたときの処理

  コンポーネントが画面から消えるときに、進行中の通信があればキャンセルします。
  これによって、「もう画面がないのに通信だけ続いている」という状態を防ぎます。
  ============================================================================*/
  useEffect(() => {
    return () => { // useeffect内のreturnは、コンポーネントが消えた時（ページ遷移などで）、実行される。
      controllerRef.current?.abort(); //currentで箱の中身を確認。中身があったら、通信をキャンセル。
    };
  }, []);


  /*============================================================================
  検索の土台・共通処理をする関数。

  runSearch
  ├─ 前の検索をキャンセル
  ├─ AbortControllerを作る
  ├─ loadingを開始
  ├─ エラーをリセット
  ├─ taskを実行
  ├─ 結果をstateに保存
  └─ エラー処理
  ============================================================================*/

  const runSearch = useCallback(async (task: (signal: AbortSignal) => Promise<WeatherData | null>): Promise<WeatherData | null> => {
  // useCallbackを使用し、再レンダリングされても同じ関数を使い回せるようにする。
  // 引数「task」は、関数の型。引数signal(AbortSignal型)を受け取り、戻り値としてWeatherDataまたはnullをを返す関数の型。
  // AbortSignal型を指定すると、対象はオブジェクトとなり、複数の属性を取得可能となる。しかし今回使用する属性は「signal.aborted」だけ。

      // すでに検索中なら、その通信を止めます。（初回は箱の中身はnullなので何もしません）
      controllerRef.current?.abort();

      // 新しい「AbortController」を作る。この「controller」を使って、今回の通信をキャンセルできるようにします。
      const controller = new AbortController();
      controllerRef.current = controller; //currentで箱の中にアクセスし、箱にコントローラーを入れる。

      // 検索開始 --- loadingをtrueにして、前回のエラーを消します。
      setIsLoading(true);
      setError(null);

      try { // 実際の検索処理を実行 --- taskの中身は「都市検索」「現在地検索」によって変わります。

        // ここで引数(task)が受け取った関数を実行。かつ関数にコントローラーを渡す。（taskを通して渡された関数は、必ずsignalを受け取れるよう設計されている）
        const result = await task(controller.signal);

        // 検索結果を天気データとしてstateに保存。 --- resultがnullなら、空のデータ（EMPTY_WEATHER）を保存します。
        setData(result ?? EMPTY_WEATHER);

        return result;
      }

      catch { // tryの中で何かしらのエラーが起きた場合

        if (controller.signal.aborted) { //この通信が中止された状態なら、null を返してここで処理を終わらせる
          return null;
        }

        // それ以外のエラー
        setData(EMPTY_WEATHER);
        setError(MESSAGE_FETCH_FAILED);

        return null;

      }

      finally { // 検索終了後の処理 --- 通常の検索ならloadingを「false」にします。
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
  []); //[]は、関数を作り直さず、同じ関数を使い回すという意味。 useEffectの[]とは意味が異なる。


  /*==============================================================================
  都市名から天気を検索する関数

  例：「柏市」→「地名検索」→「緯度・経度を取得：」→「天気API」→「天気データ」
  ==============================================================================*/

  const searchByCity = useCallback( (city: string) => { //city(引数)は、都市名を受け取る。

    return runSearch(async (signal) => { //runSearchに「都市検索の具体的な処理」を関数として渡す。

        // 都市名から緯度・経度を取得
        const place = await geocodeCity(city, signal);

        // 都市が見つからなかった
        if (!place) {
          setError(MESSAGE_NOT_FOUND);
          return null;
        }

        // 緯度・経度から天気を取得
        const weather = await fetchWeather(place.lat, place.lon, signal);

        // 天気を取得できなかった
        if (!weather) {
          setError(MESSAGE_FETCH_FAILED);
          return null;
        }

        // 画面で使う形にまとめて返す
        return {
          current: weather.current,
          daily: weather.daily,
          displayName: place.name,
        };

      });
    },
    [runSearch] //「runSearch」が変わったら、「searchByCity」の関数を作り直す
  );


  /*==============================================================================
  現在地から天気を検索

  例：「現在地」→「緯度・経度を取得」→「地名を取得」→「天気API」→「天気データ」
  ==============================================================================*/

  const searchByCurrentLocation = useCallback(() => {

      return runSearch(async (signal) => { //runSearchに「現在地検索の具体的な処理」を渡します。

        // ブラウザから現在地を取得
        const position = await getCurrentPosition();

        // 現在地を取得できなかった
        if (!position) {
          setError(MESSAGE_LOCATION_FAILED);
          return null;
        }

        // 現在地から緯度・経度を取り出す
        const {latitude, longitude,} = position.coords;

        // 緯度・経度から地名を取得
        const displayName = await reverseGeocode(latitude, longitude, signal);

        // 緯度・経度から天気を取得
        const weather = await fetchWeather(latitude, longitude, signal);

        // 天気を取得できなかった
        if (!weather) {
          setError(MESSAGE_FETCH_FAILED);
          return null;
        }


        /*
        ------------------------------------------------------------------------
        ⑤ 画面で使う形にまとめて返す
        ------------------------------------------------------------------------
        */

        return {
          current: weather.current,
          daily: weather.daily,
          displayName,
        };
      });
    },
    [runSearch]
  );


  /*==============================================================================
  page.tsxへ渡すもの

　...dataを展開し、「current」「daily」「displayName」を直接使えるようにします。
  また、「isLoading」「error」と、関数「searchByCity」「searchByCurrentLocation」も渡します。
  ==============================================================================*/
  return {
    ...data,
    isLoading,
    error,
    searchByCity,
    searchByCurrentLocation,
  };
}