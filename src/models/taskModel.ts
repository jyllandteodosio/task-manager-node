class Task {
	id: string;
	title: string;
	body: string;
	userId: string;
	listId: string;
	creationDate: Date;
	prev: string;

	constructor(
		id: string,
		title: string,
		body: string,
		userId: string,
		listId: string,
		creationDate: Date,
		prev: string
	) {
		this.id = id;
		this.title = title;
		this.body = body;
		this.userId = userId;
		this.listId = listId;
		this.creationDate = creationDate;
		this.prev = prev;
	}

}

export default Task;