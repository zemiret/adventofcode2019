import sys
from functools import reduce
from enum import Enum 
import operator


DEBUG = False 

class Opcode(Enum):
    ADD = 1
    MUL = 2
    WRB = 3
    OUT = 4
    JIT = 5
    JIF = 6
    SLT = 7
    SEQ = 8
    HALT = 99
    

class Mode(Enum):
    POS = 0
    IMM = 1


def get_opcode(token):
    return Opcode(int(token[-2:]))


def get_modes(token):
    modes = [Mode.POS] * 3
    token = token[:-2]

    for i in range(3):
        mode = '0' if len(token) == 0 else token[-1]
        modes[i] = Mode(int(mode))
        token = token[:-1]
    
    return modes


def get_param(tape, pos, mode=Mode.IMM):
    return int((tape[int(tape[pos])] if mode == Mode.POS else tape[pos]))


# ------------- INSTRUCTIONS START -------------------
def add(tape, pc):
    modes = get_modes(tape[pc])
    op1 = get_param(tape, pc + 1, modes[0])
    op2 = get_param(tape, pc + 2, modes[1])
    dest = get_param(tape, pc + 3)

    if (DEBUG):
        print('ADD: tape[{}] = {} + {}'.format(dest, op1, op2))

    tape[dest] = str(op1 + op2)
    execute(tape, pc + 4)


def mul(tape, pc):
    modes = get_modes(tape[pc])
    op1 = get_param(tape, pc + 1, modes[0])
    op2 = get_param(tape, pc + 2, modes[1])
    dest = get_param(tape, pc + 3)

    if (DEBUG):
        print('MUL: tape[{}] = {} * {}'.format(dest, op1, op2))

    tape[dest] = str(op1 * op2)
    execute(tape, pc + 4)


def writeback(tape, pc):
    dest = get_param(tape, pc + 1)
    tape[dest] = input()

    if (DEBUG):
        print('WRB: tape[{}] = {}'.format(dest, tape[dest]))

    execute(tape, pc + 2)


def out(tape, pc):
    modes = get_modes(tape[pc])
    op = get_param(tape, pc + 1, modes[0])

    if (DEBUG):
        print('OUT: print(tape[{}])'.format(op))

    print(op)
    execute(tape, pc + 2)


def jump_if(tape, pc, cond):
    modes = get_modes(tape[pc])
    op = get_param(tape, pc + 1, modes[0])
    dest = get_param(tape, pc + 2, modes[1])

    if (DEBUG):
        print('JUMP IF: op = {}, dest = {}'.format(op, dest))

    if (cond(op)):
        execute(tape, int(dest))
    else:
        execute(tape, pc + 3)


def jump_if_true(tape, pc):
    if (DEBUG):
        print('JUMP IF TRUE')

    jump_if(tape, pc, lambda op: op != 0)


def jump_if_false(tape, pc):
    if (DEBUG):
        print('JUMP IF FALSE')

    jump_if(tape, pc, lambda op: op == 0)


def store_if(tape, pc, cond):
    modes = get_modes(tape[pc])
    op1 = get_param(tape, pc + 1, modes[0])
    op2 = get_param(tape, pc + 2, modes[1])
    dest = get_param(tape, pc + 3)

    if (DEBUG):
        print('STORE IF: op1 = {}, op2 = {}, dest = {}'.format(op1, op2, dest))

    if (cond(op1, op2)):
        tape[dest] = '1'
    else:
        tape[dest] = '0'

    execute(tape, pc + 4)


def store_less_than(tape, pc):
    if (DEBUG):
        print('STORE LESS THAN:')

    store_if(tape, pc, lambda op1, op2: op1 < op2)


def store_equal(tape, pc):
    if (DEBUG):
        print('STORE EQUAL:')

    store_if(tape, pc, lambda op1, op2: op1 == op2)


def halt(tape, pc):
    if (DEBUG):
        print('HALT')

    sys.exit(0)

# -------------- INSTRUCTIONS END --------------

operation_map = {
    Opcode.ADD: add,
    Opcode.MUL: mul,
    Opcode.WRB: writeback,
    Opcode.OUT: out,
    Opcode.JIT: jump_if_true,
    Opcode.JIF: jump_if_false,
    Opcode.SLT: store_less_than,
    Opcode.SEQ: store_equal,
    Opcode.HALT: halt
}



def execute(tape, pc):
    operation_map[get_opcode(tape[pc])](tape, pc)


def help():
    print('Usage: python intcode.py tapeprogram')


def main(infile):
    with open(infile, 'r') as f:
        lines = f.readlines()
        tape = reduce(operator.add,
                      map(lambda x: x.strip(), lines)
                     ).split(',')


        if (DEBUG):
            print(tape)

        execute(tape, 0)



if __name__ == '__main__':
    if len(sys.argv) < 2:
        help()
        sys.exit(-1)

    main(sys.argv[1])
