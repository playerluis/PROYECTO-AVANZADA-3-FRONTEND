import {ErrorStateMatcher} from "@angular/material/core";
import { Injectable } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm} from "@angular/forms";


//se lanzara cuando el control sea invalido y se haya tocado o se haya enviado el formulario
@Injectable({
	providedIn: 'root'
})
export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		
		const isSubmitted = form && form.submitted;
		
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}