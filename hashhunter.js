const crypto = require("crypto");

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*().-+[] {}|_\"'";
let attempts = 0;

const hashFunctions = {
    md5: (input) => crypto.createHash("md5").update(input).digest("hex"),
    sha1: (input) => crypto.createHash("sha1").update(input).digest("hex"),
    sha256: (input) => crypto.createHash("sha256").update(input).digest("hex"),
    sha512: (input) => crypto.createHash("sha512").update(input).digest("hex"),
};

const colors = {
    reset: "\x1b[0m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    red: "\x1b[31m",
};

const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} minutes and ${seconds} seconds`;
};

console.error(`${colors.red}HashHunter v0.2 by zaid${colors.reset}`);
console.error(`${colors.red}New features and algorithm added by Fsociety${colors.reset}`);

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log(`${colors.blue}
  ╔══════════════════════════════════════╗
  ║          HashHunter v0.2             ║
  ╚══════════════════════════════════════╝
${colors.reset}
Usage: node HashHunter.js --hash=<hash> [--algo=<md5|sha1|sha256|sha512>] [--silent] [--maxlen=<n>] [--startlen=<n>]

Options:
  ${colors.cyan}--hash${colors.reset}     : Target hash to brute-force (required)
  ${colors.cyan}--algo${colors.reset}     : Hash algorithm to use (optional – auto-detects by default)
  ${colors.cyan}--silent${colors.reset}   : Suppress verbose output (optional)
  ${colors.cyan}--maxlen${colors.reset}   : Maximum password length to try (optional, default is 8)
  ${colors.cyan}--startlen${colors.reset} : Minimum password length to try (optional, default is 1)

Examples:
  node HashHunter.js --hash=098f6bcd4621d373cade4e832627b4f6
  node HashHunter.js --hash=5d41402abc4b2a76b9719d911017c592 --algo=md5 --startlen=4 --maxlen=6
`);
    process.exit(0);
}

const hashArg = args.find((arg) => arg.startsWith("--hash="));
const algoArg = args.find((arg) => arg.startsWith("--algo="));
const maxLenArg = args.find((arg) => arg.startsWith("--maxlen="));
const startLenArg = args.find((arg) => arg.startsWith("--startlen="));
const silentMode = args.includes("--silent");

if (!hashArg) {
    console.error(`${colors.red}[-] Missing --hash argument.${colors.reset}`);
    process.exit(1);
}

const targetHash = hashArg.split("=")[1];
let algorithm = algoArg ? algoArg.split("=")[1].toLowerCase() : null;
const maxLen = maxLenArg ? parseInt(maxLenArg.split("=")[1]) : 8;
const startLen = startLenArg ? parseInt(startLenArg.split("=")[1]) : 1;

if (startLen > maxLen) {
    console.error(`${colors.red}[-] --startlen cannot be greater than --maxlen.${colors.reset}`);
    process.exit(1);
}

if (!algorithm) {
    switch (targetHash.length) {
        case 32: algorithm = "md5"; break;
        case 40: algorithm = "sha1"; break;
        case 64: algorithm = "sha256"; break;
        case 128: algorithm = "sha512"; break;
        default:
            console.error(`${colors.red}[-] Unknown hash length (${targetHash.length}) – please use --algo=...${colors.reset}`);
            process.exit(1);
    }
    if (!silentMode) {
        console.log(`${colors.cyan}[!] Auto-detected algorithm: ${algorithm.toUpperCase()}${colors.reset}`);
    }
}

if (!hashFunctions[algorithm]) {
    console.error(`${colors.red}[-] Unsupported algorithm: ${algorithm}${colors.reset}`);
    process.exit(1);
}

const bruteForce = (targetHash, algorithm) => {
    if (!silentMode) console.log("[*] Starting brute-force attack...");
    const startTime = Date.now();

    for (let length = startLen; length <= maxLen; length++) {
        if (!silentMode) console.log(`[*] Trying passwords of length: ${length}`);
        const indices = Array(length).fill(0);
        const maxIndex = chars.length;

        while (true) {
            const candidate = indices.map((i) => chars[i]).join("");
            attempts++;

            if (hashFunctions[algorithm](candidate) === targetHash) {
                const endTime = Date.now();
                console.log(`${colors.green}[+] Password found: ${candidate}${colors.reset}`);
                console.log(`${colors.green}[+] Time taken: ${formatTime(endTime - startTime)}${colors.reset}`);
                process.exit(0);
            }

            if (!silentMode && attempts % 100000 === 0) {
                console.log(`${colors.cyan}[+] Attempts: ${attempts} | Password: ${candidate}${colors.reset}`);
            }

            let incremented = false;
            for (let i = length - 1; i >= 0; i--) {
                indices[i]++;
                if (indices[i] < maxIndex) {
                    incremented = true;
                    break;
                }
                indices[i] = 0;
            }

            if (!incremented) break;
        }
    }

    const endTime = Date.now();
    if (!silentMode) {
        console.log(`${colors.red}[-] No matching password found.${colors.reset}`);
        console.log(`${colors.red}[-] Time taken: ${formatTime(endTime - startTime)}${colors.reset}`);
    }
    process.exit(1);
};

bruteForce(targetHash, algorithm);
