const Computer = require('./computer');

const Vacuum = class {
    /**
     * Default constructor
     */
    constructor() {
        const {readFileToArray} = require('../../utils/read-file');
        const computerInput = readFileToArray('computerinput.txt', ',');

        this.computer = new Computer(computerInput);
    }

    runDiscovery() {
        let memory = [[]];

        this.computer.stdout = (value) => {
            if (value === 10) {
                memory.push([]);
            }
            else {
                memory[memory.length - 1].push(String.fromCharCode(value));
            }
        };

        this.computer.run();

        return memory;
    }

    runDustCollection(commands, functions) {
        this.computer.activeInstructionList[0] = 2;

        let input = commands.flatMap((command) => [command.charCodeAt(0), 44]);
        input.pop();
        input.push(10)
        
        functions.forEach((functionList) => {
            for (let i = 0; i < functionList.length; i++) {
                const func = functionList[i].toString();
                const first = func[0];
                input.push(first.charCodeAt(0));
                input.push(44);
                func.slice(1).toString().split('').map((char) => char.charCodeAt(0)).forEach((num) => {
                    input.push(num);
                })
                input.push(44);
            }
            input.pop();
            input.push(10);
        });

        input.push(110);
        input.push(10);
        
        console.log(input);

        let inputIndex = 0;

        this.computer.stdin = () => {
            const value = input[inputIndex];
            process.stdout.write(String.fromCharCode(value));
            inputIndex++;
            return value;
        };

        let returnValue = -1;

        this.computer.stdout = (value) => {
            returnValue = value;
        };

        this.computer.run();

        return returnValue;
    }
}

module.exports = Vacuum;