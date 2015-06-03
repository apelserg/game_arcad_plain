"use strict";

APELSERG.CONFIG.SET.Version = "0-1-0"
APELSERG.CONFIG.SET.LocalStorageName = "APELSERG-ArcadPlain";

APELSERG.CONFIG.SET.BallSize = 20; //-- размер шарика (в пикселях)

APELSERG.CONFIG.SET.TileHeight = 25; //-- высота базового объекта (плитки) (в пикселях)
APELSERG.CONFIG.SET.TileWidth = 50; //-- ширина базового объекта (плитки) (в пикселях)

APELSERG.CONFIG.SET.CourtColTileNum = 7; //-- ширина корта (в количестве плиток)
APELSERG.CONFIG.SET.CourtRowTileNum = 20; //-- высота корта (в количестве плиток)

APELSERG.CONFIG.SET.RacketHeight = 20; //-- BallSize
APELSERG.CONFIG.SET.RacketWidth = 100; //-- BallSize * 5, 6, 7

APELSERG.CONFIG.SET.UserName = "Noname";
APELSERG.CONFIG.SET.Lang = "EN"; //-- RU, EN
APELSERG.CONFIG.SET.Cycles = 3; //-- количество циклов для записи результата
APELSERG.CONFIG.SET.Speed = 1; //-- скорость шарика

APELSERG.CONFIG.KEY.Space = 32;
APELSERG.CONFIG.KEY.Pause = 80;

APELSERG.CONFIG.KEY.Left = 37;
APELSERG.CONFIG.KEY.Right = 39;


APELSERG.CONFIG.PROC.Ball;
APELSERG.CONFIG.PROC.Racket;
APELSERG.CONFIG.PROC.Tiles = [];

APELSERG.CONFIG.PROC.Step = 0;
APELSERG.CONFIG.PROC.Points = 0;
APELSERG.CONFIG.PROC.TileRows = 0; //-- количество рядов плиток (зависит от степа)
APELSERG.CONFIG.PROC.RedCnt = 0; //-- число циклов красного корта

APELSERG.CONFIG.PROC.GameStop = true;
APELSERG.CONFIG.PROC.GamePause = true;

APELSERG.CONFIG.PROC.UiSettings = false; //-- для синхронизации интерфейса и режима игры
APELSERG.CONFIG.PROC.UiPoints = false; //-- для показа очков
APELSERG.CONFIG.PROC.UiHelp = false; //-- для показа помощи

APELSERG.CONFIG.PROC.LoadFromWeb = false; //-- HTML загружен с сети или локального диска (надо для сохранения результатов и конфигурации)

APELSERG.CONFIG.PROC.CanvaID;
APELSERG.CONFIG.PROC.Ctx;


APELSERG.CONFIG.RESULT.Best = [];


//===
// Получить имя хранения конфигурации
//===
APELSERG.CONFIG.GetLocalStorageConfigName = function () {
    return APELSERG.CONFIG.SET.LocalStorageName + "-Config-" + APELSERG.CONFIG.SET.Version;
}

//===
// Получить имя хранения результатов
//===
APELSERG.CONFIG.GetLocalStorageResultName = function () {
    return APELSERG.CONFIG.SET.LocalStorageName + "-Results";
}

//===
// Получить результаты
//===
APELSERG.CONFIG.GetResultOnLoad = function () {

    if (APELSERG.CONFIG.PROC.LoadFromWeb) {

        var resultName = APELSERG.CONFIG.GetLocalStorageResultName();

        //-- восстановить результаты из хранилища
        //--
        if (localStorage[resultName] !== undefined) {

            APELSERG.CONFIG.RESULT.Best = JSON.parse(localStorage[resultName]);
        }
    }
}

//===
// Получить конфигурацию
//===
APELSERG.CONFIG.GetConfigOnLoad = function () {

    if (APELSERG.CONFIG.PROC.LoadFromWeb) {

        var configName = APELSERG.CONFIG.GetLocalStorageConfigName();

        //-- восстановить конфигурацию из хранилища
        //--
        if (localStorage[configName] !== undefined) {
            APELSERG.CONFIG.SET = JSON.parse(localStorage[configName]);
        }
    }
}

//===
// Сохранить результат
//===
APELSERG.CONFIG.SetResult = function () {

    if (APELSERG.CONFIG.PROC.LoadFromWeb) {

        var resultName = APELSERG.CONFIG.GetLocalStorageResultName();

        var dateCurrent = new Date();
        var dateCurrentStr = dateCurrent.toJSON().substring(0, 10);

        var resultCurrent = {};
        resultCurrent.Name = APELSERG.CONFIG.SET.UserName;
        resultCurrent.Points = APELSERG.CONFIG.PROC.Points;
        resultCurrent.Date = dateCurrentStr;

        APELSERG.CONFIG.RESULT.Best.push(resultCurrent);

        //-- выбрать лучшие результаты (10)
        //--
        var topBest = [];
        var cntBest = 0;
        while (true) {
            var maxValue = 0;
            var maxIdx = -1;
            for (var n = 0 in APELSERG.CONFIG.RESULT.Best) {
                if (APELSERG.CONFIG.RESULT.Best[n] !== undefined) {
                    if (APELSERG.CONFIG.RESULT.Best[n].Points >= maxValue) {
                        maxValue = APELSERG.CONFIG.RESULT.Best[n].Points;
                        maxIdx = n;
                    }
                }
            }
            if (maxIdx >= 0) {
                topBest.push(APELSERG.CONFIG.RESULT.Best[maxIdx]);
                APELSERG.CONFIG.RESULT.Best.splice(maxIdx, 1);
                cntBest++;
            }
            if (cntBest >= 10 || maxIdx < 0) {
                break;
            }
        }
        APELSERG.CONFIG.RESULT.Best = topBest;
        localStorage[resultName] = JSON.stringify(APELSERG.CONFIG.RESULT.Best);
    }
}

//===
// Сброс результата
//===
APELSERG.CONFIG.ResetResult = function () {

    var resultName = APELSERG.CONFIG.GetLocalStorageResultName();

    localStorage.removeItem(resultName);

    APELSERG.CONFIG.RESULT.Best = [];

    if (APELSERG.CONFIG.PROC.UiPoints) {
        APELSERG.UI.ShowPoints();
    }
}

//===
// Сброс конфигурации
//===
APELSERG.CONFIG.ResetConfig = function () {

    var configName = APELSERG.CONFIG.GetLocalStorageConfigName();

    localStorage.removeItem(configName);

    if (APELSERG.CONFIG.PROC.UiSettings) {
        APELSERG.UI.ShowSettings();
    }

    document.getElementById('APELSERG_DivCanvas').innerHTML = APELSERG.LANG.GetText('RELOAD_PAGE');
}
