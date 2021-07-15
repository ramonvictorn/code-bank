package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
	"github.com/ramonvictorn/code-bank/infrastructure/repository"
	"github.com/ramonvictorn/code-bank/usecase"
)

func main() {
	fmt.Println("Starting app...")
	db := setupDb()
	defer db.Close()

	// cc := domain.NewCreditCard()
	// cc.Number = "2332323232"
	// cc.Name = "Ramon"
	// cc.ExpirationYear = 2024
	// cc.ExpirationMonth = 6
	// cc.CVV = 124
	// cc.Limit = 1000
	// cc.Balance = 0

	// repo := repository.NewTransactionRepository(db)
	// repo.CreateCreditCard(*cc)

}

func setupTransactionUseCase(db *sql.DB) usecase.UseCaseTransaction {
	transactionRepository := repository.NewTransactionRepository(db)
	useCase := usecase.NewUseCaseTransaction(transactionRepository)

	return useCase
}

func setupDb() *sql.DB {
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		"db",
		"5432",
		"postgres",
		"root",
		"codebank",
	)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		fmt.Println(err)
		log.Fatal("Error on connect with database")
	}

	return db
}
