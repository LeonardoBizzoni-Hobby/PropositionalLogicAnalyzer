import { Formula } from "./formula";
import { SyntaxTree } from "./SyntaxTree";

export function checkFormula() {
	let input = (document.getElementById("formulaInput") as HTMLInputElement).value;

	let formula = new Formula(input.trim());

	if (formula.fbf) {
		(document.getElementById("invalidFormula") as HTMLElement).setAttribute("style", "display: none");

		let tree = new SyntaxTree(formula);

		let h2 = document.getElementById("treeString") as HTMLElement;
		h2.setAttribute("style", "display: block");
		h2.innerHTML = `Syntax tree: </br><b style="padding-left: 20px">${tree}</b>`;

		let table = document.getElementById("formulaTable") as HTMLElement;
		table.setAttribute("style", "display: block");
		table.innerHTML = "<h2 class='font-medium leading-tight text-3xl mt-0 mb-2'>Truth table:</h2>" + pprint(formula.evaluate());
	} else {
		(document.getElementById("invalidFormula") as HTMLElement).setAttribute("style", "display: block");
	}
}

function pprint(arr: Array<[string, boolean]>): string {
	let table = "<table class='table table-compact'><thead><tr><th>Assignment</th><th>Value</th></tr></thead><tbody>";
	for (const [item, value] of arr) {
		table += `
            <tr>
                <td>${item}</td>
                <td>${value}</td>
            </tr>
        `;
	}
	table += "</table>";
	return table;
}
