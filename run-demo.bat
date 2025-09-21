@echo off
REM Spring Bootアプリケーションを起動するバッチファイル
set JAR_NAME=tool.jar

REM jarファイルがこのbatと同じディレクトリにある場合
java -jar %JAR_NAME%

REM pauseでウィンドウを閉じないようにする場合は下記を有効化
REM pause
