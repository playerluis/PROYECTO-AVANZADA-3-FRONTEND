import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexComponent} from './index.component';
import {ActivatedRoute} from "@angular/router";

describe('IndexComponent', () => {
	let component: IndexComponent;
	let fixture: ComponentFixture<IndexComponent>;
	
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IndexComponent],
			providers: [
				{provide: ActivatedRoute, useValue: {}}
			]
		})
		.compileComponents();
		
		fixture = TestBed.createComponent(IndexComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});
	
	it('should create', () => {
		expect(component).toBeTruthy();
	});
	
	it('should contains a nav-list to navigate to the different components', () => {
		const compiled = fixture.nativeElement as HTMLElement;
		
		expect(compiled.querySelector('[routerLink="/"]')).toBeTruthy();
		expect(compiled.querySelector('[routerLink="/solictud-cuenta"]')).toBeTruthy();
		expect(compiled.querySelector('[routerLink="/cuentas-en-revision"]')).toBeTruthy();
		expect(compiled.querySelector('[routerLink="/comprante-identidad"]')).toBeTruthy();
	});
});
