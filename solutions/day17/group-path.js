const groupPath = (path) => {
    const groupedPath = [];
    for (let i = 0; i < path.length; i += 2) {
        groupedPath[i / 2] = path[i] + path[i+1];
    }
    return groupedPath;
};

module.exports = groupPath;
