export default function App() {
  function Square() {
    return (
      <div>
        <button className="square"></button>
      </div>
    )
  }

  return (
    <div className="board">
      <div className="board-row">
        <Square></Square>
        <Square></Square>
        <Square></Square>
      </div>
      <div className="board-row">
        <Square></Square>
        <Square></Square>
        <Square></Square>
      </div>
      <div className="board-row">
        <Square></Square>
        <Square></Square>
        <Square></Square>
      </div>
    </div>
  );
}