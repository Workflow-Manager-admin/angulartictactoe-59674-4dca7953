import { Component } from '@angular/core';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
/**
 * The root component of the Tic Tac Toe app.
 * Handles all game logic, state management, UI communication for two-player and AI mode.
 */
export class AppComponent {
  board: ('' | 'X' | 'O')[] = Array(9).fill('');
  currentPlayer: 'X' | 'O' = 'X';
  winner: '' | 'X' | 'O' = '';
  draw = false;
  scoreX = 0;
  scoreO = 0;
  scoreDraw = 0;
  mode: 'pvp' | 'ai' = 'pvp';
  isThinking = false;
  infoMessage = '';

  /**
   * Starts a new game with the current mode.
   * PUBLIC_INTERFACE
   */
  resetGame() {
    this.board = Array(9).fill('');
    this.currentPlayer = 'X';
    this.winner = '';
    this.draw = false;
    this.infoMessage = this.mode === 'ai' ? 'Your turn (X)' : 'Player X starts';
    if (this.mode === 'ai' && this.currentPlayer === 'O') {
      this.aiMove();
    }
  }

  /**
   * Called when the user clicks to make a move on cell i.
   * PUBLIC_INTERFACE
   */
  makeMove(i: number) {
    if (this.board[i] || this.winner || this.draw || this.isThinking) {
      return;
    }
    this.board[i] = this.currentPlayer;
    this.updateState();
    if (!this.winner && !this.draw && this.mode === 'ai' && this.currentPlayer === 'O') {
      this.isThinking = true;
      setTimeout(() => { this.aiMove(); }, 400);
    }
  }

  /**
   * Checks for winner/draw and switches turns.
   */
  private updateState() {
    // Check win/draw
    this.winner = this.checkWinner();
    if (this.winner) {
      if (this.winner === 'X') this.scoreX += 1;
      if (this.winner === 'O') this.scoreO += 1;
      this.infoMessage = '';
      return;
    }
    this.draw = this.isDraw();
    if (this.draw) {
      this.scoreDraw += 1;
      this.infoMessage = '';
      return;
    }
    // Switch turn
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    if (this.mode === 'ai') {
      this.infoMessage = this.currentPlayer === 'X' ? 'Your turn (X)' : 'AI thinking...';
    } else {
      this.infoMessage = `Player ${this.currentPlayer}'s turn`;
    }
  }

  /**
   * Makes a move for the simple AI (random empty cell).
   */
  private aiMove() {
    if (this.winner || this.draw) {
      this.isThinking = false;
      return;
    }
    // Simple AI: try to win, then block, then pick random empty.
    let move = this.findBestMove('O') || this.findBestMove('X') || this.pickRandomMove();
    if (move !== null && this.board[move] === '') {
      this.board[move] = 'O';
      this.updateState();
    }
    this.isThinking = false;
  }

  /**
   * Set the game mode: 'pvp' for two-player, 'ai' for Play vs AI.
   * PUBLIC_INTERFACE
   */
  setMode(mode: 'pvp' | 'ai') {
    if (this.mode !== mode) {
      this.mode = mode;
      this.restartScores();
      this.resetGame();
    }
  }

  /**
   * Restart only the scores to 0.
   * PUBLIC_INTERFACE
   */
  restartScores() {
    this.scoreX = 0;
    this.scoreO = 0;
    this.scoreDraw = 0;
  }

  /**
   * Checks for a winner. Returns 'X', 'O' or ''.
   */
  private checkWinner(): '' | 'X' | 'O' {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // columns
      [0,4,8],[2,4,6]          // diagonals
    ];
    for (let [a,b,c] of lines) {
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        return this.board[a] as 'X' | 'O';
      }
    }
    return '';
  }

  /**
   * Checks for a draw (no empty cell and no winner).
   */
  private isDraw(): boolean {
    return this.board.every(cell => !!cell) && !this.checkWinner();
  }

  /**
   * Finds a move to win/block for the given player.
   */
  private findBestMove(player: 'X' | 'O'): number | null {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8], [0,3,6],[1,4,7],[2,5,8], [0,4,8],[2,4,6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      const vals = [this.board[a], this.board[b], this.board[c]];
      const playerCount = vals.filter(v => v === player).length;
      const emptyIdx = line.find(idx => this.board[idx] === '');
      if (playerCount === 2 && emptyIdx !== undefined && emptyIdx !== null) {
        return emptyIdx;
      }
    }
    return null;
  }

  /**
   * Picks a random empty cell index.
   */
  private pickRandomMove(): number | null {
    const empties = this.board.map((v,i) => v === '' ? i : -1).filter(i => i !== -1);
    if (empties.length === 0) return null;
    return empties[Math.floor(Math.random() * empties.length)];
  }

  constructor() {
    this.resetGame();
  }
}
