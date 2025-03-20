const input = document.querySelector("input");
const messageBox = document.querySelector(".message");
const wordsBox = document.querySelector(".words");

let execId = 0;
let trie = {};

function getTrie(compressed) {
  let decompressed = compressed;
  decompressed = decompressed.replace(/([A-Z])/g, (c) => c.toLowerCase() + "$");
  decompressed = decompressed.replace(/([a-z])/g, '"$1":{');
  decompressed = decompressed.replace(/([0-9]+)/g, "$1,").slice(0, -1);
  decompressed = decompressed.replace(/\$([^0-9])/g, "$,$1");
  const getEndBrackets = (c) => "}".repeat(parseInt(c, 10));
  decompressed = decompressed.replace(/([0-9]+)/g, getEndBrackets);
  decompressed = decompressed.replaceAll("$", '"$":1');
  return JSON.parse(decompressed);
}

function getPossibleWords(letters) {
  const words = [];
  const stack = [[trie, "", letters]];
  while (stack.length > 0) {
    const [currentNode, prefix, unusedLetters] = stack.pop();
    if (currentNode.$ && prefix.length === letters.length) {
      words.push(prefix);
    }
    if (prefix.length < letters.length) {
      const chars = Object.keys(currentNode).filter((key) => key !== "$");
      for (let i = chars.length - 1; i >= 0; i--) {
        const char = chars[i];
        if (!unusedLetters.includes(char)) {
          continue;
        }
        const indexOfChar = unusedLetters.indexOf(char);
        const newUnusedLetters = [
          ...unusedLetters.slice(0, indexOfChar),
          ...unusedLetters.slice(indexOfChar + 1),
        ];
        stack.push([currentNode[char], prefix + char, newUnusedLetters]);
      }
    }
  }
  return words;
}

function handleKeyup({ target }) {
  const value = target.value.toLowerCase().replace(/[^a-z]/g, "");
  target.value = value;
  if (!value.length) {
    messageBox.innerHTML = "Enter letters above to see words below.";
    wordsBox.innerHTML = "";
    return;
  }
  const possibleWords = getPossibleWords(value.split(""));
  const numWords = possibleWords.length;
  if (!numWords) {
    messageBox.innerHTML = "No words could be formed! :(";
    wordsBox.innerHTML = "";
    return;
  }
  messageBox.innerHTML = `Formed ${numWords} word${numWords === 1 ? "" : "s"}${
    numWords > 100 ? " (showing first 100)" : ""
  }:`;
  wordsBox.innerHTML = possibleWords
    .slice(0, 100)
    .map((word) => `<div>${word}</div>`)
    .join("");
}

input.addEventListener("keyup", handleKeyup);

setTimeout(() => {
  trie = getTrie(compressedTrie);
}, 5);
