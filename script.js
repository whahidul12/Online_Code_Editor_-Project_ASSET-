const add = document.querySelector("#add-tab");
const container = document.querySelector("#tab-Container");
const codingPanel = document.querySelector(".coding-panel");
const outputPanel = document.querySelector(".output-panel");
const textareas = document.querySelectorAll(".editing-panel");


const ALL_FILE_NAMES = new Set(["index.html", "style.css", "script.js"]);


document.querySelectorAll('textarea').forEach(function (textarea) {
    if (textarea.id === "index.html") {
        textarea.style.display = 'block';
    } else {
        textarea.style.display = 'none';
    }
});

add.addEventListener("click", () => {
    const fileName = prompt("Please enter a file name:");

    const fileExtension = fileName.split(".").pop();

    if (fileExtension === "html" || fileExtension === "css" || fileExtension === "js") {
        const newTabLI = document.createElement("li");
        const newEditingPanelLI = document.createElement("li");

        if (fileExtension === "html") {
            newTabLI.innerHTML = `<button id="${fileName}" class="tabButton" onclick="getValue(this)"><i style="color: red" class="fa-brands fa-html5"></i> ${fileName}
        <button class="tabDeleteButton" onclick="deleteTab(this)"><i class="fa-solid fa-xmark"></i></button>
        </button>`;
        } else if (fileExtension === "css") {
            newTabLI.innerHTML = `<button id="${fileName}" class="tabButton" onclick="getValue(this)"><i style="color: blue" class="fa-brands fa-css3-alt"></i> ${fileName}
        <button class="tabDeleteButton" onclick="deleteTab(this)"><i class="fa-solid fa-xmark"></i></button>
        </button>`;
        } else if (fileExtension === "js") {
            newTabLI.innerHTML = `<button id="${fileName}" class="tabButton" onclick="getValue(this)"><i style="color: yellow" class="fa-brands fa-js"></i> ${fileName}
        <button class="tabDeleteButton" onclick="deleteTab(this)"><i class="fa-solid fa-xmark"></i></button>
        </button>`;
        }

        newEditingPanelLI.innerHTML = `<textarea
                        class="editing-panel"
                        id="${fileName}"
                        name="${fileName}"
                        onkeyup="execute()"
                        placeholder="Write your ${fileName} file here..."
                        spellcheck="false"></textarea>`;

        if (fileName == null || fileName === "" || ALL_FILE_NAMES.has(fileName)) {
            alert("You didn't enter a file name or it already exists.");
        } else {
            ALL_FILE_NAMES.add(fileName);
            container.appendChild(newTabLI);
            codingPanel.appendChild(newEditingPanelLI);
            document.querySelectorAll('textarea').forEach(function (textarea) {
                if (textarea.id === fileName) {
                    textarea.style.display = 'block';
                } else {
                    textarea.style.display = 'none';
                }
            });
        }
    } else {
        alert("We accept only HTMl, CSS or JavaScript files");
    }


});

const getValue = (val) => {
    const uniqueId = val.id;
    console.log(uniqueId);
    console.log(document.querySelectorAll("textarea"));

    document.querySelectorAll('textarea').forEach(function (textarea) {
        if (textarea.id === uniqueId) {
            textarea.style.display = 'block';
        } else {
            textarea.style.display = 'none';
        }
    });
};
const execute = () => {
    setTimeout(() => {
        const output = document.querySelector("#output");

        let htmlContent = "";
        let cssContent = "";
        let jsContent = "";

        textareas.forEach(textarea => {
            const fileName = textarea.getAttribute("name"); // Use name instead of id
            const fileExtension = fileName.split(".").pop(); // Get file extension

            if (fileExtension === "html") {
                htmlContent += textarea.value + "\n"; // Append HTML content
            } else if (fileExtension === "css") {
                cssContent += textarea.value + "\n"; // Append CSS content
            } else if (fileExtension === "js") {
                jsContent += textarea.value + "\n"; // Append JavaScript content
            }
        });

        // Construct the full document dynamically
        const documentContent = `
            <html>
            <head>
                <style>${cssContent}</style>
            </head>
            <body>
                ${htmlContent}
                <script>${jsContent}<\/script>
            </body>
            </html>
        `;

        // Render content in iframe
        output.contentDocument.open();
        output.contentDocument.write(documentContent);
        output.contentDocument.close();
    }, 100);
};

//! ////////////////////////////////////////////////////////////////////////////////////////
//! ////////////////////////////////////////////////////////////////////////////////////////

function deleteTab(val) {
    const tabLI = val.parentNode;
    const tabDiv = tabLI.parentNode;
    const sibling = val.previousElementSibling;
    const siblingID = sibling.id;
    tabDiv.removeChild(tabLI);
    ALL_FILE_NAMES.delete(siblingID);


    let textarea = document.querySelector(`textarea[name='${siblingID}']`);
    const codingPanelChild = textarea.parentNode;
    console.log(textarea.parentNode);
    codingPanel.removeChild(codingPanelChild)
}

//! ////////////////////////////////////////////////////////////////////////////////////////
//! ////////////////////////////////////////////////////////////////////////////////////////
//! ////////////////////////////////////////////////////////////////////////////////////////

// Include JSZip via CDN
const saveAsZip = async () => {
    const zip = new JSZip(); // Create a new ZIP archive

    // Loop through all textareas
    textareas.forEach((textarea) => {
        const fileName = textarea.getAttribute("id"); // Use the textarea ID as the filename
        const fileContent = textarea.value; // Get the textarea content

        zip.file(fileName, fileContent); // Add file to the ZIP
    });

    // Generate ZIP file and trigger download
    zip.generateAsync({ type: "blob" }).then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "my_files.zip"; // ZIP file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
};

// Attach the function to the Save button
document.querySelector("#saveButton").addEventListener("click", saveAsZip);

