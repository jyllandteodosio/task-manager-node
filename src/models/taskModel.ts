class Task {
	id: string;
	title: string;
	body: string;
	dueDate: Date;
	status: string;
	userId: string;
	creationDate: Date;
	prev: string;

	constructor(
		id: string,
		title: string,
		body: string,
		dueDate: Date,
		status: string,
		userId: string,
		creationDate: Date,
		prev: string
	) {
		this.id = id;
		this.title = title;
		this.body = body;
		this.dueDate = dueDate;
		this.status = status;
		this.userId = userId;
		this.creationDate = creationDate;
		this.prev = prev;
	}

}

export default Task;