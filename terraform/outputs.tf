output "vpc_id" {
  value = aws_vpc.mamays_vpc.id
}

output "subnet_id" {
  value = aws_subnet.mamays_subnet.id
}
