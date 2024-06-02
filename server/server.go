package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/labstack/echo/v4"
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
	log.Printf("%s: Table %s created", time.Now(), t)
}

func TableDoesntExist(table string) bool {
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
		if TableDoesntExist(table) {
			CreateTable(table)
		}
	}
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
			return c.JSON(http.StatusInternalServerError, "Workers data fetch error")
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
			return c.JSON(http.StatusInternalServerError, "Worker not found")
		}
		return c.JSON(http.StatusInternalServerError, "Worker data fetch error")
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
		return c.JSON(http.StatusInternalServerError, "Worker data update error")
	}
	return c.JSON(http.StatusOK, "Worker data updated")
}

func removeWorker(c echo.Context) error {
	id := c.Param("id")
	_, err := DB.Exec("DELETE FROM workers WHERE id = $1", id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Removig worker error")
	}
	return c.JSON(http.StatusOK, "Worker removed")
}

func addWorker(c echo.Context) error {
	var worker Worker
	err := c.Bind(&worker)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Bad request")
	}
	_, err = DB.Exec("INSERT INTO workers (fname, sname) VALUES ($1, $2)", worker.Fname, worker.Sname)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Data inserting error")
	}
	return c.JSON(http.StatusOK, "Worker added")
}

func main() {
	DBInit()
	e := echo.New()
	e.Static("/", "../src/dist")
	e.GET("/workers", getWorkers)
	e.GET("/worker/:id", getWorker)
	e.PUT("/worker/:id", editWorker)
	e.DELETE("/worker/:id", removeWorker)
	e.POST("/worker", addWorker)
	e.Logger.Fatal(e.Start(":8080"))
}
