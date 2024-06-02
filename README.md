# TeamTact

## Views
1. /plan - Główna - grafik miesięczny (pogląd i edycja grafiku zespołu w wybranym dniu)
2. /workers - Lista pracowników (edycja zespołu, wyświetlanie przepracowanych godzin pracowników)
3. /worker/:id - Edycja pracownika (edycja danych, ustalanie dni wolnych)

## Endpoints

1. /plan        [GET] - get monthly plan
2. /workers     [GET] - get all workers data
3. /worker/:id  [GET] - get specific worker data
4. /worker/:id  [PUT]- edycja pracownika
5. /worker      [POST] - dodanie pracownika
6. /worker/:id  [DELETE]- usunięcie pracownika 


### DB Tables

1. Worker
ID int
fname string
sname string

2. WorkingDay
ID int
datetime datetime
plan JSON {
    Worker
    WorkStart datetime
    WorkStop  datetime
}
    
3. DayOffs
ID int
workerID int -> Worker.ID
datetime datetime
