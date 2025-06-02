const $sendButton = document.getElementById("btn-check");
const $dialog = document.getElementById("dialog");
const $dialogContent = document.getElementById("dialog-content");
const $btnText = document.getElementById("btn-text");
const $btnSpinner = document.getElementById("btn-spinner");
const $input = document.getElementById("dropzone-file");
const $dropzone = document.getElementById("dropzone");
const $file = $input.files[0];
const $uploadIcon = document.getElementById("upload-icon");
const $checkIcon = document.getElementById("check-icon");
const $fileName = document.getElementById("file-name");
const $downloadButton = document.getElementById("btn-download");
let htmlResult = "";
const fileIcon = `<svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="size-6 mr-2"
            >
              <path
                stroke="#000"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 17h6m-6-4h6M9 9h1m3-6H8.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C5 4.52 5 5.08 5 6.2v11.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C6.52 21 7.08 21 8.2 21h7.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C19 19.48 19 18.92 19 17.8V9m-6-6 6 6m-6-6v4.4c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437C13.76 9 14.04 9 14.6 9H19"
              />
            </svg>`;
const $inputUrl = document.getElementById("input-url");

const sendFile = async () => {
  const $input2 = document.getElementById("dropzone-file");
  const $file2 = $input2.files[0];

  if (!$file2) {
    alert("Selecciona un archivo JSON primero");
    return;
  }

  try {
    $btnSpinner.classList.remove("hidden");
    $btnSpinner.classList.add("inline");
    $btnText.classList.add("hidden");
    $sendButton.disabled = true;
    $sendButton.classList.add("animate-pulse");
    $input.disabled = true;
    $dropzone.classList.add("dropzone-disabled");
    $inputUrl.disabled = true;

    const response = await fetch(
      "http://lianes8server.duckdns.org:53127/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: await $file2.text(),
      }
    );

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    // Leer el HTML de la respuesta
    htmlResult = await response.text();

    // Mostrarlo en el dialog
    $dialog.showModal();
    $dialogContent.innerHTML = htmlResult;
  } catch (error) {
    console.error("Error al enviar el archivo:", error);
  } finally {
    $btnSpinner.classList.add("hidden");
    $btnSpinner.classList.remove("inline");
    $btnText.classList.remove("hidden");
    $sendButton.disabled = false;
    $sendButton.classList.remove("animate-pulse");
    $input.disabled = false;
    $dropzone.classList.remove("dropzone-disabled");
    $inputUrl.disabled = false;
  }
};

const sendUrl = async () => {
  const url = $inputUrl.value.trim();

  if (!url) {
    alert("Por favor, ingresa una URL válida.");
    return;
  }

  try {
    $btnSpinner.classList.remove("hidden");
    $btnSpinner.classList.add("inline");
    $btnText.classList.add("hidden");
    $sendButton.disabled = true;
    $sendButton.classList.add("animate-pulse");
    $inputUrl.disabled = true;

    const response = await fetch(
      "http://lianes8server.duckdns.org:53127/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    // Leer el HTML de la respuesta
    htmlResult = await response.text();

    // Mostrarlo en el dialog
    $dialog.showModal();
    $dialogContent.innerHTML = htmlResult;
  } catch (error) {
    console.error("Error al enviar la URL:", error);
  } finally {
    $btnSpinner.classList.add("hidden");
    $btnSpinner.classList.remove("inline");
    $btnText.classList.remove("hidden");
    $sendButton.disabled = false;
    $sendButton.classList.remove("animate-pulse");
    $inputUrl.disabled = false;
  }
};

const downloadResult = () => {
  const blob = new Blob([htmlResult], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resultado.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const inputFileChange = () => {
  if ($input.files.length) {
    $sendButton.disabled = false;
    $uploadIcon.classList.add("hidden");
    $checkIcon.classList.remove("hidden");
    $fileName.classList.remove("hidden");
    $fileName.classList.add("flex");
    $fileName.innerHTML = `${fileIcon} ${$input.files[0].name} | ${(
      $input.files[0].size / 1024
    ).toFixed(1)} KB`;
  } else $sendButton.disabled = true;
};

$inputUrl.addEventListener("input", () => {
  if ($inputUrl.value.trim()) {
    $input.disabled = true;
    $dropzone.classList.add("dropzone-disabled");
    $sendButton.disabled = false;
  } else {
    $input.disabled = false;
    $dropzone.classList.remove("dropzone-disabled");
    $sendButton.disabled = true;
  }
});

$sendButton.addEventListener("click", () => {
  if ($inputUrl.value.trim()) sendUrl();
  else sendFile();
});

$downloadButton.addEventListener("click", () => {
  downloadResult();
});

$input.addEventListener("change", () => {
  inputFileChange();
});

$dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  $input.files = files;
  inputFileChange();
});

$dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  $dropzone.classList.remove("bg-gray-50");
  $dropzone.classList.add("bg-gray-100");
  $dropzone.classList.add("border-gray-400");
  $dropzone.classList.remove("border-gray-300");
});

$dropzone.addEventListener("dragleave", (e) => {
  e.preventDefault();
  $dropzone.classList.remove("bg-gray-100");
  $dropzone.classList.add("bg-gray-50");
  $dropzone.classList.remove("border-gray-300");
  $dropzone.classList.add("border-gray-400");
});
