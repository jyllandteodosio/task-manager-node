class List {
	id: string;
	title: string;
	userId: string;
	creationDate: Date;

	constructor(
		id: string,
		title: string,
		userId: string,
		creationDate: Date,
	) {
		this.id = id;
		this.title = title;
		this.userId = userId;
		this.creationDate = creationDate;
	}

}

export default List;