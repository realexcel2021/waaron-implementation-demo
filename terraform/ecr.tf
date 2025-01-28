data "aws_caller_identity" "data" {
}

resource "aws_ecr_repository" "waiting_room_frontend_repo" {
    name = "waiting-room-frontend-repo"
}

resource "aws_ecr_repository" "waiting_room_backend_repo" {
    name = "waiting-room-backend-repo"
}

resource "docker_image" "waiting_room_frontend" {
  name = "${aws_ecr_repository.waiting_room_frontend_repo.repository_url}"
    build {
    context = "../src/waaron-vwr-api/"
  }
}

resource "docker_registry_image" "waiting_room_frontend" {
    name         = "${aws_ecr_repository.waiting_room_frontend_repo.repository_url}:latest"
    depends_on   = [aws_ecr_repository.waiting_room_frontend_repo, docker_image.waiting_room_frontend]  
}

resource "docker_image" "waiting_room_backend" {
  name = "${aws_ecr_repository.waiting_room_backend_repo.repository_url}"
    build {
    context = "../src/waiting-room-demo/"
  }
}

resource "docker_registry_image" "waiting_room_backend" {
    name         = "${aws_ecr_repository.waiting_room_backend_repo.repository_url}:latest"
    depends_on   = [aws_ecr_repository.waiting_room_backend_repo, docker_image.waiting_room_backend]  
}