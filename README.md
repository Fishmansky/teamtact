# TeamTact

Team work scheduler

## Views
1. /plan - plan view
2. /workers - workers list view
3. /worker/:id - worker view

## Endpoints

1. `/plan`        [GET] - get monthly plan

2. `/workers`     [GET] - get all workers data
```bash
curl -X GET "localhost:8080/workers"
[{"id":7,"fname":"John","sname":"test"},{"id":8,"fname":"John","sname":"test1"},{"id":9,"fname":"John","sname":"test2"},{"id":10,"fname":"John","sname":"test3"}]
```

3. `/worker/:id`  [GET] - get specific worker data
```bash
curl -X GET "localhost:8080/worker/9"
{"id":9,"fname":"John","sname":"test2"}
```

4. `/worker/:id`  [PUT]- edycja pracownika
```bash
curl -H "Content-Type: application/json" -X PUT "http://localhost:8080/worker/9" -d '{"fname": "Johny", "sname": "test"}'
"Worker data updated"
```

5. `/worker`      [POST] - dodanie pracownika
```bash
curl -H "Content-Type: application/json" -X POST "http://localhost:8080/worker" -d '{"fname": "John", "sname": "test2"}'
"Worker added"
```

6. `/worker/:id`  [DELETE]- usunięcie pracownika
```bash
curl -H "Content-Type: application/json" -X DELETE "http://localhost:8080/worker/1"
"Worker removed"
```