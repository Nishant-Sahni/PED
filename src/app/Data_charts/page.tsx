"use client";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";
import BranchOutsideChart from "./classifybybranch";
import InsideOutsideChart from "./piechart";
import TypeDistributionChart from "./barchart";
import DailyOutsideChart from "./dailyoutsidechart";
import YearChart from "./Yearchart";
import DailyEntryTrends from "./Linecharts"; // People going out on one day
import LateEntryTrends from "./EntryTrends"; // Late entries
import "../styles/globals.css";

const Dashboard = () => {
  const [typeData, setTypeData] = useState<{ [key: string]: number }>({});
  const [insideCount, setInsideCount] = useState(0);
  const [outsideCount, setOutsideCount] = useState(0);
  const [dailyOutsideData, setDailyOutsideData] = useState<{ [date: string]: number }>({});
  const [yearData, setYearData] = useState<{ [year: string]: number }>({});
  const [dailyEntryTrends, setDailyEntryTrends] = useState<{ date: string; count: number }[]>([]);
  const [lateEntryTrends, setLateEntryTrends] = useState<{ date: string; normal: number; late: number }[]>([]);
  const [branchOutsideData, setBranchOutsideData] = useState<{ [branch: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "entries"));
        const typeCounts: { [key: string]: number } = {};
        const dailyCounts: { [date: string]: number } = {};
        const yearCounts: { [key: string]: number } = {};
        const trends: { [date: string]: { normal: number; late: number } } = {};
        const dailyTrends: { [date: string]: number } = {};
        const branchCounts: { [branch: string]: { total: number; inside: number } } = {};

        let inside = 0;
        let outside = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const userId = data.user?.id || "Unknown";
          const type = data.type || "Unknown";
          const timeIn = data.time_in && !isNaN(data.time_in) ? data.time_in : null;
          const timeOut = data.time_out && !isNaN(data.time_out) ? data.time_out : null;

          if (timeIn) {
            const entryDate = new Date(timeIn * 1000).toISOString().split("T")[0];
            const isLate = false;

            if (trends[entryDate]) {
              trends[entryDate].normal += 1;
            } else {
              trends[entryDate] = { normal: 1, late: 0 };
            }

            if (!trends[entryDate]) {
              trends[entryDate] = { normal: 0, late: 0 };
            }
          }

          if (timeOut) {
            const outDate = new Date(timeOut * 1000).toISOString().split("T")[0];
            dailyTrends[outDate] = (dailyTrends[outDate] || 0) + 1;
            dailyCounts[outDate] = (dailyCounts[outDate] || 0) + 1;
          }

          typeCounts[type] = (typeCounts[type] || 0) + 1;

          if (!timeIn && timeOut) {
            outside += 1;
          }
          const total = 4000;
          inside = total - outside;

          if (data.user && data.user.entry_number) {
            const entryNumber = data.user.entry_number;
            const year = entryNumber.slice(0, 4);
            yearCounts[year] = (yearCounts[year] || 0) + 1;

            const branch = entryNumber.slice(4, 7);
            if (!branchCounts[branch]) {
              branchCounts[branch] = { total: 0, inside: 0 };
            }
            branchCounts[branch].total += 1;
            if (!timeIn && timeOut) {
              branchCounts[branch].inside += 1;
            }
          }
        });

        // Calculate outside counts for each branch
        const branchOutsideCounts = Object.keys(branchCounts).reduce((acc, branch) => {
          acc[branch] = branchCounts[branch].total - branchCounts[branch].inside;
          return acc;
        }, {});

        setBranchOutsideData(branchOutsideCounts);
        setTypeData(typeCounts);
        setInsideCount(inside);
        setOutsideCount(outside);
        setDailyOutsideData(dailyCounts);
        setYearData(yearCounts);
        setLateEntryTrends(Object.entries(trends).map(([date, counts]) => ({ date, ...counts })));
        setDailyEntryTrends(Object.entries(dailyTrends).map(([date, count]) => ({ date, count })));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="text-lg font-semibold text-center mb-4">Inside vs Outside</h2>
          <InsideOutsideChart insideCount={insideCount} outsideCount={outsideCount} />
        </div>
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="text-lg font-semibold text-center mb-4">Type Distribution</h2>
          <TypeDistributionChart typeData={typeData} />
        </div>
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="text-lg font-semibold text-center mb-4">Daily Outside</h2>
          <DailyOutsideChart dailyData={dailyOutsideData} />
        </div>
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="text-lg font-semibold text-center mb-4">Year-wise Distribution</h2>
          <YearChart yearData={yearData} />
        </div>
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="text-lg font-semibold text-center mb-4">Daily Entry Trends</h2>
          <DailyEntryTrends trends={dailyEntryTrends} />
        </div>
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="text-lg font-semibold text-center mb-4">Late vs Normal Entry Trends</h2>
          <LateEntryTrends data={lateEntryTrends} />
        </div>
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="text-lg font-semibold text-center mb-4">Branch-wise Outside Count</h2>
          <BranchOutsideChart branchData={branchOutsideData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
