interface basicErrorResponse {
	success : boolean,
	reason : string
}

export const notFoundResponse : basicErrorResponse = {
    success : false,
    reason : "not found",
}

export const generalErrorResponse : basicErrorResponse = {
    success : false,
    reason : "general application error",
}

export const iamTeaPotUCoffeeBrewer : basicErrorResponse = {
    success : false,
    reason : "I couldn't do what u wanted me to, I'm just a basic teapot"
}

export const invalidBodyResponse : basicErrorResponse = {
	success : false,
	reason : "Invalid data in body of request"
}