declare var require: any
declare var process: any

const fs = require('fs');
const rl = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
})

fs.readFile('input', 'utf8', main);

enum Opcode {
	ADD = 1,
	MUL = 2,
	WRB = 3,
	OUT = 4,
	JIT = 5,
	JIF = 6,
	SLT = 7,
	SEQ = 8,
	HALT = 99,
}

type Tape = string[];

function getModes(instr: string): number[] {
	const modes = [0, 0, 0];

	instr = instr.substr(0, instr.length - 2);

	for (let i = 0; i < modes.length; ++i) {
		modes[i] = Number(!!Number(instr[instr.length - 1]))
		instr = instr.substr(0, instr.length - 1);
	}

	return modes;
}

function getOpcode(instr: string): Opcode {
	return Number(instr.substr(-2));
}

function add(tape: Tape, pointer: number): void {
	const modes = getModes(tape[pointer]);

	const op1 = Number(modes[0] === 0 ? tape[tape[pointer + 1]] : tape[pointer + 1]);
	const op2 = Number(modes[1] === 0 ?  tape[tape[pointer + 2]] : tape[pointer + 2]);
	const dest = Number(tape[pointer + 3]);

//	console.log('add: ', op1, op2);


	tape[dest] = (op1 + op2).toString();

	execute(tape, pointer + 4);
}

function mul(tape: Tape, pointer: number): void {
	const modes = getModes(tape[pointer]);

	const op1 = Number(modes[0] === 0 ? tape[tape[pointer + 1]] : tape[pointer + 1]);
	const op2 = Number(modes[1] === 0 ?  tape[tape[pointer + 2]] : tape[pointer + 2]);
	const dest = Number(tape[pointer + 3]);

//	console.log('mul', op1, op2);

	tape[dest] = (op1 * op2).toString();

	execute(tape, pointer + 4);
}

function out(tape: Tape, pointer: number): void {
	const modes = getModes(tape[pointer]);
	const op = modes[0] === 0 ? tape[tape[pointer + 1]] : tape[pointer + 1];

//	console.log('out');
	console.log(op);

	execute(tape, pointer + 2);
}

function write(tape: Tape, pointer: number): void {
	const dest = Number(tape[pointer + 1]);

	rl.question('> Input: ', ans => {
//		console.log('write: ', dest, ans);

    	tape[dest] = ans;
    
    	execute(tape, pointer + 2);
	});
}

function jumpIfTrue(tape: Tape, pointer: number): void {
	const modes = getModes(tape[pointer]);
	const op = Number(modes[0] === 0 ? tape[tape[pointer + 1]] : tape[pointer + 1]);
	const dest = Number(modes[1] === 0 ?  tape[tape[pointer + 2]] : tape[pointer + 2]);

	if (op != 0) {
		execute(tape, dest);
	} else {
		execute(tape, pointer + 3);
	}
}

function jumpIfFalse(tape: Tape, pointer: number): void {
	const modes = getModes(tape[pointer]);
	const op = Number(modes[0] === 0 ? tape[tape[pointer + 1]] : tape[pointer + 1]);
	const dest = Number(modes[1] === 0 ?  tape[tape[pointer + 2]] : tape[pointer + 2]);

	if (op === 0) {
		execute(tape, dest);
	} else {
		execute(tape, pointer + 3);
	}
}

function lessThan(tape: Tape, pointer: number): void {
	const modes = getModes(tape[pointer]);
	const op1 = Number(modes[0] === 0 ? tape[tape[pointer + 1]] : tape[pointer + 1]);
	const op2 = Number(modes[1] === 0 ?  tape[tape[pointer + 2]] : tape[pointer + 2]);
	const dest = Number(tape[pointer + 3]);

	if (op1 < op2) {
		tape[dest] = '1';
	} else {
		tape[dest] = '0';
	}

	execute(tape, pointer + 4);
}

function equals(tape: Tape, pointer: number): void {
	const modes = getModes(tape[pointer]);
	const op1 = Number(modes[0] === 0 ? tape[tape[pointer + 1]] : tape[pointer + 1]);
	const op2 = Number(modes[1] === 0 ?  tape[tape[pointer + 2]] : tape[pointer + 2]);
	const dest = Number(tape[pointer + 3]);

	if (op1 === op2) {
		tape[dest] = '1';
	} else {
		tape[dest] = '0';
	}

	execute(tape, pointer + 4);
}

function halt(tape: Tape, pointer: number): void {
//	console.log('HALT');
//	console.log(tape);

	process.exit()
}

function execute(tape: Tape, pointer: number): void {
	const token = tape[pointer];
	const opcode = getOpcode(token);

//	console.log(tape);
//	console.log(token, opcode);

	switch (opcode) {
		case Opcode.HALT:
			halt(tape, pointer);
			break;
		case Opcode.ADD:
			add(tape, pointer);
			break;
		case Opcode.MUL:
			mul(tape, pointer);
			break;
		case Opcode.OUT:
			out(tape, pointer);
			break;
		case Opcode.WRB:
			write(tape, pointer);
			break;
		case Opcode.JIT:
			jumpIfTrue(tape, pointer);
			break;
		case Opcode.JIF:
			jumpIfFalse(tape, pointer);
			break;
		case Opcode.SLT:
			lessThan(tape, pointer);
			break;
		case Opcode.SEQ:
			equals(tape, pointer);
			break;
		default:
			throw 'Invalid opcode!'
	}
}

function main(err, data) {
	if (err) {
		throw err;
	}

	const tape = data.split(",");
	execute(tape, 0);
}

