import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {ActivatedRoute, Router} from "@angular/router";
import {AccountServiceService} from "../../services/account-service.service";
import swaal from "sweetalert2";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
	selector: 'app-imagen-cedula',
	standalone: true,
	imports: [
		CommonModule,
		MatTableModule,
		MatButtonModule,
		MatIconModule,
		MatToolbarModule,
		MatDialogModule,
		MatCard,
		MatCardContent,
		MatCardHeader,
		MatCardTitle,
		MatDivider,
		NgOptimizedImage,
		MatProgressBar,
	],
	templateUrl: './imagen-cedula.component.html',
	styleUrls: ['./imagen-cedula.component.css']
})
export class ImagenCedulaComponent implements OnInit {
	
	fotoCedula: ArrayBuffer | null = null;
	fotoCedulaArchivo: File | null | undefined = null
	idAccount: string | null = null;
	isSend = false;
	loading: boolean = true;
	
	constructor(private route: ActivatedRoute, private service: AccountServiceService, private router: Router) {
	}
	
	
	ngOnInit(): void {
		this.idAccount = this.route.snapshot.paramMap.get('token');
		if (!this.idAccount) return;
		this.service.permitPicture(this.idAccount).subscribe({
			error: () => this.router.navigate(['/solictud-cuenta']).then(),
			complete: () => this.loading = false
		});
		
	}
	
	
	imageFileChange($event: Event) {
		
		const HTMLInputElement = $event.target as HTMLInputElement;
		this.fotoCedulaArchivo = HTMLInputElement.files?.item(0);
		
		if (!this.fotoCedulaArchivo) return;
		
		const reader = new FileReader();
		reader.onload = event => {
			this.fotoCedula = event.target?.result as ArrayBuffer
			console.log(this.fotoCedula)
		}
		reader.onerror = event => console.error(event);
		
		reader.readAsDataURL(this.fotoCedulaArchivo);
		
	}
	
	enviarCedula() {
		
		if (!this.fotoCedulaArchivo || !this.idAccount) return;
		
		this.isSend = true;
		this.loading = true;
		console.log(1)
		this.service.uploadPicture(this.idAccount, this.fotoCedulaArchivo).subscribe({
			next: (response) => {
				this.showMessage('Exito', response.message, 'success');
				this.isSend = true;
				this.loading = false;
			},
			error: (err) => {
				this.showMessage('Error', 'No se pudo enviar la imagen de la cedula: ' + err.error?.message, 'error');
				this.loading = false;
			}
		});
		
	}
	
	async showMessage(title: string, body: string, icon: 'success' | 'error' = 'success') {
		await swaal.fire({
			title: title,
			text: body,
			icon: icon,
			confirmButtonText: 'Ok',
		});
	}
	
}