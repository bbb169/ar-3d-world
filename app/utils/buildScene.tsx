import { DoubleSide, Matrix4, MeshLambertMaterial, NearestFilter, PlaneGeometry, SRGBColorSpace, Vector3 } from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { TextureLoader } from 'expo-three';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const texture = new TextureLoader().load(require('../../assets/textures/atlas.png'));
texture.colorSpace = SRGBColorSpace;
texture.magFilter = NearestFilter;

export function MineCraftGround() {
  const worldWidth = 128;
  const worldDepth = 128;
	const worldHalfWidth = worldWidth / 2;
	const worldHalfDepth = worldDepth / 2;
  const data = generateHeight(worldWidth, worldDepth);
  const matrix = new Matrix4();

  const pxGeometry = new PlaneGeometry(100, 100);
	pxGeometry.attributes.uv.array[ 1 ] = 0.5;
	pxGeometry.attributes.uv.array[ 3 ] = 0.5;
	pxGeometry.rotateY(Math.PI / 2);
	pxGeometry.translate(50, 0, 0);

	const nxGeometry = new PlaneGeometry(100, 100);
	nxGeometry.attributes.uv.array[ 1 ] = 0.5;
	nxGeometry.attributes.uv.array[ 3 ] = 0.5;
	nxGeometry.rotateY(-Math.PI / 2);
	nxGeometry.translate(-50, 0, 0);

	const pyGeometry = new PlaneGeometry(100, 100);
	pyGeometry.attributes.uv.array[ 5 ] = 0.5;
	pyGeometry.attributes.uv.array[ 7 ] = 0.5;
	pyGeometry.rotateX(-Math.PI / 2);
	pyGeometry.translate(0, 0, 0);

	const pzGeometry = new PlaneGeometry(100, 100);
	pzGeometry.attributes.uv.array[ 1 ] = 0.5;
	pzGeometry.attributes.uv.array[ 3 ] = 0.5;
	pzGeometry.translate(0, 0, 50);

	const nzGeometry = new PlaneGeometry(100, 100);
	nzGeometry.attributes.uv.array[ 1 ] = 0.5;
	nzGeometry.attributes.uv.array[ 3 ] = 0.5;
	nzGeometry.rotateY(Math.PI);
	nzGeometry.translate(0, 0, -50);

	const geometries = [];

	for (let z = 0; z < worldDepth; z++) {
		for (let x = 0; x < worldWidth; x++) {
			const h = getY(x, z);

			matrix.makeTranslation(
				(x * 100) - (worldHalfWidth * 100),
				h * 100,
				(z * 100) - (worldHalfDepth * 100)
			);

			const px = getY(x + 1, z);
						const nx = getY(x - 1, z);
						const pz = getY(x, z + 1);
						const nz = getY(x, z - 1);

			geometries.push(pyGeometry.clone().applyMatrix4(matrix));

			if ((px !== h && px !== h + 1) || x === 0) {
				geometries.push(pxGeometry.clone().applyMatrix4(matrix));
			}

			if ((nx !== h && nx !== h + 1) || x === worldWidth - 1) {
				geometries.push(nxGeometry.clone().applyMatrix4(matrix));
			}

			if ((pz !== h && pz !== h + 1) || z === worldDepth - 1) {
				geometries.push(pzGeometry.clone().applyMatrix4(matrix));
			}

			if ((nz !== h && nz !== h + 1) || z === 0) {
				geometries.push(nzGeometry.clone().applyMatrix4(matrix));
			}
		}
	}

	const geometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
	geometry.computeBoundingSphere();
	const meterial = new MeshLambertMaterial({ map: texture, side: DoubleSide });

	return <mesh geometry={geometry} material={meterial} >
		<ambientLight color={0xeeeeee} intensity={3} />
		<directionalLight color={0xffffff} intensity={12} position={new Vector3(1, 1, 0.5).normalize()}/>
	</mesh>;

  function generateHeight(width: number, height: number) {
          const data = []; const perlin = new ImprovedNoise();
            const size = width * height; const z = Math.random() * 100;

          let quality = 2;

          for (let j = 0; j < 4; j++) {
            if (j === 0) {
              for (let i = 0; i < size; i++) {
              data[ i ] = 0;
            }
          }

            for (let i = 0; i < size; i++) {
              const x = i % width; const y = (i / width) | 0;
              data[ i ] += perlin.noise(x / quality, y / quality, z) * quality;
            }

            quality *= 4;
          }

          return data;
  }

  function getY(x: number, z: number) {
    // eslint-disable-next-line no-bitwise
    return (data[ x + (z * worldWidth) ] * 0.15) | 0;
  }
}
