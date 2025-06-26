import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [companies, setCompanies] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/companies")
      .then(res => res.json())
      .then(data => setCompanies(data.companies));

    fetch("http://localhost:8000/api/years")
      .then(res => res.json())
      .then(data => setYears(data.years));
  }, []);

  const fetchSummary = () => {
    let url = `http://localhost:8000/api/summary`;
    const params = [];
    if (selectedCompany) params.push(`company=${encodeURIComponent(selectedCompany)}`);
    if (selectedYear) params.push(`year=${selectedYear}`);
    if (params.length > 0) url += `?${params.join("&")}`;

    fetch(url)
      .then(res => res.json())
      .then(data => setSummary(data.summary));
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">FinSight Dashboard</h1>

      <div className="flex gap-4">
        <Select onValueChange={setSelectedCompany}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select company" />
          </SelectTrigger>
          <SelectContent>
            {companies.map(c => (
              <SelectItem key={c} value={c} onClick={setSelectedCompany}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map(y => (
              <SelectItem key={y} value={y} onClick={setSelectedYear}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={fetchSummary}>Load Summary</Button>
      </div>

      {summary && (
        <Card className="w-full">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Summary</h2>
            <ul className="space-y-1 text-sm">
              <li><strong>Total Entries:</strong> {summary.total_entries}</li>
              <li><strong>Total Revenue:</strong> €{summary.total_revenue?.toLocaleString()}</li>
              <li><strong>Average ROA:</strong> {summary.avg_roa?.toFixed(2)}%</li>
              <li><strong>Average ROE:</strong> {summary.avg_roe?.toFixed(2)}%</li>
              <li><strong>Latest Year in Data:</strong> {summary.latest_year}</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
