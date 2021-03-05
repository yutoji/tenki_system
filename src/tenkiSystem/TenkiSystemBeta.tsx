/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";

// 天気の種類
export enum WeatherType {
  Sunny,
  Cloudy,
  Rainy,
  Unknown,
}

// 天気のアイテム（地域ID、地域名、気温、天気）
export type IWeatherItem = {
  id: string;
  place: string;
  temperature?: number;
  weather: WeatherType;
};

// 天気システムの利用者側のインターフェース
export type ITenkiSystemClient = {
  providerName: string; // データ提供者名
  fetchWeatherItems: () => Promise<IWeatherItem[]>; // 天気データの一覧取得
  reportWeatherItem: (item: IWeatherItem) => Promise<void>; // 特定の天気データを通報する
};

/**
 * 天気システム！
 */
function TenkiSystemBeta({ client }: { client: ITenkiSystemClient }) {
  const [weatherItems, setWeatherItems] = useState<IWeatherItem[]>([]);

  // 初回起動時にAPIを叩いて天気データ一覧を取得
  useEffect(() => {
    (async () => {
      const items = await client.fetchWeatherItems();
      setWeatherItems(items);
    })();
  }, [client]);

  const reportItem = useCallback(
    async (item: IWeatherItem) => {
      if (
        !window.confirm(
          `この天気（地域ID: ${item.id}）が間違いであると、${client.providerName}に通報しますか？`
        )
      ) {
        return;
      }
      await client.reportWeatherItem(item);
      window.alert(
        `通報しました。通報先：${client.providerName}, 通報した地域ID: ${item.id}`
      );
    },
    [client]
  );

  return (
    <div
      style={{
        borderBottom: "solid 1px gray",
        paddingBottom: 30,
        marginBottom: 30,
      }}
    >
      <div style={{ textAlign: "left" }}>
        {weatherItems.map((item, i) => (
          <WeatherItemView item={item} reportItem={reportItem} key={i} />
        ))}
      </div>
      <div style={{ textAlign: "center", fontSize: 16 }}>
        （提供： {client.providerName}）
      </div>
    </div>
  );
}

// ひとつの天気アイテムの表示コンポーネント
function WeatherItemView({
  item,
  reportItem,
}: {
  item: IWeatherItem;
  reportItem: (item: IWeatherItem) => Promise<void>;
}) {
  const onReportClick = useCallback(async () => {
    reportItem(item);
  }, [item, reportItem]);

  const weatherLabel = getWeatherLabel(item.weather);

  return (
    <p>
      【{item.place}】 {weatherLabel}
      {"　"}
      {item.temperature && `${item.temperature}℃`}
      <button onClick={onReportClick} style={{ marginLeft: 12 }}>
        通報
      </button>
    </p>
  );
}

export default TenkiSystemBeta;

// WeatherTypeの天気記号を返す
const getWeatherLabel = (weatherType: WeatherType): string => {
  switch (weatherType) {
    case WeatherType.Sunny:
      return "☀";
    case WeatherType.Cloudy:
      return "☁";
    case WeatherType.Rainy:
      return "☂";
    default:
      return "不明";
  }
};
