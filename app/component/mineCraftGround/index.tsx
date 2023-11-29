import { Color, DoubleSide, LinearSRGBColorSpace, Matrix4, MeshLambertMaterial, NearestFilter, PlaneGeometry } from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { TextureLoader } from 'expo-three';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const texture = new TextureLoader().load(require('../../../assets/textures/atlas.png'));
texture.colorSpace = LinearSRGBColorSpace;
texture.magFilter = NearestFilter;

export function MineCraftGround() {
  const worldWidth = 128;
  const worldDepth = 128;
	const worldHalfWidth = worldWidth / 2;
	const worldHalfDepth = worldDepth / 2;
  const matrix = new Matrix4();

	// ================= five face of cube, but bottom of cube ===========
  const pxGeometry = new PlaneGeometry(100, 100);
	pxGeometry.attributes.uv.array[ 1 ] = 0.5;
	pxGeometry.attributes.uv.array[ 3 ] = 0.5;
	pxGeometry.rotateY(Math.PI / 2);
	pxGeometry.translate(50, -50, 0);

	const nxGeometry = new PlaneGeometry(100, 100);
	nxGeometry.attributes.uv.array[ 1 ] = 0.5;
	nxGeometry.attributes.uv.array[ 3 ] = 0.5;
	nxGeometry.rotateY(-Math.PI / 2);
	nxGeometry.translate(-50, -50, 0);

	const pyGeometry = new PlaneGeometry(100, 100);
	pyGeometry.attributes.uv.array[ 5 ] = 0.5;
	pyGeometry.attributes.uv.array[ 7 ] = 0.5;
	pyGeometry.rotateX(-Math.PI / 2);
	pyGeometry.translate(0, 0, 0);

	const pzGeometry = new PlaneGeometry(100, 100);
	pzGeometry.attributes.uv.array[ 1 ] = 0.5;
	pzGeometry.attributes.uv.array[ 3 ] = 0.5;
	pzGeometry.translate(0, -50, 50);

	const nzGeometry = new PlaneGeometry(100, 100);
	nzGeometry.attributes.uv.array[ 1 ] = 0.5;
	nzGeometry.attributes.uv.array[ 3 ] = 0.5;
	nzGeometry.rotateY(Math.PI);
	nzGeometry.translate(0, -50, -50);

	const geometries = [];

	// put cube in all cells
	for (let z = 0; z < worldDepth; z++) {
		for (let x = 0; x < worldWidth; x++) {
			matrix.makeTranslation(
				(x * 100) - (worldHalfWidth * 100),
				0,
				(z * 100) - (worldHalfDepth * 100)
			);

			// put every face in correct position
			geometries.push(pyGeometry.clone().applyMatrix4(matrix));

			if (x === 0) {
				geometries.push(pxGeometry.clone().applyMatrix4(matrix));
			}

			if (x === worldWidth - 1) {
				geometries.push(nxGeometry.clone().applyMatrix4(matrix));
			}

			if (z === worldDepth - 1) {
				geometries.push(pzGeometry.clone().applyMatrix4(matrix));
			}

			if (z === 0) {
				geometries.push(nzGeometry.clone().applyMatrix4(matrix));
			}
		}
	}

	const geometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
	geometry.computeBoundingSphere();
	const meterial = new MeshLambertMaterial({ map: texture, side: DoubleSide, color: new Color('green') });

	return <mesh geometry={geometry} material={meterial}  />;
}
