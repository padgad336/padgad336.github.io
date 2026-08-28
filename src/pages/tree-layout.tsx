import * as React from 'react';
import { Box, Button, Typography } from '@mui/joy';
import * as THREE from 'three';
import { Easing, Tween, removeAll, update as updateTween } from '@tweenjs/tween.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { accentAlpha, colors, fonts, gradients } from '../themeConfig';

type ElementInfo = {
	atomicNumber: number;
	symbol: string;
	name: string;
	mass: string;
	tableColumn: number;
	tableRow: number;
	period: number;
	category: ElementCategory;
	phase: 'Solid' | 'Liquid' | 'Gas' | 'Unknown';
	block: 's' | 'p' | 'd' | 'f';
};

type ElementCategory =
	| 'Alkali metal'
	| 'Alkaline earth metal'
	| 'Transition metal'
	| 'Post-transition metal'
	| 'Metalloid'
	| 'Reactive nonmetal'
	| 'Halogen'
	| 'Noble gas'
	| 'Lanthanide'
	| 'Actinide'
	| 'Unknown';

type ExplorerState =
	| { status: 'loading' }
	| { status: 'ready' }
	| { status: 'selected'; element: ElementInfo };

const categorySymbols: Record<Exclude<ElementCategory, 'Unknown'>, Set<string>> = {
	'Alkali metal': new Set(['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr']),
	'Alkaline earth metal': new Set(['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra']),
	'Transition metal': new Set(['Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn']),
	'Post-transition metal': new Set(['Al', 'Ga', 'In', 'Sn', 'Tl', 'Pb', 'Bi', 'Po', 'Nh', 'Fl', 'Mc', 'Lv']),
	Metalloid: new Set(['B', 'Si', 'Ge', 'As', 'Sb', 'Te']),
	'Reactive nonmetal': new Set(['H', 'C', 'N', 'O', 'P', 'S', 'Se']),
	Halogen: new Set(['F', 'Cl', 'Br', 'I', 'At', 'Ts']),
	'Noble gas': new Set(['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn', 'Og']),
	Lanthanide: new Set(['La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu']),
	Actinide: new Set(['Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr']),
};

const categoryColors: Record<ElementCategory, string> = {
	'Alkali metal': 'rgba(151, 103, 35, .88)',
	'Alkaline earth metal': 'rgba(132, 116, 38, .88)',
	'Transition metal': 'rgba(36, 112, 72, .9)',
	'Post-transition metal': 'rgba(48, 107, 91, .9)',
	Metalloid: 'rgba(38, 118, 111, .9)',
	'Reactive nonmetal': 'rgba(33, 109, 66, .9)',
	Halogen: 'rgba(49, 123, 83, .9)',
	'Noble gas': 'rgba(67, 102, 130, .9)',
	Lanthanide: 'rgba(91, 105, 52, .9)',
	Actinide: 'rgba(103, 87, 62, .9)',
	Unknown: 'rgba(73, 103, 87, .9)',
};

const getCategory = (symbol: string): ElementCategory => {
	const match = Object.entries(categorySymbols).find(([, symbols]) => symbols.has(symbol));
	return (match?.[0] as ElementCategory | undefined) ?? 'Unknown';
};

const getPhase = (symbol: string, atomicNumber: number): ElementInfo['phase'] => {
	if (new Set(['H', 'He', 'N', 'O', 'F', 'Ne', 'Cl', 'Ar', 'Kr', 'Xe', 'Rn']).has(symbol)) return 'Gas';
	if (new Set(['Br', 'Hg']).has(symbol)) return 'Liquid';
	if (atomicNumber >= 104) return 'Unknown';
	return 'Solid';
};

const getBlock = (category: ElementCategory, tableColumn: number, symbol: string): ElementInfo['block'] => {
	if (category === 'Lanthanide' || category === 'Actinide') return 'f';
	if (symbol === 'He' || tableColumn <= 2) return 's';
	if (tableColumn >= 13) return 'p';
	return 'd';
};

const periodicTableData: Array<string | number> = [
	'H', 'Hydrogen', '1.00794', 1, 1,
	'He', 'Helium', '4.002602', 18, 1,
	'Li', 'Lithium', '6.941', 1, 2,
	'Be', 'Beryllium', '9.012182', 2, 2,
	'B', 'Boron', '10.811', 13, 2,
	'C', 'Carbon', '12.0107', 14, 2,
	'N', 'Nitrogen', '14.0067', 15, 2,
	'O', 'Oxygen', '15.9994', 16, 2,
	'F', 'Fluorine', '18.9984032', 17, 2,
	'Ne', 'Neon', '20.1797', 18, 2,
	'Na', 'Sodium', '22.98976...', 1, 3,
	'Mg', 'Magnesium', '24.305', 2, 3,
	'Al', 'Aluminium', '26.9815386', 13, 3,
	'Si', 'Silicon', '28.0855', 14, 3,
	'P', 'Phosphorus', '30.973762', 15, 3,
	'S', 'Sulfur', '32.065', 16, 3,
	'Cl', 'Chlorine', '35.453', 17, 3,
	'Ar', 'Argon', '39.948', 18, 3,
	'K', 'Potassium', '39.948', 1, 4,
	'Ca', 'Calcium', '40.078', 2, 4,
	'Sc', 'Scandium', '44.955912', 3, 4,
	'Ti', 'Titanium', '47.867', 4, 4,
	'V', 'Vanadium', '50.9415', 5, 4,
	'Cr', 'Chromium', '51.9961', 6, 4,
	'Mn', 'Manganese', '54.938045', 7, 4,
	'Fe', 'Iron', '55.845', 8, 4,
	'Co', 'Cobalt', '58.933195', 9, 4,
	'Ni', 'Nickel', '58.6934', 10, 4,
	'Cu', 'Copper', '63.546', 11, 4,
	'Zn', 'Zinc', '65.38', 12, 4,
	'Ga', 'Gallium', '69.723', 13, 4,
	'Ge', 'Germanium', '72.63', 14, 4,
	'As', 'Arsenic', '74.9216', 15, 4,
	'Se', 'Selenium', '78.96', 16, 4,
	'Br', 'Bromine', '79.904', 17, 4,
	'Kr', 'Krypton', '83.798', 18, 4,
	'Rb', 'Rubidium', '85.4678', 1, 5,
	'Sr', 'Strontium', '87.62', 2, 5,
	'Y', 'Yttrium', '88.90585', 3, 5,
	'Zr', 'Zirconium', '91.224', 4, 5,
	'Nb', 'Niobium', '92.90628', 5, 5,
	'Mo', 'Molybdenum', '95.96', 6, 5,
	'Tc', 'Technetium', '(98)', 7, 5,
	'Ru', 'Ruthenium', '101.07', 8, 5,
	'Rh', 'Rhodium', '102.9055', 9, 5,
	'Pd', 'Palladium', '106.42', 10, 5,
	'Ag', 'Silver', '107.8682', 11, 5,
	'Cd', 'Cadmium', '112.411', 12, 5,
	'In', 'Indium', '114.818', 13, 5,
	'Sn', 'Tin', '118.71', 14, 5,
	'Sb', 'Antimony', '121.76', 15, 5,
	'Te', 'Tellurium', '127.6', 16, 5,
	'I', 'Iodine', '126.90447', 17, 5,
	'Xe', 'Xenon', '131.293', 18, 5,
	'Cs', 'Caesium', '132.9054', 1, 6,
	'Ba', 'Barium', '132.9054', 2, 6,
	'La', 'Lanthanum', '138.90547', 4, 9,
	'Ce', 'Cerium', '140.116', 5, 9,
	'Pr', 'Praseodymium', '140.90765', 6, 9,
	'Nd', 'Neodymium', '144.242', 7, 9,
	'Pm', 'Promethium', '(145)', 8, 9,
	'Sm', 'Samarium', '150.36', 9, 9,
	'Eu', 'Europium', '151.964', 10, 9,
	'Gd', 'Gadolinium', '157.25', 11, 9,
	'Tb', 'Terbium', '158.92535', 12, 9,
	'Dy', 'Dysprosium', '162.5', 13, 9,
	'Ho', 'Holmium', '164.93032', 14, 9,
	'Er', 'Erbium', '167.259', 15, 9,
	'Tm', 'Thulium', '168.93421', 16, 9,
	'Yb', 'Ytterbium', '173.054', 17, 9,
	'Lu', 'Lutetium', '174.9668', 18, 9,
	'Hf', 'Hafnium', '178.49', 4, 6,
	'Ta', 'Tantalum', '180.94788', 5, 6,
	'W', 'Tungsten', '183.84', 6, 6,
	'Re', 'Rhenium', '186.207', 7, 6,
	'Os', 'Osmium', '190.23', 8, 6,
	'Ir', 'Iridium', '192.217', 9, 6,
	'Pt', 'Platinum', '195.084', 10, 6,
	'Au', 'Gold', '196.966569', 11, 6,
	'Hg', 'Mercury', '200.59', 12, 6,
	'Tl', 'Thallium', '204.3833', 13, 6,
	'Pb', 'Lead', '207.2', 14, 6,
	'Bi', 'Bismuth', '208.9804', 15, 6,
	'Po', 'Polonium', '(209)', 16, 6,
	'At', 'Astatine', '(210)', 17, 6,
	'Rn', 'Radon', '(222)', 18, 6,
	'Fr', 'Francium', '(223)', 1, 7,
	'Ra', 'Radium', '(226)', 2, 7,
	'Ac', 'Actinium', '(227)', 4, 10,
	'Th', 'Thorium', '232.03806', 5, 10,
	'Pa', 'Protactinium', '231.0588', 6, 10,
	'U', 'Uranium', '238.02891', 7, 10,
	'Np', 'Neptunium', '(237)', 8, 10,
	'Pu', 'Plutonium', '(244)', 9, 10,
	'Am', 'Americium', '(243)', 10, 10,
	'Cm', 'Curium', '(247)', 11, 10,
	'Bk', 'Berkelium', '(247)', 12, 10,
	'Cf', 'Californium', '(251)', 13, 10,
	'Es', 'Einstenium', '(252)', 14, 10,
	'Fm', 'Fermium', '(257)', 15, 10,
	'Md', 'Mendelevium', '(258)', 16, 10,
	'No', 'Nobelium', '(259)', 17, 10,
	'Lr', 'Lawrencium', '(262)', 18, 10,
	'Rf', 'Rutherfordium', '(267)', 4, 7,
	'Db', 'Dubnium', '(268)', 5, 7,
	'Sg', 'Seaborgium', '(271)', 6, 7,
	'Bh', 'Bohrium', '(272)', 7, 7,
	'Hs', 'Hassium', '(270)', 8, 7,
	'Mt', 'Meitnerium', '(276)', 9, 7,
	'Ds', 'Darmstadium', '(281)', 10, 7,
	'Rg', 'Roentgenium', '(280)', 11, 7,
	'Cn', 'Copernicium', '(285)', 12, 7,
	'Nh', 'Nihonium', '(286)', 13, 7,
	'Fl', 'Flerovium', '(289)', 14, 7,
	'Mc', 'Moscovium', '(290)', 15, 7,
	'Lv', 'Livermorium', '(293)', 16, 7,
	'Ts', 'Tennessine', '(294)', 17, 7,
	'Og', 'Oganesson', '(294)', 18, 7,
];

const periodicStyles = `
	@keyframes periodicSpin {
		to { transform: rotate(360deg); }
	}

	.periodic-table-element {
		position: relative;
		width: 120px;
		height: 160px;
		box-shadow: 0 10px 28px rgba(15, 104, 64, 0.18);
		border: 1px solid rgba(22, 121, 74, 0.28);
		font-family: Helvetica, Arial, sans-serif;
		text-align: center;
		line-height: normal;
		cursor: pointer;
		user-select: none;
		backdrop-filter: blur(10px);
		transition: box-shadow 0.2s ease, border-color 0.2s ease, opacity 0.28s ease;
	}

	.periodic-table-element:hover {
		box-shadow: 0 14px 32px rgba(15, 104, 64, 0.28);
		border-color: rgba(22, 121, 74, 0.7);
		transform: translateY(-2px);
	}

	.periodic-table-element:focus-visible {
		outline: 3px solid rgba(22, 121, 74, 0.72);
		outline-offset: 4px;
	}

	.periodic-table-number {
		position: absolute;
		top: 18px;
		right: 18px;
		font-size: 12px;
		color: rgba(234, 255, 241, 0.82);
	}

	.periodic-table-symbol {
		position: absolute;
		top: 38px;
		left: 0;
		right: 0;
		font-size: 58px;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.82);
		text-shadow: 0 0 14px rgba(22, 121, 74, 0.7);
	}

	.periodic-table-details {
		position: absolute;
		bottom: 15px;
		left: 0;
		right: 0;
		font-size: 12px;
		color: rgba(226, 255, 236, 0.82);
		line-height: 1.45;
		padding: 0 10px;
	}
`;

const createElementCard = (info: ElementInfo) => {
	const element = document.createElement('div');
	element.className = 'periodic-table-element';
	element.tabIndex = 0;
	element.setAttribute('role', 'button');
	element.setAttribute('aria-label', `View details for ${info.name}`);
	element.dataset.category = info.category;
	element.style.backgroundColor = categoryColors[info.category];

	const number = document.createElement('div');
	number.className = 'periodic-table-number';
	number.textContent = String(info.atomicNumber);
	element.appendChild(number);

	const symbol = document.createElement('div');
	symbol.className = 'periodic-table-symbol';
	symbol.textContent = info.symbol;
	element.appendChild(symbol);

	const details = document.createElement('div');
	details.className = 'periodic-table-details';
	details.innerHTML = `${info.name}<br>${info.mass}`;
	element.appendChild(details);

	return element;
};

export const TreeContentLayout: React.FC = () => {
	const mountRef = React.useRef<HTMLDivElement | null>(null);
	const focusRef = React.useRef<((index: number | null) => void) | null>(null);
	const readyRef = React.useRef(false);
	const [explorerState, setExplorerState] = React.useState<ExplorerState>({ status: 'loading' });
	const selectedElement = explorerState.status === 'selected' ? explorerState.element : null;
	const isReady = explorerState.status !== 'loading';

	React.useEffect(() => {
		const mountNode = mountRef.current;

		if (!mountNode) {
			return undefined;
		}

		readyRef.current = false;
		setExplorerState({ status: 'loading' });
		let animationFrameId = 0;
		const objects: CSS3DObject[] = [];
		const tableTargets: THREE.Object3D[] = [];
		const elementInfos: ElementInfo[] = [];

		const getViewportSize = () => ({
			width: mountNode.clientWidth || window.innerWidth,
			height: mountNode.clientHeight || window.innerHeight,
		});
		const getTableCameraDistance = (width: number, height: number) => {
			const aspect = Math.max(width / height, 0.2);
			const verticalFov = THREE.MathUtils.degToRad(40);
			const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
			const distanceForWidth = 2520 / (2 * Math.tan(horizontalFov / 2));
			const distanceForHeight = 1820 / (2 * Math.tan(verticalFov / 2));
			return Math.max(distanceForWidth, distanceForHeight) * 1.08;
		};

		const initialSize = getViewportSize();
		const camera = new THREE.PerspectiveCamera(40, initialSize.width / initialSize.height, 1, 25000);
		camera.position.z = getTableCameraDistance(initialSize.width, initialSize.height);

		const scene = new THREE.Scene();

		for (let i = 0; i < periodicTableData.length; i += 5) {
			const symbol = String(periodicTableData[i]);
			const atomicNumber = (i / 5) + 1;
			const tableColumn = Number(periodicTableData[i + 3]);
			const tableRow = Number(periodicTableData[i + 4]);
			const category = getCategory(symbol);
			const info: ElementInfo = {
				atomicNumber,
				symbol,
				name: String(periodicTableData[i + 1]),
				mass: String(periodicTableData[i + 2]),
				tableColumn,
				tableRow,
				period: tableRow === 9 ? 6 : tableRow === 10 ? 7 : tableRow,
				category,
				phase: getPhase(symbol, atomicNumber),
				block: getBlock(category, tableColumn, symbol),
			};
			const element = createElementCard(info);

			const objectCss = new CSS3DObject(element);
			objectCss.position.x = Math.random() * 4000 - 2000;
			objectCss.position.y = Math.random() * 4000 - 2000;
			objectCss.position.z = Math.random() * 4000 - 2000;
			scene.add(objectCss);
			objects.push(objectCss);
			elementInfos.push(info);

			const tableObject = new THREE.Object3D();
			tableObject.position.x = (Number(periodicTableData[i + 3]) * 140) - 1330;
			tableObject.position.y = -(Number(periodicTableData[i + 4]) * 180) + 990;
			tableTargets.push(tableObject);
		}

		const renderer = new CSS3DRenderer();
		renderer.setSize(initialSize.width, initialSize.height);
		renderer.domElement.style.position = 'absolute';
		renderer.domElement.style.inset = '0';
		mountNode.appendChild(renderer.domElement);

		const render = () => {
			renderer.render(scene, camera);
		};

		const controls = new TrackballControls(camera, renderer.domElement);
		controls.minDistance = 700;
		controls.maxDistance = 18000;
		controls.rotateSpeed = 0.6;
		controls.addEventListener('change', render);
		let activeElementIndex: number | null = null;

		const resetCameraToFit = () => {
			const { width, height } = getViewportSize();
			camera.aspect = width / height;
			camera.position.set(0, 0, getTableCameraDistance(width, height));
			camera.up.set(0, 1, 0);
			camera.lookAt(0, 0, 0);
			camera.updateProjectionMatrix();
			controls.target.set(0, 0, 0);
			controls.update();
		};

		const focusElement = (selectedIndex: number | null, duration = 700, markReady = false) => {
			removeAll();
			activeElementIndex = selectedIndex;
			controls.enabled = selectedIndex === null;
			resetCameraToFit();
			const viewport = getViewportSize();
			const isPhone = viewport.width < 600;
			const focusDistance = isPhone ? 850 : 950;
			const focusPosition = {
				x: isPhone ? 0 : -220,
				y: isPhone ? 145 : 30,
				z: camera.position.z - focusDistance,
			};

			for (let i = 0; i < objects.length; i += 1) {
				const object = objects[i];
				const tableTarget = tableTargets[i];
				const isSelected = selectedIndex === i;
				const targetPosition = isSelected
					? focusPosition
					: { x: tableTarget.position.x, y: tableTarget.position.y, z: tableTarget.position.z };
				const tweenDuration = isSelected ? duration : Math.min(1000, duration + Math.random() * 250);
				object.element.style.opacity = selectedIndex === null || isSelected ? '1' : '.24';

				new Tween(object.position, true)
					.to(targetPosition, tweenDuration)
					.easing(Easing.Exponential.InOut)
					.start();

				new Tween(object.rotation, true)
					.to({ x: tableTarget.rotation.x, y: tableTarget.rotation.y, z: tableTarget.rotation.z }, tweenDuration)
					.easing(Easing.Exponential.InOut)
					.start();

				new Tween(object.scale, true)
					.to({ x: isSelected ? (isPhone ? 1.35 : 1.5) : 1, y: isSelected ? (isPhone ? 1.35 : 1.5) : 1, z: isSelected ? (isPhone ? 1.35 : 1.5) : 1 }, tweenDuration)
					.easing(Easing.Exponential.InOut)
					.start();
			}

			new Tween({ progress: 0 }, true)
				.to({ progress: 1 }, Math.max(duration, 1000))
				.onUpdate(render)
				.onComplete(() => {
					if (markReady) {
						readyRef.current = true;
						setExplorerState({ status: 'ready' });
					}
				})
				.start();
		};

		objects.forEach((object, index) => {
			const select = () => {
				if (!readyRef.current) return;
				setExplorerState({ status: 'selected', element: elementInfos[index] });
				focusElement(index);
			};
			object.element.addEventListener('pointerdown', (event) => {
				// TrackballControls captures pointer events at the renderer level.
				// Stop propagation here so selecting a card remains reliable on desktop.
				event.stopPropagation();
				select();
			});
			object.element.addEventListener('keydown', (event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					select();
				}
			});
		});

		const handleResize = () => {
			const { width, height } = getViewportSize();

			renderer.setSize(width, height);
			if (activeElementIndex === null) resetCameraToFit();
			else focusElement(activeElementIndex, 0);
		};

		const animate = (time?: number) => {
			animationFrameId = window.requestAnimationFrame(animate);
			updateTween(time);
			controls.update();
		};

		focusRef.current = (index: number | null) => focusElement(index);
		focusElement(null, 1000, true);
		animate();
		window.addEventListener('resize', handleResize);

		return () => {
			focusRef.current = null;
			readyRef.current = false;
			window.removeEventListener('resize', handleResize);
			window.cancelAnimationFrame(animationFrameId);
			controls.removeEventListener('change', render);
			controls.dispose();
			removeAll();

			if (mountNode.contains(renderer.domElement)) {
				mountNode.removeChild(renderer.domElement);
			}

			scene.clear();
		};
	}, []);

	const clearSelection = () => {
		setExplorerState({ status: 'ready' });
		focusRef.current?.(null);
	};

	return (
		<Box
			data-state={explorerState.status}
			sx={{
				position: 'relative',
				height: 'calc(100dvh - 56px)',
				minHeight: 560,
				overflow: 'hidden',
				background: `radial-gradient(circle at top, ${accentAlpha(0.12)}, transparent 40%), ${gradients.body}`,
			}}
		>
			<style>{periodicStyles}</style>

			<Box
				sx={{
					position: 'absolute',
					inset: 0,
					background:
						'radial-gradient(circle at 20% 20%, rgba(22,121,74,0.10), transparent 26%), radial-gradient(circle at 80% 24%, rgba(86,153,111,0.12), transparent 28%), radial-gradient(circle at 50% 90%, rgba(143,194,158,0.12), transparent 34%)',
					pointerEvents: 'none',
					zIndex: 0,
				}}
			/>

			<Box ref={mountRef} sx={{ position: 'absolute', inset: 0, zIndex: 1 }} />
			{!isReady && (
				<Box
					role='status'
					aria-live='polite'
					sx={{
						position: 'absolute',
						inset: 0,
						zIndex: 3,
						display: 'grid',
						placeItems: 'center',
						background: 'rgba(248, 252, 249, 0.78)',
						backdropFilter: 'blur(5px)',
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2, py: 1.35, borderRadius: '12px', border: `1px solid ${accentAlpha(0.2)}`, background: 'rgba(255,255,255,.92)', boxShadow: '0 16px 32px -24px rgba(15,104,64,.65)' }}>
						<Box sx={{ width: 17, height: 17, borderRadius: '50%', border: `2px solid ${accentAlpha(0.2)}`, borderTopColor: colors.accent, animation: 'periodicSpin .75s linear infinite' }} />
						<Typography sx={{ fontFamily: fonts.mono, color: colors.textBody, fontSize: 12 }}>Preparing periodic table…</Typography>
					</Box>
				</Box>
			)}

			<Box
				sx={{
					position: 'relative',
					zIndex: 2,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					height: '100%',
					pointerEvents: 'none',
					p: { xs: 2, md: 3 },
				}}
			>
				{isReady && !selectedElement && (
					<Typography sx={{ alignSelf: 'flex-start', px: 1, py: .5, borderRadius: '6px', background: 'rgba(255,255,255,.7)', color: colors.textMuted, fontFamily: fonts.mono, fontSize: 10.5, pointerEvents: 'none' }}>
						Click an element to inspect · drag to rotate · scroll to zoom
					</Typography>
				)}

				{selectedElement && (
					<Box
						sx={{
							position: { md: 'absolute' },
							top: { md: 92 },
							right: { md: 24 },
							alignSelf: { xs: 'flex-end', md: 'auto' },
							width: { xs: '100%', sm: 310 },
							mt: 'auto',
							p: 2.25,
							borderRadius: '14px',
							border: `1px solid ${accentAlpha(0.25)}`,
							background: 'rgba(255, 255, 255, 0.94)',
							boxShadow: '0 20px 42px -28px rgba(15, 104, 64, 0.65)',
							backdropFilter: 'blur(16px)',
							pointerEvents: 'auto',
						}}
					>
						<Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
							<Box>
								<Typography sx={{ fontFamily: fonts.mono, color: colors.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em' }}>
									ELEMENT #{selectedElement.atomicNumber}
								</Typography>
							<Typography sx={{ color: colors.text, fontSize: 24, fontWeight: 700, mt: .4 }}>
								{selectedElement.name}
							</Typography>
							<Box sx={{ display: 'inline-flex', alignItems: 'center', gap: .65, mt: .7 }}>
								<Box sx={{ width: 7, height: 7, borderRadius: '50%', background: categoryColors[selectedElement.category] }} />
								<Typography sx={{ color: colors.textMuted, fontFamily: fonts.mono, fontSize: 10.5 }}>{selectedElement.category}</Typography>
							</Box>
							</Box>
							<Button variant='plain' size='sm' aria-label='Close element details' onClick={clearSelection} sx={{ minWidth: 32, p: .5, color: colors.textMuted }}>
								<CloseRoundedIcon sx={{ fontSize: 18 }} />
							</Button>
						</Box>
						<Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.25, mt: 1.5, pb: 1.75, borderBottom: `1px solid ${colors.borderLight}` }}>
							<Typography sx={{ color: colors.accentDeep, fontFamily: fonts.mono, fontSize: 58, fontWeight: 700, lineHeight: 1 }}>{selectedElement.symbol}</Typography>
							<Typography sx={{ color: colors.textMuted, fontFamily: fonts.mono, fontSize: 12 }}>Atomic mass\n{selectedElement.mass}</Typography>
						</Box>
						<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25, mt: 1.75 }}>
							{[
								['Atomic number', selectedElement.atomicNumber],
								['Atomic mass', selectedElement.mass],
								['Period', selectedElement.period],
								['Electron block', `${selectedElement.block}-block`],
								['Phase at 20°C', selectedElement.phase],
								['Table position', `${selectedElement.tableColumn} / ${selectedElement.tableRow}`],
							].map(([label, value]) => (
								<Box key={String(label)} sx={{ p: 1.1, borderRadius: '8px', background: accentAlpha(0.06) }}>
									<Typography sx={{ color: colors.textDim, fontFamily: fonts.mono, fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</Typography>
									<Typography sx={{ color: colors.textBody, fontFamily: fonts.mono, fontSize: 13, fontWeight: 700, mt: .25 }}>{value}</Typography>
								</Box>
							))}
						</Box>
					</Box>
				)}
			</Box>
		</Box>
	);
};
