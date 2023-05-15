import React, { useEffect, useState } from "react";
import tradesRepository from "../repositories/tradesRepository";
import moment from "moment/moment";
import { Line } from "@ant-design/plots";
import { Pie } from "@ant-design/plots";

function About() {
  const [data, setData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  function calculateTotalCostPerFullName(data) {
    const result = {};
    data.forEach((item) => {
      if (result[item.fullName]) {
        result[item.fullName] += item.totalCost;
      } else {
        result[item.fullName] = item.totalCost;
      }
    });
    return Object.entries(result).map(([fullName, totalCost]) => ({
      fullName,
      totalCost,
    }));
  }

  useEffect(() => {
    tradesRepository
      .getTrades()
      .then((res) => {
        const parsedData = res.data
          .sort((a, b) => {
            return (
              new Date(a.supplyDate).getTime() -
              new Date(b.supplyDate).getTime()
            );
          })
          .map((item) => ({
            supplyDate: moment(item.supplyDate).format("DD-MM-YYYY"),
            totalCost: item.fullCost,
            fullName: `${item.users[0].person.name} ${item.users[0].person.surname}`,
          }));

        setData(parsedData);

        setPieChartData(calculateTotalCostPerFullName(parsedData));
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const config = {
    data,
    padding: "auto",
    xField: "supplyDate",
    yField: "totalCost",
    style: {
      height: 500,
    },
    xAxis: {
      tickCount: 5,
    },
    slider: {
      start: 0,
      end: 1,
    },
  };

  const pieChartConfig = {
    appendPadding: 0,
    data: pieChartData,
    angleField: "totalCost",
    colorField: "fullName",
    radius: 0.8,
    style: {
      height: 307,
    },
    legend: true,
  };

  console.log(pieChartData);

  return (
    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
      <div style={{ width: "400px" }}>
        <Pie {...pieChartConfig} />
      </div>
      <div style={{width: "650px", margin: "30px"}}>
        <Line {...config} />
      </div>
    </div>
  );
}

export default About;
