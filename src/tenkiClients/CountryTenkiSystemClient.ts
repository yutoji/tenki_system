import { ITenkiSystemClient, IWeatherItem, WeatherType } from "../tenkiSystem/TenkiSystemBeta";


const CountryTenkiSystemClient: ITenkiSystemClient = {
  providerName: "国際天気局", // データ提供者名
  fetchWeatherItems: async () => { // 天気データの一覧取得
    const apiUrl = "https://api.mocki.io/v1/ff4c24d2";
    const res = await (await fetch(apiUrl)).json();
    const dataList: Array<any> = res["data"] || [] as Array<any>;
    const items: IWeatherItem[] = dataList.map(apiDataToWeatherItem).filter(nonNullable)
    return items;
  },
  reportWeatherItem: async (item: IWeatherItem) => { // 特定の天気データを通報する
    console.log("国際天気局の通報APIが呼ばれました", item.id);
  },
}

export default CountryTenkiSystemClient;


const apiDataToWeatherItem = (dataRaw: any): IWeatherItem | null => {
  if (dataRaw["code"] === undefined) {
    // country APIはたまに id がない無効なデータを返すのでその場合は無視
    return null;
  }

  const item: IWeatherItem = {
    id: `${dataRaw["code"]}`,
    place: `${dataRaw["label"]}`,
    weather: (() => {
      switch (dataRaw["tenki"] || dataRaw["weather"]) {
        case "晴":
          return WeatherType.Sunny;
        case "曇":
          return WeatherType.Cloudy;
        case "雨":
          return WeatherType.Rainy;
        default:
          return WeatherType.Unknown
      }
    })(),
  };
  if (item.place === "臺灣") {
    item.place = "台湾";
  }

  return item
}

const nonNullable = <T>(value: T): value is NonNullable<T> => value != null;