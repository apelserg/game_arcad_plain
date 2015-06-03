"use strict";

//===
// Полная отрисовка
//===
APELSERG.CANVA.CourtRewrite = function () {
    
    var ctx = APELSERG.CONFIG.PROC.Ctx;

    //-- Поле
    //--
    if (APELSERG.CONFIG.PROC.RedCnt > 0) {
        ctx.fillStyle = 'red';
        APELSERG.CONFIG.PROC.RedCnt--;
    }
    else {
        ctx.fillStyle = 'gray';
    }
    ctx.fillRect(0, 0, APELSERG.CONFIG.PROC.CanvaID.width, APELSERG.CONFIG.PROC.CanvaID.height);

    //-- Мяч
    //--
    APELSERG.CANVA.BallRewrite(ctx);
     
    //-- Ракетка
    //--
    APELSERG.CANVA.RacketRewrite(ctx);
    
    //-- Плитки
    //--
    var tiles = APELSERG.CONFIG.PROC.Tiles;
    for (var n = 0 in tiles) {
        APELSERG.CANVA.TileRewrite(ctx, tiles[n]);
    }

    //-- Пауза
    //--
    if (APELSERG.CONFIG.PROC.GamePause && !APELSERG.CONFIG.PROC.GameStop) {
        APELSERG.CANVA.TextRewrite(ctx, APELSERG.LANG.GetText("PAUSE"));
    }

    //-- Стоп
    //--
    if (APELSERG.CONFIG.PROC.GameStop && APELSERG.CONFIG.PROC.Step < APELSERG.CONFIG.SET.Cycles) {
        APELSERG.CANVA.TextRewrite(ctx, APELSERG.LANG.GetText("LABEL_LEVEL") + " : " + (APELSERG.CONFIG.PROC.Step + 1).toString());
    }
    if (APELSERG.CONFIG.PROC.GameStop && APELSERG.CONFIG.PROC.Step == APELSERG.CONFIG.SET.Cycles) {
        APELSERG.CANVA.TextRewrite(ctx, APELSERG.LANG.GetText("GAME_OVER"));
    }

    //-- Инфо
    //--
    if (APELSERG.CONFIG.PROC.Step != 0) {
        APELSERG.CANVA.InfoRewrite(ctx);
    }
}

//===
// Мяч
//===
APELSERG.CANVA.BallRewrite = function (ctx) {

    var ball = APELSERG.CONFIG.PROC.Ball;

    ctx.beginPath();
    ctx.arc(ball.X, ball.Y, ball.Radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#E6E6E6';
    ctx.fill();
}


//===
// Ракетка
//===
APELSERG.CANVA.RacketRewrite = function (ctx) {

    var racket = APELSERG.CONFIG.PROC.Racket;

    ctx.fillStyle = 'darkblue';
    ctx.fillRect(racket.X, racket.Y, racket.Width, racket.Height);
}

//===
// Плитка
//===
APELSERG.CANVA.TileRewrite = function (ctx, tile) {

    var fontHight = APELSERG.CONFIG.SET.BallSize;

    var xR = (tile.Col - 1) * APELSERG.CONFIG.SET.TileWidth;
    var xL = APELSERG.CONFIG.SET.TileWidth;
    var yR = (tile.Row - 1) * APELSERG.CONFIG.SET.TileHeight;
    var yL = APELSERG.CONFIG.SET.TileHeight;

    ctx.fillStyle = tile.Color;
    ctx.fillRect(xR, yR, xL, yL);

    ctx.font = fontHight.toString() + "px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(tile.Point.toString(), xR + fontHight, yR + fontHight);
}

//===
// Текст
//===
APELSERG.CANVA.TextRewrite = function (ctx, strText) {

    var fontHight = APELSERG.CONFIG.SET.BallSize;

    if (fontHight < 20) {
        fontHight = 20;
    }
    if (fontHight > 30) {
        fontHight = 30;
    }

    ctx.font = fontHight.toString() + "px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(strText, APELSERG.CONFIG.PROC.CanvaID.width / 2, APELSERG.CONFIG.PROC.CanvaID.height / 2);
}

//===
// Инфо
//===
APELSERG.CANVA.InfoRewrite = function (ctx) {

    var fontHight = APELSERG.CONFIG.SET.BallSize;

    var strText = APELSERG.CONFIG.SET.UserName;
    strText += "  ";
    strText += APELSERG.LANG.GetText("LABEL_LEVEL") + " : " + APELSERG.CONFIG.PROC.Step.toString();
    strText += "  ";
    strText += APELSERG.LANG.GetText("LABEL_POINTS") + " : " + APELSERG.CONFIG.PROC.Points.toString();

    ctx.font = fontHight.toString() + "px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(strText, APELSERG.CONFIG.PROC.CanvaID.width / 2, APELSERG.CONFIG.PROC.CanvaID.height - 3);
}
