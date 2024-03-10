import {Component, OnDestroy} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormControlDefinition} from "../../models/FormControlDefinition";
import MyValidators from "../../validation/MyValidators";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MyErrorStateMatcher} from "../../validation/MyErrorStateMatcher";
import {MatToolbarModule} from "@angular/material/toolbar";
import swaal from 'sweetalert2';
import {AccountServiceService} from "../../services/account-service.service";
import Account from "../../models/Accounts";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Subscription} from "rxjs";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";

@Component({
	selector: 'app-formulario-solicitud-cuenta',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		FormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatOptionModule,
		MatSelectModule,
		MatButtonModule,
		MatCardModule,
		MatListModule,
		MatCheckboxModule,
		MatToolbarModule,
		MatProgressSpinner,
		MatIcon,
		RouterLink
	],
	templateUrl: './formulario-solicitud-cuenta.component.html',
	styleUrl: './formulario-solicitud-cuenta.component.css'
})
export class FormularioSolicitudCuentaComponent implements OnDestroy {
	
	inputs: FormControlDefinition[] = [
		{
			name: "names",
			control: new FormControl('', [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(50)
			]),
			label: "Nombres",
			type: "text"
		},
		{
			name: "lastnames",
			control: new FormControl('', [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(50)
			]),
			label: "Apellidos",
			type: "text"
		},
		{
			name: "ci",
			control: new FormControl('', [
				MyValidators.ci
			]),
			label: "CI",
			type: "text",
		},
		{
			name: "fingerprintcode",
			control: new FormControl('', [
				MyValidators.fingerprint
			]),
			label: "Codigo dactilar",
			type: "text",
		},
		{
			name: "email",
			control: new FormControl('', [
				Validators.required,
				Validators.email
			]),
			label: "Email",
			type: "email"
		},
		{
			name: "sexo",
			control: new FormControl('', [
				Validators.required
			]),
			label: "Sexo",
			type: "select",
			selectOptions: ["Masculino", "Femenino", "Otro"]
		},
		{
			name: "age",
			control: new FormControl('', [
				Validators.required,
				Validators.min(18),
				Validators.max(100)
			]),
			label: "Edad",
			type: "number"
		},
		{
			name: "reason",
			control: new FormControl('', [
				Validators.maxLength(500)
			]),
			label: "Motivo",
			type: "textarea"
		},
		{
			name: "termsandconditions",
			control: new FormControl(false, [
				MyValidators.termsAndConditions
			]),
			label: "Acepto los terminos y condiciones",
			type: "checkbox"
		}
	];
	
	form: FormGroup;
	
	sending = false;
	
	private createAccountSubscription?: Subscription;
	
	constructor(private formBuilder: FormBuilder, public matcher: MyErrorStateMatcher, private service: AccountServiceService) {
		this.form = this.buildForm();
	}
	
	controls = () => Object.values(this.form.controls);
	markAsTouched = (control: AbstractControl) => control.markAsTouched();
	
	private buildForm() {
		
		const formControls = this.inputs.reduce((acc, fcd) => {
			acc[fcd.name] = fcd.control;
			return acc;
		}, {} as { [key: string]: FormControl });
		
		return this.formBuilder.group(formControls);
	}
	
	onSubmit(event: Event) {
		event.preventDefault();
		
		this.sending = true;
		
		if (this.form.valid) {
			
			const nuevaCuenta: Account = this.form.value;
			console.log(nuevaCuenta);
			
			this.createAccountSubscription = this.service.createAccount(nuevaCuenta).subscribe({
				next: (response) => {
					console.log('Cuenta creada:', response);
					this.showMessage('Éxito', response.message, 'success');
					this.form.markAsUntouched();
					this.form.markAsPristine();
					this.form.reset();
					this.sending = false;
				},
				error: (err) => {
					// Se ejecuta cuando ocurre un error
					console.error('Error al crear la cuenta:', err);
					this.showMessage('Error', err.error.message || err.error || 'Ocurrió un error', 'error');
					this.sending = false;
				}
			});
			
			return;
		}
		
		this.controls().forEach(this.markAsTouched);
		this.sending = false;
	}
	
	showMessage(title: string, body: string, icon: 'success' | 'error' = 'success') {
		swaal.fire({
			title: title,
			text: body,
			icon: icon,
			confirmButtonText: 'Ok',
		});
	}
	
	ngOnDestroy() {
		if (this.createAccountSubscription) {
			this.createAccountSubscription.unsubscribe();
		}
	}
}