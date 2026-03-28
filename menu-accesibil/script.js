/**
 * Logica meniului responsiv DesignKZN
 * Prefix: kzn_
 */

document.addEventListener('DOMContentLoaded', () => {
	
	const kzn_header = document.querySelector('.kzn-header');
	const menuTrigger = document.getElementById('kzn_menu_trigger');
	const closeMenu = document.getElementById('kzn_close_menu');
	const navPanel = document.getElementById('kzn_main_nav');
	const overlay = document.getElementById('kzn_overlay');
	const submenuParents = document.querySelectorAll('.has-submenu > .kzn-menu-link');

	let kzn_lastScroll = 0;

	const kzn_isMobileMode = () => {
		if (!menuTrigger) return false;
		return window.getComputedStyle(menuTrigger).display !== 'none';
	};

	const kzn_updateAria = (el, state) => el && el.setAttribute('aria-expanded', state);

	const kzn_toggleMobileMenu = (state) => {
		if (!navPanel || !overlay) return;
		const isOpen = state === 'open';

		navPanel.classList.toggle('is-active', isOpen);
		overlay.classList.toggle('is-active', isOpen);
		document.body.classList.toggle('kzn-menu-open', isOpen);
		document.body.style.overflow = isOpen ? 'hidden' : '';
		kzn_updateAria(menuTrigger, isOpen);

		if (isOpen && kzn_header) kzn_header.classList.remove('kzn-header-hidden');
	};

	// Smart Header + Blur
	window.addEventListener('scroll', () => {
		const curr = window.pageYOffset;
		if (!kzn_header) return;

		kzn_header.classList.toggle('kzn-header-scrolled', curr > 10);

		if (document.body.classList.contains('kzn-menu-open')) return;

		if (curr <= 0) {
			kzn_header.classList.remove('kzn-header-hidden');
		} else if (curr > kzn_lastScroll && curr > 100) {
			kzn_header.classList.add('kzn-header-hidden');
		} else if (curr < kzn_lastScroll) {
			kzn_header.classList.remove('kzn-header-hidden');
		}
		kzn_lastScroll = curr;
	});

	// Events
	menuTrigger?.addEventListener('click', () => kzn_toggleMobileMenu('open'));
	closeMenu?.addEventListener('click', () => kzn_toggleMobileMenu('close'));
	overlay?.addEventListener('click', () => kzn_toggleMobileMenu('close'));

	submenuParents.forEach(link => {
		link.addEventListener('click', (e) => {
			if (kzn_isMobileMode()) {
				e.preventDefault();
				const parentLi = link.parentElement;
				parentLi.classList.toggle('is-open');
				kzn_updateAria(link, parentLi.classList.contains('is-open'));
			}
		});
	});

	window.addEventListener('resize', () => {
		if (!kzn_isMobileMode()) {
			kzn_toggleMobileMenu('close');
			submenuParents.forEach(link => link.parentElement.classList.remove('is-open'));
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') kzn_toggleMobileMenu('close');
	});
});