(Diese Readme wurde mit *pandoc* aus dem Dokumentations-Latex Code erstellt. Die eigentliche Doku liegt in '/doc/Ausarbeitung.pdf')

* * * * *

** Im Rahmen des Softwareprojekts „Anwendungen von Algorithmen“ haben
wir uns damit beschäftigt eine browserbasierte Anwendung zu entwickeln,
die es auf spielerische Weise ermöglicht Punkte in eine allgemeine Lage
zu versetzen. Die allgemeine Lage versteht sich hierbei als eine
Anordnung der Punkte, in welcher deren Positionierung zueinander
möglichst keine Sonderfälle einnimmt. So entsprechen zum Beispiel
Anordnungen, bei denen sich mehrere Punkte auf einer Linie oder einem
Kreis befinden einem Sonderfall. Neben der Umsetzung dieser Kriterien
haben wir uns vor allem mit einem Kriterium beschäftigt, welches die
Höhe aller Punkte und Schnittpunkte zu den umliegenden Kanten
beschreibt. So geht es in der Anwendung hauptsächlich darum, all diese
Höhen möglichst groß zu gestalten. Zur Orientierung dient hierbei die
kleinste vorkommende Höhe, die zusätzlich grafisch dargestellt wird.**

* * * * *

Einleitung
==========

Der Titel des Softwareprojekts lautet "‘Punkte in allgemeiner Lage"’,
welches eine oft zitierte Eingangsvorraussetzung, gerade im Bereich von
geometrischen Problemstellungen, darstellt. Ziel dieses Projekts war es,
ein Spiel zu entwickeln, welches es einem Benutzer ermöglicht, Punkte in
*allgemeine Lage* zu verschieben und *schöne* Graphen zu zeichnen.\
Was genau nun eine allgemeine Lage eigentlich ist und was unter schönen
Graphen zu verstehen ist, soll im Folgenden kurz ausgeführt werden.

Allgemeine Lage
---------------

[sec:Allgemeine~L~age] Sei $P$ eine Menge von Punkten. Wir sagen $P$ ist
in allgemeiner Lage, wenn die folgenden drei Kriterien erfüllt sind:

1.  Keine zwei Punkte aus $P$ haben die selbe $x$-Koordinate.

2.  Keine drei Punkte aus $P$ liegen auf einer gemeinsamen Gerade.

3.  Keine vier Punkte aus $P$ liegen auf einem gemeinsamen Kreis.

Während die ersten zwei Kriterien in der Regel leicht von einem Spieler
erkannt werden, stellt das dritte Kriterium eine etwas schwerer zu
erkennende Einschränkung dar.\
Jedoch ist leicht zu einzusehen, dass auch mit der dritten Bedingung
noch keine ausreichende Umgebung für ein interessantes Spiel geschaffen
ist. Zum einen stellt das alleinige Anordnen von Punkten auf einer
Leinwand keine sehr große visuelle Befriedigung dar, zum anderen stellt
sich die Frage welche Güte einem gefundenen Arrangement gegeben werden
soll. Ein Spiel wird interessanter, wenn es einem die Möglichkeit gibt
sich zu verbessern. Es sollte also davon abgesehen werden, einfach nur
ein ’Bestanden’ anzuzeigen, sollte eine gültige Konfiguration von
Punkten gefunden worden sein. Aber wann ist eine Punktlage besser als
eine andere, oder anders: welches praktikable Optimierungskriterium
führt nicht gleich zu einer leicht ’geschüttelten’ Gitteranordnung?\
Es ergibt sich, dass die oben aufgelisteten Kriterien sehr natürlich auf
Graphen projiziert werden können, welche zugleich eine visuell
interessantere Struktur besitzen, wie auch ein zugänglicheres
Benotungssystem zulassen. Hieraus resultiert das Spielprinzip schöne
Graphen zu zeichnen.

Schöne Graphen
--------------

Ist $V$ eine beliebige Menge von Elementen (Knoten) und
$E\subseteq\binom{V}{2}$[^1] (Kanten) eine binäre Relation, so wird
$G=(V,E)$ als Graph bezeichnet.\
Ist $V$ nun eine Menge von Punkten im $\mathbb{R}^2$ und bezeichnet $E$
die Relation "‘durch eine Strecke verbunden"’ so ergibt sich eine
graphische Interpretation von $G$. Wenn wir im Folgenden von "‘Graphen"’
sprechen, ist damit immer die visuelle Interpretation von Punkten im
$\mathbb{R}^2$, mit Strecken zwischen diesen, gemeint. Wenn wir von
"‘Punkten"’ des Graphen sprechen, ist dies als Synonym für deren
Funktion als Knoten in $G$ gemeint. Analog bezeichnen wir Kanten von $G$
als Strecken.\
Alle Kriterien aus [sec:Allgemeine~L~age] können direkt auf $V$
angewandt werden. Als Optimierungskriterium dient jedoch eine andere
Eigenschaft des Graphen: Ein Spieler bekommt einen Graphen mit fester
Anzahl an Punkten sowie Strecken. Die Punkte sollen frei verschiebbar
sein, jedoch sollen die Strecken zwischen ihnen erhalten bleiben (sich
also dynamisch mitbewegen). Aufgabe des Spielers ist es nun, eine
Konfiguration von $V$ zu finden, sodass der Abstand eines Punktes zu
einer nichtinzidenten Kante maximiert wird. Hierbei ist zu beachten,
dass am Kreuzungspunkt zweier Kanten ein neuer Punkt entsteht, welcher
zwar nicht direkt bewegt werden kann (lediglich durch das Verschieben
der Endpunkte der kreuzenden Kanten), jedoch durch einen eventuell
geringen Abstand den Punktestand des Spielers herabsenkt.\
Das Spielprinzip ist somit klar: je geringer der kleinste Abstand eines
Punktes zu einer Kante ausfällt, desto weniger Punke erhält der Spieler.

Datenstrukturen & Grundlegendes
===============================

Javascript
----------

Da es sich um ein webbasiertes Browserspiel handeln sollte, entschieden
wir uns für Javascript als Programmiersprache. Das Objektmodell von
Javascript weicht deutlich von dem von Java ab. Im Gegensatz zum
klassisch objektorientierten Java gibt es in Javascript keine Klassen.
Vielmehr werden Prototypeobjekte verwendet, die Gemeinsamkeiten
abstrahieren. Andere Obekte verweisen auf diese Prototypen und können
dadurch deren Methoden verwenden. Um die Syntax von Java aufzugreifen
beschreiben wir die Prototypeobjekte als Klassen und Objekte die auf
einen gemeinsamen Prototypen verweisen als Instanzen eines Prototyps.
Bezeichnungen wie Klassen- bzw. statische Methoden ergeben sich aus
dieser Konvention.

Einführung der arithmetischen Unschärfe
---------------------------------------

Bedingt durch die endliche Darstellung von Fließkommazahlen im Prozessor
waren wir gezwungen eine arithmetische Unschärfe einzuführen.\
Wird zum Beispiel der Ausdruck $0.3-0.1$ berechnet, so wird anstelle des
exakten Ergebnisses von $0.2$ als nächstbeste Näherung:

    js> 0.3-0.1
    0.19999999999999998

zurückgeliefert. Die Differenz des exakten Wertes von der Näherung
beläuft sich auf

    js> 0.2-(0.3-0.1)
    2.7755575615628914e-17

Sie weicht also um die Größenordung $10^{-16}$ von der der Operanden ab.
Wir haben uns entschieden die arithmetische Unschärfe auf $10^{-10}$ (im
folgenden auch Epsilon oder Epsilonumgebung  – wenn die Differenz von
zwei Werten betrachtet wird  – genannt) zu setzen. Um auf der sicheren
Seite zu sein aber gleichzeitig eine unnötig große Toleranz zu vermeiden
haben wir die Fehlermarge ca. 6 Größenordnungen oberhalb der
arithmetischen Abweichung festgelegt.

Punkte und Vektoren
-------------------

Als grundlegende Datenstruktur wurden Vektoren eingeführt. Diese haben
ihre zwei kartesischen Koordinaten als Attribute und verfügen über die
grundlegenden, aus der Mathematik bekannten, Eigenschaften und
Funktionalitäten (Vektoraddition/-subtraktion, Multiplikation mit einem
Skalar, Skalarprodukt, etc.).

### Funktionen

Die folgenden Methoden sind Instanzfunktionen eines Vektors,
vergleichbar mit Objektmethoden in Java.

[font=]

1.add(v2) Addiert die Vektoren 1 und 2.

1.degreesTo(v2) Berechnet den Winkel zwischen den Vektoren 1 und 2.

1.distance(v2) Berechnet die euklidische Distanz zwischen 1 und 2 (als
Ortsvektoren).

1.equals(v2) Betragsweiser Vergleich der Vektoren, wobei diese nicht
exakt übereinstimmen müssen sondern in Epsilonumgebung zueinander liegen
können.

.length() euklidische Norm des Vektors .

.moveTo(coordX,coordY) Ändert die Koordinaten des Vektors in die
übergebenen ab.

.toString() Erzeugt einen String, z.B.: (x=1, y=1).

Die folgenden Funktionen sind Klassenfunktionen der Vektoren,
vergleichbar mit statischen Methoden in Java.

[font=]

(s,v) Erzeugt aus v einen neuen Vektor, indem dessen Einträge mit s
multipliziert werden.

(v1,v2) Das Standardskalarprodukt der beiden Vektoren.

​(p) Konvertiert einen Vektor zu einem Punkt.

Ohne groß in ihrer programmatischen Funktionalität von den Vektoren
abzuweichen, wurden Punkte eingeführt. Es stellte sich heraus, dass
beide Strukturen ihre Notwendigkeit hatten (der Abstand zweier Punkte
sollte als Vektor und nicht als Punkt ausgedrückt werden, wohingegen ein
Graph als Tupel von Mengen von Verbindungskanten und Punkten, nicht
Vektoren dargestellt wird). Im Hinblick auf ihre spätere Verwendung
können Punkte inzidente Kanten abspeicheren und wurden aus diesem Grund
um die folgende Instanzmethode erweitert.

[font=]

1.isAdjacentTo(pt2) Iteriert durch die inzidenten Kanten von pt1 und
überprüft durch (siehe Kantenfunktionen) ob pt2 in einer von diesen
adjazent zu pt1 ist.

Kanten
------

Die Datenstruktur repräsentiert eine Strecke in einem kartesischen
Koordinatensystem, als auch eine Kante in einem Graph. Wir wählten
aufgrund ihrer arithmetischen Vorzüge die Geradendarstellung in
*Hessescher Normalform*. In ihr wird eine Gerade $g$ dargestellt durch
ihren *Normaleneinheitsvektor* $\widehat{n}$, sowie durch ihren Abstand
$d$ zum Koordinatenursprung. Jeder Punkt $p=(x,y)$ auf der Geraden
erfüllt somit die Gleichung:

$$\begin{aligned}
  \widehat{n}\vec{p}-d=0  \end{aligned}$$

wobei $\vec{p}$ den Ortsvektor von $p$ bezeichne.\
Zusätzlich zu $\widehat{n}$ und $d$ speichert die Datenstruktur noch
ihre zwei Endpunkte als Attribute.

### Funktionen

besitzt die folgenden Instanzfunktionen.

[font=]

.reload() Aktualisiert für eine Kante ihren Normaleneinheitsvektor,
sowie ihren Abstand zum Koordinatenursprung. Wird z.B. nach Verschieben
eines Endpunktes aufgerufen.

.length() Liefert die Länge einer Kante zurück.

.getY(x) Liefert die $y$-Wert einer Geraden an Position

.getLeft() Liefert den Endpunkt einer Kante mit geringerer
$x$-Koordinate. (Haben beide Endpunkte die selbe $x$-Koordinate so
liefert .getLeft() einen anderen Endpunkt zurück als .getRight()).

.getRight() Analog zu oben.

.getAdjacent(pt) Falls ein Endpunkt von ist wird der andere Endpunkt von
ausgegeben, ansonsten .

.projectionToLine(pt) Liefert die Projektion eines Punktes auf die
Gerade durch .

.projectionToEdge(pt) Analog zu , liefert jedoch sollte die Projektion
nicht in liegen.

.distanceToLine(pt) Liefert den Abstand eines Punktes zu der Geraden die
verläuft.

.signedDistanceToLine(pt) Wie die vorherige Funktion, jedoch mit
Vorzeichen abhängig von der Halbebene auf der liegt.

.lineContains(pt) Gibt einen Boolean zurück, der angibt ob der Punkt auf
der Geraden durch e liegt. Das ist der Fall, wenn der Punkt eine
Entfernung zur Geraden hat, die kleiner Epsilon ist.

.contains(pt) Wie die vorherige Funktion, zusätzlich wird hier auch
überprüft ob der Punkt auf der Kante selbst liegt. Dies wird überprüft,
indem die Distanzen von zu den Endpunkten der Kante ermittelt werden.
Ist die Differenz aus der Summe der Distanzen und der Länge der Kante
kleiner Epsilon so wird ausgegeben sonst . Somit wird also getestet ob
der Punkt in dem Schnitt der Fläche aus .lineContains(pt) und einer
Ellipse, deren Brennpunkte die Endpunkte der Kante sind und deren
Distanz von einem Scheitelpunkt zu dem nächsten Brennpunkt gleich
Epsilon ist, liegt. Uns erschien diese Implementierung als einfachste
Lösung, da keine Sonderfälle behandelt werden müssen und für
.contains(pt) .lineContains(pt) nur minimal erweitert werden muss. In
der Praxis kam es durch die geringe Größe der Epsilonumgebung auch nie
zu Problemen die auf die ungleichmäßige Form der Ellipse zurückzuführen
wären.

1.lineIntersection(e2) Mit dieser Funktion werden die Schnittpunkte von
zwei Geraden, die durch 1 und 2 verlaufen berechnet, falls diese
existieren. Dabei werden die beiden Sonderfälle von identischen und
parallelen Geraden als erstes behandelt. Hierzu wird zunächst überprüft
ob die Normalen der Geraden linear abhängig sind, ist dies der Fall so
sind sie mindestens parallel zueinander, haben beide Geraden zusätzlich
den gleichen Abstand zum Ursprung (bzw. liegen die Abstände in einer
Epsilonumgebung zueinander), so sind sie identisch. In diesen Fällen
wird von der Funktion ein String zurückgegeben (*“identical\_lines”*
bzw. *“parallel\_lines”*). Andernfalls ist die $y$-Koordinate des
Schnitpunkts durch
$y = \frac{d1 * n2_x - d2 * n1_x}{n1_y * n2_x - n1_x * n2_y}$ gegeben.
Dabei ist $ni_j$ die $j$-Koordinate des Normalenvektors von $i$,
$i\in\{$1,2$\},\ j\in\{x,y\}$.

1.edgeIntersection(e2) Wie die vorherige Funktion, zusätzlich wird
überprüft ob die Kanten den Schnittpunkt auch enthalten, wenn ja wird er
zurückgegeben, wenn nicht ist die Rückgabe .

Annotations
-----------

Die Ergebnisse der Algorithmen können neben numerischen Werten und Text
auch graphische Elemente enthalten. Diese Ergebnisse müssen die Form
eines definierten Annotations Objektes haben und werden aus den
Ergebnissen der Algorithmen vom Controller an die GUI durchgereicht. Ein
solches Objekt muss folgende Form haben:

    var obj = {
        points: Points-Array,
        lines: Edge-Array,
        lineSegments: Edge-Array,
        circles: Circle-Array,
        angles: Angle-Array
    };

Aufbau / Architektur
====================

Die grundsätzliche Architektur dieser Anwendung ist in folgendem
UML-Sequenzdiagramm beschrieben:\
\
![image](Bilder/SequenceArchitecture)\
\
Hierbei stellen `’points-change’` und `results` Nachrichten dar, die
Daten enthalten. `calculate(...)` und `showResults(...)` hingegen sind
Methodenaufrufe der jeweiligen Objekte. Es gibt drei Klassen von
Akteuren: *Webworker*, den zentralen *Controller* und die *GUI*, die
grafische Benutzerschnittstelle.

Webworker
---------

Um aus Benuztersicht die Ansprechbarkeit der Anwendung zu optimieren,
haben wir uns dafür entschieden, die Berechnung der Algorithmen in
Webworker auszulagern. Webworker ermöglichen es, in Javascript parallele
Berechnungen ausführen zu lassen. So finden diese Berechnungen im
Hintergrund statt, während die GUI weiterhin ansprechbar bleibt. Beim
Erstellen eines Webworkers wird ihm der auszuführende Code in Form eines
Pfades zu einem Skript übergeben. Da ein Webworker vom Hauptthread
abgeschottet läuft und seinen eigenen Namensraum für Variablen besitzt,
erfolgt jegliche Kommunikation über Nachrichten, welche neben Text auch
ganze Objekte enthalten können. Auf Anfrage wendet ein Webworker den im
Skript enthaltenen Algorithmus an und sendet seine Ergebnisse zurück an
den Controller. Die Anfrage besteht aus einer Nachricht, welche ein
Graphobjekt und einen Namen enthält.

Controller
----------

Der Controller(*AlgLageController.js*) ist einerseits dafür zuständig,
die Algorithmen aufzurufen, andererseits um eine Brücke zwischen GUI und
den Webworkern zu bauen, also Ergebnisse weiterzuleiten und
Benutzereingaben zu verarbeiten. Ursprünglich sollte der Status der
Anwendung lediglich im Controller gespeichert sein, allerdings wurde
auch hier aus Gründen der Benutzbarkeit ein Teil des Status in die GUI
ausgelagert. Beim Erstellen eines Controllerobjektes wird ein GUIobjekt
übergeben, um dem Controller direkten Zugriff auf Elemente und Methoden
der GUI zu ermöglichen. Im Gegensatz dazu funktioniert die Kommunikation
mit den Workern asynchron über Nachrichten. Der Controller meldet sich
mit `$.subscribe(’points-change’, ...)` über jQuery beim Event
`points-change` an. Dieses Event wird von der GUI gefeuert und zwar
immer dann, wenn Punkte verschoben wurden. Da der eigentliche
Koordinatenstatus der Punkte des Graphen in der GUI gespeichert ist,
muss der Controller seinen internen Graphen mit den neuen Punkten der
GUI updaten (`graph.points = gui.getPoints()`). Dann wird mit
`calculateAlgos()` die Neuberechnung der Algorithmen gestartet. Die
Antworten der Worker werden in `handleResponse(event)` behandelt. Beim
Hinzufügen eines Algorithmus wird das Ereignis, dass der Worker eine
Nachricht postet mit dieser Methode verknüpft
(`worker.onmessage = function(event) {handleResponse(event);}`) wobei
`event` das Antwortobjekt darstellt. Die Behandlung der Antwort
beschränkt sich auf das Weiterleiten der in der Antwort enthaltenen
Daten (`name`, `score`, `info`, `annots`) an die GUI.

### Graphen

Um dem Controller einen neuen Graph zu übergeben kann entweder direkt
ein Graph mit `setGraph(graph)` übergeben werden, welcher dann sofort
geladen wird, oder man fügt ein neues *Level* mit
`addLevel(name, graph)` hinzu, wodurch der Graph unter dem übergebenen
Namen im Controller abgespeichert wird. Mit `loadLevel(name)` wird ein
vorher unter *name* abgespeicherter Graph in die Ansicht geladen.

### Algorithmen

Algorithmen müssen in einer Datei als Skript abgelegt sein, um mit
`addAlgo(name, path)` dem Controller hinzugefügt werden zu können. Beim
Hinzufügen eines Algorithmus wird ein neuer Webworker erstellt und eine
Referenz auf ihn in einer Tabelle *algos* abgelegt. Zusätzlich wird eine
Farbe für die Anzeige der Ergebnisse des Algorithmus gesetzt und das
*ready*-Attribut des Algorithmus auf *true* gesetzt (das bedeutet, dass
der dem Algorithmus zugehörige Webworker gerade nicht beschäftigt ist).
Zuletzt wird mit `gui.initAlgoBox(name, color)` in der GUI eine neue Box
für die Anzeige der Ergebnisse des Algorithmus eingefügt. Die Methode
`calculateAlgos()` iteriert über alle mit `addAlgo(..)` hinzugefügten
Algorithmen und sendet eine Neuberechnungsaufforderung an diejenigen
Webworker, die nicht schon neuberechnen und auch in der GUI vom Benutzer
als sichtbar eingestellt wurden.

GUI
---

### Aufbau

Die GUI ist die Brücke zwischen Controller und Benutzer. Sie nimmt
Benutzereingaben entgegen und gibt Statusinformationen des Programms
graphisch aus. Die Darstellung der Graphen wird durch Einbindung von
JSXGraph verwirklicht. JSXGraph stellt Werkzeuge zur Anzeige,
Modifikation und Verwaltung von graphischen Objekten zur Verfügung.
Neben der Grafikanzeige übernimmt die GUI auch die Anzeige von
Textinformationen (wie z.B. den Score) und von Optionsmenüs (die Menüs
selbst werden von Bootstrap erzeugt). Die GUI erhält über
`initGraph(graph)` eine Referenz auf den Graphen des Controllers. Um die
eigentliche Anzeige und Interaktivität der Punkte kümmert sich JSXGraph.
Beim Initialisieren eines neuen Graphen wird `drawGraph(graph)`
aufgerufen, welches die Punkte aus dem Graphobjekt liest und das `board`
(also den JSXGraph Anzeigebereich) mit den entsprechenden graphischen
Objekten füllt. Dabei werden an die erzeugten Objekte Eventhandler
angebracht, die beim Eintreten einer Benuztereingabe (also dem Klicken
und Verziehen von Objekten) an den Controller mit
`$.publish(’points-change’)` signalisieren, dass sich der Zustand des
Graphen verändert hat. Dieser wird daraufhin mit der Methode
`getPoints()` der GUI die aktuellen Koordinaten abfragen und sie an die
Webworker weiterleiten.

### Methoden

Hier werden die wichtigsten Methoden der GUI dokumentiert.

##### `initGraph(graph)`

Zum Hinzufügen der Referenz auf den Graph des Controllers. Darüberhinaus
wird hierüber der Bestwert initialisiert und der Graph gezeichnet.

##### `getPoints()`

Simpler getter für die Punkte des Graphen.

##### `setPoints(points)`

Hiermit werden die Punkte eines bereits initialisierten Graphen
entsprechend der übergebenen Punktkoordinaten neu angeordnet. Die
Struktur (also die Kanten) des Graphen bleibt bestehen.

##### `drawGraph()`

Die Punkte und Kanten des `graph` werden dem JSXBoard hinzugefügt.
Referenzen auf die Objekte liegen in `boardPoints` und `boardEdges`. Bei
jedem Aufruf von `drawGraph()` werden die bisher in diesen Arrays
enthaltenen Objekte vom `board` gelöscht und neu erstellt. Das Aufrufen
dieser Methode ist nur einmal nach dem Initalisieren des Graphens
notwendig, um die weitere Anzeige kümmert sich das JSXGraph Framework.
Jedem graphischen Objekt wird ein Eventhandler hinzugefügt, der mit
einem Timer verknüpft, bei Mausklicks das Event `’points-change’` in der
Frequenz des Timers feuert. Hier geschieht auch die Bereichsabfrage, die
das Verschieben der Punkte und Strecken auf einen bestimmten Rahmen (den
Bereich des Rechtecks zwischen (0,0) und (`settings.maxX`,
`settings.maxY`) ) einschränkt. Der Eventhandler der Kanten führt
zusätzlich ein `Edge.reload()` auf der verschobenen Kante und allen
inzidenten Kanten aus.

##### `overdraw(object, algoName, color)`

Dasselbe wie `draw(...)` nur mit einem vorherigen Löschen aller
Annotationen des jeweiligen Algorithmus.

##### `draw(object, algoName, color)`

Hiermit können unabhängig vom Graphen Annotations gezeichnet werden. Die
Annotations werden in eine eigene, von `algoName` abhängige Lage
gezeichnet. `obj` muss dabei ein Annotationsobjekt sein.

##### `eraseAllAnnotations()`

Jegliche Annotations aller Algorithmen werden entfernt.

##### `eraseAnnotations(algoName)`

Nur die Annotations, die zuvor unter `algoName` gezeichnet wurden,
werden gelöscht.

##### `initAlgoBox(algoName, color)`

Mit dieser Methode fügt man der Weboberfläche eine neue Anzeigebox für
den Algorithmus mit Namen `algoName` hinzu und speichert für ihn eine
Farbe ab, in der die Annotations angezeigt werden.

##### `setAlgoBoxLoading(algoName)`

Hiermit wird die AlgoBox des zugehörigen Algorithmus mit Namen
`algoName` mit einer Ladeanimation versehen. Diese Animation wird wieder
entfernt mit `refreshAlgoBox(...)`.

##### `refreshAlgoBox(algoName, score, info, annots, color)`

Wird benutzt, um die Ergebnisse eines Algorithmus anzuzeigen. Der Score
(`score`), zusätzliche Informationen (`info`), Annotations (`annots`)
werden geupdatet. Optional kann auch die eigentliche Farbe der
Annotations eines Algorithmus hier überschrieben werden. Von der AlgoBox
des zugehörigen Algorithmus mit Namen `algoName` wird die mit
`setAlgoBoxLoading(...)` hinzugefügte Ladeanimation entfernt.

##### `addLevelToNav(levelName)`

Dient zum Hinzufügen eines bereits mit `addLevel(levelName)`
hinzugefügten Levels zur Weboberfläche im Dropdownmenü.

##### `changePageHeader(text)`

Die Überschrift der Weboberfläche wird geändert.

##### `showHighscore(data)`

Wird aufgerufen, wenn eine Antwort vom Highscore-Server erfolgt ist. Die
Funktion leert dann zunächst die obere Bestenliste und füllt diese mit
den neuen Werten.

##### `clearHighscore()`

Leert die Bestenliste nur (für den Fall, dass kein Highscore vorliegt).

##### `setHighscoreVisibility(visible)`

Macht alle Elemente auf der Seite unsichtbar/sichtbar, die mit der
Bestenliste zusammenhängen. Sie wird für die Custom-Levels benötigt, da
diese kein Highscore haben.

##### `showGraph()`

Der aktuell angezeigte Graph wird zu in der GraphTextArea genannten
textarea serialisiert dargestellt.

##### `getGraph()`

Der im Textfeld der Weboberfläche eingegebene Text wird mit
`parseGraph(...)` eingelesen, als neues Level *Custom ’\#’* hinzugefügt
und im Anzeigebereich angezeigt.

##### `isActive(algoName)`

Gibt zurück, ob sich der Algorithmus mit Namen `algoName` gerade bei der
Berechnung befindet.

##### `checkTmpBestval(val)`

Speichert den aktuellen Graphen als bisher bestes Ergebnis ab, falls
`val` den bisherigen bestwert übertrifft. Die Punkte des Graphen werden
dabei in `bestPoints` abgelegt.

Speicherung der Bestwerte
-------------------------

In der Anwendung besteht die Möglichkeit einen erreichten Punktestand
mit einem Formular in einer Bestenliste zu speichern. Dieser wird, wenn
er zu den drei höchsten eines Levels gehört, danach in der Liste
angezeigt. Zusätzlich wird zu einem Punktestand der Name des Benutzers
angezeigt und es besteht die Möglichkeit, die Punkte auf die Positionen
zu setzten, mit welchen der Punktestand erreicht wurde. Wie die hierfür
benötigten Daten gespeichert und angezeigt werden soll nun genauer
erläutert werden.\
Um die Speicherung der Daten kümmert sich eine Datenbank, welche hierfür
mit einer Tabelle versehen wurde. Diese enthält die Spalten *hid*,
*levname*, *name*, *score* und *points*. Hierbei ist *hid* ein
eindeutiger Schlüssel eines jeden Eintrags, *levname* gibt an zu welchem
Level ein Eintrag gehört, *name* beinhaltet den Namen des Benutzers,
*score* entspricht dem erreichten Punktestand und in *points* werden die
Positionen der Punkte in einem String gespeichert. Da beim Anzeigen der
Punktpositionen eines Bestwertes der Graph bereits geladen ist und sich
die Reihenfolge der Punkte niemals ändert, genügt es nur die Positionen
der jeweiligen Punkte zu speichern. Beim Klick auf den Pfeil werden dann
die Punkte im Graph auf die gespeicherten Positionen verschoben.\
Damit die Bestenliste auch funktionsfähig ist, wenn die Anwendung von
einer lokalen Datei oder einem anderen Server ausgeführt wird und
unabhängig von der Datenbank bleibt wurde zum Speichern der Daten eine
Technik namens „JSON-P“ ausgewählt. Hiermit ist es möglich Daten von
einem Server zu laden, der sich nicht auf der gleichen Domain befindet.
Das ist mit aktuellem Javascript normalerweise nicht möglich.\
Zum Laden der Punktestände wird eine PHP-Datei dynamisch wie folgt als
Script in die HTML-Seite eingebunden:\

    <script
     src="http://DB_SERVER/getscore.php">
    </script>

Die Datei sieht dabei zum Beispiel wie folgt aus:

    getResults('{
        "Haus vom Nikolaus": [
            {
                "name": "Wohoow",
                "score": "3.71269",
                "points": "[[7.34, 3.71], ...]"
            }, {
                "name": "Gut?",
                "score": "3.63707",
                "points": "[[0.18, 1.12], ...]"
            }, {
                "name": "mhh",
                "score": "2.58643",
                "points": "[[0,0], [11.64, 2.69], ...]"
            }');
        ]
    }

Durch das Einbinden der Datei als Script-Block wird der Inhalt danach
vom Browser ausgeführt. Hier wird dann die Funktion `getResults(..)` mit
den Daten aufgerufen. Diese befindet sich bereits von Beginn an in der
Seite und kann somit die Daten entgegennehmen und verarbeiten.\
Zum Speichern der Daten wird auf die gleiche Weise die folgende URL
eingebunden:\

    <script
     src="http://DB_SERVER/setscore.php?
       levname=Test&
       name=Name&
       score=0.02204&
       points=[[4,6],[12,4], ...]">
    </script>

Der Server bekommt über die URL die Daten übergeben. Eine Rückantwort an
die Anwendung wird hierbei nicht benötigt.\
Somit ist es möglich die Bestenliste unabhängig vom Speicherort
anzuzeigen, solange eine Internetverbindung besteht.

Algorithmen
===========

Test auf Kollinearität
----------------------

Ein sehr simples und essentielles Kriterium zur Überprüfung der
allgemeinen Lage von Punkten ist der Test auf Kollinearität. Im
speziellen ist hiermit der Fall von 3 oder mehr Punkten auf einer
Geraden gemeint. Leider konnten wir dieses Problem von algorithmischer
Seite nicht über eine Brute Force Lösung hinaus verbessern, wir vermuten
allerdings, dass sich die Lösung bis auf hilfreiche Heuristiken und
Verbesserungen der Implementierung auch nur schwer verbessern ließe. So
müssen alle 3-Untermengen der Punktmenge gesondert auf Kollinearität
überprüft werden, die dafür im wesentlichen benötigte Funktion ist
.contains(pt) (siehe Kantenfunktionen). Um Ungenauigkeiten zu vermeiden
wurde eine Kante aus den beiden am weitesten auseinander liegenden
Punkten generiert und überprüft ob sich der dritte Punkt auf dieser
befindet, ist somit der dritte Punkt.

Berechnung der Schnittpunkte/ kleinster Abstand
-----------------------------------------------

Ein wichtiger Algorithmus ist der zur Bestimmung von Schnittpunkten von
Kanten, da unser primärer Algorithmus zur Bewertung der Punktlage  – der
Algorithmus zur Bestimmung der kürzesten Distanz von einem Punkt zu
einer Kante  – auf diesen fusst.\
Wieder überzeugte die "brute force" Lösung, durch ihre einfache
Implementierung und Robustheit. Die Performanz ist ebenfalls akzeptabel,
was darin begründet ist, dass die betrachtete Anzahl an Elementen
überschaubar blieb. Die Vorgehensweise ist hierbei wie folgt:\
Es werden alle Paare von Kanten auf Schnittpunkte überprüft. Von allen
Punkten (Graphenknoten sowie gefundene Schnittpunkte) wird der Abstand
zu allen nichtinzidenten Kanten errechnet. Der kürzeste Abstand wird als
Ergebnis zurückgeliefert.\
Ist $n$ die Anzahl der Knoten, $m$ die Anzahl der Kanten, so ist die
Anzahl der Schnittpunkte beschränkt durch $\mathcal{O}(m^2)$. Die
Gesamtlaufzeit ist somit beschränkt durch $\mathcal{O}((n+m^2)m)$ also
Kubisch in der Kantenanzahl.

Punkte befinden sich auf Kreis
------------------------------

Ein weiteres Kriterium für die Bewertung der allgemeinen Lage von
Punkten, welches im Rahmen dieses Projekts umgesetzt wurde, besteht
darin zu berechnen, ob mehr als drei Punkte auf einem Kreis liegen. Da
drei Punkte immer auf einem Kreis liegen ist hierdurch noch keine
Besonderheit gegeben, was die Lage der Punkte im Koordinatensystem
anbelangt. Da mehr als drei Punkte jedoch nicht immer zwingend auf einem
Kreis liegen müssen, kann eine solche Anordnung so als Sonderfall
betrachtet werden, die einer allgemeinen Lage der Punkte wiederspricht.\
Um dieses Kriterium zu betrachten wurde kein mathematischer Ansatz
gewählt, der auf der Berechnung von Kreisgleichungen basiert, sondern
eher ein grafischer. Dieser soll im Folgenden genauer erläutert werden.\
Um zu untersuchen, ob verschiedene Punkte auf einem Kreis liegen könnte
ein Ansatz darin bestehen viele Kreise mit verschiedenen Radien und
Positionen durchzuprobieren und jedes Mal zu zählen, wie viele Punkte
sich auf einem solchen Kreis befinden. Dabei würde es jedoch eine große
Anzahl an Kreisen geben, auf denen sich gar keine der Punkte befinden
und die somit umsonst betrachtet werden würden.\
Aus diesem Grund wurde hier der genau umgekehrte Ansatz gewählt die
Kreise mit verschiedenen Radien um die Punkte selber zu ziehen und dann
zu schauen, wie viele der Kreise sich im selben Schnittpunkt treffen.
Gibt es einen Schnittpunkt in dem sich zum Beispiel vier Kreise treffen,
dann bedeutet dies, dass sich um diesen Schnittpunkt ein Kreis mit dem
gleichen Radius ziehen lässt, der dann wiederum genau diese vier Punkte
schneidet.

[h] ![image](Bilder/kreise) [img:kreise]

Es muss somit also nur geschaut werden, ob es bei verschiedenen Radien
Schnittpunkte gibt, in denen sich mehr als drei Kreise treffen. Die
jeweiligen Schnittpunkte und Radien werden dann vom Algorithmus
zurückgegeben und grafisch dargestellt.\
Der Algorithmus erstellt hierfür zunächst ein Array, welches von den
Proportionen der Größe des Sichtbereiches entspricht. Die Kreise werden
dann diskretisiert um die jeweiligen Punkte in das Array übertragen. Die
Punkte sind hierbei vorher ebenfalls diskretisiert und auf die Größe des
Arrays angepasst worden.\
Die Kreise werden nicht einfach nur „gezeichnet“, sondern es wird im
Array, welches vom Typ Integer ist, an jeder Position an der sich der
Kreis befindet um Eins inkrementiert. Ein Kreis ist also zunächst durch
eine diskrete Anordnung von Einsen im Array dargestellt. Wird nun ein
Kreis um einen weiteren Punkt eingezeichnet, der mit dem vorherigen
Kreis einen Schnittpunkt hat, so ergibt sich an dem Schnittpunkt im
Array ein Wert von Zwei. Sind alle Kreise eingezeichnet worden muss so
am Ende nur im Array nach allen Werten gesucht werden, die größer als
drei sind. Hier befindet sich ein Schnittpunkt von mehr als drei Kreisen
mit dem betrachteten Radius.

[h] ![image](Bilder/diskret) [img:diskret]

Die Genauigkeit mit der die Punkte auf einem Kreis liegen lassen sich im
Algorithmus über die Größe des Arrays bestimmen. Je größer das Array,
desto genauer liegen die Punkte am Ende auf dem Kreis. Hier wurde eine
relativ kleine Größe des Array gewählt, sodass Punkte auch dann als auf
dem Kreis liegend bewertet werden, wenn sie sich etwas daneben
befinden.\
Als Score ließe sich hier der Abstand der Punkte zu einer möglichen Lage
auf einem Kreis angeben. In diesem Projekt wurde jedoch nur überprüft,
ob sich mehr als drei Punkte mit einer gewissen Unschärfe auf einem
Kreis befinden.

9 **Most General Position**\
Rote, G.; Kyncl, J.; Pilz, A.; Schulz, A. (2012): Most General Position,
Freie Universität Berlin
(http://page.mi.fu-berlin.de/rote/Papers/slides/Most+general+position-MDS-Berlin-2012.pdf)

**JSXGraph**\
http://jsxgraph.uni-bayreuth.de

**Bootstrap**\
https://github.com/twitter/bootstrap

**Projekt Repository**\
https://github.com/nbbl/nbbl.github.com

[^1]: $\binom{V}{2}$ soll hierbei das Mengensystem aller Teilmengen von
    $V$ mit Kardinalität $2$ darstellen.
