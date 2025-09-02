// Render jadi teks dengan logo
function loadUniversityText() {
  const container = document.getElementById("university-list");
  container.innerHTML = "";

  universityLogos.forEach((university, index) => {
    // Logo
    const img = document.createElement("img");
    img.src = university.logo;
    img.alt = university.name;
    img.className = "inline-block h-6 w-auto align-middle mr-2";

    // Nama
    const name = document.createElement("span");
    name.textContent = university.name;

    // Wrapper
    container.appendChild(img);
    container.appendChild(name);

    // Tambah koma kecuali di item terakhir
    if (index < universityLogos.length - 1) {
      container.appendChild(document.createTextNode(", "));
    }
  });
}

document.addEventListener("DOMContentLoaded", loadUniversityText);
