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
	pictureId: string | null;
	firstApprove: boolean;
	secondApprove: boolean;
}