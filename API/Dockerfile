# Stage 1: Build environment
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
# Set the working directory within the container to /app
WORKDIR /app
# Copy the project file(s) to the container root
COPY *.csproj ./
# Restore the dependencies using the dotnet restore command
RUN dotnet restore

# Copy the remaining source code to the container
COPY . ./
# Build the application using the dotnet publish command, specifying the configuration and output directory
RUN dotnet publish -c Release -o out

# Stage 2: Runtime environment
FROM mcr.microsoft.com/dotnet/aspnet:8.0
# Set the working directory within the container to /app
WORKDIR /app
# Copy the published output from the build environment to the runtime environment
COPY --from=build-env /app/out .

# Set the environment variable for ASP.NET Core
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose the port your application will run on
EXPOSE 80

# Set the entry point for the container to run the application when started
ENTRYPOINT ["dotnet", "API.dll"]