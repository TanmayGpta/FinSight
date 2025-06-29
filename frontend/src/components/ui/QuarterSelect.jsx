import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

const quarters = ["Q1", "Q2", "Q3", "Q4"]

export default function QuarterSelect({ value, onChange }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Select Quarter" />
      </SelectTrigger>
      <SelectContent>
        {quarters.map((q) => (
          <SelectItem key={q} value={q}>
            {q}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
