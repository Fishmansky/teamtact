package main

import (
	"context"
	"database/sql"
	"log"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	_ "github.com/lib/pq"

	"github.com/joho/godotenv"
)

type Worker struct {
	ID    int    `json:"id"`
	Fname string `json:"fname"`
	Sname string `json:"sname"`
}

type DayOff struct {
	ID       int       `json:"id"`
	WorkerID int       `json:"worker_id"`
	DateTime time.Time `json:"date_off"`
}

type WorkDay struct {
	ID        int       `json:"id"`
	DateTime  time.Time `json:"date"`
	WorkerID  int       `json:"worker_id"`
	WorkStart time.Time `json:"work_start"`
	WorkStop  time.Time `json:"work_stop"`
}

type Plan struct {
	ID       int       `json:"id"`
	WorkDays []WorkDay `json:"workday_id"`
}

var Tables = []string{"Workers", "DayOffs", "WorkDays", "Plans"}

var DB *sql.DB

func DBconnect() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file")
	}
	connStr := os.Getenv("DBCONN")
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	if err = DB.Ping(); err != nil {
		log.Fatal(err)
	}
}

func CreateTable(t string) {
	switch t {
	case "Workers":
		DB.Exec("CREATE TABLE Workers ( ID SERIAL PRIMARY KEY, Fname VARCHAR(100) NOT NULL, Sname VARCHAR(100) NOT NULL );")
	case "DayOffs":
		DB.Exec("CREATE TABLE DayOffs ( ID SERIAL PRIMARY KEY, WorkerID INT NOT NULL, DateTime TIMESTAMP NOT NULL, FOREIGN KEY (WorkerID) REFERENCES Workers(ID) );")
	case "WorkDays":
		DB.Exec("CREATE TABLE WorkDays ( ID SERIAL PRIMARY KEY, DateTime DATE NOT NULL, WorkerID INT NOT NULL, WorkStart TIMESTAMP NOT NULL, WorkStop TIMESTAMP NOT NULL, FOREIGN KEY (WorkerID) REFERENCES Workers(ID) );")
	case "Plans":
		DB.Exec("CREATE TABLE Plans ( ID SERIAL PRIMARY KEY, WorkDayID INT NOT NULL, FOREIGN KEY (WorkDayID) REFERENCES WorkDays(ID));")
	}
}

func TableExist(table string) bool {
	var exists bool
	if err := DB.QueryRow("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1 )", table).Scan(&exists); err != nil {
		if err == sql.ErrNoRows {
			return false
		}
		log.Println(err)
	}
	return exists
}

func DBInit() {
	DBconnect()
	for _, table := range Tables {
		if !TableExist(table) {
			CreateTable(table)
		}
	}
}

type jsonError struct {
	Status int    `json:"status"`
	Error  string `json:"error"`
}

func NewjsonError(s string) jsonError {
	return jsonError{Error: s, Status: 0}
}

type jsonMessage struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
}

func NewjsonMessage(s string) jsonMessage {
	return jsonMessage{Message: s, Status: 1}
}

func getWorkers(c echo.Context) error {
	var workers []Worker
	rows, err := DB.Query("SELECT * FROM workers")
	if err != nil {
		return err
	}
	defer rows.Close()
	for rows.Next() {
		var worker Worker
		err := rows.Scan(&worker.ID, &worker.Fname, &worker.Sname)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, NewjsonError("Pobieranie danych pracownika nie powiodło się"))
		}
		workers = append(workers, worker)
	}
	return c.JSON(http.StatusOK, workers)
}

func getWorker(c echo.Context) error {
	id := c.Param("id")
	var worker Worker
	if err := DB.QueryRow("SELECT * FROM workers WHERE id = $1", id).Scan(&worker.ID, &worker.Fname, &worker.Sname); err != nil {
		if err == sql.ErrNoRows {
			return c.JSON(http.StatusInternalServerError, NewjsonError("Nie znaleziono pracownika"))
		}
		return c.JSON(http.StatusInternalServerError, NewjsonError("Pobieranie danych pracownika nie powiodło się"))
	}
	return c.JSON(http.StatusOK, worker)
}

func editWorker(c echo.Context) error {
	id := c.Param("id")
	var worker Worker
	err := c.Bind(&worker)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Bad request")
	}
	_, err = DB.Exec("UPDATE workers SET fname = $1, sname = $2 WHERE id = $3", worker.Fname, worker.Sname, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, NewjsonError("Aktualizacja danych pracownika nie powiodła się"))
	}
	return c.JSON(http.StatusOK, NewjsonMessage("Zaktualizowano dane pracownika"))
}

func removeWorker(c echo.Context) error {
	id := c.Param("id")
	_, err := DB.Exec("DELETE FROM workers WHERE id = $1", id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, NewjsonError("Usuwanie pracownika nie powiodło się"))
	}
	return c.JSON(http.StatusOK, NewjsonMessage("Usunięto pracownika"))
}

func addWorker(c echo.Context) error {
	var worker Worker
	err := c.Bind(&worker)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Bad request")
	}
	_, err = DB.Exec("INSERT INTO workers (fname, sname) VALUES ($1, $2)", worker.Fname, worker.Sname)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, NewjsonError("Dodanie pracownika nie powiodło się"))
	}
	return c.JSON(http.StatusOK, NewjsonMessage("Dodano pracownika"))
}

func main() {
	DBInit()
	e := echo.New()
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
		LogStatus:   true,
		LogURI:      true,
		LogError:    true,
		HandleError: true, // forwards error to the global error handler, so it can decide appropriate status code
		LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
			if v.Error == nil {
				logger.LogAttrs(context.Background(), slog.LevelInfo, "REQUEST",
					slog.String("uri", v.URI),
					slog.Int("status", v.Status),
				)
			} else {
				logger.LogAttrs(context.Background(), slog.LevelError, "REQUEST_ERROR",
					slog.String("uri", v.URI),
					slog.Int("status", v.Status),
					slog.String("err", v.Error.Error()),
				)
			}
			return nil
		},
	}))
	e.Static("/", "../src/dist")
	e.GET("/api/workers", getWorkers)
	e.GET("/api/worker/:id", getWorker)
	e.PUT("/api/worker/:id", editWorker)
	e.DELETE("/api/worker/:id", removeWorker)
	e.POST("/api/worker", addWorker)
	e.Logger.Fatal(e.Start(":8080"))
}
