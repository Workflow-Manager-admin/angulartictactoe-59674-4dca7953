import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent (TicTacToe)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize empty board', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.board.length).toBe(9);
    expect(app.board.filter(x => x === '').length).toBe(9);
    expect(app.currentPlayer).toBe('X');
  });

  it('should allow making a move', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    app.makeMove(0);
    expect(app.board[0]).toBe('X');
    expect(app.currentPlayer).toBe('O');
  });

  it('should switch to O after X move', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    app.makeMove(0);
    expect(app.currentPlayer).toBe('O');
  });

  it('should detect win', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    app.board = ['X', 'X', '', '', 'O', '', '', '', 'O'];
    app.currentPlayer = 'X';
    app.makeMove(2); // X wins across top row
    expect(app.winner).toBe('X');
  });

  it('should not allow move on filled cell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    app.board[0] = 'X';
    app.currentPlayer = 'O';
    app.makeMove(0);
    expect(app.board[0]).toBe('X');
  });
});
