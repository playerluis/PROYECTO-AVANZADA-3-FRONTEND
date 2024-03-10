import {FormControl} from "@angular/forms";

export type FormControlDefinition = {
  control: FormControl,
  name: string,
  label: string,
  type: string,
  selectOptions?: string[]
}
