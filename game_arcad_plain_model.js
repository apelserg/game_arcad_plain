// ============================
// Разработчик: apelserg ; https://github.com/apelserg/
// Лицензия: WTFPL
// ============================

"use strict";

//===
// Базовый объект - мяч
//===
APELSERG.MODEL.Ball = function (ballX, ballY) {
    this.X = ballX;
    this.Y = ballY;
    this.Radius = APELSERG.CONFIG.SET.BallSize / 2;
    this.DirX = 0; //-- направление и скорость по X
    this.DirY = 0; //-- направление и скорость по Y
    this.DirXSpeedUp = 0; //-- ускорение по X
    this.DirYSpeedUp = 0; //-- ускорение по Y
}

//===
// Базовый объект - ракетка
//===
APELSERG.MODEL.Racket = function (rX, rY) {
    this.X = rX;
    this.Y = rY;
    this.Height = APELSERG.CONFIG.SET.RacketHeight;
    this.Width = APELSERG.CONFIG.SET.RacketWidth;
    this.MoveX = APELSERG.CONFIG.SET.RacketWidth - (APELSERG.CONFIG.SET.RacketWidth / 5);
}

//===
// Базовый объект - плитка
//===
APELSERG.MODEL.Tile = function (tileRow, tileCol, tileColor, tilePoint) {
    this.Row = tileRow;
    this.Col = tileCol;
    this.Color = tileColor;
    this.Point = tilePoint;
}

//===
// Новый мяч
//===
APELSERG.MODEL.GetBall = function () {

    var ballX = APELSERG.CONFIG.PROC.CanvaID.width / 2;
    var ballY = APELSERG.CONFIG.PROC.CanvaID.height / 2;

    return new APELSERG.MODEL.Ball(ballX, ballY);
}

//===
// Новая ракетка
//===
APELSERG.MODEL.GetRacket = function () {

    var rX = (APELSERG.CONFIG.PROC.CanvaID.width / 2) - (APELSERG.CONFIG.SET.RacketWidth / 2);
    var rY = APELSERG.CONFIG.PROC.CanvaID.height - (APELSERG.CONFIG.SET.RacketHeight * 2);

    return new APELSERG.MODEL.Racket(rX, rY);
}

//===
// Новое поле плиток
//===
APELSERG.MODEL.GetTiles = function () {

    var tiles = [];

    for (var row = 0 ; row < APELSERG.CONFIG.PROC.TileRows; row++)
    {
        for (var col = 0 ; col < APELSERG.CONFIG.SET.CourtColTileNum; col++) {

            var color = APELSERG.MODEL.GetColor();
            var point = APELSERG.MODEL.GetRandomNumber(10) * APELSERG.CONFIG.PROC.Step + 1;

            tiles.push(new APELSERG.MODEL.Tile(row + 1, col + 1, color, point));
        }
    }

    return tiles; 
}

//===
// Получить случайное число из диапазона
//===
APELSERG.MODEL.GetRandomNumber = function (max) {
    return Math.round(Math.random() * max * 100) % max;
}

//===
// Получить случайный цвет из списка
//===
APELSERG.MODEL.GetColor = function () {
    var colors = ['#CC3300', '#FF9900', '#FFFF00', '#009933', '#3399FF', '#0033CC', '#9900CC'];
    return colors[APELSERG.MODEL.GetRandomNumber(colors.length)];
}

//===
// Переместить мяч
//===
APELSERG.MODEL.UpdateBall = function () {

    var ball = APELSERG.CONFIG.PROC.Ball;
    var racket = APELSERG.CONFIG.PROC.Racket;
    var tiles = APELSERG.CONFIG.PROC.Tiles;

    if (ball.X < APELSERG.CONFIG.PROC.CanvaID.width / 2) {

        //--  Отскок от левой стороны корта
        //--
        if (ball.X <= ball.Radius) {
            ball.X = ball.Radius;
            ball.DirX *= -1;
        }
    }
    else {
        //--  Отскок от правой стороны корта
        //--
        if (ball.X >= (APELSERG.CONFIG.PROC.CanvaID.width - ball.Radius)) {
            ball.X = APELSERG.CONFIG.PROC.CanvaID.width - ball.Radius;
            ball.DirX *= -1;
        }
    }

    if (ball.Y < APELSERG.CONFIG.PROC.CanvaID.height / 2) {

        //--  Отскок от плитки
        //--
        if (!APELSERG.MODEL.TileBallKickback()) {

            //--  Отскок от верха корта
            //--
            if (ball.Y <= ball.Radius) {
                ball.Y = ball.Radius;
                ball.DirY *= -1;
            }
        }
    }
    else {

        //--  Отскок от ракетки
        //--
        if (!APELSERG.MODEL.RacketBallKickback()) {

            //--  Отскок от низа корта
            //--
            if (ball.Y >= (APELSERG.CONFIG.PROC.CanvaID.height - ball.Radius)) {

                ball.Y = APELSERG.CONFIG.PROC.CanvaID.height - ball.Radius;
                ball.DirY *= -1;

                APELSERG.CONFIG.PROC.Points -= (10 + (APELSERG.CONFIG.SET.RacketWidth / APELSERG.CONFIG.SET.BallSize)) + APELSERG.CONFIG.PROC.Step;
                APELSERG.CONFIG.PROC.RedCnt = 30;
            }

        }
    }

    //-- игра завершена?
    //--
    if (APELSERG.CONFIG.PROC.Tiles.length == 0) {

        APELSERG.CONFIG.PROC.GameStop = true;
        if (APELSERG.CONFIG.PROC.Step == APELSERG.CONFIG.SET.Cycles) {
            APELSERG.CONFIG.SetResult();
        }
    }
    else {
        //-- движение мяча
        //--
        if (ball.DirX > 0) {
            ball.X += ball.DirX + ball.DirXSpeedUp;
        }
        else {
            ball.X += ball.DirX - ball.DirXSpeedUp;
        }

        if (ball.DirY > 0) {
            ball.Y += ball.DirY + ball.DirYSpeedUp;;
        }
        else {
            ball.Y += ball.DirY - ball.DirYSpeedUp;;
        }
    }
}

//===
// Отскок от плитки
//===
APELSERG.MODEL.TileBallKickback = function () {

    var tileKick = false;

    var ball = APELSERG.CONFIG.PROC.Ball;
    var tiles = APELSERG.MAIN.CloneObj(APELSERG.CONFIG.PROC.Tiles);

    for (var n in tiles) {

        var tile = tiles[n];

        var tX = (tile.Col - 1) * APELSERG.CONFIG.SET.TileWidth;
        var tY = (tile.Row - 1) * APELSERG.CONFIG.SET.TileHeight;

        //-- удар в низ плитки
        //--
        if ((ball.Y >= tY)
            && ((ball.Y - ball.Radius) <= (tY + APELSERG.CONFIG.SET.TileHeight))
            &&((ball.X + ball.Radius) >= tX)
            && ((ball.X - ball.Radius) <= (tX + APELSERG.CONFIG.SET.TileWidth))
            && (ball.DirY < 0)) {

            ball.Y = (tY + APELSERG.CONFIG.SET.TileHeight) + ball.Radius;
            ball.DirY *= -1;
            tileKick = true;
        }

        //-- удар в верх плитки
        //--
        if (((ball.Y + ball.Radius) >= tY)
            && (ball.Y <= (tY + APELSERG.CONFIG.SET.TileHeight))
            && ((ball.X + ball.Radius) >= tX)
            && ((ball.X - ball.Radius) <= (tX + APELSERG.CONFIG.SET.TileWidth))
            && (ball.DirY > 0)) {

            ball.Y = tY - ball.Radius;
            ball.DirY *= -1;
            tileKick = true;
        }

        //-- удар в левый бок плитки
        //--
        if ((ball.Y >= tY)
            && (ball.Y <= (tY + APELSERG.CONFIG.SET.TileHeight))
            && ((ball.X + ball.Radius) >= tX)
            && ((ball.X + ball.Radius) <= (tX + APELSERG.CONFIG.SET.TileWidth))
            && (ball.DirX > 0)) {

            ball.X = tX - ball.Radius;
            ball.DirX *= -1;
            tileKick = true;
        }

        //-- удар в правый бок плитки
        //--
        if ((ball.Y >= tY)
            && (ball.Y <= (tY + APELSERG.CONFIG.SET.TileHeight))
            && ((ball.X + ball.Radius) >= tX)
            && ((ball.X - ball.Radius) <= (tX + APELSERG.CONFIG.SET.TileWidth))
            && (ball.DirX < 0)) {

            ball.X = (tX + APELSERG.CONFIG.SET.TileWidth) + ball.Radius;
            ball.DirX *= -1;
            tileKick = true;
        }

        if (tileKick) {

            ball.DirYSpeedUp = APELSERG.MODEL.GetRandomNumber(5);
            ball.DirXSpeedUp = APELSERG.MODEL.GetRandomNumber(7);

            APELSERG.CONFIG.PROC.Points += tile.Point;

            tiles.splice(n, 1);
            break;
        }
    }

    if (tileKick) {
        APELSERG.CONFIG.PROC.Tiles = APELSERG.MAIN.CloneObj(tiles);
    }

    return tileKick;
}

//===
// Отскок от ракетки
//===
APELSERG.MODEL.RacketBallKickback = function () {

    var racketKick = false;

    var ball = APELSERG.CONFIG.PROC.Ball;
    var racket = APELSERG.CONFIG.PROC.Racket;

    if (((ball.Y + ball.Radius) >= racket.Y)
        && ((ball.Y + ball.Radius) <= (racket.Y + racket.Height))
        && ((ball.X + ball.Radius) >= racket.X)
        && ((ball.X - ball.Radius) <= (racket.X + racket.Width))
        && (ball.DirY > 0)) {

        ball.Y = racket.Y - ball.Radius;
        ball.DirY *= -1;

        APELSERG.CONFIG.PROC.Points += (10 - (APELSERG.CONFIG.SET.RacketWidth / APELSERG.CONFIG.SET.BallSize)) + (APELSERG.CONFIG.PROC.Step * APELSERG.CONFIG.SET.Speed);

        ball.DirXSpeedUp = APELSERG.MODEL.GetRandomNumber(5);
        ball.DirYSpeedUp = APELSERG.MODEL.GetRandomNumber(5);

        if (ball.X <= (racket.X + APELSERG.CONFIG.SET.BallSize) || ball.X >= (racket.X + racket.Width - APELSERG.CONFIG.SET.BallSize)) { //-- удар в бок ракетки
            ball.DirXSpeedUp += 5;
            ball.DirYSpeedUp += 2;
        }

        if (ball.DirXSpeedUp > ball.DirYSpeedUp)
        {
            ball.DirXSpeedUp *= -1;
        }

        racketKick = true;
    }

    return racketKick;
}

//===
// Сместить ракетку влево
//===
APELSERG.MODEL.RacketShiftLeft = function () {

    var racket = APELSERG.CONFIG.PROC.Racket;

    if (racket.X > 0) {
         racket.X -= racket.MoveX;
    }
}

//===
// Сместить ракетку вправо
//===
APELSERG.MODEL.RacketShiftRight = function () {

    var racket = APELSERG.CONFIG.PROC.Racket;

    if((racket.X + racket.Width) < (APELSERG.CONFIG.PROC.CanvaID.width - 0)) {
         racket.X += racket.MoveX;
    }
}
