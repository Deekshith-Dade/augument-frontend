import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useState, useEffect, useMemo, useRef } from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ThoughtList } from "@/lib/types";
import { Button } from "../ui/button";
import { CloudOff, Minimize2, Search, X } from "lucide-react";
import { Input } from "../ui/input";

const CAMERA_POSITION: [number, number, number] = [0, 0, 5];
const CAMERA_FOV = 45;

const colors = [
  "#be123c",
  "#0ea5e9",
  "#16a34a",
  "#d97706",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#8b5cf6",
];

interface ThoughtNode {
  id: string;
  title: string;
  excerpt: string;
  position: THREE.Vector3;
  color: string;
  label: number;
}

const convertToThreeVector = (position: number[]) => {
  return new THREE.Vector3(position[0], position[1], position[2]);
};

const convertToThoughtNodes = (thoughts: ThoughtList[]): ThoughtNode[] => {
  if (!thoughts) return [];
  return thoughts.map((thought) => ({
    id: thought.id,
    title: thought.title,
    excerpt: thought.excerpt,
    position: convertToThreeVector(thought.position),
    color: colors[thought.label % colors.length],
    label: thought.label,
  }));
};

function centerThoughtPositions(thoughts: ThoughtNode[]): ThoughtNode[] {
  const n = thoughts.length;
  const center = [0, 0, 0];

  // Compute centroid of positions
  thoughts.forEach((t) => {
    center[0] += t.position.x;
    center[1] += t.position.y;
    center[2] += t.position.z;
  });

  center[0] /= n;
  center[1] /= n;
  center[2] /= n;

  // Subtract centroid from all positions
  return thoughts.map((t) => ({
    ...t,
    position: new THREE.Vector3(
      t.position.x - center[0],
      t.position.y - center[1],
      t.position.z - center[2]
    ),
  }));
}

function ThoughtNode({
  thought,
  selected,
  onSelect,
}: {
  thought: ThoughtNode;
  selected: boolean | null;
  onSelect: (thought: ThoughtNode) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      if (!selected) {
        const pulse = Math.sin(clock.getElapsedTime() * 0.8) * 0.05 + 1;
        meshRef.current.scale.set(pulse, pulse, pulse);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1.5, 1.5, 1.5), 0.1);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={thought.position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(thought);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
      }}
    >
      <icosahedronGeometry args={[0.15, 0]} />
      <meshStandardMaterial
        color={thought.color}
        metalness={0.1}
        roughness={0.1}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function ConnectionLines({
  thoughts,
  selectedThought,
}: {
  thoughts: ThoughtNode[];
  selectedThought: ThoughtNode | null;
}) {
  const lines = useMemo(() => {
    if (!selectedThought) return null;
    const sourcePos = selectedThought.position;
    const sourceLabel = selectedThought.label;
    const neighbors = thoughts
      .filter((t) => t.label === sourceLabel && t.id !== selectedThought.id)
      .sort(
        (a, b) =>
          a.position.distanceTo(sourcePos) - b.position.distanceTo(sourcePos)
      )
      .slice(0, 4);

    const points: THREE.Vector3[] = [];
    neighbors.forEach((neighbor) => points.push(sourcePos, neighbor.position));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return (
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          color={selectedThought.color}
          transparent
          opacity={0.6}
        />
      </lineSegments>
    );
  }, [selectedThought, thoughts]);
  return lines;
}

function Scene({
  thoughts,
  selectedThought,
  setSelectedThought,
}: {
  thoughts: ThoughtNode[];
  selectedThought: ThoughtNode | null;
  setSelectedThought: (thought: ThoughtNode | null) => void;
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const targetCameraPos = useRef(new THREE.Vector3(...CAMERA_POSITION));
  const targetControlsTarget = useRef(new THREE.Vector3(0, 0, 0));
  const currentCameraPos = useRef(new THREE.Vector3(...CAMERA_POSITION));
  const currentControlsTarget = useRef(new THREE.Vector3(0, 0, 0));
  const isAnimating = useRef(false);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    currentCameraPos.current.copy(camera.position);
    currentControlsTarget.current.copy(controls.target);

    if (selectedThought) {
      targetCameraPos.current = selectedThought.position
        .clone()
        .add(new THREE.Vector3(0, 0, 3.5));
      targetControlsTarget.current = selectedThought.position.clone();
      isAnimating.current = true;
    } else {
      targetCameraPos.current.set(...CAMERA_POSITION);
      targetControlsTarget.current.set(0, 0, 0);
      isAnimating.current = true;
    }
  }, [selectedThought, camera]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (isAnimating.current) {
      // Smooth camera position interpolation
      currentCameraPos.current.lerp(targetCameraPos.current, 0.05);
      camera.position.copy(currentCameraPos.current);

      // Smooth controls target interpolation
      currentControlsTarget.current.lerp(targetControlsTarget.current, 0.05);
      controls.target.copy(currentControlsTarget.current);

      const cameraDistanceToTarget = currentCameraPos.current.distanceTo(
        targetCameraPos.current
      );
      const targetDistanceToTarget = currentControlsTarget.current.distanceTo(
        targetControlsTarget.current
      );

      if (cameraDistanceToTarget < 0.1 && targetDistanceToTarget < 0.1) {
        isAnimating.current = false;
      }
    }
    controls.update();
  });

  return (
    <>
      <hemisphereLight intensity={2} groundColor={0x444444} />
      <directionalLight position={[3, 10, 10]} intensity={2} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        autoRotate={!selectedThought}
        autoRotateSpeed={0.2}
        minDistance={3}
        maxDistance={30}
      />
      {thoughts.map((thought) => (
        <ThoughtNode
          key={thought.id}
          thought={thought}
          selected={selectedThought && selectedThought.id === thought.id}
          onSelect={() =>
            setSelectedThought(selectedThought === thought ? null : thought)
          }
        />
      ))}
      <ConnectionLines thoughts={thoughts} selectedThought={selectedThought} />
    </>
  );
}

function InfoPanel({
  thought,
  canvasRef,
}: {
  thought: ThoughtNode | null;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const panelRef = useRef<HTMLDivElement>(null);
  const isVisible = !!thought;

  useEffect(() => {
    if (!thought || !canvasRef.current) return;

    const updatePosition = () => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const x = rect.left + rect.width * 0.75;
      const y = rect.top + rect.height * 0.45;

      if (panelRef.current) {
        setPosition({
          x: x + 30,
          y: y - panelRef.current.offsetHeight / 2,
        });
      }
    };

    updatePosition();
    const interval = setInterval(updatePosition, 100);

    return () => clearInterval(interval);
  }, [thought, canvasRef]);

  const [showExcerpt, setShowExcerpt] = useState(false);

  const style = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? ("visible" as const) : ("hidden" as const),
  };

  return (
    <div
      ref={panelRef}
      style={style}
      className="fixed top-0 left-0 w-[250px] bg-white/90 border border-slate-300 rounded-xl p-4 text-slate-800 text-sm leading-5 backdrop-blur-xs shadow-lg  transition-opacity duration-300 z-40"
    >
      {thought && (
        <div className="">
          <div className="flex justify-between items-center">
            <p className="font-semibold  mb-1 text-slate-600">
              {thought.title}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer text-slate-600  hover:bg-slate-200 hover:cursor-pointer p-1"
              onClick={() => setShowExcerpt(!showExcerpt)}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
          {showExcerpt && (
            <p className="text-slate-600  line-clamp-6 text-sm">
              {thought.excerpt}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ThoughtCloud({
  thoughts,
}: {
  thoughts: ThoughtList[];
}) {
  const [selectedThought, setSelectedThought] = useState<ThoughtNode | null>(
    null
  );
  const thoughtNodes = useMemo(
    () => centerThoughtPositions(convertToThoughtNodes(thoughts)),
    [thoughts]
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const filteredThoughts = useMemo(() => {
    if (!searchQuery.trim()) {
      return thoughtNodes;
    }
    setSelectedThought(null);
    const query = searchQuery.toLowerCase();
    return thoughtNodes.filter(
      (thought) =>
        thought.title.toLowerCase().includes(query) ||
        thought.excerpt.toLowerCase().includes(query) ||
        thought.label.toString().includes(query)
    );
  }, [searchQuery, thoughtNodes]);

  if (!thoughts)
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-8 text-center">
        <div className="rounded-full bg-gray-100 p-4">
          <CloudOff className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-700">No thoughts found</h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Your thought cloud is empty. Start adding some thoughts to see them
          visualized here.
        </p>
      </div>
    );

  return (
    <div className="relative h-[80vh] bg-slate-100 font-sans">
      {/* Header */}
      <div className=" p-6 pointer-events-none w-full z-[10]">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-slate-800">
            The Thought Cloud
          </h1>
          <p className="text-slate-500 mt-1">
            Similar thoughts cluster together. Click a node to focus.
          </p>
        </div>
      </div>
      {/* Search Bar */}
      <div className="absolute top-6 right-6 mb-6 z-10">
        <div className="max-w-md ">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <Input
              type="text"
              placeholder="Search your thoughts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200/60 focus:border-gray-300 bg-white/80 backdrop-blur-sm shadow-sm"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                onClick={() => {
                  setSearchQuery("");
                }}
              >
                <X className="w-3 h-3" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
          {/* {searchQuery && (
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-500 font-light">
                {filteredThoughts.length === 0
                  ? "No thoughts found"
                  : `${filteredThoughts.length} thought${
                      filteredThoughts.length === 1 ? "" : "s"
                    } found`}
              </p>
            </div>
          )} */}
        </div>
      </div>
      <button
        onClick={() => setSelectedThought(null)}
        className="absolute bottom-6 right-6 bg-white/70 hover:bg-white text-slate-700 font-semibold py-2 px-4 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 focus:outline-none border border-slate-300 z-10"
      >
        Reset View
      </button>
      <InfoPanel thought={selectedThought} canvasRef={canvasRef} />
      <div className="absolute top-0 left-0 w-full h-full z-9">
        <Canvas
          ref={canvasRef}
          className="display:block"
          camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedThought(null);
            }
          }}
        >
          <Scene
            thoughts={filteredThoughts}
            selectedThought={selectedThought}
            setSelectedThought={setSelectedThought}
          />
        </Canvas>
      </div>
    </div>
  );
}
