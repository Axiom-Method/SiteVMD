"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { CatmullRomCurve3, DoubleSide, Group, LatheGeometry, MathUtils, TubeGeometry, Vector2, Vector3 } from "three";

/**
 * Taça 3D (WebGL) atrás do texto do CTA final, gerada no código: sem arquivo de modelo.
 * Taça de campeonato com alças em "orelha" e pedestal facetado (o idioma das malhas do site).
 * - Gira devagar, flutua e se inclina na direção do mouse (lido da janela: o texto fica por cima do canvas).
 * - Reflexos de um ambiente de luz local (Lightformers): os presets do drei baixariam HDRs
 *   de fora, o que a CSP (connect-src 'self') bloqueia.
 * Carregada sob demanda por Trofeu3DLazy.tsx.
 */

const LARANJA = "#e8550f";
const LARANJA_CLARO = "#f39236";
const GRAFITE = "#1d1d1d";

/** Perfil (raio, altura) girado em torno do eixo Y: haste fina e taça alongada com borda saliente. */
const PERFIL_TACA: [number, number][] = [
  [0.2, 0.9],
  [0.12, 1.02],
  [0.085, 1.3],
  [0.1, 1.55],
  [0.22, 1.68],
  [0.45, 1.85],
  [0.66, 2.15],
  [0.78, 2.55],
  [0.82, 2.95],
  [0.9, 3.12],
  [0.96, 3.2],
  // lábio e parede interna
  [0.9, 3.22],
  [0.78, 2.9],
  [0.6, 2.4],
  [0.0, 2.2],
];

/** Alça em "orelha": sai da borda, abre para fora e volta ao bojo da taça. */
function curvaAlca(lado: 1 | -1) {
  return new CatmullRomCurve3(
    [
      [0.86, 3.0],
      [1.25, 3.05],
      [1.48, 2.75],
      [1.38, 2.3],
      [1.05, 2.05],
      [0.68, 2.08],
    ].map(([x, y]) => new Vector3(x * lado, y, 0)),
  );
}

/**
 * Afasta a câmera conforme a proporção do canvas para a taça (com as alças) sempre caber:
 * em tela larga vale a altura; em tela em pé (celular), a largura.
 */
function EnquadrarCamera() {
  const camera = useThree((s) => s.camera);
  const { width, height } = useThree((s) => s.size);
  useEffect(() => {
    const aspecto = width / Math.max(height, 1);
    const tangente = Math.tan(MathUtils.degToRad(34 / 2));
    const peloAlto = 4.3 / (2 * tangente);
    const pelaLargura = 3.6 / (2 * tangente * aspecto);
    camera.position.z = Math.max(peloAlto, pelaLargura);
    camera.updateProjectionMatrix();
  }, [camera, width, height]);
  return null;
}

/** Posição do mouse na janela (-1 a 1), compartilhada com o useFrame sem re-renderizar. */
function usePonteiroJanela() {
  const ponteiro = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const mover = (e: PointerEvent) => {
      ponteiro.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ponteiro.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", mover, { passive: true });
    return () => window.removeEventListener("pointermove", mover);
  }, []);
  return ponteiro;
}

function Taca({ girar }: { girar: boolean }) {
  const grupo = useRef<Group>(null);
  const ponteiro = usePonteiroJanela();
  const taca = useMemo(() => new LatheGeometry(PERFIL_TACA.map(([x, y]) => new Vector2(x, y)), 96), []);
  const alcas = useMemo(() => ([1, -1] as const).map((lado) => new TubeGeometry(curvaAlca(lado), 64, 0.06, 16, false)), []);

  useFrame((state, delta) => {
    const g = grupo.current;
    if (!g) return;
    g.scale.setScalar(MathUtils.damp(g.scale.x, 1, 2.5, delta));
    if (!girar) return;
    const t = state.clock.elapsedTime;
    g.rotation.y += delta * 0.35;
    g.position.y = -1.75 + Math.sin(t * 1.1) * 0.07;
    g.rotation.x = MathUtils.damp(g.rotation.x, -ponteiro.current.y * 0.12, 3, delta);
    g.rotation.z = MathUtils.damp(g.rotation.z, -ponteiro.current.x * 0.08, 3, delta);
  });

  const metal = { color: LARANJA, metalness: 1, roughness: 0.22, envMapIntensity: 1.3 } as const;

  return (
    <group ref={grupo} position={[0, -1.75, 0]} rotation={[0, -0.5, 0]} scale={girar ? 0.7 : 1}>
      {/* Taça + haste */}
      <mesh geometry={taca}>
        <meshStandardMaterial {...metal} side={DoubleSide} />
      </mesh>
      {/* Alças */}
      {alcas.map((g, i) => (
        <mesh key={i} geometry={g}>
          <meshStandardMaterial {...metal} />
        </mesh>
      ))}
      {/* Frisos: borda, meio da taça e nó da haste */}
      {[
        { y: 3.18, r: 0.95, t: 0.035 },
        { y: 2.62, r: 0.79, t: 0.03 },
        { y: 1.3, r: 0.1, t: 0.045 },
      ].map((f) => (
        <mesh key={f.y} position={[0, f.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[f.r, f.t, 16, 96]} />
          <meshStandardMaterial color={LARANJA_CLARO} metalness={1} roughness={0.12} envMapIntensity={1.5} />
        </mesh>
      ))}
      {/* Pedestal facetado (8 lados, faces planas) em dois degraus, com friso laranja */}
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.32, 0.42, 0.22, 8]} />
        <meshStandardMaterial color={GRAFITE} metalness={0.7} roughness={0.3} flatShading />
      </mesh>
      <mesh position={[0, 0.66, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.43, 0.025, 12, 8]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.62, 0.78, 0.62, 8]} />
        <meshStandardMaterial color={GRAFITE} metalness={0.7} roughness={0.32} flatShading />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.82, 0.86, 0.06, 8]} />
        <meshStandardMaterial {...metal} flatShading />
      </mesh>
    </group>
  );
}

export default function Trofeu3D({ ativo, girar, aoPronto }: { ativo: boolean; girar: boolean; aoPronto: () => void }) {
  return (
    <Canvas
      // Pausa o desenho quando a seção sai da tela
      frameloop={ativo ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.4], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={aoPronto}
    >
      <EnquadrarCamera />
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4, 2]} intensity={1.1} color="#ffd2ad" />
      <Taca girar={girar} />
      <ContactShadows position={[0, -1.76, 0]} opacity={0.5} scale={5} blur={2.6} far={2.5} color="#000" />
      {/* Estúdio de luz local: faixas brancas e laranja refletidas no metal */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 2]} scale={[7, 1.2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={4} position={[-4, 1, 1]} rotation-y={Math.PI / 2} scale={[5, 1.5, 1]} color="#ea8326" />
        <Lightformer form="rect" intensity={2} position={[4, 0.5, 0]} rotation-y={-Math.PI / 2} scale={[5, 1, 1]} color="#ffffff" />
        <Lightformer form="ring" intensity={2.5} position={[0, 0, -5]} scale={3} color="#e8550f" />
        <Lightformer form="rect" intensity={2} position={[-1.5, 1, 5]} scale={[2.5, 4, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.5} position={[2, -0.5, 5]} scale={[2, 3, 1]} color="#ffb27a" />
      </Environment>
    </Canvas>
  );
}
