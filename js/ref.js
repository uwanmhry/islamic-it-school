 const urlParams = new URLSearchParams(window.location.search);
  const currentRef = urlParams.get("ref");

  // Jika ada ref di URL, simpan ke localStorage
  if (currentRef) {
    localStorage.setItem("referral", currentRef);
  }

  // Ambil ref dari localStorage (fallback jika tidak ada di URL)
  const storedRef = localStorage.getItem("referral");

  // Jika belum ada ref di URL tapi ada di localStorage, tambahkan ke URL saat ini
  if (!currentRef && storedRef) {
    urlParams.set("ref", storedRef);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }

  // Update semua link <a href> internal agar menyertakan ref
  if (storedRef) {
    document.querySelectorAll("a[href]").forEach(link => {
      const href = link.getAttribute("href");
      // Lewati link eksternal, anchor, tel, dan mailto
      if (
        href &&
        !href.startsWith("http") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("tel:") &&
        !href.startsWith("#") &&
        !href.includes("ref=")
      ) {
        const url = new URL(href, window.location.origin);
        url.searchParams.set("ref", storedRef);
        link.setAttribute("href", url.pathname + url.search);
      }
    });
  }