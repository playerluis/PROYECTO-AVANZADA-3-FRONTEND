import {TestBed} from '@angular/core/testing';

import {AccountServiceService, Message} from './account-service.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import Account from "../models/Accounts";

describe('AccountServiceService', () => {
	let service: AccountServiceService;
	let httpMock: HttpTestingController;
	
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [AccountServiceService]
		});
		service = TestBed.inject(AccountServiceService);
		httpMock = TestBed.inject(HttpTestingController);
	});
	
	afterEach(() => {
		httpMock.verify();
	});
	
	it('should be created', () => {
		expect(service).toBeTruthy();
	});
	
	it('should send a POST request to create an account', () => {
		const mockAccount: Account = {
			id: '1',
			names: 'John',
			lastnames: 'Doe',
			ci: '123456',
			fingerprintcode: '123456',
			email: 'john.doe@example.com',
			sexo: 'M',
			age: 20,
			reason: 'test reason',
			pictureId: null,
			firstApprove: true,
			secondApprove: false
		};
		
		
		service.createAccount(mockAccount).subscribe((response: Message) => {
			expect(response).toEqual({message: 'Cuenta solicitada con exito, espere aprobacion, este pendiente de su correo'});
		});
		
		const req = httpMock.expectOne(service.path + '/new');
		expect(req.request.method).toBe('POST');
		req.flush({message: 'Cuenta solicitada con exito, espere aprobacion, este pendiente de su correo'});
		
	});
	
	it('should send a POST request to reject an account', () => {
		const id = '1';
		const reason = 'test reason';
		
		service.rejectAccount(id, reason).subscribe((response: Message) => {
			expect(response).toEqual({message: 'Cuenta rechazada con exito'});
		});
		
		const req = httpMock.expectOne(service.path + '/reject');
		expect(req.request.method).toBe('POST');
		req.flush({message: 'Cuenta rechazada con exito'});
	});
	
	
	it('should send a POST request to approve the first step', () => {
		const id = '1';
		service.approveFirstStep(id).subscribe((response: Message) => {
			expect(response).toEqual({message: 'Primera fase de aprobación de cuenta bancaria realizada con exito'});
		});
		
		const req = httpMock.expectOne(service.path + '/approve-first-step');
		expect(req.request.method).toBe('POST');
		req.flush({message: 'Primera fase de aprobación de cuenta bancaria realizada con exito'});
	});
	
	it('should send a GET request to get permit picture', () => {
		const id = '1';
		service.permitPicture(id).subscribe((response: any) => {
			expect(response).toEqual({permit: true});
		});
		
		const req = httpMock.expectOne(service.path + '/permit-picture/' + id);
		expect(req.request.method).toBe('GET');
		req.flush({permit: true});
	});
	
	it('should send a POST request to upload picture', () => {
		const id = '1';
		const picture = new File([''], 'test.png', {type: 'image/png'});
		service.uploadPicture(id, picture).subscribe((response: Message) => {
			expect(response).toEqual({message: 'success'});
		});
		
		const req = httpMock.expectOne(service.path + '/upload-picture/' + id);
		expect(req.request.method).toBe('POST');
		req.flush({message: 'success'});
	});
	
	it('should send a GET a new accounts', () => {
		service.getNewAccounts().subscribe((response: Account[]) => {
			expect(response).toEqual([]);
		});
		
		const req = httpMock.expectOne(service.path + '/news');
		expect(req.request.method).toBe('GET');
		req.flush([]);
	});
	
	
	it('should send a GET request to get accounts pending for verify identity', () => {
		service.getPendingIdentityAccounts().subscribe((response: Account[]) => {
			expect(response).toEqual([]);
		});
		
		const req = httpMock.expectOne(service.path + '/pending-identity');
		expect(req.request.method).toBe('GET');
		req.flush([]);
	});
	
	it('should send a POST request to approve identity', () => {
		const id = '1';
		service.approveIdentity(id).subscribe((response: Message) => {
			expect(response).toEqual({message: 'success'});
		});
		
		const req = httpMock.expectOne(service.path + '/approve-identity');
		expect(req.request.method).toBe('POST');
		req.flush({message: 'success'});
	});
});
