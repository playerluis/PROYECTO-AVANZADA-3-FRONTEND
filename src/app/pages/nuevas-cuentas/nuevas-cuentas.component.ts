import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogTitle,
} from '@angular/material/dialog';
import {RouterLink} from '@angular/router';
import swaal from "sweetalert2";
import {AccountServiceService} from "../../services/account-service.service";
import Account from "../../models/Accounts";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import RejectData from "../../models/RejectData";

@Component({
	selector: 'app-tabla',
	standalone: true,
	imports: [
		CommonModule,
		MatTableModule,
		MatFormFieldModule,
		MatInputModule,
		MatOptionModule,
		MatSelectModule,
		MatButtonModule,
		MatCardModule,
		MatListModule,
		MatCheckboxModule,
		MatIconModule,
		MatToolbarModule,
		FormsModule,
		MatButtonModule,
		MatDialogActions,
		MatDialogClose,
		MatDialogTitle,
		MatDialogContent,
		RouterLink,
		MatProgressSpinner
	],
	templateUrl: './nuevas-cuentas.component.html',
	styleUrl: './nuevas-cuentas.component.css',
})
export class NuevasCuentasComponent implements OnInit {
	
	columnas: string[] = ["nombres completos", "cedula", "correo", "sexo", "edad", "acciones"];
	accounts: Account[] = [];
	loadingAccounts: boolean = false;
	loading: boolean = false;
	
	constructor(private service: AccountServiceService) {
	}
	
	async ngOnInit(): Promise<void> {
		await this.loadAccounts();
	}
	
	
	async loadAccounts(): Promise<void> {
		
		this.loadingAccounts = true;
		return new Promise((resolve, reject) => {
			this.service.getNewAccounts().subscribe({
				next: (accounts) => {
					console.log(accounts)
					this.accounts = accounts;
					this.loadingAccounts = false;
					resolve();
				},
				error: (err) => {
					swaal.fire({
						title: "Error",
						icon: "error",
						text: "No se pudieron obtener las cuentas: " + err.error?.message ? err.error.message : "",
						timer: 2000
					});
					reject(new Error("No se pudieron obtener las cuentas: " + err.error?.message ? err.error.message : ""));
					this.loadingAccounts = false;
				}
			});
		});
		
		
	}
	
	async info(account: Account): Promise<void> {
		await swaal.fire({
			title: "Información de la nueva cuenta",
			html: `
        <div style="text-align: left;">
            <p><strong>Nombres:</strong> ${account.names}</p>
            <p><strong>Apellidos:</strong> ${account.lastnames}</p>
            <p><strong>Cédula:</strong> ${account.ci}</p>
            <p><strong>Código dactilar:</strong> ${account.fingerprintcode}</p>
            <p><strong>Correo:</strong> ${account.email}</p>
            <p><strong>Sexo:</strong> ${account.sexo}</p>
            <p><strong>Edad:</strong> ${account.age}</p>
            <p><strong>Motivo:</strong> ${account.reason}</p>
        </div>
        `,
			showCancelButton: true,
			showDenyButton: true,
			confirmButtonText: 'Aceptar',
			cancelButtonText: 'Cancelar',
			denyButtonText: 'Rechazar'
		}).then(result => {
			if (result.isConfirmed) {
				this.accept(account);
			}
			if (result.isDenied) {
				this.deny(account);
			}
		});
	}
	
	async accept(account: Account): Promise<void> {
		this.loading = true;
		
		return new Promise((resolve, reject) => {
			this.service.approveFirstStep(account.id).subscribe({
				next: () => {
					this.showMessage("Cuenta aceptada", "La cuenta cumplió con los requisitos de la primera fase, se le ha enviado un correo para continuar con el proceso de verificación de identidad", "success");
					this.loadAccounts();
					this.loading = false;
					resolve();
				},
				error: (err) => {
					this.showMessage("Error", "No se pudo aceptar la cuenta: " + (err.error?.message || ""), "error");
					this.loading = false;
					reject(new Error("No se pudo aceptar la cuenta: " + (err.error?.message || "")));
				}
			});
		});
		
	}
	
	async deny(account: Account): Promise<void> {
		
		await swaal.fire({
			title: "Razón de rechazo",
			input: "text",
			showCancelButton: true,
			confirmButtonText: "Enviar",
		}).then(async (result) => {
			
			if (!result.isConfirmed) return;
			
			if (result.value === "") {
				this.showMessage("Error", "La razón no puede estar vacía", "error").then();
				return;
			}
			
			this.loading = true;
			
			const reason: RejectData = {
				reason: result.value,
				id: account.id,
			};
			
			return new Promise<void>((resolve, reject) => {
				this.service.rejectAccount(account.id, reason.reason).subscribe({
					next: () => {
						this.showMessage("Cuenta rechazada", "La cuenta ha sido rechazada", "success")
						this.loadAccounts();
						this.loading = false;
						resolve();
					},
					error: (err) => {
						this.showMessage("Error", "No se pudo rechazar la cuenta: " + (err.error?.message || ""), "error")
						this.loading = false;
						reject(new Error("No se pudo rechazar la cuenta: " + (err.error?.message || "")));
					}
				});
			});
		});
	}
	
	async showMessage(title: string, body: string, icon: 'success' | 'error' = 'success'): Promise<void> {
		await swaal.fire({
			title: title,
			text: body,
			icon: icon,
			confirmButtonText: 'Ok',
		});
	}
	
	count(): number {
		return this.accounts.length;
	}
}
