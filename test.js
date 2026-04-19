// Test suite for the 4-bit assembler CONST directive
// Run with: node test.js

const OPCODES = {
    'LDA': 0x1, 'STA': 0x2, 'ADD': 0x3, 'SUB': 0x4,
    'JMP': 0x5, 'JZ': 0x6, 'JC': 0x7, 'OUT': 0x8,
    'HLT': 0x9, 'NOP': 0x0
};

function assemble(code) {
    const lines = code.split('\n');
    const errors = [];
    const program = [];
    const labels = {};
    const constants = {};
    let address = 0;

    // First pass: collect labels and constants
    for (let line of lines) {
        line = line.trim();
        if (line === '' || line.startsWith(';')) continue;

        const stripped = line.includes(';') ? line.split(';')[0].trim() : line;

        if (stripped.toUpperCase().startsWith('CONST ')) {
            const parts = stripped.split(/\s+/);
            if (parts.length < 3) {
                errors.push(`CONST directive requires a name and value: '${line}'`);
                return { ok: false, errors };
            }
            const constName = parts[1].toUpperCase();
            if (OPCODES.hasOwnProperty(constName)) {
                errors.push(`Constant name '${parts[1]}' conflicts with an instruction`);
                return { ok: false, errors };
            }
            const constValue = parseInt(parts[2]);
            if (isNaN(constValue) || constValue < 0 || constValue > 15) {
                errors.push(`Constant '${parts[1]}' value must be 0-15, got '${parts[2]}'`);
                return { ok: false, errors };
            }
            constants[constName] = constValue;
            continue;
        }

        if (stripped.includes(':')) {
            const labelName = stripped.split(':')[0].trim();
            labels[labelName] = address;
            continue;
        }

        address++;
    }

    // Second pass: assemble instructions
    for (let line of lines) {
        line = line.trim();
        if (line === '' || line.startsWith(';')) continue;
        if (line.includes(';')) line = line.split(';')[0].trim();
        if (line.toUpperCase().startsWith('CONST ')) continue;
        if (line.includes(':')) continue;

        const parts = line.split(/\s+/);
        const instruction = parts[0].toUpperCase();

        if (!OPCODES.hasOwnProperty(instruction)) {
            errors.push(`Unknown instruction '${instruction}'`);
            return { ok: false, errors };
        }

        let operand = 0;
        if (parts.length > 1) {
            const param = parts[1];
            const paramUpper = param.toUpperCase();
            if (constants.hasOwnProperty(paramUpper)) {
                operand = constants[paramUpper];
            } else if (labels.hasOwnProperty(param)) {
                operand = labels[param];
            } else {
                operand = parseInt(param) & 0xF;
            }
        }

        program.push({ opcode: OPCODES[instruction], operand });
    }

    return { ok: true, program, labels, constants };
}

// --- Test helpers ---
let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`  PASS  ${name}`);
        passed++;
    } catch (e) {
        console.log(`  FAIL  ${name}`);
        console.log(`        ${e.message}`);
        failed++;
    }
}

function assert(cond, msg) {
    if (!cond) throw new Error(msg || 'assertion failed');
}

function assertEqual(a, b) {
    if (a !== b) throw new Error(`expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}

// --- Tests ---

console.log('\nConstant definition and resolution');

test('basic CONST resolves in LDA operand', () => {
    const r = assemble('CONST ADDR 5\nLDA ADDR');
    assert(r.ok, r.errors && r.errors[0]);
    assertEqual(r.program[0].operand, 5);
});

test('CONST is case-insensitive for name lookup', () => {
    const r = assemble('CONST myval 7\nLDA myval');
    assert(r.ok);
    assertEqual(r.program[0].operand, 7);
});

test('CONST name stored uppercase, used lowercase in code', () => {
    const r = assemble('CONST BASE 3\nLDA base');
    assert(r.ok);
    assertEqual(r.program[0].operand, 3);
});

test('CONST works with ADD instruction', () => {
    const r = assemble('CONST SRC 8\nADD SRC');
    assert(r.ok);
    assertEqual(r.program[0].operand, 8);
});

test('CONST works with STA instruction', () => {
    const r = assemble('CONST DEST 11\nSTA DEST');
    assert(r.ok);
    assertEqual(r.program[0].operand, 11);
});

test('CONST works with JMP instruction', () => {
    const r = assemble('CONST TARGET 2\nJMP TARGET');
    assert(r.ok);
    assertEqual(r.program[0].operand, 2);
});

test('multiple CONSTs are all available', () => {
    const r = assemble('CONST A 1\nCONST B 2\nCONST C 3\nLDA A\nLDA B\nLDA C');
    assert(r.ok);
    assertEqual(r.program[0].operand, 1);
    assertEqual(r.program[1].operand, 2);
    assertEqual(r.program[2].operand, 3);
});

test('CONST boundary value 0', () => {
    const r = assemble('CONST ZERO 0\nLDA ZERO');
    assert(r.ok);
    assertEqual(r.program[0].operand, 0);
});

test('CONST boundary value 15', () => {
    const r = assemble('CONST MAX 15\nLDA MAX');
    assert(r.ok);
    assertEqual(r.program[0].operand, 15);
});

test('CONST does not allocate a memory address', () => {
    // One instruction + one label, no CONST address consumed
    const r = assemble('CONST FOO 5\nLDA FOO\nval: 3');
    assert(r.ok);
    assertEqual(r.labels['val'], 1); // label at address 1, not 2
});

test('CONST with inline comment is parsed correctly', () => {
    const r = assemble('CONST LIMIT 9  ; max iterations\nLDA LIMIT');
    assert(r.ok);
    assertEqual(r.program[0].operand, 9);
});

test('CONST coexists with labels', () => {
    const r = assemble('CONST STEP 13\nstart:\n  LDA counter\n  ADD STEP\n  STA counter\n  JMP start\ncounter: 0');
    assert(r.ok);
    // LDA counter -> label 'counter' is at address 4 (4 instructions)
    assertEqual(r.program[0].operand, 4);
    // ADD STEP -> constant 13
    assertEqual(r.program[1].operand, 13);
});

console.log('\nConstant validation errors');

test('CONST with value > 15 is rejected', () => {
    const r = assemble('CONST BAD 16\nLDA BAD');
    assert(!r.ok);
});

test('CONST with value < 0 is rejected', () => {
    const r = assemble('CONST NEG -1\nLDA NEG');
    assert(!r.ok);
});

test('CONST with non-numeric value is rejected', () => {
    const r = assemble('CONST BAD abc\nLDA BAD');
    assert(!r.ok);
});

test('CONST name matching instruction is rejected', () => {
    const r = assemble('CONST LDA 5');
    assert(!r.ok);
});

test('CONST name matching instruction (any case) is rejected', () => {
    const r = assemble('CONST add 3');
    assert(!r.ok);
});

test('CONST without value is rejected', () => {
    const r = assemble('CONST NOVALUE\nLDA NOVALUE');
    assert(!r.ok);
});

console.log('\nProgram correctness');

test('full counter program assembles correctly', () => {
    const code = [
        'CONST ONE_SLOT 5  ; address 5 will hold 1',
        'start:',
        '    LDA counter',
        '    ADD ONE_SLOT',
        '    STA counter',
        '    OUT',
        '    JMP start',
        'counter: 0',
    ].join('\n');
    const r = assemble(code);
    assert(r.ok, r.errors && r.errors[0]);
    // 5 instructions: LDA counter ADD ONE_SLOT STA counter OUT JMP start
    assertEqual(r.program.length, 5);
    // ADD should use constant value 5
    assertEqual(r.program[1].operand, 5);
});

// --- Summary ---
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
