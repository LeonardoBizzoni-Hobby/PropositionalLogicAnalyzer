import { Formula } from "./formula";
import { Atom } from "./atom";

export function checkFormula() {
    let input = (document.getElementById("formulaInput") as HTMLInputElement).value;

    let formula = new Formula(input.trim());

    if (formula.fbf) {
	(document.getElementById("invalidFormula") as HTMLElement).setAttribute("style", "display: none");

	let h2 = document.getElementById("treeString") as HTMLElement;
	h2.setAttribute("style", "display: block");
	h2.innerHTML = `Syntax tree: </br><b style="padding-left: 20px">${formula.tree}</b>`;

	let table = document.getElementById("formulaTable") as HTMLElement;
	table.setAttribute("style", "display: block");
	table.innerHTML = "<h2 class='font-medium leading-tight text-3xl mt-0 mb-2'>Truth table:</h2>" + pprint(formula.variables, formula.evaluate());
    } else {
	(document.getElementById("invalidFormula") as HTMLElement).setAttribute("style", "display: block");
    }
}

function pprint(vars: Atom[], arr: Array<[string, boolean]>): string {
    let table = "<table class='table table-compact'><thead><tr>";
    for (const atom of vars) {
	table += `<th>${atom.name}</th>`;
    }
    table += "<th>Value</th></tr></thead><tbody>";

    for (const [assignment, value] of arr) {
	table += "<tr>";
	for (const bit of assignment) {
	    table += `<td>${bit}</td>`;
	}
	table += `<td>${value}</td>`;
	table += "</tr>";
    }
    table += "</table>";
    return table;
}
