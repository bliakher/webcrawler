import { webpage } from "./webpage";

//validate if page has set periodicity over 1 minute AND valid regex for crawling
export function validateRecord(page: webpage): boolean {
	return page.regEx && page.periodicity && page.url && page.periodicity >= 1 && isValidRegex(page.regEx);
}

function isValidRegex(regEx: string): boolean {
	var valid = true;
	try {
		new RegExp(regEx);
	} catch (e) {
		valid = false;
	}
	return valid;
}