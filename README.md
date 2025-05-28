# 🔓 HashHunter
formerly md5hunter

[![asciicast](https://asciinema.org/a/0mVZyK4ZbMvlALhwu559zFXod.svg)](https://asciinema.org/a/0mVZyK4ZbMvlALhwu559zFXod)

**HashHunter** is a brute-force hash cracking tool written in Node.js. It attempts to recover plaintext passwords from hashes by generating all possible character combinations up to a specified length.

🚀 **Supports:** `MD5`, `SHA1`, `SHA256`, `SHA512`  
🧠 **Brute-force logic:** Smart iterative generation  
📏 **Customizable:** Set your own starting and max password length  

---

## ⚙️ Features

- 🔑 Brute-forces hashes using all printable characters
- 🧠 Smart algorithm auto-detection
- 📏 `--startlen` and `--maxlen` control brute-force depth
- 🔇 `--silent` mode for clean output
- 📣 Verbose progress logging every 100,000 tries (unless silent)
- ⚡ Written in JavaScript
---

## 📦 Usage

> **Requirements:**  
> Node.js must be installed on your system.

```bash
node hashhunter.js --hash=<HASH> [--algo=<md5|sha1|sha256|sha512>] [--startlen=<n>] [--maxlen=<n>] [--silent]
```

🔍 Example:

node hashhunter.js --hash=5d41402abc4b2a76b9719d911017c592 --algo=md5 --startlen=3 --maxlen=5


🤝 Contributing

Have ideas? Want to contribute an improvement or fix? PRs are welcome.

⸻

## 🙏 Credits
- 👨‍💻 **By:** Zaid  
- 🧠 **Special thanks to:** Fsociety for extending algorithm support

⸻

📫 Contact

Email: zd@linux.com
Twitter/X: @syfi2k

⸻
## 🚧 To-Do

- [x]  Add more algorithm
- [x]  Add Auto-detected algorithm
- [ ]  Add salt option
- [ ]  Add more functions
