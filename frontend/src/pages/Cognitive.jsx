import React, { useEffect, useMemo, useRef, useState } from "react";
import * as LucideIcons from "lucide-react"; // ✅ Import all icons safely

// ---------- helpers: sliding puzzle ----------
function isSolvable(arr) {
  // 15-puzzle solvable if number of inversions is even
  const nums = arr.filter((n) => n !== 0);
  let inv = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] > nums[j]) inv++;
    }
  }
  return inv % 2 === 0;
}
function shuffleSolvable() {
  let a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
  do {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  } while (!isSolvable(a) || isSolved(a));
  return a;
}
function isSolved(a) {
  for (let i = 0; i < 15; i++) if (a[i] !== i + 1) return false;
  return a[15] === 0;
}
function canMove(index, blankIndex) {
  const r = Math.floor(index / 4);
  const c = index % 4;
  const br = Math.floor(blankIndex / 4);
  const bc = blankIndex % 4;
  return (r === br && Math.abs(c - bc) === 1) || (c === bc && Math.abs(r - br) === 1);
}

// ---------- Component ----------
export default function Cognitive() {
  const Brain = LucideIcons.Brain;

  const [started, setStarted] = useState(false);

  // --------- Game 1: 4x4 Sliding Number Puzzle (Blue box) ----------
  const [tiles, setTiles] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [won, setWon] = useState(false);
  const timerRef = useRef(null);

  const startPuzzle = () => {
    const s = shuffleSolvable();
    setTiles(s);
    setMoves(0);
    setTime(0);
    setWon(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
  };

  useEffect(() => {
    if (!started) return;
    startPuzzle();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  useEffect(() => {
    if (isSolved(tiles)) {
      if (timerRef.current) clearInterval(timerRef.current);
      setWon(true);
    }
  }, [tiles]);

  const moveTile = (idx) => {
    if (won) return;
    const b = tiles.indexOf(0);
    if (!canMove(idx, b)) return;
    const t = [...tiles];
    [t[idx], t[b]] = [t[b], t[idx]];
    setTiles(t);
    setMoves((m) => m + 1);
  };

  // --------- Game 2: Drag & Match Objects (Green box) ----------
  const shapes = useMemo(
    () => [
      { id: "circle", char: "🔵", label: "Circle" },
      { id: "square", char: "🟥", label: "Square" },
      { id: "triangle", char: "🔺", label: "Triangle" },
      { id: "star", char: "⭐", label: "Star" },
      { id: "diamond", char: "🔶", label: "Diamond" },
      { id: "heart", char: "❤️", label: "Heart" },
    ],
    []
  );
  const [targets, setTargets] = useState([]);
  const [matched, setMatched] = useState({});

  const [dragTime, setDragTime] = useState(0);
  const dragTimerRef = useRef(null);

  // --------- Game 3: Memory Card Game (Red box) ----------
  const memoryCards = useMemo(
    () => [
      { id: 1, symbol: "🍎", matched: false },
      { id: 2, symbol: "🍌", matched: false },
      { id: 3, symbol: "🍇", matched: false },
      { id: 4, symbol: "🍓", matched: false },
      { id: 5, symbol: "🍊", matched: false },
      { id: 6, symbol: "🍑", matched: false },
      { id: 7, symbol: "🍎", matched: false },
      { id: 8, symbol: "🍌", matched: false },
      { id: 9, symbol: "🍇", matched: false },
      { id: 10, symbol: "🍓", matched: false },
      { id: 11, symbol: "🍊", matched: false },
      { id: 12, symbol: "🍑", matched: false },
    ],
    []
  );
  const [memoryCardsState, setMemoryCardsState] = useState(memoryCards);
  const [flipped, setFlipped] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [memoryTime, setMemoryTime] = useState(0);
  const [memoryWon, setMemoryWon] = useState(false);
  const memoryTimerRef = useRef(null);

  const shuffleMemoryCards = () => {
    const shuffled = [...memoryCards].sort(() => Math.random() - 0.5);
    setMemoryCardsState(shuffled.map(card => ({ ...card, matched: false })));
  };

  const startMemoryGame = () => {
    shuffleMemoryCards();
    setFlipped([]);
    setMatchedPairs(0);
    setMemoryTime(0);
    setMemoryWon(false);
    if (memoryTimerRef.current) clearInterval(memoryTimerRef.current);
    memoryTimerRef.current = setInterval(() => setMemoryTime((t) => t + 1), 1000);
  };

  useEffect(() => {
    if (!started) return;
    startMemoryGame();
    return () => {
      if (memoryTimerRef.current) clearInterval(memoryTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  useEffect(() => {
    if (matchedPairs === 6 && started) {
      if (memoryTimerRef.current) clearInterval(memoryTimerRef.current);
      setMemoryWon(true);
    }
  }, [matchedPairs, started]);

  const handleCardClick = (index) => {
    if (memoryWon || flipped.length === 2) return;
    const card = memoryCardsState[index];
    if (card.matched || flipped.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const firstCard = memoryCardsState[first];
      const secondCard = memoryCardsState[second];

      if (firstCard.symbol === secondCard.symbol) {
        setTimeout(() => {
          setMemoryCardsState(prev => prev.map((c, i) =>
            i === first || i === second ? { ...c, matched: true } : c
          ));
          setMatchedPairs(prev => prev + 1);
          setFlipped([]);
        }, 1000);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const startDragMatch = () => {
    // randomize order of targets
    const shuffled = [...shapes].sort(() => Math.random() - 0.5);
    setTargets(shuffled);
    setMatched({});
    setDragTime(0);
    if (dragTimerRef.current) clearInterval(dragTimerRef.current);
    dragTimerRef.current = setInterval(() => setDragTime((t) => t + 1), 1000);
  };

  useEffect(() => {
    if (!started) return;
    startDragMatch();
    return () => {
      if (dragTimerRef.current) clearInterval(dragTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  useEffect(() => {
    if (Object.keys(matched).length === shapes.length && started) {
      if (dragTimerRef.current) clearInterval(dragTimerRef.current);
    }
  }, [matched, shapes.length, started]);

  const onDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
  };
  const onDropTarget = (e, targetId) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId === targetId) {
      setMatched((m) => ({ ...m, [targetId]: true }));
    }
  };
  const allowDrop = (e) => e.preventDefault();

  const onDropTile = (e, targetIdx) => {
    e.preventDefault();
    const draggedIdx = parseInt(e.dataTransfer.getData("text/plain"));
    const blankIdx = tiles.indexOf(0);
    if (targetIdx === blankIdx && canMove(draggedIdx, blankIdx)) {
      moveTile(draggedIdx);
    }
  };

  // --------- Start both ----------
  const startAll = () => setStarted(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col items-center text-center py-14">
        <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl shadow-md mb-4">
          <Brain className="w-14 h-16 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Cognitive Skills</h1>
        <p className="text-gray-500 text-lg">Advanced Number & Object Puzzles</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-10">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 text-center">
          <p className="text-gray-500 mb-1">Sliding Puzzle</p>
          <p className="text-sm text-gray-500">Moves / Time</p>
          <p className="text-3xl font-bold text-gray-800">
            {moves} / {time}s
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 text-center">
          <p className="text-gray-500 mb-1">Object Match</p>
          <p className="text-sm text-gray-500">Matches / Time</p>
          <p className="text-3xl font-bold text-gray-800">
            {Object.keys(matched).length}/{shapes.length} / {dragTime}s
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 text-center">
          <p className="text-gray-500 mb-1">Memory Card</p>
          <p className="text-sm text-gray-500">Pairs / Time</p>
          <p className="text-3xl font-bold text-gray-800">
            {matchedPairs}/6 / {memoryTime}s
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 text-center">
          <p className="text-gray-500 mb-1">Status</p>
          <p className="text-3xl font-bold text-gray-800">
            {won && Object.keys(matched).length === shapes.length && memoryWon
              ? "Completed 🎉"
              : started
              ? "In Progress"
              : "Not Started"}
          </p>
        </div>
      </div>

      {/* Three Game Boxes */}
      <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ---------- BLUE: 4x4 Sliding Number Puzzle ---------- */}
          <div className="bg-blue-400 rounded-2xl h-[22rem] md:h-[26rem] p-4 md:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-3 text-white">
              <h3 className="text-xl font-bold">Number Sliding Puzzle (4×4)</h3>
              <button
                onClick={startPuzzle}
                className="bg-white/90 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-white"
              >
                Shuffle
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 flex-1 place-content-center">
              {tiles.map((n, i) => (
                <button
                  key={i}
                  onClick={() => moveTile(i)}
                  disabled={n === 0}
                  draggable={!won && n !== 0}
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", i.toString())}
                  onDragOver={allowDrop}
                  onDrop={(e) => onDropTile(e, i)}
                  className={`rounded-xl flex items-center justify-center text-2xl font-extrabold transition
                    ${n === 0 ? "bg-blue-300/40" : "bg-white text-blue-700 hover:scale-105 shadow"} `}
                  style={{ minHeight: "4.5rem" }}
                  aria-label={n === 0 ? "empty" : `tile-${n}`}
                >
                  {n !== 0 ? n : ""}
                </button>
              ))}
            </div>

            <div className="mt-4 text-white text-sm">
              {won ? "Solved! 🎉 Great job." : "Tip: Slide tiles into order 1–15."}
            </div>
          </div>

          {/* ---------- GREEN: Drag & Match Objects Puzzle ---------- */}
          <div className="bg-green-400 rounded-2xl h-[22rem] md:h-[26rem] p-4 md:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-3 text-white">
              <h3 className="text-xl font-bold">Object Match (Drag → Target)</h3>
              <button
                onClick={startDragMatch}
                className="bg-white/90 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-white"
              >
                Reset
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
              {/* Draggables */}
              <div className="bg-white/90 rounded-xl p-3 overflow-auto">
                <p className="text-green-700 font-semibold text-sm mb-2">Objects</p>
                <div className="grid grid-cols-3 gap-2">
                  {shapes.map((s) => (
                    <div
                      key={s.id}
                      draggable={!matched[s.id]}
                      onDragStart={(e) => onDragStart(e, s.id)}
                      className={`select-none cursor-grab active:cursor-grabbing rounded-lg border text-center text-3xl py-2 ${
                        matched[s.id]
                          ? "opacity-40 bg-gray-100 border-gray-200"
                          : "bg-white border-gray-300 hover:shadow"
                      }`}
                      title={s.label}
                    >
                      {s.char}
                    </div>
                  ))}
                </div>
              </div>

              {/* Targets */}
              <div className="bg-white/90 rounded-xl p-3 overflow-auto">
                <p className="text-green-700 font-semibold text-sm mb-2">Targets</p>
                <div className="grid grid-cols-2 gap-3">
                  {targets.map((t) => (
                    <div
                      key={t.id}
                      onDragOver={allowDrop}
                      onDrop={(e) => onDropTarget(e, t.id)}
                      className={`rounded-xl border-2 flex items-center justify-center h-20 text-center px-2
                        ${
                          matched[t.id]
                            ? "border-green-500 bg-green-50 text-green-700 font-bold"
                            : "border-dashed border-gray-300 bg-white text-gray-600"
                        }`}
                    >
                      {matched[t.id] ? `${t.label} ✓` : t.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 text-white text-sm">
              {Object.keys(matched).length === shapes.length
                ? "All matched! 🎉"
                : "Drag each object to its matching target."}
            </div>
          </div>

          {/* ---------- RED: Memory Card Game ---------- */}
          <div className="bg-red-400 rounded-2xl h-[22rem] md:h-[26rem] p-4 md:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-3 text-white">
              <h3 className="text-xl font-bold">Memory Card Game</h3>
              <button
                onClick={startMemoryGame}
                className="bg-white/90 text-red-700 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-white"
              >
                Shuffle
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 flex-1 place-content-center">
              {memoryCardsState.map((card, index) => (
                <button
                  key={index}
                  onClick={() => handleCardClick(index)}
                  disabled={card.matched}
                  className={`rounded-xl flex items-center justify-center text-4xl transition-all duration-300 ${
                    flipped.includes(index) || card.matched
                      ? "bg-white text-red-700 scale-105"
                      : "bg-red-300/60 hover:bg-red-300/80"
                  }`}
                  style={{ minHeight: "4.5rem" }}
                  aria-label={flipped.includes(index) || card.matched ? `card-${card.symbol}` : "hidden card"}
                >
                  {flipped.includes(index) || card.matched ? card.symbol : "?"}
                </button>
              ))}
            </div>

            <div className="mt-4 text-white text-sm">
              {memoryWon ? "All pairs matched! 🎉" : "Click cards to flip and match pairs."}
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="flex justify-center py-10">
        <button
          onClick={startAll}
          className="px-8 py-4 bg-purple-600 text-white rounded-2xl text-xl font-semibold hover:bg-purple-700 transition"
        >
          Start Exercises
        </button>
      </div>
    </div>
  );
}