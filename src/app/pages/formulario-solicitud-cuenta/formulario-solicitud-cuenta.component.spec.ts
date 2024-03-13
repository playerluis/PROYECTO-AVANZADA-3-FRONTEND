import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormularioSolicitudCuentaComponent} from './formulario-solicitud-cuenta.component';
import {AccountServiceService, Message} from "../../services/account-service.service";
import {ActivatedRoute} from "@angular/router";
import Account from "../../models/Accounts";
import {of} from "rxjs";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('FormularioSolicitudCuentaComponent', () => {
	let component: FormularioSolicitudCuentaComponent;
	let fixture: ComponentFixture<FormularioSolicitudCuentaComponent>;
	let mockAccountService: jasmine.SpyObj<AccountServiceService>;
	
	beforeEach(async () => {
		
		mockAccountService = jasmine.createSpyObj('AccountServiceService', ['createAccount']);
		
		await TestBed.configureTestingModule({
			imports: [FormularioSolicitudCuentaComponent, BrowserAnimationsModule],
			providers: [
				{provide: AccountServiceService, useValue: mockAccountService},
				{provide: ActivatedRoute, useValue: {}},
			]
		})
		.compileComponents();
		
		fixture = TestBed.createComponent(FormularioSolicitudCuentaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});
	
	it('should create', () => {
		expect(component).toBeTruthy();
	});
	
	
	it('should initialize form on ngOnInit', () => {
		component.ngOnInit();
		expect(component.form).toBeDefined();
	});
	
	it('should call createAccount on submit when form is valid', () => {
		const account = {
			names: 'John',
			lastnames: 'Doe',
			email: 'john.doe@example.com',
			ci: '2300826357',
			sexo: 'Masculino',
			age: 25,
			reason: 'Test reason',
			fingerprintcode: 'V4444V4444',
			termsandconditions: true
		};
		
		const message: Message = {message: 'Account created'};
		mockAccountService.createAccount.and.returnValue(of(message));
		component.form.setValue(account);
		component.submit();
		expect(mockAccountService.createAccount).toHaveBeenCalledWith(account as unknown as Account);
	});
	
	it('should not call createAccount on submit when form is invalid', () => {
		
		const invalidAccount = {
			names: 'John',
			lastnames: 'Doe',
			email: 'aaa',
			ci: '2300826355',
			sexo: 'M',
			age: 25,
			reason: 'Test reason',
			fingerprintcode: 'asdasd',
			termsandconditions: false
		};
		
		component.form.setValue(invalidAccount);
		component.submit();
		expect(mockAccountService.createAccount).not.toHaveBeenCalled();
		expect(component.form.valid).toBeFalsy();
		
	});
});
