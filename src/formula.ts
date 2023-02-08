import { LogicSymbol } from "./logic_symbol";
import { SyntaxTree } from "./SyntaxTree";
import { Atom } from "./atom";

export class Formula {
	formula: string;
	fbf: boolean;
	operators: LogicSymbol[];
	variables: Atom[];
	models: Atom[];
	countermodels: Atom[];
	tree: SyntaxTree | undefined;

	constructor(formula: string) {
		let res = Formula.is_fbf(formula);
		let [fbf, operations, variables] = res;

		this.variables = [];
		for (let atom of variables) {
			let present = false;

			for (let variable of this.variables) {
				if (variable.name == atom) {
					present = true;
				}
			}

			if (!present) {
				this.variables.push(new Atom(atom));
			}
		}

		this.formula = formula;
		this.fbf = fbf;
		this.operators = operations;
		this.models = [];
		this.countermodels = [];
		if (fbf) {
			this.tree = new SyntaxTree(this);
		} else {
			this.tree = undefined;
		}
	}

	evaluate(): Array<[string, boolean]> {
		let res: Array<[string, boolean]> = [];
		let assignment: string = "0".repeat(2**this.variables.length);

		for (let i=0; i<2**this.variables.length; i++) {
			assignment = i.toString(2).padStart(this.variables.length, "0");

			for (let j=0; j<assignment.length; j++) {
				this.variables[j].setState(assignment[j]);
			}

			res.push([assignment, this.evaluateAssignment()]);
		}

		return res;
	}

	private evaluateAssignment(tree?: SyntaxTree): boolean {
		let res: boolean = false;

		if (tree == undefined) {
			tree = this.tree!;
		}
		if (tree.root[0] == "Atom") {
			this.variables.forEach((atom) => {
				if (atom.name == tree!.root[1]) {
					res = atom.value;
				}
			});
		} else if (tree.root[0] == "Unary") {
			res = !this.evaluateAssignment(tree.right);
		} else {
			switch (tree.root[1]) {
				case ("&"): {
					res = this.evaluateAssignment(tree.left) && this.evaluateAssignment(tree.right);
					break;
				}
				case ("|"): {
					res = this.evaluateAssignment(tree.left) || this.evaluateAssignment(tree.right);
					break;
				}
				case (">"): {
					res = !this.evaluateAssignment(tree.left) || this.evaluateAssignment(tree.right);
					break;
				}
				case ("-"): {
					res = this.evaluateAssignment(tree.left) == this.evaluateAssignment(tree.right);
					break;
				}
			}
		}

		return res;
	}

	static is_fbf(formula: string): [boolean, LogicSymbol[], string[]] {
		let op_stack: Array<LogicSymbol> = [];
		let var_stack: Array<string> = [];

		let was_neg = false;
		let was_open = false;

		for (let char of formula) {
			switch (char) {
				case "!": {
					op_stack.push(["Unary", "!"]);
					was_neg = true;
					break;
				}

				case ("&"):
				case ("|"):
				case (">"):
				case ("-"): {
					if (was_neg || was_open) {
						return [false, [], []];
					}
					op_stack.push(["Binary", char]);
					break;
				}

				case ("("):
				case ("["):
				case ("{"): {
					op_stack.push(["NestOpen"]);
					was_open = true;
					break;
				}
				case (")"):
				case ("]"):
				case ("}"): {
					op_stack.push(["NestClose"]);

					if (was_open || was_neg) {
						return [false, [], []];
					}

					break;
				}
				default: {
					op_stack.push(["Atom", char]);
					var_stack.push(char);

					was_neg = false;
					was_open = false;
				}
			}
		}


		if (was_neg || was_open) {
			return [false, [], []];
		}

		let clone_var: Array<string> = Object.assign([], var_stack);
		let clone_op: Array<LogicSymbol> = Object.assign([], op_stack);

		while (clone_op.length != 0) {
			switch (clone_op.pop()![0]) {
				case ("Unary"): {
					if (clone_var.pop() === undefined) {
						console.error("Unary operation requires one and only one operator");
						return [false, [], []];
					}
					clone_var.push('_');
					break;
				}
				case ("Binary"): {
					if (clone_var.pop() === undefined) {
						console.error("Binary operation requires exactly 2 operators");
						return [false, [], []];
					}
					if (clone_var.pop() === undefined) {
						console.error("Binary operation requires exactly 2 operators");
						return [false, [], []];
					}
					clone_var.push('_');
					break;
				}
				case ("NestOpen"): {
					console.error("Invalid parentesis");
					return [false, [], []];
				}

				case ("NestClose"): {
					let opening_idx = clone_op.reverse().findIndex(op => op[0] === "NestOpen");
					if (opening_idx != -1) {
						clone_op.splice(opening_idx, 1);
						clone_op.reverse();
					} else {
						console.error("Missing closing parentesis");
						return [false, [], []];
					}
				}
			}
		}

		if (clone_var.length != 1) {
			console.error("Invalid number of variables");
			return [false, [], []];
		}

		return [true, op_stack, var_stack];
	}
}
