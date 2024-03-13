import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ImagenCedulaComponent} from './imagen-cedula.component';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AccountServiceService, Message} from "../../services/account-service.service";
import {of} from "rxjs";
import Swal, {SweetAlertResult} from "sweetalert2";

describe('ImagenCedulaComponent', () => {
	let component: ImagenCedulaComponent;
	let fixture: ComponentFixture<ImagenCedulaComponent>;
	let mockAccountService: jasmine.SpyObj<AccountServiceService>;
	
	beforeEach(async () => {
		
		mockAccountService = jasmine.createSpyObj('AccountServiceService', ['uploadPicture', 'permitPicture']);
		
		await TestBed.configureTestingModule({
			imports: [ImagenCedulaComponent, HttpClientTestingModule],
			providers: [
				{provide: AccountServiceService, useValue: mockAccountService},
				{provide: ActivatedRoute, useValue: {snapshot: {paramMap: new Map([['token', 'aaaaa']])}}},
			
			]
		})
		.compileComponents();
		
		mockAccountService.permitPicture.and.returnValue(of({message: 'Permitido'}));
		
		fixture = TestBed.createComponent(ImagenCedulaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});
	
	it('should create', () => {
		expect(component).toBeTruthy();
	});
	
	
	it('should a permit to send the image on ngOnInit', () => {
		component.ngOnInit();
		expect(mockAccountService.permitPicture).toHaveBeenCalledWith('aaaaa');
	});
	
	it('should send the image ci', () => {
		
		const image = new File([""], "filename", {type: "image/png"});
		const message: Message = {message: 'Cedula enviada'};
		component.fotoCedulaArchivo = image;
		const reason = 'test reason';
		mockAccountService.uploadPicture.and.returnValue(of(message));
		
		spyOn(Swal, 'fire').and.returnValue(Promise.resolve<SweetAlertResult>({
			isConfirmed: true,
			value: reason,
			isDenied: false,
			isDismissed: false
		}));
		
		component.enviarCedula();
		console.log(2)
		expect(mockAccountService.uploadPicture).toHaveBeenCalledWith(component.idAccount as string, image);
	});
	
	
	
});