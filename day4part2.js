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
    let chunks = [];
    let activeChunk = [];

    candidate.toString().split('').map(x => parseInt(x)).forEach(current => {
        if (previous === -1 || current === previous) {
            activeChunk.push(current);
        }
        else {
            chunks.push(activeChunk);
            activeChunk = [current];
        }
        previous = current;
    });

    chunks.push(activeChunk);

    return chunks.some(x => x.length === 2);    
};

const validateRange = number => number >= 100000 && number <= 999999;

let validCount = 0;

const min = 156218;
const max = 652527;

for (let i = min; i <= max; i++) {
    if (validateRange(i) && validateAscendingDigits(i) && validateHasAdjacentDigits(i)) {
        validCount++;
    }
}

console.log(validCount);