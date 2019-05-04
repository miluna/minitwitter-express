export function validateEmail(email: string): boolean {
    const emailRegExp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return emailRegExp.test(email);
}

export function validateLength(s: string, length: number): boolean {
    return s.length >= length;
}

/**
 * A valid password should have:
 * more than 6 characters
 * one upper case
 * one lower case
 * one number
 * and one special character
 * @param pass
 */
export function validatePasswordComplexity(pass: string): boolean {
    const anUpperCase = /[A-Z]/;
    const aLowerCase = /[a-z]/;
    const aNumber = /[0-9]/;
    const aSpecial = /[!|@|#|$|%|^|&|*|(|)|-|_]/;

    let numUpper = 0;
    let numLower = 0;
    let numNums = 0;
    let numSpecials = 0;
    const isLengthOkay = validateLength(pass, 6);

    for(let i=0; i<pass.length; i++){
        if(anUpperCase.test(pass[i]))
            numUpper++;
        else if(aLowerCase.test(pass[i]))
            numLower++;
        else if(aNumber.test(pass[i]))
            numNums++;
        else if(aSpecial.test(pass[i]))
            numSpecials++;
    }

    return (isLengthOkay && numUpper >= 1 && numLower >= 1 && numNums >= 1 && numSpecials >= 1);
}
