export class Atom {
	name: string;
	value: boolean;

	constructor(name: string) {
		this.name = name;
		this.value = false;
	}

	setState(val: string) {
		val == "0" ? this.value = false : this.value = true;
	}
}
