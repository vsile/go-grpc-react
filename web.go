package main

import (
	"os"
	"log"
	"time"
	"net/http"
	"html/template"

	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
)

type part struct {
	Id				bson.ObjectId	`_id`
	ManufacturerId	int				`manufacturer_id`
	VendorCode		string			`vendor_code`
	CreatedAt		time.Time		`created_at`
	DeletedAt		time.Time		`deleted_at`
}

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)	// Добавляем в лог номер строки
	const dir string = "web"						// Путь к рабочей папке

	if len(os.Args) < 2 {
		log.Fatal("Please specify MongoDB IP at the first argument: localhost or 172.18.0.5")
	}
	// Подключаемся к базе данных MongoDB
	session, err := mgo.Dial(os.Args[1])
	if err != nil {
		log.Fatal(err)
	}
	defer session.Close()
	c := session.DB("local").C("ga_parts")

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		t, err := template.ParseFiles(dir+"/index.html")
		if err != nil {
			log.Println(err)
			return
		}
		// Получаем из коллекции ga_parts записи
		data := []part{}
		err = c.Find(nil).All(&data)
		if err != nil {
			log.Println(err)
		}

		t.Execute(w, data)
	})
	http.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {}) // Чтобы Chrome запускал сайт 1 раз

	http.Handle("/js/", http.FileServer(http.Dir(dir)))
	http.Handle("/css/", http.FileServer(http.Dir(dir)))
	http.Handle("/src/", http.FileServer(http.Dir(dir)))

	log.Println("Веб-сервер успешно запущен на порту 8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
