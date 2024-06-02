# TeamTact

## Views
1. /plan - Główna - grafik miesięczny (pogląd i edycja grafiku zespołu w wybranym dniu)
2. /workers - Lista pracowników (edycja zespołu, wyświetlanie przepracowanych godzin pracowników)
3. /worker/:id - Edycja pracownika (edycja danych, ustalanie dni wolnych)

## Endpoints

1. /plan        [GET] - get monthly plan

2. /workers     [GET] - get all workers data
```bash
curl -X GET "localhost:8080/workers"
[{"id":7,"fname":"John","sname":"test"},{"id":8,"fname":"John","sname":"test1"},{"id":9,"fname":"John","sname":"test2"},{"id":10,"fname":"John","sname":"test3"}]
```

3. /worker/:id  [GET] - get specific worker data
```bash
curl -X GET "localhost:8080/worker/9"
{"id":9,"fname":"John","sname":"test2"}
```

4. /worker/:id  [PUT]- edycja pracownika
```bash
curl -H "Content-Type: application/json" -X PUT "http://localhost:8080/worker/9" -d '{"fname": "Johny", "sname": "test"}'
"Worker data updated"
```

5. /worker      [POST] - dodanie pracownika
```bash
curl -H "Content-Type: application/json" -X POST "http://localhost:8080/worker" -d '{"fname": "John", "sname": "test2"}'
"Worker added"
```

6. /worker/:id  [DELETE]- usunięcie pracownika
```bash
curl -H "Content-Type: application/json" -X DELETE "http://localhost:8080/worker/1"
"Worker removed"
```


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
