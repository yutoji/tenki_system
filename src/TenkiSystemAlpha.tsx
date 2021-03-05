/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";

type SystemTypes = "country" | "prefecture";

function TenkiSystemAlpha({ type }: { type: SystemTypes }) {
  const [dataList, setDataList] = useState([]);

  // 初回起動時にAPIを叩いて天気データ一覧を取得
  useEffect(() => {
    (async () => {
      const apiUrl =
        (type === "prefecture" && "https://api.mocki.io/v1/0c52d16a") ||
        (type === "country" && "https://api.mocki.io/v1/ff4c24d2") ||
        "";
      const res = await (await fetch(apiUrl)).json();
      const newDataList =
        (type === "prefecture" && res) ||
        (type === "country" && res.data) ||
        [];
      setDataList(newDataList);
    })();
  }, [type]);

  const title =
    (type === "prefecture" && "都道府県天気管理局") ||
    (type === "country" && "国際天気局") ||
    "";

  return (
    <div
      style={{
        borderBottom: "solid 1px gray",
        paddingBottom: 30,
        marginBottom: 30,
      }}
    >
      <div style={{ textAlign: "left" }}>
        {dataList.map((dataRaw, i) => (
          <LocationView type={type} dataRaw={dataRaw} key={i} />
        ))}
      </div>
      <div style={{ textAlign: "center", fontSize: 16 }}>
        （提供： {title}）
      </div>
    </div>
  );
}

function LocationView({ type, dataRaw }: { type: SystemTypes; dataRaw: any }) {
  let data: {
    id: string;
    place: string;
    weather: string;
    temperature?: number;
  };

  if (type === "prefecture") {
    data = {
      id: `${dataRaw["id"]}`,
      place: `${dataRaw["prefecture"]}`,
      weather: (() => {
        switch (dataRaw["weather"]) {
          case 1:
            return "☀";
          case 2:
            return "☁";
          case 3:
            return "☂";
          default:
            return "不明";
        }
      })(),
      temperature: dataRaw.temperature as number,
    };
  } else if (type === "country") {
    if (dataRaw["code"] === undefined) {
      // country APIはたまに id がない無効なデータを返すのでその場合は無視
      return null;
    }
    data = {
      id: `${dataRaw["code"]}`,
      place: `${dataRaw["label"]}`,
      weather: (() => {
        switch (dataRaw["tenki"] || dataRaw["weather"]) {
          case "晴":
            return "☀";
          case "曇":
            return "☁";
          case "雨":
            return "☂";
          default:
            return "不明";
        }
      })(),
    };
    if (data.place === "臺灣") {
      data.place = "台湾";
    }
  } else {
    throw new Error("Unknown type");
  }

  const onReportClick = useCallback(
    async (e) => {
      const departureName =
        (type === "prefecture" && "都道府県天気管理局") ||
        (type === "country" && "国際天気局");
      if (
        !window.confirm(
          `この天気（地域ID: ${data.id}）が間違いであると、${departureName}に通報しますか？`
        )
      ) {
        return;
      }
      if (type === "country") {
        await postReportToCountryDepart(data.id);
      } else if (type === "prefecture") {
        await postReportToPrefectureDepart(data.id);
      }
      window.alert(
        `通報しました。通報先：${departureName}, 通報した地域ID: ${data.id}`
      );
    },
    [type, data.id]
  );

  return (
    <p>
      【{data.place}】 {data.weather}
      {"　"}
      {data.temperature && `${data.temperature}℃`}
      <button onClick={onReportClick} style={{ marginLeft: 12 }}>
        通報
      </button>
    </p>
  );
}

export default TenkiSystemAlpha;

async function postReportToPrefectureDepart(id: string) {
  console.log("都道府県天気局の通報APIが呼ばれました", id);
}

async function postReportToCountryDepart(id: string) {
  console.log("国際天気局の通報APIが呼ばれました", id);
}
