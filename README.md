# 🖥️ 4-bit Computer Simulator

A simple, educational web-based simulator for developing and running assembly code on a 4-bit processor architecture.

![Language](https://img.shields.io/badge/language-JavaScript-yellow)
![Platform](https://img.shields.io/badge/platform-Web-blue)
![Architecture](https://img.shields.io/badge/architecture-4--bit-red)

---

## 📖 Overview

This HTML/JS/CSS application provides an interactive environment to:
- ✍️ Write assembly code for a custom 4-bit processor
- ▶️ Execute programs step-by-step or continuously
- 🔍 Observe CPU state, memory, and flag changes in real-time
- 🎓 Learn fundamental computer architecture concepts

---

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
|-------------|-------
