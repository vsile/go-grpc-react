package main

import (
	"os"
	"log"
	"fmt"
	"net"
	"time"
	"context"
	"reflect"

	pb "./gis"
	"google.golang.org/grpc"

	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
	"github.com/golang/protobuf/ptypes"
)

// server is used to implement gis.MainProtoServer.
type server struct {
	pb.UnimplementedMainProtoServer
	Collection	*mgo.Collection	// Добавляем поле для подключения к базе данных
}

type part struct {
	Id				bson.ObjectId	`_id`
	ManufacturerId	int32			`manufacturer_id`
	VendorCode		string			`vendor_code`
	CreatedAt		time.Time		`created_at`
	DeletedAt		time.Time		`deleted_at`
}

// GetInfo implements gis.MainProtoServer
func (s *server) GetRecords(ctx context.Context, in *pb.Empty) (*pb.ServerReplyList, error) {
	// Получаем из коллекции ga_parts записи
	data := []*pb.ServerReply{}
	iter := s.Collection.Find(nil).Iter()
	item := part{}
	for iter.Next(&item) {
		createdAt, _ := ptypes.TimestampProto(item.CreatedAt)
		deletedAt, _ := ptypes.TimestampProto(item.DeletedAt)
		data = append(data, &pb.ServerReply{
			Id: item.Id.Hex(),
			ManufacturerId: item.ManufacturerId,
			VendorCode: item.VendorCode,
			CreatedAt: createdAt,
			DeletedAt: deletedAt,
		})
	}
	return &pb.ServerReplyList{
		Records: data,
	}, nil
}

// AddRecord implements gis.MainProtoServer
func (s *server) AddRecord(ctx context.Context, in *pb.Empty) (*pb.ServerReply, error) {
	newId := bson.NewObjectId()	// Создаем новый идентификатор
	now := time.Now()
	// Вставляем новую запись в коллекцию "ga_parts"
	err := s.Collection.Insert(bson.M{
		"_id": newId,
		"created_at": now,
	})
	if err != nil {
		return &pb.ServerReply{}, err
	}
	protoNow, _ := ptypes.TimestampProto(now)
	return &pb.ServerReply{
		Id: newId.Hex(),
		CreatedAt: protoNow,
	}, nil
}

// RemoveRecord implements gis.MainProtoServer
func (s *server) RemoveRecord(ctx context.Context, in *pb.ClientRequest) (*pb.Empty, error) {
	// Если пришел невалидный идентификатор, возвращаем ошибку
	if !bson.IsObjectIdHex(in.GetId()) {
		return &pb.Empty{}, fmt.Errorf("%q is not ObjectIdHex", in.GetId())
	}
	id := bson.ObjectIdHex(in.GetId())
	// Удаляем запись из коллекции "ga_parts"
	err := s.Collection.RemoveId(id)
	if err != nil {
		return &pb.Empty{}, err
	}
	return &pb.Empty{}, nil
}

// UpdateRecord implements gis.MainProtoServer
func (s *server) UpdateRecord(ctx context.Context, in *pb.ClientRequest) (*pb.Empty, error) {
	// Если пришел невалидный идентификатор, возвращаем ошибку
	if !bson.IsObjectIdHex(in.GetId()) {
		return &pb.Empty{}, fmt.Errorf("%q is not ObjectIdHex", in.GetId())
	}
	id := bson.ObjectIdHex(in.GetId())
	field := in.GetField()
	value := reflect.ValueOf(in).MethodByName("Get"+in.GetMethod()).Call(nil)[0].Interface()
	// Редактируем запись в коллекции "ga_parts"
	err := s.Collection.UpdateId(id, bson.M{
		"$set": bson.M{field: value},
	})
	if err != nil {
		fmt.Println(err);
		return &pb.Empty{}, err
	}
	return &pb.Empty{}, nil
}

func main() {
	// Подключаемся к базе данных MongoDB
	if len(os.Args) < 2 {
		log.Fatal("Please specify MongoDB IP at the first argument: localhost or 172.18.0.5")
	}
	session, err := mgo.Dial(os.Args[1])
	if err != nil {
		log.Fatal(err)
	}
	defer session.Close()
	c := session.DB("local").C("ga_parts")

	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	log.Println("Server is listening on port 50051")
	s := grpc.NewServer()
	pb.RegisterMainProtoServer(s, &server{Collection: c})	// Регистрируем сервер с доступом к базе данных
	if err := s.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
