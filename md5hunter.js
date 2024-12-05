const crypto = require("crypto");

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*().-+[] {}|_\"'";
let attempts = 0;

// md5 hash function
const md5Hash = (input) => crypto.createHash("md5").update(input).digest("hex");

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

    console.error(`${colors.red}MD5Hunter v0.1 by Zed${colors.reset}`);

const args = process.argv.slice(2);
const hashArg = args.find((arg) => arg.startsWith("--hash="));
const silentMode = args.includes("--silent");

if (!hashArg) {
    console.error(`${colors.red}[-] Missing --hash argument. Usage: node script.js --hash=<md5-hash> [--silent]${colors.reset}`);
    process.exit(1);
}

const targetHash = hashArg.split("=")[1];
if (!targetHash || targetHash.length !== 32 || !/^[a-fA-F0-9]+$/.test(targetHash)) {
    console.error(`${colors.red}[-] Invalid hash. Ensure it is a valid 32-character MD5 hash.${colors.reset}`);
    process.exit(1);
}

// ADD NEW function with iterative password generation
const bruteForce = (targetHash) => {
    if (!silentMode) console.log("[*] Starting brute-force attack...");
    const startTime = Date.now();
    let found = false;

    for (let length = 1; length <= 19; length++) {
        if (!silentMode) console.log(`[*] Trying passwords of length: ${length}`);

        const indices = Array(length).fill(0);
        const maxIndex = chars.length;

        while (true) {
            // Generate the password based on indices
            const candidate = indices.map((i) => chars[i]).join("");
            attempts++;

            // hash check
            if (md5Hash(candidate) === targetHash) {
                const endTime = Date.now();
                console.log(`${colors.green}[+] Password found: ${candidate}${colors.reset}`);
                console.log(`${colors.green}[+] Time taken: ${formatTime(endTime - startTime)}${colors.reset}`);
                process.exit(0); 
            }

            if (!silentMode && attempts % 100000 === 0) {
                console.log(`${colors.cyan}[+] Attempts: ${attempts} | Password: ${candidate}${colors.reset}`);
            }

            // Update indices for the next candidate
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

        if (found) break;
    }

    if (!found) {
        const endTime = Date.now();
        if (!silentMode) {
            console.log(`${colors.red}[-] No matching password found.${colors.reset}`);
            console.log(`${colors.red}[-] Time taken: ${formatTime(endTime - startTime)}${colors.reset}`);
        }
        process.exit(1);
    }
};

// Start 
bruteForce(targetHash);
