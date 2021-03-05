import { ITenkiSystemClient, IWeatherItem, WeatherType } from "../tenkiSystem/TenkiSystemBeta";

const MockTenkiSystemClient: ITenkiSystemClient = {
  providerName: "もっく天気局", // データ提供者名
  fetchWeatherItems: async () => { // 天気データの一覧取得
    return [
      {
        id: "example1",
        weather: WeatherType.Sunny,
        place: "おれん家",
        temperature: 10.0,
      },
      {
        id: "example1",
        weather: WeatherType.Rainy,
        place: "となりの家",
        temperature: -30.0,
      },
    ]
  },
  reportWeatherItem: async (item: IWeatherItem) => { // 特定の天気データを通報する
    console.log("もっく天気局の通報APIが呼ばれました", item.id);
  },
}

export default MockTenkiSystemClient;
