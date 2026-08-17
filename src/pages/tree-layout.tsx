import * as React from 'react';
import { Box, Button, Typography } from '@mui/joy';
import * as THREE from 'three';
import { Easing, Tween, removeAll, update as updateTween } from '@tweenjs/tween.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { accentAlpha, colors, fonts, gradients } from '../themeConfig';

type LayoutMode = 'table' | 'sphere' | 'helix' | 'grid';

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

const layoutModes: LayoutMode[] = ['table', 'sphere', 'helix', 'grid'];

const periodicStyles = `
	.periodic-table-element {
		position: relative;
		width: 120px;
		height: 160px;
		box-shadow: 0 0 12px rgba(0, 255, 255, 0.45);
		border: 1px solid rgba(127, 255, 255, 0.2);
		font-family: Helvetica, Arial, sans-serif;
		text-align: center;
		line-height: normal;
		cursor: default;
		backdrop-filter: blur(10px);
		transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
	}

	.periodic-table-element:hover {
		box-shadow: 0 0 16px rgba(0, 255, 255, 0.7);
		border-color: rgba(127, 255, 255, 0.7);
		transform: translateY(-2px);
	}

	.periodic-table-number {
		position: absolute;
		top: 18px;
		right: 18px;
		font-size: 12px;
		color: rgba(200, 255, 255, 0.72);
	}

	.periodic-table-symbol {
		position: absolute;
		top: 38px;
		left: 0;
		right: 0;
		font-size: 58px;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.82);
		text-shadow: 0 0 14px rgba(0, 255, 255, 0.95);
	}

	.periodic-table-details {
		position: absolute;
		bottom: 15px;
		left: 0;
		right: 0;
		font-size: 12px;
		color: rgba(180, 255, 255, 0.75);
		line-height: 1.45;
		padding: 0 10px;
	}
`;

const createElementCard = (index: number, symbolText: string, name: string, mass: string) => {
	const element = document.createElement('div');
	element.className = 'periodic-table-element';
	element.style.backgroundColor = `rgba(0, 127, 127, ${Math.random() * 0.5 + 0.25})`;

	const number = document.createElement('div');
	number.className = 'periodic-table-number';
	number.textContent = String(index + 1);
	element.appendChild(number);

	const symbol = document.createElement('div');
	symbol.className = 'periodic-table-symbol';
	symbol.textContent = symbolText;
	element.appendChild(symbol);

	const details = document.createElement('div');
	details.className = 'periodic-table-details';
	details.innerHTML = `${name}<br>${mass}`;
	element.appendChild(details);

	return element;
};

export const TreeContentLayout: React.FC = () => {
	const mountRef = React.useRef<HTMLDivElement | null>(null);
	const transformRef = React.useRef<((layout: LayoutMode) => void) | null>(null);
	const [activeLayout, setActiveLayout] = React.useState<LayoutMode>('table');

	React.useEffect(() => {
		const mountNode = mountRef.current;

		if (!mountNode) {
			return undefined;
		}

		let animationFrameId = 0;
		const objects: CSS3DObject[] = [];
		const targets: Record<LayoutMode, THREE.Object3D[]> = {
			table: [],
			sphere: [],
			helix: [],
			grid: [],
		};

		const getViewportSize = () => ({
			width: mountNode.clientWidth || window.innerWidth,
			height: mountNode.clientHeight || window.innerHeight,
		});

		const initialSize = getViewportSize();
		const camera = new THREE.PerspectiveCamera(40, initialSize.width / initialSize.height, 1, 10000);
		camera.position.z = 3000;

		const scene = new THREE.Scene();
		const vector = new THREE.Vector3();

		for (let i = 0; i < periodicTableData.length; i += 5) {
			const element = createElementCard(
				i / 5,
				String(periodicTableData[i]),
				String(periodicTableData[i + 1]),
				String(periodicTableData[i + 2]),
			);

			const objectCss = new CSS3DObject(element);
			objectCss.position.x = Math.random() * 4000 - 2000;
			objectCss.position.y = Math.random() * 4000 - 2000;
			objectCss.position.z = Math.random() * 4000 - 2000;
			scene.add(objectCss);
			objects.push(objectCss);

			const tableObject = new THREE.Object3D();
			tableObject.position.x = (Number(periodicTableData[i + 3]) * 140) - 1330;
			tableObject.position.y = -(Number(periodicTableData[i + 4]) * 180) + 990;
			targets.table.push(tableObject);
		}

		for (let i = 0; i < objects.length; i += 1) {
			const phi = Math.acos(-1 + (2 * i) / objects.length);
			const theta = Math.sqrt(objects.length * Math.PI) * phi;
			const sphereObject = new THREE.Object3D();

			sphereObject.position.setFromSphericalCoords(800, phi, theta);
			vector.copy(sphereObject.position).multiplyScalar(2);
			sphereObject.lookAt(vector);
			targets.sphere.push(sphereObject);
		}

		for (let i = 0; i < objects.length; i += 1) {
			const theta = i * 0.175 + Math.PI;
			const y = -(i * 8) + 450;
			const helixObject = new THREE.Object3D();

			helixObject.position.setFromCylindricalCoords(900, theta, y);
			vector.set(helixObject.position.x * 2, helixObject.position.y, helixObject.position.z * 2);
			helixObject.lookAt(vector);
			targets.helix.push(helixObject);
		}

		for (let i = 0; i < objects.length; i += 1) {
			const gridObject = new THREE.Object3D();

			gridObject.position.x = ((i % 5) * 400) - 800;
			gridObject.position.y = (-(Math.floor(i / 5) % 5) * 400) + 800;
			gridObject.position.z = Math.floor(i / 25) * 1000 - 2000;
			targets.grid.push(gridObject);
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
		controls.minDistance = 500;
		controls.maxDistance = 6000;
		controls.rotateSpeed = 0.6;
		controls.addEventListener('change', render);

		const transform = (layout: LayoutMode, duration: number) => {
			removeAll();

			for (let i = 0; i < objects.length; i += 1) {
				const object = objects[i];
				const target = targets[layout][i];
				const tweenDuration = Math.random() * duration + duration;

				new Tween(object.position)
					.to({ x: target.position.x, y: target.position.y, z: target.position.z }, tweenDuration)
					.easing(Easing.Exponential.InOut)
					.start();

				new Tween(object.rotation)
					.to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, tweenDuration)
					.easing(Easing.Exponential.InOut)
					.start();
			}

			new Tween({ progress: 0 })
				.to({ progress: 1 }, duration * 2)
				.onUpdate(render)
				.start();
		};

		const handleResize = () => {
			const { width, height } = getViewportSize();

			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
			render();
		};

		const animate = (time?: number) => {
			animationFrameId = window.requestAnimationFrame(animate);
			updateTween(time);
			controls.update();
		};

		transformRef.current = (layout: LayoutMode) => transform(layout, 2000);
		transform('table', 2000);
		animate();
		window.addEventListener('resize', handleResize);

		return () => {
			transformRef.current = null;
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

	const handleLayoutChange = (layout: LayoutMode) => {
		setActiveLayout(layout);
		transformRef.current?.(layout);
	};

	return (
		<Box
			sx={{
				position: 'relative',
				minHeight: 'calc(100vh - 56px)',
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
						'radial-gradient(circle at 20% 20%, rgba(0,255,255,0.08), transparent 26%), radial-gradient(circle at 80% 24%, rgba(196,160,255,0.12), transparent 28%), radial-gradient(circle at 50% 90%, rgba(123,224,200,0.1), transparent 34%)',
					pointerEvents: 'none',
					zIndex: 0,
				}}
			/>

			<Box ref={mountRef} sx={{ position: 'absolute', inset: 0, zIndex: 1 }} />

			<Box
				sx={{
					position: 'relative',
					zIndex: 2,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					minHeight: 'calc(100vh - 56px)',
					pointerEvents: 'none',
					p: { xs: 2, md: 3 },
				}}
			>
				<Box
					sx={{
						alignSelf: 'flex-start',
						maxWidth: 520,
						px: 2,
						py: 1.5,
						border: `1px solid ${accentAlpha(0.18)}`,
						background: 'rgba(8, 14, 24, 0.58)',
						backdropFilter: 'blur(14px)',
						pointerEvents: 'auto',
					}}
				>
					<Typography sx={{ fontFamily: fonts.mono, fontSize: 12, color: colors.secondary, letterSpacing: '0.18em', mb: 0.8 }}>
						THREE.JS CSS3D DEMO
					</Typography>
					<Typography sx={{ fontFamily: fonts.mono, fontSize: { xs: 20, md: 26 }, fontWeight: 700, color: colors.text, mb: 0.8 }}>
						Periodic Table Explorer
					</Typography>
					<Typography sx={{ fontFamily: fonts.mono, fontSize: 12, lineHeight: 1.7, color: colors.textMuted }}>
						ลากเพื่อหมุน, ซูมด้วยสกอลล์, แล้วสลับ layout ระหว่าง table, sphere, helix และ grid ได้จากปุ่มด้านล่าง
					</Typography>
				</Box>

				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						flexWrap: 'wrap',
						gap: 1,
						pointerEvents: 'auto',
					}}
				>
					{layoutModes.map((layout) => {
						const selected = activeLayout === layout;

						return (
							<Button
								key={layout}
								variant='plain'
								onClick={() => handleLayoutChange(layout)}
								sx={{
									minWidth: 108,
									borderRadius: 0,
									border: `1px solid ${selected ? 'rgba(127,255,255,0.7)' : 'rgba(127,255,255,0.3)'}`,
									background: selected ? 'rgba(0,255,255,0.18)' : 'rgba(8, 16, 24, 0.58)',
									color: selected ? '#dfffff' : 'rgba(180,255,255,0.75)',
									fontFamily: fonts.mono,
									letterSpacing: '0.08em',
									backdropFilter: 'blur(12px)',
									'&:hover': {
										background: 'rgba(0,255,255,0.28)',
										color: '#f5ffff',
									},
								}}
							>
								{layout.toUpperCase()}
							</Button>
						);
					})}
				</Box>
			</Box>
		</Box>
	);
};
