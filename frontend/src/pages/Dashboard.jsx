import { useState, useEffect } from "react"
import YearSelect from "@/components/ui/YearSelect"
import CompanySelect from "@/components/ui/CompanySelect"
import QuarterSelect from "@/components/ui/QuarterSelect"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Dashboard() {
  const [year, setYear] = useState("")
  const [company, setCompany] = useState("")
  const [quarter, setQuarter] = useState("")

  const [companies, setCompanies] = useState([])
  const [years, setYears] = useState([])
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    fetch("http://localhost:8000/api/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data.companies || []))

    fetch("http://localhost:8000/api/years")
      .then((res) => res.json())
      .then((data) => setYears(data.years || []))
  }, [])

  const fetchSummary = () => {
    let url = "http://localhost:8000/api/summary"
    const params = []
    if (company) params.push(`company=${encodeURIComponent(company)}`)
    if (year) params.push(`year=${year}`)
    if (quarter) params.push(`quarter=${quarter}`)
    if (params.length > 0) url += `?${params.join("&")}`

    fetch(url)
      .then((res) => res.json())
      .then((data) => setSummary(data.summary || null))
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">FinSight Dashboard</h1>

      <div className="flex gap-4">
        <YearSelect value={year} onChange={setYear} options={years} />
        <CompanySelect value={company} onChange={setCompany} options={companies} />
        <QuarterSelect value={quarter} onChange={setQuarter} />
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
  )
}
