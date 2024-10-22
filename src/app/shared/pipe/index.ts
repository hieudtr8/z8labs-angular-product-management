import { CurrencyPipe } from "./currency-format.pipe";
import { DateFormatPipe } from "./date-format.pipe";

const sharedPipes = [
  DateFormatPipe,
  CurrencyPipe
]

export default sharedPipes;
