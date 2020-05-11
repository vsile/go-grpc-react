package main

import (
	"context"
	"log"
	"fmt"
	"os"

	"google.golang.org/grpc"
	pb "./gis"
)

func main() {
	// Set up a connection to the server.
	conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("Did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewMainProtoClient(conn)

	// Contact the server and print out its response.
	name := "500TT51"
	if len(os.Args) > 1 {
		name = os.Args[1]
	}
	r, err := c.GetInfo(context.Background(), &pb.ClientRequest{VendorCode: name})
	if err != nil {
		log.Fatalf("Error on GetInfo: %v", err)
	}
	fmt.Printf("ID: %s\nVendorCode: %s\nManufacturerId: %d\n", r.GetId(), r.GetVendorCode(), r.GetManufacturerId())
}
