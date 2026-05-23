terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

# Simulación de una VPC para la aplicación Mamays
resource "aws_vpc" "mamays_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "mamays-vpc"
  }
}

# Subred pública
resource "aws_subnet" "mamays_subnet" {
  vpc_id                  = aws_vpc.mamays_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.region}a"

  tags = {
    Name = "mamays-public-subnet"
  }
}
