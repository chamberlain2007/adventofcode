const validateAscendingDigits = candidate => {
    let previous = -1;
    let isValid = true;

    candidate.toString().split('').map(x => parseInt(x)).forEach(current => {
        if (current < previous) {
            isValid = false;
        }
        previous = current;
    });
    
    return isValid;
};

const validateHasAdjacentDigits = candidate => {
    let previous = -1;
    let isValid = false;

    candidate.toString().split('').map(x => parseInt(x)).forEach(current => {
        if (current === previous) {
            isValid = true;
        }
        previous = current;
    });
    
    return isValid;
};

const validateRange = number => number >= 100000 && number <= 999999;

let validCount = 0;

for (let i = 156218; i <= 652527; i++) {
    if (validateRange(i) && validateAscendingDigits(i) && validateHasAdjacentDigits(i)) {
        validCount++;
    }
}

console.log(validCount);