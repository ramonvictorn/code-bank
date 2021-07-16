package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/ramonvictorn/code-bank/infrastructure/grpc/server"
	"github.com/ramonvictorn/code-bank/infrastructure/kafka"
	"github.com/ramonvictorn/code-bank/infrastructure/repository"
	"github.com/ramonvictorn/code-bank/usecase"
)

func main() {

	fmt.Println("Starting app...")
	db := setupDb()
	defer db.Close()

	producer := setupKafkaProducer()
	processTransactionUseCase := setupTransactionUseCase(db, producer)
	fmt.Println("Starting GRPC server...")
	serveGrpc(processTransactionUseCase)
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

func init() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println(err)
		log.Fatal("error loading .env file")
	}
}

func setupKafkaProducer() kafka.KafkaProducer {
	producer := kafka.NewKafkaProducer()
	producer.SetupProducer(os.Getenv("KafkaBootstrapServers"))
	return producer
}

func setupTransactionUseCase(db *sql.DB, producer kafka.KafkaProducer) usecase.UseCaseTransaction {
	transactionRepository := repository.NewTransactionRepository(db)
	useCase := usecase.NewUseCaseTransaction(transactionRepository)
	useCase.KafkaProducer = producer
	return useCase
}

func setupDb() *sql.DB {
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("host"),
		os.Getenv("port"),
		os.Getenv("user"),
		os.Getenv("password"),
		os.Getenv("dbname"),
	)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		fmt.Println(err)
		log.Fatal("Error on connect with database")
	}

	return db
}

func serveGrpc(processTransactionUseCase usecase.UseCaseTransaction) {
	grpcServer := server.NewGRPCServer()
	grpcServer.ProcessTransactionUseCase = processTransactionUseCase
	grpcServer.Server()
}
