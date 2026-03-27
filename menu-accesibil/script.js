/**
 * Logica meniului responsiv și accesibil
 * Descriere: Gestionează stările ARIA, interacțiunile pe mobil și resetarea la resize.
 * Funcționalitate: Actualizează automat aria-expanded pentru meniul principal și submeniuri.
 */

document.addEventListener('DOMContentLoaded', () => {
	
	const menuTrigger = document.getElementById('kzn_menu_trigger');
	const closeMenu = document.getElementById('kzn_close_menu');
	const navPanel = document.getElementById('kzn_main_nav');
	const overlay = document.getElementById('kzn_overlay');
	const submenuParents = document.querySelectorAll('.has-submenu > .kzn-menu-link');

	// Verificăm dacă suntem în modul mobil (hamburgerul este vizibil)
	const kzn_isMobileMode = () => {
		if (!menuTrigger) return false;
		return window.getComputedStyle(menuTrigger).display !== 'none';
	};

	// Actualizează atributul aria-expanded pe un element specific
	const kzn_updateAria = (element, isOpen) => {
		if (element) {
			element.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
		}
	};

	// Funcție pentru toggle meniu mobil și overlay
	const kzn_toggleMobileMenu = (state) => {
		if (!navPanel || !overlay) return;

		if (state === 'open') {
			navPanel.classList.add('is-active');
			overlay.classList.add('is-active');
			document.body.style.overflow = 'hidden';
			// Notificăm cititoarele de ecran că meniul s-a deschis
			kzn_updateAria(menuTrigger, true);
		} else {
			navPanel.classList.remove('is-active');
			overlay.classList.remove('is-active');
			document.body.style.overflow = '';
			// Notificăm cititoarele de ecran că meniul s-a închis
			kzn_updateAria(menuTrigger, false);
		}
	};

	// Resetarea stărilor de mobil la trecerea pe desktop
	const kzn_resetMenuOnResize = () => {
		if (!kzn_isMobileMode()) {
			kzn_toggleMobileMenu('close');
			
			// Resetăm și submeniurile la starea inițială
			submenuParents.forEach(parentLink => {
				parentLink.parentElement.classList.remove('is-open');
				kzn_updateAria(parentLink, false);
			});
		}
	};

	// Event Listeners pentru butoane principale
	if (menuTrigger) {
		menuTrigger.addEventListener('click', () => kzn_toggleMobileMenu('open'));
	}

	if (closeMenu) {
		closeMenu.addEventListener('click', () => kzn_toggleMobileMenu('close'));
	}

	if (overlay) {
		overlay.addEventListener('click', () => kzn_toggleMobileMenu('close'));
	}

	// Gestionare submeniuri pe mobil
	submenuParents.forEach(parentLink => {
		parentLink.addEventListener('click', (e) => {
			if (kzn_isMobileMode()) {
				// Prevenim link-ul să navigheze pentru a permite deschiderea submeniului
				e.preventDefault();
				
				const parentLi = parentLink.parentElement;
				const isNowOpen = !parentLi.classList.contains('is-open');

				// Toggle clasa vizuală
				parentLi.classList.toggle('is-open');
				
				// Sincronizăm starea ARIA pentru accesibilitate
				kzn_updateAria(parentLink, isNowOpen);
			}
		});
	});

	// Eveniment pentru redimensionarea ferestrei (pentru tablete)
	window.addEventListener('resize', kzn_resetMenuOnResize);

	// Închidere la tasta Escape (standard de accesibilitate)
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') kzn_toggleMobileMenu('close');
	});
});


/**
 * Logica pentru Smart Header (Hide/Show pe scroll)
 */
/**
 * Logica extinsă pentru Smart Header cu efect de Blur
 */
let kzn_lastScroll = 0;
const kzn_header = document.querySelector('.kzn-header');

window.addEventListener('scroll', () => {
	const kzn_currentScroll = window.pageYOffset;

	// Gestionare efect de Blur/Transparentă (la orice scroll > 0)
	if (kzn_currentScroll > 10) {
		kzn_header.classList.add('kzn-header-scrolled');
	} else {
		kzn_header.classList.remove('kzn-header-scrolled');
	}

	// Nu ascundem header-ul dacă meniul mobil este deschis
	if (document.body.style.overflow === 'hidden') return;

	// Resetare la topul paginii
	if (kzn_currentScroll <= 0) {
		kzn_header.classList.remove('kzn-header-hidden');
		return;
	}

	// Ascundere la scroll în jos / Afișare la scroll în sus
	if (kzn_currentScroll > kzn_lastScroll && kzn_currentScroll > 100) {
		// Adăugăm un prag de 100px pentru a nu fi prea agresiv la început
		kzn_header.classList.add('kzn-header-hidden');
	} else if (kzn_currentScroll < kzn_lastScroll) {
		kzn_header.classList.remove('kzn-header-hidden');
	}

	kzn_lastScroll = kzn_currentScroll;
});