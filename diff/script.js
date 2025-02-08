const existingCodeElement = document.getElementById("existingCode");
const updatedCodeElement = document.getElementById("updatedCode");
const diffContainer = document.getElementById("diffContainer");
const lineNumbersNew = document.getElementById("lineNumbersNew");
const lineNumbersOriginal = document.getElementById("lineNumbersOriginal");

// Function to update line numbers dynamically
function updateLineNumbers(text, lineNumberContainer) {
	const lines = text.split("\n");
	let lineNumbers = "";
	for (let i = 1; i <= lines.length; i++) {
		lineNumbers += i + "<br>";
	}
	lineNumberContainer.innerHTML = lineNumbers;
}

// Function to update the diff and line numbers
function updateDiff() {
	const existingCode = existingCodeElement.innerText;
	const updatedCode = updatedCodeElement.innerText;

	// Update line numbers for both panels
	updateLineNumbers(updatedCode, lineNumbersNew);
	updateLineNumbers(existingCode, lineNumbersOriginal);

	// Use jsdiff to create an accurate diff
	const diffString = Diff.createPatch("function.js", existingCode, updatedCode);

	// Generate HTML diff and display it using Diff2Html
	const diffHtml = Diff2Html.html(diffString, {
		drawFileList: false,
		matching: "lines"
	});
	diffContainer.innerHTML = diffHtml;
}

existingCodeElement.addEventListener("input", updateDiff);
updatedCodeElement.addEventListener("input", updateDiff);
updateDiff();

// Function to load text/code from a URL
function loadFromUrl(panelId) {
	const url = prompt("Enter the URL to load from:");
	if (url) {
		fetch(url)
			.then((response) => response.text())
			.then((code) => {
				document.getElementById(panelId).innerText = code;
				updateDiff();
			})
			.catch((error) => alert("Error loading from URL: " + error));
	}
}

// Function to copy content from a specific panel to the clipboard
function copyCode(panelId) {
	const code = document.getElementById(panelId).innerText;
	navigator.clipboard
		.writeText(code)
		.then(() => alert("Copied to clipboard"))
		.catch((error) => alert("Failed to copy: " + error));
}

function toggleModal() {
    const modal = document.getElementById('infoModal');
    modal.classList.toggle('hidden');
}