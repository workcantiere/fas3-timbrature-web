const URL_SCRIPT = "INCOLLA_QUI_IL_TUO_LINK_APPS_SCRIPT";

const pinInput = document.getElementById("pin");
const cantiereSelect = document.getElementById("cantiere");
const pulsanteArea = document.getElementById("pulsanteArea");
const messaggio = document.getElementById("messaggio");
const selezioneCantiereArea = document.getElementById("selezioneCantiereArea");
const cantiereConfermato = document.getElementById("cantiereConfermato");

let cantiereSelezionato = "";

async function caricaCantieri() {
  const res = await fetch(URL_SCRIPT + "?action=getCantieri");
  const data = await res.json();

  cantiereSelect.innerHTML = '<option value="">Seleziona cantiere</option>';

  if (data.ok && Array.isArray(data.data)) {
    data.data.forEach(c => {
      const option = document.createElement("option");
      option.value = c.id;
      option.textContent = c.nome;
      cantiereSelect.appendChild(option);
    });
  } else {
    messaggio.textContent = data.messaggio || "Errore caricamento cantieri";
  }
}

async function aggiornaStato() {
  const pin = pinInput.value.trim();
  const idCantiere = cantiereSelezionato;

  pulsanteArea.innerHTML = "";
  messaggio.textContent = "";

  if (!pin || !idCantiere) return;

  const res = await fetch(
    URL_SCRIPT +
      "?action=verificaStato&pin=" +
      encodeURIComponent(pin) +
      "&idCantiere=" +
      encodeURIComponent(idCantiere)
  );

  const risultato = await res.json();

  if (risultato.ok) {
    const btn = document.createElement("button");
    btn.textContent = risultato.azione;

    btn.onclick = async () => {
      await eseguiTimbratura(risultato.azione, pin, idCantiere);
    };

    pulsanteArea.appendChild(btn);
    messaggio.textContent = risultato.messaggio;
  } else {
    messaggio.textContent = risultato.messaggio;
  }
}

async function eseguiTimbratura(azione, pin, idCantiere) {
  let actionApi = "";

  if (azione === "ENTRATA") {
    actionApi = "registraEntrata";
  } else if (azione === "USCITA") {
    actionApi = "registraUscita";
  } else {
    messaggio.textContent = "Azione non valida";
    return;
  }

  const res = await fetch(
    URL_SCRIPT +
      "?action=" +
      actionApi +
      "&pin=" +
      encodeURIComponent(pin) +
      "&idCantiere=" +
      encodeURIComponent(idCantiere)
  );

  const risultato = await res.json();

  if (risultato.ok) {
    if (azione === "USCITA") {
      window.location.href = "404.html";
      return;
    }

    messaggio.textContent = "Timbratura registrata";
    resetMaschera();
  } else {
    messaggio.textContent = risultato.messaggio || "Errore durante la timbratura";
  }
}

function resetMaschera() {
  pinInput.value = "";
  cantiereSelect.value = "";
  cantiereSelezionato = "";
  pulsanteArea.innerHTML = "";
  selezioneCantiereArea.classList.remove("hidden");
  cantiereConfermato.classList.add("hidden");
}

pinInput.addEventListener("input", aggiornaStato);

cantiereSelect.addEventListener("change", () => {
  if (!cantiereSelect.value) {
    cantiereSelezionato = "";
    selezioneCantiereArea.classList.remove("hidden");
    cantiereConfermato.classList.add("hidden");
    aggiornaStato();
    return;
  }

  cantiereSelezionato = cantiereSelect.value;
  selezioneCantiereArea.classList.add("hidden");
  cantiereConfermato.classList.remove("hidden");
  aggiornaStato();
});

caricaCantieri();
