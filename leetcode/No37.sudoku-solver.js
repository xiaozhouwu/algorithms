/**
 * Difficulty:
 * Hard
 *
 * Desc:
 * Write a program to solve a Sudoku puzzle by filling the empty cells.
 * Empty cells are indicated by the character '.'.
 * You may assume that there will be only one unique solution.
 *
 * 填写数独。数据结构和 36 题一样。假设只有一个解
 */

/**
 * 思路：
 * 惭愧，目前还没有什么很好的思路，现有的方法是比较常见的回溯法：
 * 从 (1, 1) 到 (9, 9) 遍历各个位置，在每个位置都进行如下操作：
 * 1. 从可选择的数中随机取一个
 * 2. 继续向后遍历，并检查合法性。如果数独已经不合法了，则回退，即把上次生成的结果清空，重新选择
 *
 * 因此，我们需要：
 * 1. 遍历初始的数独，获取到各行、各列、各宫可以填入的数据
 * 2. 从 (1, 1) 到 (9, 9) 遍历，跳过初始时已经填入数据的位置，在空位上进行随机取值
 * （每个位置上可取的值是其所在行、列、宫的交集）
 * 3. 利用回溯法继续遍历、回退
 */

var data = {};

var solve = function(row, column, maxRow, maxColumn, board, picked) {
  if (row > maxRow) return true;

  if (column === 0) {
    picked = new Set();
  }

  if (column > maxColumn) return solve(row + 1, 0, maxRow, maxColumn, board, picked);
  if (board[row][column] !== '.') return solve(row, column + 1, maxRow, maxColumn, board, picked);

  var rowId = `r${row + 1}`;
  var columnId = `c${column + 1}`;

  var boxRow = Math.floor(row / 3) + 1;
  var boxColumn = Math.floor(column / 3) + 1;
  var boxId = `b${(boxRow - 1) * 3 + boxColumn}`;

  var result = false;
  var rowSet = data[rowId];
  var columnSet = data[columnId];
  var boxSet = data[boxId];

  for (var val of rowSet.keys()) {
    if (picked.has(val)) continue;
    if (columnSet.has(val) && boxSet.has(val)) {
      picked.add(val);
      columnSet.delete(val);
      boxSet.delete(val);
      board[row][column] = val;
      if (solve(row, column + 1, maxRow, maxColumn, board, picked)) {
        result = true;
        break;
      } else {
        picked.delete(val);
        columnSet.add(val);
        boxSet.add(val);
        board[row][column] = '.';
      }
    }
  }

  return result;
};

var solveSudoku = function(board) {
  console.log(board);
  for (var i = 0; i < board.length; i += 1) {
    var box = board[i];

    var rowId = `r${i + 1}`;
    var boxRow = Math.floor(i / 3) + 1;

    var rowOffset = Math.floor(i / 3) * 3;
    var colOffset = (i % 3) * 3;
    for (var j = 0; j < box.length; j += 1) {

      var columnId = `c${j + 1}`;
      var boxColumn = Math.floor(j / 3) + 1;
      var boxId = `b${(boxRow - 1) * 3 + boxColumn}`;

      if (!data[boxId]) {
        data[boxId] = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
      }
      if (!data[columnId]) {
        data[columnId] = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
      }
      if (!data[rowId]) {
        data[rowId] = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
      }
      var num = box[j];
      if (num === '.') continue;

      data[columnId].delete(num);
      data[rowId].delete(num);
      data[boxId].delete(num);
    }
  }

  solve(
    0,
    0,
    board.length - 1,
    board[0].length - 1,
    board
  );
};

var BOARD = [
  ["5", "3", ".", ".", "7", ".", ".", ".", "."],
  ["6", ".", ".", "1", "9", "5", ".", ".", "."],
  [".", "9", "8", ".", ".", ".", ".", "6", "."],
  ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
  ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
  ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
  [".", "6", ".", ".", ".", ".", "2", "8", "."],
  [".", ".", ".", "4", "1", "9", ".", ".", "5"],
  [".", ".", ".", ".", "8", ".", ".", "7", "9"]
];
solveSudoku(BOARD);
console.log(BOARD);