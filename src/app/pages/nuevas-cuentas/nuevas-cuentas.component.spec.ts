import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NuevasCuentasComponent} from './nuevas-cuentas.component';
import {ActivatedRoute} from "@angular/router";
import {AccountServiceService, Message} from "../../services/account-service.service";
import Account from "../../models/Accounts";
import {Observable, of, throwError} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import Swal, {SweetAlertResult} from "sweetalert2";

const accounts: Account[] = [
	{
		id: "asd",
		names: "test",
		lastnames: "test",
		email: "aaa@qq.com",
		age: 20,
		fingerprintcode: "V4444V4444",
		sexo: "Masculino",
		reason: "test",
		pictureId: "test",
		firstApprove: false,
		secondApprove: false,
		ci: "2222222222"
	}, {
		id: "asd",
		names: "test",
		lastnames: "test",
		email: "aaaq@aaa.cc",
		age: 20,
		fingerprintcode: "V4444V4444",
		sexo: "Masculino",
		reason: "test",
		pictureId: "test",
		firstApprove: false,
		secondApprove: false,
		ci: "2222222222"
	}
]
describe('IndexComponent', () => {
	let component: NuevasCuentasComponent;
	let fixture: ComponentFixture<NuevasCuentasComponent>;
	let mockAccountService: jasmine.SpyObj<AccountServiceService>;
	
	beforeEach(async () => {
		
		mockAccountService = jasmine.createSpyObj<AccountServiceService>('AccountServiceService', ['getNewAccounts', 'approveFirstStep', 'rejectAccount']);
		
		await TestBed.configureTestingModule({
			imports: [NuevasCuentasComponent, HttpClientTestingModule],
			providers: [
				{provide: AccountServiceService, useValue: mockAccountService},
				{provide: ActivatedRoute, useValue: {}}
			]
		})
		.compileComponents();
		
		mockAccountService.getNewAccounts.and.returnValue(of(accounts));
		
		fixture = TestBed.createComponent(NuevasCuentasComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		
		
	});
	
	it('should create', () => {
		expect(component).toBeTruthy();
	});
	
	it('should  call getNewAccounts on init', async () => {
		await component.ngOnInit();
		expect(mockAccountService.getNewAccounts).toHaveBeenCalled();
		expect(component.accounts).toEqual(accounts);
	});
	
	
	it('should call getNewAccounts on loadAccounts [ERROR]', async () => {
		
		mockAccountService.getNewAccounts.and.returnValue(throwError(() => new Error('test')));
		
		spyOn(Swal, 'fire').and.returnValue(Promise.resolve<SweetAlertResult>({
			dismiss: Swal.DismissReason.cancel,
			isConfirmed: false,
			isDenied: false,
			value: undefined,
			isDismissed: true
		}));
		
		await component.loadAccounts().then(() => {}).catch(() => {});
		
		expect(mockAccountService.getNewAccounts).toHaveBeenCalled();
	});
	
	it('should approve the first step', async () => {
		const accounts: Account = {
			id: "asd",
			names: "test",
			lastnames: "test",
			email: "aaa@qq.com",
			age: 20,
			fingerprintcode: "V4444V4444",
			sexo: "Masculino",
			reason: "test",
			pictureId: "test",
			firstApprove: false,
			secondApprove: false,
			ci: "2222222222"
		};
		
		spyOn(component, 'showMessage');
		spyOn(component, 'loadAccounts');
		
		const message: Message = {message: 'Aprobado'};
		mockAccountService.approveFirstStep.and.returnValue(of(message));
		
		await component.accept(accounts);
		
		expect(component.showMessage).toHaveBeenCalledWith("Cuenta aceptada", "La cuenta cumplió con los requisitos de la primera fase, se le ha enviado un correo para continuar con el proceso de verificación de identidad", "success");
		expect(component.loadAccounts).toHaveBeenCalled();
		
	})
	
	it('should reject the first step', async () => {
		const accounts: Account = {
			id: "asd",
			names: "test",
			lastnames: "test",
			email: "aaaq@aaa.cc",
			age: 20,
			fingerprintcode: "V4444V4444",
			sexo: "Masculino",
			reason: "test",
			pictureId: "test",
			firstApprove: false,
			secondApprove: false,
			ci: "2222222222"
		};
		const reason = "test";
		
		spyOn(component, 'showMessage');
		spyOn(component, 'loadAccounts');
		
		const message: Message = {message: 'Rechazado'};
		mockAccountService.rejectAccount.and.returnValue(of(message));
		spyOn(Swal, 'fire').and.returnValue(Promise.resolve<SweetAlertResult>({
			isConfirmed: true,
			value: reason,
			isDenied: false,
			isDismissed: false
		}));
		
		await component.deny(accounts);
		
		expect(component.showMessage).toHaveBeenCalledWith("Cuenta rechazada", "La cuenta ha sido rechazada", "success");
		expect(component.loadAccounts).toHaveBeenCalled();
	})
	
});
