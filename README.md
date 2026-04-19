# 🖥️ 4-bit Computer Simulator

A simple, educational web-based simulator for developing and running assembly code on a 4-bit processor architecture.

![Language](https://img.shields.io/badge/language-JavaScript-yellow)
![Platform](https://img.shields.io/badge/platform-Web-blue)
![Architecture](https://img.shields.io/badge/architecture-4--bit-red)

## 📖 Overview

This HTML/JS/CSS application provides an interactive environment to:
- ✍️ Write assembly code for a custom 4-bit processor
- ▶️ Execute programs step-by-step or continuously
- 🔍 Observe CPU state, memory, and flag changes in real-time
- 🎓 Learn fundamental computer architecture concepts

## 🔧 Instruction Set Architecture (ISA)

### Data Transfer Instructions

| Instruction | Opcode | Description | Operation |
|-------------|--------|-------------|-----------|
| **LDA** addr | - | Load Accumulator | `A = MEM[addr]` |
| **STA** addr | - | Store Accumulator | `MEM[addr] = A` |

### Arithmetic Instructions

| Instruction | Opcode | Description | Operation | Flags |
|-------------|--------|-------------|-----------|-------|
| **ADD** addr | - | Add | `A = A + MEM[addr]` | Sets **C** on overflow |
| **SUB** addr | - | Subtract | `A = A - MEM[addr]` | Sets **C** on underflow |

### Control Flow Instructions

| Instruction | Opcode | Description | Operation | Condition |
|-------------|--------|-------------|-----------|-----------|
| **JMP** addr | - | Jump (Unconditional) | `PC = addr` | Always |
| **JZ** addr | - | Jump if Zero | `PC = addr` | If `Z = 1` |
| **JC** addr | - | Jump if Carry | `PC = addr` | If `C = 1` |

### I/O and System Instructions

| Instruction | Opcode | Description | Operation |
|-------------|--------|-------------|-----------|
| **OUT** | - | Output | Outputs accumulator value to console |
| **HLT** | - | Halt | Stops program execution |
| **NOP** | - | No Operation | Advances to next instruction |

## 📝 Programming Guidelines

### Architecture Constraints
- ⚙️ **Data Width**: All values are 4-bit (0-15)
- 📍 **Address Space**: Memory addresses are 4-bit (16 locations: 0-15)
- 🚩 **Flags**: Zero (Z) and Carry (C) flags

### Syntax Rules
- 🏷️ **Labels**: Can be used instead of numeric addresses
- 🔢 **Constants**: Define symbolic names for numeric values with `CONST`
- 💬 **Comments**: Start with semicolon (`;`)
- 🔤 **Case Sensitivity**: Instructions are case-insensitive

### Constants

Use the `CONST` directive to define named compile-time values. Constants are substituted at assembly time and **do not allocate memory**.

**Syntax:** `CONST name value`

- `name` — symbolic identifier (case-insensitive, must not match an instruction name)
- `value` — integer in range 0–15

```asm
CONST ONE   1     ; symbolic name for the number 1
CONST LIMIT 15    ; max 4-bit value
```

Constants can be used anywhere a label or numeric operand is accepted:

```asm
CONST COUNTER_ADDR 12   ; address 12 holds the counter
CONST ONE_ADDR     13   ; address 13 holds the value 1

start:
    LDA COUNTER_ADDR   ; load counter value
    ADD ONE_ADDR       ; increment
    STA COUNTER_ADDR   ; store result
    OUT
    JMP start
```

Unlike labels (`name: value`), constants never occupy a memory slot — they are purely symbolic and resolved during assembly.

### Example Program
```asm
; Simple counter program using constants
CONST STEP 1          ; step size (memory address that holds 1)

start:
      LDA counter    ; Load current count
      ADD one        ; Increment by 1
      STA counter    ; Store back to memory
      OUT            ; Display result
      JMP start      ; Loop forever

counter: 0
one:     1
```

## 🚀 Getting Started

1. Open the HTML file in a web browser
2. Write your assembly code in the editor
3. Click "Assemble" to compile
4. Use "Step" or "Run" to execute your program
5. Observe the CPU state and output

## 🎯 Learning Objectives

This simulator helps understand:
- **Instruction fetch-decode-execute cycle**
- **Register operations** (accumulator-based architecture)
- **Memory addressing**
- **Program counter** and control flow
- **Flag-based conditional branching**
- **Assembly language programming**

## 📚 Resources

- 4-bit architecture is similar to historical CPUs like the Intel 4004
- Accumulator-based design simplifies the instruction set
- Perfect for learning computer organization fundamentals

<div align="center">

**Built with ❤️ for Computer Science Education**

</div>
