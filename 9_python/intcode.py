import sys
from functools import reduce
from enum import Enum 
import operator


DEBUG = True 

class Opcode(Enum):
    ADD = 1
    MUL = 2
    WRB = 3
    OUT = 4
    JIT = 5
    JIF = 6
    SLT = 7
    SEQ = 8
    ARB = 9
    HALT = 99
    

class Mode(Enum):
    POS = 0
    IMM = 1
    REL = 2


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


class Intcode:
    MEM = 1024 * 1024 

    def __init__(self, tape, start_pc = 0):
        self.tape = tape
        self.pc = start_pc
        self.base = 0

        self.operation_map = {
            Opcode.ADD: self.add,
            Opcode.MUL: self.mul,
            Opcode.WRB: self.writeback,
            Opcode.OUT: self.out,
            Opcode.JIT: self.jump_if_true,
            Opcode.JIF: self.jump_if_false,
            Opcode.SLT: self.store_less_than,
            Opcode.SEQ: self.store_equal,
            Opcode.ARB: self.adjust_base,
            Opcode.HALT: self.halt
        }

        self.tape += self.memory()


    def memory(self):
        return ['0'] * self.MEM 


    def get_param(self, pos, mode=Mode.IMM):
        if mode == Mode.POS:
            return int(self.tape[int(self.tape[pos])])
        elif mode == Mode.IMM:
            return int(self.tape[pos])
        elif mode == Mode.REL:
            return int(self.tape[int(self.tape[pos]) + self.base])
        else:
            raise Exception('Invalid Mode! ' + mode)


    # ------------- INSTRUCTIONS START -------------------
    def add(self):
        modes = get_modes(self.tape[self.pc])
        op1 = self.get_param(self.pc + 1, modes[0])
        op2 = self.get_param(self.pc + 2, modes[1])
        dest = self.get_param(self.pc + 3)
    
        if DEBUG:
            print('ADD: self.tape[{}] = {} + {}'.format(dest, op1, op2))
    
        self.tape[dest] = str(op1 + op2)

        self.pc += 4
        self.execute()
    
    
    def mul(self):
        modes = get_modes(self.tape[self.pc])
        op1 = self.get_param(self.pc + 1, modes[0])
        op2 = self.get_param(self.pc + 2, modes[1])
        dest = self.get_param(self.pc + 3)
    
        if DEBUG:
            print('MUL: self.tape[{}] = {} * {}'.format(dest, op1, op2))
    
        self.tape[dest] = str(op1 * op2)

        self.pc += 4
        self.execute()
    
    
    def writeback(self):
        dest = self.get_param(self.pc + 1)
        self.tape[dest] = input()
    
        if DEBUG:
            print('WRB: self.tape[{}] = {}'.format(dest, self.tape[dest]))
    
        self.pc += 2
        self.execute()
    
    
    def out(self):
        modes = get_modes(self.tape[self.pc])
        op = self.get_param(self.pc + 1, modes[0])
    
        if DEBUG:
            print('OUT: print(self.tape[{}])'.format(self.pc + 1))
    
        print(op)

        self.pc += 2
        self.execute()
    
    
    def jump_if(self, cond):
        modes = get_modes(self.tape[self.pc])
        op = self.get_param(self.pc + 1, modes[0])
        dest = self.get_param(self.pc + 2, modes[1])
    
        if DEBUG:
            print('JUMP IF: op = {}, dest = {}'.format(op, dest))
    
        if (cond(op)):
            self.pc = int(dest)
        else:
            self.pc += 3

        self.execute()
    
    
    def jump_if_true(self):
        if DEBUG:
            print('JUMP IF TRUE')
    
        self.jump_if(lambda op: op != 0)
    
    
    def jump_if_false(self):
        if DEBUG:
            print('JUMP IF FALSE')
    
        self.jump_if(lambda op: op == 0)
    
    
    def store_if(self, cond):
        modes = get_modes(self.tape[self.pc])
        op1 = self.get_param(self.pc + 1, modes[0])
        op2 = self.get_param(self.pc + 2, modes[1])
        dest = self.get_param(self.pc + 3)
    
        if DEBUG:
            print('STORE IF: op1 = {}, op2 = {}, dest = {}'.format(op1, op2, dest))
    
        if (cond(op1, op2)):
            self.tape[dest] = '1'
        else:
            self.tape[dest] = '0'
    
        self.pc += 4
        self.execute()
    
    
    def store_less_than(self):
        if DEBUG:
            print('STORE LESS THAN:')
    
        self.store_if(lambda op1, op2: op1 < op2)
    
    
    def store_equal(self):
        if DEBUG:
            print('STORE EQUAL:')
    
        self.store_if(lambda op1, op2: op1 == op2)


    def adjust_base(self):
        modes = get_modes(self.tape[self.pc])
        op = self.get_param(self.pc + 1, modes[0])

        self.base += op

        if DEBUG:
            print('ADJUST BASE: + {}, base = {}'.format(op, self.base))

        self.pc += 2
        self.execute()
    
    
    def halt(self):
        if DEBUG:
            print('HALT')
    
        sys.exit(0)

    def execute(self):
        self.operation_map[get_opcode(self.tape[self.pc])]()
    
    # -------------- INSTRUCTIONS END --------------
    


def help():
    print('Usage: python intcode.py tapeprogram')


def main(infile):
    with open(infile, 'r') as f:
        lines = f.readlines()
        tape = reduce(operator.add,
                      map(lambda x: x.strip(), lines)
                     ).split(',')


        if DEBUG:
            print(tape)

        Intcode(tape, 0).execute()



if __name__ == '__main__':
    if len(sys.argv) < 2:
        help()
        sys.exit(-1)

    main(sys.argv[1])
