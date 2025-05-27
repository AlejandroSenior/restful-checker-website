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

async function enviarArchivo() {
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

    const response = await fetch(
      "https://restful-checker-api.onrender.com/analyze",
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
  }
}

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
    $fileName.innerHTML += `${$input.files[0].name} | ${(
      $input.files[0].size / 1024
    ).toFixed(1)} KB`;
  } else $sendButton.disabled = true;
};

$sendButton.addEventListener("click", () => {
  enviarArchivo();
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
