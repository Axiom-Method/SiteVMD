"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { DoubleSide, Group, LatheGeometry, MathUtils, Vector2 } from "three";

/**
 * Troféu 3D (WebGL) do CTA final, gerado no código: sem arquivo de modelo para baixar.
 * - Gira devagar, flutua e se inclina na direção do mouse.
 * - Os reflexos vêm de um ambiente de luz montado localmente (Lightformers): os presets
 *   do drei baixariam HDRs de fora, o que a CSP (connect-src 'self') bloqueia.
 * Carregado sob demanda por Trofeu3DLazy.tsx.
 */

const LARANJA = "#e8550f";
/** Abertura do arco das alças (rad): perto de 2π fecha o "C" sobre a taça. */
const ARCO_ALCA = 3.4;

/** Perfil do troféu (raio, altura), girado em torno do eixo Y: haste + taça. */
const PERFIL: [number, number][] = [
  [0.24, 0.45],
  [0.13, 0.62],
  [0.1, 0.88],
  [0.15, 1.02],
  [0.3, 1.13],
  [0.55, 1.3],
  [0.72, 1.6],
  [0.8, 1.95],
  [0.83, 2.3],
  [0.88, 2.4],
  // borda e parede interna da taça
  [0.82, 2.4],
  [0.75, 2.0],
  [0.55, 1.68],
  [0.0, 1.55],
];

function Trofeu({ girar }: { girar: boolean }) {
  const grupo = useRef<Group>(null);
  const taca = useMemo(() => new LatheGeometry(PERFIL.map(([x, y]) => new Vector2(x, y)), 72), []);

  useFrame((state, delta) => {
    const g = grupo.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    // Entrada: cresce até o tamanho final
    const s = MathUtils.damp(g.scale.x, 1, 3, delta);
    g.scale.setScalar(s);
    if (!girar) return;
    g.rotation.y += delta * 0.45;
    g.position.y = -1.25 + Math.sin(t * 1.2) * 0.06;
    // Inclina na direção do ponteiro
    g.rotation.x = MathUtils.damp(g.rotation.x, -state.pointer.y * 0.18, 4, delta);
    g.rotation.z = MathUtils.damp(g.rotation.z, -state.pointer.x * 0.12, 4, delta);
  });

  return (
    <group ref={grupo} position={[0, -1.25, 0]} rotation={[0, -0.6, 0]} scale={girar ? 0.6 : 1}>
      {/* Taça + haste */}
      <mesh geometry={taca} castShadow>
        <meshStandardMaterial color={LARANJA} metalness={1} roughness={0.2} side={DoubleSide} envMapIntensity={1.4} />
      </mesh>
      {/* Alças em "C": as pontas do arco entram na parede da taça */}
      {[1, -1].map((lado) => (
        <mesh key={lado} position={[lado * 0.72, 1.92, 0]} rotation={[0, 0, lado === 1 ? -ARCO_ALCA / 2 : Math.PI - ARCO_ALCA / 2]}>
          <torusGeometry args={[0.3, 0.055, 20, 48, ARCO_ALCA]} />
          <meshStandardMaterial color={LARANJA} metalness={1} roughness={0.2} envMapIntensity={1.4} />
        </mesh>
      ))}
      {/* Anel da haste */}
      <mesh position={[0, 0.88, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.035, 16, 40]} />
        <meshStandardMaterial color="#f2a35a" metalness={1} roughness={0.15} />
      </mesh>
      {/* Pedestal: degrau metálico sobre base grafite */}
      <mesh position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.42, 0.5, 0.18, 64]} />
        <meshStandardMaterial color={LARANJA} metalness={1} roughness={0.25} envMapIntensity={1.4} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.72, 0.8, 0.28, 64]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}

export default function Trofeu3D({ ativo, girar, aoPronto }: { ativo: boolean; girar: boolean; aoPronto: () => void }) {
  return (
    <Canvas
      // Pausa o desenho quando o troféu sai da tela
      frameloop={ativo ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.3, 5.6], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={aoPronto}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 2]} intensity={1.2} color="#ffd2ad" />
      <Trofeu girar={girar} />
      <ContactShadows position={[0, -1.25, 0]} opacity={0.55} scale={4} blur={2.4} far={2} color="#000" />
      {/* Estúdio de luz local: faixas brancas e laranja refletidas no metal */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 3, 2]} scale={[6, 1.2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={4} position={[-4, 1, 1]} rotation-y={Math.PI / 2} scale={[4, 1.5, 1]} color="#ea8326" />
        <Lightformer form="rect" intensity={2} position={[4, 0.5, 0]} rotation-y={-Math.PI / 2} scale={[4, 1, 1]} color="#ffffff" />
        <Lightformer form="ring" intensity={2.5} position={[0, 0, -5]} scale={3} color="#e8550f" />
        {/* Luzes atrás da câmera: é o que a frente da taça reflete */}
        <Lightformer form="rect" intensity={2.2} position={[-1.5, 1, 5]} scale={[2.5, 4, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.6} position={[2, -0.5, 5]} scale={[2, 3, 1]} color="#ffb27a" />
      </Environment>
    </Canvas>
  );
}
