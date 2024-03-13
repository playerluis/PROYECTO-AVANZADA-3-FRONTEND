import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import Account from "../models/Accounts";

@Injectable({
	providedIn: 'root'
})
export class AccountServiceService {
	
	path = 'http://localhost:8080/account';
	
	//path = '/account';
	
	constructor(private http: HttpClient) {
	}
	
	createAccount(account: Account) {
		return this.http.post<Message>(this.path + '/new', account);
	}
	
	rejectAccount(id: string, reason: string) {
		return this.http.post<Message>(this.path + '/reject', {id, reason});
	}
	
	approveFirstStep(id: string) {
		return this.http.post<Message>(this.path + '/approve-first-step', {id});
	}
	
	permitPicture(id: string) {
		return this.http.get<Message>(this.path + '/permit-picture/' + id);
	}
	
	uploadPicture(id: string, picture: File) {
		
		const formData = new FormData();
		formData.append('file', picture);
		
		return this.http.post<Message>(
			this.path + '/upload-picture/' + id,
			formData
		);
	}
	
	getNewAccounts() {
		return this.http.get<Account[]>(this.path + '/news');
	}
	
	getPendingIdentityAccounts() {
		return this.http.get<Account[]>(this.path + '/pending-identity');
	}
	
	approveIdentity(id: string) {
		return this.http.post<Message>(this.path + '/aprove-identity', {id});
	}
	
}

export interface Message {
	message: string;
}