import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export default function CompanySelect({ value, onChange, options }) {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        {value || "Select company"}
      </SelectTrigger>
      <SelectContent>
        {options.map((company) => (
          <SelectItem key={company} value={company}>
            {company}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
