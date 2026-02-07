# 4bit Simulator
Simple 4-bit system simulator within a browser. Initially generated from Claude, this will be estended to include addtional instructions. 

# Instruction Set Architecture (ISA)
**LDA** addr - Load Accumulator
Loads the 4-bit value from memory address into the accumulator. A = MEM[addr]

**STA** addr - Store Accumulator
Stores the accumulator value into memory address. MEM[addr] = A

**ADD** addr - Add
Adds the value at memory address to accumulator. A = A + MEM[addr]. Sets carry flag on overflow.

**SUB** addr - Subtract
Subtracts the value at memory address from accumulator. A = A - MEM[addr]. Sets carry on underflow.

**JMP** addr - Jump
Unconditional jump to address. PC = addr

**JZ** addr - Jump if Zero
Jump to address if zero flag is set. If Z=1 then PC = addr

**JC** addr - Jump if Carry
Jump to address if carry flag is set. If C=1 then PC = addr

**OUT** - Output
Outputs the accumulator value to the console

**HLT** - Halt
Stops program execution

**NOP** - No Operation
Does nothing, advances to next instruction

# Notes:
All values are 4-bit (0-15)
Memory addresses are 4-bit (0-15)
Labels can be used instead of addresses
Comments start with semicolon (;)
Instructions are case-insensitive
