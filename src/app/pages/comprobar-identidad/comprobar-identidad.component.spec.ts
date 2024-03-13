import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ComprobarIdentidadComponent} from './comprobar-identidad.component';
import {AccountServiceService, Message} from "../../services/account-service.service";
import {of} from "rxjs";
import Account from "../../models/Accounts";
import PendingIndentityAccount from "../../models/PendingIndentityAccount";
import {ActivatedRoute} from "@angular/router";
import Swal, {SweetAlertResult} from "sweetalert2";

describe('ComprobarIdentidadComponent', () => {
	
	let component: ComprobarIdentidadComponent;
	let fixture: ComponentFixture<ComprobarIdentidadComponent>;
	let mockAccountService: jasmine.SpyObj<AccountServiceService>;
	
	beforeEach(async () => {
		
		mockAccountService = jasmine.createSpyObj('AccountServiceService', ['getPendingIdentityAccounts', 'approveIdentity', 'rejectAccount']);
		
		await TestBed.configureTestingModule({
			imports: [ComprobarIdentidadComponent],
			providers: [
				{provide: AccountServiceService, useValue: mockAccountService},
				{provide: ActivatedRoute, useValue: {}}
			]
		})
		.compileComponents();
		
		fixture = TestBed.createComponent(ComprobarIdentidadComponent);
		component = fixture.componentInstance;
	});
	
	it('should create', () => {
		expect(component).toBeTruthy();
	});
	
	
	it('should call loadAccounts on ngOnInit', () => {
		spyOn(component, 'loadAccounts');
		component.ngOnInit();
		expect(component.loadAccounts).toHaveBeenCalled();
	});
	
	it('should update pendingIndentityAccounts on loadAccounts', () => {
		
		const accounts: Account[] = [{
			id: '1',
			names: 'John',
			lastnames: 'Doe',
			email: 'john.doe@example.com',
			ci: '123456',
			pictureId: 'url',
			reason: 'test reason',
			sexo: 'M',
			age: 20,
			fingerprintcode: '123456',
			firstApprove: true,
			secondApprove: false,
		}];
		
		
		mockAccountService.getPendingIdentityAccounts.and.returnValue(of(accounts));
		component.loadAccounts();
		
		expect(component.pendingIndentityAccounts.length).toBe(1);
		expect(component.pendingIndentityAccounts[0].id).toBe('1');
		expect(component.pendingIndentityAccounts[0].completeName).toBe('John Doe');
	});
	
	it('should call approveIdentity on accept', () => {
		
		const pendingIndentityAccount: PendingIndentityAccount = {
			id: '1',
			completeName: 'John Doe',
			email: 'aaa@aaa.com',
			pictureId: 'url',
			ci: '2300826357',
		}
		const message: Message = {message: 'approved'};
		
		mockAccountService.approveIdentity.and.returnValue(of(message));
		component.accept(pendingIndentityAccount);
		expect(mockAccountService.approveIdentity).toHaveBeenCalledWith(pendingIndentityAccount.id);
	});
	
	it('should call rejectAccount on deny', async () => {
		const pendingIndentityAccount: PendingIndentityAccount = {
			id: '1',
			completeName: 'John Doe',
			email: 'aaa@aaa.com',
			pictureId: 'url',
			ci: '2300826357',
		}
		const message: Message = {message: 'rejected'};
		const reason = 'test reason';
		
		mockAccountService.rejectAccount.and.returnValue(of(message));
		spyOn(Swal, 'fire').and.returnValue(Promise.resolve<SweetAlertResult>({
			isConfirmed: true,
			value: reason,
			isDenied: false,
			isDismissed: false
		}));
		
		await component.deny(pendingIndentityAccount);
		expect(mockAccountService.rejectAccount).toHaveBeenCalledWith(pendingIndentityAccount.id, reason);
	});
});
