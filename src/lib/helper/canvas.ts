import {
  ASPECT_RATIO,
  TILE_COLS,
  TILE_ROWS,
} from "../../constants/gameConstant";

export const getGameSizes = () => {
  const scale = window.devicePixelRatio || 1;

  const windowW = window.innerWidth * scale;
  const windowH = window.innerHeight * scale;

  let width = windowW;
  let height = width / ASPECT_RATIO;

  if (height > windowH) {
    height = windowH;
    width = height * ASPECT_RATIO;
  }

  let tileSize = Math.floor(width / TILE_COLS);
  tileSize = Math.min(tileSize, Math.floor(height / TILE_ROWS));

  width = tileSize * TILE_COLS;
  height = tileSize * TILE_ROWS;

  return { width, height, tileSize };
};
