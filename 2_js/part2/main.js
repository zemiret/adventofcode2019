input = "1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,1,9,19,1,13,19,23,2,23,9,27,1,6,27,31,2,10,31,35,1,6,35,39,2,9,39,43,1,5,43,47,2,47,13,51,2,51,10,55,1,55,5,59,1,59,9,63,1,63,9,67,2,6,67,71,1,5,71,75,1,75,6,79,1,6,79,83,1,83,9,87,2,87,10,91,2,91,10,95,1,95,5,99,1,99,13,103,2,103,9,107,1,6,107,111,1,111,5,115,1,115,2,119,1,5,119,0,99,2,0,14,0";
input = input.split(",").map(x => Number(x));


const ADD = 1;
const MULT = 2;
const HALT = 99;

function execute_tape(tape) {
    let pointer = 0;
    
    do {
		if (tape[0] >= 19690720) {
			return;
		}

    	let token = tape[pointer];
    
    	if (token == HALT) {
			return;
    	} else if (token == ADD) {
    		const op1 = tape[pointer + 1];
    		const op2 = tape[pointer + 2];
    		const dest = tape[pointer + 3];
    
    		tape[dest] = tape[op1] + tape[op2];
    	} else if (token == MULT) {
    		const op1 = tape[pointer + 1];
    		const op2 = tape[pointer + 2];
    		const dest = tape[pointer + 3];
    
    		tape[dest] = tape[op1] * tape[op2];
    	} else {
    		throw 'Invalid opcode!';
    	}
    
    	pointer += 4;

    } while (true);
}


function search() {
    for (let noun = 0; noun < 100; ++noun) {
    	for (let verb = 0; verb < 100; ++verb) {
    		const tape = [...input];
    		tape[1] = noun;
    		tape[2] = verb;
    
    		execute_tape(tape);
    
    		if (tape[0] === 19690720) {
				return 100 * noun + verb;
    		}
    	}
    }
}

console.log(search());
