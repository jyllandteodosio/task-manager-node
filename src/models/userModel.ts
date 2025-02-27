class User {
	id: string;
	username: string;
	password: string;
	firstName: string;
	lastName: string;
	creationDate: Date;

	constructor(
		id: string,
		username: string,
		password: string,
		firstName: string,
		lastName: string,
		creationDate: Date,
	) {
		this.id = id;
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.creationDate = creationDate;
	}

}

export default User;