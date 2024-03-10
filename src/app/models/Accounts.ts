export default interface Account {
	id: string;
	names: string;
	lastnames: string;
	ci: string;
	fingerprintcode: string;
	email: string;
	sexo: string;
	age: number;
	reason: string;
	picture?:  Buffer | Uint8Array | Blob | string
	firstApprove: boolean;
	secondApprove: boolean;
}