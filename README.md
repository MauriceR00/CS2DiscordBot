# CS2 Discord Bot

Mit den Bot kann man ganz einfach über Discord seine CS2 und FaceIT Statistiken abfragen.

Man kann entweder allgemeine Statistiken, wie Kills, Tode, Headshot % usw., oder einzelne Stats von Waffen oder Maps.


## Setup

Um den Bot zu benutzen, muss man erstmal in der "config.json" Datei die nötigen Token eingeben.

"token" = [Discord Bot Token](https://discord.com/developers/applications)

"clientId" = Die User ID des Bots

"guildId" = Die ID des Servers

"steamId" = [Steam Web API Key](https://steamcommunity.com/dev)

"faceitId" = [FaceIT Web API Key](https://developers.faceit.com/)



Danach nurnoch die "deploy-commands.js" Datei mit den Befehl "node deploy-commands.js" ausführen, nachdem dies erledigt ist kann man den Bot mit "node index.js" starten.

Mit den Befehl "/setmainchannel" legt man den Kanal fest, in welchem man die Befehle zum abfragen der Statistiken benutzen kann.

Letztendlich muss man den Bot nurnoch mit den Befehl "/steamid <SteamID64>" die SteamID geben, wodurch automatisch auch (falls vorhanden) das FaceIT Profil gespeichert wird.



## Befehle

```
/setmainchannel      - Channel für Statistiken festlegen
/ping                - Ping vom Bot abfragen
/prune               - Anzahl X der letzten Nachrichten löschen (Berechtigung um Nachrichten zu löschen benötigt)
/cs2                 - CS2 Statistiken abfragen
/faceit              - FaceIT Statistiken abfragen
/lastmatch           - Letzte Casual Statistiken abfragen
/map                 - Statistiken einzelner Maps abfragen
/removesteamid       - Verbunenen Steam Account löschen
/steamid             - Befehl um SteamID zu verbinden
/weapon              - Statistiken einzelner Waffen abfragen
```
