class Task {
	id: string;
	title: string;
	body: string;
	userId: string;
	creationDate: Date;
	prev: string;

	constructor(
		id: string,
		title: string,
		body: string,
		userId: string,
		creationDate: Date,
		prev: string
	) {
		this.id = id;
		this.title = title;
		this.body = body;
		this.userId = userId;
		this.creationDate = creationDate;
		this.prev = prev;
	}

}

export default Task;