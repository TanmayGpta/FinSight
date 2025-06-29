import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export default function YearSelect({ value, onChange, options }) {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-[150px]">
        {value || "Select year"}
      </SelectTrigger>
      <SelectContent>
        {options.map((year) => (
          <SelectItem key={year} value={year}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
