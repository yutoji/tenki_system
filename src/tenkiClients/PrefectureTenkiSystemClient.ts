import { ITenkiSystemClient, IWeatherItem, WeatherType } from "../tenkiSystem/TenkiSystemBeta";


const PrefectureTenkiSystemClient: ITenkiSystemClient = {
  providerName: "国際天気局", // データ提供者名
  fetchWeatherItems: async () => { // 天気データの一覧取得
    const apiUrl = "https://api.mocki.io/v1/0c52d16a";
    const res = await (await fetch(apiUrl)).json();
    const dataList: Array<any> = res || [] as Array<any>;
    const items: IWeatherItem[] = dataList.map(apiDataToWeatherItem).filter(nonNullable)
    return items;
  },
  reportWeatherItem: async (item: IWeatherItem) => { // 特定の天気データを通報する
    console.log("都道府県天気局の通報APIが呼ばれました", item.id);
  },
}

export default PrefectureTenkiSystemClient;


const apiDataToWeatherItem = (dataRaw: any): IWeatherItem | null => {
  console.log(dataRaw)

  const item: IWeatherItem = {
    id: `${dataRaw["id"]}`,
    place: `${dataRaw["prefecture"]}`,
    weather: (() => {
      switch (dataRaw["weather"]) {
        case 1:
          return WeatherType.Sunny;
        case 2:
          return WeatherType.Cloudy;
        case 3:
          return WeatherType.Rainy;
        default:
          return WeatherType.Unknown
      }
    })(),
    temperature: Number(dataRaw["temperature"]) || undefined
  };

  return item
}

const nonNullable = <T>(value: T): value is NonNullable<T> => value != null;