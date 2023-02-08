import { Formula } from "./formula";
import { LogicSymbol } from "./logic_symbol";
// import p5 from "p5";

export class SyntaxTree {
	root: LogicSymbol;
	left: SyntaxTree | undefined;
	right: SyntaxTree | undefined;

	constructor(formula: Formula) {
		let root = SyntaxTree.get_root(formula.operators);

		this.root = root[0];
		this.left = undefined;
		this.right = undefined;

		if (root[1] == -1) {
			console.error("Something went wrong during sytax tree creation");
		} else if (root[0][0] == "Binary") {
			let tmpLeft = formula.formula.substring(0, root[1]);
			let tmpRight = formula.formula.substring(root[1]+1);

			if (tmpLeft.charAt(0) == "(") {
				tmpLeft = tmpLeft.substring(1, root[1]-1);
			}
			if (tmpRight.charAt(0) == "(") {
				tmpRight = tmpRight.substring(1, tmpRight.length-1);
			}

			this.left = new SyntaxTree(new Formula(tmpLeft));
			this.right = new SyntaxTree(new Formula(tmpRight));
		} else if (root[0][0] == "Unary") {
			let tmpRight = formula.formula.substring(1);

			if (tmpRight.charAt(0) == "(") {
				tmpRight = tmpRight.substring(1, tmpRight.length-1);
			}

			this.left = undefined;
			this.right = new SyntaxTree(new Formula(tmpRight));
		}
	}

	toString(tree?: SyntaxTree): string {
		let res: string = "";

		if (tree == undefined) {
			tree = this;
		}

		if (tree.left != undefined && tree.right != undefined) {
			res += `(${tree.root[1]!}, ${tree.left}, ${tree.right})`;
		} else if (tree.right != undefined) {
			res += `(${tree.root[1]!}, ${tree.right})`;
		} else {
			res = tree.root[1]!;
		}

		return res;
	}

	static get_root(operators: LogicSymbol[]): [LogicSymbol, number] {
		if (operators.length == 1) {
			return [operators[0], 0];
		} else {
			switch (operators[0][0]) {
				case ("Atom"): {
					return [operators[1], 1];
				}
				case ("Unary"): {
					return [operators[0], 0];
				}
				case ("NestOpen"): {
					let nestCounter = 0;

					for (let i=0; i<operators.length; i++) {
						if (operators[i][0] == "NestOpen") {
							nestCounter++;
						} else if (operators[i][0] == "NestClose") {
							if (--nestCounter == 0) {
								return [operators[i+1], i+1];
							}
						}
					}
				}
			}
		}

		return [["Atom", ""], -1];
	}
}
