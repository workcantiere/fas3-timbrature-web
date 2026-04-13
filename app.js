const URL_SCRIPT = "INCOLLA_QUI_IL_TUO_LINK_APPS_SCRIPT";

const pinInput = document.getElementById("pin");
const cantiereSelect = document.getElementById("cantiere");
const pulsanteArea = document.getElementById("pulsanteArea");
const messaggio = document.getElementById("messaggio");

async function caricaCantieri() {
  const res = await fetch(URL_SCRIPT + "?action=getCantieri");
  const data = await res.json();

  data.data.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.nome;
    cantiereSelect.appendChild(option);
  });
}

async function aggiornaStato() {
  const pin = pinInput.value.trim();
  const idCantiere = cantiereSelect.value;

  pulsanteArea.innerHTML = "";
  messaggio.textContent = "";

  if (!pin || !idCantiere) return;

  const res = await fetch(
    URL_SCRIPT + "?action=verificaStato&pin=" + pin + "&idCantiere=" + idCantiere
  );

  const risultato = await res.json();

  if (risultato.ok) {
    const btn = document.createElement("button");
    btn.textContent = risultato.azione;
    btn.onclick = () => alert("Prossimo step: registrazione");
    pulsanteArea.appendChild(btn);
    messaggio.textContent = risultato.messaggio;
  } else {
    messaggio.textContent = risultato.messaggio;
  }
}

pinInput.addEventListener("input", aggiornaStato);
cantiereSelect.addEventListener("change", aggiornaStato);

caricaCantieri();
