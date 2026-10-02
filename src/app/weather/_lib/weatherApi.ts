
/* ==============================================================================
このファイルの役割

メインとなる関数は以下4つ
関数 geocodeCity         → ユーザーが「検索窓」で入力した都市名を受け取り、「都市名・経度・緯度」の3つを取得する関数。 (API nominatimにアクセスする)
関数 reverseGeocode      → ユーザーが「現在地検索」を押した際の「地名」を取得するだけの用途の関数。 (API nominatimにアクセスする)
関数 fetchWeather        → 天気APIから「現在の天気」「数日分の天気」を取得し、返す関数。（API Open-Meteoにアクセス）
関数 getCurrentPosition  → 現在地を取得する関数。（APIへの通信はなし）

※Open-Meteo は地名を受け付けません。 緯度・経度しか受け取らないので、その変換のために Nominatim を挟んでいます。
============================================================================== */

// 現在の天気
export type CurrentWeather = {
  temperature: number; // 気温
  windspeed: number;   // 風速
  weathercode: number; // 天気コード
};

// 数日分の天気
export type DailyWeather = {
  time: string[];                  // 日付
  weathercode: number[];           // 天気コード
  temperature_2m_max: number[];    // 最高気温
  temperature_2m_min: number[];    // 最低気温
};

//exportは付与しない。地名検索APIから取得した「地名・緯度・経度」を入れるための型。
type GeoPlace = {
  name: string;
  lat: string;
  lon: string;
};


/*-------------------------------------------------------------
APIから取得した値を型判定するための汎用部品たち。

APIから取得したデータはunknown。そのため「本当にnumber？」「本当に配列？」とTypeScriptが分からないため、そのまま使用ができない。
以下の関数でデータの中身を確認します。
-------------------------------------------------------------*/

// value が「オブジェクト」か確認する汎用部品 -------- 通常、()の後には戻り値の型(numberなど)を指定する。今回は型ガードなので、戻り値の内容をもとに「valueは文字列のキーを持つオブジェクト(Record)として扱って良い」とTypeScriptに伝える
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null; //typeofでvalueの中身の「種類」を判定し、２つの条件を満たせば、戻り値はtrueとなる。
}

// value が「number」か確認する汎用部品 -------- typeofだけでは NaN なども考慮する必要があるため、Number.isFinite() も使う。
function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value); //数字か　& 有限の正常な数値か
}

// value が「numberだけが入った配列」か確認する汎用部品
function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every(isNumber); //配列か & 中身がすべてnumberか
}

// value が「stringだけが入った配列」か確認する汎用部品
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string") //配列か & 中身がすべてstringか
}


/*-------------------------------------------------------------
APIから値を取得するための汎用部品。

この関数を使用する側は、取得したいURLと、signal・headers の2つの追加情報を引数として渡します。
それらを使い「関数 fetchJson」が実際にAPIへアクセスし、取得したJSONを「unknown型」として返してくれます。
-------------------------------------------------------------*/

async function fetchJson(url: string, signal: AbortSignal, headers?: HeadersInit): Promise<unknown> { //非同期処理後。戻り値はunknownとする
  const response = await fetch(url, {signal,headers,}); //fetchでurlを指定してサーバーにリクエストし、返ってきたレスポンスをresponseに入れる。　fetchの仕様では fetch(url, options) として使う。

  if (!response.ok) { //通信が失敗の場合
    return null;
  }

  return response.json(); // 成功なら、レスポンスをJSONとして読み取る

// responseの中身は、以下のようなJSON形式でデータが返ってくる
// 例（Nominatim APIの場合）：
// [
//   {
//     "name": "東京都",
//     "lat": "35.6762",
//     "lon": "139.6503",
//     "addresstype": "province",
//     "class": "boundary",
//     "importance": 0.9
//   }
// ]

// json()を使うことで、JSONデータをJavaScriptで扱えるデータとして取得する
// [
//   {
//     name: "東京都",
//     lat: "35.6762",
//     lon: "139.6503",
//     addresstype: "province",
//     class: "boundary",
//     importance: 0.9
//   }
// ]
}


/*-------------------------------------------------------------
ユーザーが「検索窓」で入力した「都市名」を受け取り、3つの値を返す関数。

「都市名」を使用しAPIにアクセスして必要な値を3つ返す。
戻り値の例 : name: "東京都",lat: "35.6762",lon: "139.6503"　（最終的な用途として「name」は画面の地名表示に使われ、「lat」「lon」は天気APIの天候取得に使われる）
-------------------------------------------------------------*/

// 検索結果として認める場所の種類
const VALID_ADDRESS_TYPES = [
  "city",
  "town",
  "village",
  "municipality",
  "suburb",
  "administrative",
  "railway",
  "province",
];

// 検索結果として認める分類
const VALID_CLASSES = [
  "place",
  "boundary",
  "railway",
];

// この数値より重要度が低い場所は除外する（importance が0.3未満の場所は、都市として検索結果に採用するには重要度が低いため）
const MIN_IMPORTANCE = 0.3;

export async function geocodeCity(city: string, signal: AbortSignal): Promise<GeoPlace | null> { //cityにはユーザーの入力した都市名が入る。

  // 自作の汎用関数「fetchJson」を使い、地名をURLに入れて、Nominatimに問い合わせる -------- encodeURIComponent() で文字列をURLに入れられる形に変換
  const data = await fetchJson(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&countrycodes=jp`,signal,{"Accept-Language": "ja",});

  if (!Array.isArray(data) || data.length === 0) { //戻り値は配列か？　空なのか？　判定
    return null;
  }

  // 配列の1件目を取得する
  const place: unknown = data[0]; //配列0番目に格納されたオブジェクトを取得。 中身の例: {name: "東京都",lat: "35.6762",lon: "139.6503",addresstype: "province",class: "boundary",importance: 0.9}

  if (!isRecord(place)) { // 自作の汎用関数「isRecord」でplace が「オブジェクト」か確認する
    return null;
  }

  //検索結果が「本当に地名として使ってよいものか」を確認。
  const isPlace =
    typeof place.addresstype === "string" &&
    VALID_ADDRESS_TYPES.includes(place.addresstype) &&

    typeof place.class === "string" &&
    VALID_CLASSES.includes(place.class) &&

    isNumber(place.importance) &&
    place.importance > MIN_IMPORTANCE;

  if (!isPlace) { // 条件を満たさなければ終了
    return null;
  }

  //さらに、検索結果の「name / lat / lon が文字か」を確認。
  if (typeof place.name !== "string" || typeof place.lat !== "string" || typeof place.lon !== "string") {
    return null;
  }

  // ★ すべてのチェックを通過したので、必要な3つの値だけを戻り値として返す。（addresstype / class / importance などは、正しい検索結果かを判定するためだけに使用）
  return {
    name: place.name,
    lat: place.lat,
    lon: place.lon,
  };
}


/*-------------------------------------------------------------
ユーザーが「現在地ボタン」から取得した「緯度・経度」を受け取り、「地名」を返す関数。

「緯度・経度」を使用し、APIにアクセスして「地名」を返すだけ。その後、他との関数連携などもなく、ただ現在地検索後の「場所名」を表示させる用途。
戻り値の例 : 福岡
-------------------------------------------------------------*/

export async function reverseGeocode(latitude: number,longitude: number,signal: AbortSignal): Promise<string> {

  const data = await fetchJson(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,signal,{"Accept-Language": "ja",});
  // 緯度・経度でアクセスした場合は、以下のような形で始めからオブジェクト形式で帰ってくる。　都市名検索のように候補が多くないため。
  //
  // 例
  // {
  //   "name": "東京都",
  //   "lat": "35.6762",
  //   "lon": "139.6503",
  //   "address": {
  //     "city": "東京都",
  //     "country": "日本"
  //   }
  // }

  // データがオブジェクトではない、または address が存在しない場合は、「現在地」と抽象的にする。
  if (!isRecord(data) || !isRecord(data.address)) {
    return "現在地";
  }

  const address = data.address;

  //city → town → village → countyの順番で地名を探します。最初に見つかったstringを使用します。
  const name = [address.city,address.town,address.village,address.county,].find((value) => typeof value === "string");

  return typeof name === "string" ? name : "現在地";
}


/*-------------------------------------------------------------
Open-Meteoという天気APIから「現在の天気」「数日分の天気」を取得し、返す関数。
緯度・経度 → 天気


データが想定した形でなければ null を返します。
-------------------------------------------------------------*/

export async function fetchWeather(latitude: string | number, longitude: string | number, signal: AbortSignal): Promise<{current: CurrentWeather; daily: DailyWeather;} | null> {
  const data = await fetchJson(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`,
    signal
  );

  if (!isRecord(data)) {
    return null;
  }

  /*============================================================================
  現在の天気をチェック（今日）
  ============================================================================*/
  const current = data.current_weather;
  //　以下のような形で取得できるので、その中のcurrent_weatherに対しての処理
  //    {
  //      "current_weather": { "temperature": 22.1, "windspeed": 12.7, "weathercode": 61 },
  //      "daily": { "time": [...], "weathercode": [...], "temperature_2m_max": [...], "temperature_2m_min": [...]
  //    }

  //current_weather が、「オブジェクトか？」「temperature → numberか？」「windspeed → numberか？」「・weathercode → numberか？」か確認。
  if (!isRecord(current) || !isNumber(current.temperature) || !isNumber(current.windspeed) || !isNumber(current.weathercode)) {
    return null;
  }


  /*============================================================================
  天気をチェック（数日分）
  ============================================================================*/
  const daily = data.daily;

  //daily も、同様に確認。
  if (!isRecord(daily) || !isStringArray(daily.time) || !isNumberArray(daily.weathercode) || !isNumberArray(daily.temperature_2m_max) || !isNumberArray(daily.temperature_2m_min)) {
    return null;
  }


  /*============================================================================
  全部チェックOK。　以下の形で渡せます。

  current → CurrentWeather
  daily   → DailyWeather
  ============================================================================*/
  return {
    current: {
      temperature: current.temperature,
      windspeed: current.windspeed,
      weathercode: current.weathercode,
    },

    daily: {
      time: daily.time,
      weathercode: daily.weathercode,
      temperature_2m_max: daily.temperature_2m_max,
      temperature_2m_min: daily.temperature_2m_min,
    },
  };
}


/*==============================================================================
現在地を取得する関数。

Geolocation APIは成功時・失敗時のコールバックを渡す形式になっている。
他関数との統一性を考慮し、Promiseに包んでいます。
==============================================================================*/

export function getCurrentPosition(): Promise<GeolocationPosition | null> { //以下書き方自体が、getCurrentPosition使用時のテンプレである。

  return new Promise((resolve) => { // Promiseを自作する場合は、中に無名関数が必須。かつ第一引数にはPromise側から「結果を確定する機能を持った関数」が渡されます。

    navigator.geolocation.getCurrentPosition( //getCurrentPosition() は、現在地の取得に成功すると、第1引数に渡された関数を実行し、その関数の第1引数に現在地情報を渡す。

      // 現在地の取得に成功
      (position) => { // position に現在地情報が入る(getCurrentPositionは、第1引数に自動で結果を渡す)
        resolve(position);
      },

      // 現在地の取得に失敗
      () => {
        resolve(null);
      }

    );
  });
}