import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from "@angular/material/card";
import PendingIndentityAccount from "../../models/PendingIndentityAccount";
import {MatDivider} from "@angular/material/divider";
import swaal from "sweetalert2";
import RejectData from "../../models/RejectData";
import {AccountServiceService} from "../../services/account-service.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {RouterLink} from "@angular/router";


@Component({
	selector: 'app-table-comprobante',
	standalone: true,
	imports: [
		CommonModule,
		MatTableModule,
		MatButtonModule,
		MatIconModule,
		MatToolbarModule,
		MatCardModule,
		MatDivider,
		MatProgressSpinner,
		RouterLink
	],
	templateUrl: './comprobar-identidad.component.html',
	styleUrls: ['./comprobar-identidad.component.css']
})
export class ComprobarIdentidadComponent implements OnInit {
	
	columnas: string[] = ['Nombre Completo', 'Correo', 'N# Cedula', 'Imagen', 'Acciones'];
	pendingIndentityAccounts: PendingIndentityAccount[] = [];
	loadingAccounts: boolean = true;
	loading: boolean = false;
	
	constructor(private service: AccountServiceService) {
	}
	
	ngOnInit(): void {
		this.loadAccounts();
	}
	
	loadAccounts(): void {
		this.service.getPendingIdentityAccounts()?.subscribe({
			next: (accounts) => {
				console.log(accounts);
				this.pendingIndentityAccounts = accounts.map<PendingIndentityAccount>((account) => {
					return {
						id: account.id,
						completeName: account.names + " " + account.lastnames,
						email: account.email,
						ci: account.ci,
						pictureId: account.pictureId as string,
						
					};
				});
			},
			error: error => this.showMessage("Error", "No se pudieron cargar las cuentas: " + error.error?.message || error.message, "error"),
			complete: () => this.loadingAccounts = false
		});
	}
	
	accept(cuenta: PendingIndentityAccount): void {
		this.loading = true;
		this.service.approveIdentity(cuenta.id).subscribe({
			next: () => {
				this.showMessage("Exito", "Cuenta aceptada", "success");
				this.loadAccounts();
			},
			error: error => this.showMessage("Error", "No se pudo aceptar la cuenta: " + error.error?.message || error.message, "error"),
			complete: () => this.loading = false
		});
	}
	
	async deny(account: PendingIndentityAccount): Promise<void> {
		await swaal.fire({
			title: "Razón de rechazo",
			input: "text",
			confirmButtonText: "Enviar",
			showCancelButton: true,
		}).then((result) => {
			
			if (!result.isConfirmed) return;
			
			if (result.value === "") {
				this.showMessage("Error", "La razón no puede estar vacía", "error");
				return;
			}
			
			this.loading = true;
			
			const reason: RejectData = {
				reason: result.value,
				id: account.id,
			};
			
			this.service.rejectAccount(account.id, reason.reason).subscribe({
				next: () => {
					this.showMessage("Cuenta rechazada.", "La cuenta ha sido rechazada", "success");
					this.loadAccounts();
					this.loading = false;
				},
				error: (err) => {
					this.showMessage("Error", "No se pudo rechazar la cuenta: " + (err.error?.message || ""), "error");
					this.loading = false;
				}
			});
		});
	}
	
	showImage(url: string, ci: string): void {
		swaal.fire({
			title: "CEDULA DE IDENTIDAD: " + ci,
			imageUrl: url
		}).then();
	}
	
	showMessage(title: string, body: string, icon: 'success' | 'error' = 'success') {
		swaal.fire({
			title: title,
			text: body,
			icon: icon,
			confirmButtonText: 'Ok',
		}).then();
	}
}