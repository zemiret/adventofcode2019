var fs = require('fs');
var rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
var filename;
var infile = null;
var infileContent = null;
var infilePtr;
if (process.argv.length > 2) {
    filename = process.argv[2];
    if (process.argv.length > 3) {
        infile = process.argv[3];
    }
}
else {
    throw 'Use: node main.js <input_file> <stdin_file>';
}
fs.readFile(filename, 'utf8', main);
var Opcode;
(function (Opcode) {
    Opcode[Opcode["ADD"] = 1] = "ADD";
    Opcode[Opcode["MUL"] = 2] = "MUL";
    Opcode[Opcode["WRB"] = 3] = "WRB";
    Opcode[Opcode["OUT"] = 4] = "OUT";
    Opcode[Opcode["JIT"] = 5] = "JIT";
    Opcode[Opcode["JIF"] = 6] = "JIF";
    Opcode[Opcode["SLT"] = 7] = "SLT";
    Opcode[Opcode["SEQ"] = 8] = "SEQ";
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
    var op1 = Number(modes[0] === 0 ? tape[tape[pointer + 1]] : tape[pointer + 1]);
    var op2 = Number(modes[1] === 0 ? tape[tape[pointer + 2]] : tape[pointer + 2]);
    var dest = Number(tape[pointer + 3]);
    tape[dest] = (op1 + op2).toString();
    execute(tape, pointer + 4);
}
function mul(tape, pointer) {
    var modes = getModes(tape[pointer]);
    var op1 = Number(modes[0] === 0 ? tape[tape[pointer + 1]] : tape[pointer + 1]);
    var op2 = Number(modes[1] === 0 ? tape[tape[pointer + 2]] : tape[pointer + 2]);
    var dest = Number(tape[pointer + 3]);
    tape[dest] = (op1 * op2).toString();
    execute(tape, pointer + 4);
}
function out(tape, pointer) {
    var modes = getModes(tape[pointer]);
    var op = modes[0] === 0 ? tape[tape[pointer + 1]] : tape[pointer + 1];
    console.log(op);
    execute(tape, pointer + 2);
}
function write(tape, pointer) {
    var dest = Number(tape[pointer + 1]);
    if (infile == null) {
        rl.question('> Input: ', function (ans) {
            tape[dest] = ans;
            execute(tape, pointer + 2);
        });
    }
    else {
        tape[dest] = infileContent[infilePtr++];
        execute(tape, pointer + 2);
    }
}
function jumpIfTrue(tape, pointer) {
    var modes = getModes(tape[pointer]);
    var op = Number(modes[0] === 0 ? tape[tape[pointer + 1]] : tape[pointer + 1]);
    var dest = Number(modes[1] === 0 ? tape[tape[pointer + 2]] : tape[pointer + 2]);
    if (op != 0) {
        execute(tape, dest);
    }
    else {
        execute(tape, pointer + 3);
    }
}
function jumpIfFalse(tape, pointer) {
    var modes = getModes(tape[pointer]);
    var op = Number(modes[0] === 0 ? tape[tape[pointer + 1]] : tape[pointer + 1]);
    var dest = Number(modes[1] === 0 ? tape[tape[pointer + 2]] : tape[pointer + 2]);
    if (op === 0) {
        execute(tape, dest);
    }
    else {
        execute(tape, pointer + 3);
    }
}
function lessThan(tape, pointer) {
    var modes = getModes(tape[pointer]);
    var op1 = Number(modes[0] === 0 ? tape[tape[pointer + 1]] : tape[pointer + 1]);
    var op2 = Number(modes[1] === 0 ? tape[tape[pointer + 2]] : tape[pointer + 2]);
    var dest = Number(tape[pointer + 3]);
    if (op1 < op2) {
        tape[dest] = '1';
    }
    else {
        tape[dest] = '0';
    }
    execute(tape, pointer + 4);
}
function equals(tape, pointer) {
    var modes = getModes(tape[pointer]);
    var op1 = Number(modes[0] === 0 ? tape[tape[pointer + 1]] : tape[pointer + 1]);
    var op2 = Number(modes[1] === 0 ? tape[tape[pointer + 2]] : tape[pointer + 2]);
    var dest = Number(tape[pointer + 3]);
    if (op1 === op2) {
        tape[dest] = '1';
    }
    else {
        tape[dest] = '0';
    }
    execute(tape, pointer + 4);
}
function halt(tape, pointer) {
    process.exit();
}
function execute(tape, pointer) {
    var token = tape[pointer];
    var opcode = getOpcode(token);
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
            throw 'Invalid opcode!';
    }
}
function main(err, data) {
    if (err) {
        throw err;
    }
    var tape = data.split(",");
    if (infile != null) {
        fs.readFile(infile, 'utf8', function (err, data) {
            if (err) {
                throw err;
            }
            infileContent = data.trim().split("\n");
            infilePtr = 0;
            execute(tape, 0);
        });
    }
    else {
        execute(tape, 0);
    }
}
