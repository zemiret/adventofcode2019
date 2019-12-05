var fs = require('fs');
var rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
fs.readFile('input', 'utf8', main);
var Opcode;
(function (Opcode) {
    Opcode[Opcode["ADD"] = 1] = "ADD";
    Opcode[Opcode["MUL"] = 2] = "MUL";
    Opcode[Opcode["WRB"] = 3] = "WRB";
    Opcode[Opcode["OUT"] = 4] = "OUT";
    Opcode[Opcode["HALT"] = 99] = "HALT";
})(Opcode || (Opcode = {}));
function getModes(instr) {
    var modes = [0, 0, 0];
    instr = instr.substr(0, instr.length - 2);
    for (var i = 0; i < modes.length; ++i) {
        modes[i] = Number(!!Number(instr[instr.length - 1]));
        instr = instr.substr(0, instr.length - 1);
    }
    return modes;
}
function getOpcode(instr) {
    return Number(instr.substr(-2));
}
function add(tape, pointer) {
    var modes = getModes(tape[pointer]);
    var op1 = Number(modes[0] == 0 ? tape[tape[pointer + 1]] : tape[pointer + 1]);
    var op2 = Number(modes[1] == 0 ? tape[tape[pointer + 2]] : tape[pointer + 2]);
    var dest = Number(tape[pointer + 3]);
    //	console.log('add: ', op1, op2);
    tape[dest] = (op1 + op2).toString();
    execute(tape, pointer + 4);
}
function mul(tape, pointer) {
    var modes = getModes(tape[pointer]);
    var op1 = Number(modes[0] == 0 ? tape[tape[pointer + 1]] : tape[pointer + 1]);
    var op2 = Number(modes[1] == 0 ? tape[tape[pointer + 2]] : tape[pointer + 2]);
    var dest = Number(tape[pointer + 3]);
    //	console.log('mul', op1, op2);
    tape[dest] = (op1 * op2).toString();
    execute(tape, pointer + 4);
}
function out(tape, pointer) {
    var modes = getModes(tape[pointer]);
    var op = modes[0] == 0 ? tape[tape[pointer + 1]] : tape[pointer + 1];
    //	console.log('out');
    console.log(op);
    execute(tape, pointer + 2);
}
function write(tape, pointer) {
    var dest = Number(tape[pointer + 1]);
    rl.question('> Input: ', function (ans) {
        //		console.log('write: ', dest, ans);
        tape[dest] = ans;
        execute(tape, pointer + 2);
    });
}
function halt(tape, pointer) {
    //	console.log('HALT');
    //	console.log(tape);
    process.exit();
}
function execute(tape, pointer) {
    var token = tape[pointer];
    var opcode = getOpcode(token);
    //	console.log(tape);
    //	console.log(token, opcode);
    if (opcode == Opcode.HALT) {
        halt(tape, pointer);
    }
    else if (opcode == Opcode.ADD) {
        add(tape, pointer);
    }
    else if (opcode == Opcode.MUL) {
        mul(tape, pointer);
    }
    else if (opcode == Opcode.OUT) {
        out(tape, pointer);
    }
    else if (opcode == Opcode.WRB) {
        write(tape, pointer);
    }
    else {
        throw 'Invalid opcode!';
    }
}
function main(err, data) {
    if (err) {
        throw err;
    }
    var tape = data.split(",");
    execute(tape, 0);
}
