"use strict";

//-- Глобальные переменные
//--

var APELSERG = {};

APELSERG.MAIN = {};
APELSERG.MODEL = {};
APELSERG.CANVA = {};
APELSERG.UI = {};
APELSERG.LANG = {};
APELSERG.CONFIG = {};
APELSERG.CONFIG.SET = {};
APELSERG.CONFIG.KEY = {};
APELSERG.CONFIG.PROC = {};
APELSERG.CONFIG.RESULT = {};

//===
// старт программы (начальная прорисовка)
//===
APELSERG.MAIN.OnLoad = function () {

    //-- определить место загрузки
    //--
    window.location.protocol == "file:" ? APELSERG.CONFIG.PROC.LoadFromWeb = false : APELSERG.CONFIG.PROC.LoadFromWeb = true;


    //-- инициализация
    //--
    APELSERG.CONFIG.GetConfigOnLoad();
    APELSERG.CONFIG.GetResultOnLoad();

    //-- канва
    //--
    APELSERG.CONFIG.PROC.CanvaID = document.getElementById('APELSERG_CanvasArcad');
    APELSERG.CONFIG.PROC.Ctx = APELSERG.CONFIG.PROC.CanvaID.getContext('2d');
    APELSERG.CONFIG.PROC.CanvaID.width = APELSERG.CONFIG.SET.CourtColTileNum * APELSERG.CONFIG.SET.TileWidth;
    APELSERG.CONFIG.PROC.CanvaID.height = APELSERG.CONFIG.SET.CourtRowTileNum * APELSERG.CONFIG.SET.TileHeight;
   
    APELSERG.CONFIG.PROC.Racket = APELSERG.MODEL.GetRacket(); //-- ракетка
    APELSERG.CONFIG.PROC.Ball = APELSERG.MODEL.GetBall();  //-- мяч

    APELSERG.CONFIG.PROC.Points = 0;
    APELSERG.CONFIG.PROC.Step = 0;
    APELSERG.CONFIG.PROC.TileRows = 0;
    APELSERG.CONFIG.PROC.Tiles = APELSERG.MODEL.GetTiles(); //-- плитки

    APELSERG.CANVA.CourtRewrite();
}

//===
// Клонировать объект
//===
APELSERG.MAIN.CloneObj = function (object) {
    return JSON.parse(JSON.stringify(object));
}


//===
// Обработка нажатий клавиш
//===
window.addEventListener('keydown', function (event) {

    //-- предотвратить срабатывание при "всплытии" клика
    //--
    document.getElementById("APELSERG_InputSettings").blur();
    document.getElementById("APELSERG_InputPoints").blur();
    document.getElementById("APELSERG_InputHelp").blur();
   
    if (event.keyCode == APELSERG.CONFIG.KEY.Pause) {
        APELSERG.MAIN.Pause();
    }    
    if (event.keyCode == APELSERG.CONFIG.KEY.Space) {
        APELSERG.MAIN.Start();
    }

    if (!APELSERG.CONFIG.PROC.GameStop && !APELSERG.CONFIG.PROC.GamePause) {

        if (event.keyCode == APELSERG.CONFIG.KEY.Left) {
            APELSERG.MODEL.RacketShiftLeft();
        }
        if (event.keyCode == APELSERG.CONFIG.KEY.Right) {
            APELSERG.MODEL.RacketShiftRight();
        }
    }
});

//===
// Старт
//===
APELSERG.MAIN.Start = function () {

    //-- закрыть окна (если открыты - должны закрыться)
    //--
    if (APELSERG.CONFIG.PROC.UiSettings) {
        APELSERG.UI.ShowSettings();
    }
    if (APELSERG.CONFIG.PROC.UiPoints) {
        APELSERG.UI.ShowPoints();
    }
    if (APELSERG.CONFIG.PROC.UiHelp) {
        APELSERG.UI.ShowHelp();
    }

    //-- обработать "пробел"
    //--
    if (!APELSERG.CONFIG.PROC.UiSettings && !APELSERG.CONFIG.PROC.UiPoints && !APELSERG.CONFIG.PROC.UiHelp) {

        if (APELSERG.CONFIG.PROC.GameStop) {

            //-- новая игра - инициализация
            //--
            APELSERG.CONFIG.PROC.GameStop = false;
            APELSERG.CONFIG.PROC.GamePause = false;

            APELSERG.CONFIG.PROC.Racket = APELSERG.MODEL.GetRacket(); //-- ракетка
            APELSERG.CONFIG.PROC.Ball = APELSERG.MODEL.GetBall(); //-- мяч
            APELSERG.CONFIG.PROC.Ball.DirX = APELSERG.CONFIG.SET.Speed; //-- скорость мяча
            APELSERG.CONFIG.PROC.Ball.DirY = APELSERG.CONFIG.PROC.Ball.DirX * 3;

            //-- step - перед установкой плиток
            //--
            if (APELSERG.CONFIG.PROC.Step == APELSERG.CONFIG.SET.Cycles) {

                APELSERG.CONFIG.PROC.Points = 0;
                APELSERG.CONFIG.PROC.Step = 0;
            }

            APELSERG.CONFIG.PROC.Step++;

            APELSERG.CONFIG.PROC.TileRows = APELSERG.CONFIG.PROC.Step;
            if (APELSERG.CONFIG.PROC.TileRows > 10) {
                APELSERG.CONFIG.PROC.TileRows = 10;
            }

            APELSERG.CONFIG.PROC.Tiles = APELSERG.MODEL.GetTiles(); //-- плитки

            //-- сброс очков в последнюю очередь
            //--
            if (APELSERG.CONFIG.PROC.Step > APELSERG.CONFIG.SET.Cycles) {

                APELSERG.CONFIG.PROC.Points = 0;
                APELSERG.CONFIG.PROC.Step = 1;
            }

            APELSERG.MAIN.Animation(); //-- запуск рабочего цикла
        }
        else {
            if (APELSERG.CONFIG.PROC.GamePause) {
                APELSERG.CONFIG.PROC.GamePause = false; //-- отмена паузы
                APELSERG.MAIN.Animation(); //-- запуск рабочего цикла
            }
        }
    }
}

//===
// Пауза
//===
APELSERG.MAIN.Pause = function () {
    if (!APELSERG.CONFIG.PROC.GameStop) {
        if (APELSERG.CONFIG.PROC.GamePause) {
            APELSERG.CONFIG.PROC.GamePause = false;
            APELSERG.MAIN.Animation(); //-- запуск рабочего цикла
        }
        else {
            APELSERG.CONFIG.PROC.GamePause = true;
            APELSERG.CANVA.CourtRewrite();
        }
    }
}

//===
// Рабочий цикл таймера
//===
APELSERG.MAIN.Animation = function () {
    APELSERG.MODEL.UpdateBall(); //-- !!! окончание игры срабатывает здесь
    APELSERG.CANVA.CourtRewrite();
    if (!APELSERG.CONFIG.PROC.GameStop && !APELSERG.CONFIG.PROC.GamePause) {
        window.requestAnimationFrame(function () {
            APELSERG.MAIN.Animation();
        });
    }
}
