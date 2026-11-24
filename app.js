// Social links: add your own public profile URLs here when ready.
const SOCIAL_LINKS = { instagram: "", x: "", youtube: "", tiktok: "" };
document.querySelectorAll("[data-social]").forEach((link) => {
  const url = SOCIAL_LINKS[link.dataset.social];
  if (url) { link.href = url; link.target = "_blank"; link.rel = "noopener noreferrer"; }
  else link.hidden = true;
});
const menu = document.querySelector(".menu");
const nav = document.querySelector(".topbar nav");
if (menu && nav) menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
});
const form = document.querySelector("#contact-form");
if (form) form.addEventListener("submit", (event) => {
  event.preventDefault();
  const recipient = ""; // Set a contact email address here before enabling mailto.
  const error = document.querySelector("#form-error");
  if (!recipient) { error.hidden = false; return; }
  const data = new FormData(form);
  const subject = encodeURIComponent(data.get("subject"));
  const body = encodeURIComponent("お名前: " + data.get("name") + "\n返信先: " + data.get("email") + "\n\n" + data.get("message"));
  location.href = "mailto:" + recipient + "?subject=" + subject + "&body=" + body;
});