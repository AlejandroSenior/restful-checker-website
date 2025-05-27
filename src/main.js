const $sendButton = document.getElementById("btn-check");
const $dialog = document.getElementById("dialog");
const $dialogContent = document.getElementById("dialog-content");
const $btnText = document.getElementById("btn-text");
const $btnSpinner = document.getElementById("btn-spinner");
const $input = document.getElementById("dropzone-file");
const $file = $input.files[0];
const $uploadIcon = document.getElementById("upload-icon");
const $checkIcon = document.getElementById("check-icon");
const $fileName = document.getElementById("file-name");

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
    const html = await response.text();

    // Mostrarlo en un <div> (también podrías abrirlo en una nueva pestaña)
    $dialog.showModal();
    $dialogContent.innerHTML = html;

    // O si prefieres descargar el resultado como archivo
    /*
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resultado.html';
    a.click();
    */
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

$sendButton.addEventListener("click", () => {
  enviarArchivo();
});

$input.addEventListener("change", () => {
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
});
