const maxForsøg = 10; // Maksimalt antal forsøg
let antalForsøg = 0; // Tæller for antallet af forsøg
let langsomsteTid = 0; // Variabel til at gemme den langsomste tid
let hurtigsteTid = Infinity; // Variabel til at gemme den hurtigste tid
let startTid = 0; // Variabel til at gemme tidspunket for knapens placering
let tider = []; // Array til at gemme tiderne for de seneste forsøg

function opdaterRundeTæller() {
	const rundeTæller = document.getElementById('runde_tæller');
	rundeTæller.textContent = maxForsøg - antalForsøg; // Opdater tælleren
}

function opdaterLangsomsteTid(tid) {
	const langsomsteTidElement = document.getElementById('langsomste_tid');
	if (tid > langsomsteTid) {
		langsomsteTid = tid; // Opdater langsomste tid
		langsomsteTidElement.textContent = langsomsteTid; // Opdater visningen
	}
}

function opdaterHurtigsteTid(tid) {
	const hurtigsteTidElement = document.getElementById('hurtigste_tid');
	if (tid < hurtigsteTid) {
		hurtigsteTid = tid; // Opdater hurtigste tid
		hurtigsteTidElement.textContent = hurtigsteTid; // Opdater visningen
	}
}

function opdaterGennemsnitstid() {
	if (antalForsøg === maxForsøg) {
		const sum = tider.reduce((a, b) => a + b, 0);
		const gennemsnit = sum / tider.length;

		// Opdater modalvinduet
		const gennemsnitBesked = document.getElementById('gennemsnit_besked');
		gennemsnitBesked.textContent = `Din gennemsnitstid blev: ${gennemsnit.toFixed(2)} ms`;

		const modal = document.getElementById('gennemsnit_modal');
		modal.style.display = 'block'; // Vis modalvinduet
	}
}

// Genstart spil
document.getElementById('genstart_knap').onclick = () => {
	antalForsøg = 0;
	langsomsteTid = 0;
	hurtigsteTid = Infinity;
	tider = [];
	opdaterRundeTæller();
	document.getElementById('langsomste_tid').textContent = '0';
	document.getElementById('hurtigste_tid').textContent = '0';
	const modal = document.getElementById('gennemsnit_modal');
	modal.style.display = 'none'; // Skjul modalvinduet
	nedtælling(); // Start nedtællingen før spillet genstartes
};

function vælgTilfældigPixel(div) {
	if (antalForsøg >= maxForsøg) {
		// Vis modalvinduet, når maksimalt antal forsøg er nået
		const gennemsnitBesked = document.getElementById('gennemsnit_besked');
		const sum = tider.reduce((a, b) => a + b, 0);
		const gennemsnit = sum / tider.length;
		gennemsnitBesked.textContent = `Din gennemsnitstid blev: ${gennemsnit.toFixed(2)} ms`;

		const modal = document.getElementById('gennemsnit_modal');
		modal.style.display = 'block'; // Vis modalvinduet

		return; // Stop, hvis maksimalt antal forsøg er nået
	}

	const rektangel = div.getBoundingClientRect();
	const targetBtn = document.querySelector('.target_btn');

	// Hent knapstørrelsen
	const btnWidth = targetBtn.offsetWidth;
	const btnHeight = targetBtn.offsetHeight;

	// Beregn tilfældige koordinater inden for grænserne af div'en
	const tilfældigX = Math.floor(Math.random() * (rektangel.width - btnWidth));
	const tilfældigY = Math.floor(Math.random() * (rektangel.height - btnHeight));

	// Skjul knappen
	targetBtn.style.display = 'none'; // Gør knappen usynlig

	// Vent, indtil knappen er skjult, og flyt den derefter
	setTimeout(() => {
		targetBtn.style.left = `${tilfældigX}px`;
		targetBtn.style.top = `${tilfældigY}px`;

		// Vis knappen igen
		targetBtn.style.display = 'block'; // Gør knappen synlig igen

		// Opdater antallet af forsøg
		antalForsøg++;
		opdaterRundeTæller();

		// Start tidtagning
		startTid = Date.now(); // Gem tidpunktet for placeringen
	}, 200); // Tid før knappen vises igen
}

// Kald funktionen for at placere knappen første gang
const knapOmraade = document.getElementById('knap_omraade');
opdaterRundeTæller(); // Initialiser tælleren

// Tilføj click-eventlistener til knappen
const targetBtn = document.querySelector('.target_btn');
targetBtn.addEventListener('click', () => {
	const tidBrugt = Date.now() - startTid; // Beregn tid brugt på at klikke
	opdaterLangsomsteTid(tidBrugt); // Opdater langsomste tid
	opdaterHurtigsteTid(tidBrugt); // Opdater hurtigste tid

	// Tilføj den brugte tid til arrayet
	tider.push(tidBrugt);
	if (tider.length > maxForsøg) {
		tider.shift(); // Fjern det ældste forsøg, hvis der er flere end 10
	}
	opdaterGennemsnitstid(); // Opdater gennemsnitstiden
	vælgTilfældigPixel(knapOmraade); // Flyt knappen
});

// Vis startmodalen ved indlæsning
window.onload = () => {
	const startModal = document.getElementById('start_modal');
	startModal.style.display = 'block'; // Vis startmodalen
};

// Start spil ved at klikke på startknappen
document.getElementById('start_knap').onclick = () => {
	const startModal = document.getElementById('start_modal');
	startModal.style.display = 'none'; // Skjul startmodalen
	nedtælling(); // Start nedtællingen
};

function nedtælling() {
	const nedtællingModal = document.getElementById('nedtælling_modal');
	nedtællingModal.style.display = 'block'; // Vis nedtællingsmodalen
	let counter = 3;

	const nedtællingTal = document.getElementById('nedtælling_tal');
	nedtællingTal.textContent = counter; // Vis starttallet

	const interval = setInterval(() => {
		counter--;
		if (counter >= 0) {
			if (counter === 0) {
				nedtællingTal.textContent = 'start!';
			} else {
				nedtællingTal.textContent = counter; // Opdater nedtællingstallet
			}
		}

		if (counter < 0) {
			clearInterval(interval); // Stop nedtællingen
			nedtællingModal.style.display = 'none'; // Skjul nedtællingsmodalen
			targetBtn.disabled = false; // Lås click eventet op
			setTimeout(() => {
				vælgTilfældigPixel(knapOmraade); // Start spillet
			}, 200); // Vent 200 ms før knappen aktiveres
		}
	}, 1000); // Opdater hver sekund
}
