import { ChevronDownIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { DayPicker } from "react-day-picker";
import { ReactEventHandler } from "react";
import { Calendar } from "./calendar";

interface Props {
    date: Date | undefined
    placeholder?: string
    onSelectDate: (date: Date | undefined) => void
}

export default function DateInput({
  date,
  placeholder = 'Selecione uma data',
  onSelectDate
}: Props){
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    id="date"
                    className="w-48 justify-between font-normal"
                >
                {date ? new Date(date).toLocaleDateString('pt-BR') : placeholder}
                <ChevronDownIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={onSelectDate}
                />
            </PopoverContent>
        </Popover>
    )
}