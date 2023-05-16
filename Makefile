SHELL = /bin/bash

# Load the .env file and export variables
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

show-env:
	@echo "Build script for EXTENSION_NAME: ${EXTENSION_NAME}"

build-all:
	if [ -f ./build/build_core.sh ]; then \
		./build/build_core.sh; \
	else \
		npm run build; \
	fi;

test:
	./library/vendor/bin/phpunit

rename-and-replace-once:
	./build/rename-and-replace_once.sh; \
	rm ./build/rename_once_folder.sh; \
	rm ./build/rename-and-replace_once.sh; \
	rm ./build/replace_once_folder.sh;

# ifeq ("${DD_AGENT_ENABLED}", "true")
# run-local:
# 	MAVEN_OPTS="-Ddd.profiling.enabled=false -Ddd.logs.injection=true -Ddd.trace.sample.rate=1 -Ddd.env=${SPRING_PROFILES_ACTIVE:-local} -Ddd.agent.host=${DD_AGENT_HOST:-localhost} -javaagent:/dd-java-agent.jar" ./mvnw spring-boot:run
# else
# run-local:
# 	./mvnw spring-boot:run
# endif

# # you can use this make target to pull dependencies after adding them to pom.xml
# get-deps:
# 	./mvnw dependency:resolve

# # print all maven properties set in pom.xml
# print-properties:
# 	./mvnw help:evaluate -Dexpression=project.properties

# style:
# #	./mvnw rewrite:run
# 	./mvnw spotless:apply
# 	./mvnw spotless:check
# 	./mvnw checkstyle:check

# check-style:
# 	./mvnw spotless:check && ./mvnw checkstyle:check

# # loads maven profile "unitTests", defined in master pom.xml file
# utest:
# 	./mvnw validate verify package -PunitTests

# # loads maven profile "integrationTests", defined in master pom.xml file
# itest:
# 	./mvnw validate verify package -PintegrationTests

# tests:
# 	./mvnw validate verify package

# check-analysis:
# 	./mvnw verify -PdependencyChecks

# check-pipeline: tests check-style check-analysis

# local-up:
# 	./local-environment/up_aws_environment.sh

# local-sqs-test:
# 	./local-environment/aws-sqs-send.sh
# 	./local-environment/aws-sqs-receive.sh

# local-down:
# 	./local-environment/down_aws_environment.sh

# console:
# 	./.devcontainer/console.sh
