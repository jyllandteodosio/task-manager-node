class SharedList {
	id: string;
	listId: string;
	userId: string;
	creationDate: Date;

	constructor(
		id: string,
		listId: string,
		userId: string,
		creationDate: Date,
	) {
		this.id = id;
		this.listId = listId;
		this.userId = userId;
		this.creationDate = creationDate;
	}

}

export default SharedList;