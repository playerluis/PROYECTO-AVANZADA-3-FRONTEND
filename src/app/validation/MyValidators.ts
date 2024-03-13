import {
	AbstractControl,
	ValidationErrors,
	ValidatorFn,
	Validators
} from "@angular/forms";

export default class MyValidators {
	
	public static get ci(): ValidatorFn {
		
		return (control: AbstractControl): ValidationErrors | null => {
			
			const value = control.value;
			if (!value) {
				return Validators.required(control);
			}
			
			const validLength = 10;
			
			if (!/^\d{10}$/.test(value)) {
				return {'invalidFormat': {requiredFormat: '##########',},};
			}
			
			if (value.length !== validLength) {
				return {
					'invalidLength': {
						requiredLength: validLength,
					}
				};
			}
			
			const cedula = value.split('').map(Number);
			
			const sum = range(0, 9)
			.map(i => cedula[i] * (i % 2 == 0 ? 2 : 1))
			.map(i => i > 9 ? i - 9 : i)
			.reduce(sumreducer, 0);
			
			const calculatedLastDigit = (sum % 10 === 0) ? 0 : 10 - (sum % 10);
			
			if (calculatedLastDigit !== cedula[9]) {
				return {'invalidCi': true};
			}
			return null;
		};
	}
	
	public static get fingerprint(): ValidatorFn {
		
		return (control: AbstractControl): ValidationErrors | null => {
			const value = control.value;
			if (!value) {
				return Validators.required(control);
			}
			
			if (/^[A-Z]\d{4}[A-Z]\d{4}$/i.test(value)) {
				return null;
			}
			
			return {'invalidFormat': {requiredFormat: 'X####X####'}};
			
		}
	}
	
	
	public static get termsAndConditions(): ValidatorFn {
		
		return (control: AbstractControl): ValidationErrors | null => {
			const value = control.value;
			if (!value) {
				return {'notAcceptedTermsAndConditions': true};
			}
			return null;
		}
	}
	
}

const range = (minInclusice: number, maxExclusive: number) => {
	const result = [];
	for (let i = minInclusice; i < maxExclusive; i++) {
		result.push(i);
	}
	return result;
}

const sumreducer = (a: number, b: number) => a + b;

