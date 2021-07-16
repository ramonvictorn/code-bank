package kafka

import ckafka "github.com/confluentinc/confluent-kafka-go/kafka"

type KafkaProducer struct {
	Producer *ckafka.Producer
}

func NewKafkaProducer() KafkaProducer {
	return KafkaProducer{}
}

func (kafkaProd *KafkaProducer) SetupProducer(bootstrapServer string) {
	configMap := &ckafka.ConfigMap{
		"bootstrap.servers": bootstrapServer,
	}

	kafkaProd.Producer, _ = ckafka.NewProducer(configMap)
}

func (kafkaProd *KafkaProducer) Publish(msg string, topic string) error {
	message := &ckafka.Message{
		TopicPartition: ckafka.TopicPartition{Topic: &topic, Partition: ckafka.PartitionAny},
		Value:          []byte(msg),
	}

	err := kafkaProd.Producer.Produce(message, nil)
	if err != nil {
		return err
	}

	return nil
}
