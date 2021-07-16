package server

import (
	"fmt"
	"log"
	"net"

	"github.com/ramonvictorn/code-bank/infrastructure/grpc/pb"
	"github.com/ramonvictorn/code-bank/infrastructure/grpc/service"
	"github.com/ramonvictorn/code-bank/usecase"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

type GRPCServer struct {
	ProcessTransactionUseCase usecase.UseCaseTransaction
}

func NewGRPCServer() GRPCServer {
	return GRPCServer{}
}

func (server GRPCServer) Server() {
	listener, err := net.Listen("tcp", "0.0.0.0:50052")
	if err != nil {
		fmt.Print(err)
		log.Fatal("Erro on start GRPC server")
	}

	transactionService := service.NewTransactionService()
	transactionService.ProcessTransactionUseCase = server.ProcessTransactionUseCase

	grpcServer := grpc.NewServer()
	reflection.Register(grpcServer)
	pb.RegisterPaymentServiceServer(grpcServer, transactionService)
	grpcServer.Serve(listener)
}
