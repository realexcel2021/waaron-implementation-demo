# tls self certificate

resource "tls_private_key" "example" {
  algorithm = "RSA"
}

resource "tls_self_signed_cert" "example" {
  #key_algorithm   = "RSA"
  private_key_pem = tls_private_key.example.private_key_pem

  subject {
    common_name  = module.alb.dns_name
    organization = "ACME Examples, Inc"
  }

  validity_period_hours = 48

  allowed_uses = [
    "key_encipherment",
    "digital_signature",
    "server_auth",
  ]
}

resource "aws_acm_certificate" "cert" {
  private_key      = tls_private_key.example.private_key_pem
  certificate_body = tls_self_signed_cert.example.cert_pem
}


module "alb" {
  source = "./modules/alb"

  name    = "fastAPI-LB"
  vpc_id  = module.vpc.vpc_id
  subnets = module.vpc.public_subnets
  enable_deletion_protection = false
  

  # Security Group
  security_group_ingress_rules = {
    all_http = {
      from_port   = 80
      to_port     = 80
      ip_protocol = "tcp"
      description = "HTTP web traffic"
      cidr_ipv4   = "0.0.0.0/0"
    }
    all_https = {
      from_port   = 443
      to_port     = 443
      ip_protocol = "tcp"
      description = "HTTPS web traffic"
      cidr_ipv4   = "0.0.0.0/0"
    }
  }
  security_group_egress_rules = {
    all = {
      ip_protocol = "-1"
      cidr_ipv4   = "10.0.0.0/16"
    }
  }


  listeners = {
    ex-tcp = {
      port     = 80
      protocol = "HTTP" 
      forward = {
        target_group_key = "ecs-tasks"
      }
    }

  }

  target_groups = {
    ecs-tasks = {
      name_prefix = "ui"
      protocol         = "HTTP"
      port             = 3000
      target_type      = "ip"
      create_attachment = false

        health_check = {
            enabled             = true
            interval            = 30
            path                = "/"
            port                = "3000"
            healthy_threshold   = 3
            unhealthy_threshold = 5
            timeout             = 20
            protocol            = "HTTP"
            matcher             = "200-399"
      }
    }
  }


}

# API Load Balancer
module "api_alb" {
  source = "./modules/alb"

  name = "api-alb"

  load_balancer_type = "application"
  vpc_id             = module.vpc.vpc_id
  subnets            = module.vpc.public_subnets
  security_groups    = [aws_security_group.api_alb.id]
  enable_deletion_protection = false

  target_groups = {
    api-tasks = {
      name_prefix      = "api-"
      protocol = "HTTP"
      port     = 8000
      target_type      = "ip"
      create_attachment = false
      health_check = {
        enabled             = true
        interval            = 30
        path               = "/health"
        port               = "traffic-port"
        healthy_threshold   = 3
        unhealthy_threshold = 5
        timeout            = 20
        protocol           = "HTTP"
        matcher            = "200-399"
      }
    }
  }


  listeners = {
    ex-tcp = {
      port     = 80
      protocol = "HTTP" 
      forward = {
        target_group_key = "api-tasks"
      }
    }

  }

  tags = {
    Environment = "dev"
  }
}

# Security group for API ALB
resource "aws_security_group" "api_alb" {
  name        = "api-alb-sg"
  description = "Security group for API ALB"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "api-alb-sg"
  }
}