# WAARON LLC Virtual Waiting Room Demo

This project is a demonstration of the WAARON LLC Virtual Waiting Room solution. It showcases how to integrate the solution into a functional React.js frontend and FastAPI backend application. The sample application is deployed using Amazon ECS and Terraform for Infrastructure as Code (IaC).

## Project Structure

- **src/waiting-room-demo/**: Contains the React.js frontend application.
- **src/waaron-vwr-api/**: Contains the FastAPI backend application.
- **terraform/**: Contains the Terraform code for deploying the application.

## Prerequisites

- Docker installed and running on your host machine.
- AWS CLI configured with appropriate permissions.
- Terraform installed.

## Getting Started


### Applying Terraform Code

Navigate to the `terraform/` directory and run the following commands to deploy the application using Terraform ensure that you have docker running before executing this:

```sh
cd terraform
terraform init
terraform apply
```

Follow the prompts to confirm the deployment.

## Accessing the Application

Once the deployment is complete, you can access the application using the URL provided by the Terraform output.

## Cleaning Up

To destroy the deployed resources, run the following command in the `terraform/` directory:

```sh
terraform destroy
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
### Note

There is no need to manually build the Docker images using `docker-compose build`. The Terraform configuration will handle building the Docker images when you execute `terraform apply`. Just ensure that Docker is installed and running on your host machine.