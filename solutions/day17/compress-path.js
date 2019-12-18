const compressPath = (path) => {
    const finalPath = [];
    let stepCount = 0;
    
    path.forEach((current, index) => {
        if (Number.isInteger(current)) {
            stepCount++;
        }
        else {
            if (stepCount > 0) {
                finalPath.push(stepCount);
                stepCount = 0;
            }
            finalPath.push(current);
        }

        if (index === path.length - 1) {
            finalPath.push(stepCount);
        }
    });

    return finalPath;
};

module.exports = compressPath;